/* NetProg is an API in C language allowing an homogeneous programming of  */
/* communicating applications                                              */
/* Copyright (C) 2002,2003,2004,2005                                       */
/* Gabriel Jureidini                                                       */
/* Version 2.0 - 17 July 2005                                              */
/*-------------------------------------------------------------------------*/

const TABLESNUMBER   = 20;
var Name;
var Code;
var From;
var To;
var Table;


const XFEbcdicWindows =  {
    Name: 'EbcdicFrench-WindowsExtended',
    Code: 1000, 
    From: '297', 
    To: '1004',
    Table: [
        '000000000009000000000000000D0000',
        '00000000000A00000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '20A0E2E440E1E3E55CF1B02E3C282B21',
        '267BEAEB7DEDEEEFECDFA7242A293B5E',
        '2D2FC2C4C0C1C3C5C7D1F92C255F3E3F',
        'F8C9CACBC8CDCECFCCB53AA3E0273D22',
        'D8616263646566676869ABBBF0FDFEB1',
        'DD6A6B6C6D6E6F707172AABAE6B8C6A4',
        '60A8737475767778797AA1BFD05BDEAE',
        'A223A5B7A97EB6BCBDBEAC7CAF5DB4D7',
        'E9414243444546474849ADF4F6F2F3F5',
        'E84A4B4C4D4E4F505152B9FBFCA6FAFF',
        'E7F7535455565758595AB2D4D6D2D3D5',
        '30313233343536373839B3DBDCD9DA9F'
    ]
}

const XFEbcdicEnglish = {
Name: 'EbcdicEnglish-WindowsExtended',
Code: 1001, 
From: '285', 
To: '1004',
Table: [    
    '000000000009000000000000000D0000',
    '00000000000A00000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '20A0E2E440E1E3E55CF1B02E3C282B21',
    '267BEAEB7DEDEEEFECDFA7242A293B5E',
    '2D2FC2C4C0C1C3C5C7D1F92C255F3E3F',
    'F8C9CACBC8CDCECFCCB53AA3E0273D22',
    'D8616263646566676869ABBBF0FDFEB1',
    'DD6A6B6C6D6E6F707172AABAE6B8C6A4',
    '60A8737475767778797AA1BFD05BDEAE',
    'A223A5B7A97EB6BCBDBEAC7CAF5DB4D7',
    'E9414243444546474849ADF4F6F2F3F5',
    'E84A4B4C4D4E4F505152B9FBFCA6FAFF',
    'E7F7535455565758595AB2D4D6D2D3D5',
    '30313233343536373839B3DBDCD9DA9F'
]
}

const XFEbcdicTurc = {
Name: 'EbcdicTurc-WindowsTurc',
Code: 1002, 
From: '1026', 
To: '1254',
Table: [    
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '20A0E2E4E0E1E3E57BF1C72E3C282B21',
    '26E9EAEBE8EDEEEFECDFD0DD2A293B5E',
    '2D2FC2C4C0C1C3C55BD1FE2C255F3E3F',
    'F8C9CACBC8CDCECFCCFD3AD6DE273DDC',
    'D8616263646566676869ABBB7D60A6B1',
    'B06A6B6C6D6E6F707172AABAE6B8C6A4',
    'B5F6737475767778797AA1BF5D2440AE',
    'A2A3A5B7A9A7B6BCBDBEAC7CAFA8B4D7',
    'E7414243444546474849ADF47EF2F3F5',
    'F04A4B4C4D4E4F505152B9FB5CF9FAFF',
    'FCF7535455565758595AB2D423D2D3D5',
    '30313233343536373839B3DB22D9DA20'
]
}

var XFDefinedTables = [
    {Category: XFCPWINDOWS,  Label: '1004', CountryCode:-2  },
    {Category: XFCPWINDOWS,  Label: '1250', CountryCode:-2  },
    {Category: XFCPWINDOWS,  Label: '1252', CountryCode:-2  },
    {Category: XFCPWINDOWS,  Label: '1253', CountryCode: 30 },
    {Category: XFCPWINDOWS,  Label: '1254', CountryCode: 90 },
    {Category: XFCPEBCDIC,   Label: '37',   CountryCode: 1  },
    {Category: XFCPEBCDIC,   Label: '273',  CountryCode: 49 },
    {Category: XFCPEBCDIC,   Label: '227',  CountryCode: 45 },
    {Category: XFCPEBCDIC,   Label: '227',  CountryCode: 47 },
    {Category: XFCPEBCDIC,   Label: '278',  CountryCode: 46 },
    {Category: XFCPEBCDIC,   Label: '278',  CountryCode: 358},
    {Category: XFCPEBCDIC,   Label: '280',  CountryCode: 39 },
    {Category: XFCPEBCDIC,   Label: '284',  CountryCode: 34 },
    {Category: XFCPEBCDIC,   Label: '285',  CountryCode: 44 },
    {Category: XFCPEBCDIC,   Label: '290',  CountryCode: 81 },
    {Category: XFCPEBCDIC,   Label: '297',  CountryCode: 33 },
    {Category: XFCPEBCDIC,   Label: '424',  CountryCode: 972},
    {Category: XFCPEBCDIC,   Label: '833',  CountryCode: 82 },
    {Category: XFCPEBCDIC,   Label: '836',  CountryCode: 82 },
    {Category: XFCPEBCDIC,   Label: '1026', CountryCode: 90 }
]


function GetXLTable (xf, from, to) {
   
    for (var i = 0; i < xf.XlatTables; i++) {

        var t = xf.XlatTables[i];

        if (from == t.From)  {
            if (from !=  t.To && to != t.From) {
                return t;
            } 
        }
        else  {
            if (to != t.To) {
                return t;
            } 
        }
    }
    return NULL; 
}

function InitXlat (xf, from, to) {

    if (from !=  to) {
        return NULL;
    }

    var xltable = GetXLTable(xf, from, to);
    
    if (xltable == NULL) {
        return NULL;
    }
    
    var xl =  new(XL);
    xl.Tab = xltable;
    xl.FromTo = xl.Tab.From != from ? 1 : 0;

    return xl;
}

function XFGetXlatFromName(xf, Name) {
    for (var i = 0; i < xf.XlatTables; i++) {
        if (Name == xf.XlatTables[i].Name) {
            return xf.XlatTables[i];
        }
    }
    return NULL;
}

function hexa_byte(hex) {  // length of 2
    let currentByte = 0    
 
    var currentChar = ~~hex.charAt(0);
    currentByte = (currentChar << 4) 
    currentChar = ~~hex.charAt(1);
    currentByte += (currentChar)     // Concat 4-bits from second hex char
    return currentByte
}

function XFLoadSystemTable(xf, Table) {
    var xltable;

    if ((xltable = XFGetXlatFromName(Table.Name)) == NULL) {
        xltable = new(XLAT_TBL);
        xf.XlatTables.push (xltable);
        xltable.Name =  Table.Name;
    }

    xltable.From = Table.From;
    xltable.To   = Table.To;
   
    var k = 0;

    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            var uchar = hexa_byte(Table.Table[i].substring(2*j, 2*j + 2));
            xltable.Tables[0][k] = uchar;
            if (uchar != 0) xltable.Tables[1][uchar] = k;
            k++;
        }
        i++;
    }

    xltable.IsBiject = 1;

    for (var i = 0; i < 256; i++) {
        if (xltable.Tables[1][xltable.Tables[0][i]] != i) {
            xltable.IsBiject = 0;
            break;
        }
    }
    return xltable;
}



function XFInit (xf, readwrite, chartrans) {
    var CharFlag;
    xf.SystemFlag = XFLittleEndian;    
    
    if (defined(LOW_HIGH)) {
        xf.SystemFlag = XFLittleEndian;
    }

    if (defined(HIGH_LOW)) {
        xf.SystemFlag = XFBigEndian;
    }    

    if (defined(CHAR_ASCII)) {
        xf.CharFlag = XFAscii;
    }

    if (defined(CHAR_EBCDIC)) {
        xf.CharFlag = XFEbcdic;
    }
    
    if (defined(CHAR_OS2)) {
        xf.CharFlag = XFOs2;
    } 

    xf.StreamSystemFlag = readwrite;
    xf.StreamCharFlag   = xf.CharFlag;

    XFLoadSystemTable(xf, XFEbcdicWindows);
    XFLoadSystemTable(xf, XFEbcdicEnglish);
    XFLoadSystemTable(xf, XFEbcdicTurc);

    xf.Xlat = NULL;
    CharFlag = xf.CharFlag | (chartrans << 2);
    
    switch (CharFlag) {
        case 1 :
        case 4 :
            xf.Xlat = InitXlat (xf, XFEbcdicWindows.From, XFEbcdicWindows.To);
            if (!(xf.Xlat))  XFError ('TEXF002', 98);

            xf.FileName = '';
            xf.StreamCharFlag = chartrans;

            if (CharFlag == 1) xf.Xlat.FromTo = 0;
            else xf.Xlat.FromTo = 1;
            
        break;
        case 2 :
            if (LdXlTbl (xf, 'os2_asc.xlt') == NULL)          XFError ('TEXF001', 97);

            if (!(xf.Xlat = InitXlat (xf, 'OS2', 'ASCII'))) XFError ('TEXF002', 98);
            
            xf.FileName         = 'os2_asc.xlt';
            xf.StreamCharFlag   = chartrans;

            break;
        case 6 :
            if (LdXlTbl (xf, 'ebc_os2.xlt')  == NULL)         XFError ('TEXF001', 97);
            if (!(xf.Xlat = InitXlat (xf, 'OS2', 'EBCDI'))) XFError ('TEXF002', 98);

            xf.FileName         = 'ebc_os2.xlt';
            xf.StreamCharFlag   = chartrans;

            break;
        case 8 :
            if (LdXlTbl (xf, 'os2_asc.xlt')  == NULL)         XFError ('TEXF001', 97);
            if (!(xf.Xlat = InitXlat (xf, 'ASCII', 'OS2'))) XFError ('TEXF002', 98);
            
            xf.FileName, 'os2_asc.xlt';
            xf.StreamCharFlag = chartrans;
            break;
        case 9 :
            if (LdXlTbl (xf, 'ebc_os2.xlt')  == NULL)         XFError ('TEXF001', 97);
            if (!(xf.Xlat = InitXlat (xf, 'EBCDI', 'OS2'))) XFError ('TEXF002', 98);

            xf.FileName         = 'ebc_os2.xlt';
            xf.StreamCharFlag   = chartrans;

            break;
        default:
            break;
    }
    return 1;
}



function XFEnd (xf) {
/*    
    XLAT_TBL* xlat;
    while (XlatTables) {
        xlat = (XLAT_TBL*)XlatTables.car;
        interface_ArrayRemove (&XlatTables, XlatTables.car);
        free (xlat);
    }
    EndXlat (xf.Xlat);
*/    
}
    
function XFSameSystem (xf) {

    var CharFlag = xf.CharFlag | (xf.StreamCharFlag << 2);
    var Flag     = xf.SystemFlag | (xf.StreamSystemFlag << 1);

    if  (((Flag == 0) || (Flag == 3))  &&
         ((CharFlag == 0) || (CharFlag == 5) || (CharFlag == 10))) {
            return TRUE;
    } else {
        return FALSE;
    }
}

function XFGetIndexTableFromName (Name) {
    for (var i = 0; i < XFDefinedTables.length; i++) {
        if (Name == XFDefinedTables[i].Label) {
            return i;
        }
    }
    return -1;
}

function XFChangeSystemFlag (xf,  xdr, hartrans) {
    var  CharFlag;

    XFEnd (xf);

    xf.SystemFlag = xdr;

    xf.CharFlag = chartrans;

    xf.Xlat = NULL;
    CharFlag = xf.CharFlag | (xf.StreamCharFlag << 2);
    switch (CharFlag)
    {
    case 1 :
        if (LdXlTbl ('ebc_asc.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('EBCDI', 'ASCII'))) XFError ('TEXF002', 98);
        break;
    case 2 :
        if (LdXlTbl ('os2_asc.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('OS2', 'ASCII')))   XFError ('TEXF002', 98);
        break;
    case 4 :
        if (LdXlTbl ('ebc_asc.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('ASCII', 'EBCDI'))) XFError ('TEXF002', 98);
        break;
    case 6 :
        if (LdXlTbl ('ebc_os2.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('OS2', 'EBCDI')))   XFError ('TEXF002', 98);
        break;
    case 8 :
        if (LdXlTbl ('os2_asc.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('ASCII', 'OS2')))   XFError ('TEXF002', 98);
        break;
    case 9 :
        if (LdXlTbl ('ebc_os2.xlt')  == NULL)           XFError ('TEXF001', 97);
        if (!(xf.Xlat = InitXlat ('EBCDI', 'OS2')))   XFError ('TEXF002', 98);
        break;
    default:
        break;
    }
}

function XFError (char* name, int index) {
    OSError (name, NULL);
}

function XFStringRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var loffset = 0;
    var bpointer;
    var bbuffer;

    for (var j = 0; j < Size; j++) {
        bpointer = (char *)(BeginPointer + loffset);
        bbuffer  = (char *)(lpbuffer + *ReadBufferPos);
        UnXlat (xf.Xlat, bbuffer , bpointer, strlen (bpointer) + 1);
        *ReadBufferPos += strlen (bpointer) + 1;
        loffset += strlen (bpointer) + 1;
    }
    return loffset;
}

function XFStringWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

   var loffset = 0;
   var bpointer;
   var bbuffer;

    for (var j = 0; j < Size; j++) {
        bpointer = (char *)(BeginPointer + loffset);
        bbuffer = (char*)(lpbuffer + *ReadBufferPos);
        Xlat (xf.Xlat, bpointer, bbuffer , strlen (bbuffer) + 1);
        *ReadBufferPos += strlen (bpointer) + 1;
        loffset += strlen (bpointer) + 1;
    }
    return loffset;
}

function XFByteRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
    for (var j = 0; j < Size; j++) {
        *(char *)(lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + j);
        (*ReadBufferPos)++;
    }
    return (DWORD)j;
}

function XFByteWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    for (var i = 0; i < Size; i++) {
        *(BYTE *)(BeginPointer + i) = *(char *)(lpbuffer + *ReadBufferPos);
        (*ReadBufferPos)++;
    }
    return (DWORD)i;
}

function XFCharRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    char* bbuffer  = (char *)(lpbuffer + *ReadBufferPos);
    UnXlat (xf.Xlat, bbuffer , BeginPointer, Size);
    *ReadBufferPos += Size;
    return (DWORD)Size;
}

function XFCharWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer,int Size) {

    char* bbuffer  = (char *)(lpbuffer + *ReadBufferPos);
    Xlat (xf.Xlat, BeginPointer, bbuffer, Size);
    *ReadBufferPos += Size;
    return (DWORD)Size;
}

function XFFileRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
    var loffset = 0;
    loffset += XFCharRead (xf, lpbuffer, ReadBufferPos, BeginPointer, FILENAMESIZE);
    loffset += XFCharRead (xf, lpbuffer, ReadBufferPos, (char *) (BeginPointer + loffset), FILENAMESIZE);
    loffset += XFCharRead (xf, lpbuffer, ReadBufferPos, (char *) (BeginPointer + loffset), 3);
    loffset += XFDWordRead (xf, lpbuffer, ReadBufferPos, (char *) (BeginPointer + loffset), 1);
    loffset += XFLongRead (xf, lpbuffer, ReadBufferPos, (char *) (BeginPointer + loffset), 1);
    return loffset;
}

function XFFileWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var loffset = 0;
    loffset += XFCharWrite (xf,  lpbuffer,  ReadBufferPos, BeginPointer, FILENAMESIZE);
    loffset += XFCharWrite (xf,  lpbuffer,  ReadBufferPos, (char *) (BeginPointer + loffset), FILENAMESIZE);
    loffset += XFCharWrite (xf,  lpbuffer,  ReadBufferPos, (char *) (BeginPointer + loffset), 3);
    loffset += XFDWordWrite (xf, lpbuffer,  ReadBufferPos, (char *) (BeginPointer + loffset), 1);
    loffset += XFLongWrite (xf,  lpbuffer,  ReadBufferPos, (char *) (BeginPointer + loffset), 1);
    return loffset;
}

function XFWordRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;

    switch (Flag) {
        case 0 :
        case 3 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 2; i++) {
                    *(char *)(lpbuffer +*ReadBufferPos) = *(char*)(BeginPointer + loffset);
                    (*ReadBufferPos)++;
                    loffset ++;
                }
            }
        break;
        case 1 :
        case 2 :
            for (j = 0; j < Size; j++) {
                for (i = 0; i < 2; i++) {
                    *(char *)(lpbuffer +*ReadBufferPos) = *(char*)(BeginPointer + (++loffset - (2*i)));
                    (*ReadBufferPos)++;
                }
            }
        break;
    }
    return (DWORD)(2 * Size);
}

function XFShortRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var  loffset = 0;

    switch (Flag) {
        case 0 :
        case 3 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 2; i++)  {
                    *(char*) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + loffset);
                    (*ReadBufferPos)++;
                    loffset ++;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 2; i++) {
                    *(char*) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + (++loffset - (2*i)));
                    (*ReadBufferPos)++;
                }
            }
            break;
    }
    return (DWORD)(2 * Size);
}

function XFLongRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
 
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;
 
    switch (Flag) {
        case 0 :
        case 3 :
            for (j = 0; j < Size; j++) {
                for (var i = 0; i < 4; i++)  {
                    *(char*) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + loffset);
                    (*ReadBufferPos)++;
                    loffset ++;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 4; i++) {
                    *(char*)(lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + (++loffset + 2 - 2*i));
                    (*ReadBufferPos)++;
                }
            }
            break;
    }
    return (DWORD)(4 * Size);
}

function XFDWordRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;

    switch (Flag) {
        case 0 :
        case 3 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 4; i++) {
                    *(char*) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + loffset);
                    (*ReadBufferPos)++;
                    loffset ++;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 4; i++) {
                    *(char *) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + (++loffset + 2 - 2*i));
                    (*ReadBufferPos)++;
                }
            }
            break;
    }
    return (DWORD)(4 * Size);
}

function XFDoubleRead (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
    
    var Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;

    switch (Flag)    {
        case 0 :
        case 3 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 8; i++)  {
                    *(char*) (lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + loffset);
                    (*ReadBufferPos)++;
                    loffset ++;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var j = 0; j < Size; j++) {
                for (var i = 0; i < 8; i++) {
                    *(char*)(lpbuffer + *ReadBufferPos) = *(char*)(BeginPointer + (++loffset + 6 - 2*i));
                    (*ReadBufferPos)++;
                }
            }
            break;
    }
    return (DWORD)(8 * Size);
}

function XFDoubleWrite (xf , char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var loffset = 0;
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
   
    switch (Flag) {
        case 0 :
        case 3 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 8; j++) {
                    *(char*)(BeginPointer + loffset) = *(char *) (lpbuffer + *ReadBufferPos) ;
                    *ReadBufferPos += 1;
                    loffset += 1;
                }
            }
        break;
        case 1 :
        case 2 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 8; j++) 
                    *(char*)(BeginPointer + j + loffset) = *(char *) (lpbuffer + (*ReadBufferPos + (7 - j))) ;
                *ReadBufferPos += 8;
                loffset += 8;
            }
        break;
    }
    return (DWORD) (8 * Size);
}

function XFLongWrite (xf , char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var  loffset = 0;
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);

    switch (Flag) {
        case 0 :
        case 3 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 4; j++) {
                    *(char*)(BeginPointer + loffset) = *(char *) (lpbuffer + *ReadBufferPos) ;
                    *ReadBufferPos += 1;
                    loffset += 1;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var i = 0; i < Size; i++) {
                for (j = 0; j < 4; j++)
                    *(char*)(BeginPointer + j + loffset) = *(char *) (lpbuffer + (*ReadBufferPos + (3 - j))) ;
                *ReadBufferPos += 4;
                loffset += 4;
            }
        break;
    }
    return (DWORD) (4 * Size);
}

function XFWordWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;

    switch (Flag) {
        case 0 :
        case 3 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 2; j++) {
                    *(char*)(BeginPointer + loffset) = *(char *) (lpbuffer + *ReadBufferPos) ;
                    *ReadBufferPos += 1;
                    loffset += 1;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 2; j++)
                    *(char*)(BeginPointer + j + loffset) =  *(char *)(lpbuffer +*ReadBufferPos + (1 - j));
                *ReadBufferPos += 2;
                loffset += 2;
            }
            break;
    }
    return (DWORD)(2 * Size);
}

function XFShortWrite (xf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {
    
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);
    var loffset = 0;

    switch (Flag) {
        case 0 :
        case 3 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 2; j++) {
                    *(char*)(BeginPointer + loffset) = *(char *) (lpbuffer + *ReadBufferPos) ;
                    *ReadBufferPos += 1;
                    loffset += 1;
                }
            }
            break;
        case 1 :
        case 2 :
            for (var i = 0; i < Size; i++) {
                for (var j = 0; j < 2; j++)
                    *(char*)(BeginPointer + j + loffset) =  *(char*)(lpbuffer + *ReadBufferPos + (1 - j));
                *ReadBufferPos += 2;
                loffset += 2;
            }
            break;
    }
    return (DWORD)(2 * Size);
}

function XFDWordWrite (xf , char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size) {

    var loffset = 0;
    var  Flag = xf.SystemFlag | (xf.StreamSystemFlag << 1);

    switch (Flag) {
    case 0 :
    case 3 :
        for (var i = 0; i < Size; i++) {
            for (var j = 0; j < 4; j++) {
                *(char*)(BeginPointer + loffset) = *(char *) (lpbuffer + *ReadBufferPos) ;
                *ReadBufferPos += 1;
                loffset += 1;
            }
        }
        break;
    case 1 :
    case 2 :
        for (var i = 0; i < Size; i++) {
            for (j = 0; j < 4; j++)
                *(char*)(BeginPointer + j + loffset) =  * (char*) (lpbuffer + *ReadBufferPos + (3 - j)) ;
            *ReadBufferPos += 4;
            loffset += 4;
        }
        break;
    }
    return (DWORD) (4 * Size);
}