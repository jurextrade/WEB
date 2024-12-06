
class emvproject {
    constructor (pname, name, path) {
        this.pname                   = pname; 
        this.Folder                  = path;    
        this.Name                    = name;
        this.Path                    = path;
        this.EMV                     = new emv()   
        this.Loaded                  = 0; 
        this.Server                 = solution.EMVRouter_Address;
        this.Port                   = solution.EMVRouter_Port;   
    
    }

    Create = function () {
        return SubmitProjectRequest(this.Folder, this.Name, '', 'php/create_project.php', SYNCHRONE);
    }

    Remove = function () {
        if (solution.UserId == "0") return;        
        return SubmitProjectRequest(this.Folder, this.Name, '', 'php/remove_project.php', SYNCHRONE);
    }

    Rename = function (newname) {
        if (solution.UserId == "0") return;        
   
        let content = JSON.stringify({name: newname, path: this.path}, null, 2)
        let user = solution.get('user')
        let rootproject = user.fileexplorer.Root + user.path + '/EMV/' + this.path + "/config/";        
       
        user.send ({Name: 'savefile', Values: [rootproject + 'emv.ini', content]}, true, 
                    function (content, values) {
                        DisplayOperation("Project Succesfully Renamed", true, 'operationpanel');                             
                    }, 
                    [this]);  
    }
    
    Save = function () {
        let cuser = solution.get('user')
        if (!cuser.is_registered()) {
            return;
        }
            
        let rootproject     = cuser.fileexplorer.Root + cuser.path + '/EMV/' + this.Folder + "/Files/";

        this.EMV.Save (rootproject + 'emvsolution.json');
        
    }
    Load = function () {
        let  site           = solution.get('site');        
        let  user           = solution.get('user')               
        
        let rootproject = site.address + user.path + '/EMV/' + this.Folder + "/Files/";

        this.EMV.Load (rootproject + 'emvsolution.json', ASYNCHRONE,  this.UpdateEMV, this);
       
    }

    UpdateEMV = function (response, par) {
        let project = par[0];
        project.EMV = JSON.parse(response)
        emv_update(project);
        project.Loaded = 1;    
    }
}

class emv_Settings {
    constructor () {
        this.appFiles = [];							            // Usually downloaded (see CB2A corresponding)
        this.appTags = [];							            // Card, issuer, terminal and appli Tags
        this.appApduErrors = [];                                //
        this.appSelectionUsePSE;					            // 1 - if use PSE, 0 - don't use PSE 
        this.appSelectionSupportConfirm;			            // 1 - if support cardholder confirmation of application, 0 - not support
        this.appSelectionPartial;					            // 1 - if support partial AID selection
        this.appSelectionSupport;					            // 1 - if the terminal supports the ability to allow the cardholder to select an application
    }
} 

 

//MESSAGECLASS SIT_D753 (
//    BYTE ParOpen 
//    CHAR[8] SystemAcceptationIdentification 
//    CHAR[14] SIRET 
//    CHAR[4] MerchantCategoryCode 
//    CHAR[20] MerchantContractNumber 
//    CHAR[20] TerminalIdentification 
//    CHAR[20] MerchantIdentifier 
//    CHAR[60] MerchantNameAndLocation 
//    CHAR[11] AcquirerIdentifier 
//    BYTE p 
//    BYTE p1 
//    BYTE ParClose 
//    BYTE[2] CR)
//8		ANS8	Type de site :caractérise le lieu de la transaction de paiement (codification SICB)
//14		N14	Identifiant d’un accepteur au niveau INSEE, Contrat commerçant : Merchant Identifier 9F16
//4		N4	Type d’activité commerciale accepteur :  Merchant Category Code 9F15
//20		ANS20	Numéro attribué par la banque acquéreur pour identifier un contrat accepteur : Acceptor Contract Number 9F25
//20		ANS20	"Donnée utilisée pour permettre au système acquéreur de gérer la donnée à positionner dans le champ 41 du protocole CB2A : Identification du système d'acceptation : Terminal Identification 9F1C"	
//20		ANS20	"Donnée utilisée pour permettre au système acquéreur de gérer la donnée à positionner dans le champ 42 du protocole CB2A : Identification de l'accepteur de carte :  Merchant Identifier 9F16"
//60		ANSC60	Enseigne d’un accepteur
//11		N11	Identification de l’établissement acquéreur (BDOM  / Acquirer Identifier 9F01)
//1		N1	Indique l’entité supportant les coûts télécoms X25 :  Appelé , Appelant
//1		N1	Précise si le système d’acceptation peut fonctionner en mode appelé : Désactivé, Activé

//EPV_D787;BYTE ParOpen CHAR[10] RID CHAR[22] PIX CHAR[4] ApplicationVersionNumber CHAR[2] Priority BYTE ForceTransaction BYTE ParClose BYTE[2] CR;Liste des donn้es sp้cifiques EMV par AID
class emv_Aid {
    constructor () {
        this.AID;							                    // BYTE Ex. {0xA0, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10} [16] //9F06     
        this.ApplicationVersionNumber = ''; 		            // BYTE Ex. {0x00, 0x8C}                                    //9F09   
	    this.Length;							                // int	 Length in bytes, Ex. 7
	    this.Priority;                                          //int	 

	    this.applicationSelectionIndicator = '';	            // char Application Selection Indicator, 0 - if application must match AID exactly, 1 - if allow partial
	    this.ForceTransaction = '';					            // BYTE Indicates if a transaction can be forced to accept by acceptor if refused by terminal
	    this.TerminalActionCodeDenial;      	                // BYTE Terminal Action Code - Denial [5];	
	    this.TerminalActionCodeOnline;      	                // BYTE Terminal Action Code - Online [5];	
	    this.TerminalActionCodeDefault;     	                // BYTE Terminal Action Code - Defaul [5];	
    }
} 

class emv_Application {
    constructor () {    
        this.AIDCount;								            // int		Count of AIDs in this configuration
        this.AID = [];								            // EMVAid	EMVAID of current configuration
        this.RID = ""								            // BYTE	Registered Application Provider Identifier, Ex. {0xA0, 0x00, 0x00, 0x00, 0x03}
        this.IndexAIDSelected;                                  //int		
        this.defaultDDOLSize;						            // int		Size in bytes of next element. 0 - if default DDOL is empty
        this.defaultDDOL = new Array(64);						// BYTE	data of default DDOL with size defaultDDOLSize
        this.defaultTDOLSize;						            // int		Size in bytes of next element. 0 - if default TDOL is empty
        this.defaultTDOL = new Array(64);						// BYTE	data of default TDOL with size defaultTDOLSize
        this.maxTargetForBiasedRandomSelection;		            // int		Maximum Target Percentage to be Used for Biased Random Selection (also in the range of 0 to 99 but at least as high as the previous ‘Target Percentage to be Used for Random Selection’).
        this.TargetForRandomSelection;				            // int		Target Percentage to be Used for Random Selection (in the range of 0 to 99)
        this.TerminalFloorLimit= new Array(4);					// BYTE	Terminal Floor Limit, Ex. {0x00, 0x00, 0x10, 0x00} - value 10.00
        this.TerminalIdentification= new Array(9);				// char	Designates the unique location of a terminal at a merchant, Ex. "EMVPOS4 "
        this.TerminalRiskManagementDataSize;			        // int		Size of next element
        this.TerminalRiskManagementData= new Array(8);			// BYTE	Application-specific value used by the card for risk management purposes
        this.ThresholdValueForRandomSelection= new Array(4);	// BYTE	Threshold Value for Biased Random Selection (which must be zero or a positive number less than the floor limit)
        this.TransactionReferenceCurrency= new Array(2);		// BYTE	Transaction Reference Currency Code, Ex. {0x09, 0x78}
        this.TransactionReferenceCurrencyConv = new Array(4);	// BYTE	Factor used in the conversion from the Transaction Currency Code to the Transaction Reference Currency Code
        this.TransactionReferenceCurrencyExponent;	            // BYTE	Indicates the implied position of the decimal point from the right of the transaction amount, with the Transaction Reference Currency Code represented according to ISO 4217
        this.AuthorityPublicKeys = [];					        // List*	Public keys, see structure EMVAuthorityPublicKey
    }
} 

class emv_PointOfSale  {
    constructor () { 
	this.pCom;
	this.PointAcceptationIdentification = '';		            // NEW TAG DF5C [9]
	this.SystemAcceptationIdentification = '';	                // NEW TAG DF5E [9]
	this.PointAcceptationLogicalNumber = '';		            // NEW TAG DF5B [4]
	this.SystemAcceptationLogicalNumber = '';		            // NEW TAG DF51 [4]
    }
}

class emv_Acquirer {
    constructor () {     
        this.AcquirerIdentifier;                                //9F01 n6..11 [6];
    }
}

//Enseigne de l’accepteur ansc 60  //DF04  DF20, DF21, DF22, DF23 
//Identification organisme acquéreur ansc 11 
//Type d’activité commerciale ansc 4						 MerchantCategoryCode
//Réservé usage futur (renseigné à blanc) ansc 2 
//Numéro contrat accepteur ansc 7 
//Enveloppe 41 : valeur à utiliser dans le champ 41 ansc 8    Terminal Identification 9F1C
//Enveloppe 42 : valeur à utiliser dans le champ 42 ansc 15   Merchant Identifier 9F16

class emv_Acceptor {
    constructor () {    

        this.MerchantCategoryCode;				                // MerchantCategoryCode[2];				//9F15 n4 Merchant Category Code, Ex. {0x30, 0x01}    
        this.MerchantIdentifier;				                // MerchantIdentifier[16];				//9F16  ans15 Merchant Identifier  Ex. "000000000018003"  When concatenated with the Acquirer Identifier; uniquely identifies a given merchant   
        this.MerchantNameAndLocation;			                // MerchantNameAndLocation[41];			//9F4E ans Merchant Name and Location,Null terminated C string, Ex. "202B,
        this.TerminalIdentification;				            // TerminalIdentification[9];			//9F1C an8 Designates the unique location of a terminal at a merchant, Ex. "EMVPOS4 "   

        this.MerchantContractNumber;				            // NEW TAG DF5F  ans7					           
        this.MerchantBillMode;						            // MerchantBillMode;						//DF20 MODE FACTURATION TELECOM		
        this.MerchantActivationCode;					        // MerchantActivationCode;	                //DF21 CODE ACTIVATION MODE APPELE. 
        this.SystemAcceptationIdentification;		            // SystemAcceptationIdentification[9];		NEW TAG DF5E //Type de Site ?? DF23             
        this.SIRET;								                // SIRET[15];								NEW TAG DF5D //DF22      
        
    }
}
class emv_Terminal {
    constructor (serialnumber, countrycode, tt, tc, atc, ttq) {            
		this.IFDSerialNumber = serialnumber;              	            // 9F1E char Ex. "12345678" [9];
		this.TerminalCountryCode = countrycode;				            // BYTE Ex. {0x08, 0x40} [2];
		this.TerminalType = tt;						                    // BYTE Ex. 0x22
        this.TerminalCapabilities  = tc;			                    // BYTE Ex. {0xE0, 0xF8, 0xE8} [3];
        this.AdditionalTerminalCapabilities = atc;                      // BYTE Ex. {0xC1, 0x00, 0xF0, 0xA0, 0x01} [5];
        this.TTQ = ttq;                                                 // BYTE Ex. {0x26, 0x40, 0x40, 0x00} [4]
        this.props = [
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},            
        ];
    }
} 

class emv {
    constructor () {        
      
        this.Applications = [];	
        this.Terminals    = [];	
        this.Clients      = [];	
        
        this.Acquirer     = new emv_Acquirer();
        this.Acceptor     = new emv_Acceptor();

        this.ApplicationsCount = 0;
        this.TerminalsCount    = 0;
        this.ExceptionCardList = [];						    // hotlist PAN see structure EMVExceptionCard
        this.RangBinList       = [];						    // CB List of Ranges Registered CB and properties	
   		this.ApplicationCurrencyCode = '';             		    // Application Currency Code 0x9F42  [2]
        this.ApplicationCurrencyExponent;		    	        // 0x9F44
    }
    Save (url) {
        let content = JSON.stringify(this, null, 2)
        let cuser = solution.get('user')
       
        cuser.send ({Name: 'savefile', Values: [url, content]}, true, 
                    function (content, values) {
                        DisplayOperation("Project Saved", true, 'operationpanel');                             
                    }, 
                    ['emvsolution.json']);  
    }

    Load = function (url, async, interfacecallback, par) {  

        solution.get_file(url, async, interfacecallback, [par]);        

        //this.ReadTagFile();				 //TAGS.csv
        //this.ReadApduErrorFile();		     //SW1SW2.csv
        //this.ReadFile();					 //FILES.csv
    }
    LoadAcceptor() {				//SIT_D753.wp
    }
    LoadRangeBins() {			    //APB_D236.wp
    }

    LoadExceptionCards() {	//APL_D253.wp
    }

    LoadAuthorityPublicKeys() {	//EPK_D782.wp
    }

    LoadTerminals() {
        let terminal = new emv_Terminal("12345678", [0x02, 0x50], 0x22, [0x60, 0xB8, 0xC8], [0xC1, 0x00, 0xF0, 0xA0, 0x01], [0x26, 0x40, 0x40, 0x00]);
        this.AddTerminal(terminal)
    }
    LoadApplications() {			//EPV_D787.wp
    }
        
    LoadTacs() {					//EPT_D778.wp  
    }      

    AddTerminal (terminal) {
   
        this.Terminals.push(terminal);
        this.TerminalsCount++;
    }

}
