/*-------------------------------------------------------------------------*/
/*                    NETPROG (Network Programming)                        */
/* NetProg is an API in C language allowing an homogeneous programming of  */
/* communicating applications                                              */
/* Copyright (C) 2002,2003,2004,2005                                       */  
/* Gabriel Jureidini                                                       */
/* Version 2.0 - 17 July 2005                                              */
/*                                                                         */
/* This program is free software; you can redistribute it and/or modify it */
/* under the terms of the GNU General Public License as published by the   */
/* Free Software Foundation; either version 2 of the License, or (at your  */ 
/* option) any later  version.                                             */
/*                                                                         */
/* This program is distributed in the hope that it will be useful, but     */
/* WITHOUT ANY WARRANTY; without even the implied warranty of              */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the GNU General */
/* Public License for more details.                                        */
/*                                                                         */
/* You should have received a copy of the GNU General Public License along */
/* with this program; if not, write to the Free Software Foundation, Inc., */
/* 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA                   */
/* Copy of GNU General Public License at: http://www.gnu.org/              */
/*                                                                         */
/* Source code home page: http://sourceforge.net/projects/netprog/         */
/* Contact author at: Gabriel_Jureidini@yahoo.com                          */
/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/
/* TCPCONN    : Les Connexions de type AF_INET sur PC, Unix, Vm, Xerox, .. */
/* UNIXCONN   : Les Connexions de type AF_UNIX                             */
/* IUCVCONN   : Les Connexions de type AF_IUCV                             */
/*-------------------------------------------------------------------------*/
/* WINDOWS    :    Windows Environment                                     */
/* UNIX       :    Unix Environment                                        */
/* _VM_       :    IBM Vm environment                                      */
/* AS400      :    AS400 Environement                                      */
/* __VOS__    :    Stratus Vos Environement                                */
/* SCO        :    Unix SCO Environement                                   */
/*-------------------------------------------------------------------------*/

const IPPROTO_FTP             = 21;               
const IPPROTO_SMTP            = 25;               
const IPPROTO_DNS             = 53;               
const IPPROTO_HTTP            = 80;               
const IPPROTO_POP             = 110;               
const IPPROTO_BC              = 100;              
const IPPROTO_DG              = 30000;     
const IPPROTO_CB2A            = 30001;   
const IPPROTO_MTT             = 2010               

const IPPROTO_IP              =  0;
const IPPROTO_ICMP            =  1;
const IPPROTO_IGMP            =  2;
const IPPROTO_GGP             =  3;
const IPPROTO_TCP             =  6;
const IPPROTO_UDP             =  17;
const IPPROTO_IDP             =  22;
const IPPROTO_ND              =  77;
const IPPROTO_RAW             =  255;
const IPPROTO_MAX             =  256;

    
const TCPCONN                 = true;


const AF_INET6	              = 24;
          
const LOOP_TIMING             = 1000
const EWOULDBLOCK             = 'WSAEWOULDBLOCK    '; 
const EINPROGRESS             = 'WSAEINPROGRESS    '; 
const EALREADY                = 'WSAEALREADY       '; 
const ENOTSOCK                = 'WSAENOTSOCK       '; 
const EDESTADDRREQ            = 'WSAEDESTADDRREQ   '; 
const EMSGSIZE                = 'WSAEMSGSIZE       '; 
const EPROTOTYPE              = 'WSAEPROTOTYPE     '; 
const ENOPROTOOPT             = 'WSAENOPROTOOPT    '; 
const EPROTONOSUPPORT         = 'WSAEPROTONOSUPPORT'; 
const ESOCKTNOSUPPORT         = 'WSAESOCKTNOSUPPORT'; 
const EOPNOTSUPP              = 'WSAEOPNOTSUPP     '; 
const EPFNOSUPPORT            = 'WSAEPFNOSUPPORT   '; 
const EAFNOSUPPORT            = 'WSAEAFNOSUPPORT   '; 
const EADDRINUSE              = 'WSAEADDRINUSE     '; 
const EADDRNOTAVAIL           = 'WSAEADDRNOTAVAIL  '; 
const ENETDOWN                = 'WSAENETDOWN       '; 
const ENETUNREACH             = 'WSAENETUNREACH    '; 
const ENETRESET               = 'WSAENETRESET      '; 
const ECONNABORTED            = 'WSAECONNABORTED   '; 
const ECONNRESET              = 'WSAECONNRESET     '; 
const ENOBUFS                 = 'WSAENOBUFS        '; 
const EISCONN                 = 'WSAEISCONN        '; 
const ENOTCONN                = 'WSAENOTCONN       '; 
const ESHUTDOWN               = 'WSAESHUTDOWN      '; 
const ETOOMANYREFS            = 'WSAETOOMANYREFS   '; 
const ETIMEDOUT               = 'WSAETIMEDOUT      '; 
const ECONNREFUSED            = 'WSAECONNREFUSED   '; 
const ELOOP                   = 'WSAELOOP          '; 
const ENAMETOOLONG            = 'WSAENAMETOOLONG   '; 
const EHOSTDOWN               = 'WSAEHOSTDOWN      '; 
const EHOSTUNREACH            = 'WSAEHOSTUNREACH   '; 
const ENOTEMPTY               = 'WSAENOTEMPTY      '; 
const EPROCLIM                = 'WSAEPROCLIM       '; 
const EUSERS                  = 'WSAEUSERS         '; 
const EDQUOT                  = 'WSAEDQUOT         '; 
const ESTALE                  = 'WSAESTALE         '; 
const EREMOTE                 = 'WSAEREMOTE        '; 

const EBADF                   = ENOTSOCK;                                                      
                                                      
                                     


var SOCKMAX       = 1024;
var MaskCount     = Math.trunc((SOCKMAX + 31) / 32);

function errno() {
 // return WSAGetLastError()      
}

function FDSOCKET(pos, socket) {
  return (socket + BASE_SOCKET_ID)
 // #define FDSOCKET(pos, socket)   pos->FDTAB[socket]  
}     


/* OSBITMASK  : shift de l'identifica    teur dans l'�l�ment du tableau      */
/* OSMASKIDX  : rend le rang du tableau correspondant � l'identificateur */
/* OSGETBIT   : rend le mask si il existe                                */
/* OSBITCLEAR : enlever l'identificateur du mask                         */
/* OSBITSET   : mettre l'identificateur dans le mask                     */
/* OSMASKWORD : rend l'�l�ment  du tableau contenant l'identificateur    */



if (MaskCount == 1) {
  function OSBITMASK(i)                     {return (1 << (i))}
  function OSMASKIDX(i)                     {return 0}
}

if (MaskCount > 1) {
  function OSBITMASK(i)                     {return  (1 << ((i) & 31))}
  function OSMASKIDX(i)                     {return  ((i) >> 5)}
}

function OSMASKWORD(buf, i)                 {return buf[OSMASKIDX(i)]}
function OSBITSET(buf, i)                   {OSMASKWORD(buf, i) |= OSBITMASK(i)}
function OSBITCLEAR(buf,i)                  {OSMASKWORD(buf, i) &= ~OSBITMASK(i)}
function OSGETBIT(buf, i)                   {return (OSMASKWORD(buf, i) & OSBITMASK(i))}

if (MaskCount == 1) {
  function OSCOPYBITS(src, dst)             {dst[0] = src[0]}
  function OSCLEARBITS(buf)                 {buf[0] = 0}
  function OSMASKANDSETBITS(dst, b1, b2)    {dst[0] = (b1[0] & b2[0])}
  function OSORBITS(dst, b1, b2)            {dst[0] = (b1[0] | b2[0])}
  function OSUNSETBITS(dst, b1)             {dst[0] &= ~b1[0]}
  function OSANYSET(src)                    {return (src[0])}
}

if (MaskCount == 2) {
  function  OSCOPYBITS(src, dst)            {dst[0] = src[0]; dst[1] = src[1];}
  function  OSCLEARBITS(buf)                {buf[0] = 0;  buf[1] = 0}
  function  OSMASKANDSETBITS(dst, b1, b2)   {dst[0] = (b1[0] & b2[0]); dst[1] = (b1[1] & b2[1])}
  function  OSORBITS(dst, b1, b2)           {dst[0] = (b1[0] | b2[0]); dst[1] = (b1[1] | b2[1])}
  function  OSUNSETBITS(dst, b1)            {dst[0] &= ~b1[0]; dst[1] &= ~b1[1]}
  function  OSANYSET(src)                   {return (src[0] || src[1])}

}

if (MaskCount == 3) {

  function  OSCOPYBITS(src, dst)            {dst[0] = src[0]; dst[1] = src[1]; dst[2] = src[2]}
  function  OSCLEARBITS(buf)                {buf[0] = 0;  buf[1] = 0; buf[2] = 0}
  function  OSMASKANDSETBITS(dst, b1, b2)   {dst[0] = (b1[0] & b2[0]);  dst[1] = (b1[1] & b2[1]);  dst[2] = (b1[2] & b2[2])}
  function  OSORBITS(dst, b1, b2)           {dst[0] = (b1[0] | b2[0]);  dst[1] = (b1[1] | b2[1]); dst[2] = (b1[2] | b2[2])}
  function  OSUNSETBITS(dst, b1)            {dst[0] &= ~b1[0]; dst[1] &= ~b1[1]; dst[2] &= ~b1[2]}
  function  OSANYSET(src)                   {return (src[0] || src[1] || src[2])}

}

if (MaskCount == 4) {

  function  OSCOPYBITS(src, dst)              {dst[0] = src[0]; dst[1] = src[1]; dst[2] = src[2]; dst[3] = src[3]}
  function  OSCLEARBITS(buf)                  {buf[0] = 0;  buf[1] = 0; buf[2] = 0;  buf[3] = 0}
  function  OSMASKANDSETBITS(dst, b1, b2)     {dst[0] = (b1[0] & b2[0]); dst[1] = (b1[1] & b2[1]); dst[2] = (b1[2] & b2[2]); dst[3] = (b1[3] & b2[3])}
  function  OSORBITS(dst, b1, b2)             {dst[0] = (b1[0] | b2[0]); dst[1] = (b1[1] | b2[1]); dst[2] = (b1[2] | b2[2]); dst[3] = (b1[3] | b2[3])}
  function  OSUNSETBITS(dst, b1)              {dst[0] &= ~b1[0]; dst[1] &= ~b1[1]; dst[2] &= ~b1[2]; dst[3] &= ~b1[3]}
  function  OSANYSET(src)                     {return (src[0] || src[1] || src[2] || src[3])}
}

if (MaskCount > 4) {

  function OSCLEARBITS(buf) {
      for (var i = 0; i < MaskCount; i++)
        buf[i] = 0;

  } 

  function OSCOPYBITS(src, dst) { 
      for (var i = 0; i < MaskCount; i++)
        dst[i] = src[i];
  }

  function OSMASKANDSETBITS(dst, b1, b2) { 

      for (var i = 0; i < MaskCount; i++)
        dst[i] = (b1[i] & b2[i]);
  }

  function OSORBITS(dst, b1, b2) { 
      for (var i = 0; i < MaskCount; i++)
        dst[i] = (b1[i] | b2[i]);
    }

  function OSUNSETBITS(dst, b1) {
      for (var i = 0; i < MaskCount; i++)
        dst[i] &= ~b1[i];
  }
  

  function OSANYSET(src) {
      for (var i = 0; i < MaskCount; i++)
          if (src[i]) return TRUE;
      return FALSE;
  }
}

/* Copy in BigEndian */
/*
function OSGetWord(s, cp) { 
    BYTE *t_cp = (BYTE *)(cp); 
    (s) = ((WORD)t_cp[0] << 8) | ((WORD)t_cp[1]); 
    (cp) += 2; 
}


function OSGetDword(l, cp) { \
	BYTE *t_cp = (BYTE *)(cp); 
	(l) = ((DWORD)t_cp[0] << 24) 
	    | ((DWORD)t_cp[1] << 16) 
	    | ((DWORD)t_cp[2] << 8) 
	    | ((DWORD)t_cp[3]) 
	    ; \
	(cp) += 4; 
}

function OSPutWord(s, cp) { 
    WORD t_s = (WORD)(s); 
    BYTE *t_cp = (BYTE *)(cp); 
    *t_cp++ = (char) (t_s >> 8); 
    *t_cp   = (char) t_s; 
    (cp) += 2; 
}

function OSPutDword(l, cp) { 
    DWORD t_l = (DWORD)(l); 
    BYTE* t_cp = (BYTE *)(cp); 
    *t_cp++ = (char)(t_l >> 24); 
    *t_cp++ = (char)(t_l >> 16); 
    *t_cp++ = (char)(t_l >> 8); 
    *t_cp   = (char)(t_l); 
    (cp) += 4; 
}

*/
function OS() {
    this.NbrOpenedSockets;
    this.NbrClosedSockets;
    this.MaxSocketNumber;
    this.FDNEXT;
    this.FDTAB = new Array(SOCKMAX + 1);
}

/*
    extern int  FDTRANSLATE(OS* pos, int socket);
    extern int  OSFFS (long* buf);
    extern int  OSInit(OS* pos);
    extern void OSEnd (OS* pos);
    extern void OSSleep (int time);
    extern int  OSSetSockOpt (OS* pos, int s, int level, int optname, void* optval, int optlen);
    extern int  OSRead       (OS* pos, int s, char* buf, int len);
    extern int  OSWrite      (OS* pos, int s, char* buf, int len);
    extern int  OSCloseSocket(OS* pos, int s);
    extern int  OSGiveSocket (OS* pos, int s, char* name);
    extern int  OSTakeSocket (OS* pos, int s, char* name, char* subtaskname);
    extern int  OSAccept     (OS* pos, int s);
    extern int  OSOpenTcpSocket   (OS* pos, WORD port);
    extern int  OSOpenInetSocket  (OS* pos, int type, BOOL Block);
    extern int  OSOpenLocalSocket (OS* pos, char* name, char* appliname);
    extern int  OSTcpConnect      (OS* pos, char* machinname, WORD port, BOOL Block, BOOL* ConnectOK);
    extern int  OSLocalConnect    (OS* pos, char* name, char* appliname);
    extern int  OSSelect (OS* pos, int nfds, long* readmsk, long* writemsk, long* exceptmsk, struct timeval* timeout);
    extern int  OSIoctl       (OS* pos, int s, LONG cmd, void* data);
    extern int  OSGetPeerName (OS* pos, int s, int type, char* userid, char* appliname);
    extern int  OSGetSockName (OS* pos, int s, char* netid);
    extern int  OSGetHostName (char* Name, int NameLength);
    
    // IP functions

    extern int  OSSend   (OS* pos, int s, char* buf, int len, char* MachinName);
    extern int  OSRecv   (OS* pos, int s, char* buf, int len, char* MachinName);
    extern int  OSGetNameFromAddr (char* AddrName, char* Name);
    extern int  OSGetAddrFromName (char* Name, char* AddrName);
    extern WORD OSCheckSum (WORD* ptr, int nbytes);
    extern void OSCopy2 (void* word, char* stream);
    extern void OSCopy4 (void* dword, char* stream);
    extern void OSCopy8 (void* ddouble, char* stream);
*/
