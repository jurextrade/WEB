var netprog_json_editor = null;

function netprog_jsoneditor_init (id) {
    netprog_json_editor = new aceeditor(id, "ace/theme/gruvbox", "ace/mode/json");      
    netprog_json_editor.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });    
}

function netprog_jsoneditor_resize (id) {
    if(netprog_json_editor) {
        netprog_json_editor.resize()
    }  
}


function netprog_jsoneditor_update (entity) {
    if (!entity) {
        console.log (' not found');
    }
    else {
        const myJSON = JSON.stringify(entity, 
            function(k,v){
                if(k !== "props" && k !== 'Socket'){
                    return v;
                }}, 2);
        netprog_json_editor.setValue (myJSON);
    }    
}

function netprog_jsoneditoror_select () {
}