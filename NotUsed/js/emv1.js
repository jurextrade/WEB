
class emv_Solution extends SOLUTION {
    constructor (userid, usermail, username) {
        super(SOLUTION);
        MX*				pMX;
        CB2A*			pCB2A;
        EMVSettings		Settings;	                //emv_Settings
        List*			Applications = [];	
        List*			Terminals = [];
        List*			Clients = [];
        EMVAcquirer*	pAcquirer;
        EMVAcceptor*	pAcceptor;
        int				ApplicationsCount;
        int				TerminalsCount;
        List*			ExceptionCardList = [];					// hotlist PAN see structure EMVExceptionCard
        List*			RangBinList = [];						// CB List of Ranges Registered CB and properties	
        BYTE			ApplicationCurrencyCode[2];				// Application Currency Code 0x9F42
        BYTE			ApplicationCurrencyExponent;			// 0x9F44
        int				DebugEnabled = 1;
        MXMessage*      (*APDU)(struct _EMV* pemv, struct _EMVClient* pclient, BYTE cla, BYTE ins, BYTE p1, BYTE p2, BYTE dataSize, const BYTE* data);  
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

class emv_Application {
    constructor () {    
        this.AIDCount;								            // int		Count of AIDs in this configuration
        this.AID = new Array(20);								// EMVAid	EMVAID of current configuration
        this.RID = new Array(5);								// BYTE	Registered Application Provider Identifier, Ex. {0xA0, 0x00, 0x00, 0x00, 0x03}
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
	
class emv_Client {
    constructor () {        
	int				Step;                                       // 
	int				SubStep;                                    //     
	EMV*			pEMV;                                       //
	TLV*			pTLV;                                       //
	int				CardType;						            //VISA, AMEX, ...
	char			ATR[250];                                   //
	EMVPointOfSale*	pPointOfSale;                               //
	EMVTransaction*	pTransaction;                               //
	EMVTerminal*	pTerminal;                                  //
	EMVApplication*	pApplication;					            //Selected Application
	CB2AMessage*	pAutorisationMessage;                       //
	CB2AMessage*	pRedressementMessage;                       //
	int				candidateApplicationC                       //
	int				IndexApplicationSelec                       //
	int				indexApplicationSelected;		            // index fetching
	int				indexApplicationAidSelected;	            // index Aid fetching
	int				RecordNo;						            // Record Number for SFi with PSE
	int				NumberOfRecordsToRead;			            // Number of total records to read
	int				RecordNumber;					            // Record Number
	BYTE			sfiOfPSE;                                   //
	EMV_BITS*		EMV_TSI;                                    //
	EMV_BITS*		EMV_TVR;                                    //
	BYTE*			EMV_CVMR;                                   //
	EMV_BITS*		EMV_AIP;                                    //
	EMV_BITS*		EMV_AUC;                                    //
    EMV_BITS*		EMV_CTQ;                                    //
	EMV_BITS*		EMV_CID;                                    //Card Response on Generate AC
	int				EMV_ATC;                                    //
	int				EMV_LATC                                    //
	BYTE*			EMV_CVM;                                    //
	int				EMV_CVMS                                    //
	int				EMV_PTC;					                // Pin Try Counter
	BYTE*			EMV_SC;						                // Service Code on Track1 or Track2
	BYTE			Cryptogram;                                 //
	EMVSelectApplicationInfo candidateApplications[MAX_CANDIDATE_APPLICATIONS];
	int				DifferentCurrency;
    }
}

class emv {
    constructor () {        
        MX*				pMX;

        MXCom*			pemv_RouterCom;

        CB2A*			pCB2A;
        EMVSettings		Settings;	
        
        this.Applications;	
        this.Terminals;
        this.Clients;
        
        EMVAcquirer*	pAcquirer;
        EMVAcceptor*	pAcceptor;


        int				ApplicationsCount;
        int				TerminalsCount;
        this.ExceptionCardList;						// hotlist PAN see structure EMVExceptionCard
        this.RangBinList;							// CB List of Ranges Registered CB and properties	
        BYTE			ApplicationCurrencyCode[2];				// Application Currency Code 0x9F42
        BYTE			ApplicationCurrencyExponent;			// 0x9F44
        int				DebugEnabled;
        MXMessage*      (*APDU)(struct _EMV* pemv, struct _EMVClient* pclient, BYTE cla, BYTE ins, BYTE p1, BYTE p2, BYTE dataSize, const BYTE* data);
    }
}

class emv_Aid {
    constructor () {        
	    this.Length;							    // int	 Length in bytes, Ex. 7
	    this.AID[16];							    // BYTE Ex. {0xA0, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10}
	    this.Priority;                              //int	 
	    this.ApplicationVersionNumber[2];		    // BYTE Ex. {0x00, 0x8C}
	    this.applicationSelectionIndicator;		    // char Application Selection Indicator, 0 - if application must match AID exactly, 1 - if allow partial
	    this.ForceTransaction;					    // BYTE Indicates if a transaction can be forced to accept by acceptor if refused by terminal
	    this.TerminalActionCodeDenial[5];		    // BYTE Terminal Action Code - Denial
	    this.TerminalActionCodeOnline[5];		    // BYTE Terminal Action Code - Online
	    this.TerminalActionCodeDefault[5];		    // BYTE Terminal Action Code - Default
    }
} 

class emv_Terminal {
    constructor () {            
		this.IFDSerialNumber[9];					// char Ex. "12345678"
		this.TerminalCountryCode[2];				// BYTE Ex. {0x08, 0x40}
		this.AdditionalTerminalCapabilities[5];	    // BYTE Ex. {0xC1, 0x00, 0xF0, 0xA0, 0x01}
		this.TerminalCapabilities[3];			    // BYTE Ex. {0xE0, 0xF8, 0xE8}
		this.TerminalType;						    // BYTE Ex. 0x22
        this.TTQ[4];                                // BYTE Ex. {0x26, 0x40, 0x40, 0x00}
    }
} 

class emv_Acquirer {
    constructor () {     
        this.AcquirerIdentifier[6];					                                                                                    //9F01 n6..11
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
        this.MerchantNameAndLocation[41];			    // Null terminated C string, Ex. "202B, USELU LAGOS ROAD BENIN CITY"            //9F4E ans...40
        this.MerchantCategoryCode[2];				    // Merchant Category Code, Ex. {0x30, 0x01}                                     //9F15 n4
        this.TerminalIdentification[9];				    // Designates the unique location of a terminal at a merchant, Ex. "EMVPOS4 "   //9F1C an8
        this.MerchantIdentifier[16];				    // Merchant Identifier, Ex. "000000000018003" ans15                             //9F16

        this.MerchantContractNumber[8];				    // NEW TAG DF5F  ans7
        this.MerchantBillMode;						    // MODE FACTURATION TELECOM		//DF20 
        this.MerchantActivationCode;					// CODE ACTIVATION MODE APPELE. //DF21
        this.SystemAcceptationIdentification[9];		// NEW TAG DF5E					//Type de Site ?? DF23
        this.SIRET[15];								    // NEW TAG DF5D					//DF22
    }
}

class emv_PointOfSale  {
    constructor () { 
	this.pCom;
	this.PointAcceptationIdentification[9];		        // NEW TAG DF5C
	this.SystemAcceptationIdentification[9];	        // NEW TAG DF5E
	this.PointAcceptationLogicalNumber[4];		        // NEW TAG DF5B
	this.SystemAcceptationLogicalNumber[4];		        // NEW TAG DF51
    }
}