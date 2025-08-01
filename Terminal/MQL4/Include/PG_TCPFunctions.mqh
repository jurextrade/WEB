//+------------------------------------------------------------------+
//|                                              GJ_TCPFunctions.mq4 |
//|                  Copyright © 2012, Gabriel Jureidini Version 3.1 |
//|                                        http://www.metaquotes.net |
//+------------------------------------------------------------------+
#property copyright "Copyright © 2012, Gabriel Jureidini Version 3.1"
#property link      "http://www.metaquotes.net"

#include <PG_WinUser32Ext.mqh>  


int struct2int(int& Struct[], int field) {
  bool n=field<0;
  if (n) field=-field;
  int l=field>>16;
  if (l==0) return(0);
  if (l>4) l=4;
  field&=0xFFFF;
  int p=field>>2;
  int o=field%4;
  int x=Struct[p]>>(o<<3);
  if (o+l>4)
    x|=Struct[p+1]<<((4-o)<<3);
  if (l<4) {
    x&=0xFFFFFFFF>>((4-l)<<3);  
    if (n)
      if (x&(0x80000000>>((4-l)<<3))!=0)
        x|=0xFFFFFFFF<<(l<<3);
  }
  return(x);  
}


string struct2str(int& Struct[], int size)
{
   string r = "";
   int field = ArraySize(Struct) << 18;
   //int l = field >> 16 ;
   int l = size ;
   if (l == 0) return(r);
   field &= 0xFFFF;
   int p = field >> 2;
   int o = field % 4;
   
   for (l = l; l > 0; l--) 
   {
      int x = Struct[p] >> (o << 3);
      r = r + CharToString(x & 0xFF);
     // Print ("r = " +  r);
      if (o == 3)
       {
         o = 0;
         p++;
         x = Struct[p];
      } 
      else
         o++;
   }
   return(r);
}

void int2struct(int& Struct[], int field, int value) {
  if (field<0) field=-field;
  int l=field>>16;
  if (l==0) return;
  if (l>4) l=4;
  field&=0xFFFF;
  int p=field>>2;
  int o=field%4;
  value&=0xFFFFFFFF>>((4-l)<<3);
  Struct[p]&=0xFFFFFFFF>>((4-o)<<3);
  Struct[p]|=value<<(o<<3);
  if (o+l>4){
    p++;
    Struct[p]&=0xFFFFFFFF<<((o+l-4)<<3);
    Struct[p]|=value>>((8-o-l)<<3);
  }  
}

void  str2struct(int& Struct[], int field, string value, int from = 0) {


	int l=field>>16;
	if (l<2) return;
	field&=0xFFFF;
	//  int p=field>>2;
	//  int o=field%4;
	int p = from;
	int o = 0;
	for (int i=0; i<StringLen(value); i++) {
	Struct[p]&=~(0xFF<<(o<<3));
	Struct[p]|=StringGetCharacter(value,i)<<(o<<3);
	if (o==3) {
	  p++;
	  o=0;
	} else
	  o++;
	if (l==2)
	  break;
	else
	  l--;    
	}
	Struct[p]&=~(0xFF<<(o<<3));
}

void  char2struct(int& Struct[], int field, char buffer[], int buffersize, int from = 0) {
	int l=field>>16;
	if (l<2) return;
	field&=0xFFFF;
	//  int p=field>>2;
	//  int o=field%4;
	int p = from;
	int o = 0;
	for (int i=0; i<buffersize; i++) {
	Struct[p]&=~(0xFF<<(o<<3));
	Struct[p]|=buffer[i]<<(o<<3);
	if (o==3) {
	  p++;
	  o=0;
	} else
	  o++;
	if (l==2)
	  break;
	else
	  l--;    
	}
	Struct[p]&=~(0xFF<<(o<<3));
}

int htonl(int l) {if (WS_BIGENDIAN!=0) return(l);return(((l&0xFF)<<24) | ((l&0xFF00)<<8) | ((l&0xFF0000)>>8) | ((l&0xFF000000)>>24));}
int htons(int s) {if (WS_BIGENDIAN!=0) return(s);return(((s&0xFF)<<8) | ((s&0xFF00)>>8));}
int ntohl(int l) {if (WS_BIGENDIAN!=0) return(l);return(((l&0xFF)<<24) | ((l&0xFF00)<<8) | ((l&0xFF0000)>>8) | ((l&0xFF000000)>>24));}
int ntohs(int s) {if (WS_BIGENDIAN!=0) return(s);return(((s&0xFF)<<8) | ((s&0xFF00)>>8));} 




/////////////////////////TCP FUCNCTIONS////////////////////////////////////////////////////////////////////////////////////

bool isalpha(int c) {
  string t="0123456789";
  return(StringFind(t,CharToString(c)) < 0);
}



int TCP_init () {
	int retval;
	int wsaData[WSADATA];
	retval = WSAStartup(0x202, wsaData);
	if (retval != 0) 
	   return(-1);
	return (retval);
	}



int TCP_deinit (){
    WSACleanup();
    return (1);
}


int TCPListen (int port){
    int local[sockaddr_in];
    int socket;    
    int socket_type = SOCK_STREAM; 
    
    
    int2struct(local,sin_addr,INADDR_ANY);
    int2struct(local,sin_family,AF_INET);
    int2struct(local,sin_port,htons(port));
  
    socket = socket (AF_INET, socket_type, 0);
    if (socket < 0) 
    {
        Print("Server : socket failed: Error " + WSAGetLastError());
        return(-1);
    } 
    else
        Print("Server : socket() is OK");    
 
    if (bind(socket, local, ArraySize(local)<<2) == SOCKET_ERROR)
    {
        Print("Server : bind() failed with error " + WSAGetLastError());
        closesocket (socket);
        return(-1);
    }
    else
        Print("Server: bind() is OK");
        
    if (listen(socket,5) == SOCKET_ERROR) 
    {
        Print("Server: listen() failed with error "+ WSAGetLastError());
        closesocket (socket);
        return(-1);
    } 
    else
       Print("Server: listen() is OK.");   
    
    
    TCP_SetBlockingMode (socket, 0);     
    
    return (socket);
}


int TCP_Accept (int listen_socket){
    int from[sockaddr_in];
    int fromlen[1];
    int socket;
    
    
    fromlen[0] =ArraySize(from)<<2;
    socket = accept(listen_socket, from, fromlen);
   
    if (socket == INVALID_SOCKET) {
      Print("Server: accept() error "+ WSAGetLastError());
      return(-1);
    } 
    else {
//      Print("Server: accept() is OK.\n");
//      Print("Server: accepted connection from "+inet_ntoa(struct2int(from,sin_addr))+", port "+ htons(struct2int(from,sin_port))) ;
    } 
   return (socket);
}



int TCP_connect(string MainServer, int port){
    int retval;
    int loopcount=0;
    int addr[1];
    int socket_type;
    int server[sockaddr_in];
    int socket;    
    int mainserver[20];
 
    str2struct(mainserver, ArraySize(mainserver) << 18, MainServer);

    socket_type = SOCK_STREAM; 

    if (isalpha(StringGetCharacter(MainServer,0)))
    {
        Print ("Client: IP address should be given in numeric form in this version.");
      //  return(-1);
    } 
    else 
    { 
        addr[0] = inet_addr(mainserver); 
        if (addr[0] == INADDR_NONE) 
        {
            Print ("The IPv4 address entered must be a legal address");
            return(-1);
        }
                
   //     hp = gethostbyaddr(addr[0], 4, AF_INET);
   //     Print("server addr:" + addr[0] + " hp" + hp);
   //     if (hp == 0)
   //     {
   //       hp = gethostbyname(mainserver);          
    //      if (hp == 0 )      
     //       Print ("Client: Cannot resolve address \""+ MainServer+"\": Error :"+WSAGetLastError());
    //    }  
    }
   
   
    int2struct(server,sin_addr,addr[0]);
    int2struct(server,sin_family,AF_INET);
    int2struct(server,sin_port,htons(port));
 
    socket = socket(AF_INET, socket_type, 0); 

    if (socket < 0) {
        Print("Client: Error Opening socket: Error "+ WSAGetLastError());
        return(-1);
    } 
    else
        Print("Client: socket() is OK");
 
    Print("Client: Client connecting to: "+ MainServer);
   
    int size = ArraySize(server)<<2;
    
    retval = connect(socket, server, size);
 
    if (retval == SOCKET_ERROR) {
        Print("Client: connect() failed: " + WSAGetLastError());
        closesocket(socket);
        socket = -1;
        return(-1);
    }
       
    TCP_SetBlockingMode (socket, 0); 
    
    return (socket);   
} 
 
void TCP_SetBlockingMode (int socket, int block){
   int cd[1];
   cd[0] = !block;
   ioctlsocket (socket, (0x80000000  | ((4 &  0x7ff) << 16) | ('f' << 8) | 126), cd);   
}

int TCP_sendBuffer (int& socket, char buffer[] , int buffersize, int withsize = 0) {

	int retval;
  	int Buffer[24000];	
	
	if (withsize == 1) {
		Buffer[0] = buffersize;
		buffersize += 4;
	}
	
	char2struct(Buffer, ArraySize(Buffer) << 18, buffer, buffersize, withsize);
	
	
	retval = send(socket, Buffer, buffersize, 0);
	
	if (retval == SOCKET_ERROR){  
	  int werror = WSAGetLastError();
	
	  if (werror == WSAECONNRESET || werror == WSAENOTCONN || werror == WSAENETDOWN  || werror ==  WSAENOTSOCK || werror == WSAECONNABORTED){
	      socket = -1;
	      Print("Client: TCP_send() failed: error " + WSAGetLastError());
	  }
	  return(-1);
	} 
	
	return (buffersize);
 }


int TCP_send (int& socket, string s, int withsize = 0) {

	int Buffer[24000];
	int retval;
	int buffersize = StringLen(s);
	
	if (withsize == 1) {
		Buffer[0] = buffersize;
		buffersize += 4;		
	}
	//Print ("data length is " + StringLen(s));
	str2struct(Buffer, ArraySize(Buffer) << 18, s, withsize);
	
	retval = send(socket, Buffer, buffersize, 0);
	
	
	if (retval == SOCKET_ERROR)  
	{  
	  int werror = WSAGetLastError();
	
	  if (werror == WSAECONNRESET || werror == WSAENOTCONN || werror == WSAENETDOWN  || werror ==  WSAENOTSOCK || werror == WSAECONNABORTED) {
	      socket = -1;
	      Print("Client: TCP_send() failed: error " + WSAGetLastError());
	  }
	  return(-1);
	} 
	return (StringLen (s));
 }

int TCP_recv (int& socket, string& s){
	
	int Buffer[1000];
	int retval;
	
	retval = recv(socket, Buffer, ArraySize(Buffer) << 2, 0);
	
	if (retval == 0) {
		Print("Client: Server closed connection");
		socket = -1;
		return(-1);
	}
	
	
	if (retval == SOCKET_ERROR) {
	  int werror = WSAGetLastError();
	
	  if (werror == WSAECONNRESET || werror == WSAENOTCONN || werror == WSAENETDOWN  || werror ==  WSAENOTSOCK || werror == WSAECONNABORTED)	  {
	     socket = -1;
	  }
	  return(-1);
	} 
	else { 
		s = struct2str(Buffer, retval);
		return (StringLen (s));
	}  
	
	s = "";
	return(0);
}

