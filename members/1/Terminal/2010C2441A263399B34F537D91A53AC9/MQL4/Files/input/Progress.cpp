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

   return ((_SignalTab(Object,SignalType) & result) == result ? result : 0);
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

   return ((_BeforeSignalTab(Object,SignalType) & result) == result ? result : 0);
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

   return ((_BeforeSignalTickTab(Object,SignalType) & result) == result ? result : 0);
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
   
   return (_SignalTab(Object,SignalType) & result);
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

   return (_BeforeSignalTab(Object,SignalType) & result);
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

	return (_BeforeSignalTickTab(Object,SignalType) & result);
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







