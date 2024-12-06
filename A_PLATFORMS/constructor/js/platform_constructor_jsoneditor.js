var constructor_json_editor = null;


function constructor_jsoneditor_init (id) {
    constructor_json_editor = new aceeditor(id, "ace/theme/gruvbox", "ace/mode/json");      
    constructor_json_editor.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });    
}

function constructor_jsoneditor_update (entity) {
    if (!entity) {
        console.log (nodename + ' not found');
    }
    else {
        const myJSON = JSON.stringify(entity, null, 2);
        constructor_json_editor.setValue (myJSON);
    }    
}

function constructor_jsoneditoror_select () {
}

function constructor_jsoneditor_resize (id) {
    if(constructor_json_editor) {
        constructor_json_editor.resize()
    }  
}
