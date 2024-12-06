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

var isLittleEndian = true;

const LITTLE_ENDIAN     = 1234;    /* least-significant byte first (vax, pc) */
const BIG_ENDIAN        = 4321;    /* most-significant byte first (IBM, net) */
const PDP_ENDIAN        = 3412;    /* LSB first in word, MSW first in long (pdp)*/

var   HIGH_LOW          = undefined;
var   LOW_HIGH          = undefined;
var   BYTE_ORDER        = undefined;


(()=>{
    var buf  = new ArrayBuffer(4);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);
    data[0] = 0x0F000000;

    if(buf8[0] === 0x0f){
        HIGH_LOW    =  BIG_ENDIAN
        BYTE_ORDER  =  BIG_ENDIAN;
    } else {
        LOW_HIGH    =  LITTLE_ENDIAN
        BYTE_ORDER  =  LITTLE_ENDIAN;
    }
})();  

const CHAR_ASCII        = 1;
const CHAR_OS2          = 2;
const CHAR_EBCDIC       = 3;

const BYTE              = 1;       /* 8-bit unsigned entity                   */
const BOOL              = 2;       /* BOOLean (0 or !=0)                      */
const WORD              = 3;       /* 16-bit unsigned number                   */
const UINT              = 4;       /* machine sized unsigned number (preferred)*/
const SHORT             = 5;       /* 16-bit signed number                     */
const LONG              = 6;       /* 32-bit signed number                     */
const DWORD             = 7;       /* 32-bit unsigned number                   */
const DOUBLE            = 8;       /* 64-bit signed number                     */
const CHAR              = 9;       /* 8-bit character                          */
const STRING            = 10;


const OSCHAR            = 1;
const INTEGER           = 2;
const OSDECIMAL         = 3;
const OSDOUBLE          = 4;
const OSBIT             = 5;
const OSFLOAT           = 6;
const OSLONGVARBINARY   = 7;
const OSNUMERIC         = 8;
const OSTIMESTAMP       = 9;    
const OSTIME            = 10; 
const OSDATE            = 11;
const OSVARCHAR         = 12;
const OSINTEGER         = 13;
const OSLONGVARCHAR     = 14;
const OSREAL            = 15;
const OSBIGINT          = 16;
const OSBINARY          = 17;	
const SMALLINT          = 18;			
const OSTINYINT         = 19;
const OSVARBINARY       = 20;

const OSSHORT           = 21;
const OSWORD            = 22;
const OSBYTE            = 23;
const OSSTRING          = 24;
const OSBUFFER          = 25;
const OSFILE            = 26;
const OSLONG            = 27;
const OSDWORD           = 28;

const FAR               = 1;
const NEAR              = 2
const NULL              = null;
const TRUE              = true;
const FALSE             =  false;

const KO                = 1;
const OK                = 0;


const  FILENAMESIZE     = 120;
const  ACCESSSIZE       = 30;
const  DATESIZE         = 30;
const  MAXBUFSIZE       = (1 << 21);

const OSFICTEXTE        = 't';             /* Fichier de type Texte                  */
const OSFICBINAI        = 'b';             /* Fichier de type Binaire                */          
const OSFICTXCMP        = 'x';             /* Fichier de type Texte compresse        */
const OSFICBICMP        = 'n';             /* Fichier de type Binaire comp.          */
const OSFICBITRS        = 'g';             /* Fichier de type Binaire trancodifie    */

const TYPEDIRECTORY     = 1;
const TYPEFILE          = 0;
const TYPELINK          = 2;

const  BUFSIZE          = 4096;                                                    
const  BUFWATERMARK     = 8192;                                                    


function FILEPARM() {
    this.FileOri;                   /* nom du fichier Origine                 */
    this.FileDest;                  /* nom du fichier Destinataire            */
    this.FileOriLocal;              /* disque ou SFS                          */
    this.FileDestLocal;             /* disque ou SFS                          */
    this.FileType;                  /* Type du fichier                        */
    this.FileSize;                  /* Taille du fichier en octets            */
    this.FileError;                 /* Nb d'enregistrements du fichier        */
}

/* variable ou fixe sur VM ? */

function FILEDATA() {
    this.Name;
    this.Type;                       /* Repertory or File                     */
    this.Size;
    this.Access;
    this.Date;
}

function BUFFERPARM() {
    this.BufferSize;                 /* Size of buffer                         */
    this.BufferType;                 /* Type du buffer ascii ou binaire        */
    this.BufferContent;
};

function sizeof (type) {
  switch (type) {
    case BYTE:    return 1;
    case BOOL:    return 1;
    case WORD:    return 2;
    case UINT:    return 8;  //javascript always 64 digits ?
    case SHORT:   return 2;
    case LONG:    return 4;
    case DWORD:   return 4;
    case DOUBLE:  return 8;
    case CHAR:    return 1;
    case STRING:  return type.length;
    default:      return -1;
  }
}
