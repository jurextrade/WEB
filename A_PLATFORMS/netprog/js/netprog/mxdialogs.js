var DialogClasses = [
    {
        Code: 80,
        Name: 'HTTP',
        MessageClasses: 
        [
            {
                Name: 'Request',        
                Code: 1,                    
                Objects: 
                [
                    {Name: 'Request-Line',         Type: 'STRING',   Size: 1},    
                    {Name: 'Cache-Control',        Type: 'STRING',   Size: 1},    
                    {Name: 'Connection',           Type: 'STRING',   Size: 1},    
                    {Name: 'Date',                 Type: 'STRING',   Size: 1},    
                    {Name: 'Pragma',               Type: 'STRING',   Size: 1},    
                    {Name: 'Trailer',              Type: 'STRING',   Size: 1},    
                    {Name: 'Transfer-Encoding',    Type: 'STRING',   Size: 1},    
                    {Name: 'Upgrade',              Type: 'STRING',   Size: 1},    
                    {Name: 'Via',                  Type: 'STRING',   Size: 1},    
                    {Name: 'Warning',              Type: 'STRING',   Size: 1},    
                    {Name: 'Accept',               Type: 'STRING',   Size: 1},    
                    {Name: 'Accept-Charset',       Type: 'STRING',   Size: 1},    
                    {Name: 'Accept-Encoding',      Type: 'STRING',   Size: 1},    
                    {Name: 'Accept-Language',      Type: 'STRING',   Size: 1},    
                    {Name: 'Authorization',        Type: 'STRING',   Size: 1},    
                    {Name: 'Expect',               Type: 'STRING',   Size: 1},    
                    {Name: 'From',                 Type: 'STRING',   Size: 1},    
                    {Name: 'Host',                 Type: 'STRING',   Size: 1},    
                    {Name: 'If-Match',             Type: 'STRING',   Size: 1},    
                    {Name: 'If-Modified-Since',    Type: 'STRING',   Size: 1},    
                    {Name: 'If-None-Match',        Type: 'STRING',   Size: 1},    
                    {Name: 'If-Range',             Type: 'STRING',   Size: 1},    
                    {Name: 'If-Unmodified-Since',  Type: 'STRING',   Size: 1},    
                    {Name: 'Max-Forwards',         Type: 'STRING',   Size: 1},    
                    {Name: 'Proxy-Authorzation',   Type: 'STRING',   Size: 1},    
                    {Name: 'Range',                Type: 'STRING',   Size: 1},    
                    {Name: 'Referer',              Type: 'STRING',   Size: 1},    
                    {Name: 'TE',                   Type: 'STRING',   Size: 1},    
                    {Name: 'User-Agent',           Type: 'STRING',   Size: 1},     
                    {Name: 'Allow',                Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Encoding',     Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Language',     Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Length',       Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Location',     Type: 'STRING',   Size: 1},  
                    {Name: 'Content-MD5',          Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Range',        Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Type',         Type: 'STRING',   Size: 1},  
                    {Name: 'Expires',              Type: 'STRING',   Size: 1},  
                    {Name: 'Last-Modified',        Type: 'STRING',   Size: 1},  
                    {Name: 'Proxy-Connection',     Type: 'STRING',   Size: 1},  
                    {Name: 'Cookie',               Type: 'STRING',   Size: 1},  
                    {Name: 'Content',              Type: 'BUFFER',   Size: 1},  
                ],
            },
            {
                Name: 'Response',        
                Code: 2,                   
                Objects: 
                [     
                    {Name: 'Status-Line',         Type: 'STRING',   Size: 1},  
                    {Name: 'Cache-Control',       Type: 'STRING',   Size: 1},  
                    {Name: 'Connection',          Type: 'STRING',   Size: 1},  
                    {Name: 'Date',                Type: 'STRING',   Size: 1},  
                    {Name: 'Pragma',              Type: 'STRING',   Size: 1},  
                    {Name: 'Trailer',             Type: 'STRING',   Size: 1},  
                    {Name: 'Transfer-Encoding',   Type: 'STRING',   Size: 1},  
                    {Name: 'Upgrade',             Type: 'STRING',   Size: 1},  
                    {Name: 'Via',                 Type: 'STRING',   Size: 1},  
                    {Name: 'Warning',             Type: 'STRING',   Size: 1},  
                    {Name: 'Accept-Ranges',       Type: 'STRING',   Size: 1},  
                    {Name: 'Age',                 Type: 'STRING',   Size: 1},  
                    {Name: 'Etag',                Type: 'STRING',   Size: 1},  
                    {Name: 'Location',            Type: 'STRING',   Size: 1},  
                    {Name: 'Proxy-Connection',    Type: 'STRING',   Size: 1},  
                    {Name: 'Retry-After',         Type: 'STRING',   Size: 1},  
                    {Name: 'Server',              Type: 'STRING',   Size: 1},  
                    {Name: 'Vary',                Type: 'STRING',   Size: 1},  
                    {Name: 'WWW-Authenticate',    Type: 'STRING',   Size: 1},  
                    {Name: 'Allow',               Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Encoding',    Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Language',    Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Length',      Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Location',    Type: 'STRING',   Size: 1},  
                    {Name: 'Content-MD5',         Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Range',       Type: 'STRING',   Size: 1},  
                    {Name: 'Content-Type',        Type: 'STRING',   Size: 1},  
                    {Name: 'Expires',             Type: 'STRING',   Size: 1},  
                    {Name: 'Last-Modified',       Type: 'STRING',   Size: 1},  
                    {Name: 'P3P',                 Type: 'STRING',   Size: 1},  
                    {Name: 'Content',             Type: 'BUFFER',   Size: 1},  
                ]                
            }
        ]
    },
    {
        Code: 30000,
        Name: 'DG',
        MessageClasses: 
        [  
            {
                Name: 'SendFile',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',    Size: 1},  
                    {Name: 'NbFiles',              Type: 'SHORT',   Size: 1},  
                    {Name: 'NbFile',               Type: 'SHORT',   Size: 1},  
                    {Name: 'File',                 Type: 'FILE',    Size: 1},  
                ]
            },
            {
                Name: 'GetFiles',        
                Code: 2,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',    Size: 1},  
                    {Name: 'FileNames',            Type: 'STRING',  Size: 1},  
                    {Name: 'LocalRepertory',       Type: 'STRING',  Size: 1},  
                    {Name: 'FileType',             Type: 'CHAR',    Size: 1},  
                    {Name: 'LocalFileLoc',         Type: 'CHAR',    Size: 1},  
                    {Name: 'DistantFileLoc',       Type: 'CHAR',    Size: 1},  
                ]
            },    
            {
                Name: 'GetFile',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'FileName',             Type: 'STRING', Size: 1},  
                    {Name: 'DestName',             Type: 'STRING', Size: 1},  
                    {Name: 'FileType',             Type: 'CHAR',   Size: 1},  
                    {Name: 'LocalFileLoc',         Type: 'CHAR',   Size: 1},  
                    {Name: 'DistantFileLoc',       Type: 'CHAR',   Size: 1},  
                ]
            },    
            {
                Name: 'RemoveFiles',        
                Code: 4,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'FileNames',            Type: 'STRING', Size: 1},  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},  
                ]
            },                 
            {
                Name: 'RenameFile',        
                Code: 5,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'OldName',              Type: 'STRING', Size: 1},  
                    {Name: 'NewName',              Type: 'STRING', Size: 1},                  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},  
                ]
            },       
            {
                Name: 'FileReply',        
                Code: 6,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'FileName',             Type: 'STRING', Size: 1},  
                    {Name: 'NbFiles',              Type: 'SHORT',  Size: 1},                  
                    {Name: 'NbFile',               Type: 'SHORT',  Size: 1},  
                ]
            }, 
            {
                Name: 'ChangeDir',        
                Code: 7,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'NewDir',               Type: 'STRING', Size: 1},  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},                  
                    {Name: 'NbFile',               Type: 'SHORT',  Size: 1},  
                ]
            },    
            {
                Name: 'MakeDir',        
                Code: 8,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'Dir',                  Type: 'STRING', Size: 1},  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},                  
                ]
            },  
            {
                Name: 'RemoveDir',        
                Code: 9,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'Dir',                  Type: 'STRING', Size: 1},  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},                  
                ]
            }, 
            {
                Name: 'GetDir',        
                Code: 10,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'FileLoc',              Type: 'CHAR',   Size: 1},                  
                ]
            },   
            {
                Name: 'DirReply',        
                Code: 11,                   
                Objects: 
                [
                    {Name: 'Command',              Type: 'STRING', Size: 1},  
                    {Name: 'Identity',             Type: 'LONG',   Size: 1},  
                    {Name: 'Dir',                  Type: 'STRING', Size: 1},     
                    {Name: 'Error',                Type: 'LONG',   Size: 1},                               
                ]
            },
            {
                Name: 'PutError',        
                Code: 12,                   
                Objects: 
                [
                    {Name: 'Param',              Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Stop',               Type: 'SHORT',   Size: 1},     
                    {Name: 'Error',              Type: 'LONG',    Size: 1},                               
                ]
            },   
            {
                Name: 'AckMessage',        
                Code: 13,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Date',               Type: 'DWORD',   Size: 1},  
                    {Name: 'Hour',               Type: 'DWORD',   Size: 1},     
                    {Name: 'Error',              Type: 'LONG',    Size: 1},                               
                ]
            }, 
            {
                Name: 'SendClassConnection',        
                Code: 14,                   
                Objects: 
                [
                    {Name: 'Name',               Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'WORD',    Size: 1},  
                    {Name: 'Code',               Type: 'WORD',    Size: 1},     
                    {Name: 'TableName',          Type: 'STRING',  Size: 1},                               
                    {Name: 'FromTo',             Type: 'BYTE',    Size: 1},                               
                ]
            }, 
            {
                Name: 'ReplyClassConnection',        
                Code: 15,                   
                Objects: 
                [
                    {Name: 'Name',               Type: 'STRING',  Size: 1},  
                    {Name: 'Error',              Type: 'LONG',    Size: 1},  
                ]
            }, 
            {
                Name: 'List',        
                Code: 16,                   
                Objects: 
                [
                    {Name: 'Command',            Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Name',               Type: 'STRING',  Size: 1},  
                    {Name: 'FileLoc',            Type: 'CHAR',    Size: 1},  
                ]
            },   
            {
                Name: 'ListReply',        
                Code: 17,                   
                Objects: 
                [
                    {Name: 'Command',            Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Name',               Type: 'STRING',  Size: 1},  
                    {Name: 'Access',             Type: 'CHAR',    Size: 1},  
                    {Name: 'Date',               Type: 'STRING',  Size: 1},  
                    {Name: 'Type',               Type: 'BYTE',    Size: 1},  
                    {Name: 'Size',               Type: 'LONG',  Size: 1},  
                    {Name: 'NbFiles',            Type: 'SHORT',    Size: 1},  
                    {Name: 'NbFile',             Type: 'SHORT',    Size: 1},  
                ]
            },  
            {
                Name: 'Dir',        
                Code: 18,                   
                Objects: 
                [
                    {Name: 'Command',            Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Name',               Type: 'STRING',  Size: 1},  
                    {Name: 'FileLoc',            Type: 'CHAR',    Size: 1},  
                ]
            },
            {
                Name: 'GDirReply',        
                Code: 19,                   
                Objects: 
                [
                    {Name: 'Command',            Type: 'STRING',  Size: 1},  
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Buffer',             Type: 'BUFFER',  Size: 1},  
                ]
            },                                                                                                                                                  
        ]
    },
    {
        Code: 21,
        Name: 'FTP',
        MessageClasses: 
        [  
            {
                Name: 'Command',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                ]
            }, 
            {
                Name: 'Command_Reply',        
                Code: 2,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Code',               Type: 'LONG',  Size: 1},  
                    {Name: 'Reply',              Type: 'STRING',  Size: 1},  
                ]
            },         
            {
                Name: 'dir',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'LONG',    Size: 1},  
                ]
            },
            {
                Name: 'dir_reply',        
                Code: 4,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Error',              Type: 'LONG',    Size: 1},  
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'LONG',    Size: 1},  
                    {Name: 'Buffer',             Type: 'BUFFER',  Size: 1},                                  
                ]
            },
            {
                Name: 'get',        
                Code: 5,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'FileName',           Type: 'STRING',  Size: 1},  
                    {Name: 'DestName',           Type: 'STRING',  Size: 1},  
                    {Name: 'FileType',           Type: 'CHAR',    Size: 1},  
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'LONG',    Size: 1},  
                                
                ]
            },  
            {
                Name: 'put',        
                Code: 6,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'File',               Type: 'FILE',    Size: 1},  
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'LONG',    Size: 1}, 
                
                ]
            },               
            {
                Name: 'get_reply',        
                Code: 7,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Error',              Type: 'LONG',    Size: 1},  
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},  
                    {Name: 'Port',               Type: 'LONG',    Size: 1}, 
                    {Name: 'File',               Type: 'FILE',    Size: 1},                   
                ]
            },
            {
                Name: 'put_reply',        
                Code: 8,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Error',              Type: 'LONG',    Size: 1},  
                    {Name: 'FileName',           Type: 'STRING',  Size: 1},  
                    {Name: 'DestName',           Type: 'STRING',  Size: 1}, 
                    {Name: 'NetId',              Type: 'STRING',  Size: 1},
                    {Name: 'Port',               Type: 'LONG',    Size: 1},                   
                ]
            },
        ]
    },
    {
        Code: 25,
        Name: 'SMTP',
        MessageClasses: 
        [  
            {
                Name: 'Command',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                ]
            },
            {
                Name: 'Command_Reply',        
                Code: 2,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Code',               Type: 'LONG',    Size: 1},  
                    {Name: 'Reply',              Type: 'STRING', Size: 1},                  
                ]
            },
            {
                Name: 'Send',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'From',               Type: 'STRING',  Size: 1},  
                    {Name: 'To',                 Type: 'STRING',  Size: 1},  
                    {Name: 'Cc',                 Type: 'LONG',    Size: 1},  
                    {Name: 'Bcc',                Type: 'STRING',  Size: 1}, 
                    {Name: 'Object',             Type: 'STRING',  Size: 1},  
                    {Name: 'Subject',            Type: 'STRING',  Size: 1},  
                    {Name: 'Attachment',         Type: 'STRING',  Size: 1},                                     
                ]
            },
        ]        
    },
    {
        Code: 110,
        Name: 'POP',
        MessageClasses: 
        [  
            {
                Name: 'Command',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                ]
            },
            {
                Name: 'Command_Reply',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Code',               Type: 'LONG',    Size: 1},  
                    {Name: 'Reply',              Type: 'STRING',  Size: 1},         
                            
                ]
            },        
            {
                Name: 'List_Reply',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Reply',              Type: 'STRING',  Size: 1},         
                    {Name: 'Code',               Type: 'LONG',    Size: 1},  
                    {Name: 'Number',             Type: 'LONG',    Size: 1},  
                    {Name: 'Size',               Type: 'LONG',    Size: 1},  
                    {Name: 'TotalNumber',        Type: 'LONG',    Size: 1},         
                    {Name: 'TotalSize',          Type: 'LONG',    Size: 1},  
                ]
            },         
            {
                Name: 'Stat_Reply',        
                Code: 4,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Reply',              Type: 'STRING',  Size: 1},         
                    {Name: 'Code',               Type: 'LONG',    Size: 1},  
                    {Name: 'TotalNumber',        Type: 'LONG',    Size: 1},         
                    {Name: 'TotalSize',          Type: 'LONG',    Size: 1},  
                ]
            },       
            {
                Name: 'Retr_Reply',        
                Code: 5,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',    Size: 1},  
                    {Name: 'Value',              Type: 'STRING',  Size: 1},  
                    {Name: 'Par',                Type: 'STRING',  Size: 1},  
                    {Name: 'Reply',              Type: 'STRING',  Size: 1},         
                    {Name: 'Code',               Type: 'LONG',    Size: 1},  
                    {Name: 'Size',               Type: 'LONG',    Size: 1},         
                    {Name: 'Date',               Type: 'STRING',  Size: 1},  
                    {Name: 'From',               Type: 'STRING',  Size: 1},  
                    {Name: 'To',                 Type: 'STRING',  Size: 200},  
                    {Name: 'Cc',                 Type: 'STRING',  Size: 200},  
                    {Name: 'Bcc',                Type: 'STRING',  Size: 200},         
                    {Name: 'Subject',            Type: 'STRING',  Size: 1},  
                    {Name: 'Body',               Type: 'STRING',  Size: 1},         
                    {Name: 'Attachment',         Type: 'STRING',  Size: 1},                  
                ]
            },                            
        ]
    },
    {
        Code: 10000,
        Name: 'FIOP',
        MessageClasses: 
        [  
        ]        
    },
    {
        Code: 0,
        Name: 'TCP',
        MessageClasses: 
        [  
            {
                Name: 'Stream',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Buffer',           Type: 'BUFFER',    Size: 1},  
                ]
            },         
        ]        
    },
    {
        Code: 2010,
        Name: 'MT',
        MessageClasses: 
        [  
            {
                Name: 'Stream',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Buffer',           Type: 'BUFFER',    Size: 1},  
                ]
            },         
        ]        
    },
    {
        Code: 53,
        Name: 'DNS',
        MessageClasses: 
        [  
            {
                Name: 'Query',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',      Size: 1},  
                    {Name: 'Operation',          Type: 'WORD',      Size: 1},  
                    {Name: 'QClass',             Type: 'WORD',      Size: 1},  
                    {Name: 'QType',              Type: 'WORD',      Size: 1},         
                    {Name: 'Domain',             Type: 'STRING',    Size: 1},  
                    {Name: 'RecordData',         Type: 'BUFFER',    Size: 1},         
                ]
            },      
            {
                Name: 'Retr_Reply',        
                Code: 2,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',      Size: 1},  
                    {Name: 'Operation',          Type: 'WORD',      Size: 1},  
                    {Name: 'QClass',             Type: 'WORD',      Size: 1},  
                    {Name: 'QType',              Type: 'WORD',      Size: 1},         
                    {Name: 'Domain',             Type: 'STRING',    Size: 1},    
                    {Name: 'Code',               Type: 'WORD',      Size: 1},         
                    {Name: 'AnswerCount',        Type: 'WORD',      Size: 1},  
                    {Name: 'AuthorityCount',     Type: 'WORD',      Size: 1},  
                    {Name: 'AdditionalCount',    Type: 'WORD',      Size: 1},  
                    {Name: 'Section',            Type: 'WORD',      Size: 60},  
                    {Name: 'Name',               Type: 'STRING',    Size: 60},         
                    {Name: 'Type',               Type: 'WORD',      Size: 60},  
                    {Name: 'Value',              Type: 'STRING',    Size: 60},         

                ]
            },                                
        ]    
    },
    {
        Code: 30001,
        Name: 'DB',
        MessageClasses: 
        [  
            {
                Name: 'ExecuteQuery',        
                Code: 1,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',      Size: 1},  
                    {Name: 'Name',               Type: 'STRING',    Size: 1},  
                    {Name: 'SqlStatement',       Type: 'STRING',    Size: 1},  
                    {Name: 'Every',              Type: 'DWORD',     Size: 1},         
                    {Name: 'MaxRows',            Type: 'DWORD',     Size: 1},  
                    {Name: 'IdentStatic',        Type: 'STRING',    Size: 1},         
                ]
            },      
            {
                Name: 'ExecuteUpdate',        
                Code: 2,                   
                Objects: 
                [
                    {Name: 'IdentStatic',        Type: 'STRING',    Size: 1},  
                    {Name: 'SqlStatement',       Type: 'STRING',    Size: 1},  
                    {Name: 'Commit',             Type: 'BYTE',      Size: 1},  
                ]
            },   
            {
                Name: 'ResultHeader',        
                Code: 3,                   
                Objects: 
                [
                    {Name: 'ClassName',          Type: 'STRING',    Size: 1},  
                    {Name: 'QueryName',          Type: 'STRING',    Size: 1},  
                ]
            },                                            
            {
                Name: 'ResultSet',        
                Code: 4,                   
                Objects: 
                [
                    {Name: 'RowsNumber',         Type: 'STRING',    Size: 1},  
                    {Name: 'Buffer',             Type: 'BUFFER',    Size: 1},  
                    {Name: 'LastContext',        Type: 'BYTE',      Size: 1},  

                ]
            }, 
            {
                Name: 'AckStatement',        
                Code: 5,                   
                Objects: 
                [
                    {Name: 'Identity',           Type: 'LONG',       Size: 1},  
                    {Name: 'RowsProcessed',      Type: 'LONG',       Size: 1},  
                    {Name: 'SqlCode',            Type: 'LONG',       Size: 1},  
                    {Name: 'SqlErrMsg',          Type: 'STRING',     Size: 1},  
                    {Name: 'SqlStatement',       Type: 'STRING',     Size: 1},  
                    {Name: 'Print',              Type: 'SHORT',      Size: 1},  
                    {Name: 'Stop',               Type: 'SHORT',      Size: 1},  
                ]
            },                                                       
            {
                Name: 'DisconnectClient',        
                Code: 6,                   
                Objects: 
                [
                    {Name: 'Commit',             Type: 'BYTE',       Size: 1},  
                ]
            },
            {
                Name: 'CommitOrRollback',        
                Code: 7,                   
                Objects: 
                [
                    {Name: 'Commit',             Type: 'BYTE',       Size: 1},  
                ]
            },
            {
                Name: 'CancelStatement',        
                Code: 8,                   
                Objects: 
                [
                ]
            },   
            {
                Name: 'AskShow',        
                Code: 9,                   
                Objects: 
                [
                    {Name: 'SqlStatement',       Type: 'LONG',       Size: 1},  
                    {Name: 'StorageType',        Type: 'LONG',       Size: 1},  
                ]
            },
            {
                Name: 'ReceiveShowBuffer',        
                Code: 10,                   
                Objects: 
                [
                    {Name: 'Buffer',             Type: 'BUFFER',     Size: 1},  
                    {Name: 'LastContext',        Type: 'BYTE',       Size: 1},  
                ]
            },                                                  
        ]    
    }
]
