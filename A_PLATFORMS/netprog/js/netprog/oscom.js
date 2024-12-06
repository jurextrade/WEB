function OSInit (os) {

/*    
    WSADATA wsadata;
    if (WSAStartup(0x101, &wsadata) != 0)
    {
        OSError ('TESYS001', NULL);
        return -1;
    }
*/    
    os.FDNEXT = 1;
    for (i=0; i < SOCKMAX; i++) {
        os.FDTAB[i] = 0;
    }
    os.NbrOpenedSockets = 0;
    os.NbrClosedSockets = 0;
    os.MaxSocketNumber = SOCKMAX - 1;
    return 1;
}

function OSEnd (os) {
/*  WSACleanup (); */    
}

function OSSleep ( time) {
    /* sleep (time); */
}

function OSOpenTcpSocket (os, port) {

    var server = require('net').createServer(
        function (socket) {
            socket.on('data', function (data) {});
            socket.on('close', function (data) {});
            socket.on('error', function (data) {});
        }
    )
    
    server.on('connection', function (socket) {
        OSError('Message Connection', 'MT4 Platform connection opened ' + socket.remoteAddress + ':' + socket.remotePort + '     <============= MT4');
    })
   
    server.listen(port);
    OSError ('sldksldks', 'MT4 listening on port ' + port);
/*
    #ifdef TCPCONN
    int OSOpenTcpSocket (OS* pos, WORD port)
    {
        struct sockaddr_in insock;
        int request;
        int request1;
        int retry;
    #ifndef WINDOWS
        DWORD one = 1;
    #endif
    #ifdef SO_LINGER
        int linger[2] = {0, 0};
    #endif // SO_LINGER 
    
        if ((request = socket (AF_INET, SOCK_STREAM, 0)) < 0)
        {
            TCPERROR (errno);
            OSError ('TESYS008', ' (%d)', errno);
            return -1;
        }
    #ifdef WINDOWS
        if ((LONG)request == INVALID_SOCKET)
    #else
        if ( request >= SOCKMAX )
    #endif
        {    //  modifier pour mettre le bon message d'erreur 
            TCPERROR (errno);
            OSError ('TESYS026',  ' (%d)', errno);
            return -1;
        }
        pos->NbrOpenedSockets++;
    
        request1 = request;
    #if defined(WINDOWS) || defined (__VOS__)
        request1 = FDTRANSLATE(pos, request);
    #endif
    #ifndef WINDOWS
    #ifdef SO_REUSEADDR      
    #ifndef __VOS__
        {
            if (OSSetSockOpt (pos, request1, SOL_SOCKET, SO_REUSEADDR, &one, sizeof (DWORD)))
                OSError ('TESYS009',  ' (%d)', request);
        }
    #endif
    #endif // SO_REUSEADDR 
    #endif 
    
        memset ((void*)&insock, (int)0, sizeof (insock));
        insock.sin_family = AF_INET;
        insock.sin_port = htons (port);
        insock.sin_addr.s_addr = htonl (INADDR_ANY);
        retry = 20;
    
        while (bind (request, (struct sockaddr*)&insock, sizeof (insock)))
        {
            if (--retry == 0)
            {
                TCPERROR (errno);
                OSError ('TESYS010',  ' (%d)', errno);
                OSCloseSocket (pos, request1);
                return -1;
            }
    #ifdef SO_REUSEADDR
            OSSleep (1);
    #else
            OSSleep (10);
    #endif // SO_REUSEADDR 
        }  // eof while 
    
        if (listen (request, 5))
        {
            TCPERROR (errno);
            OSError ('TESYS012',  ' (%d)', errno);
            OSCloseSocket (pos, request1);
            return -1;
        }
    #ifdef SO_LINGER
        OSSetSockOpt (pos, request1, SOL_SOCKET, SO_LINGER, &linger, sizeof (linger));
    #endif // SO_LINGER

    #if defined(WINDOWS) || defined (__VOS__)
        request = request1;
    #endif
    
        return request;
    }
    #endif  */    
}




/* if there is any bit set in the mask */
/*
function OSFFS (long* buf) {
    i;

    for (i = 31 ; i >= 0 ; i--)
        if (*buf & (1L << i))
            return i;
    return 0;
}

function FDTRANSLATE (os, socket) {
    while ((os.FDNEXT < SOCKMAX + 1) && os.FDTAB[os.FDNEXT])
        os.FDNEXT++;
    os.FDTAB[os.FDNEXT] = socket;

    return os.FDNEXT;
}

function  FDREMOVESOCKET (os, socket) {
    if (socket < os.FDNEXT)
        os.FDNEXT = socket;
    os.FDTAB[socket] = 0;
}

function FDRETURNSOCKET (os, socket) {
    i = 1;
    while (i < SOCKMAX + 1)
        if (os.FDTAB[i] == socket)
            return i;
        else i++;
    return 0;
}

function MSKTOFDSET(os, long* buf, fd_set* bufd) {
    i,j;
    socket;
    FD_ZERO (bufd);
    if (buf)
        for (j = 0; j < MaskCount; j++)

            for (i = 31 ; i >= 0 ; i--)
                if (buf[j] & (1 << i))
                {
                    socket = FDSOCKET(os, i + (j << 5));
                    FD_SET (socket, bufd);
                    buf[j] &= ~ (1L << i);
                }
}


function FDSETTOMSK (os, fd_set* bufd, long* buf) {
    socket;
    i = bufd.fd_count;
    if (buf)
    {
        OSCLEARBITS(buf);
    }
    while (i--)
    {
        socket = FDRETURNSOCKET(os, bufd.fd_array[i]);
        OSBITSET(buf, socket);
    }
}
*/


