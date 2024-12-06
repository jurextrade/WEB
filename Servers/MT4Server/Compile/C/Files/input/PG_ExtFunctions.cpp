//+------------------------------------------------------------------+
//|                                                   cfunctions.c++ |
//|                                Copyright � 2008, Berkers Trading |
//|                                                http://quotar.com |
//+------------------------------------------------------------------+


#include <windows.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <string>
#include <iostream>


//----
#define MT4_EXPFUNC __declspec(dllexport)



#define datetime			double

typedef	void(*MT4_CallFunction)                         (double		_Ask, 
   													    double		_Bid, 
													    datetime	_TimeCurrent,
														int			_CurrentPeriod,
														int*         _Symbol,
														double		_Point,
														double		_Digits,
														int*		_SignalTab, 
														double*		_SignalTabValue, 
														datetime*	_SignalTabTime, 
														double*		_SignalTabPrice, 
														int*		_BeforeSignalTab, 
														double*		_BeforeSignalTabValue, 
														datetime*	_BeforeSignalTabTime, 
														double*		_BeforeSignalTabPrice, 
														int*		_BeforeSignalTickTab,
														int*		_RuleTab, 
														double*		_RuleTabValue, 
														int*		_BeforeRuleTab, 
														double*		_BeforeRuleTabValue);


struct MqlStr{
   int               len;
   char             *string;
};
MT4_CallFunction function1;
MT4_CallFunction function2;

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
extern "C" MT4_EXPFUNC int __cdecl MT4_GetProcAddress(HMODULE  hModule, int TestMode) {

	if (!TestMode) {
		function1 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_SetSystemObjects");
		function2 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_SetEntryRules");
	}
	else {
		function1 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_TSetSystemObjects");
		function2 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_TSetEntryRules");
	}

	if (function1 && function2)
		return 5;
	if (function1 && !function2)
		return 3;
	if (!function1 && function2)
		return 4;

	return -1;
}

extern "C"  MT4_EXPFUNC int __cdecl  MT4_FreeDLL (LPCWSTR lpModuleName) {

	HMODULE hModule = GetModuleHandleW (lpModuleName);

	if (hModule != 0) {

        printf("Library ALREADY Loaded  **********************************************************************");
		int returnvalue = FreeLibrary(hModule);

        if (returnvalue) {
            printf("Library is free **********************************************************************");
           
        }
        else {
            printf("ERROR Library is free **********************************************************************");
            return -1;
       }
	}
	return 1;
}



extern "C"  MT4_EXPFUNC int __cdecl  MT4_LoadDLL (LPCWSTR lpModuleName, int TestMode) {

	HMODULE hModule = GetModuleHandleW (lpModuleName);

	if (hModule == 0) {

		 hModule = LoadLibraryW(lpModuleName);
    
		if (!hModule) {
			printf("CAN NOT LOAD LIBRARY  **********************************************************************");    
			return -2;                       
		}
	    else {
		    printf("LOAD LIBRARY  SUCCEED**********************************************************************");   
		}
	}

	if (!TestMode) {
		function1 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_SetSystemObjects");
		function2 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_SetEntryRules");
	} else {
		function1 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_TSetSystemObjects");
		function2 = (MT4_CallFunction)GetProcAddress(hModule, "MT4_TSetEntryRules");

	}		

    if (function1 && function2)
		return 5;
   	if (function1 && !function2)
			return 3;
	if (!function1 && function2)
			return 4;

    return -1;
   
}

extern "C" MT4_EXPFUNC void __cdecl MT4_SetEntryRules  (double		_Ask, 
   													    double		_Bid, 
													    datetime	_TimeCurrent,
														int         _CurrentPeriod,
														int*         _Symbol,
														double		_Point,
														double		_Digits,
														int*		_SignalTab, 
														double*		_SignalTabValue, 
														datetime*	_SignalTabTime, 
														double*		_SignalTabPrice, 
														int*		_BeforeSignalTab, 
														double*		_BeforeSignalTabValue, 
														datetime*	_BeforeSignalTabTime, 
														double*		_BeforeSignalTabPrice, 
														int*		_BeforeSignalTickTab,
														int*		_RuleTab, 
														double*		_RuleTabValue, 
														int*		_BeforeRuleTab, 
														double*		_BeforeRuleTabValue) {

	 function2 (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, _Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
}

extern "C" MT4_EXPFUNC void __cdecl MT4_SetSystemObjects (double		_Ask, 
   													    double		_Bid, 
													    datetime	_TimeCurrent,
														int			_CurrentPeriod,
														int*         _Symbol,
														double		_Point,
														double		_Digits,
														int*		_SignalTab, 
														double*		_SignalTabValue, 
														datetime*	_SignalTabTime, 
														double*		_SignalTabPrice, 
														int*		_BeforeSignalTab, 
														double*		_BeforeSignalTabValue, 
														datetime*	_BeforeSignalTabTime, 
														double*		_BeforeSignalTabPrice, 
														int*		_BeforeSignalTickTab,
														int*		_RuleTab, 
														double*		_RuleTabValue, 
														int*		_BeforeRuleTab, 
														double*		_BeforeRuleTabValue)
{
	 function1 (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, _Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
}

					