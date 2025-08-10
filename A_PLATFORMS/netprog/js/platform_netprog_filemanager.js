//---------------------------------------------------- FILE MANAGER ---------------------------------------------------------------
var netprog_fileditor;

class npfile {
    constructor (cname, name, folder, type) {
        this.Entity  = null;
        this.Content = '';
        this.Folder  = folder;
        this.Name    = name;
        this.CName   = cname;
        this.Loaded  = false;
        this.Type    = defined (type) ? type : 'file';
    }
}

function netprog_filemanager_init () {
    netprog_file_init('netprog_file');    
}

function netprog_filemanager_select () {
}

//---------------------------------------------------- FILE  ---------------------------------------------------------------

function netprog_file_init (id) {
    netprog_fileditor = new aceeditor(id, "ace/theme/nord_dark", "ace/mode/jsx");      
    netprog_fileditor.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });   
    netprog_fileditor.currentSession.on("change", function (a) {
        if (a.action == "remove" && netprog_fileditor.programchanged == 1) {
            netprog_fileditor.programchanged = 0;
            return;
        }
        netprog_fileditor.programchanged = 0;
        let content = netprog_fileditor.getValue();
        if (content !== solution.CurrentFile.Content) {
            solution.CurrentFile.Content = content;
        }
    });    
    netprog_fileditor.addCommand({
        name: 'Ace_Save',
        bindKey: {
            win: 'Ctrl-S',
            mac: 'Ctrl-R',
        },
        exec: netprog_file_save
        });   
        netprog_fileditor.addCommand({
            name: 'Ace_Shift',
            bindKey: {
                win: 'Shift-Tab',
                mac: 'Shift-Tab',
            },
            exec: netprog_file_shift
            });   
              
}


function netprog_filemanager_update () {
    let cuser = solution.get('user')

    if (!cuser.is_registered()) {
        sb.tree_additem (netprog_filemanager.id, ReturnWarningALert(register_needed_label)); 
        return;
    }
    if (!cuser.fileexplorer) {
        cuser.send({Name: 'scandir_r',Values: cuser.is_admin () ? ['.', ''] : [c.user.path  + '/NetProg', '.']}, false,  function (content, values) {
            let dirstruct = JSON.parse (content);
            values[0].fileexplorer = dirstruct.Values[0]}, [cuser])
      
    }


//np    
    solution.Files = []

    sb.tree_removechildren(netprog_filemanager.id)

    netprog_filemanager_treefromexplorer (netprog_filemanager,  cuser.fileexplorer, [0])      
}

function netprog_filemanager_treenodeitem (cname, name, type, closed, levels) {
    let events = {oncontextmenu: 'oncontextmenu_netprog_filenode (this, event)'};
    if (type == 'link') {
        events.onclick = 'onclick_netprog_filenode (this, event)';
    }
    return {
        id:   'filetreenode' + levels[0] + '-' + name,
        type: type,
        item: name , 
        closed: closed,
        attributes: {fullpathname: cname, filename: name, type: type == 'tree' ? 'folder' : 'file'},
        icon: type == 'tree' ? icon_folder : icon_file,
        events: events,
        arrow: true,        
    }    
}

function netprog_filemanager_treefromexplorer (treenode, filenode, levels) {

    let type   = filenode.Type;
    let name   = filenode.Name
    let cname  = filenode.CName.replace(/\\/g, '/'); 
    let folder = filenode.Folder.replace(/\\/g, '/'); 
    
    let file;

    
    if (type == 'file') {

        file = new npfile (cname, name, folder)
        solution.Files.push (file)
        
        sb.tree_additem (treenode.id, netprog_filemanager_treenodeitem (cname, name, 'link', true, levels));         

    } else {
        file = new npfile (cname, name, folder, 'folder')
        solution.Folders.push (file)        
        levels[0]++;
       
        let sonnode = netprog_filemanager_treenodeitem (cname, name, 'tree', treenode != netprog_filemanager, levels)
        sb.tree_additem (treenode.id, sonnode); 
        
        filenode.Files.sort (function (a, b) {
            let x = a.Type;
            let y = b.Type;
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;                    
        })        

        for (var index = 0; index < filenode.Files.length; index++) {
            netprog_filemanager_treefromexplorer(sonnode, filenode.Files[index], levels)
        }
        
    }
}
function netprog_file_shift (editor) {
    let cuser = solution.get('user')

    let file = solution.CurrentFile;
    if (!file) {
        return;
    }
    let tabs      = netprog_maintabs.items;
    let ctabitem  = sb.tab_finditem(netprog_maintabs, file.CName);
    let ctabindex = tabs.indexOf(ctabitem);
    let ntabindex = ctabindex == netprog_maintabs.items.length - 1 ? 0 : ctabindex + 1;
    

    sb.tab_select(netprog_maintabs, netprog_maintabs.items[ntabindex].cname)
    
    let fullpathname = $('#' + netprog_maintabs.items[ntabindex].id).attr('fullpathname');

    if (fullpathname) {
        let cfile = solution.GetFileFromCName(netprog_maintabs.items[ntabindex].cname)

        solution.CurrentFile = cfile;
        netprog_fileditor.setValue (cfile.Content);    
    }
}

function netprog_filemanager_newfile (name, folder) {
    let cname = folder + '/' + name;
    let file  = new npfile (cname , name, folder)
    solution.Files.push (file)

    let treenode = $('#netprog_filemanager_ref [fullpathname="' +  folder + '"]');
    sb.tree_additem ($(treenode).attr('id'), netprog_filemanager_treenodeitem (cname, name, 'link'));   
    solution.SelectFile = file;
    return file;
}


function netprog_file_save () {
    
    let  file = solution.CurrentFile;

    if (!file) {
        return;
    }

    let cuser = solution.get('user')

    cuser.send ({Name: 'savefile', Values: [file.CName, file.Content]}, true, 
                function (content, values) {
                    console.log (values[0] + ' saved : ' + content)
                }, 
                [file]);  
}

function netprog_file_read (file) {
    let cuser = solution.get('user')

    if (!file) {
        return;
    }

    cuser.send ({Name: 'readfile', Values: [file.CName]}, false, 
                function (content, values) {
                    let message;    
                    try {
                        message = JSON.parse(content);
                    } catch(e) {
                        return console.error(e); 
                    }                          
                    let file = values[0]
                    file.Content = message.Values[0].Content;
                    file.Loaded  = true;                    
                    netprog_file_select (file)
                }, 
                [file]);  
}

function netprog_file_update (filecontent) {
    netprog_fileditor.setValue (filecontent);
}

function netprog_file_select (file) {
    let filetabitem = sb.tab_finditem(netprog_maintabs, file.CName);
    
    if (!filetabitem) {
        filetabitem    = {id: 'netprog_maintabs_file_' + solution.NPCODE++,   item: file.Name,  cname: file.CName, type: 'link', icon: icon_file, roleid: 'role_netprog_file',  onclose: 'onclick="onclick_netprog_tab_close(this, event)"', 
                            items: [netprog_file],  events: {onclick:"onclick_netprog_tab(this, event)"}, attributes: {fullpathname: file.CName, filename: file.Name}}           
        sb.tab_additem (netprog_maintabs, filetabitem);
    } 
    sb.tab_select(netprog_maintabs, file.CName)
    
    solution.CurrentFile = file;
    netprog_fileditor.setValue (file.Content);
  
}

function onclick_netprog_filenode(elt, event) {
    
    let filename     = $(elt).attr('filename');
    let fullpathname = $(elt).attr('fullpathname');
    let repertory   = sb.tree_getancestorlabels(elt)


    repertory = repertory.replace ('/File Manager', '')
    sb.tree_selectitem(netprog_filemanager.id, filename);   

    let file = solution.GetFileFromCName (fullpathname);

    if (!file) {
        return;
    }
    if (!file.Loaded){
        netprog_file_read (file)
    } else {
        netprog_file_select (file)
    }
}

function oncontextmenu_netprog_filenode (elt, event) {
    let name        = $(elt).find('label').html();
    let selector    = $(elt).attr('type');   
    let pathname    = $(elt).attr('fullpathname');   
    let menu        = {};
    let file;

    switch (selector) {
        case "folder" :
            file        = solution.GetFolderFromCName(pathname)
            if (!file) {
                return
            }
            menu = netprog_foldermenu ();
        break;
        case "file" :
            file        = solution.GetFileFromCName(pathname)
            if (!file) {
                return
            }
            menu = netprog_filemenu ();
        break;
        default:
            return;
        break;    
    }

    sb.overlay({
        rootelt: $(elt).closest('.sb_root'),     
        event: event,                
        pageX: event.pageX,
        pageY: event.pageY,
        par : file,

        onselect: function (elt, itemtext) {
            let file = this.par;    
            switch (parseInt(elt.id)) {
                case MENU_FILE_NEWFILE_ID :
                    let folder = file;   //folder
                    OnNewFile (netprog_filemanager_newfile, folder.Name, folder.Folder);  //folder name, folder placement
                break;
                case MENU_FILE_NEWFOLDER_ID :
                    OnNewFolder ();
                break;
                case MENU_FILE_RENAME_ID :
                    OnRenameFile();
                break;                        
                case MENU_FILE_COPY_ID :
                    OnCopyFile();
                break;
                case MENU_FILE_CUT_ID :
                    OnCutFile();
                break;
                case MENU_FILE_PASTE_ID :
                    OnPasteFile ();
                case MENU_FILE_DELETE_ID :
                    OnDeleteFile();
                break;

            }                    
        },        
        html: sb.menu (menu)
    });    	
}


//---------------------------------------------------- FILE MENU CONTEXT ---------------------------------------------------------------

const MENU_FILE_NEWFILE_ID      = 0;
const MENU_FILE_NEWFOLDER_ID    = 1;
const MENU_FILE_COPY_ID         = 2;
const MENU_FILE_CUT_ID          = 3;
const MENU_FILE_PASTE_ID        = 4;
const MENU_FILE_RENAME_ID       = 7;
const MENU_FILE_DELETE_ID       = 5;



function netprog_foldermenu () {
    var menu = [];
  
    menu.push({id: MENU_FILE_NEWFILE_ID,    text: "New File...",   tooltip: 'Create New File',      icon: icon_rename});
    menu.push({id: MENU_FILE_NEWFOLDER_ID,  text: "New Folder...", tooltip: 'Delete Strategy from Project', icon: icon_remove});
    menu.push({id: 0,   text: ""});
    menu.push({id: MENU_FILE_COPY_ID,       text: "Copy",     tooltip: 'Copy ',                icon: icon_copy});
    menu.push({id: MENU_FILE_CUT_ID,        text: "Cut",      tooltip: 'Cut ',                 icon: icon_cut});
    menu.push({id: MENU_FILE_PASTE_ID,      text: "Paste",    tooltip: 'Paste ',   disabled: true,             icon: icon_paste});    
    menu.push({id: 0,   text: ""});
    menu.push({id: MENU_FILE_RENAME_ID,     text: "Rename...",   tooltip: 'Export Strategy to another Project', icon: icon_rename});
    menu.push({id: MENU_FILE_DELETE_ID,     text: "Delete",      tooltip: 'Export Strategy to another Project', icon: icon_remove});

    return menu;
}

function netprog_filemenu () {
    var menu = [];
    menu.push({id: MENU_FILE_COPY_ID,       text: "Copy",     tooltip: 'Copy ',                icon: icon_copy});
    menu.push({id: MENU_FILE_CUT_ID,        text: "Cut",      tooltip: 'Cut ',                 icon: icon_cut});
    menu.push({id: MENU_FILE_PASTE_ID,      text: "Paste",    tooltip: 'Paste ',   disabled: true,            icon: icon_paste});    
    menu.push({id: 0,   text: ""});
    menu.push({id: MENU_FILE_RENAME_ID,     text: "Rename...",   tooltip: 'Export Strategy to another Project', icon: icon_rename});
    menu.push({id: MENU_FILE_DELETE_ID,     text: "Delete",      tooltip: 'Export Strategy to another Project', icon: icon_remove});

    return menu;
}

let OnNewFile = function (callafter, name, folder) {
    let content = '<input  type="text" id="newfile" class="required form-control error" value="" autocomplete="off" onkeypress="return CheckChar(event)">';
    sb.confirm_modal(content , "New File Name",  function() {focusAndCursor("#newfile")},  true).yes(function () {
        let newname   = $('#newfile').val();
        let file  = callafter(newname, folder + '/' + name);
        if (file) {
            $("#confirmmodal").modal('hide');
        }
    }).no(function () {})        
}

let OnNewFolder = function () {}
let OnRenameFile = function () {}
let OnCopyFile = function () {}
let OnCutFile = function () {}
let OnPasteFile = function () {}
let OnDeleteFile = function () {}
