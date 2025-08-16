//+-------------------   STDLIB Functions   -------------------------+
#include <WinUser32.mqh>

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



//+----------------------WINSOCK Functions  ---------------------------+
#import "ws2_32.dll"
int      WSAStartup(int cmd, int &wsadata[]); 
int      WSACleanup();
int      WSAGetLastError();
int      socket(int domaint,int type,int protocol);
int      bind(int socket, int& address[], int address_len);
int      connect(int socket, int& address[], int address_len);
int      listen(int socket, int backlog); 
int      accept(int socket, int& address[], int& address_len[]); 
int      recv(int socket, int& buffer[], int length, int flags); 
int      recvfrom(int socket, int& buffer[], int length, int flags, int& address[], int& address_len[]);
int      send(int socket, int& buffer[], int length, int flags);
int      sendto(int socket, int& message[], int length, int flags, int& dest_addr[], int dest_len);
int      closesocket(int socket);
int      gethostbyname(int& addr[]); 
int      gethostbyaddr(int addr, int len, int type);
int      inet_addr(int& addr[]); 
int      ioctlsocket (int socket, int cmd, int& mode[]);
string   inet_ntoa(int addr );
#import


//Addresses
#define INADDR_ANY         0x00000000
#define INADDR_LOOPBACK    0x7f000001
#define INADDR_BROADCAST   0xffffffff
#define INADDR_NONE        0xffffffff

//ERRORS
//socket fucntions errors
#define INVALID_SOCKET             0
#define SOCKET_ERROR               -1
//WSAGatLastError() errors
// Windows Sockets definitions of regular Microsoft C error constants
#define WSAEINTR                   10004
#define WSAEBADF                   10009
#define WSAEACCES                  10013
#define WSAEFAULT                  10014
#define WSAEINVAL                  10022
#define WSAEMFILE                  10024
// Windows Sockets definitions of regular Berkeley error constants
#define WSAEWOULDBLOCK             10035
#define WSAEINPROGRESS             10036
#define WSAEALREADY                10037
#define WSAENOTSOCK                10038
#define WSAEDESTADDRREQ            10039
#define WSAEMSGSIZE                10040
#define WSAEPROTOTYPE              10041
#define WSAENOPROTOOPT             10042
#define WSAEPROTONOSUPPORT         10043
#define WSAESOCKTNOSUPPORT         10044
#define WSAEOPNOTSUPP              10045
#define WSAEPFNOSUPPORT            10046
#define WSAEAFNOSUPPORT            10047
#define WSAEADDRINUSE              10048
#define WSAEADDRNOTAVAIL           10049
#define WSAENETDOWN                10050
#define WSAENETUNREACH             10051
#define WSAENETRESET               10052
#define WSAECONNABORTED            10053
#define WSAECONNRESET              10054
#define WSAENOBUFS                 10055
#define WSAEISCONN                 10056
#define WSAENOTCONN                10057
#define WSAESHUTDOWN               10058
#define WSAETOOMANYREFS            10059
#define WSAETIMEDOUT               10060
#define WSAECONNREFUSED            10061
#define WSAELOOP                   10062
#define WSAENAMETOOLONG            10063
#define WSAEHOSTDOWN               10064
#define WSAEHOSTUNREACH            10065
#define WSAENOTEMPTY               10066
#define WSAEPROCLIM                10067
#define WSAEUSERS                  10068
#define WSAEDQUOT                  10069
#define WSAESTALE                  10070
#define WSAEREMOTE                 10071
#define WSAEDISCON                 10101
// Extended Windows Sockets error constant definitions
#define WSASYSNOTREADY             10091
#define WSAVERNOTSUPPORTED         10092
#define WSANOTINITIALISED          10093
#define WSAENOMORE                 10102
#define WSAECANCELLED              10103
#define WSAEINVALIDPROCTABLE       10104
#define WSAEINVALIDPROVIDER        10105
#define WSAEPROVIDERFAILEDINIT     10106
#define WSASYSCALLFAILURE          10107
#define WSASERVICE_NOT_FOUND       10108
#define WSATYPE_NOT_FOUND          10109
#define WSA_E_NO_MORE              10110
#define WSA_E_CANCELLED            10111
#define WSAEREFUSED                10112
// Authoritative Answer: Host not found 
#define WSAHOST_NOT_FOUND          11001
// Non-Authoritative: Host not found, or SERVERFAIL 
#define WSATRY_AGAIN               11002
// Non recoverable errors, FORMERR, REFUSED, NOTIMP 
#define WSANO_RECOVERY             11003
// Valid name, no data record of requested type 
#define WSANO_DATA                 11004
// no address, look for MX record 
#define WSANO_ADDRESS              11004

//Adress Families
#define AF_UNSPEC                  0
#define AF_UNIX                    1
#define AF_INET                    2
#define AF_IMPLINK                 3
#define AF_PUP                     4
#define AF_CHAOS                   5
#define AF_NS                      6
#define AF_IPX                     6
#define AF_ISO                     7
#define AF_OSI                     7
#define AF_ECMA                    8
#define AF_DATAKIT                 9
#define AF_CCITT                   10
#define AF_SNA                     11
#define AF_DECnet                  12
#define AF_DLI                     13
#define AF_LAT                     14
#define AF_HYLINK                  15
#define AF_APPLETALK               16
#define AF_NETBIOS                 17
#define AF_VOICEVIEW               18
#define AF_FIREFOX                 19
#define AF_UNKNOWN1                20
#define AF_BAN                     21
#define AF_ATM                     22
#define AF_INET6                   23
#define AF_CLUSTER                 24
#define AF_12844                   25
#define AF_IRDA                    26
#define AF_MAX                     27
#define PF_UNSPEC                  0
#define PF_UNIX                    1
#define PF_INET                    2
#define PF_IMPLINK                 3
#define PF_PUP                     4
#define PF_CHAOS                   5
#define PF_NS                      6
#define PF_IPX                     6
#define PF_ISO                     7
#define PF_OSI                     7
#define PF_ECMA                    8
#define PF_DATAKIT                 9
#define PF_CCITT                   10
#define PF_SNA                     11
#define PF_DECnet                  12
#define PF_DLI                     13
#define PF_LAT                     14
#define PF_HYLINK                  15
#define PF_APPLETALK               16
#define PF_VOICEVIEW               18
#define PF_FIREFOX                 19
#define PF_UNKNOWN1                20
#define PF_BAN                     21
#define PF_MAX                     27

// Types
#define SOCK_STREAM                1
#define SOCK_DGRAM                 2
#define SOCK_RAW                   3
#define SOCK_RDM                   4
#define SOCK_SEQPACKET             5

// Protocols
#define IPPROTO_IP                 0
#define IPPROTO_ICMP               1
#define IPPROTO_IGMP               2
#define IPPROTO_GGP                3
#define IPPROTO_TCP                6
#define IPPROTO_UDP                17
#define IPPROTO_IDP                22
#define IPPROTO_ND                 77
#define IPPROTO_RAW                255
#define IPPROTO_MAX                256

// Services
#define IPPORT_ECHO                7
#define IPPORT_DISCARD             9
#define IPPORT_SYSTAT              11
#define IPPORT_DAYTIME             13
#define IPPORT_NETSTAT             15
#define IPPORT_FTP                 21
#define IPPORT_TELNET              23
#define IPPORT_SMTP                25
#define IPPORT_TIMESERVER          37
#define IPPORT_NAMESERVER          42
#define IPPORT_WHOIS               43
#define IPPORT_MTP                 57
#define IPPORT_TFTP                69
#define IPPORT_RJE                 77
#define IPPORT_FINGER              79
#define IPPORT_TTYLINK             87
#define IPPORT_SUPDUP              95
#define IPPORT_EXECSERVER          512
#define IPPORT_LOGINSERVER         513
#define IPPORT_CMDSERVER           514
#define IPPORT_EFSSERVER           520
#define IPPORT_BIFFUDP             512
#define IPPORT_WHOSERVER           513
#define IPPORT_ROUTESERVER         520
#define IPPORT_RESERVED            1024

// Maximum queue length specifiable by listen.
#define SOMAXCONN                  5
#define MSG_OOB                    1
#define MSG_PEEK                   2
#define MSG_DONTROUTE              4
#define MSG_MAXIOVLEN              10
#define MSG_PARTIAL                32768


#define WS_BIGENDIAN 0

#define WSADATA 100
/*typedef struct WS(WSAData) { 
    WORD                    wVersion;
    WORD                    wHighVersion;
    char                    szDescription[WSADESCRIPTION_LEN+1];
    char                    szSystemStatus[WSASYS_STATUS_LEN+1];
    WORD                    iMaxSockets;
    WORD                    iMaxUdpDg;
    char                   *lpVendorInfo;
} WSADATA, *LPWSADATA;*/
#define WSADESCRIPTION_LEN  256
#define WSASYS_STATUS_LEN   128
#define wdVersion   131072    
#define wdHighVersion 131074  
#define wdDescription 16842756 
#define wdSystemStatus 8454405 
#define wdMaxSockets  131462   
#define wdMaxUdpDg  131464     
#define wdpVendorInfo 262538   

#define sockaddr 4
/*typedef struct WS(sockaddr) {
        u_short sa_family;
        char    sa_data[14];
} SOCKADDR, *PSOCKADDR, *LPSOCKADDR;*/
#define sa_family 131072 
#define sa_data 917506   


#define in_addr 1
/*typedef struct WS(in_addr) {
    union {
        struct {
            u_char s_b1,s_b2,s_b3,s_b4;
        } S_un_b;
        struct {
            u_short s_w1,s_w2;
        } S_un_w;
        u_long S_addr;
    } S_un;
} IN_ADDR, *PIN_ADDR, *LPIN_ADDR;
#define s_addr  S_un.S_addr
#define s_host  S_un.S_un_b.s_b2
#define s_net   S_un.S_un_b.s_b1
#define s_imp   S_un.S_un_w.s_w2
#define s_impno S_un.S_un_b.s_b4
#define s_lh    S_un.S_un_b.s_b3*/
#define s_net   65536 
#define s_host  65537 
#define s_lh    65538 
#define s_impno 65539 
#define s_imp  131074 
#define s_addr 262144 


#define sockaddr_in 5
/*typedef struct WS(sockaddr_in) {
    short              sin_family;
    u_short               sin_port;
    struct WS(in_addr) sin_addr;
    char               sin_zero[8];
} SOCKADDR_IN, *PSOCKADDR_IN, *LPSOCKADDR_IN;*/
#define sin_family      131072 
#define sin_port        131074 
#define sin_addr        262148 
#define sin_addr_s_net   65540 
#define sin_addr_s_host  65541 
#define sin_addr_s_lh    65542 
#define sin_addr_s_impno 65543 
#define sin_addr_s_imp  131078 
#define sin_addr_s_addr 262168 
#define sin_zero        524296 

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
