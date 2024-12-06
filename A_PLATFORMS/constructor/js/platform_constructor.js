//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function constructor_init () {
    constructor_jsoneditor_init('constructor_jsoneditor');    
    constructor_gse_init (constructor_gse.id);
    constructor_update(solution.configuration);
}

function constructor_end () {
}

//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//

function constructor_select (name) {

    let ui  = solution.get('ui')    

// market          
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    ui.platform_expand(name, true);
}

function constructor_timer () {

}



function constructor_update (jsonstruct) {
    constructor_jsoneditor_update (jsonstruct)  
    constructor_gse_update (jsonstruct)    
    constructor_jsontree_update (jsonstruct) 
}

function constructor_jsontree_update (jsonstruct) {
    sb.tree_removechildren(constructor_jsontree_editor.id);
   
    constructor_SBtreefromJSON(constructor_jsontree_editor, 'root', jsonstruct);
}

/*---------------------------------------------------------------- JSON ----------------------------------------------------------------*/

function constructor_display_sjson (content) {
    var jsonstruct = JSON.parse(content);
    constructor_update(jsonstruct);    
}

function onclick_jsonloadfile(elt, event) {
    js_jsonparse_fromfile (constructor_display_sjson);
}

var Counter = 0;

function constructor_SBtreenodeitem (name, linktype, datatype, objecttype, classname) {
    var array_items = [];
    array_items.push ({id: 'datatype_tree',  type: 'text',    item: 'datatype',    icon: '', value: datatype, disabled:true});

    if (objecttype) {
        array_items.push ({id: 'objecttype_tree',  type: 'text',    item: 'objecttype',    icon: '', value: objecttype, disabled:true});  
        if (classname != null) {
            array_items.push ({id: 'class_tree',  type: 'text',    item: 'class',    icon: '', value: classname, disabled:true});  
        }
    }
    return {
        id:   'treenode-' + datatype + Counter++,
        type: 'tree',
        item: name , 
        class: 'treenode, sb_end',
   //     rootitem: {id: 'types_tree', type: 'bar', class:'sb_end', items : array_items},
        arrow: linktype != 'tree' ? false : true,        
    }    
}

function constructor_SBpanelnodeitem (datakey, data, datatype) {
    var sbtype = 'text';
    var sbitem = {};
    
    switch (datatype) {
        case'string':
            sbtype = 'text';
        case'number':
            sbtype = 'int';
        case'bigint':
        case'boolean':
        case'object':
        case'symbol':
        case'undefined':
        case'null':
        case'function':
        break;
    }

    sbitem.id     =  'panelnode-' + datatype + Counter++; 
    sbitem.class  =  datakey != '' ? '' : '';  
    sbitem.type   = sbtype;
    sbitem.value  = data;

    if (datakey != '') {
        sbitem.item = datakey
    }

    return sbitem;
}

function constructor_SBtreefromJSON (treenode, datakey, data) {
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
                case 'Object':
                    sonnode = constructor_SBtreenodeitem(datakey + '  :  ' + objecttype, 'tree', datatype, objecttype,  (data.constructor.name != 'Object' ? data.constructor.name : null));
                    sb.tree_additem (treenode.id, sonnode);                      


                    var keys = Object.keys(data);
                    for (var index = 0; index < keys.length; index++) {
                        let key = keys[index];
                        constructor_SBtreefromJSON(sonnode, key, data[key])
                        
                    }
                break;
                case 'Array':
                    sonnode = constructor_SBtreenodeitem(datakey + '  :  ' + objecttype,  'tree',  datatype, objecttype)
                    sb.tree_additem (treenode.id, sonnode);   

                    for (var i = 0; i < data.length; i++) {
                        constructor_SBtreefromJSON(sonnode, '', data[i])
                    }

                    break;
                case 'Date':
                    sb.tree_additem (treenode.id, constructor_SBtreenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;         
                case 'RegExp':
                    sb.tree_additem (treenode.id, constructor_SBtreenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;  
                case 'Null':
                    sb.tree_additem (treenode.id, constructor_SBtreenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;       
                case 'HTMLDocument':
                    sb.tree_additem (treenode.id, constructor_SBtreenodeitem(datakey + '  :  ' + data, 'link', datatype));  
                break;                          
                default:
                    console.log ('What is this Object Type?');
                break;                   
            }
        break;
        case'string':
        case'number':
        case'bigint':
        case'boolean':
        case'object':
        case'symbol':
        case'undefined':
        case'function':
            sb.tree_additem (treenode.id, constructor_SBpanelnodeitem(datakey, data, datatype));  
        break;        
        default:
            console.log ('What is this Data Type?');
        break;     
    }      
}



