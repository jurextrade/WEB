function solution_init () {
 //   solution_treefromJSON(solution_tree, 'solution', solution.basic);
    solution_configurationpanel_init();
   // sb.update(solution_tree);
}

function solution_update () {
    if (solution.ui.platforms.length != 0) {
        let sb_elt = solution.ui.platforms[0];
        solution.ui.platform_select (sb_elt.pname)
    }
    if (solution.user.is_registered()) {
        $('#right_sidebarsave').removeClass('sb_none')
    }
}

function onclick_right_sidebarpin(elt, event) {
    let $rightsidebarpanel;    
    if ($(elt).hasClass ('checked')) {
        $rightsidebarpanel = $(elt).closest('.sb_rightsidebarpanel') ;
        $rightsidebarpanel.css ({'transition':'none'});
        rightsidebarpanel_hide($rightsidebarpanel);
        $rightsidebarpanel.removeClass ('pinned')
        
    } else {
        $rightsidebarpanel = $(elt).closest('.sb_rightsidebarpanel') ;
        $rightsidebarpanel.addClass ('pinned')
        sb.resize(sb.interface);        
    }
}

function onclick_right_sidebarsave(elt, event) {
        let cuser = solution.get('user')

        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');             
            return ;
        }
        let ui = solution.get('ui');
        solution.configuration.theme = ui.sb.theme;
        cuser.send ({Name: 'savefile', Values: ['../' + cuser.path + '/configuration.json', JSON.stringify(solution.configuration, null, 2)]}, true, 
                    function (content, values) {
                        DisplayInfo("Configutation Saved ", true, 'operationpanel',  'var(--theme-platform-color)');
                    }, 
                    ['configuration.json']);     
}

function solution_configurationpanel_init () {
    let placements =  ['header', 'main', 'right', 'left', 'footer']
        
    for (var i = 0; i < placements.length; i++) {
        let placement = placements[i];
        solution_module_init(placement, true);
    }
}

function solution_module_init (placement, initialisation) {
    var tcontent = '';
    var j = 0;    
    
    let table   = []

    if (initialisation) {
        let section = solution.configuration.body[placement]
        if (!section) {
            return;
        }
        modules = section.modules

    } else {
        modules = solution.modules[placement]    
    } 

    if (!modules) {
        modules = []
    }

    for (var i = 0; i < modules.length; i++) {
        let module = modules[i];
//        console.log ('configuration modules ' + module.pname);
        let sattributes = {};
        let load = 'dynamic';
        let visible    = 'sb_none';

        if  (module.active) {
            sattributes.checked = true
            load = solution.dynamic ? 'dynamic' : 'static';
            visible = '';
        }
        
        table.push ([
                {id: 'modulename_' +  module.pname ,      type: 'label',  item: module.name ? module.name : module.pname, title: 'module name'},
                {id: 'moduletype_' +  module.pname ,      type: 'label',  item: module.type,   title: 'module type'},
                {id: 'moduleplacement_' +  module.pname , type: 'label',  item: placement,     title: 'module placement'},
                {id: 'moduleload_' +  module.pname ,      type: 'label',  item: load,     title: 'module load'},
                {id: 'moduleactive_' +  module.pname ,    type: 'switch', item: '',  attributes: sattributes,  events: {onclick:'onclick_moduleactive(this, event)'}},
                {id: 'moduleloaded_' +  module.pname ,    type: 'link',   class: visible, icon: sb_icons['icon_check']}

        ])
    }
    let sb_items;
    switch (placement) {
        case 'header':
            sb_items = header.items;
        break;
        case 'right':
            sb_items = right.items[0].items;
        break;  
        case 'main':
            sb_items = main.items;
        break;
        case 'left':
            return;
        break;
        case 'footer':
            sb_items = footer.items;
        break;                                  
    }

    for (var i = 0; i < sb_items.length; i++) {
    
        let item   = placement != 'right' ? sb_items[i].pname : sb_items[i].items[0].pname;
        let module = solution.Get (modules, 'pname',  item)
        if (!module[0]) {
      //      console.log ('sb_element exist but not in configuration file in ' + placement + ' ' + sb_items[i].id);
            table.push ([
                {id: 'modulename_' +  sb_items[i].id ,      type: 'label',  item: sb_items[i].id, title: 'module name'},
                {id: 'moduletype_' +  sb_items[i].id ,      type: 'label',  item: sb_items[i].type,   title: 'module type'},
                {id: 'moduleplacement_' +  sb_items[i].id , type: 'label',  item: placement,     title: 'module placement'},
                {id: 'moduleload_' +  sb_items[i].id ,      type: 'label',  item: 'static',     title: 'module load'},
                {id: 'moduleactive_' +  sb_items[i].id ,    type: 'label',  item: '-----'},
                {id: 'moduleloaded_' +  sb_items[i].id ,    type: 'link',   icon: sb_icons['icon_check']}                
            ])
        } else {
            if (!module[0].active) {            // 2 cases can be added in main program dynamically or statically
                let index = module[1]
                
                if (solution.Get(solution.modules[placement], 'pname',  item)[0]) {
                    table[index][3].item = 'static/dynamic'    
                    table[index][5].class = ''    
    //             console.log ('sb_element exist and loaded dynamically in ' + placement + ' program ' + item);

                } else {
                    table[index][3].item = 'static'    
                    table[index][5].class = ''    
                    table[index][4].attributes = {disabled: true}    
        //           console.log ('sb_element exist and loaded statically in ' + placement + ' ' +  item);
                } 
            } 
        }
    }

    let sb_table   = window['solution_' + placement + 'Panel'].items[1]
    sb_table.rows = [];
    
    for (var i = 0; i < table.length; i++) {
        let row = table[i];
        let sb_row = row.map ((index) => { return sb.render (index)});
        sb_table.rows.push (sb_row)
    }
    sb.table_setrows (sb_table, sb_table.rows)
}

function solution_module_update (module, placement) {
    var tcontent = '';
    var j = 0;    
    
    let table   = []
    let modules = solution.modules[placement]    
   
 
    $('#moduleload_' + module.pname).removeClass ('spinner-border').html('dynamic')
    
    let sb_items;

    switch (placement) {
        case 'header':
            sb_items = header.items;
        break;
        case 'right':
            sb_items = right.items[0].items;
        break;  
        case 'main':
            sb_items = main.items;
        break;
        case 'left':
            return;
        break;
        case 'footer':
            sb_items = footer.items;
        break;                                  
    }

    if (module.active) {            // 2 cases can be added in main program dynamically or statically

        if (module.type == 'root') {
            solution.ui.platform_select(module.pname);                
        }
        $('#moduleactive_' + module.pname).prop('checked', true); 
        $('#moduleloaded_' + module.pname).removeClass('sb_none');         
    } else {
        if (module.type == 'root') {
            //should select previous platform 

            solution.ui.platforms   = solution.ui.sb.get(solution.ui.sb.interface, 'type', 'root');    // select the last one
            if (solution.ui.platforms.length != 0) {
                solution.ui.platform_select(solution.ui.platforms[0].pname)
            } else {
                solution.ui.currentplatform_pname  = null;
                solution.ui.currentplatform        = null;            

            }
        }                     
        $('#moduleactive_' + module.pname).prop('checked', false); 
        $('#moduleloaded_' + module.pname).addClass('sb_none');         
    }

}

function solution_module_addremove (pname, add) {
    if (add) {
        solution.add_module(pname);     
    } else {
        solution.remove_module(pname);      
    }
}

function onclick_moduleactive( elt, event) {
     
    let pname = elt.id.replace ('moduleactive_', '')

    let checked = $(elt).prop('checked');    
    $('#moduleload_' + pname).html('')       
    $('#moduleload_' + pname).addClass ('spinner-border')    
    if (checked) { 
        //solution.add_module(pname);            
        setTimeout(solution_module_addremove, 500, pname, 1)
    } else {
        //solution.remove_module(pname); 
        setTimeout(solution_module_addremove, 500, pname)
    }
    return false;    
}

var Counter = 0;

function openPopupSolutionSettings() {
    Counter = 0;    
    sb.modal ({
         id: 'popupsolutionsettings', 
         header: 'Solution', 
         width: 800,
         height: 380,
         resizable: true,
         static: true,
         onopen : function () {
            solution_treefromJSON(solution_tree, 'solution', solution.basic);
            sb.update(solution_tree);
         }, 
         body: sb.render (solution_treepanel), 
         footer: '<button class="sb_mbutton"   data-bs-dismiss="modal">Cancel</button>' 
     });    
 }

function onclick_solution_settings (event) {
    onclick_rightsidebarmenu('rightsidebar_solution')
}



function solution_labelpanel () {
    var content = '';

    content = 
'       <div class="labelexplain">' +
'           <p>WARNING : If an Existing Project is already running on the terminal, it will close all existing orders and it will start a new session with this project. Assure You stopped all your strategies before.</p>' +
'       </div>';
    return content
}

//------------------------------------------------------------------- SOLUTION TREE ---------------------------------------------------------------

function solution_treenodeitem (name, linktype, datatype, objecttype, classname) {
    return {
        id:   'treenode-' + datatype + Counter++,
        type: linktype,
        item: name, 
        closed: true,
        icon: icon_file,
        class: 'treenode, sb_end',
        arrow: linktype != 'tree' ? false : true,        
    }    
}

function solution_treefromJSON (treenode, datakey, data) {
    var object = null;

    var datatype = typeof data;
    var objecttype = '';
       
    if (!js_datatypes.includes(datatype)) {
        console.log ('DATA TYPE UNDEFINED ' + datatype);
    } 
  
    switch (datatype) {

        case 'object': 
            objecttype = js_objecttype(data);

            if (!js_objectypes.includes(objecttype)) {
                console.log ('OBJECT TYPE IS A DEFINED CLASS ' + datatype + '  :  ' + objecttype);                
            }    
          
  
            var sonnode;
            switch (objecttype) {
                case 'SpeechSynthesisUtterance':
                case 'SpeechSynthesisVoice':
                case 'SpeechSynthesis':     
                case 'SpeechRecognition':
                case 'MediaDevices':
                case 'InputDeviceInfo':
                case 'MediaDeviceInfo':                              
                    sonnode = solution_treenodeitem(datakey, 'tree', datatype, objecttype,  (data.constructor.name != 'Object' ? data.constructor.name : null));
                    sb.tree_additem(treenode.id, sonnode);                      
  
                    for (const key in data) {
                          solution_treefromJSON(sonnode, key, data[key])
                        
                    }
                break;                
                case 'Object':
                    sonnode = solution_treenodeitem(datakey, 'tree', datatype, objecttype,  (data.constructor.name != 'Object' ? data.constructor.name : null));
                    sb.tree_additem(treenode.id, sonnode);                      


                    for (const key in data) {
                        solution_treefromJSON(sonnode, key, data[key])
                        
                    }
                break;
                case 'Array':
                    sonnode = solution_treenodeitem(datakey,  'tree',  datatype, objecttype)
                    sb.tree_additem(treenode.id, sonnode);   

                    for (var i = 0; i < data.length; i++) {
                        solution_treefromJSON(sonnode, '[' + i + ']', data[i])
                    }

                    break;
                case 'Date':
                    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;         
                case 'RegExp':
                    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;  
                case 'Null':
                    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;       
                case 'HTMLDocument':
                    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;                          
                default:
                    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                    console.log ('What is this Object Type?');
                break;                   
            }
        break;
        case'function':
        //    sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
        break;            
        case'string':
        case'number':
        case'bigint':
        case'boolean':
        case'object':
        case'symbol':
        case'undefined':
            sb.tree_additem(treenode.id, solution_treenodeitem(datakey + '  :  ' + data, 'link', datatype));  
        break;        
        default:
            console.log ('What is this Data Type?');
        break;     
    }      
}
