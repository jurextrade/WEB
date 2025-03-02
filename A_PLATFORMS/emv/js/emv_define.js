const EMV_STEP_CARD_DETECTION_AND_RESET					= 0 

const EMV_STEP_CANDIDATE_LIST_CREATION					= 1
	const EMV_SUBSTEP_ATTEMP_DIRECTORY_LISTING_PSE		= 100
	const EMV_SUBSTEP_READ_RECORD_SFI					= 101
	const EMV_SUBSTEP_BUILD_CANDIDATE_LIST_WITH_SELECT	= 102

const EMV_STEP_APPLICATION_SELECTION					= 2
    const EMV_SUBSTEP_SET_APPLICATION					= 200
    const EMV_SUBSTEP_GET_PROCESSING_OPTIONS			= 201

const EMV_STEP_READ_APPLICATION_DATA					= 3
	const EMV_SUBSTEP_COMPLETE_EQUIVALENTDATA_TAGS		= 300
	const EMV_SUBSTEP_CHECK_MANDATORY_DATA			    = 301
	const EMV_SUBSTEP_CHECK_MISSING_DATA				= 302

const EMV_STEP_DATA_AUTHENTIFICATION					        = 4
	const EMV_SUBSTEP_CHECK_TERMINAL_TYPE				        = 400
	const EMV_SUBSTEP_SELECTION_OFFLINE_AUTHENTIFICATION_MISM   =401
	const EMV_SUBSTEP_OFFLINE_SDA						        = 402
	const EMV_SUBSTEP_OFFLINE_DDA						        = 403
	const EMV_SUBSTEP_CDA								        = 404

const EMV_STEP_PROCESSING_RESTRICTIONS					  = 5
	const EMV_SUBSTEP_APPLICATION_VERSION_NUMBER		  = 500
	const EMV_SUBSTEP_APPLICATION_USAGE_CONTROL			  = 501
	const EMV_SUBSTEP_APPLICATION_EFFECTIVE_EXPIRATION_DAT = 502

const EMV_STEP_CARD_HOLDER_VERIFICATION					= 6
	const EMV_SUBSTEP_CHECK_CVM_RULES					= 600

const EMV_STEP_TERMINAL_RISK_MANAGEMENT					= 7
	const EMV_SUBSTEP_EXCEPTION_LIST_CARDS_CHECKING		= 700
	const EMV_SUBSTEP_CB_REGISTERED_BIN_CHECKING		= 701
	const EMV_SUBSTEP_FLOOR_LIMIT_CHECKING				= 702
	const EMV_SUBSTEP_RANDOM_TRANSACTION_SELECTION		= 703
	const EMV_SUBSTEP_VELOCITY_CHECKING					= 704

const EMV_STEP_TERMINAL_ACTION_ANALYSIS					= 8
	const EMV_SUBSTEP_ACTION_IF_DENIAL					= 800
	const EMV_SUBSTEP_ACTION_IF_ONLINE					= 801
	const EMV_SUBSTEP_ACTION_IF_APPROVED				= 802

const EMV_STEP_CARD_ACTION_ANALYSIS						= 9
	const EMV_SUBSTEP_GENERATE_AC_FIRST					= 900

const EMV_STEP_ONLINE_OFFLINE_DECISION					= 10

const EMV_STEP_ONLINE_PROCESSING						= 11
	const EMV_SUBSTEP_CONNECT_ACQUIRER					= 1100
	const EMV_SUBSTEP_PREPARE_AND_SEND_TO_ACQUIRER		= 1101

const EMV_STEP_SCRIPT_PROCESSING						= 12
	const EMV_SUBSTEP_CHECK_ISSUER_SCRIPTS_TEMPLATE		= 1200
	const EMV_SUBSTEP_POST_ISSUANCE_COMMANDS    		= 1201

const EMV_STEP_TRANSACTION_COMPLETION					= 13
	const EMV_SUBSTEP_GENERATE_AC_SECOND				= 1300
	const EMV_SUBSTEP_TERMINATE_TRANSACTION				= 1301


const B1					                            = 0x00
const B2					                            = 0x01
const B3					                            = 0x02
const B4					                            = 0x03
const B5					                            = 0x04

const b8					                            = 0x80
const b7					                            = 0x40
const b6					                            = 0x20
const b5					                            = 0x10
const b4					                            = 0x08
const b3					                            = 0x04
const b2					                            = 0x02
const b1					                            = 0x01

const BYTE = [B1, B2, B3, B4, B5]
const BIT  = [b8, b7, b6, b5, b4, b3, b2, b1]


//----------------------------------------------------------------------------------CVM tag  8E

const Fail_cardholder_verification_if_verification_is_unsuccessful				= 0x40; 
const Move_to_next_rule_if_verification_is_unsuccessful							= 0x3F; 

const Fail_CVM_processing														= 0x00;  /* Echec CVM*/
const Offline_plaintext_PIN														= 0x01;  /* Code Pin OffLine En Clair*/
const Online_PIN_always_enciphered   											= 0x02;  /* Code Pin OnLine  Crypte*/
const Offline_plaintext_PIN_and_paper_based_Signature							= 0x03;  /* Code Pin OffLine Clair + Signature */
const Offline_enciphered_PIN													= 0x04;  /* Code Pin OffLine Crypte*/
const Offline_enciphered_PIN_and_paper_based_Signature							= 0x05;  /* Code Pin OffLine Crypte*/
const Paper_based_Signature_only												= 0x1E;  /* Signature*/
const Approve_CVM_processing													= 0x1F;  /* Aucune Authentification Porteur*/

const Always_try_to_apply_this_rule												= 0x00;  /* Application sans Condition */
const Only_try_to_apply_this_rule_where_this_is_an_unattended_cash_transaction	= 0x01;  /* Application si Type Trs  = Cash */
const If_not_unattended_cash_and_not_manual_cash_and_not_purchase_with_cashback	= 0x02;  /* Application si Type Trs != Cash */	
const Always_try_to_apply_this_rule_where_the_CVM_code_is_supported				= 0x03;  /* Application si Supporte */
const If_this_is_a_manual_cash_transaction_apply_this_rule						= 0x04; 
const If_this_is_a_purchase_with_cashback_apply_this_rule						= 0x05; 
const If_transaction_is_in_the_application_currency_and_is_under_X_value 		= 0x06;  /* Application si M<X */
const If_transaction_is_in_the_application_currency_and_is_over_X_value			= 0x07;  /* Application si M>X */
const If_transaction_is_in_the_application_currency_and_is_under_Y_value		= 0x08;  /* Application si M<Y */
const If_transaction_is_in_the_application_currency_and_is_over_Y_value			= 0x09;  /* Application si M>Y */



const emv_CVM = {
    tag: '8E',
    struct: [    
        [
            {id :  Fail_CVM_processing								       , item : "Fail CVM processing"},
            {id :  Offline_plaintext_PIN								   , item : "Plaintext PIN verification performed by ICC"},
            {id :  Online_PIN_always_enciphered	     				       , item : "Enciphered PIN verified online"},
            {id :  Offline_plaintext_PIN_and_paper_based_Signature	       , item : "Plaintext PIN verification performed by ICC and signature (paper)"},
            {id :  Offline_enciphered_PIN							       , item : "Enciphered PIN verification performed by ICC"},
            {id :  Offline_enciphered_PIN_and_paper_based_Signature	       , item : "Enciphered PIN verification performed by ICC and signature (paper)"},
            {id :  Paper_based_Signature_only						       , item :  "Signature (paper)"},
            {id :  Approve_CVM_processing							       , item :  "No CVM required"},
        ],        
        [
            {id :  Always_try_to_apply_this_rule											, item : "Always"},
            {id :  Only_try_to_apply_this_rule_where_this_is_an_unattended_cash_transaction	, item : "If unattended cash"},
            {id :  If_not_unattended_cash_and_not_manual_cash_and_not_purchase_with_cashback, item : "If not unattended cash and not manual cash and not purchase with cashback"},
            {id :  Always_try_to_apply_this_rule_where_the_CVM_code_is_supported			, item : "If terminal supports the CVM"},
            {id :  If_this_is_a_manual_cash_transaction_apply_this_rule						, item : "If manual cash"},
            {id :  If_this_is_a_purchase_with_cashback_apply_this_rule						, item : "If purchase with cashback"},
            {id :  If_transaction_is_in_the_application_currency_and_is_under_X_value 		, item : "If transaction is in the application currency and is under %X% value (implicit decimal point)"},
            {id :  If_transaction_is_in_the_application_currency_and_is_over_X_value		, item : "If transaction is in the application currency and is over %X% value (implicit decimal point)"},
            {id :  If_transaction_is_in_the_application_currency_and_is_under_Y_value		, item : "If transaction is in the application currency and is under %Y% value (implicit decimal point)"},
            {id :  If_transaction_is_in_the_application_currency_and_is_over_Y_value		, item : "If transaction is in the application currency and is over %Y% value (implicit decimal point)"},
        ],
    ]
}


//---------------------------------------------------------------------------------  TRANSACTION TYPE tag 9C

const emv_TRT = {
    "00": "Purchase",
    "01": "Cash advance",
    "09": "Purchase with cashback",
     20: "Refund"
}

//---------------------------------------------------------------------------------  TERMINAL TYPE tag 9F35

const emv_TT = {
    11: "Financial Institution Controlled - Attended, Online only",
    12: "Financial Institution Controlled - Attended, Online with offline capability",
    13: "Financial Institution Controlled - Attended, Offline only",
    14: "Financial Institution Controlled - Unattended, Online only",
    15: "Financial Institution Controlled - Unattended, Online with offline capability",
    16: "Financial Institution Controlled - Unattended, Offline only",
    21: "Merchant Controlled - Attended, Online only",
    22: "Merchant Controlled - Attended, Online with offline capability",
    23: "Merchant Controlled - Attended, Offline only",
    24: "Merchant Controlled - Unattended, Online only",
    25: "Merchant Controlled - Unattended, Online with offline capability",
    26: "Merchant Controlled - Unattended, Offline only",
    34: "Cardholder Controlled - Unattended, Online only",
    35: "Cardholder Controlled - Unattended, Online with offline capability",
    36: "Cardholder Controlled - Unattended, Offline only"
}

//---------------------------------------------------------------------------------  TERMINAL CAPABILITIES

const Manual_key_entry						                     = 0x0080		
const Magnetic_stripe						                     = 0x0040		
const IC_with_contacts						                     = 0x0020		

const Plaintext_PIN_for_ICC_verification	                     = 0x0180		
const Enciphered_PIN_for_online_verification                     = 0x0140		
const Signature_paper						                     = 0x0120		
const Enciphered_PIN_for_offline_verification                    = 0x0110		
const No_CVM_Required						                     = 0x0108	

const SDA										                 = 0x0280		
const DDA										                 = 0x0240		
const Card_capture							                     = 0x0220		
const CDA									                     = 0x0208

const emv_TC = {
    tag: '9F33',
    struct: [
        [
            {id :  Manual_key_entry	                                    , item : "Manual key entry"},
            {id :  Magnetic_stripe									    , item : "Magnetic stripe"},
            {id :  IC_with_contacts								        , item : "IC with contacts"},
            {id :  0x0010	                                            , item : "RFU"},
            {id :  0x0008                                               , item : "RFU"},
            {id :  0x0004                                               , item : "RFU"},
            {id :  0x0002                                               , item : "RFU"},
            {id :  0x0001                                               , item : "RFU"},
        ],
        [
            {id:  Plaintext_PIN_for_ICC_verification	                , item: "Plaintext PIN for ICC verification"},
            {id:  Enciphered_PIN_for_online_verification				, item: "Enciphered PIN for online verification"},
            {id:  Signature_paper							            , item: "Signature (paper)"},
            {id:  Enciphered_PIN_for_offline_verification		        , item: "Enciphered PIN for offline verification"},
            {id:  No_CVM_Required										, item: "No CVM Required"},
            {id:  0x0104                                                , item: "RFU"},
            {id:  0x0102                                                , item: "RFU"},
            {id:  0x0101                                                , item: "RFU"},
        ],
        [
            {id: SDA				                                    , item: "SDA"},
            {id: DDA										            , item: "DDA"},
            {id: Card_capture			         						, item: "Card capture"},
            {id: 0x0210	                                                , item: "RFU"},
            {id: CDA                                                    , item: "CDA"},
            {id: 0x0204										            , item: "RFU"},
            {id: 0x0202                                                 , item: "RFU"},
            {id: 0x0201                                                 , item: "RFU"},
        ]
    ]
}

//---------------------------------------------------------------------------------  ADDITIONAL TERMINAL CAPABILITIES

const Cash									 = 0x0080
const Goods									 = 0x0040
const Services								 = 0x0020
const Cashback								 = 0x0010
const Inquiry 								 = 0x0008
const Transfer 								 = 0x0004
const Payment 								 = 0x0002
const Administrative						 = 0x0001

const Cash_Deposit							 = 0x0180


const Numeric_keys							 = 0x0280
const Alphabetic_and_special_characters_keys = 0x0240
const Command_keys							 = 0x0220
const Function_keys							 = 0x0210


const Print_attendant						 = 0x0380
const Print_cardholder						 = 0x0340
const Display_attendant						 = 0x0320
const Display_cardholder					 = 0x0310
const Code_table_10							 = 0x0302
const Code_table_9							 = 0x0301

const Code_table_8							 = 0x0480
const Code_table_7							 = 0x0440
const Code_table_6							 = 0x0420
const Code_table_5							 = 0x0410
const Code_table_4							 = 0x0408
const Code_table_3							 = 0x0404
const Code_table_2							 = 0x0402
const Code_table_1							 = 0x0401

const emv_ATC = {
    tag: '9F40',
    struct: [
        [
            {id :  Cash				                                    , item : "Cash"},				
            {id :  Goods												, item : "Goods"},				
            {id :  Services										        , item : "Services"},			
            {id :  Cashback			                                    , item : "Cashback"},			
            {id :  Inquiry 			                                    , item : "Inquiry"}, 			
            {id :  Transfer 			                                , item : "Transfer"}, 			
            {id :  Payment 			                                    , item : "Payment"}, 			
            {id :  Administrative	                                    , item : "Administrative"},	
        ],
        [
            {id:  Cash_Deposit	                                        , item: "Cash Deposit"},
            {id:  0x140                                                 , item: "RFU"},
            {id:  0x120                                                 , item: "RFU"},
            {id:  0x110                                                 , item: "RFU"},
            {id:  0x108                                                 , item: "RFU"},
            {id:  0x104                                                 , item: "RFU"},
            {id:  0x102                                                 , item: "RFU"},
            {id:  0x101                                                 , item: "RFU"},
        ],
        [
            {id: Numeric_keys							                , item: "Numeric keys"},							
            {id: Alphabetic_and_special_characters_keys                 , item: "Alphabetic and special characters keys"}, 
            {id: Command_keys								            , item: "Command keys"},							
            {id: Function_keys							                , item: "Function keys"},							
            {id: 0x208                                                  , item: "RFU"},
            {id: 0x204									                , item: "RFU"},
            {id: 0x202                                                  , item: "RFU"},
            {id: 0x201                                                  , item: "RFU"},
        ],
        [
            {id: Print_attendant	                                    , item: "Print, attendant"},	
            {id: Print_cardholder	                                    , item: "Print, cardholder"},	
            {id: Display_attendant	                    	            , item: "Display, attendant"},	
            {id: Display_cardholder                                     , item: "Display, cardholder"},
            {id: 0x308                                                  , item: "RFU"},
            {id: 0x304									                , item: "RFU"},
            {id: Code_table_10	                                        , item: "Code table 10"},
            {id: Code_table_9	                                        , item: "Code table 9"},
        ],
        [
            {id: Code_table_8                                           , item: "Code table 8"},
            {id: Code_table_7                                           , item: "Code table 7"},
            {id: Code_table_6                           	            , item: "Code table 6"},
            {id: Code_table_5                                           , item: "Code table 5"},
            {id: Code_table_4                                           , item: "Code table 4"},
            {id: Code_table_3                                           , item: "Code table 3"},
            {id: Code_table_2                                           , item: "Code table 2"},
            {id: Code_table_1                                           , item: "Code table 1"},
        ],                
    ]
}



//---------------------------------------------------------------------------------  TERMINAL TRANSACTION QUALIFIERS (TTQ)


const Contactless_MSD_supported                                  = 0x0080
const Contactless_VSDC_supported                                 = 0x0040
const Contactless_qVSDC_supported                                = 0x0020
const EMV_contact_chip_supported                                 = 0x0010
const Offline_only_reader                                        = 0x0008
const Online_PIN_supported                                       = 0x0004
const Signature_supported                                        = 0x0002
const Offline_Data_Authentication                                = 0x0001


const Online_cryptogram_required                                 = 0x0180
const CVM_required                                               = 0x0140
const Contact_Chip_Offline_PIN_supported                         = 0x0120

const Issuer_Update_Processing_Supported                         = 0x0280
const Mobile_functionality_supported                             = 0x0240

const emv_TTQ = {
    tag: '9F66',
    struct: [
        [
            {id : Contactless_MSD_supported                             , item : "Contactless MSD supported"},
            {id : Contactless_VSDC_supported                            , item : "Contactless VSDC supported"},
            {id : Contactless_qVSDC_supported                           , item : "Contactless qVSDC supported"},
            {id : EMV_contact_chip_supported                            , item : "EMV contact chip supported"},
            {id : Offline_only_reader                                   , item : "Offline-only reader"},
            {id : Online_PIN_supported                                  , item : "Online PIN supported"},
            {id : Signature_supported                                   , item : "Signature supported"},
            {id : Offline_Data_Authentication                           , item : "Offline Data Authentication (ODA) for Online Authorizations supported."},
        ],
        [
            {id: Online_cryptogram_required                             , item: "Online cryptogram required"},
            {id: CVM_required                                           , item: "CVM required"},
            {id: Contact_Chip_Offline_PIN_supported              		, item: "(Contact Chip) Offline PIN supported"},
            {id: 0x0110                                         		, item: "RFU"},
            {id: 0x0108                                         		, item: "RFU"},
            {id: 0x0104                                                 , item: "RFU"},
            {id: 0x0102                                                 , item: "RFU"},
            {id: 0x0101                                                 , item: "RFU"},
        ],
        [
            {id: Issuer_Update_Processing_Supported                     , item: "Issuer Update Processing Supported"},
            {id: Mobile_functionality_supported                         , item: "Mobile functionality supported (Consumer Device CVM)"},
            {id: 0x0220                                                 , item: "RFU"},
            {id: 0x0210                                                 , item: "RFU"},
            {id: 0x0208                                                 , item: "RFU"},
            {id: 0x0204                                                 , item: "RFU"},
            {id: 0x0202                                                 , item: "RFU"},
            {id: 0x0201                                                 , item: "RFU"},
        ],
        [
            {id: 0x0380                                                 , item: "RFU"},
            {id: 0x0340                                                 , item: "RFU"},
            {id: 0x0320                                                 , item: "RFU"},
            {id: 0x0310                                                 , item: "RFU"},
            {id: 0x0308                                                 , item: "RFU"},
            {id: 0x0304                                                 , item: "RFU"},
            {id: 0x0302                                                 , item: "RFU"},
            {id: 0x0301                                                 , item: "RFU"},
        ],
    ]
}

//---------------------------------------------------------------------------------  TVR

const Offline_data_authentication_was_not_performed				 =  0x0080
const SDA_failed												 =  0x0040
const ICC_data_missing											 =  0x0020
const Card_appears_on_terminal_exception_file					 =  0x0010
const DDA_failed												 =  0x0008
const CDA_failed												 =  0x0004
const SDA_selected												 =  0x0002

const ICC_and_terminal_have_different_application_versions		 =  0x0180
const Expired_application										 =  0x0140
const Application_not_yet_effective								 =  0x0120
const Requested_service_not_allowed_for_card_product			 =  0x0110
const New_Card													 =  0x0108

const Cardholder_verification_was_not_successful				 =  0x0280
const Unrecognised_CVM											 =  0x0240
const PIN_Try_Limit_exceeded									 =  0x0220
const PIN_entry_required_and_PIN_pad_not_present_or_not_working	 =  0x0210
const PIN_entry_required_PIN_pad_present_but_PIN_was_not_entered =  0x0208
const Online_PIN_entered										 =  0x0204

const Transaction_exceeds_floor_limit							 =  0x0380
const Lower_consecutive_offline_limit_exceeded					 =  0x0340
const Upper_consecutive_offline_limit_exceeded					 =  0x0320
const Transaction_selected_randomly_for_online_processing		 =  0x0310
const Merchant_forced_transaction_online						 =  0x0308

const Default_TDOL_used											 =  0x0480
const Issuer_authentication_failed								 =  0x0440
const Script_processing_failed_before_final_GENERATE_AC			 =  0x0420
const Script_processing_failed_after_final_GENERATE_AC			 =  0x0410


const emv_TVR = {
    tag: '95',
    struct: [
        [
            {id :  Offline_data_authentication_was_not_performed	    , item : "Offline data processing was not performed", title: "essai"},
            {id :  SDA_failed									        , item : "SDA failed"},
            {id :  ICC_data_missing								        , item : "ICC data missing"},
            {id :  Card_appears_on_terminal_exception_file		        , item : "Card number appears on hotlist"},
            {id :  DDA_failed									        , item : "DDA failed"},
            {id :  CDA_failed									        , item : "CDA failed (Combined data authentification failed)"},
            {id :  SDA_selected									        , item : "SDA selected"},
            {id :  0x0001                                               , item : "RFU"},
        ],
        [
            {id:  ICC_and_terminal_have_different_application_versions	, item: "Card and terminal have different application versions"},
            {id:  Expired_application									, item: "Expired application"},
            {id:  Application_not_yet_effective							, item: "Application not yet effective"},
            {id:  Requested_service_not_allowed_for_card_product		, item: "Requested service not allowed for card product"},
            {id:  New_Card												, item: "New card"},
            {id:  0x0104                                                , item: "RFU"},
            {id:  0x0102                                                , item: "RFU"},
            {id:  0x0101                                                , item: "RFU"},
        ],
        [
            {id: Cardholder_verification_was_not_successful				, item: "Cardholder verification was not successful"},
            {id: Unrecognised_CVM										, item: "Unrecognised CVM"},
            {id: PIN_Try_Limit_exceeded									, item: "PIN try limit exceeded"},
            {id: PIN_entry_required_and_PIN_pad_not_present_or_not_working	, item: "PIN entry required, but no PIN pad present or not working"},
            {id: PIN_entry_required_PIN_pad_present_but_PIN_was_not_entered, item: "PIN entry required, PIN pad present, but PIN was not entered"},
            {id: Online_PIN_entered										, item: "On-line PIN entered"},
            {id: 0x0202                                                 , item: "RFU"},
            {id: 0x0201                                                 , item: "RFU"},
        ],
        [
            {id: Transaction_exceeds_floor_limit						, item: "Transaction exceeds floor limit"},
            {id: Lower_consecutive_offline_limit_exceeded				, item: "Lower consecutive offline limit exceeded"},
            {id: Upper_consecutive_offline_limit_exceeded				, item: "Upper consecutive offline limit exceeded"},
            {id: Transaction_selected_randomly_for_online_processing	, item: "Transaction selected randomly of on-line processing"},
            {id: Merchant_forced_transaction_online					    , item: "Merchant forced transaction on-line"},
            {id: 0x0304                                                 , item: "RFU"},
            {id: 0x0302                                                 , item: "RFU"},
            {id: 0x0301                                                 , item: "RFU"},
        ],
        [
            {id: Default_TDOL_used									    , item: "Default TDOL Used"},
            {id: Issuer_authentication_failed						    , item: "Issuer authentication failed"},
            {id: Script_processing_failed_before_final_GENERATE_AC	    , item: "Script processing failed before final Generate AC"},
            {id: Script_processing_failed_after_final_GENERATE_AC	    , item: "Script processing failed after final Generate AC"},
            {id: 0x0408                                                 , item: "RFU"},
            {id: 0x0404                                                 , item: "RFU"},
            {id: 0x0402                                                 , item: "RFU"},
            {id: 0x0401                                                 , item: "RFU"},
        ]
    ]
}

//---------------------------------------------------------------------------------  TSI

const Offline_data_authentication_was_performed		            =   0x0080
const Cardholder_verification_was_performed			            =   0x0040
const Card_risk_management_was_performed			            =   0x0020
const Issuer_authentication_was_performed			            =   0x0010
const Terminal_risk_management_was_performed		            =   0x0008
const Script_processing_was_performed				            =   0x0004

const emv_TSI = {
    tag: '9B',
    struct: [
        [
            {id:  Offline_data_authentication_was_performed	            , item: "Offline data authentication was performed "},
            {id:  Cardholder_verification_was_performed		            , item: "Cardholder verification was performed "},
            {id:  Card_risk_management_was_performed		            , item: "Card risk management was performed"},
            {id:  Issuer_authentication_was_performed		            , item: "Issuer authentication was performed"},
            {id:  Terminal_risk_management_was_performed	            , item: "Terminal risk management was performed"},
            {id:  Script_processing_was_performed			            , item: "Script processing was performed"},
            {id:  0x0002                                                , item: "RFU"},
            {id:  0x0001                                                , item: "RFU"},
        ]
    ]
}

//---------------------------------------------------------------------------------  AUC

const Valid_for_domestic_cash_transactions                      = 0x0080 
const Valid_for_international_cash_transactions                 = 0x0040 
const Valid_for_domestic_goods                                  = 0x0020 
const Valid_for_international_goods                             = 0x0010 
const Valid_for_domestic_services                               = 0x0008 
const Valid_for_international_services                          = 0x0004 
const Valid_at_ATMs                                             = 0x0002 
const Valid_at_terminals_other_than_ATMs                        = 0x0001

const Domestic_cashback_allowed                                 = 0x0180
const International_cashback_allowed                            = 0x0140


const emv_AUC = {
    tag: '9F07',
    struct: [
        [
            {id: Valid_for_domestic_cash_transactions                   , item: "Valid for domestic cash transactions"}, 
            {id: Valid_for_international_cash_transactions              , item: "Valid for international cash transactions"}, 
            {id: Valid_for_domestic_goods                               , item: "Valid for domestic goods"}, 
            {id: Valid_for_international_goods                          , item: "Valid for international goods"}, 
            {id: Valid_for_domestic_services                            , item: "Valid for domestic services"}, 
            {id: Valid_for_international_services                       , item: "Valid for international services"}, 
            {id: Valid_at_ATMs                                          , item: "Valid at ATMs"}, 
            {id: Valid_at_terminals_other_than_ATMs                     , item: "Valid at terminals other than ATMs"},
        ],
        [
            {id: Domestic_cashback_allowed                              , item: "Domestic_cashback_allowed "}, 
            {id: International_cashback_allowed                         , item: "International_cashback_allowed"}, 
            {id: 0x0120                                                 , item: "RFU"}, 
            {id: 0x0110                                                 , item: "RFU"}, 
            {id: 0x0108                                                 , item: "RFU"}, 
            {id: 0x0104                                                 , item: "RFU"}, 
            {id: 0x0102                                                 , item: "RFU"}, 
            {id: 0x0101                                                 , item: "RFU"},
        ],
    ]
}

//---------------------------------------------------------------------------------  AIP

const SDA_Supported                                             =  0x0040
const DDA_Supported                                             =  0x0020
const Cardholder_verification_is_supported                      =  0x0010
const Terminal_risk_management_is_to_be_performed               =  0x0008
const Issuer_authentication_is_supported                        =  0x0004
const CDA_Supported                                             =  0x0001

const EMV_Mode_has_been_selected                                =  0x0180
const OTA_capable_mobile_device                                 =  0x0140

const emv_AIP = {
    tag: '82',
    struct: [
        [
            {id: 0x0080                                                 , item: "RFU"},
            {id: SDA_Supported                                          , item: "SDA Supported"},
            {id: DDA_Supported                                          , item: "DDA Supported"},
            {id: Cardholder_verification_is_supported                   , item: "Cardholder verification is supported"},
            {id: Terminal_risk_management_is_to_be_performed            , item: "Terminal risk management is to be performed"},
            {id: Issuer_authentication_is_supported                     , item: "Issuer authentication is supported"},
            {id: 0x0002                                                 , item: "RFU"},
            {id: CDA_Supported                                          , item: "CDA Supported"},
        ],
        [
            {id: EMV_Mode_has_been_selected                              , item: "EMV Mode has been selected"}, 
            {id: OTA_capable_mobile_device                               , item: "RFU / OTA capable mobile device"}, 
            {id: 0x0120                                                  , item: "RFU"}, 
            {id: 0x0110                                                  , item: "RFU"}, 
            {id: 0x0108                                                  , item: "RFU"}, 
            {id: 0x0104                                                  , item: "RFU"}, 
            {id: 0x0102                                                  , item: "RFU"}, 
            {id: 0x0101                                                  , item: "RFU"},
        ]
    ]
}

//---------------------------------------------------------------------------------  CTQ

const Online_PIN_Required                                                              = 0x0080
const Signature_Required                                                               = 0x0040 
const Go_Online_if_Offline_Data_Authentication_Fails_and_Reader_is_online_capable      = 0x0020 
const Switch_Interface_if_Offline_Data_Authentication_fails_and_Reader_supports_VIS    = 0x0010 
const Go_Online_if_Application_Expired                                                 = 0x0008 
const Switch_Interface_for_CashTransactions                                            = 0x0004 
const Switch_Interface_for_Cashback_Transactions                                       = 0x0002 
 
 
const Consumer_Device_CVMPerformed                                                   = 0x0180
const Card_supports_Issuer_Update_Processing_at_the_POS                              = 0x0140

const emv_CTQ = {
    tag: '9F6C',
    struct: [
        [
            {id: Online_PIN_Required                                                           , item: "Online PIN Required"},
            {id: Signature_Required                                                            , item: "Signature Required"},                                                           
            {id: Go_Online_if_Offline_Data_Authentication_Fails_and_Reader_is_online_capable   , item: "Go Online if Offline Data Authentication Fails and Reader is online capable"},  
            {id: Switch_Interface_if_Offline_Data_Authentication_fails_and_Reader_supports_VIS , item: "Switch Interface if Offline Data_Authentication fails and Reader supports VIS"},
            {id: Go_Online_if_Application_Expired                                              , item: "Go Online if ApplicationExpired"},                                             
            {id: Switch_Interface_for_CashTransactions                                         , item: "SwitchInterfaceforCashTransactions"},                                        
            {id: Switch_Interface_for_Cashback_Transactions                                    , item: "Switch Interface for CashbackTransactions"},                                   
            {id: 0x0001                                                                        , item: "RFU"},
        ],
        [
            {id: EMV_Mode_has_been_selected                              , item: "Consumer Device CVM Performed"}, 
            {id: OTA_capable_mobile_device                               , item: "Card supports Issuer Update Processing at thePOS"}, 
            {id: 0x0120                                                  , item: "RFU"}, 
            {id: 0x0110                                                  , item: "RFU"}, 
            {id: 0x0108                                                  , item: "RFU"}, 
            {id: 0x0104                                                  , item: "RFU"}, 
            {id: 0x0102                                                  , item: "RFU"}, 
            {id: 0x0101                                                  , item: "RFU"},
        ]
    ]
}

const EMV_CRYPTO_TYPE_AAC                           = 0x00 // An AAC is a type of Application Cryptogram that is generated whenever a card declines a transaction during Card Action Analysis.
const EMV_CRYPTO_TYPE_TC                            = 0x40 // A TC is a type of Application Cryptogram that is generated whenever a card approves a transaction during Card Action Analysis.
const EMV_CRYPTO_TYPE_ARQC                          = 0x80 // An ARQC is a type of Application Cryptogram that is generated whenever the card requests online authorization during Card Action Analysis.
const EMV_CRYPTO_TYPE_AAR                           = 0xC0 // Referral requested by the card


const EMV_CRYPTO_TYPE_PSS                           = 0x30 // Payment System-specific cryptogram",
const EMV_CRYPTO_AR                                 = 0x08 // Advice Required", "YES");
const EMV_CRYPTO_NAR                                = 0x00 // No Advice Required", "YES");
const EMV_CRYPTO_SNA                                = 0x01 // Service not allowed", "YES");
const EMV_CRYPTO_TLE                                = 0x02 // PIN Try Limit exceeded", "YES");
const EMV_CRYPTO_IAF                                = 0x03 // Issuer authentication failed", 
const EMV_CRYPTO_RFU					            = 0x04 // Other Values RFU", 
const EMV_CRYPTO_NIG					            = 0x00 // No information given, 
//const EMVCardReturnAAR(pclient)       ((pclient->EMV_CID[B1]  & EMV_CRYPTO_TYPE_AAR) == EMV_CRYPTO_TYPE_AAR)
//const EMVCardReturnARQC(pclient)      ((pclient->EMV_CID[B1]  & EMV_CRYPTO_TYPE_ARQC) == EMV_CRYPTO_TYPE_ARQC)
//const EMVCardReturnTC(pclient)        ((pclient->EMV_CID[B1]  & EMV_CRYPTO_TYPE_TC) == EMV_CRYPTO_TYPE_TC)
//const EMVCardReturnAAC(pclient)       ((pclient->EMV_CID[B1]  & EMV_CRYPTO_TYPE_AAR) == EMV_CRYPTO_TYPE_AAC)

const CID_AAC                                           = 0
const CID_TC                                            = 1    
const CID_ARQC                                          = 2
const CID_RFU                                           = 3
const CID_Payment_Systemspecific_cryptogram             = 4
const CID_No_advice_required                            = 5
const CID_Advice_required                               = 6
const CID_Reasonadvice_code                             = 7
const CID_No_information_given                          = 8
const CID_Service_not_allowed                           = 9
const CID_PIN_Try_Limit_exceeded                        = 10
const CID_Issuer_authentication_failed                  = 11
const CID_Other_values_RFU                              = 12

const emv_CID = {
    tag: '9F27',
    struct: [
        [
            {id: EMV_CRYPTO_TYPE_AAC                                    , item: "AAC"},
            {id: EMV_CRYPTO_TYPE_TC                                     , item: "TC"},
            {id: EMV_CRYPTO_TYPE_ARQC                                   , item: "ARQC"},
            {id: EMV_CRYPTO_TYPE_AAR                                    , item: "RFU"},
         
            {id: EMV_CRYPTO_TYPE_PSS                                    , item: "Payment System-specific cryptogram"},
          
            {id: EMV_CRYPTO_NAR                                         , item: "No advice required"},
            {id: EMV_CRYPTO_AR                                          , item: "Advice required"},
            {id: -1                                                     , item: "Reason/advice code"},
            {id: EMV_CRYPTO_NIG                                         , item: "No information given"},
            {id: EMV_CRYPTO_SNA                                         , item: "Service not allowed"},
            {id: EMV_CRYPTO_TLE                                         , item: "PIN Try Limit exceeded"},
            {id: EMV_CRYPTO_IAF                                         , item: "Issuer authentication failed"},
            {id: EMV_CRYPTO_RFU                                         , item: "Other values RFU"},
            
        ],
    ]
}

var emv_presentation_flags= ((stepid, classname, flags) =>  {
    let items = [];

    for(var i= 0; i <flags.length; i++) {
        let elt = {
            id: 'step_' + stepid + '_' + i,
            type: "label",
            item: flags[i],          
            class: classname == 'Flags' ? 'emv_button_show' : '', 
            events: {onmousedown: ""},            
        }
        items.push (elt)   
    }     
    return {
        id: 'step_' + stepid + '_' + classname,
        type: 'bar',
        direction: classname == 'Flags' ? 'row' : 'column',
        item:  classname == 'Flags' ? 'Related ' + classname +  ' : ' : '', 
        class: 'related-primary ' + classname,
        items: items,     
    }
} 
)    
  
const emv_Steps  = [
    {id: EMV_STEP_CARD_DETECTION_AND_RESET, info: '', item: 'Card Detection And Reset', substeps: [], 
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    Card detection and reset needs to be performed by the card interface functions specific to the hardware device being used. 
    <br>									
    When a card is reset, it will respond with an Answer To Reset (ATR) that specifies how the terminal must interface with the card.									
    <br><br>
    Once the ATR is returned with no error, the Card Reader communicates the ATR to the terminal and the session starts.
    <br><br>
    All the communication between the Card Reader and the smart card is based on APDU (Application Protocol Data Unit). 
    <br>
    The structure of the APDU is defined by [ISO 7816-4].
    <br><br>

    <i>In our example, the Demo Project represents an example of a configuration with witch the Card Reader will communicate.</i> 
    <br><br>
    It is preconfigured to read some applications like VISA, Master Card, Union Pay, ...
    <br><br>    
    The configuration of the terminal is treated in the Project Workspace Section.
    <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_CARD_DETECTION_AND_RESET, 'Flags', ['ATR']))}   
         
    </div>`
    },
    {id: EMV_STEP_CANDIDATE_LIST_CREATION,  info: '', item:'Candidate List Creation', substeps: [
        {id:  EMV_SUBSTEP_ATTEMP_DIRECTORY_LISTING_PSE, info: '', item:'Attempt Directory Listing PSE', substeps: [], 
        description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        First we select the PSE  (Payment System Environment) (1PAY.SYS.DDF01)
        <br>									
        The selection was successful (SW1/SW2=9000), so the card supports the PSE method.									
        <br><br>
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('SELECT_FILE', event)">Structure of a C-ADPU Command SELECT FILE</label></u>
        <br><br>								
        C-APDU : 00 A4 04 00 0E 31 50 41 59 2E 53 59 53 2E 44 44 46 30 31 00									
        <br>									
        P1 = 04 : Select a directory by name.									
        <br>									
        P2 = 00 : When you write the complete AID Name.									
        <br>									
        LC = 0E (14) Length of data to be sent to the card									
        <br>									
        DF = "1PAY.SYS.DDF01" :  {31 50 41 59 2E 53 59 53 2E 44 44 46 30 31}				
        <br>									
        LE = 0 : Number of data bytes expected in the response : Set to 0x00 to retrieve the complete response of up to 256 bytes.						
        <br><br>
        </div>`
        },
        {id:  EMV_SUBSTEP_READ_RECORD_SFI,  info: '', item:'Read Record SFI', substeps: [],
        description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        The data structure of any response from the card will be in TLV Format
        <br>	        
        <br>	        
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('FILE_CONTROL_INFORMATION_TEMPLATE', event)">Structure of a R-ADPU Command SELECT FILE</label></u>        						
        <br><br>			
        R-APDU :  6F 20  84 0E315041592E5359532E4444463031A50E8801015F2D086672656E64656573		
        <br>	
        To process we need the SFI (Short File Identifier tag 88)
        <br>									
        Therefore we have to decode first the returned FCI (File Control Information tag 6F)		
        <br>				
        <br>				

        <li><label class="emv_button_show" onmousedown="emv_searchtag('6F', event)">(tag 6F)</label> File Control Information  (FCI) Template,  Length: 0x20  i.e.  32, Value:  84 0E 315041592E5359532E4444463031A50E8801015F2D086672656E64656573</li>
        <li><label class="emv_button_show" onmousedown="emv_searchtag('84', event)">(tag 84)</label> Dedicated File (DF) Name, Length: 0x0E i.e. 14, Value: 315041592E5359532E4444463031</li>
        <li><label class="emv_button_show" onmousedown="emv_searchtag('A5', event)">(tag A5)</label> File Control Information (FCI) Proprietary Template, Length: 0x0E i.e. 14, Value:  8801015F2D086672656E64656573</li>
        <li><label class="emv_button_show" onmousedown="emv_searchtag('88', event)">(tag 88)</label> Short File Identifier (SFI),  Length:  01 i.e. 1, Value: 01</li>
        <li><label class="emv_button_show" onmousedown="emv_searchtag('5F2D', event)">(tag 5F2D)</label> Language Preference,  Length:  08  i.e. 8, Value:  6672656E64656573</li>
        </p>
        <p>Now we create a loop to read all records in this AEF (Application Elementary File) , started with record number 1.									
        <br>
        C-APDU : 0x00, 0xB2, recnum, [(sfi << 0x03) | 0x04], 0x00									
        </div>`
        },
        {id:  EMV_SUBSTEP_BUILD_CANDIDATE_LIST_WITH_SELECT, info: '', item:'Build Candidate List With SELECT', substeps: [], 
        description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        Check Priority
        <br>									
        Every entry contains an AID. Now we proof which of them have they highest priority.
        <br>									
        In the first run the value for the entryPrio is: 0x01. 0x01 &= 0x0F is 0x01. 0x01 is less than 0xFFFF and from
        this it follows that 0x01 is now the prio and the aid is now the entryAid.
        <br>
        In the second run the value for the entryPrio is: 0x02. 0x02 &= 0x0F is 0x02. 0x02 is greater than 0x01, the priority of this entry is lower.
        <br>
        Final Selection									
        Select The ADF with the given AID.
        </div>`
        },
    ],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    <mark>This step can be treated in the Application Selection Step but we will treat it seperatly for a better comprehension.</mark>
    <br><br>
    Candidate List Creation is the first step after the Answer to Reset ATR.
    <br><br>
    The terminal has a list containing the AID (Application Identifier) <label class="emv_button_show" onmousedown="emv_searchtag('9F06', event)">(tag 9F06)</label>,of every EMV application that it is configured to support.
    <br>
    In the same way an EMV card can contain multiple payment applications ADF (Application Definition File) <label class="emv_button_show" onmousedown="emv_searchtag('4F', event)">(tag 4F)</label>,
    <br><br>
    The value of an ADF is an AID, so ADF and AID represents the same value. You check the list of the available AID's here.
    <br><br>
    The goal in this step is that the terminal must generate a candidate list of applications that are supported by both the terminal and card.
    <br>
    There are two ways to do it: 
    <br><br>
    <li>If the card supports the Payment System Environment (PSE), the terminal reads out the necessary information to select the ADF. </li>
    <br>
    <li>If there is no PSE, the terminal will use it's list of AIDs and get the rights by trying one by one.</li>        
    <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_CANDIDATE_LIST_CREATION, 'Flags', ['AID', 'ADF', 'PSE']))}         
    </div>`        
    },
    {id: EMV_STEP_APPLICATION_SELECTION, item: 'Application Selection',  info: '', substeps: [
        {id: EMV_SUBSTEP_SET_APPLICATION,  info: '', item: 'Select Application File', substeps: [], 
        description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        When the application to use has been chosen, the terminal must select the application on the card, so that the card can supply the correct data records for the transaction.
        <br><br>
        The selection of the application is done with the C-APDU command SELECT FILE CLA: 00 INS: A4 P1: 04 P2: 00 with the DF containing the ADF (Application Definition File)
        <br><br>
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('SELECT_FILE', event)">Structure of a C-ADPU Command SELECT FILE</label></u>
        <br><br>								
        Example
        <br><br>								

        C-APDU : 00 A4 04 00 08 A0 00 00 03 33 01 01 01 00									
        <br>									
        P1 = 04 : Select a directory by name.									
        <br>									
        P2 = 00 : When you write the complete AID Name.									
        <br>									
        LC = 08 (8) Length of data to be sent to the card									
        <br>									
        DF = ADF of the selected application :  {A0 00 00 03 33 01 01 01}				
        <br>									
        LE = 0 : Number of data bytes expected in the response : Set to 0x00 to retrieve the complete response of up to 256 bytes.						
        <br>
        <i>*noticed that this command is similar to select PSE, the only difference is in this case we specify the AID, in comparaison to list * or list Foldername</i> 
        <br><br>
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('FILE_CONTROL_INFORMATION_TEMPLATE', event)">Structure of a R-ADPU Command SELECT FILE</label></u>        						
        <br><br>			
        R-APDU :  6F 20  84 0E315041592E5359532E4444463031A50E8801015F2D086672656E64656573	
        <br><br>
        The DF response is a File Control Information (FCI) Template <label class="emv_button_show" onmousedown="emv_searchtag('6F', event)">(tag 6F)</label>which value is the AID of the selected application 
        and the FCI Proprietary Template <label class="emv_button_show" onmousedown="emv_searchtag('A5', event)">(tag A5)</label> consisting of Data elements, or Data objects.
        <br>
        Some data Elements are mandatory like the Processing options Data Object List PDOL <label class="emv_button_show" onmousedown="emv_searchtag('9F38', event)">(tag 9F38)</label>.
        <br><br>
        The PDOL is a list of data elements that the card needs to receive from the terminal in order to execute the next command in the transaction process GPO.
        <br>
        The PDOL only contains the expected tagnames and their length.
        <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_APPLICATION_SELECTION, 'Flags', ['PDOL']))}   
        </div>` 
        },
        {id: EMV_SUBSTEP_GET_PROCESSING_OPTIONS,  info: '', item: 'Get Processing Options', substeps: [],
        description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        Now the terminal needs to determine two things:
        <br><br>
        <li>Which EMV functionality does the card support? </li>
        <li>Where does it keep all the information needed to use the functionality? </li>
        <br>
        To answer this question the terminal issues the Get Processing Options (GPO) command with the DF value is the data precised in the PDOL from the the previous APDU command SELECT FILE. 
        <br><br> 
        
        <mark>If PDOL is not returned the GET PROCESSING OPTIONS command uses a command data field of '8300', indicating that the length of the value field in the command data is zero.</mark>
        <br><br> 
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('GET_PROCESSING_OPTIONS', event)">Structure of the C-ADPU Command GET PROCESSING OPTIONS</label></u>
        <br><br>
        
        The card responds with a Response Message Template Format 1 <label class="emv_button_show" onmousedown="emv_searchtag('80', event)">(tag 80)</label>, or a Response Message Template Format 2 <label class="emv_button_show" onmousedown="emv_searchtag('77', event)">(tag 77)</label>

       
        <br><br>
        
        Format 1 : The value of the response contains 2 records that will be read sequently <mark>without their associated tags</mark>
        <br><br>
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('RESPONSE_MESSAGE_TEMPLATE_FORMAT_1', event)">Structure of the R-ADPU to the Command GET PROCESSING OPTIONS Format 1</u>                
        <br><br>
        Format 2 : The data object returned in the response message is a constructed
        data object with tag equal to '77'. The value field may contain several BERTLV coded objects, but shall always include the AIP and the AFL. The
        utilisation and interpretation of proprietary data objects which may be included in this response message are outside the scope of these
        specifications.
        <br><br>	        
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('RESPONSE_MESSAGE_TEMPLATE_FORMAT_2', event)">Structure of the R-ADPU to the Command GET PROCESSING OPTIONS Format 2</u>        

        <br><br>	        
        The AIP (Application Interchange Profile) <label class="emv_button_show" onmousedown="emv_searchtag('82', event)">(tag 82)</label>
        <br><br>
        <li>The AIP is a 2-byte bit array that indicates the types of functions supported by the card. We will explain this tag in Step : Data Authentification.</li> 
        <br>        
        The AFL (Application File Locator <label class="emv_button_show" onmousedown="emv_searchtag('94', event)">(tag 94)</label>
        <br><br>
        <li>The AFL is essentially a list of records the terminal should read from the card in order to use these functions.</li>
        <br><br>
        Every entry on the AFL list has 4 bytes. That is why the length of the AFL bytestring has to be a multiple of 4. 
        <br>
        The first byte contains the Short File Indicator (SFI). <mark>The five most significant bits represents the SFI.</mark>
        The SFI is a reference to a file on the card. Every file have one or more records.<label class="emv_button_show" onmousedown="emv_searchtag('88', event)">(tag 88)</label>
        <br>
        The second and third bytes are the first and last record to read. 
        <br>
        The fourth byte represents the number of records included in data authentication beginning from the Start Record									
        <br><br>
        <u>Example</u>
        <br><br>								
        For an AFL entry of 0E 01 03 02, the terminal will request record 1, 2 and 3 from file 0E. (These numbers are in hexadecimal)
        <br><br>								
        After the AFL is returned the terminal issues one or more Read Record commands. 
        <br><br>
        <br><br>        
        In the next step we explain the reading of the AFL entries.	
        <br><br> 
        ${sb.render(emv_presentation_flags(EMV_SUBSTEP_GET_PROCESSING_OPTIONS, 'Flags', ['AIP', 'AFL']))}   
        </div>`  
        },
    ],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    How to choose the application from the List Candidates created in the previous step ? 
    <br><br>
    <li>In case there was no mutually support applications added to the candidate list which means that none of the applications available on the card are matched with one of the AIDs supported by the terminal], then the terminal will terminate the card session, 
    and this concludes our journey with that card.</li>
    <br>
    <li>If there was only one mutually support application added to the candidate list, then the terminal will select this application if Application Priority Indicator <label class="emv_button_show" onmousedown="emv_searchtag('87', event)">tag 87</label>  is present and bit8 of it's value = '1', </i>
    otherwise the terminal shall requests confirmation and selects the application if the cardholder approves.
    </li>
    <br>
    <li>In case there were several mutually supported applications added to the candidate list, then the terminal will have 2 options:
    <br><br>
        - either present all the supported applications to the cardholder to make the final selection. [preferred method]
    <br><br>
        - either the terminal makes the selection based on the Application Priority Indicator.
        This option should not be used if one or more of the mutually supported applications' Application Priority Indicator is present and bit8 of it's value = '1'
    </li>
    <br><br>    
    After the terminal has completed the final selection of the EMV application in the card, it initiates the EMV transaction flow, during the initiate application processing stage.
    <br><br>    
    The terminal has two checklists, one is called TVR (Terminal Verification Results)  <label class="emv_button_show" onmousedown="emv_searchtag('95', event)">tag 95</label>, the other one is called TSI (Transaction Status Information)  <label class="emv_button_show" onmousedown="emv_searchtag('9B', event)">tag 9B</label>
    <br><br>
    <li>TSI is a 2-byte bit array that records when a particular step or process has been executed: the terminal will check off items on its TSI checklist to keep track of where the transaction is in the process.</li> 
    <br>
    <li>TVR is a 5-byte bit array that records the results of risk checks : this bit array will be used to determine how 
    to proceed with the transaction during the terminal action analysis step. Furthermore, during the conversation between the card and the terminal, the terminal will check off certain items on its TVR checklist in to make sure it doesn't
    do something stupid like accept a fraudulent payment.</li>
    <br><br>    
    Both of these checklists start as arrays of bits set to 0. Depending on how the transaction progresses, some bits will be set to 1.
    <br><br>
    During this step the terminal sets the Transaction Status Information (TSI) and Terminal Verification Results (TVR) bit arrays to all zeros.
        <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_APPLICATION_SELECTION, 'Flags', ['TSI', 'TVR']))}   
    </div>`        
    },
    {id: EMV_STEP_READ_APPLICATION_DATA,  info: '', item: 'Read Application Data', substeps: [
            {id: EMV_SUBSTEP_COMPLETE_EQUIVALENTDATA_TAGS	, item: 'Complete Equivalent Data Tags', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            Service code values common in financial cards <label class="emv_button_show" onmousedown="emv_searchtag('5F30', event)">(tag 5F30)</label>
            <br>
            First digit
                <li>1: International interchange OK</li>
                <li>2: International interchange, use IC (chip) where feasible</li>
                <li>5: National interchange only except under bilateral agreement</li>
                <li>6: National interchange only except under bilateral agreement, use IC (chip) where feasible</li>
                <li>7: No interchange except under bilateral agreement (closed loop)</li>
                <li>9: Test</li>
                <br><br>                
            Second digit
                <li>0: Normal</li>
                <li>2: Contact issuer via online means</li>
                <li>4: Contact issuer via online means except under bilateral agreement</li>
                <br><br>                
            Third digit
                <li>0: No restrictions, PIN required</li>
                <li>1: No restrictions</li>
                <li>2: Goods and services only (no cash)</li>
                <li>3: ATM only, PIN required</li>
                <li>4: Cash only</li>
                <li>5: Goods and services only (no cash), PIN required</li>
                <li>6: No restrictions, use PIN where feasible</li>
                <li>7: Goods and services only (no cash), use PIN where feasible</li>
                <br><br>
                </div>`          
            },
            {id: EMV_SUBSTEP_CHECK_MANDATORY_DATA,  info: '', item: 'Check Mandatory Data', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            When the read application data processing ends, the terminal verifies the presence of the mandatory data objects in the EMV data objects heap. 
            <br>
            The presence of the following data objects is mandatory (according to Table II-2 in Book 3 [1]):
            <br><br>
            <li>Application Expiration Date <label class="emv_button_show" onmousedown="emv_searchtag('5F24', event)">(tag 5F24)</label></li>
            <li>Application Primary Account Number (PAN) <label class="emv_button_show" onmousedown="emv_searchtag('5A', event)">(tag 5A)</label></li>
            <li>Card risk management data object list 1 (CDOL1) <label class="emv_button_show" onmousedown="emv_searchtag('8C', event)">(tag 8C)</label></li>
            <li>Card risk management data object list 2 (CDOL2) <label class="emv_button_show" onmousedown="emv_searchtag('8D', event)">(tag 8D)</label></li>
            <br><br>

            <mark>When mandatory data is missing we abort the processing of the current transaction.</mark>
            <br><br> ${sb.render(emv_presentation_flags(EMV_SUBSTEP_CHECK_MANDATORY_DATA, 'Flags', ['AED', 'PAN', 'CDOL1', 'CDOL2']))}   
            
            </div>`
            },
            {id: EMV_SUBSTEP_CHECK_MISSING_DATA	,  info: '', item: 'Check Missing Data', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            The terminal also verifies whether other data objects that are mandatory only in the context of a certain flags AIP that are set or not (bit = 1). 
            <br>
            These data objects are those needed for:
            <br><br>

            If AIP indicates that Cardholder verification is supported (bit 5 = 1 in the first Byte of AIP) 
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, Cardholder_verification_is_supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, Cardholder_verification_is_supported, 0)">See</label> 
            the terminal must verify the presence in the card of the Cardholder Verification Method (CVM) List <label class="emv_button_show" onmousedown="emv_searchtag('8E', event)">(tag 8E)</label>.
            <br><br>
            If AIP indicates that 
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, SDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, SDA_Supported, 0)">
            SDA supported
            </label>(bit 7 = 1 in the first Byte of AIP) 
            or 
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, DDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, DDA_Supported, 0)">
            DDA supported</label>or   
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, CDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, CDA_Supported, 0)">
            CDA supported
            </label> 
            we check the presence of the following tags:
            <br><br>
            <li>Certification Authority Public Key Index (PKI) <label class="emv_button_show" onmousedown="emv_searchtag('8F', event)">(tag 8F)</label> : dentifies the certification authority's public key in conjunction with the RID</li>
            <li>Issuer Public Key Certificate <label class="emv_button_show" onmousedown="emv_searchtag('90', event)">(tag 90)</label> : Issuer public key certified by a certification authority</li>
            <li>Issuer Public Key Exponent <label class="emv_button_show" onmousedown="emv_searchtag('9F32', event)">(tag 9F32)</label> : Issuer public key exponent used for the verification of the Signed Static Application Data and the ICC Public Key Certificate</li>
            <li>Issuer Public Key Remainder <label class="emv_button_show" onmousedown="emv_searchtag('92', event)">(tag 92)</label> : Remaining digits of the Issuer Public Key Modulus</li>
            <br><br>
            Moreover if DDA is supported or CDA is supported we check also the presence of the following tags: 
            <br><br>            
            <li>Integrated Circuit Card (ICC) Public Key Certificate <label class="emv_button_show" onmousedown="emv_searchtag('9F46', event)">(tag 9F46)</label> :	ICC Public Key certified by the issuer</li>
            <li>Integrated Circuit Card (ICC) Public Key Remainder  <label class="emv_button_show" onmousedown="emv_searchtag('9F48', event)">(tag 9F48)</label> : Remaining digits of the ICC Public Key Modulus</li>
            <li>Integrated Circuit Card (ICC) Public Key Exponent    <label class="emv_button_show" onmousedown="emv_searchtag('9F47', event)">(tag 9F47)</label> : Exponent ICC Public Key Exponent used for the verification of the Signed Dynamic Application Data</li>
            <br><br>
            If one of the following occurs (except for tag 9F48 and tag 9F49), the ICC data missing bit in the TVR is set to 1. 
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, ICC_data_missing, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, ICC_data_missing, 0)">See</label> 
            <br><br>
            <br><br> ${sb.render(emv_presentation_flags(EMV_SUBSTEP_CHECK_MISSING_DATA, 'Flags', ['AED', 'PAN', 'CDOL1', 'CDOL2']))}
                  
            </div>`            
        },
        ],
        description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        During the read application data stage, the terminal proceeds to the reading according to the AFL of the card described in the previous step.
        <br><br>
        This function reads all data from the Application File Locator (AFL). As we saw, the AFL identifies the files and records which are necessary for the transaction.
        <br><br> 									
        The terminal processes sequentially the entries of the AFL = F1 F2 Fn, each 4-byte.
        <br>
        For each, we repeat the sequence described below:
        <br><br>
        <li>Extract the <i>sfi</i> from the first byte, (Byte 1 & 0xF8), the five most significant bits,</li>
        <li>Extract the <i>from_record</i>, the value of the second byte,</li>
        <li>Extract the <i>to_record</i>, the value of the third byte,</li>
        <li>Check whether <i>from_record</i> <= <i>to_record</i>, <mark>in case of inconsistency, abort the processing of the current transaction.</mark></li>
        <li>For each <i>record_i</i> in [<i>from_record</i>, <i>to_record</i>], execute the C-APDU Command with P1 set to <i>record_i</i> and P2 set to (<i>sfi</i> | 0x04)</li>
        <br><br>

        For each of these READ RECORD commands, the R-APDU received from the card should reports SW1SW2 = 9000
        <br>
        The DF of each R-APDU is a READ RECORD Response Message Template <label class="emv_button_show" onmousedown="emv_searchtag('70', event)">(tag 70)</label>.
        <br><br>
        The value of this tag will contain data objects like the card PAN, the expiry date, authentication, cardholder verification plus many other tags of information that will be used for the transaction processing.
        <br>
        One of these data objects is the AUC (Application Usage Control) <label class="emv_button_show" onmousedown="emv_searchtag('9F07', event)">(tag 9F07)</label>
        <br><br> 
        <li>The AUC is a 2-byte bit array that tells the terminal whether the card: Is valid for domestic cash transaction, Is valid for international cash transaction, … The AUC will be examined in the Processing Restrictions Step</li> 
        <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_READ_APPLICATION_DATA, 'Flags', ['AUC']))}
       
        </div>`
    },            
    {id: EMV_STEP_DATA_AUTHENTIFICATION,  info: '', item: 'Data Authentification', substeps: [ 
            {id: EMV_SUBSTEP_CHECK_TERMINAL_TYPE,  info: '',  item: 'Check Terminal Type', substeps: []},
            {id: EMV_SUBSTEP_SELECTION_OFFLINE_AUTHENTIFICATION_MISM,  info: '', item: 'Selection Off-Line Authentification Mechanism', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">     
            The type of ODA performed depends on the types supported by both the card and the terminal.
            <br><br>
        
            <li>If both support CDA, CDA will be performed.</li>
            <li>If both support DDA and one or both do not support CDA; DDA is performed.</li>
            <li>If both support SDA and one or both not support CDA and DDA; SDA is performed.</li>
            <li>If both the card and terminal do not support any of the ODA types, the Offline data processing was not performed bit in the TVR is set to 1.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Offline_data_authentication_was_not_performed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Offline_data_authentication_was_not_performed, 0)">See</label> 
            </li>
            <br><br>
            </div>`  
            },
            {id: EMV_SUBSTEP_OFFLINE_SDA,  info: '', item: 'Off-Line SDA', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">            
            The off-line SDA requires two separate stages:
            <br><br>
            During the personalization stage of the card, the issuer computes the Signed Static Application Data certificate, according to the algorithm described in Section 5.8.3. 
            <br><br>
            Note that using the terminology adopted in Appendix D, Section D.6.2, the Signed Static Application Data certificate corresponds to the static authenticator Static_Auth.
            <br><br>
            This certificate is a signature created with the issuer private key ( N I , d I )on the static data to be authenticated (referred to as the financial_data in Appendix D, Section D.6.2) in 
            the card, which is formed according to Section 5.8.2. 
            <br><br>
            The issuer first proves knowledge of the appropriate credentials for obtaining writing rights in the card. 
            <br><br>
            Then, the issuer loads into the card the signed static application data, 
            which is stored as the data object with <label class="emv_button_show" onmousedown="emv_searchtag('93', event)">(tag 93)</label>, together with the certificate of the CA on the issuer public key ( N I , e I ), 
            referred to as the issuer public key certificate.
            <br><br>
            During the utilization stage, when the off-line SDA is required by the EMV transaction profile, the card submits to the terminal the data objects 
            it needs to first verify the authenticity of the issuer public key. 
            <br><br>
            If the authenticity of this key verifies correctly, the terminal can use it to check the authenticity of the signed static application data. 
            <br><br>
            If the verification passes , the terminal agrees on the authenticity of the financial data stored in the card.
             Figure 6.5: Overview of the off-line SDA.
            <br><br>
            The processing needed to verify the authenticity of the data in the card is carried out completely by the terminal, 
            while the card only stores those data objects needed for completing this verification.
            <br><br>
            Stage 1 The terminal verifies the existence of the following objects in the EMV data objects heap:
            <br><br>            
            <li>Certification Authority Public Key Index <label class="emv_button_show" onmousedown="emv_searchtag('8F', event)">(tag 8F)</label></li>
            <li>Issuer Public Key Certificate <label class="emv_button_show" onmousedown="emv_searchtag('90', event)">(tag 90)</label></li>
            <li>Issuer Public Key Remainder <label class="emv_button_show" onmousedown="emv_searchtag('92', event)">(tag 92)</label>, which is present only in certain conditions;</li>
            <li>Issuer Public Key Exponent <label class="emv_button_show" onmousedown="emv_searchtag('9F32', event)">(tag 9F32)</label></li>
            <li>Signed Static Application Data <label class="emv_button_show" onmousedown="emv_searchtag('93', event)">(tag 93)</label></li>
            <br><br>
            If any of the objects mentioned above are not present in the card (except for tag 92), set up bit 6, "ICC data missing", of byte 1 of the TVR 
            and consider that SDA has failed.
            <br><br>
            Stage 2 The terminal constructs the Static Data to Be Authenticated byte string. 
            Note that for a multithread terminal this processing can be started since the read application data is performed, 
            in parallel with the AFL processing, as described in Section 5.8.2. 
            To this end, the terminal first considers the records indicated for authentication of all the AEF(s) registered in the AFL. 
            Second, after all the records are read from the card and the EMV ¢ data objects heap is constructed , 
            the terminal considers the data objects indicated in the Static Data Authentication Tag List to be concatenated at the end of the Static Data to Be Authenticated byte string.
            <br><br>
            If the terminal fails to process any of the records considered for authentication in the AFL, static data authentication has failed.
            <br><br>

            Stage 3 The terminal verifies the authenticity of the Issuer Public Key Certificate and recovers the issuer public key ( n I , e I ), 
            following the algorithm presented in Section 5.7.1.
            <br><br>
            
            The terminal uses the Certification Authority Public Key Index (tag 8F) together with the RID to retrieve the CA public key ( n CA , e CA ) 
            from the appropriate record of the terminal database of CA public keys (see Table 5.2 in Section 5.5). 
            <br><br>
            The RID is obtained from the AID (DF Name)<label class="emv_button_show" onmousedown="emv_searchtag('84', event)">(tag 84)</label> returned in the FCI of the currently selected ADF, which contains the EMV debit/credit application. 
            The length of the modulus n CAis N CA .
            <br><br>
            If the verification of the Issuer Public Key Certificate does not pass, then the SDA has failed.
            <br><br>
            If the terminal manages a revocation list associated with the CA, which contains all the compromised issuer public key certificates, the terminal checks that the certificate serial number corresponding to the current Issuer Public Key Certificate is not blacklisted in this revocation list. If the certificate is blacklisted then the terminal sets up bit 5, "Card appears on terminal exception file", of byte 1 of the TVR register. In this case also, it is considered that the SDA has failed.
            <br><br>

            Stage 4 The terminal verifies the authenticity of the data objects personalized in the card by checking the authenticity of 
            the Signed Static Application Data certificate received from the card with the authentic copy of the issuer public key ( n I , e I ) obtained in stage 3.
            <br><br>
            This verification is performed according to the algorithm presented in Section 5.9.
            <br><br>
            If the verification of the Signed Static Application Data certificate fails, the SDA has failed.
            <br>
            Otherwise, the SDA processing is considered successful. The terminal stores the data authentication code, representing field 3 in the recovered part M R of 
            the static application data to be signed by the issuer (see Section 5.8.3), in the value field of a data object with tag 9F45 and length equal to 2 bytes.
            <br><br>
            If the terminal decides that SDA has failed in any of the four stages described above, the rest of the processing involved in the SDA stage from that point on is skipped.
            <br><br>
            The terminal will set bit 8, "Off-line data authentication was performed", in byte 1 of the TSI register.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TSIPanel, Offline_data_authentication_was_performed, 1)" onmouseup= "emv_byte_show(emv_TSIPanel, Offline_data_authentication_was_performed, 0)">See</label> 
            <br><br>
            The terminal will also set bit 7, "SDA failed", in byte 1 of the TVR register.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, SDA_failed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, SDA_failed, 0)">See</label> 
            </div>`                    
            },
            {id: EMV_SUBSTEP_OFFLINE_DDA, info: '', item: 'Off-Line DDA', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">                   
            The off-line DDA guarantees the authenticity of the data personalized in the card by the issuer, as well as that of the card itself. 
            <br><br>
            This is possible because the card has processing power and can actively compute an asymmetric cryptogram on an Unpredictable Number coming from the terminal. 
            A genuine card is able to produce a correct cryptogram for each new unpredictable number. 
            <br><br>
            When the terminal assesses off-line the correctness of this cryptogram, it accepts that the card is genuine.

            This is true with overwhelming probability, unless a powerful attacker has broken the tamper resistance of the chip to read the private key 
            of the card or has solved the "heavy" mathematical problem on which relies the computation of the asymmetric cryptogram. 
            <br><br>
            This is a big step forward when compared with cards implemented with magnetic stripe or SDA-only EMV cards. 
            The asymmetric cryptogram computed by the card consists of a digital signature produced on data received from the terminal with the ICC private key. 
            <br><br>
            In order to verify this signature, the terminal has to obtain an authentic copy of the corresponding ICC public key, which is recovered traversing the EMV certification chain CA/issuer/ICC public key.
            <br><br>
            It is important to note that the terminal has similar requirements in terms of computation power as in the case of off-line SDA. 
            However, the card has to be able to compute an RSA operation, which requires the presence of a cryptographic coprocessor in the architecture of the card.
            <br><br>
            Correspondingly, the price of the card increases . The actual ratio between the price of an EMV chip card with and without cryptographic coprocessor may vary in the range 1.25 of to 2. 
            <br><br>
            This ratio depends on whether a card producer offers "on-the-shelf" EMV cards with coprocessors or rather the developing price for this type of card is shared with the issuer. 
            <br><br>
            In the latter case, the bigger the number of ordered cards, the lower the aforementioned ratio. 
            <br>
            We can expect that this ratio will decrease over the next 5 years , proportionally with the increase of the chip's CPU computation power. 
            <br>
            At the limit, one can expect that this ratio will become 1, when the CPU will incorporate numerical units for long arithmetic.
            <br><br>
            In this section we will 
            <br><br>
            <li>First outline the DDA mechanism implemented with digital signatures.</li> 
            <li>Second, the processing performed by the terminal to verify the authenticity of the ICC public key based on traversing the EMV certification chain 
            consisting of the Issuer Public Key Certificate and the ICC Public Key Certificate is described. </li> 
            <li>Next, the processing performed by the card for computing the digital signature on the data objects sent by the terminal is presented.</li>  
            <li>Finally, how the terminal assesses the correctness of the digital signature generated by the card is explained.</li> 
            <br><br>
            </div>`      
        },
            {id: EMV_SUBSTEP_CDA, info: '', item: 'CDA', substeps: []},
        ],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    The data authentication step does not have to be performed immediately after the read application data step. 
    It only has to be performed between the read application data step and the terminal action analysis step.
    <br>
    The AIP was retrieved during the application selection step. 
    <br>
    The AIP indicates which type of Offline Data Authentication (ODA) the card supports.
    <br>
    There are three types of ODA:
    <br><br>
    <li>Combined Dynamic Data Authentication (CDA)
        <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, CDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, CDA_Supported, 0)">See</label> 
    </li>
    <li>Dynamic Data Authentication (DDA)
        <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, DDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, DDA_Supported, 0)">See</label> 
    </li>
    <li>Static Data Authentication (SDA)
        <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, SDA_Supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, SDA_Supported, 0)">See</label> 
    </li>
    <br><br>
    During the “Read application data” step the AFL indicated which records would be used in ODA (offline data authentification). 
    <br>
    The terminal, using one of the three types of ODA, authenticates this data.
    If authentication fails one of the following bits in the TVR is set to 1:
    <br><br>

    <li>CDA failed bit
        <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, CDA_failed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, CDA_failed, 0)">See</label> 
    </li>
    <li>DDA failed bit
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, DDA_failed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, DDA_failed, 0)">See</label>     
    </li>
    <li>SDA failed bit
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, SDA_failed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, SDA_failed, 0)">See</label>     
    </li>
    <br><br>
    Once ODA has been performed, the  Offline data authentication was performed  bit in the TSI is set to 1.
    <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_DATA_AUTHENTIFICATION, 'Flags', ['AIP', 'TSI']))}

    </div>`
    },      
    {id: EMV_STEP_PROCESSING_RESTRICTIONS, info: '', item: 'Processing Restrictions', substeps: [
            {id: EMV_SUBSTEP_APPLICATION_VERSION_NUMBER, info: '', item: 'Application Version Number', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            <p>Both the card and the terminal have an application version number.
            <br>
            The payment system assigns version numbers on 2 Bytes to both the card application in the Application Version  <label class="emv_button_show" onmousedown="emv_searchtag('9F08', event)">(tag 9F08)</label>, 
            and to the terminal application in the Application Version <label class="emv_button_show" onmousedown="emv_searchtag('9F09', event)">(tag 9F09)</label>.
            <br><br> 
            The encoding of these numbers is proprietary to the payment system.            
            <br><br>
            The terminal establishes the compatibility of version numbers as follows :
            <br>            
            <li>If the card does not have an application version number, the terminal assumes the numbers match</li>
            <li>If the card has an application version number and the numbers match the transaction continues as usual</li>
            <li>If the numbers do not match the  ICC and terminal have different application versions  bit in the TVR is set to 1
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, ICC_and_terminal_have_different_application_versions, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, ICC_and_terminal_have_different_application_versions, 0)">See</label> 
            </li>
            <br>
            </p>
            </div>`
            },
            {id: EMV_SUBSTEP_APPLICATION_USAGE_CONTROL, info: '', item: 'Application Usage Control', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            During the “read application data” step the terminal will have received an Application Usage Control (AUC) record in  <label class="emv_button_show" onmousedown="emv_searchtag('9F07', event)">(tag 9F07)</label>. 
            <br>
            The terminal checks whether the transaction it is processing is allowed by the AUC or not.
            <br>
            <li>If it is not allowed the  Requested service not allowed for card product  bit in the TVR is set to 1.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Requested_service_not_allowed_for_card_product, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Requested_service_not_allowed_for_card_product, 0)">See</label> 
            </li>
            <br>
            <li>A cashback transaction is a combination of a purchase transaction of goods or services</li>
            <li>A cash transaction, for which the total amount that must be authorized with the issuer, is the sum between the Amount, Authorized and the Amount, Other</li>
            <br>
            <li>The Amount, Authorized represents the amount due for the goods or services </li>
            <li>The Amount, Other refers to the amount of cash that the cardholder would like to withdraw directly from the store attendant.</li>
            <br>
            To perform the verification of the geographical usage and service restrictions, the terminal needs the following data objects:
            <br>
            -- Terminal Type tag 9F35: This encodes in 1 byte the category of the terminal, which depends on three features:
            <br>
            <li>1. Environment: attended/unattended (by an operator at the point of service);</li>
            <li>2. Communication: on-line-only/off-line with on-line capability/ off-line-only;</li>
            <li>3. Operation control: financial institution/merchant/cardholder.</li>
            <br>
            Note that the encoding of the Terminal Type is provided in the Annex A1 of Book 4 [3].
            <br><br>
            Additional Terminal Capabilities (tag 9F40 in the terminal):        
            This encodes on 5 bytes the data input and output capabilities of the terminal (see Annex A3 in Book 4 [3]).
            <br>
            The first 2 bytes of its value field indicate the Transaction Type capability, which indicates the transaction type a terminal can support: cash, goods, services, inquiry, transfer, payment, and administrative.
            Note that the two data objects described above are used to discriminate between ATM and non-ATM terminals, as follows:
            <br>
            A terminal is an ATM terminal if the value field of the Terminal Type is 14h, 15h, or 16h, and bit 8 ("Cash"), of byte 1 of the Additional Terminal Capabilities is set to 1 (i.e., the terminal has the cash disbursement capability).
            <br><br>
            Any other terminal that does not respect the aforementioned condition is not an ATM terminal.
            <br><br>
            -- Transaction Type (tag 9C in the terminal): This indicates the type of financial transaction that is actually accepted by the terminal application. The first two digits of the processing code data element (i.e., cash transaction, purchase of goods, and purchase of services), according to ISO: 8583:1993 [4], represents the transaction type. The value field of this data objects is denoted V1 in the remainder of this section.
            <br><br>
            -- Issuer Country Code <label class="emv_button_show" onmousedown="emv_searchtag('5F28', event)">(tag 5F28)</label> This indicates on 2 bytes the country code of the issuer, according to the ISO 3166 [5]. The value field of this data object is denoted V2 in the remainder of this section.
            <br><br>
            -- Terminal Country Code <label class="emv_button_show" onmousedown="emv_searchtag('9F1A', event)">(tag 9F1A)</label> This indicates on 2 bytes the country code of the terminal, according to the ISO 3166 [5]. The value field of this data objects is denoted V3 in the remainder of this section.
            <br><br>
            -- Amount, Other <label class="emv_button_show" onmousedown="emv_searchtag('9F04', event)">(tag 9F04)</label> (binary format), <label class="emv_button_show" onmousedown="emv_searchtag('9F03', event)">(tag 9F03)</label>(numeric format) in the terminal]: This indicates a secondary amount associated with a purchase of goods or purchase of services transaction, representing a cashback amount.
            <br><br>
            
            The algorithm that performs the verification of the geographical usage and service restrictions is given below:
            <br>
            If Application Usage Control (AUC) is present in the EMV heap
            <br>

            If Terminal Type is an ATM Terminal:  Check that bit 2 ("Valid at ATMs") equals 1 in byte 1 of the AUC.
            <br><br>
           
            If Terminal Type is not an ATM Terminal: Check that bit 1 ("Valid at terminals other than ATMs") equals 1 in byte 1 of the AUC.
            <br><br>
            
            <p>if Issuer Country Code is present in the EMV heap <label class="emv_button_show" onmousedown="emv_searchtag('5F28', event)">(tag 5F28)</label> = V2
            <br>
            Terminal Country Code <label class="emv_button_show" onmousedown="emv_searchtag('9F1A', event)">(tag 9F1A)</label> = V3

            <br><br>

            <p>If V1 = "Cash Transaction" (01 = Debits/Cash , 17-19 = Debits/ Cash advance with credit cards)
            <li>If V2 = V3 Check that bit 8 ("Valid for domestic cash transactions") equals 1 in byte 1 of the AUC.</li>
            <li>If V2 V3 Check that bit 7 ("Valid for international cash transactions") equals 1 in byte 1 of the AUC.</li>
       
            <br><br>

            If V1 = "Purchase of Goods" (00 = Debits/Goods and Services)
            <li>If V2 = V3 Check that bit 6 ("Valid for domestic goods") equals 1 in byte 1 of the AUC.</li>
            <li>If V2 V3 Check that bit 5 ("Valid for international goods") equals 1 in byte 1 of the AUC.</li>
            <br><br>
            
            If V1 = "Purchase of services" (00 = Debits/Goods and Services)
            <li>If V2 = V3 Check that bit 4 ("Valid for domestic services") equals 1 in byte 1 of the AUC.</li>
            <li>If V2 V3 Check that bit 3 ("Valid for international services") equals 1 in byte 1 of the AUC.</li>
            <br><br>
            
            If V1 = "Purchase of goods/services" (00 = Debits/Goods and Services) and Amount, Other is present in the EMV data objects heap
            <li>If V2 = V3 Check that bit 8 ("Domestic cashback allowed") equals 1 in byte 2 of the AUC.</li>
            <li>If V2 V3 Check that bit 7 ("International cashback allowed") equals 1 in byte 2 of the AUC.</li>
            </p>
            <br><br>
            If any of the verifications specified above fail, set to 1 bit 5, Requested service not allowed for card product, in byte 2 of the TVR.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Requested_service_not_allowed_for_card_product, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Requested_service_not_allowed_for_card_product, 0)">See</label> 
            <br>
            Continue processing as indicated in Section 6.5.3.
            
            </p>
            </div>`
            },        
            {id: EMV_SUBSTEP_APPLICATION_EFFECTIVE_EXPIRATION_DAT, info: '', item: 'Application Effective Expiration Dates', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            Sometimes a card is issued that is not valid yet at the moment of issuing.
            <br><br>
            This can be set on the card in the Application Effective Date record <label class="emv_button_show" onmousedown="emv_searchtag('5F25', event)">(tag 5F25)</label>.
            <br>
            If the card has an Application Effective Date and it is after the current date, the
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Application_not_yet_effective, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Application_not_yet_effective, 0)">
            Application not yet effective
            </label> bit in the TVR is set to 1. Otherwise nothing is set.
            <br><br>
            The card has also an expiration date <label class="emv_button_show" onmousedown="emv_searchtag('5F24', event)">(tag 5F24)</label>.
            <br>
            The card gives the Application Expiration Date to the terminal during the Read application data step.
            <br>
            If this date is in the future, the transaction continues normally. Otherwise the 
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Expired_application, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Expired_application, 0)">
            Expired Application
            </label>bit in the TVR is set to 1.  
            <br>
            <br><br>
            </div>`
            },    
        ],            
    description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    Sometimes a card may be restricted for use in a specific country, or for a specific service. Or a card may be expired, or outdated.
    <br><br>
    The aim of the processing restrictions is to determine the degree of compatibility between the EMV debit/credit application in the card and in the terminal,
    and to make any necessary adjustments, including the rejection of the transaction. 
    <br><br>
    During the “processing restrictions” step the terminal checks three things:
    <br><br>    
    <li>Whether the application version on the card is the same as on the terminal</li>
    <li>Whether the type of transaction is allowed</li>
    <li>And whether the card is valid and not expired</li>
    <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_PROCESSING_RESTRICTIONS, 'Flags', ['AUC']))}
    </div>`
    },              
    {id: EMV_STEP_CARD_HOLDER_VERIFICATION, info: '', item: 'Card Holder Verification', substeps: [
            {id: EMV_SUBSTEP_CHECK_CVM_RULES, info: '', item: 'Check CVM Rules', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            Depending on the results of the CVM processing the following bits in TVR Byte 3 may be set to 1 in the TVR:
            <br><br> 
            <li>
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel,  Cardholder_verification_was_not_successful, 1)" onmouseup= "emv_byte_show(emv_TVRPanel,  Cardholder_verification_was_not_successful, 0)">
            Cardholder verification was not successful</label></li>
            <li>Unrecognized CVM</li>
            <li>PIN Try Limit exceeded</li>
            <li>PIN entry required and PIN pad not present or not working</li>
            <li>PIN entry required, PIN pad present, but PIN was not entered</li>
            <li>Online PIN entered</li>
            <br><br>             
            If the Card Holder Verification step was run, the Cardholder verification was performed bit in the TSI will be set to 1.
            <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TSIPanel, Cardholder_verification_was_performed, 1)" onmouseup= "emv_byte_show(emv_TSIPanel, Cardholder_verification_was_performed, 0)">See</label> </li> 
            <br><br> 
            </div>`
            },  
        ],
    description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    EMV offers additional tools for the cardholder to prove that he or she is the rightful holder of the card. 
    <br>
    These tools are called Cardholder Verification Methods (CVM) <label class="emv_button_show" onmousedown="emv_searchtag('8E', event)">(tag 8E)</label> includes:

    <br><br>  
        <li>Online PIN</li>
        <li>Offline Enciphered PIN</li>
        <li>Offline Plaintext PIN</li>
        <li>Signature</li>
        <li>No-CVM</li>
    <br><br>  

    Explaining how a CVM is selected and how each CVM method works is a question on its own. 
    <br>    
    The most important take away here is that some manner of CVM is performed, and the results of the CVM processing will set a number of bits in the TVR and TSI.
    <br>    
    The cardholder verification stage allows the terminal to verify the link between the person at the point of service and the eligible cardholder to whom the application in the card was issued.
    <br>    
    This stage can be performed any time after the completion of the read application data stage and before finalizing the terminal action analysis stage.
    <br><br>  

    <u>Cardholder verification methods in EMV</u>
    <br><br>  

    The EMV standard accepts several CVMs, which are discussed below. 
    <br>    
    A method number on 6 bits, which is indicated in parentheses, is associated with each CVM, according to Annex C.3, in Book 3 [1].
    <br><br>  

    No CVM required (011111b): This method consists of accepting without proof that the person at the point of service is that to whom the card was issued. 
    <br>    
    For example, at a point of service for paying a highway toll, an operator will capture the card data without requiring the cardholder verification. 
    <br>    
    This is mainly for providing the convenience of the service and the fluency of the traffic in the conditions when the transaction amount is low.

    <br><br>  
    
    Fail CVM processing (000000b): The card uses this method to force a CVM failure in the terminal. 
    <br>    
    This can lead the terminal to force an on-line connection to the issuer, which could further analyze the card status and apply exceptional risk management policies.
    <br><br>  

    Signature (paper) (011110b): This CVM, explained in Appendix D, Section D.5.1, can be applied for credit card products at a point of service that is attended by an operator. 
    <br>    
    The method consists of comparing the signature produced by the card user on the sales slip against the witness signature of the cardholder written on the back side of the card. 
    <br>    
    The EMV preserved this method, since in some countries the legislation requires a handwritten signature as a proof of the cardholder's participation in a transaction.

    <br><br>  
    
    Enciphered PIN verified on-line (000010b): This method is common for debit and credit card products used in unattended environments, when they are implemented with the magnetic stripe technology. 
    <br>    
    The EMV also accepts this method for chip-based card products. 
    <br>    
    The cardholder types his or her PIN in the terminal's PIN pad. 
    <br>    
    The terminal encrypts it using a symmetric encryption mechanism. 
    <br>    
    The IH receives this cryptogram, decrypts it in a secure module, which computes a PIN image control value that is compared against a witness value kept in the cardholder database, referred to as the PIN image stored value. 
    <br>    
    Details of this CVM are presented in Appendix D, Section D.5.2. 
    <br>    
    One reason for keeping this CVM for EMV chip products could be that there are issuers that do not trust the transmission in clear of the cardholder's PIN on the interface between the terminal and the chip card. 
    <br>    
    The terminal implementing this CVM has to be equipped with an on-line PIN pad, which is a tamper resistant device that ensures that the PIN of the cardholder never leaves the PIN pad in clear, but just in an encrypted form.

    <br><br>  

    Plaintext PIN verification performed by ICC (000001b): This is a costeffective cardholder verification method, which is specific for chip card products. 
    <br>    
    The terminal captures the PIN from the user and sends it in clear to the chip card. 
    <br>    
    The chip compares the value received with a witness value stored in its permanent memory since the personalization stage. 
    <br>    
    The method is described in Appendix D, Section D.5.3. 
    <br>    
    Issuers that do not consider the threat of eavesdropping on the interface terminal-card prefer this method to on-line enciphered PIN since implementing it is cheaper and it allows the off-line completion of an EMV transaction at an unattended terminal. 
    <br>    
    The terminal implementing this CVM has to be equipped with an off-line PIN pad, which is a tamper resistant device such that capturing the PIN of the cardholder on the interface card-terminal is difficult.
    <br>    
    Note that EMV supports a combined cardholder verification method, which is referred to as the plaintext PIN verification performed by ICC and signature (paper) (000011b).

    <br><br>  

    Enciphered PIN verification performed by ICC (000100b): This is an expensive cardholder verification method, which is applicable for chip card products able to perform RSA operations. 
    <br>    
    The terminal captures the PIN from the user and sends it encrypted in an RSA envelope to the chip card. 
    <br>    
    The chip decrypts the envelope, retrieves the PIN in clear, and compares the retrieved value with a witness value stored in its permanent memory since the personalization stage. 
    <br>    
    The method is described in Appendix D, Section D.5.5. Issuers that would like to complete transactions off-line and that consider the threat of eavesdropping on the interface terminal-card implement this method. 
    <br>    
    The terminal implementing this CVM has to be equipped with an off-line PIN pad.
    <br>    
    Note that EMV supports a combined cardholder verification method, which is referred to as enciphered PIN verification performed by ICC and signature (paper) (000101b).
    <br>    
    There are some method numbers that are reserved for further use:

    <br><br>  
    000110 “011101: method numbers to be assigned by EMV, for example, for biometrics (see Appendix D, Section D.5.6);
    <br><br>  
    100000 “101111: method numbers to be assigned by the individual payment systems ” a possible candidate is a one-time password scheme (see Appendix D, Section D.7.3);
    <br><br>  
    110000 “111110: method numbers to be assigned by individual issuers.
    <br><br> ${sb.render(emv_presentation_flags(EMV_STEP_CARD_HOLDER_VERIFICATION, 'Flags', ['CVM']))}
    </div>`
    },               
    {id: EMV_STEP_TERMINAL_RISK_MANAGEMENT, info: '', item: 'Terminal Risk Management', substeps: [
            {id: EMV_SUBSTEP_EXCEPTION_LIST_CARDS_CHECKING, info: '',  item: 'Exception List Cards Checking', substeps: []}, 
            {id: EMV_SUBSTEP_CB_REGISTERED_BIN_CHECKING, info: '', item: 'CB registered Bin Checking', substeps: []}, 
            {id: EMV_SUBSTEP_FLOOR_LIMIT_CHECKING, info: '',   item: 'Floor Limit Checking', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            Floor Limit Checking:
            <br>    
            Terminal may have a Transaction Log of approved transactions
            <br>    
            Transaction Log contains (at least) for each approved transaction:
            Card s PAN
            <br>    
            Amount
            <br>    
            Terminal checks if Log contains approved transactions for the same PAN with which current transaction is performed.
            <br>    
            The terminal adds the Amount for current transaction to amount stored in the log for that PAN and checks if sum >= Terminal Floor Limit.
            <br>    
            If sum >= Terminal Floor Limit, terminal sets the  Transaction exceeds floor limit  bit in TVR (Terminal Verification Results, Tag 95) to 1
            <br>    
            An effective security measure against attempts to overspend is to check that the amount involved in a transaction does not exceed a floor limit established by the acquirer, referred to as the Terminal Floor Limit.				
            <br>    
            However, if the cardholder colludes with the shopkeeper , an amount over the floor limit needed to buy one expensive item can be split into two distinct amounts below the floor limit, which are authorized in two separate transactions with the same card at the same terminal. This kind of threat is called a split sale.				
            <br>    
            If the acquirer is willing to provide security protection against split sales, the terminal has to have enough storage space to accommodate a transaction log like that presented in Table 6.7.				
            <br>    
            Table 6.7: Transaction Log as a Security Protection Against Split Sales				
            <br>    
                Application PAN	Amount, Authorized	Application PAN Sequence Number	Transaction Date
            <br>    
            Transaction 1	PAN1	Amount 1	PAN Seq1	10/5/2001
            <br>    
            Transaction 2				
            <br>                                
            Transaction 1,000	PAN1	Amount 2	PAN Seq1	10/5/2001
            <br>                    
            The processing performed by the terminal for each new EMV ¢ transaction is described by the following actions.				
            <br>    
            1. Use the Application PAN and optionally the Application PAN Sequence Number of the card involved in the current transaction to search for an existing record in the transaction log.				
            <br>    
            2. If there is such a record, add the value of the Amount, Authorized field in the current transaction (Amount 2) with the Amount, Authorized field in the most recent transaction (Amount 1) with the same Application PAN/PAN sequence number. 				
            <br>    
            The cumulated value of the two transactions represents the total.				
            <br>    
            If the value of total is greater than or equal to the value field of the Terminal Floor Limit data object with tag 9F1B in the terminal, then set bit 8, "Transaction exceeds floor limit", in byte 4 of the TVR.				
            <br>    
            Record the new transaction (e.g., at index 1,000) within the transaction log and end the processing.				
            <br>    
            3. In case there is no such record in the transaction log, or the terminal does not keep a transaction log, the terminal checks whether the value of the Amount, Authorized in the current transaction is greater than or equal to the value field of the Terminal Floor Limit.				
            <br>    
            If this is true, the terminal sets bit 8, "Transaction exceeds floor limit", in byte 4 of the TVR.</div>				
            <br>    
            `}, 
            {id: EMV_SUBSTEP_RANDOM_TRANSACTION_SELECTION, info: '',  item: 'Random Transaction Selection', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            <p>A terminal may randomly select a transaction. If the transaction is selected the  Transaction selected randomly for online processing  bit in the TVR will be set to 1.
            For each application:
            <br>    
            Target Percentage to be used for Random Selection (in the range of 0 to 99)
            <br>    
            Threshold Value for Biased Random Selection (which must be zero or a positive number less than the floor limit)
            <br>    
            Maximum Target Percentage to be used for Biased Random Selection (also in the range of 0 to 99 but at least as high as the previous Target Percentage to be used for Random Selection). This is the desired percentage of transactions just below the floor limit that will be selected by this algorithm.
            <br>    
            Amount < Threshold Value for Biased Random Selection:
            <br>    
            Terminal generates random number in the range of 1 to 99
            <br>    
            If this random number <= Target Percentage to be used for Random Selection, terminal sets  Transaction selected randomly for online processing  bit in TVR to 1
            <br>    
            Threshold Value for Biased Random Selection <= Amount < Floor Limit:
            <br>    
            Terminal generates random number in the range of 1 to 99
            <br>    
            Interpolation Factor = (Amount   Threshold Value) / (Floor Limit   Threshold Value)
            <br>    
            Transaction Target Percent = ((Maximum Target Percent   Target Percent) X Interpolation Factor) + Target Percent
            <br>    
            If this random number <= Transaction Target Percent, terminal sets  Transaction selected randomly for online processing  bit in TVR to 1
            <br>    
            o   Example calculation for Random Transaction Selection
            <br>    
            §  Floor Limit=50$
            <br>    
            §  Target Percentage = 40%
            <br>    
            §  Threshold value = 45$( Threshold value for Biased Random Selection)
            <br>    
            §  Maximum Target Percentage = 55%
            <br>    
            
            §  Case1:
            <br>    
                   Amount < Threshold Value
            <br>    
                   Amount = 35$
            <br>    
            Ø  1a:
            <br>    
            §  Terminal generated Random number = 23
            <br>    
            §  Because random number <= Target Percentage so transaction would go to online
            <br>    
            §  Terminal sets  Transaction selected randomly for online processing  bit in TVR to 1
            <br>    
            Ø  1b:
            <br>    
            o    Terminal generated Random number = 42
            <br>    
            o   Because random number> Target Percentage so transaction would not go online
            <br>    
            §  Case2:
            <br>    
                   Floor Limit>Amount>=Threshold Value
            <br>    
                   Amount = 48$
            <br><br>                           
            Ø  2a:
            <br>    
            o   Terminal generated Random number = 23
            <br>    
            o   Interpolation Factor = (Amount   Threshold Value) / (Floor Limit   Threshold Value)=48-45/50-45=3/5=0.6
            <br>    
            o   Transaction Target Percent = ((Maximum Target Percent   Target Percent) X Interpolation Factor) + Target Percent = ((55-40)X 0.6)+40 =  9+40 =  49
            <br>    
            o   Random Number<Transaction Target Percentage then transaction would go to online
            <br>    
            o   terminal sets  Transaction selected randomly for online processing  bit in TVR to 1
            <br>    
            Ø  2b:
            <br>    
            o   Terminal generated Random number = 52
            <br>    
            o   Because random number> Target Percentage so transaction would not go online            
            <br>    
            </p></div>`
            }, 
            {id: EMV_SUBSTEP_VELOCITY_CHECKING,  info: '', item: 'Velocity Checking', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            <br>
            Only Performed if Card contains Lower Consecutive Offline Limit <label class="emv_button_show" onmousedown="emv_searchtag('9F14', event)">(tag 9F14)</label> and 
            Upper Consecutive Offline Limit <label class="emv_button_show" onmousedown="emv_searchtag('9F23', event)">(tag 9F23)</label>
            <br><br>
            Terminal sends a GET DATA Command for the ATC (Application Transaction Counter), <label class="emv_button_show" onmousedown="emv_searchtag('9F36', event)">(tag 9F36)</label><br>
            Card responds on GET DATA Command for the ATC (Application Transaction Counter), <label class="emv_button_show" onmousedown="emv_searchtag('9F36', event)">(tag 9F36)</label><br>
            Terminal sends a GET DATA Command for the Last Online ATC <label class="emv_button_show" onmousedown="emv_searchtag('9F13', event)">(tag 9F13)</label><br>
            Card responds on GET DATA Command for the Last Online ATC <label class="emv_button_show" onmousedown="emv_searchtag('9F13', event)">(tag 9F13)</label>
            <br><br>
                   <li>If (ATC   Last Online ATC) > Lower Consecutive Offline Limit, Terminal sets  Lower consecutive offline limit exceeded  bit in TVR to 1</li>
                   <li>If (ATC   Last Online ATC) > Upper Consecutive Offline Limit, Terminal sets  Upper consecutive offline limit exceeded  bit in TVR to 1</li>
                   <li>If Last Online ATC = 0, Terminal sets  New Card  bit in TVR to 1</li>
            <br><br>
            If a card has not been online in a while this may indicate fraudulent usage.
            <br> 
            In order to combat this, a card may have a Lower Consecutive Offline Limit (LCOL) and a Upper Consecutive Offline Limit (UCOL) set.
            <br><br>
            If the LCOL and UCOL have been provided to the terminal, it must do velocity checking.
            <br><br>
            The terminal will first request the Application Transaction Counter (ATC) and the Last Online ATC Register using the GET DATA command.
            <br>

            The ATC is a counter that is incremented by 1 every time a transaction is performed. 
            <br>
            The Last Online ATC Register is set to the value of the ATC when a transaction has been online.
            <br>
            The difference between them is the number of transactions that have been performed offline.
            If the difference is higher than the LCOL
            The  Lower consecutive limit exceeded  bit in the TVR is set to 1
            If the difference is also higher than the UCOL
            The  Upper consecutive limit exceeded  bit in the TVR is also set to 1
            If the Last Online ATC Register is 0
            The “New card” bit in the TVR will be set to 1
            Once this step has been performed the  Terminal risk management was performed  bit in the TSI is set to 1.
            </p></div>`
            },        
        ],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    The goal of terminal risk management is to protect the payment system from fraud.
    <br><br>    

    This step is performed only if Byte 1, Bit 4 
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, Terminal_risk_management_is_to_be_performed, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, Terminal_risk_management_is_to_be_performed, 0)">
    Terminal Risk Management is to be performed </label>
    is set to 1 in the Application Interchange Profile (AIP) 
    <br><br>  
    
    Regardless of the coding of the card's AIP, concerning support of terminal risk management, a terminal may support an exception file (black list) per application. 
    <br><br>      
    To acheive this, these are the 2 substeps performed in Terminal Risk Management:
    <br><br>      
    <li>Exception List Cards Checking</li>
    <li>CB registered Bin Checking</li>
    <br><br>  

    When this file exists, the terminal verifies that the Application PAN and, optionally, 
    the Application PAN Sequence Number of the card involved in the current transaction cannot be found in the exception file.
    <br><br>
   
    If a match is found in the exception file, the terminal shall set to 1 bit 5, "Card appears in exception file", in byte 1 of the TVR.
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Card_appears_on_terminal_exception_file, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Card_appears_on_terminal_exception_file, 0)">See</label> 
    <br><br>
    The risk of fraud is smaller when the terminal requests online approval from the issuer for a transaction.
    To determine whether the transaction should go online, the terminal checks three things:
    <br><br>
    <li>If the transaction is above the offline floor limit</li>
    <li>If the card has not had an online authorization in a while</li>
    <li>Whether it wants to randomly select this transaction to go online</li>
    <br><br>
    To acheive this, these are the 3 substeps performed in Terminal Risk Management:
    <br><br>    
    <li>Floor Limit Check</li>
    <li>Random Transaction Selection</li>
    <li>Velocity Checking</li>
    <br><br>
    Including the terminal risk management stage in the EMV transaction flow protects the issuer, acquirer, and payment system against fraud, through several security measures: floor limit checking, random transaction selection, and velocity checking.
    <br><br>

    The processing in this stage can be performed any time after the read application data stage and before issuing the first GENERATE AC command. 
    <br><br>
    
    The results of the terminal risk management are recorded in the fourth byte of the TVR register.
    <br><br>

    This stage is included in the EMV transaction flow only in case bit 4, "Terminal risk management is to be performed", in the first byte of the AIP is set to 1. 
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, Terminal_risk_management_is_to_be_performed, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, Terminal_risk_management_is_to_be_performed, 0)">See</label> 
    Otherwise, the terminal skips the processing implied by any of the three aforementioned security mechanisms.
    <br><br>

    After completing the processing in the terminal risk management stage, the terminal sets to 1 bit 4, "Terminal risk management was performed", in byte 1 of the TSI register.
    <br><br>

    <div class="related-primary"><br>Related Flags: </br></div>       
    </div>`
    },             
    {id: EMV_STEP_TERMINAL_ACTION_ANALYSIS, info: '', item: 'Terminal Action Analysis', substeps: [
            {id: EMV_SUBSTEP_ACTION_IF_DENIAL, info: '', item: 'Action If Denial', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">

            For each bit in the TVR with value 1, the terminal checks the corresponding bit in the Issuer Action Code “Denial and Terminal Action Code “Denial.
            <br><br>
            Together, these two registers specify the conditions that determine the denial of a transaction without attempting to go on-line. 
            <br>
            If the corresponding bit in either of the two action code registers is set to 1, the terminal decides to reject the transaction according to the indication of either the issuer or the acquirer. 
            <br>
            The transaction is declined off-line.
            <br><br>
            In this case the terminal issues a GENERATE AC command, requiring the card to produce an AAC on the data related to the transaction at the point of service.
            <br>
            To this end, the reference control parameter, which is P1 in the C-APDU, is set to 00h (see Section 6.8.6 for the significance of the C-APDU of the GENERATE AC ).
            <br><br>
            After receiving this command, the card produces the requested AAC, since this is the lowest decision level.
            <br>
            Consequently, bits 8 and 7 are set to 0 in the Cryptogram Information Data, returned in the R-APDU of the GENERATE AC command, encoding the AAC.
            <br><br>
            The AAC returned by the card indicates:
            <br>
            <br>A rejection of the transaction due to unacceptable business risks;</br>
            <br>A restriction that disallows the use of the card in certain business environments.
            <br>
            This is the case when the use of a card is not compatible with certain merchant categories, or there is an incompatibility resulting from processing restrictions
            related to the AUC.
            
            The card may optionally distinguish between these cases and may return appropriate codes in the least significant 3 bits (bit 3, bit 2, and bit 1), referred to as reason/advice/referral code of the Cryptogram Information Data:
            000 ”no information given;
            001 ”service not allowed;
            010 ”PIN try limit exceeded;
            011 ”issuer authentication failed (available for the second GENERATE AC );
            XXX ”other values RFU.
            
            Correspondingly, the terminal application may choose adequate messages to inform the cardholder about the rejection of the transaction.
            <br>
            In certain exceptional cases, like the situation when the PIN try limit is exceeded, the issuer may wish that the card asks the terminal to form and send 
            an advice request message (1220 in the ISO 8583 notation; see Section 2.8.2). 
            <br><br>
            This advice request message is sent separately from either an authorization request or a clearing message. 
            In this case the card positions bit 4 in the Cryptogram Information Data to 1, which means "advice (message) required".
            <br>
            When the AAC is forwarded to the issuer, it proves that the card was present during the denied transaction.
            </div>`
            }, 
            {id: EMV_SUBSTEP_ACTION_IF_ONLINE, info: '', item: 'Action If OnLine', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            
            If the terminal is "off-line-only" (with Terminal Type in the set of values 13, 23, 16, 26, 36), the analysis described in this section is meaningless.
            <br><br>

            For "on-line-only" or "off-line with on-line capability" terminals, 
            if the terminal does not reject the transaction off-line, the terminal action analysis continues with the evaluation of the bits in the TVR with respect to the pair of registers Issuer Action Code “On-line and Terminal Action Code “On-line. 
            <br><br>

            Together, these two registers specify the conditions that cause a transaction to be completed on-line.
            <br><br>
          
            For each bit in the TVR with value 1, the terminal checks the corresponding bits in the Issuer Action Code “On-line and Terminal Action Code “ On-line. 
            <br><br>
            If the corresponding bit in either of these two action code registers is set to 1, the terminal shall require the on-line completion of the transaction processing.
            <br><br>
            In this case the terminal issues a GENERATE AC command, requiring the card to produce an ARQC on the data related to the transaction at the point of service. 
            <br><br>
            To this end the reference control parameter, P1 in the C-APDU, has bit 8 and bit 7 set to 1 and 0, respectively (see Section 6.8.6). 
            <br>            
            The terminal may explicitly ask for a combined DDA/AC generation, in case the combined off-line DDA and GENERATE AC is indicated in bit 2 of the AIP and the terminal also supports combined DDA/AC generation (Section 6.4.1). 
            <br><br>
            In this case, bit 6 in the reference control parameter, P1 in the C-APDU, is set to 1. 
            <br><br>
            In case CDOL1 includes the tag 9F33, corresponding to the terminal capabilities, the card can determine by itself whether the combined DDA/AC generation should be performed, indifferent of the value of bit 6 in the reference control parameter (see also Section 6.8.6.1).
            <br>
            After receiving this command, the card risk management decides whether the terminal's ARQC decision is acceptable or this decision should be overridden with one of the lower decision levels, 
            either AAR (referral) or AAC (rejection).
            <br><br>
            First, if the card risk management decides to reject the transaction, then the AAC is returned. 
            <br>
            Consequently, the Cryptogram Information Data in the R-APDU encodes the AAC as detailed in Section 6.8.3. This concludes the EMV processing.
            <br><br>
            Second, if the card decides to ask for a referral, then the AAR is returned. Consequently, the Cryptogram Information Data in the R-APDU encodes the AAR as follows: bit 8 = 1, bit 7 = 1, bit 4 = 0 (no advice request message is required). Bit 3 through bit 1 indicate the reason why the referral was required.
            <br>            
            The terminal application chooses, based on some proprietary policies of the payment system, how to further process the AAR.
            <br>            
            After receiving the AAR, the terminal could provide by itself an Authorization Response Code (tag 8A), based, for example, on the referral reason of the card. 
            <br>            
            According to Annex A6 in Book 4 [3], this code can have one of the following meanings:
            <br>            
            Off-line approved (Y1)/Off-line declined (Z1);
            Approval (after card-initiated referral) (Y2)/Decline (after cardinitiated referral) (Z2);
            Unable to go on-line, off-line approved (Y3)/Unable to go on-line, offline decline (Z3).
            <br>            
            The terminal proceeds to the issuance of a second GENERATE AC , requiring either TC (codes Y1, Y2, or Y3) or AAC (codes Z1, Z2, or Z3), which will conclude the transaction. 
            <br>            
            Note that the Authorization Response Code is a data item included in the CDOL2 (see Section 6.8.6.1).
            <br>            
            Otherwise, the terminal could use the AAR as an ARQC and go on-line to get further advice from the issuer on whether to authorize the transaction.
            <br>            
            Third, if the card agrees with the terminal's decision level, then the ARQC is returned. 
            <br>            
            Consequently, the Cryptogram Information Data in the R-APDU encodes the ARQC as 80h (bit 8, bit 7 = 10, bit 6 = 0, bit 5 “bit 1 = 0). 
            <br>            
            The on-line processing of the ARQC is described in Section 6.9.
            <br><<br>            
            </div>`        
            }, 
            {id: EMV_SUBSTEP_ACTION_IF_APPROVED, info: '', item: 'Action If Approved', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            </div>`                                
            },          
        ],
    description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    In the terminal action analysis stage, the terminal evaluates the results of the processing performed during the current EMV transaction and decides whether the transaction should be approved off-line, transmitted on-line to be authorized by the issuer, or declined off-line.
    <br><br>

    Up until now several bits on the TVR have been set so the terminal can make a decision about which action to take:  decline the transaction, complete it offline or complete it online.
    <br><br>    
    The evaluation consists of interpreting the content of the TVR against two sets of registers which are referred to as the Issuer Action Codes IAC and the Terminal Action Codes TAC. 
    Each set of registers encodes the security policies considered by the issuer and by the acquirer in case 1 bit in the TVR is 1, 
    determining the action to be performed by the terminal.

    <br><br>    
    Both the terminal and the card have settings that determine the action to take based on the TVR.
    <br>
    The settings on the card are called Issuer Action Codes (IAC). 
    <br>
    The settings on the terminal are called Terminal Action Codes (TAC).    
    <br>
    Each set contains three registers:  three IACs and three TACs:
    <br><br>

    <li>TAC/IAC Denial</li>
    <li>TAC/IAC Online</li>
    <li>TAC/IAC Default</li>
    <br><br>
   
    Each register  is a 5 Byte bit arrays encoded just like the TVR  . 
    
    <br><br>
    The set of registers that encodes the security policies of the issuer is as follows :
    <br><br>
    <li>Issuer Action Code-Denial (tag 9F0E): This register specifies the issuer's conditions that cause the denial of a transaction without attempting to go on-line. <mark> If this register is not personalized in the card, the terminal considers, by default, that all the bits are set to 0.</mark></li>
    <br>
    <li>Issuer Action Code-On-line (tag 9F0F): This register specifies the issuer's conditions that cause a transaction to be transmitted on-line. <mark> If this register is not personalized, the terminal considers by default that all the bits are set to 1.</mark></li>
    <br>
    <li>Issuer Action Code-Default (tag 9F0D): This register specifies the issuer's conditions that cause a transaction to be rejected if it might have been approved on-line but the terminal is unable to transmit the transaction on-line. <mark> If this register is not personalized, the terminal considers, by default, that all the bits are set to 1.</mark></li>
    <br><br>

    The bits in these registers are set according to the security policies established by the issuer concerning the action to be taken in case a failure appears during 
    the EMV processing.     
    <br><br>    
    The set of registers that encodes the security policies of the acquirer is as follows:
    <br><br>    
    <li>Terminal Action Code-Denial (tag DF57): This register specifies the acquirer's conditions that cause the denial of a transaction without attempting to go on-line.<mark> If the acquirer specifies no value for this register, the terminal considers by default that all the bits are set to 0.</mark></li>
    <br>
    <li>Terminal Action Code-On-Line (tag DF58): This register specifies the acquirer's conditions that cause a transaction to be transmitted on-line.<mark> If this register is not personalized, the terminal considers, by default, that all their bits are set to 0.</mark></li>
    <br>
    <li>Terminal Action Code-Default (tag DF56): This register specifies the acquirer's conditions that cause a transaction to be rejected if it might have been approved on-line, but the terminal is unable to transmit the transaction on-line.<mark> If this register is not personalized, the terminal considers, by default, that all their bits are set to 0.</mark></li>
    <br><br>

    It is strongly recommended, however, that at least the following bits in the first byte of the last two registers be set to 1 by the acquirer:
    Bit 8: Off-line data authentication was not performed.
    Bit 7: Off-line SDA failed.
    Bit 4: Off-line DDA failed.

    <br><br>

    The process is as follow: for each type of register we do an OR operation between the TAC_x and the IAC_x followed by an AND operation between the result and the TVR: (TAC_x | IAC_x) & TVR  
    <br>
    The sequence of the process is:
    <br><br>
    <li>If there is no match between the TVR and the denial action codes, the terminal will compare the Online action codes and the TVR</li>
    <li>If there is a match between the online action codes and the TVR the terminal will request to approve the transaction online</li>
    <li>If there is no match between the online action codes and the TVR the terminal will request to approve the transaction offline</li>   
    <br><br>

    <u>Example 1</u>
    <br><br>    
    Let's assume this the denial action code.

    <br><br>
    <li>IAC:    00110011 00000000 00000000 00000000 00000000</li>
    <li>TAC:    01010101 00000000 00000000 00000000 00000000</li>
    <li>Result: 01110111 00000000 00000000 00000000 00000000</li>
    <br>
    The Result is called an OR operation.
    The denial result is then compared with the TVR. If any bits match, the terminal will request to decline the transaction. 
    <br><br>
    <li>Result: 011<mark>1<?mark>0111 00000000 00000000 00000000 00000000</li>
    <li>TVR:    100<mark>1</mark>0000 00000000 00000000 00000000 00000000</li>
    <br>
    As we can see in the example, a bit between the denial action codes and the TVR matches. 
    <br>
    This means the terminal will decline the transaction.
    <br><br>
    <u>This is only a preliminary decision. The terminal has to ask the card for confirmation of its decision.
    The card may change the decision. This will be done during the next step: Card Action Analysis</u>

    <br><br>
    <u>Example 2</u> 
    <br><br>     
    Assume that the security policy of the issuer states that:    
    <br><br>
    <li>If off-line SDA fails (which is reflected in bit 7 of byte 1 of the TVR set to 1), the transaction should be transmitted on-line to the issuer.</li>
    <br>    
    <li>If the terminal is off-line only or the on-line connection with the issuer cannot be established, then the transaction must be declined.</li>
    <br><br>    
    In this case, bit 7 of Byte 1 in the three action code registers of the issuer should be encoded as follows:
    <br><br>    
    <li>0 in the Issuer Action Code-Denial, which means that the transaction should not be declined off-line when off-line SDA fails;
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_IACDenialPanel, SDA_failed, 1)" onmouseup= "emv_byte_show(emv_IACDenialPanel, SDA_failed, 0)">See</label> 
    </li>    
    <br>    
    <li>1 in the Issuer Action Code-On-line, which means that the transaction should be directed on-line when off-line SDA fails;
    <label class="emv_button_show"  type="button" onmousedown= "emv_byte_show(emv_IACOnlinePanel, SDA_failed, 1)" onmouseup= "emv_byte_show(emv_IACOnlinePanel, SDA_failed, 0)">See</label> 
    </li>    
    <br>
    <li>1 in the Issuer Action Code-Default, which means that in case the transaction cannot be directed on-line to the issuer, the terminal should decline the transaction.
    <label class="emv_button_show"  type="button" onmousedown= "emv_byte_show(emv_IACDefaultPanel, SDA_failed, 1)" onmouseup= "emv_byte_show(emv_IACDefaultPanel, SDA_failed, 0)">See</label> 
    </li>    
    <br><br>    

    However, if the processing in any EMV stage results in the setting of 1 bit in the TVR, 
    the terminal can immediately trigger the terminal action analysis to determine whether the transaction should be 
    rejected off-line based upon the issuer's and/or the acquirer's security policies. 
    This can spare subsequent computational effort of the terminal, since the transaction would finally be rejected.
    <br><br>

    If cardholder verification was not successful (which is reflected in bit 8 of byte 3 of the TVR set to 1), 
    the transaction should be declined off-line without attempting to transmit the transaction on-line to the issuer .
    <br>
    In this case bit 8 of byte 3 in the Issuer Action Code-Denial should be set to 1, while the value of the same bit in the other two registers does not matter.

    <br><br>
    

    The evaluation of the processing performed during the current EMV transaction, according to the content of the TVR and of the issuer/terminal action codes sets, 
    leads the terminal to make a decision concerning the finalization of the EMV transaction. 
    <br><br>
    The terminal may propose one of the following actions through the first issuance of the GENERATE AC command:
    <br><br>
    Transaction approved: The card is required to produce a transaction certificate (TC) when the terminal appreciates that there are no risks (according to the security policies adopted by the issuer/acquirer) and recommends the approval of the EMV ¢ transaction off-line.
    <br><br>

    On-line authorization requested : The card is required to produce an authorization request cryptogram (ARQC) when the terminal recommends that the intervention of the issuer is necessary to decide upon the approval or denial of the EMV ¢ transaction.
    <br><br>
    Transaction declined: The card is required to produce an application authentication cryptogram (AAC) when the terminal decides that the business risks are unacceptable and the transaction must be declined off-line.
    <br><br>
    After the first GENERATE AC command is received by the card with a proposal of finalization from the terminal, 
    the card risk management may accept the terminal's recommendation or may override the terminal's decision to a lower decision level. 
    <br><br>
    
    The hierarchy of the decision levels (from highest to lowest ) is TC, ARQC, AAC. 
    <br><br>
    
    In addition to these three levels known to the terminal, the card knows a supplementary decision level, according to which a referral is requested by the card 
    for the finalization of the EMV transaction through an application authorization referral (AAR) cryptogram. 
    <br><br>

    This decision level is situated between the ARQC and the AAC.
    <br><br>
    
    Note that Application Cryptogram (AC) generically refers to any of the four types of cryptograms: TC, ARQC, AAR, or AAC.
    <br><br>
    
    The following three situations may appear:
    <br><br>

    1. If the terminal proposes the highest decision level (i.e., TC), the card risk management may either accept it or require a lower decision level, namely ARQC, AAR, or AAC.
    <br><br>

    2. If the terminal proposes an ARQC, the card may either accept it or request for a lower decision level, which can be either AAR or AAC.
    <br><br>

    3. If the terminal proposes an AAC, the card accepts it because there is no lower decision level that can override the AAC.
    <br><br>
    
    If the card responds with a decision level higher than that proposed by the terminal, this indicates a logic error in the card. 
    When this error appears after the first issuance of the GENERATE AC command, the terminal shall terminate the EMV transaction.
    <br><br>
  
    <div class="related-primary"><br>Related Flags: </br></div>       
    </div>`
    },        
    {id: EMV_STEP_CARD_ACTION_ANALYSIS, info: '', item: 'Card Action Analysis', substeps: [
            {id: EMV_SUBSTEP_GENERATE_AC_FIRST, info: '', item: 'Generate AC First', substeps: [],
            description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            <p>What s a cryptogram?
            A cryptogram is cryptographic hash of some transaction related data. Only the card and the issuer know the keys used to generate the cryptogram.
            Why do we need a cryptogram?
            The cryptogram contains the card s decision on what to do with the transaction: approve, request online approval, or decline. It cannot be faked.
            So the issuer uses the cryptogram and the data therein to confirm that the card is authentic and that the proper risk management has been performed.
            If the card generates a TC, the acquirer needs to provide the cryptogram to the Issuer in order to capture the funds of the transaction.
            </p></div>`
            }, 
        ],
        description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        This step starts when the terminal issues its first GENERATE APPLICATION CRYPTOGRAM (generate AC) command to the card.
        <u><label class="emv_button_show" onmousedown="emv_apdu_searchcommand('GENERATE_APPLICATION_CRYPTOGRAM', event)">Structure of a C-ADPU Command GENERATE APPLICATION CRYPTOGRAM</label></u>
        <br><br>
        During this step the card may perform its own risk management checks. 
        <br>        
        How the card performs risk management is outside the scope of EMV. 
        <br>        
        The card only has to communicate the results of its decision. 
        <br>        
        The data field of the response message consists of a BER-TLV coded data object.
        The coding of the data object shall be according to one of the following two
        formats.
        • Format 1: The data object returned in the response message is a primitive data object with tag equal to '80'.
        The value field consists of the concatenation without delimiters (tag and length) of the value fields of the data objects
        specified in Table 13 of EMV Book 3:
        Value Presence
        <li>Cryptogram Information Data (CID) Mandatory <label class="emv_button_show" onmousedown="emv_searchtag('9F27', event)">(tag 9F27)</label></li>
        <li>Application Transaction Counter (ATC) Mandatory  <label class="emv_button_show" onmousedown="emv_searchtag('9F36', event)">(tag 9F36)</label></li> 
        <li>Application Cryptogram (AC) Mandatory <label class="emv_button_show" onmousedown="emv_searchtag('9F26', event)">(tag 9F26)</label></li>
        <li>Issuer Application Data (IAD) Optional <label class="emv_button_show" onmousedown="emv_searchtag('9F10', event)">(tag 9F10)</label></li>
        
        Format 2: The data object returned in the response message is a constructed
        data object with tag equal to '77'. The value field may contain several BERTLV coded objects, but shall always include the Cryptogram Information
        Data, the Application Transaction Counter, and the cryptogram computed by
        the ICC (either an AC or a proprietary cryptogram). The utilisation and
        interpretation of proprietary data objects which may be included in this
        response message are outside the scope of these specifications.
        Format 2 shall be used if the response is being returned in a signature as
        specified for the CDA function described in section 6.6 of Book 2. The required
        data elem
        
        This result is communicated using a cryptogram.
        <br>


        The card will generate one of three possible cryptograms:
        <br><br>
        <li>Transaction approved: Transaction Certificate<label class="emv_button_show"  type="button" onmousedown= "emv_cidbyte_show(emv_CIDPanel, CID_TC, 1)" onmouseup= "emv_cidbyte_show(emv_CIDPanel, CID_TC, 0)">(TC)</label></li>
        <li>Request online approval: Authorization ReQuest Cryptogram <label class="emv_button_show"  type="button" onmousedown= "emv_cidbyte_show(emv_CIDPanel, CID_ARQC, 1)" onmouseup= "emv_cidbyte_show(emv_CIDPanel, CID_ARQC, 0)">(ARQC)</label></li>
        <li>Transaction declined: Application Authentication Cryptogram <label class="emv_button_show"  type="button" onmousedown= "emv_cidbyte_show(emv_CIDPanel, CID_AAC, 1)" onmouseup= "emv_cidbyte_show(emv_CIDPanel, CID_AAC, 0)">(AAC)</label></li>
        <br><br>
        At the end of this step the card provides a TC, ARQC or AAC to the terminal together with the transaction data used to generate the cryptogram.
        The terminal will set the “Card risk management was performed” bit in the TSI to 1.<label class="emv_button_show"  type="button" onmousedown= "emv_byte_show(emv_TSIPanel, Card_risk_management_was_performed, 1)" onmouseup= "emv_byte_show(emv_TSIPanel, Card_risk_management_was_performed , 0)">see</label>

        <br><br>
        </div>`
    },                   
    {id: EMV_STEP_ONLINE_OFFLINE_DECISION, info: '', item: 'On-Line/Off-Line Decision', substeps: [],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    If the terminal received an ARQC the terminal will request authorization from the issuer. 
    <br><br>
    If the terminal received a TC or AAC the transaction is now finished with an offline authorization or offline decline.
    <br><br>
    Online processing & Issuer authentication
    <br>    
    The processing by the issuer is outside the scope of EMV. But it is expected that the issuer authenticates the card by validating the ARQC cryptogram.
    <br>    
    The issuer should perform its own risk management and check if the cardholder has sufficient credit or funds.
    <br>    
    The issuer will respond with either an approval or decline code. 
    <br>    
    The issuer may also generate a response cryptogram using data known to the card. 
    <br>    
    The card can use this data to verify that the response received is really from the issuer.
    <br>    
    The card will have told the terminal that it supports issuer authentication in the AIP. 
    <label class="emv_button_show" onmousedown= "emv_byte_show(emv_AIPPanel, Issuer_authentication_is_supported, 1)" onmouseup= "emv_byte_show(emv_AIPPanel, Issuer_authentication_is_supported, 0)">See</label> 
    <br>    
    If a response cryptogram is received and the card supports issuer authentication the terminal will request authentication using the EXTERNAL AUTHENTICATE command.
    <br>    
    If the issuer authentication fails the “Issuer authentication failed” bit in the TVR will be set to 1. <label class="emv_button_show" onmousedown= "emv_byte_show(emv_TVRPanel, Issuer_authentication_failed, 1)" onmouseup= "emv_byte_show(emv_TVRPanel, Issuer_authentication_failed, 0)">See</label>  
    <br><br>
    <div class="related-primary"><br>Related Flags: </br></div>       
    </div>`
    }, 
    {id: EMV_STEP_ONLINE_PROCESSING, info: '', item: 'On-Line Processing', substeps: [
            {id:  EMV_SUBSTEP_CONNECT_ACQUIRER, info: '', item: 'Connect Acquirer', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            </div>`     
            }, 
            {id:  EMV_SUBSTEP_PREPARE_AND_SEND_TO_ACQUIRER, item: 'Prepare And Send To Acquirer', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            </div>`     
            }, 
        ],
    description:`<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    In some cases the issuer may want to update some data on the card. 
    <br><br>
    This can be done using issuer script processing.
    <br>    
    In response to the authorization request the issuer may reply with issuer scripts to be executed on the card. 
    <br>    
    These will be executed either right before or right after the second generate AC command. This will depend on settings in the issuer script.
    <br>    
    If issuer scripts were processed the terminal will set the “Script processing was performed” bit in the TSI to1.
    <br>    
    If issuer script processing fails:
    <br>    
    If the issuer script processing fails before the second generate AC command,
        The “Script processing failed before final GENERATE AC” bit in TVR will be set to 1.
    If the issuer script processing fails after the second generate AC command
        The “Script processing failed after final GENERATE AC” bit in TVR will be set to 1.
    <br>    
    During the EMV transaction processing, the terminal may send an authorization request message (1100) to the acquirer because of at least one of the following reasons:
    <br>    
    The terminal is an "on-line-only" type, which requires always the authorization of the issuer.
    <br>    
    The attendant explicitly triggers the authorization request message, since there are some suspicions about the cardholder at the point of service.
    <br>    
    The terminal risk management stage has chosen the current transaction at random for on-line authorization. 
    The terminal could reach the same decision following the velocity checking, which revealed a high number of transactions that were performed off-line.
    <br>
    The terminal requires on-line authorization following the terminal action analysis stage, when the TVR was compared against the terminal/Issuer Action Code “On-line. 
    The terminal issues the first GENERATE AC command with the reference control parameter (P1) set up to ARQC. 
    The card analyzes the proposal of the terminal according to its own card risk management procedure, which reflects the security and availability policies of the issuer, and agrees with an on-line authorization by the issuer.
    <br>    
    The terminal requires off-line completion following the terminal action analysis. 
    The terminal issues the first GENERATE AC command with the reference control parameter (P1) set up to TC. 
    The card analyzes the proposal of the terminal according to its own card risk management procedure and decreases the decision level proposed by the terminal from TC to ARQC.
    <br>    
    Whenever the card answers with an ARQC in the Cryptogram Information Data, the terminal starts up the on-line processing function. 
    This means that the card and the terminal judged the current transaction outside the limits of risk for an off-line completion, as defined by the issuer, payment system, and acquirer. Therefore, the issuer is required to analyze the actual EMV ¢ transaction at the point of service, based on the information it receives from the terminal and the account information it stores in the IH in connection with the card. This guarantees that the issuer can review the conditions of the transaction and can approve or reject it.
    <br><br>
    </div>`
    },                   
    {id: EMV_STEP_SCRIPT_PROCESSING, info: '', item: 'Script Processing', substeps: [ 
            {id: EMV_SUBSTEP_CHECK_ISSUER_SCRIPTS_TEMPLATE, info: '', item: 'Check_Issuer Scripts Template', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            The IH can group the post-issuance commands in two types of templates:
            <br>
            1. Issuer Script Template 1 (tag 71) groups proprietary post-issuance commands to be transmitted to the ICC before sending the 2nd GENERATE AC to the ICC.
            <br>
            2. Issuer Script Template 2 (tag 72) groups proprietary post-issuance commands to be transmitted to the ICC after sending the second GENERATE AC to the ICC.
            <br>
            Each issuer script template, regardless of whether it is of the type 1 or type 2, can include the following data objects:
            <br>
            Issuer Script Identifier (tag 9F18), which is represented on 4 bytes in binary format. This identifier is optional and is not interpreted by the terminal. The Issuer Script Identifier allows the issuer to distinguish among several issuer script templates that can be included in the same authorization response message.
            <br>
            Issuer Script Command APDU (tag 86) has a variable number of bytes depending on the type of the C-APDU to be sent to the card. Several Issuer Script Command APDU(s) can be included in an issuer script template.
            <br>
            The issuer can send more than one issuer script template in the same authorization response message. The only restriction is that the total length of the issuer script templates is less than or equal to 128 bytes.
            <br>
            After the reception of the authorization response message, the terminal processes each issuer script template in the sequence it appears in field 55 of the authorization response message. For each template the terminal performs the following processing:
            <br>
            Create a new data structure issuer script results of 5 bytes (see Appendix A5 in Book 4 [3]), which will store the results concerning the processing of the commands contained in the current issuer script template. Add this data structure at the end of a byte string containing the data structures corresponding to other templates that were already processed .
            <br>
            Reset the command counter that keeps the number of Issuer Script Command APDU(s) identified in the current issuer script template.
            <br>
            Parse the value field of the current template.
            <br>
            Check whether the Issuer Script Identifier (tag 9F18) is present. In the affirmative case, copy the value field of this data object into bytes 2 to 5 in the issuer script results. The Issuer Script Identifier is meaningful to the issuer when interpreting the issuer script results reported by the terminal after sending of the post-issuance commands to the ICC.
            <br>
            Create a first-in-first-out stack (FIFO), where each element contains the value field of one Issuer Script Command APDU data object (tag 86) separated from the value field of the template. Each new element added in the stack increments the command counter.
            <br>
            The processing sequence described below is performed before the second GENERATE AC , if the current template was identified with tag 71, or after the second GENERATE AC , in case the current template was identified with tag 72. Repeat the following steps a number of times equal to the command counter:
            <br>
            Pop the C-APDU kept in the current element of the FIFO stack indicated by the stack pointer.
            <br>
            Deliver this C-APDU to the ICC.
            <br>
            Examine only the status word SW1 in the R-APDU delivered by the ICC.
            <br>
            If SW1 indicates normal processing (SW1 = 90) or warning (SW1 = 62 or 63), the processing continues with the next Issuer Script Command APDU stored in the stack. If the command counter indicates that this is the first C-APDU that is processed, set to 1 bit 3, "Script processing was performed", in byte 1 of the TSI.
            <br>
            If SW1 indicates an error condition, the processing does not continue with other C-APDU(s) in the stack. The terminal shall set the first nibble of the first byte in the issuer script results to 1, "Script processing failed". The terminal shall write the sequence number of the Issuer Script Command APDU that reported the error in the second nibble of the first byte in the issuer script results. This sequence number equals the value of the command counter, when less than E, or otherwise the sequence number is set to F. The terminal sets to 1 bit 6, "Script processing failed before final GENERATE AC ", in the byte 5 of the TVR, if the current template is encoded with tag 71. The terminal sets to 1 bit 5, "Script processing failed after final GENERATE AC", in byte 5 of the TVR, if the current template is encoded with tag 72.
            <br>
            When the processing of the entire sequence of Issuer Script Command APDU(s) is successfully performed, the terminal sets up the first nibble of the first byte in the issuer script results to 2, "Script processing successful". The terminal shall write the value 0 in the second nibble of the first byte in the issuer script results.
            </div>`     
            }, 
            {id: EMV_SUBSTEP_POST_ISSUANCE_COMMANDS, info: '', item: 'Post Issuance Commands', substeps: [],
            description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
            The post-issuance commands can be divided into two groups:
            <br>            
            1. Commands that change the status of an application or of the entire card, including APPLICATION BLOCK , APPLICATION UNBLOCK , and CARD BLOCK (see Sections 2.5.1, 2.5.2, and 2.5.3 in Book 3 [1]);
            <br>
            2. Commands that change the values of some internal parameters, like the status of a PIN, of some cryptographic keys, or a PIN value, or the values of the data elements associated with the EMV ¢ application that participates in the card risk management processing.
            <br>
            and issuers may define supplementary commands tailored to their specific needs.
            <br>
            This category includes the EMV ¢ post-issuance command PIN CHANGE/UNBLOCK (see Section 2.5.10 in Book 3 [1]). Payment systems 
            <br>
            The post-issuance commands use secure messaging:
            <br>
            The integrity and authenticity of the issuer is achieved using a MAC.
            <br>
            The confidentiality of cryptographic keys or of a PIN value to be updated in the EMV ¢ application is achieved through symmetric key encryption.
            </div>`     
            },  
        ],
        description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        <p>
        It was mentioned in Section 6.9.1 that the authorization response message 1110 received from the IH can include post-issuance commands to be delivered to the ICC via the terminal. These commands are not relevant for the current EMV ¢ transaction, but they are used for updating the application data in the card during its utilization lifetime, or for switching an application in the card or even the entire card between the "unblocked" and "blocked" states. EMV ¢ does not make any provisions for updating the application code in the card. The format of the post-issuance commands can be proprietary to the issuer. They are not meaningful for the terminal, which should only dispatch them from the authorization response message and send them sequentially to the ICC that has to be updated.        
        </p>
        <div class="related-primary"><br>Related Flags: </br></div>       
        </div>`
    },                
    {id: EMV_STEP_TRANSACTION_COMPLETION, info: '', item: 'Transaction Completion', substeps: [
        {id: EMV_SUBSTEP_GENERATE_AC_SECOND	, info: '', item: 'Generate AC Second', substeps: [],
        description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        </div>`     
        }, 
        {id: EMV_SUBSTEP_TERMINATE_TRANSACTION, info: '', item: 'Terminate Transaction', substeps: [],
        description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
        </div>`     
        }, 
    ],
    description: `<div class="col alert alert-primary alert-dismissible fade show" role="alert">
    <p>If the transaction went online for approval and a response was received the terminal will request a final transaction cryptogram using the GENERATE AC command for a second time.
    In this case the card can only respond with a TC or AAC. The TC is required to capture the funds from the issuer.
    </p>
    <div class="related-primary"><br>Related Flags: </br></div>       
    </div>`
    },       
]

//---------------------------------------------------------------------------------  COUNTRY CODE

const emv_Country_Code = {
    "0004": "Afghanistan",
    "0008": "Albania",
    "0010": "Antarctica",
    "0012": "Algeria",
    "0016": "American Samoa",
    "0020": "Andorra",
    "0024": "Angola",
    "0028": "Antigua and Barbuda",
    "0031": "Azerbaijan",
    "0032": "Argentina",
    "0036": "Australia",
    "0040": "Austria",
    "0044": "Bahamas",
    "0048": "Bahrain",
    "0050": "Bangladesh",
    "0051": "Armenia",
    "0052": "Barbados",
    "0056": "Belgium",
    "0060": "Bermuda",
    "0064": "Bhutan",
    "0068": "Plurinational State of Bolivia",
    "0070": "Bosnia and Herzegovina",
    "0072": "Botswana",
    "0074": "Bouvet Island",
    "0076": "Brazil",
    "0084": "Belize",
    "0086": "British Indian Ocean Territory",
    "0090": "Solomon Islands",
    "0092": "Virgin Islands, British",
    "0096": "Brunei Darussalam",
    "0100": "Bulgaria",
    "0104": "Myanmar",
    "0108": "Burundi",
    "0112": "Belarus",
    "0116": "Cambodia",
    "0120": "Cameroon",
    "0124": "Canada",
    "0132": "Cabo Verde",
    "0136": "Cayman Islands",
    "0140": "Central African Republic",
    "0144": "Sri Lanka",
    "0148": "Chad",
    "0152": "Chile",
    "0156": "China",
    "0158": "Province of China Taiwan",
    "0162": "Christmas Island",
    "0166": "Cocos (Keeling) Islands",
    "0170": "Colombia",
    "0174": "Comoros",
    "0175": "Mayotte",
    "0178": "Congo",
    "0180": "Democratic Republic of Congo",
    "0184": "Cook Islands",
    "0188": "Costa Rica",
    "0191": "Croatia",
    "0192": "Cuba",
    "0196": "Cyprus",
    "0203": "Czech Republic",
    "0204": "Benin",
    "0208": "Denmark",
    "0212": "Dominica",
    "0214": "Dominican Republic",
    "0218": "Ecuador",
    "0222": "El Salvador",
    "0226": "Equatorial Guinea",
    "0231": "Ethiopia",
    "0232": "Eritrea",
    "0233": "Estonia",
    "0234": "Faroe Islands",
    "0238": "Falkland Islands (Malvinas)",
    "0239": "South Georgia and the South Sandwich Islands",
    "0242": "Fiji",
    "0246": "Finland",
    "0248": "Aland Islands",
    "0250": "France",
    "0254": "French Guiana",
    "0258": "French Polynesia",
    "0260": "French Southern Territories",
    "0262": "Djibouti",
    "0266": "Gabon",
    "0268": "Georgia",
    "0270": "Gambia",
    "0275": "State of Palestine",
    "0276": "Germany",
    "0280": "Germany",
    "0288": "Ghana",
    "0292": "Gibraltar",
    "0296": "Kiribati",
    "0300": "Greece",
    "0304": "Greenland",
    "0308": "Grenada",
    "0312": "Guadeloupe",
    "0316": "Guam",
    "0320": "Guatemala",
    "0324": "Guinea",
    "0328": "Guyana",
    "0332": "Haiti",
    "0334": "Heard Island and McDonald Islands",
    "0336": "Holy See (Vatican City State)",
    "0340": "Honduras",
    "0344": "Hong Kong",
    "0348": "Hungary",
    "0352": "Iceland",
    "0356": "India",
    "0360": "Indonesia",
    "0364": "Islamic Republic of Iran",
    "0368": "Iraq",
    "0372": "Ireland",
    "0376": "Israel",
    "0380": "Italy",
    "0384": "Cote d'Ivoire",
    "0388": "Jamaica",
    "0392": "Japan",
    "0398": "Kazakhstan",
    "0400": "Jordan",
    "0404": "Kenya",
    "0408": "Democratic People's Republic of Korea",
    "0410": "Republic of Korea",
    "0414": "Kuwait",
    "0417": "Kyrgyzstan",
    "0418": "Lao People's Democratic Republic",
    "0422": "Lebanon",
    "0426": "Lesotho",
    "0428": "Latvia",
    "0430": "Liberia",
    "0434": "Libya",
    "0438": "Liechtenstein",
    "0440": "Lithuania",
    "0442": "Luxembourg",
    "0446": "Macao",
    "0450": "Madagascar",
    "0454": "Malawi",
    "0458": "Malaysia",
    "0462": "Maldives",
    "0466": "Mali",
    "0470": "Malta",
    "0474": "Martinique",
    "0478": "Mauritania",
    "0480": "Mauritius",
    "0484": "Mexico",
    "0492": "Monaco",
    "0496": "Mongolia",
    "0498": "Republic of Moldova",
    "0499": "Montenegro",
    "0500": "Montserrat",
    "0504": "Morocco",
    "0508": "Mozambique",
    "0512": "Oman",
    "0516": "Namibia",
    "0520": "Nauru",
    "0524": "Nepal",
    "0528": "Netherlands",
    "0531": "Curacao",
    "0533": "Aruba",
    "0534": "Sint Maarten (Dutch part)",
    "0535": "Sint Eustatius and Saba Bonaire",
    "0540": "New Caledonia",
    "0548": "Vanuatu",
    "0554": "New Zealand",
    "0558": "Nicaragua",
    "0562": "Niger",
    "0566": "Nigeria",
    "0570": "Niue",
    "0574": "Norfolk Island",
    "0578": "Norway",
    "0580": "Northern Mariana Islands",
    "0581": "United States Minor Outlying Islands",
    "0583": "Federated States of Micronesia",
    "0584": "Marshall Islands",
    "0585": "Palau",
    "0586": "Pakistan",
    "0591": "Panama",
    "0598": "Papua New Guinea",
    "0600": "Paraguay",
    "0604": "Peru",
    "0608": "Philippines",
    "0612": "Pitcairn",
    "0616": "Poland",
    "0620": "Portugal",
    "0624": "Guinea-Bissau",
    "0626": "Timor-Leste",
    "0630": "Puerto Rico",
    "0634": "Qatar",
    "0638": "Reunion",
    "0642": "Romania",
    "0643": "Russian Federation",
    "0646": "Rwanda",
    "0652": "Saint Barthelemy",
    "0654": "Saint Helena, Ascension and Tristan da Cunha",
    "0659": "Saint Kitts and Nevis",
    "0660": "Anguilla",
    "0662": "Saint Lucia",
    "0663": "Saint Martin (French part)",
    "0666": "Saint Pierre and Miquelon",
    "0670": "Saint Vincent and the Grenadines",
    "0674": "San Marino",
    "0678": "Sao Tome and Principe",
    "0682": "Saudi Arabia",
    "0686": "Senegal",
    "0688": "Serbia",
    "0690": "Seychelles",
    "0694": "Sierra Leone",
    "0702": "Singapore",
    "0703": "Slovakia",
    "0704": "Viet Nam",
    "0705": "Slovenia",
    "0706": "Somalia",
    "0710": "South Africa",
    "0716": "Zimbabwe",
    "0724": "Spain",
    "0728": "South Sudan",
    "0729": "Sudan",
    "0732": "Western Sahara",
    "0740": "Suriname",
    "0744": "Svalbard and Jan Mayen",
    "0748": "Swaziland",
    "0752": "Sweden",
    "0756": "Switzerland",
    "0760": "Syrian Arab Republic",
    "0762": "Tajikistan",
    "0764": "Thailand",
    "0768": "Togo",
    "0772": "Tokelau",
    "0776": "Tonga",
    "0780": "Trinidad and Tobago",
    "0784": "United Arab Emirates",
    "0788": "Tunisia",
    "0792": "Turkey",
    "0795": "Turkmenistan",
    "0796": "Turks and Caicos Islands",
    "0798": "Tuvalu",
    "0800": "Uganda",
    "0804": "Ukraine",
    "0807": "Macedonia",
    "0818": "Egypt",
    "0826": "United Kingdom",
    "0831": "Guernsey",
    "0832": "Jersey",
    "0833": "Isle of Man",
    "0834": "Tanzania",
    "0840": "United States of America",
    "0850": "Virgin Islands, U.S.",
    "0854": "Burkina Faso",
    "0858": "Uruguay",
    "0860": "Uzbekistan",
    "0862": "Venezuela",
    "0876": "Wallis and Futuna",
    "0882": "Samoa",
    "0887": "Yemen",
    "0894": "Zambia"
}

//---------------------------------------------------------------------------------  CURRENCY CODE

const emv_Currency_Code = {                              //tags 9F42 Currency Code  Application (card), 	5F2A Transaction Currency Code (terminal)
    "0008": "Albanian lek",
    "0012": "Algerian dinar",
    "0032": "Argentine peso",
    "0036": "Australian dollar",
    "0044": "Bahamian dollar",
    "0048": "Bahraini dinar",
    "0050": "Bangladeshi taka",
    "0051": "Armenian dram",
    "0052": "Barbados dollar",
    "0060": "Bermudian dollar",
    "0064": "Bhutanese ngultrum",
    "0068": "Boliviano",
    "0072": "Botswana pula",
    "0084": "Belize dollar",
    "0090": "Solomon Islands dollar",
    "0096": "Brunei dollar",
    "0104": "Myanmar kyat",
    "0108": "Burundian franc",
    "0116": "Cambodian riel",
    "0124": "Canadian dollar",
    "0132": "Cape Verde escudo",
    "0136": "Cayman Islands dollar",
    "0144": "Sri Lankan rupee",
    "0152": "Chilean peso",
    "0156": "Chinese yuan",
    "0170": "Colombian peso",
    "0174": "Comoro franc",
    "0188": "Costa Rican colon",
    "0191": "Croatian kuna",
    "0192": "Cuban peso",
    "0203": "Czech koruna",
    "0208": "Danish krone",
    "0214": "Dominican peso",
    "0222": "Salvadoran colon",
    "0230": "Ethiopian birr",
    "0232": "Eritrean nakfa",
    "0238": "Falkland Islands pound",
    "0242": "Fiji dollar",
    "0262": "Djiboutian franc",
    "0270": "Gambian dalasi",
    "0292": "Gibraltar pound",
    "0320": "Guatemalan quetzal",
    "0324": "Guinean franc",
    "0328": "Guyanese dollar",
    "0332": "Haitian gourde",
    "0340": "Honduran lempira",
    "0344": "Hong Kong dollar",
    "0348": "Hungarian forint",
    "0352": "Icelandic krÃ³na",
    "0356": "Indian rupee",
    "0360": "Indonesian rupiah",
    "0364": "Iranian rial",
    "0368": "Iraqi dinar",
    "0376": "Israeli new shekel",
    "0388": "Jamaican dollar",
    "0392": "Japanese yen",
    "0398": "Kazakhstani tenge",
    "0400": "Jordanian dinar",
    "0404": "Kenyan shilling",
    "0408": "North Korean won",
    "0410": "South Korean won",
    "0414": "Kuwaiti dinar",
    "0417": "Kyrgyzstani som",
    "0418": "Lao kip",
    "0422": "Lebanese pound",
    "0426": "Lesotho loti",
    "0430": "Liberian dollar",
    "0434": "Libyan dinar",
    "0446": "Macanese pataca",
    "0454": "Malawian kwacha",
    "0458": "Malaysian ringgit",
    "0462": "Maldivian rufiyaa",
    "0478": "Mauritanian ouguiya",
    "0480": "Mauritian rupee",
    "0484": "Mexican peso",
    "0496": "Mongolian togrog",
    "0498": "Moldovan leu",
    "0504": "Moroccan dirham",
    "0512": "Omani rial",
    "0516": "Namibian dollar",
    "0524": "Nepalese rupee",
    "0532": "Netherlands Antillean guilder",
    "0533": "Aruban florin",
    "0548": "Vanuatu vatu",
    "0554": "New Zealand dollar",
    "0558": "Nicaraguan cordoba",
    "0566": "Nigerian naira",
    "0578": "Norwegian krone",
    "0586": "Pakistani rupee",
    "0590": "Panamanian balboa",
    "0598": "Papua New Guinean kina",
    "0600": "Paraguayan guaranÃ­",
    "0604": "Peruvian Sol",
    "0608": "Philippine peso",
    "0634": "Qatari riyal",
    "0643": "Russian ruble",
    "0646": "Rwandan franc",
    "0654": "Saint Helena pound",
    "0678": "Sao Tome and PrÃ­ncipe dobra",
    "0682": "Saudi riyal",
    "0690": "Seychelles rupee",
    "0694": "Sierra Leonean leone",
    "0702": "Singapore dollar",
    "0704": "Vietnamese dong",
    "0706": "Somali shilling",
    "0710": "South African rand",
    "0728": "South Sudanese pound",
    "0748": "Swazi lilangeni",
    "0752": "Swedish krona/kronor",
    "0756": "Swiss franc",
    "0760": "Syrian pound",
    "0764": "Thai baht",
    "0776": "Tongan pa'anga",
    "0780": "Trinidad and Tobago dollar",
    "0784": "United Arab Emirates dirham",
    "0788": "Tunisian dinar",
    "0800": "Ugandan shilling",
    "0807": "Macedonian denar",
    "0818": "Egyptian pound",
    "0826": "Pound sterling",
    "0834": "Tanzanian shilling",
    "0840": "United States dollar",
    "0858": "Uruguayan peso",
    "0860": "Uzbekistan som",
    "0882": "Samoan tala",
    "0886": "Yemeni rial",
    "0901": "New Taiwan dollar",
    "0931": "Cuban convertible peso",
    "0932": "Zimbabwean dollar A/10",
    "0933": "Belarusian ruble",
    "0934": "Turkmenistani manat",
    "0936": "Ghanaian cedi",
    "0937": "Venezuelan bolÃ­var",
    "0938": "Sudanese pound",
    "0940": "Uruguay Peso en Unidades Indexadas",
    "0941": "Serbian dinar",
    "0943": "Mozambican metical",
    "0944": "Azerbaijani manat",
    "0946": "Romanian leu",
    "0947": "WIR Euro (complementary currency)",
    "0948": "WIR Franc (complementary currency)",
    "0949": "Turkish lira",
    "0950": "CFA franc BEAC",
    "0951": "East Caribbean dollar",
    "0952": "CFA franc BCEAO",
    "0953": "CFP franc (franc Pacifique)",
    "0955": "European Composite Unit",
    "0956": "European Monetary Unit",
    "0957": "European Unit of Account",
    "0958": "European Unit of Account",
    "0959": "Gold (one troy ounce)",
    "0961": "Silver (one troy ounce)",
    "0962": "Platinum (one troy ounce)",
    "0963": "Code reserved for testing purposes",
    "0964": "Palladium (one troy ounce)",
    "0965": "ADB Unit of Account",
    "0967": "Zambian kwacha",
    "0968": "Surinamese dollar",
    "0969": "Malagasy ariary",
    "0970": "Unidad de Valor Real (UVR)",
    "0971": "Afghan afghani",
    "0972": "Tajikistani somoni",
    "0973": "Angolan kwanza",
    "0974": "Belarusian ruble",
    "0975": "Bulgarian lev",
    "0976": "Congolese franc",
    "0977": "Bosnia and Herzegovina convertible mark",
    "0978": "Euro",
    "0979": "Mexican Unidad de Inversion (UDI)",
    "0980": "Ukrainian hryvnia",
    "0981": "Georgian lari",
    "0984": "Bolivian Mvdol",
    "0985": "Polish zloty",
    "0986": "Brazilian real",
    "0990": "Unidad de Fomento (funds code)",
    "0994": "Unified System for Regional Compensation",
    "0997": "United States dollar (next day) (funds code)",
    "0999": "No currency"
}

//---------------------------------------------------------------------------------  AID List

const emv_AID = {
    A00000000101: "PBS DanmÃ¸nt A/S - MUSCLE Card Applet",
    A000000003000000: "Visa International - (VISA) Card Manager",
    A00000000300037561: "Visa International - Bonuscard",
    A00000000305076010: "Visa International - VISA ELO Credit",
    A0000000031010: "Visa International - VISA Debit/Credit (Classic)",
    A000000003101001: "Visa International - VISA Credit",
    A000000003101002: "Visa International - VISA Debit",
    A0000000032010: "Visa International - VISA Electron",
    A0000000032020: "Visa International - VISA",
    A0000000033010: "Visa International - VISA Interlink",
    A0000000034010: "Visa International - VISA Specific",
    A0000000035010: "Visa International - VISA Specific",
    A000000003534441: "Visa International - Schlumberger Security Domain",
    A0000000035350: "Visa International - Security Domain",
    A000000003535041: "Visa International - Security Domain",
    A0000000036010: "Visa International - Domestic Visa Cash Stored Value",
    A0000000036020: "Visa International - International Visa Cash Stored Value",
    A0000000038002: "Visa International - VISA Auth, VisaRemAuthen EMV-CAP (DPA)",
    A0000000038010: "Visa International - VISA Plus",
    A0000000039010: "Visa International - VISA Loyalty",
    A000000003999910: "Visa International - VISA Proprietary ATM",
    A0000000040000: "Mastercard International - MasterCard Card Manager",
    A00000000401: "Mastercard International - MasterCard PayPass",
    A0000000041010: "Mastercard International - MasterCard Credit/Debit (Global)",
    A00000000410101213: "Mastercard International - MasterCard Credit",
    A00000000410101215: "Mastercard International - MasterCard Credit",
    A0000000041010BB5449435301: "Mastercard International",
    A0000000042010: "Mastercard International - MasterCard Specific",
    A0000000042203: "Mastercard International - MasterCard Specific",
    A0000000043010: "Mastercard International - MasterCard Specific",
    A0000000043060: "Mastercard International - Maestro (Debit)",
    A000000004306001: "Mastercard International - Maestro (Debit)",
    A0000000044010: "Mastercard International - MasterCard Specific",
    A0000000045010: "Mastercard International - MasterCard Specific",
    A0000000045555: "Mastercard International - APDULogger",
    A0000000046000: "Mastercard International - Cirrus",
    A0000000048002: "Mastercard International - SecureCode Auth EMV-CAP",
    A0000000049999: "Mastercard International - MasterCard PayPass",
    A0000000050001: "Switch Card Services Ltd. - Maestro UK",
    A0000000050002: "Switch Card Services Ltd. - Solo",
    A0000000090001FF44FF1289: "ETSI - Orange",
    A0000000101030: "Europay International - Maestro-CH",
    A00000001800: "GEMPLUS",
    A0000000181001: "GEMPLUS - com.gemplus.javacard.util packages",
    A000000018434D: "GEMPLUS - Gemplus card manager",
    A000000018434D00: "GEMPLUS - Gemplus Security Domain",
    A00000002401: "Midland Bank Plc - Self Service",
    A000000025: "American Express - American Express",
    A0000000250000: "American Express - American Express",
    A00000002501: "American Express - American Express",
    A000000025010104: "American Express - American Express",
    A000000025010402: "American Express - American Express",
    A000000025010701: "American Express - ExpressPay",
    A000000025010801: "American Express - American Express",
    A0000000291010: "LINK Interchange Network Ltd - Link / American Express",
    A00000002945087510100000: "LINK Interchange Network Ltd - CO-OP",
    A00000002949034010100001: "LINK Interchange Network Ltd - HSBC",
    A00000002949282010100000: "LINK Interchange Network Ltd - Barclay",
    A000000029564182: "LINK Interchange Network Ltd - HAFX",
    A00000003029057000AD13100101FF: "Schlumberger Industries Identif dâ€™Encarteur PR050 - BelPIC (Belgian Personal Identity Card) JavaCard Applet",
    A0000000308000000000280101: "Schlumberger Industries Identif dâ€™Encarteur PR050 - Gemalto .NET Card AID",
    A0000000421010: "Groupement des Cartes Bancaires - Cartes Bancaire EMV Card",
    A0000000422010: "Groupement des Cartes Bancaires",
    A0000000423010: "Groupement des Cartes Bancaires",
    A0000000424010: "Groupement des Cartes Bancaires",
    A0000000425010: "Groupement des Cartes Bancaires",
    A0000000426010: "Groupement des Cartes Bancaires - Contactless payment using Apple Pay",
    A00000005945430100: "Zentraler Kreditausschuss (ZKA) - Girocard Electronic Cash",
    A000000063504B43532D3135: "RSA Laboratories - PKCS-15",
    A0000000635741502D57494D: "RSA Laboratories - WAP-WIM",
    A00000006510: "JCB CO., LTD. - JCB",
    A0000000651010: "JCB CO., LTD. - JCB J Smart Credit",
    A00000006900: "SociÃ©tÃ© EuropÃ©enne de Monnaie Electronique SEME - Moneo",
    A000000077010000021000000000003B: "Oberthur Technologies - Visa AEPN",
    A0000000790100: "Activcard Europe S.A. - CACv2 PKI ID",
    A0000000790101: "Activcard Europe S.A. - CACv2 PKI Sign",
    A0000000790102: "Activcard Europe S.A. - CACv2 PKI Enc",
    A00000007901F0: "Activcard Europe S.A. - CACv1 PKI Identity Key",
    A00000007901F1: "Activcard Europe S.A. - CACv1 PKI Digital Signature Key",
    A00000007901F2: "Activcard Europe S.A. - CACv1 PKI Key Management Key",
    A0000000790200: "Activcard Europe S.A. - CACv2 DoD Person",
    A0000000790201: "Activcard Europe S.A. - CACv2 DoD Personnel",
    A00000007902FB: "Activcard Europe S.A. - CACv1 BC",
    A00000007902FD: "Activcard Europe S.A. - CACv1 BC",
    A00000007902FE: "Activcard Europe S.A. - CACv1 BC",
    A0000000790300: "Activcard Europe S.A. - CACv2 Access Control Applet",
    A0000000791201: "Activcard Europe S.A. - CAC JDM",
    A0000000791202: "Activcard Europe S.A. - CAC JDM",
    A0000000871002FF49FF0589: "Third Generation Partnership Project (3GPP) - Telenor USIM",
    A00000008810200105C100: "Buypass AS - BuyPass BIDA",
    A000000088102201034221: "Buypass AS - BuyPass BEID (BuyPass Electronic ID)",
    A000000088102201034321: "Buypass AS - BuyPass BEID (BuyPass Electronic ID)",
    A0000000960200: "Sa Proton World International N.V. - Proton World International Security Domain",
    A000000098: "Visa USA - Debit Card",
    A0000000980840: "Visa USA - Visa Common Debit",
    A0000000980848: "Visa USA - Debit Card",
    A0000001110101: "Die Post Postfinance - Postcard",
    A0000001160300: "GSA â€“ TFCS - PIV CHUID",
    A0000001166010: "GSA â€“ TFCS - PIV Fingerprints",
    A0000001166030: "GSA â€“ TFCS - PIV Facial Image",
    A0000001169000: "GSA â€“ TFCS - PIV Security Object",
    A000000116A001: "GSA â€“ TFCS - PIV Authentication Key",
    A000000116DB00: "GSA â€“ TFCS - CCC",
    A000000118010000: "Austria Card - DF_Verkehr",
    A000000118020000: "Austria Card - DF_Partner",
    A000000118030000: "Austria Card - DF_SchÃ¼lerdaten",
    A000000118040000: "Austria Card - DF_KEP_SIG",
    A0000001184543: "Austria Card - Digital Signature (SSCA)",
    A000000118454E: "Austria Card - Encryption Application",
    A0000001211010: "PBS Danmark A/S - Dankort (VISA GEM Vision)",
    A0000001320001: "Java Card Forum - org.javacardforum.javacard.biometry",
    A0000001408001: "TDS TODOS DATA SYSTEM AB - eCode",
    A0000001410001: "Associazione Bancaria Italiana - PagoBANCOMAT",
    A0000001510000: "GlobalPlatform, Inc. - Global Platform Security Domain AID",
    A00000015153504341534400: "GlobalPlatform, Inc. - CASD_AID",
    A0000001523010: "Diners Club International Ltd. - Discover, Pulse D Pas",
    A0000001524010: "Diners Club International Ltd. - Discover",
    A0000001544442: "Banrisul â€“ Banco do Estado do Rio Grande do SUL â€“ S.A. - Banricompras Debito",
    A0000001570010: "ZÃ¼hlke Engineering AG - AMEX",
    A0000001570020: "ZÃ¼hlke Engineering AG - MasterCard",
    A0000001570021: "ZÃ¼hlke Engineering AG - Maestro",
    A0000001570022: "ZÃ¼hlke Engineering AG - Maestro",
    A0000001570023: "ZÃ¼hlke Engineering AG - CASH",
    A0000001570030: "ZÃ¼hlke Engineering AG - VISA",
    A0000001570031: "ZÃ¼hlke Engineering AG - VISA",
    A0000001570040: "ZÃ¼hlke Engineering AG - JCB",
    A0000001570050: "ZÃ¼hlke Engineering AG - Postcard",
    A0000001570051: "ZÃ¼hlke Engineering AG - Postcard",
    A0000001570100: "ZÃ¼hlke Engineering AG - MCard",
    A0000001570104: "ZÃ¼hlke Engineering AG - MyOne",
    A0000001570109: "ZÃ¼hlke Engineering AG - Mediamarkt Card",
    A000000157010A: "ZÃ¼hlke Engineering AG - Gift Card",
    A000000157010B: "ZÃ¼hlke Engineering AG - Bonuscard",
    A000000157010C: "ZÃ¼hlke Engineering AG - WIRCard",
    A000000157010D: "ZÃ¼hlke Engineering AG - Power Card",
    A0000001574443: "ZÃ¼hlke Engineering AG - DINERS CLUB",
    A0000001574444: "ZÃ¼hlke Engineering AG - Supercard Plus",
    A000000167413000FF: "IBM - JCOP Identify Applet",
    A000000167413001: "IBM - FIPS 140-2",
    A000000172950001: "Financial Information Service Co. Ltd. - BAROC Financial Application Taiwan",
    A000000177504B43532D3135: "MinistÃ¨re de Lâ€™IntÃ©rieur - BelPIC (Belgian Personal Identity Card)",
    A0000001850002: "Post Office Limited - UK Post Office Account card",
    A0000001884443: "Diners Club Switzerland Ltd - DINERS CLUB",
    A0000002040000: "Association for Payment Clearing Services",
    A0000002281010: "Saudi Arabian Monetary Agency (SAMA) - SPAN (M/Chip)",
    A0000002282010: "Saudi Arabian Monetary Agency (SAMA) - SPAN (VIS)",
    A00000022820101010: "Saudi Arabian Monetary Agency (SAMA) - SPAN",
    A0000002471001: "ISO JTC1/SC17/WG3 - Machine Readable Travel Documents (MRTD)",
    A0000002472001: "ISO JTC1/SC17/WG3 - Machine Readable Travel Documents (MRTD)",
    A0000002771010: "Interac Association - INTERAC",
    A00000030600000000000000: "PS/SC Workgroup - PC/SC Initial access data AID",
    A000000308000010000100: "National Institute of Standards and Technology - Personal Identity Verification (PIV) / ID-ONE PIV BIO",
    A00000031510100528: "Currence Holding/PIN BV - Currence PuC",
    A0000003156020: "Currence Holding/PIN BV - Chipknip",
    A00000032301: "Identity Alliance - MUSCLE Applet Package",
    A0000003230101: "Identity Alliance - MUSCLE Applet Instance",
    A0000003241010: "Discover Financial Services LLC - Discover Zip",
    A000000333010101: "China Unionpay Co. Ltd - UnionPay Debit",
    A000000333010102: "China Unionpay Co. Ltd - UnionPay Credit",
    A000000333010103: "China Unionpay Co. Ltd - UnionPay Quasi Credit",
    A000000333010106: "China Unionpay Co. Ltd - UnionPay Electronic Cash",
    A000000333010108: "China Unionpay Co. Ltd - U.S. UnionPay Common Debit AID",
    A000000337301000: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Retrait",
    A000000337101000: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Standard",
    A000000337102000: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Classic",
    A000000337101001: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Prepaye Online",
    A000000337102001: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Prepaye Possibile Offiline",
    A000000337601001: "Groupment Interbancaire MonÃ©tique de lâ€™ UEMOA - Porte Monnaie Electronique",
    A0000003591010: "Euro Alliance of Payment Schemes s.c.r.l.",
    A0000003591010028001: "Euro Alliance of Payment Schemes s.c.r.l. â€“ Girocard EAPS",
    A00000035910100380: "Euro Alliance of Payment Schemes s.c.r.l. - PagoBANCOMAT",
    A0000003660001: "Poste Italiane S.P.A - Postamat",
    A0000003660002: "Poste Italiane S.P.A - Postamat VISA",
    A0000003710001: "Verve - InterSwitch Verve Card",
    A00000038410: "eftpos, Australian Payments Clearing Association Ltd - Savings (debit card)",
    A00000038420: "eftpos, Australian Payments Clearing Association Ltd - Cheque (debit card)",
    A0000003964D66344D0002: "NXP Semiconductors Germany GmbH - MIFARE4MOBILE",
    A00000039742544659: "Microsoft Corporation - Microsoft IDMP AID",
    A0000003974349445F0100: "Microsoft Corporation - Microsoft PNP AID",
    A0000004271010: "Unibanco (Hipercard) - Hiperchip",
    A0000004320001: "ÐŸÐ Ðž100 - Universal Electronic Card",
    A0000004360100: "Edenred - Ticket Restaurant",
    A0000004391010: "ACCEL/Exchange - Exchange ATM card",
    A0000004540010: "eTranzact - Etranzact Genesis Card",
    A0000004540011: "eTranzact - Etranzact Genesis Card 2",
    A0000004762010: "Google - GOOGLE_CONTROLLER_AID",
    A0000004763030: "Google - GOOGLE_MIFARE_MANAGER_AID",
    A0000004766C: "Google - GOOGLE_PAYMENT_AID",
    A000000476A010: "Google - GSD_MANAGER_AID",
    A000000476A110: "Google - GSD_MANAGER_AID",
    A000000485: "JVL Ventures, LLC (Softcard) - Softcard SmartTap",
    A0000005241010: "RuPay",
    A0000005271002: "Yubikey NEO U2F Demo applet",
    A000000527200101: "Yubikey NEO Yubikey2 applet interface",
    A000000527210101: "Yubikey NEO OATH Applet",
    A00000061700: "Fidesmo javacard",
    A0000006200620: "Debit Network Alliance (DNA)",
    A0000006260101010001: "SwissPass/SwissPass Plus",
    A0000006351010: "Bancnet Philippines",
    A0000006581010: "MIR Credit",
    A0000006581011: "MIR Credit",
    A0000006582010: "MIR Debit",
    A0000006723010: "TROY chip credit card",
    A0000006723020: "TROY chip debit card",
    A0000007705850: "Indian Oil Corporation Limited - XTRAPOWER Fleet Card Program",
    A0000007790000: "Zimswitch Zimbabwe",
    D27600002547410100: "Girocard ATM",
    A000000333010101: "UnionPay Debit China",	
    A000000333010102: "UnionPay Credit China",	
    A000000333010103: "UnionPay Quasi Credit China",	
    A000000333010106: "UnionPay Electronic Cash" 
}