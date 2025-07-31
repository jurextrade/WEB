#include "Progress.h"




int Fmod (int a, int b)
{
  return ((int)fmod ((double)a, (double)b));
}

//=========================================RULES FUNCTIONS============================================================

static int is_leap(unsigned y)
{
	y += 1900;
	return (y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0);
}

double _Pips (double value, double point) {
	return (value / point);
}

double _PipValue (double pips, double point) {
	return (pips * point);
}
	
int GetMonth (datetime TimeCurrent) {
   
    time_t timenow = (time_t)TimeCurrent;	
    struct tm *ltime;	 
	ltime = localtime (&timenow);
	
	return ltime->tm_mon;
}

int GetWeek (datetime TimeCurrent) {
   
    time_t timenow = (time_t)TimeCurrent;	
    struct tm *ltime;	 
	ltime = localtime (&timenow);
	
    int weekOfMonth = (ltime->tm_yday + ltime->tm_wday) / 7 + 1;

	return weekOfMonth;
}

int GetDay (datetime TimeCurrent) {
   
    time_t timenow = (time_t)TimeCurrent;	
    struct tm *ltime;	 
	ltime = localtime (&timenow);
	
	return ltime->tm_wday;
}

int GetHours (datetime TimeCurrent) {
   
    time_t timenow = (time_t)TimeCurrent;	
    struct tm *ltime;	 
	ltime = localtime (&timenow);
	
	return ltime->tm_hour;
}

int GetMinutes (datetime TimeCurrent) {
   
    time_t timenow = (time_t)TimeCurrent;	
    struct tm *ltime;	 
	ltime = localtime (&timenow);
	
	return ltime->tm_min ;
}


time_t timegm(struct tm *tm) 
{
        static const unsigned ndays[2][12] = {
                {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31},
                {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}
        };
        time_t res = 0;
        int i;
	
        for (i = 70; i < tm->tm_year; ++i)
                res += is_leap(i) ? 366 : 365;
	        for (i = 0; i < tm->tm_mon; ++i)
                res += ndays[is_leap(tm->tm_year)][i];
        res += tm->tm_mday - 1;
        res *= 24;
        res += tm->tm_hour;
        res *= 60;
        res += tm->tm_min;
        res *= 60;
        res += tm->tm_sec;
        return res;
}


	
datetime _ReturnTime (datetime TimeCurrent, const char sTime[])
{
    struct tm *ltime;
    time_t timenow = (time_t)TimeCurrent;
    ltime = gmtime (&timenow);
	int j = 0;
	int i = 0;

	char sHour[3];
	char sMin[3];
	char sSec[3];

	while (sTime[j] != ':')
	{
		sHour[i]= sTime[j];
		j++; i++;
	}
	sHour[i] = 0;
	j++;
	i = 0;
	while (sTime[j] != ':')
	{
		sMin[i]= sTime[j];
		j++; i++;
	}
	sMin[i] = 0;
	j++;
	i = 0;
	while (sTime[j] != 0)
	{
		sSec[i]= sTime[j];
		j++; i++;
	}
	sSec[i] = 0;
	ltime->tm_hour = atoi (sHour);
	ltime->tm_min = atoi (sMin);
	ltime->tm_sec = atoi (sSec);
	return (datetime)timegm (ltime);
}

datetime ReturnDate (const char sDate[])
{
    struct tm *ltime;
    time_t timenow = time (NULL);
    ltime = localtime (&timenow);
	int j = 0;
	int i = 0;

	char sDay[3];
	char sMonth[3];
	char sYear[5];
	ltime->tm_hour = 0;
	ltime->tm_min  = 0;
	ltime->tm_sec  = 0;

	while (sDate[j] != '/')
	{
		sDay[i]= sDate[j];
		j++; i++;
	}
	sDay[i] = 0;
	j++;
	i = 0;
	while (sDate[j] != '/')
	{
		sMonth[i]= sDate[j];
		j++; i++;
	}
	sMonth[i] = 0;
	j++;
	i = 0;
	while (sDate[j] != 0)
	{
		sYear[i]= sDate[j];
		j++; i++;
	}
	sYear[i] = 0;

	ltime->tm_mday = atoi (sDay);
	ltime->tm_mon = atoi (sMonth) - 1;
	ltime->tm_year = atoi (sYear) - 1900;

	return (datetime)mktime (ltime);
}


bool iAndR (int* RuleTab, int Operation, int OperationType, int rule, int rule1, int rule2, int rule3, int rule4, int rule5)
{
   int result = 0;
   result |=  (1L << rule);
   if (rule1 != -1)   result |= (1L << rule1);
   if (rule2 != -1)   result |= (1L << rule2);
   if (rule3 != -1)   result |= (1L << rule3);
   if (rule4 != -1)   result |= (1L << rule4);
   if (rule5 != -1)   result |= (11L << rule5);
   return ((_RuleTab(Operation,OperationType) & result) == result);
}



bool iOrR (int* RuleTab, int Operation, int OperationType, int rule, int rule1, int rule2, int rule3, int rule4, int rule5)
{
   int result = 0;
   result |=  (1L << rule);
   if (rule1 != -1)   result |= (1L << rule1);
   if (rule2 != -1)   result |= (1L << rule2);
   if (rule3 != -1)   result |= (1L << rule3);
   if (rule4 != -1)   result |= (1L << rule4);
   if (rule5 != -1)   result |= (1L << rule5);
   return ((_RuleTab(Operation,OperationType) & result) != 0);
}


bool iAndCR (int* RuleTab, int Operation, int OperationType, int rule)
{
   return ((_RuleTab(Operation,OperationType) & rule) == rule);
}

bool iOrCR (int* RuleTab, int Operation, int OperationType, int rule)
{
   return ((_RuleTab(Operation,OperationType) & rule) !=0);
}
  

void iSet_Rule (int* RuleTab, double* RuleTabValue, int Operation, int OperationType, int rule, int signal, double value)
{  
   if (signal == P_SIGNAL)   
     _RuleTab(Operation,OperationType) |=  (1L << rule);
   else 
     _RuleTab(Operation,OperationType) &=  ~(1L << rule);
   
   iSet_Rule_Value (RuleTabValue, Operation, OperationType, rule, value);
}

int iGet_Rule (int* RuleTab, int Operation, int OperationType, int rule)
{
   return (_RuleTab(Operation,OperationType) & (1L << rule));
}

void iSet_Rule_Value (double* RuleTabValue, int Operation, int OperationType, int rule, double Value)
{
  _RuleTabValue(Operation,OperationType,rule) = Value;
}


int iGet_Previous_Rule (int* BeforeRuleTab, int Operation, int OperationType, int rule)
{
   return (_BeforeRuleTab(Operation,OperationType) & (1L << rule));
}


double iRValue (double* RuleTabValue, int Operation, int OperationType, int rule)
{
   return (_RuleTabValue(Operation,OperationType, rule));
}




//========================================SIGNALS FUNCTIONS============================================================



bool iAbove (double* SignalTabValue, int Object1, int Object2, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result = (iSValue (SignalTabValue, Object1, S_CURRENT, period) > iSValue (SignalTabValue, Object2, S_CURRENT, period));
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period1) > iSValue (SignalTabValue, Object2, S_CURRENT, period1));
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period2) > iSValue (SignalTabValue, Object2, S_CURRENT, period2));
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period3) > iSValue (SignalTabValue, Object2, S_CURRENT, period3));
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period4) > iSValue (SignalTabValue, Object2, S_CURRENT, period4));
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period5) > iSValue (SignalTabValue, Object2, S_CURRENT, period5));
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period6) > iSValue (SignalTabValue, Object2, S_CURRENT, period6));
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period7) > iSValue (SignalTabValue, Object2, S_CURRENT, period7));
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period8) > iSValue (SignalTabValue, Object2, S_CURRENT, period8));
   return (result);
}    


bool iBelow (double* SignalTabValue, int Object1, int Object2, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result = (iSValue (SignalTabValue, Object1, S_CURRENT, period) < iSValue (SignalTabValue, Object2, S_CURRENT, period));
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period1) < iSValue (SignalTabValue, Object2, S_CURRENT, period1));
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period2) < iSValue (SignalTabValue, Object2, S_CURRENT, period2));
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period3) < iSValue (SignalTabValue, Object2, S_CURRENT, period3));
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period4) < iSValue (SignalTabValue, Object2, S_CURRENT, period4));
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period5) < iSValue (SignalTabValue, Object2, S_CURRENT, period5));
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period6) < iSValue (SignalTabValue, Object2, S_CURRENT, period6));
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period7) < iSValue (SignalTabValue, Object2, S_CURRENT, period7));
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object1, S_CURRENT, period8) < iSValue (SignalTabValue, Object2, S_CURRENT, period8));
   return (result);
}




bool iAngleUp (double* SignalTabValue, int Object,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period) > iSValue (SignalTabValue, Object, S_PANGLE, period));
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period1) > iSValue (SignalTabValue, Object, S_PANGLE, period1));
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period2) > iSValue (SignalTabValue, Object, S_PANGLE, period2));
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period3) > iSValue (SignalTabValue, Object, S_PANGLE, period3));
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period4) > iSValue (SignalTabValue, Object, S_PANGLE, period4));
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period5) > iSValue (SignalTabValue, Object, S_PANGLE, period5));
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period6) > iSValue (SignalTabValue, Object, S_PANGLE, period6));
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period7) > iSValue (SignalTabValue, Object, S_PANGLE, period7));
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period8) > iSValue (SignalTabValue, Object, S_PANGLE, period8));
   return (result);
}


bool iAngleDown (double* SignalTabValue, int Object, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period) < iSValue (SignalTabValue, Object, S_PANGLE, period));
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period1) < iSValue (SignalTabValue, Object, S_PANGLE, period1));
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period2) < iSValue (SignalTabValue, Object, S_PANGLE, period2));
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period3) < iSValue (SignalTabValue, Object, S_PANGLE, period3));
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period4) < iSValue (SignalTabValue, Object, S_PANGLE, period4));
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period5) < iSValue (SignalTabValue, Object, S_PANGLE, period5));
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period6) < iSValue (SignalTabValue, Object, S_PANGLE, period6));
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period7) < iSValue (SignalTabValue, Object, S_PANGLE, period7));
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period7) < iSValue (SignalTabValue, Object, S_PANGLE, period8));

   return (result);
}



bool iAngleAbove (double* SignalTabValue, int Object, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period) > value);
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period1) > value);
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period2) > value);
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period3) > value);
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period4) > value);
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period5) > value);
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period6) > value);
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period7) > value);
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period8) > value);

   return (result);
}

bool iAngleBelow (double* SignalTabValue, int Object, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period) < value);
   if (period1 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period1) < value);
   if (period2 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period2) < value);
   if (period3 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period3) < value);
   if (period4 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period4) < value);
   if (period5 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period5) < value);
   if (period6 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period6) < value);
   if (period7 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period7) < value);
   if (period8 != -1)   result =  (iSValue (SignalTabValue, Object, S_ANGLE, period8) < value);

   return (result);
}


bool iAngleDivergence (int* SignalTab, double* SignalTabValue, int Object, int period)
{
   return ((iAndS (SignalTab, Object, S_UP, period)   && iAngleBelow (SignalTabValue, Object, 0, period)) ||
           (iAndS (SignalTab, Object, S_DOWN, period) && iAngleAbove (SignalTabValue, Object, 0, period)));
}

bool iAndAngle (int* SignalTab, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

   return ((_SignalTab(Object,SignalType) & result) == result);
}

/////////////////////////////////////////////////////  VALUE //////////////////////////////////////////////////////////////////////


double iMaxV (double* SignalTabValue, int Object, int SignalType, int period, int period1, int period2 , int period3 , int period4 , int period5 , int period6 , int period7 , int period8 )
{
   double result = -EMPTY_VALUE;
   if (period  != -1)	result =  iSValue (SignalTabValue, Object, SignalType, period);
   if (period1 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period1));
   if (period2 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period2));
   if (period3 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period3));
   if (period4 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period4));
   if (period5 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period5));
   if (period6 != -1)	result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period6));
   if (period7 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period7));
   if (period8 != -1)   result =  Max (result, iSValue (SignalTabValue, Object, SignalType, period8));

   return (result);

}

double iMinV (double* SignalTabValue, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   double result = EMPTY_VALUE;
   if (period  != -1)	result =  iSValue (SignalTabValue, Object, SignalType, period);
   if (period1 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period1));
   if (period2 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period2));
   if (period3 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period3));
   if (period4 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period4));
   if (period5 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period5));
   if (period6 != -1)	result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period6));
   if (period7 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period7));
   if (period8 != -1)   result =  Min (result, iSValue (SignalTabValue, Object, SignalType, period8));

   return (result);

}

double iMaxPV (double* BeforeSignalTabValue, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   double result = -EMPTY_VALUE;
   if (period  != -1)	result =  iSPValue (BeforeSignalTabValue, Object, SignalType, period);
   if (period1 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period1));
   if (period2 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period2));
   if (period3 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period3));
   if (period4 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period4));
   if (period5 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period5));
   if (period6 != -1)	result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period6));
   if (period7 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period7));
   if (period8 != -1)   result =  Max (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period8));

   return (result);

}
double iMinPV (double* BeforeSignalTabValue, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   double result = EMPTY_VALUE;
   if (period  != -1)	result =  iSPValue (BeforeSignalTabValue, Object, SignalType, period);
   if (period1 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period1));
   if (period2 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period2));
   if (period3 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period3));
   if (period4 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period4));
   if (period5 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period5));
   if (period6 != -1)	result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period6));
   if (period7 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period7));
   if (period8 != -1)   result =  Min (result, iSPValue (BeforeSignalTabValue, Object, SignalType, period8));

   return (result);

}


bool iAndV_Eq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) == value);
   if (period1 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period1) == value);
   if (period2 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period2) == value);
   if (period3 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period3) == value);
   if (period4 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period4) == value);
   if (period5 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period5) == value);
   if (period6 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period6) == value);
   if (period7 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period7) == value);
   if (period8 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period8) == value);

   return (result);
}

bool iAndV_L (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) < value);
   if (period1 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period1) < value);
   if (period2 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period2) < value);
   if (period3 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period3) < value);
   if (period4 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period4) < value);
   if (period5 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period5) < value);
   if (period6 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period6) < value);
   if (period7 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period7) < value);
   if (period8 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period8) < value);

   return (result);
}

bool iAndV_LEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) <= value);
   if (period1 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period1) <= value);
   if (period2 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period2) <= value);
   if (period3 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period3) <= value);
   if (period4 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period4) <= value);
   if (period5 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period5) <= value);
   if (period6 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period6) <= value);
   if (period7 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period7) <= value);
   if (period8 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period8) <= value);

   return (result);
}

bool iAndV_G (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) > value);
   if (period1 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period1) > value);
   if (period2 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period2) > value);
   if (period3 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period3) > value);
   if (period4 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period4) > value);
   if (period5 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period5) > value);
   if (period6 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period6) > value);
   if (period7 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period7) > value);
   if (period8 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period8) > value);

   return (result);
}

bool iAndV_GEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) >= value);
   if (period1 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period1) >= value);
   if (period2 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period2) >= value);
   if (period3 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period3) >= value);
   if (period4 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period4) >= value);
   if (period5 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period5) >= value);
   if (period6 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period6) >= value);
   if (period7 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period7) >= value);
   if (period8 != -1)   result =  result && (iSValue (SignalTabValue, Object, SignalType, period8) >= value);

   return (result);
}
bool iAndPV_Eq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) == value);
   if (period1 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) == value);
   if (period2 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) == value);
   if (period3 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) == value);
   if (period4 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) == value);
   if (period5 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) == value);
   if (period6 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) == value);
   if (period7 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) == value);
   if (period8 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) == value);

   return (result);
}

bool iAndPV_L (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) < value);
   if (period1 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) < value);
   if (period2 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) < value);
   if (period3 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) < value);
   if (period4 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) < value);
   if (period5 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) < value);
   if (period6 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) < value);
   if (period7 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) < value);
   if (period8 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) < value);

   return (result);
}

bool iAndPV_LEq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) <= value);
   if (period1 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) <= value);
   if (period2 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) <= value);
   if (period3 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) <= value);
   if (period4 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) <= value);
   if (period5 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) <= value);
   if (period6 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) <= value);
   if (period7 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) <= value);
   if (period8 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) <= value);

   return (result);
}

bool iAndPV_G (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) > value);
   if (period1 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) > value);
   if (period2 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) > value);
   if (period3 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) > value);
   if (period4 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) > value);
   if (period5 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) > value);
   if (period6 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) > value);
   if (period7 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) > value);
   if (period8 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) > value);

   return (result);
}

bool iAndPV_GEq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 1;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) >= value);
   if (period1 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) >= value);
   if (period2 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) >= value);
   if (period3 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) >= value);
   if (period4 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) >= value);
   if (period5 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) >= value);
   if (period6 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) >= value);
   if (period7 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) >= value);
   if (period8 != -1)   result =  result && (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) >= value);

   return (result);
}


bool iOrV_Eq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) == value);
   if (period1 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period1) == value);
   if (period2 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period2) == value);
   if (period3 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period3) == value);
   if (period4 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period4) == value);
   if (period5 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period5) == value);
   if (period6 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period6) == value);
   if (period7 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period7) == value);
   if (period8 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period8) == value);

   return (result);
}
bool iOrV_L (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) < value);
   if (period1 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period1) < value);
   if (period2 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period2) < value);
   if (period3 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period3) < value);
   if (period4 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period4) < value);
   if (period5 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period5) < value);
   if (period6 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period6) < value);
   if (period7 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period7) < value);
   if (period8 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period8) < value);

   return (result);
}
bool iOrV_LEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) <= value);
   if (period1 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period1) <= value);
   if (period2 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period2) <= value);
   if (period3 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period3) <= value);
   if (period4 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period4) <= value);
   if (period5 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period5) <= value);
   if (period6 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period6) <= value);
   if (period7 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period7) <= value);
   if (period8 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period8) <= value);

   return (result);
}
bool iOrV_G (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) > value);
   if (period1 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period1) > value);
   if (period2 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period2) > value);
   if (period3 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period3) > value);
   if (period4 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period4) > value);
   if (period5 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period5) > value);
   if (period6 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period6) > value);
   if (period7 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period7) > value);
   if (period8 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period8) > value);

   return (result);
}

bool iOrV_GEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSValue (SignalTabValue, Object, SignalType, period) >= value);
   if (period1 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period1) >= value);
   if (period2 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period2) >= value);
   if (period3 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period3) >= value);
   if (period4 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period4) >= value);
   if (period5 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period5) >= value);
   if (period6 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period6) >= value);
   if (period7 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period7) >= value);
   if (period8 != -1)   result =  result || (iSValue (SignalTabValue, Object, SignalType, period8) >= value);

   return (result);
}

bool iOrPV_Eq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) == value);
   if (period1 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) == value);
   if (period2 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) == value);
   if (period3 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) == value);
   if (period4 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) == value);
   if (period5 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) == value);
   if (period6 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) == value);
   if (period7 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) == value);
   if (period8 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) == value);

   return (result);
}
bool iOrPV_L (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) < value);
   if (period1 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) < value);
   if (period2 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) < value);
   if (period3 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) < value);
   if (period4 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) < value);
   if (period5 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) < value);
   if (period6 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) < value);
   if (period7 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) < value);
   if (period8 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) < value);

   return (result);
}
bool iOrPV_LEq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) <= value);
   if (period1 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) <= value);
   if (period2 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) <= value);
   if (period3 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) <= value);
   if (period4 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) <= value);
   if (period5 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) <= value);
   if (period6 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) <= value);
   if (period7 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) <= value);
   if (period8 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) <= value);

   return (result);
}

bool iOrPV_G (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) > value);
   if (period1 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) > value);
   if (period2 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) > value);
   if (period3 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) > value);
   if (period4 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) > value);
   if (period5 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) > value);
   if (period6 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) > value);
   if (period7 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) > value);
   if (period8 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) > value);

   return (result);
}
bool iOrPV_GEq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   bool result = 0;
   if (period  != -1)	result =  (iSPValue (BeforeSignalTabValue, Object, SignalType, period) >= value);
   if (period1 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period1) >= value);
   if (period2 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period2) >= value);
   if (period3 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period3) >= value);
   if (period4 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period4) >= value);
   if (period5 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period5) >= value);
   if (period6 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period6) >= value);
   if (period7 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period7) >= value);
   if (period8 != -1)   result =  result || (iSPValue (BeforeSignalTabValue, Object, SignalType, period8) >= value);

   return (result);
}

bool iAndBV_Eq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iAndV_Eq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iAndPV_Eq (BeforeSignalTabValue, Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iAndBV_LEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iAndV_LEq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iAndPV_LEq (BeforeSignalTabValue, Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iAndBV_L (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iAndV_L (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iAndPV_L (BeforeSignalTabValue, Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iAndBV_G (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iAndV_G (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iAndPV_G (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iAndBV_GEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iAndV_GEq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iAndPV_GEq (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}

bool iOrBV_Eq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iOrV_Eq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iOrPV_Eq (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iOrBV_LEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iOrV_LEq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iOrPV_LEq (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iOrBV_L (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iOrV_L (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iOrPV_L (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iOrBV_G (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iOrV_G (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iOrPV_G (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}
bool iOrBV_GEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
    return (iOrV_GEq (SignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8) &&
            !iOrPV_GEq (BeforeSignalTabValue,Object, SignalType, value, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8));
}



////////////////////////////////////////////////////////// END VALUE ///////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////BOOLEAN ////////////////////////////////////////////////////




int iAndS (int* SignalTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

   return ((_SignalTab(Object,SignalType) & result) == result ? _SignalTab(Object,SignalType) & result : 0);
}


int iAndPS (int* BeforeSignalTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

   return ((_BeforeSignalTab(Object,SignalType) & result) == result ? _BeforeSignalTab(Object,SignalType) & result : 0);
}

int iAndPTS (int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

   return ((_BeforeSignalTickTab(Object,SignalType) & result) == result ? _BeforeSignalTickTab(Object,SignalType) & result : 0);
}

int iOrS (int* SignalTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);
   
   return ((_SignalTab(Object,SignalType) & result) != 0 ? _SignalTab(Object,SignalType) & result : 0);
}

int iOrPS (int* BeforeSignalTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

   return ((_BeforeSignalTab(Object,SignalType) & result) != 0 ? _BeforeSignalTab(Object,SignalType) & result : 0);
}

int iOrPTS (int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = 0;
   result |=  (1L << period);
   if (period1 != -1)   result |= (1L << period1);
   if (period2 != -1)   result |= (1L << period2);
   if (period3 != -1)   result |= (1L << period3);
   if (period4 != -1)   result |= (1L << period4);
   if (period5 != -1)   result |= (1L << period5);
   if (period6 != -1)   result |= (1L << period6);
   if (period7 != -1)   result |= (1L << period7);
   if (period8 != -1)   result |= (1L << period8);

	return ((_BeforeSignalTickTab(Object,SignalType) & result) != 0 ? _BeforeSignalTickTab(Object,SignalType) & result : 0);
}


int iAndTS (int* SignalTab, int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1, int period2, int period3, int period4, int period5, int period6, int period7, int period8)
{
   int result = iAndS (SignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8);
   return ((result && !iAndPTS (BeforeSignalTickTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8)) ? result : 0);
}

int iAndBS (int* SignalTab, int* BeforeSignalTab, int Object, int SignalType, int period, int period1, int period2 , int period3 , int period4 , int period5 , int period6 , int period7 , int period8 )
{
   int result = iAndS (SignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8);
   return ((result && !iAndPS (BeforeSignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8)) ? result : 0);
}

int iOrTS (int* SignalTab, int* BeforeSignalTickTab,int Object, int SignalType, int period, int period1, int period2 , int period3 , int period4 , int period5 , int period6 , int period7 , int period8 )
{
   int result = iOrS (SignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8);
   return ((result && !iOrPTS (BeforeSignalTickTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8)) ? result : 0);
}

int iOrBS (int* SignalTab, int* BeforeSignalTab, int Object, int SignalType, int period, int period1, int period2 , int period3 , int period4 , int period5 , int period6 , int period7 , int period8 )
{
   int result = iOrS (SignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8);
   return ((result && !iOrPS (BeforeSignalTab, Object, SignalType, period, period1, period2 , period3 , period4 , period5 , period6 , period7 , period8)) ? result : 0);
}






int iAll (int* SignalTab, int Object, int SignalType,  int period1, int period2, int period3, int period4, int period5, int period6) 
{
   int result = Fmod (_SignalTab(Object,SignalType), 256); // month
   result = Fmod (result, 128);    // week
   result = Fmod (result, 64);     // day
 
   if (period1 != -1)   result = Fmod (result, period1);
   if (period2 != -1)   result = Fmod (result, period2);
   if (period3 != -1)   result = Fmod (result, period3);
   if (period4 != -1)   result = Fmod (result, period4);
   if (period5 != -1)   result = Fmod (result, period5);
   if (period6 != -1)   result = Fmod (result, period6);
   return (result);
}





int iAll_s (int* SignalTab, int Object, int SignalType,  int period1, int period2, int period3) 
{
   int result = Fmod (_SignalTab(Object,SignalType), 256); // month
   result = Fmod (result, 128);
   result = Fmod (result, 64);
   result = Fmod (result, 32);
   result = Fmod (result, 16);
   result = Fmod (result, 8);

   if (period1 != -1)   result = Fmod (result, period1);
   if (period2 != -1)   result = Fmod (result, period2);
   if (period3 != -1)   result = Fmod (result, period3);
   return (result);
}


int iGet_Signal (int* SignalTab, int Object, int SignalType, int period)
{
   return (_SignalTab(Object,SignalType) & (1L << period));
}

int iGet_Previous_Signal (int* BeforeSignalTab, int Object, int SignalType, int period)
{
   return (_BeforeSignalTab(Object,SignalType) & (1L <<period));
}

double iSValue (double* SignalTabValue, int Object, int SignalType, int period)
{
   return (_SignalTabValue(Object, SignalType, period));
}

double iSPValue (double* BeforeSignalTabValue, int Object, int SignalType, int period)
{
   return (_BeforeSignalTabValue(Object,SignalType,period));
}


datetime iSTime (datetime* SignalTabTime, int Object, int SignalType, int period)
{
   return (_SignalTabTime(Object,SignalType,period));
}

datetime iSPTime (datetime* BeforeSignalTabTime, int Object, int SignalType, int period)
{
   return (_BeforeSignalTabTime(Object,SignalType,period));
}


double iSPrice (double* SignalTabPrice, int Object, int SignalType, int period)
{
   return (_SignalTabPrice(Object,SignalType,period));
}

double iSPPrice (double* BeforeSignalTabPrice, int Object, int SignalType, int period)
{
   return (_BeforeSignalTabPrice(Object,SignalType,period));
}

void iSet_Signal_Value (double* SignalTabValue, int Object, int SignalType, int period, double Value)
{
   _SignalTabValue(Object, SignalType, period) = Value;
}

void iSet_Signal_Time (datetime* SignalTabTime, int Object, int SignalType, int period, datetime Value)
{
   _SignalTabTime(Object, SignalType, period) = Value;
}

void iSet_Signal_Price (double* SignalTabPrice, int Object, int SignalType, int period, double Value)
{
   _SignalTabPrice(Object,SignalType, period) = Value;
}


void iSet_Previous_Signal_Value (double* BeforeSignalTabValue, int Object, int SignalType, int period, double Value)
{
   _BeforeSignalTabValue(Object,SignalType,period) = Value;
}


void iSet_Signal (int* SignalTab, int* BeforeSignalTickTab, double* SignalTabValue, datetime* SignalTabTime, double* SignalTabPrice, datetime TimeCurrent, double Bid, int Object, int SignalType, int period, int signal, double value)
{  
   if (signal == P_SIGNAL)  
   {
      _SignalTab(Object,SignalType) |=  (1L << period);
      if (!iAndPTS (BeforeSignalTickTab, Object, SignalType, period)) 
      {
         iSet_Signal_Time (SignalTabTime, Object, SignalType, period, TimeCurrent);
         iSet_Signal_Price (SignalTabPrice, Object, SignalType, period, Bid);
      }   
   }
   else 
   {
      _SignalTab(Object,SignalType) &=  ~(1L << period);
      if (iAndPTS (BeforeSignalTickTab, Object, SignalType, period)) 
      {
         iSet_Signal_Time (SignalTabTime, Object, SignalType, period, -1);
         iSet_Signal_Price (SignalTabPrice, Object, SignalType, period, -1);
      }   
   }
   if (value != -1)
      iSet_Signal_Value (SignalTabValue, Object, SignalType, period, value);
}



void iSet_Previous_Signal (int* BeforeSignalTab, double* BeforeSignalTabValue, int Object, int SignalType, int period, int signal, double value)
{  
   if (signal == P_SIGNAL)  
      _BeforeSignalTab(Object,SignalType) |=  (1L << period);
   else 
      _BeforeSignalTab(Object,SignalType) &=  ~(1L << period);
   if (value != -1)
      iSet_Previous_Signal_Value (BeforeSignalTabValue, Object, SignalType, period, value);
}
////////////////////////////////////////////////////////////////////////EXTERNALS////////////////////////////////////////////////////////////////////////////////







#include "Progress.h"
//---------------------------------  GENERATE DEFINE       -------------------------------------------

#define MA_200 50
#define EMA_40 51
#define EMA_34 52
#define MA_50 53
#define EMA_20 54
#define EMA_8 55
#define MA_12 56
#define SMA_5 57
#define RSI_60 58
#define RSI_2 59
#define RSI_0 60
#define RSI_14 61
#define ATR_20 62
#define ATR_14 63
#define ADX_14 64
#define SAR 65
#define CCI_0 66
#define BOLLINGER_0 67
#define ICHIMOKU_0 68
#define MACD_0 69
#define WPR_100 70
#define WPR_14 71
#define S_TRIX 72
#define F_TRIX 73
#define VELOCITY 74
#define ACCELERATION 75
#define RSI_8 76
#define SMA_10 77
#define SMA_30 78


//--------------------------------- CONDITIONS ARE HERE  -------------------------------------------

//********************************  CONDITION DEFINE + EXTERN *****************************************



//--------------------------------- SYSTEM OBJECTS ARE HERE  -------------------------------------------

void SYSTEM (x)
{
}

//********************************  CONDITION FUNCTIONS      *****************************************



//--------------------------------- STRATEGIES Rules -------------------------------------------

double  ordertype  =  0.0;
/* ============================================================
STRATEGY : RSI_2_REVERSAL
RULE : K
=============================================================*/

void R_RULE (K)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(RSI_2, S_OVERBOUGHT, CurrentPeriod) && AndS(MA_200, S_BELOW, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);ordertype = OP_SELL;}

if ((AndS(RSI_2, S_OVERSOLD, CurrentPeriod) && AndS(MA_200, S_ABOVE, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);ordertype = OP_BUY;}

if ((AndS(SMA_5, S_CROSS_UP, CurrentPeriod) && AndS(MA_200, S_ABOVE, CurrentPeriod) && (ordertype == OP_BUY)))

{ Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);}

if ((AndS(SMA_5, S_CROSS_DOWN, CurrentPeriod) && AndS(MA_200, S_BELOW, CurrentPeriod) && (ordertype == OP_SELL)))

{ Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);}
Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);}

/* ============================================================
STRATEGY : EMA_PARABOLIC_SAR
RULE : W
=============================================================*/

void R_RULE (W)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_W, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_W, P_SIGNAL);Set_Rule(OP_EXIT, T_STATUS, R_W, P_SIGNAL);}

/* ============================================================
STRATEGY : MA_RSI_SCALPING
RULE : U
=============================================================*/

void R_RULE (U)
{

//------------------------------BUYSELL ENGINE ------------------------------

}

/* ============================================================
STRATEGY : EMA20_SAR
RULE : V
=============================================================*/

void R_RULE (V)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_V) == 0) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_V) == 0)))

{ Set_Rule(OP_BUYSELL, T_ORDERTYPE, R_V, P_SIGNAL, OT_HEDGE);}

if ((AndS(SAR, S_BULL, CurrentPeriod) && AndS(EMA_20, S_ABOVE, CurrentPeriod) && AndS(SAR, S_CHANGED, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_V, P_SIGNAL);}

if ((AndS(SAR, S_BEAR, CurrentPeriod) && AndS(EMA_20, S_BELOW, CurrentPeriod) && AndS(SAR, S_CHANGED, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_PROFIT, R_V) > 10) && AndS(SAR, S_BEAR, CurrentPeriod)))

{ Set_Rule(OP_CLOSE, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_PROFIT, R_V) > 10) && AndS(SAR, S_BULL, CurrentPeriod)))

{ Set_Rule(OP_CLOSE, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_V) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_V) == 0)))

{ Set_Rule(OP_EXIT, T_MINPROFIT, R_V, P_SIGNAL, 0);}
Set_Rule(OP_EXIT, T_STATUS, R_V, P_SIGNAL);}

/* ============================================================
STRATEGY : VELOCITY_M5
RULE : D
=============================================================*/

void R_RULE (D)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(VELOCITY, S_OVERSOLD, P_M5) && AndPS(VELOCITY, S_DOWN, P_M5)))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);}

if ((AndS(VELOCITY, S_OVERBOUGHT, P_M5) && AndPS(VELOCITY, S_UP, P_M5)))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);}

if (AndS(VELOCITY, S_OVERSOLD, P_M5))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, 0);}else 
{
if ((RValue (OP_BUYSELL, T_PROFITSELL, R_D) < -100))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_D, P_SIGNAL);}
}

if (AndS(VELOCITY, S_OVERBOUGHT, P_M5))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, 0);}else 
{
if ((RValue (OP_BUYSELL, T_PROFITBUY, R_D) < -100))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_D, P_SIGNAL);}
}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_D) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_D) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);}
}

/* ============================================================
STRATEGY : BAR_TOPPED
RULE : Q
=============================================================*/

void R_RULE (Q)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndPS(BAR, S_BULL, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && AndS(BAR, S_BEAR, CurrentPeriod) && AndS(LOW, S_BELOW, CurrentPeriod) && AndV_LEq(EMA_20, S_ANGLE, -20, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_Q, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_Q) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}

if ((AndPS(BAR, S_BEAR, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && AndS(BAR, S_BULL, CurrentPeriod) && AndS(HIGH, S_ABOVE, CurrentPeriod) && AndV_GEq(EMA_20, S_ANGLE, 20, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_Q, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_Q) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}
Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_Q));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_Q));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_Q) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_Q) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_Q, P_SIGNAL);}
}

/* ============================================================
STRATEGY : BAR_CORRECTION
RULE : P
=============================================================*/

void R_RULE (P)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((SValue(EMA_8, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ 
if ((AndPS(LOW, S_DOWN, CurrentPeriod) && AndPS(HIGH, S_DOWN, CurrentPeriod) && AndS(HIGH, S_ABOVE, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_P, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}
}else 
{Set_Rule(OP_CLOSE_BUY, T_STATUS, R_P, P_SIGNAL);}

if ((SValue(EMA_8, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ 
if ((AndPS(LOW, S_UP, CurrentPeriod) && AndPS(HIGH, S_UP, CurrentPeriod) && AndS(LOW, S_BELOW, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_P, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}
}else 
{Set_Rule(OP_CLOSE_SELL, T_STATUS, R_P, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_P));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_P));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_P));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_P));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_P) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_P) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_P, P_SIGNAL);}
}

/* ============================================================
STRATEGY : MA_BULL_BEAR
RULE : L
=============================================================*/

void R_RULE (L)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((SValue(EMA_20, S_ANGLE, CurrentPeriod) < 0) && (SPValue(OPEN, S_CURRENT, CurrentPeriod) >= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) <= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BEAR, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_L, P_SIGNAL);}

if (((SValue(EMA_20, S_ANGLE, CurrentPeriod) > 0) && (SPValue(OPEN, S_CURRENT, CurrentPeriod) <= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) >= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BULL, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_L, P_SIGNAL);}

if ((SPValue(LOW, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_L, P_SIGNAL);}

if ((SPValue(HIGH, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_L, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_L) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_L) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_L, P_SIGNAL);}
}

/* ============================================================
STRATEGY : BAR_QUAD
RULE : O
=============================================================*/

void R_RULE (O)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((AndS(BAR, S_BEAR, CurrentPeriod) && AndPS(BAR, S_BULL, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && (Bid < SPValue(LOW, S_PREVIOUS, CurrentPeriod))) || (AndS(BAR, S_BEAR_QUAD, CurrentPeriod) && (Bid < SValue(BAR, S_BEAR_QUAD, CurrentPeriod)))))

{ Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_O, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_O) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_O) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));}
}

if (((AndS(BAR, S_BULL, CurrentPeriod) && AndPS(BAR, S_BEAR, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && (Ask > SPValue(HIGH, S_PREVIOUS, CurrentPeriod))) || (AndS(BAR, S_BULL_QUAD, CurrentPeriod) && (Ask > SValue(BAR, S_BULL_QUAD, CurrentPeriod)))))

{ Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_O, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_O) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_O) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));}
}
Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_O, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_O));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_O, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_O));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_O));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_O));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_O) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_O) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_O, P_SIGNAL);}
}

/* ============================================================
STRATEGY : BAR_ONLY
RULE : N
=============================================================*/

void R_RULE (N)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(BAR, S_BEAR_ENGULFING, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_N, P_SIGNAL);}else 
{
if (AndS(BAR, S_BULL_ENGULFING, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_N, P_SIGNAL);}else 
{
if ((AndPS(BAR, S_BEAR_QUAD, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN1, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN2, CurrentPeriod) || AndPS(BAR, S_BEAR_HARAMI, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, CurrentPeriod) || AndPS(BAR, S_BEAR_DARK_CLOUD_COVER, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_BLACK_CROWS, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_INSIDE_DOWN, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_OUTSIDE_DOWN, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_N, P_SIGNAL);}else 
{
if ((AndPS(BAR, S_BULL_QUAD, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_HARAMI, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_PIERCING_LINE, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_WHITE_SOLDIERS, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_INSIDE_UP, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_OUTSIDE_UP, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_N, P_SIGNAL);}
}
}
}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_N) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_N) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_N, P_SIGNAL);}
}

/* ============================================================
STRATEGY : R_S
RULE : M
=============================================================*/

void R_RULE (M)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(SUPPORT, S_CROSS_DOWN, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);}

if (AndS(RESISTANCE, S_CROSS_UP, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_M, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_M, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_M) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_M) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_M, P_SIGNAL);}
}

/* ============================================================
STRATEGY : H_L_DAY
RULE : R
=============================================================*/

void R_RULE (R)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndPS(CLOSE, S_MININDAY, CurrentPeriod) && AndPS(CLOSE, S_MAXINDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_R, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_R) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_R, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}

if ((!AndPS(CLOSE, S_MAXINDAY, CurrentPeriod) && AndPS(CLOSE, S_MININDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_R) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_R, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
Set_Rule(OP_SELL, T_STATUS, R_R, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_R, P_SIGNAL, 0);Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_R, P_SIGNAL, 0);
if (((GetDay(CurrentTime) == 5) && (CurrentTime >= ReturnTime("23:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_R, P_SIGNAL);}
}

/* ============================================================
STRATEGY : H_L_H4_BOX
RULE : H
=============================================================*/

void R_RULE (H)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
if ((Bid > (SValue(HIGH, S_FIRSTINWEEK, P_H4) + PipValue(5))))

{ Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}

if ((Bid < (SValue(LOW, S_FIRSTINWEEK, P_H4) - PipValue(5))))

{ Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTS, R_H));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTS, R_H));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_H));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_H));
if (((GetDay(CurrentTime) == 5) && (CurrentTime >= ReturnTime("23:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_H, P_SIGNAL);}
}

/* ============================================================
STRATEGY : H_L_WEEK
RULE : B
=============================================================*/

void R_RULE (B)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndS(CLOSE, S_MININWEEK, CurrentPeriod) && AndS(CLOSE, S_MAXINWEEK, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_B, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_B, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_B) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_B, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}

if ((!AndS(CLOSE, S_MAXINWEEK, CurrentPeriod) && AndS(CLOSE, S_MININWEEK, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_B) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_B, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
Set_Rule(OP_SELL, T_STATUS, R_B, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_B, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_B, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTS, R_B));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_B, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTS, R_B));
if (((GetDay(CurrentTime) == 5) && (CurrentTime >= ReturnTime("20:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_B, P_SIGNAL);}
}

/* ============================================================
STRATEGY : F_T_C
RULE : F
=============================================================*/

void R_RULE (F)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(BAR, S_BULL, P_H4, P_D1, P_W1, P_MN))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BEAR, P_H4, P_D1, P_W1, P_MN))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BEAR, P_D1))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BULL, P_D1))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_F, P_SIGNAL);}

if (((GetDay(CurrentTime) == 5) && (CurrentTime >= ReturnTime("20:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);}
}

/* ============================================================
STRATEGY : DAY_G_R_Candle
RULE : I
=============================================================*/

void R_RULE (I)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((SValue(BAR, S_NBRBARS, P_D1) == 2) && AndS(BAR, S_BULL, P_D1) && AndS(HIGH, S_UP, P_D1)))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_I, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}
}

if (((SValue(BAR, S_NBRBARS, P_D1) == 2) && AndS(BAR, S_BEAR, P_D1) && AndS(LOW, S_DOWN, P_D1)))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_I, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}
}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTS, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTS, R_I));Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_I));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_I));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_I) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_I) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_I, P_SIGNAL);}
}

/* ============================================================
STRATEGY : PS
RULE : A
=============================================================*/

void R_RULE (A)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(ADX_14, S_STRONG, CurrentPeriod) && AndBS(S_TRIX, S_UP, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);}

if ((AndS(ADX_14, S_STRONG, CurrentPeriod) && AndBS(S_TRIX, S_DOWN, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);}

if (AndS(S_TRIX, S_DOWN, CurrentPeriod))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_A, P_SIGNAL);}

if (AndS(S_TRIX, S_UP, CurrentPeriod))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_A, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_A) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_A) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);}
}

/* ============================================================
STRATEGY : FRACTAL_CROSS
RULE : G
=============================================================*/

void R_RULE (G)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(DOWNFRACTAL, S_CROSS_DOWN, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);}

if (AndS(UPFRACTAL, S_CROSS_UP, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);}
Set_Rule(OP_EXIT, T_STATUS, R_G, P_SIGNAL);}

double  plow  =  0.0;
double  phigh  =  0.0;
/* ============================================================
STRATEGY : PIVOT_PINBAR
RULE : J
=============================================================*/

void R_RULE (J)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((AndPS(BAR, S_BEAR_SHOOTING_STAR, P_H1) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, P_H1) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, P_H1)) && (((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_POINT, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_POINT, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_POINT, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_POINT, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_POINT, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_POINT, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE1, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE1, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE2, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE2, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_HIGH, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_HIGH, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_HIGH, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_HIGH, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_HIGH, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_HIGH, S_PREVIOUS, P_D1))))))

{ plow = SValue(LOW, S_PREVIOUS, P_H1);Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_J, P_SIGNAL);}

if (((AndPS(BAR, S_BULL_HAMMER, P_H1) || AndPS(BAR, S_BULL_HAMMER1, P_H1) || AndPS(BAR, S_BULL_HAMMER2, P_H1)) && (((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_POINT, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_POINT, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_POINT, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_POINT, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_POINT, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_POINT, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE1, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE1, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE1, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE2, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE2, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_RESISTANCE2, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_HIGH, S_CURRENT, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_HIGH, S_CURRENT, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SValue(PIVOT_HIGH, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SValue(PIVOT_HIGH, S_PREVIOUS, P_D1))) || ((SValue(HIGH, S_PREVIOUS, P_H1) >= SPValue(PIVOT_HIGH, S_PREVIOUS, P_D1)) && (SValue(LOW, S_PREVIOUS, P_H1) <= SPValue(PIVOT_HIGH, S_PREVIOUS, P_D1))))))

{ phigh = SValue(HIGH, S_PREVIOUS, P_H1);Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_J, P_SIGNAL);}
}

/* ============================================================
STRATEGY : Pivot_Point_Cross
RULE : S
=============================================================*/

void R_RULE (S)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(PIVOT_POINT, S_BELOW, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && (fabs((SValue(PIVOT_POINT, S_DISTANCE, P_D1) / Point)) <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_S, P_SIGNAL);}

if ((AndS(PIVOT_POINT, S_ABOVE, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && (fabs((SValue(PIVOT_POINT, S_DISTANCE, P_D1) / Point)) <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_S, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_S) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_S) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_S, P_SIGNAL);}
}

/* ============================================================
STRATEGY : Pivot_Support_Cross
RULE : T
=============================================================*/

void R_RULE (T)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndS(PIVOT_SUPPORT, S_CROSS_DOWN, P_D1) && AndS(PIVOT_SUPPORT, S_ABOVE, P_D1) && (fabs((SValue(PIVOT_SUPPORT, S_DISTANCE, P_D1) / Point)) <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_T, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_T, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_T) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_T) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_T, P_SIGNAL);}
}

/* ============================================================
STRATEGY : Pivot_Resistance_Cross
RULE : E
=============================================================*/

void R_RULE (E)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndS(PIVOT_RESISTANCE, S_CROSS_UP, P_D1) && AndS(PIVOT_RESISTANCE, S_BELOW, P_D1) && (fabs((SValue(PIVOT_RESISTANCE, S_DISTANCE, P_D1) / Point)) <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_E) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_E) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);}
}

/* ============================================================
STRATEGY : GRID
RULE : C
=============================================================*/

void R_RULE (C)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_C, P_SIGNAL);
if (((SValue(CLOSE, S_CURRENT, CurrentPeriod) > SPValue(HIGH, S_PREVIOUS, CurrentPeriod)) && (SValue(CLOSE, S_CURRENT, CurrentPeriod) > SValue(HIGH, S_PREVIOUS, CurrentPeriod)) && AndPS(LOW, S_DOWN, CurrentPeriod)))

{ Set_Rule(OP_BUY, T_STATUS, R_C, P_SIGNAL);}

if (((SValue(CLOSE, S_CURRENT, CurrentPeriod) < SPValue(LOW, S_PREVIOUS, CurrentPeriod)) && (SValue(CLOSE, S_CURRENT, CurrentPeriod) < SValue(LOW, S_PREVIOUS, CurrentPeriod)) && AndPS(HIGH, S_UP, CurrentPeriod)))

{ Set_Rule(OP_SELL, T_STATUS, R_C, P_SIGNAL);}
Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);}



//--------------------------------- Not Called Strategies Rules -------------------------------------------

void R_RULE (X)
{};
void R_RULE (Y)
{};
