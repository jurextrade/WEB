//+-------------------   STDLIB Functions   -------------------------+

#import "shell32.dll"
   int       ShellExecuteA(int hWnd, string Verb, string File, string Parameter, string Path, int ShowCmd);
#import

#import "stdlib.ex4"
    string   ErrorDescription(int error_code);
    int      RGB(int red_value,int green_value,int blue_value);
    bool     CompareDoubles(double number1, double number2);
    string   DoubleToStrMorePrecision(double number,int precision);
    string   IntegerToHexString(int integer_number);
#import

//+-------------------   Time Functions     -------------------------+
#import "kernel32.dll"
    void     GetLocalTime(int& TimeArray[]);
    void     GetSystemTime(int& TimeArray[]);
    int      GetTimeZoneInformation(int& TZInfoArray[]);
    int      WinExec(string lpCmdLine, int uCmdShow);
    
#import

//+----------------------USER32 Functions  ---------------------------+


#import "user32.dll"
    int      PostMessageA(int hWnd, int msg, int wparam, int lparam);
    int      GetParent(int hWnd);
    int      GetAsyncKeyState(int vKey);
    bool     SetCursorPos(int X, int Y);  
    int      GetAncestor(int, int);
    
#import


/////////////////////////////////// FTP AND HTTP /////////////////////////////////////////////////////////


#define MAX_PATH 260
struct FILETIME
{
  uint dwLowDateTime;
  uint dwHighDateTime;
}; 

struct WIN32_FIND_DATA {
  int     dwFileAttributes;  //DWORD    dwFileAttributes;
#ifdef IS_64_SYSTEM
  int    padding_1;  //DWORD    padding_1;
#endif 
  FILETIME ftCreationTime;
  FILETIME ftLastAccessTime;
  FILETIME ftLastWriteTime;
  uint     nFileSizeHigh;  //DWORD    nFileSizeHigh;
  uint     nFileSizeLow;  //DWORD    nFileSizeLow;
  uint     dwReserved0;  //DWORD    dwReserved0;
  uint     dwReserved1;  //DWORD    dwReserved1;
  short    cFileName[MAX_PATH];      //TCHAR    cFileName[MAX_PATH];
  short    cAlternateFileName[14];   //TCHAR    cAlternateFileName[14];
};


#import "wininet.dll"
int      InternetOpenW(string Agent, int AccessType, string ProxyName, string ProxyBypass, int Flags);
int      InternetConnectW(int hInternetSession, string ServerName, int ServerPort, string UserName, string Password, int Service, int Flags, int Context);
bool     FtpPutFileW(int hFtpSession, string LocalFile, string RemoteFile, int Flags, int Context);
bool     FtpGetFileW(int hFtpSession, string lpszRemoteFile, string lpszNewFile, bool fFailIfExists, int dwLocalFlagsAttribute, int dwInternetFlags, int dwContext);
bool     FtpFindFirstFileW (int hFtpSession, string lpszSearchString, WIN32_FIND_DATA& dwFindFileData[],  int dwInternetFlags, int dwContext);
bool     FtpGetCurrentDirectoryW (int hFtpSession, uchar& sBuffer[], int& lBufferLenth);
bool     FtpSetCurrentDirectoryW (int hFtpSession, string sDirectory);
int      HttpOpenRequestW (int hConnect, string lpszVerb, string lpszObjectName, string lpszVersion, string lpszReferrer, string& AcceptTypes[], int dwFlags, int dwContext);
int      HttpSendRequestW (int hRequest,  string lpszHeaders,  int dwHeadersLength,  string lpOptional,  int dwOptionalLength);
int      InternetOpenUrlW(int hInternetSession, string sUrl, string sHeaders="", int lHeadersLength=0, int lFlags=0, int lContext = 0);
int      InternetReadFile(int hFile,uchar& sBuffer[], int lNumBytesToRead, int& lNumberOfBytesRead);
bool     InternetCloseHandle(int hInet);
bool     DeleteUrlCacheEntryW (string lpszUrlName);
#import


#define INTERNET_SERVICE_FTP    1
#define INTERNET_SERVICE_GOPHER 2
#define INTERNET_SERVICE_HTTP   3
#define INTERNET_DEFAULT_HTTP_PORT 1


#define FTP_TRANSFER_TYPE_UNKNOWN   0x00000000
#define FTP_TRANSFER_TYPE_ASCII     0x00000001
#define FTP_TRANSFER_TYPE_BINARY    0x00000002

#define INTERNET_OPEN_TYPE_DIRECT       1

#define INTERNET_FLAG_RELOAD            0x80000000
#define INTERNET_FLAG_NEED_FILE         0x00000010
#define INTERNET_FLAG_RESYNCHRONIZE     0x00000800
#define INTERNET_FLAG_PRAGMA_NOCACHE    0x00000100
#define INTERNET_FLAG_KEEP_CONNECTION   0x00400000  
#define INTERNET_FLAG_NO_CACHE_WRITE    0x04000000
#define INTERNET_FLAG_DONT_CACHE        0x04000000


#define OF_READ               0
#define OF_WRITE              1
#define OF_READWRITE          2
#define OF_SHARE_COMPAT       3
#define OF_SHARE_DENY_NONE    4
#define OF_SHARE_DENY_READ    5
#define OF_SHARE_DENY_WRITE   6
#define OF_SHARE_EXCLUSIVE    7
 
 
#import "kernel32.dll"
    int CreateFileW(string, uint, int, int, int, int, int);
    int WriteFile(int FileHandle, uchar&  BufferPtr[], int BufferLength, int & BytesWritten[], int PassAsZero);
    int CloseHandle(int);
    int GetModuleHandleW(string lpModuleName);
    bool FreeLibrary(int hLibModule);
    int LoadLibraryW(string lpLibFileName);
    int GetProcAddress(int hModule, uchar& sBuffer[]);
#import

#import "PG_ExtFunctions.dll"
int      MT4_LoadDLL (string LocalFile, int TestMode);
void     MT4_SetSystemObjects (double ask, double bid, double timecurrent, int currentperiod, int& symbol[], double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][], 
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],            double& b_ruletabvalue[][][]); 
void     MT4_SetEntryRules (double ask, double bid, double timecurrent,  int currentperiod, int& symbol[],double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][],  
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],             double& b_ruletabvalue[][][]); 
int      MT4_GetProcAddress (int hModule, int TestMode);                           
                                 
#import
