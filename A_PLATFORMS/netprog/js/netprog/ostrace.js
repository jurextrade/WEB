function OSTimeStamp () {
    const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();
    
    return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function  OSError(errortype, sdisplay) {
    console.log(OSTimeStamp() + ' ' + sdisplay);
}

/*    
void OSError(char * Name, char * chParam, ...) 
{}
    FILE * File ;
    char * Inter ;
    char * Code ;
    struct tm * t ;
    time_t stTime ;
    va_list argptr ;
    int Lng ;

    GlbLigne[0] = GlbMessg[0] = GlbInter[0] = GlbParam[0] = 0 ;
    GlbError = 0 ;
    time(&stTime) ;
    t = localtime(&stTime) ;

    sprintf(GlbLigne, '%04d%02d%02d %02d:%02d:%02d ', (t->tm_year + 1900), (t->tm_mon + 1), t->tm_mday, t->tm_hour, t->tm_min, t->tm_sec) ;
    Code = 'newts.cod' ;

    if ( GlbReper[0] )
    {
        sprintf(GlbPathC, '%s/%s', GlbReper, Code) ;
        Code = GlbPathC ;
    }
#ifdef _VM_
    File = fopen(Code, 'r') ;
#else
    File = fopen(Code, 'rt') ;
#endif
    if ( ! File ) return ;
    fgetline(GlbMessg, SZ_BUFFER, File) ;

    while (!feof(File))
    {
        if (!strncmp(GlbMessg, Name, 8))
        {
            Inter = GlbMessg ;
            while ( *Inter != ' ' ) Inter ++ ;
            while ( *Inter == ' ' ) Inter ++ ;
            memmove(GlbMessg, Inter, (strlen(Inter) + 1)) ;
            break ;
        }
        fgetline(GlbMessg, SZ_BUFFER, File) ;
    }

    if ( feof(File) )
        sprintf(GlbMessg, '*** Erreur ou message Inconnue %s', 'Name') ;
    fclose(File) ;

    if (chParam != NULL)
    {
        String[0] = 0 ;
        va_start(argptr, chParam) ;
        vsprintf(String, chParam, argptr) ;
        va_end(argptr) ;
        Lng = strlen(String) ;
        if ( String[Lng] != '$' )
        {
            if (String[Lng] != ' ')   strcat(String, ' ') ;
            strcat(String, SITE1) ;
        }
        strcpy(GlbParam, String) ;
    }
    else strcpy(GlbParam, SITE1) ;

    sprintf(GlbInter, '%s %s', GlbMessg, GlbParam) ;
    if ( GlbInter[0] != '*' )  strcat(GlbLigne, '    ') ;
    strcat(GlbLigne, GlbInter) ;

    OSTraceInFile(NULL, GlbLigne) ;
    OSPrintMessage(GlbLigne) ;
    return ;
}
*/
