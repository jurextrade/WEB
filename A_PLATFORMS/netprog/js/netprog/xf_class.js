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


/* the stream of communication between two end points will be : */
/* Little Endian for types and ASCII Char for characters     */


/* different system representation of types */

const    XFLittleEndian     = 0x0000;
const    XFBigEndian        = 0x0001;


/* different type of characters*/

const    XFAscii            = 0x0000;         /* Windows et Unix */
const    XFEbcdic           = 0x0001;
const    XFOs2              = 0x0002;

/* Code page categories */

const XFCPWINDOWS           = 0;
const XFCPEBCDIC            = 1;
const XFCPEDITION           = 2;
const XFCPISO8859           = 3;
const XFCPAPPLE             = 4;
const XFCPOTHER             = 5;


const XLAT_MAXBUF           = 80;
const MAXCODE               = 80;                 


function  MXlatc (xl, c)       { return (xl == NULL ? c : xl.Tab.Tables[xl.FromTo][c])}
function  MUnXlatc (xl, c)     { return (xl == NULL ? c : xl.Tab.Tables[not(xl.FromTo)][c])}
function  not (i)              { return ((i) ? 0 : 1)}
function  ReadSM(f, s, max)    { }//ReadSGnrl( f, s, max, 0 )}


function  XL () {
    var Tab;                     /* XLTable */
    var FromTo;                  /* flag inversion */
}

function XLTable ()  {
    var Name;
    var From = '';       /* code jeu de caract�res avant */
    var To   = '';       /* code jeu de caract�res apr�s */
    var IsBiject;                                   /* = 1 si table bijective*/
    var Tables = [new Array(128), new Array(128)]   /* tables de transformation directe et inverse*/
}

function XFSymbolRepresentation () {
    var   AsciiRepresentation;
    var   InFont;
}

function XFTableRepresentation () {
    var   Category;
    var   Label;
    var   CountryCode;
}

function XFTable () {
    var Name;
    var Code;
    var From;
    var To;
    var Table;
}

function XF () {
    var  XL;                     /* table of transcodification   */    
    var  SystemFlag;             /* System little-e or big-e     */
    var  StreamSystemFlag;       /* buffering little-e or big-e  */
    var  CharFlag;               /* System char                  */
    var  StreamCharFlag;         /* stream char flag             */
    var  Code;                   /* code of the class            */
    var  FileName;               /* File where syntax is defined */
    var  XlatTables = [];    
};

/*=====================================================================================*/

/*
    extern int       XFInit (XF* pxf, UINT xdr, UINT transcode);
    extern int       XFInitSameSystem (XF* pxf);
    extern void      XFEnd (XF* pxf);
    extern XLAT_TBL* XFGetXlatFromName(char* Name);
    extern XLAT_TBL* XFLoadSystemTable(XFTable *ptable);
    extern int       XFGetIndexTableFromName (char* Name);


    extern void  XFError (char* name, int index);

    extern DWORD XFByteRead   (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFWordRead   (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFCharRead   (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFLongRead   (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFDWordRead  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFDoubleRead (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFStringRead (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFFileRead   (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFByteWrite  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFCharWrite  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFWordWrite  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFShortWrite (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFLongWrite  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFDWordWrite (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFDoubleWrite(XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFShortRead  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFStringWrite(XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern DWORD XFFileWrite  (XF* pxf, char* lpbuffer, LONG* ReadBufferPos, char* BeginPointer, int Size);
    extern BOOL  XFSameSystem (XF* pxf);
    extern void  XFChangeSystemFlag (XF* pxf, UINT xdr, UINT transcode);
*/

