var netprog_js_editor_input = null;
var netprog_js_editor_output = null;

function netprog_jseditor_init (inputid, outputid) {
    netprog_jseditor_input_init (inputid) 
    netprog_jseditor_output_init(outputid)    
}

function netprog_jseditor_update () {
    netprog_jseditor_input_update ('');
    netprog_jseditor_output_update ('');    
}

function netprog_jseditor_select () {
    netprog_jseditor_input_select () 
}

function onclick_netprog_jseditor_group (elt, event) {

    switch (elt.id) {
        case 'export_marker':
            saveAs_LocalFile ('text/javascript', netprog_js_editor_input.getValue())
        break;      
        case 'upload_marker':
            read_LocalFile('text/javascript', function (file, content) {
                netprog_js_editor_input.setValue(content)
            });
        break;     
        case 'eval_marker':
            netprog_jseditor_input_oneval();
        break;              
    }

}

/////////////////////////////////////////////////////////  INPUT  ///////////////////////////////////////////////////////////////////

function netprog_jseditor_input_resize (id) {
    if(netprog_js_editor_input) {
        netprog_js_editor_input.resize()
    }  
}



function netprog_jseditor_input_init (id) {
    netprog_js_editor_input = new aceeditor(id, "ace/theme/nord_dark", "ace/mode/jsx");      
    netprog_js_editor_input.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });    
    netprog_js_editor_input.addCommand({
        name: 'evalJS',
        bindKey: {
            win: 'Alt-E',
            mac: 'Alt-E',
            sender: 'editor|cli'
        },
        exec: netprog_jseditor_input_oneval
        });
    
}

function netprog_jseditor_input_update () {
       netprog_js_editor_input.setValue ('');
}

function netprog_jseditor_input_select () {
}

function netprog_jseditor_input_getcontent () {
    var selected = netprog_js_editor_input.getSelection();
    if (selected == '') {
        selected = netprog_js_editor_input.getValue()
    }
    return selected;
}

function netprog_jseditor_input_oneval (env, args, request) {
    if (defined (env)) {
        var start = env.curOp.selectionBefore.start;
        var end = env.curOp.selectionBefore.end;

    // var selected = netprog_js_editor_input.aceEditor.getSession().doc.getTextRange(netprog_js_editor_input.aceEditor.selection.getRange());
    }
    netprog_jseditor_input_eval (netprog_jseditor_input_getcontent ());    
}

function netprog_jseditor_input_eval (jscontent) {
    try {
        netprog_jseditor_output_clear();        
        window.eval(jscontent); 
    } catch (error) {
        if (error instanceof SyntaxError) {
            netprog_js_editor_output.setValue('SyntaxError: ' + error.message);
        } else 
        if (error instanceof ReferenceError) {
            netprog_js_editor_output.setValue('ReferenceError: ' + error.message);
        } else 
        if (error instanceof RangeError) {
            netprog_js_editor_output.setValue('RangeError: ' + error.message);
        } else 
        if (error instanceof TypeError) {
            netprog_js_editor_output.setValue('TypeError: ' + error.message);
        } else 
        if (error instanceof URIError) {
            netprog_js_editor_output.setValue('URIError: ' + error.message);
        } else 
        {
            netprog_js_editor_output.setValue('com on mannnn : ' + error.message);            
          //  throw error;
        }
    }

}

////////////////////////////////////////////////////////////  OUTPUT  ///////////////////////////////////////////////////////////////////

function netprog_jseditor_output_resize (id) {
    if(netprog_js_editor_output) {
        netprog_js_editor_output.resize()
    }  
}


function netprog_jseditor_output_init (id) {
    netprog_js_editor_output = new aceeditor(id, "ace/theme/nord_dark", "ace/mode/jsx");      
    netprog_js_editor_output.setOptions( {
        showPrintMargin: false,        
        readOnly: true,        
        showLineNumbers: false,
        showGutter: false
    });    

    netprog_js_editor_output.addCommand({
        name: 'clearJS',
        bindKey: {
            win: 'Alt-C',
            mac: 'Alt-C',
            sender: 'editor|cli'
        },
        exec: netprog_jseditor_output_clear
        });
}

function netprog_jseditor_output_clear (env, args, request) {
    if (defined (env)) {
        var start = env.curOp.selectionBefore.start;
        var end = env.curOp.selectionBefore.end;
    }
    netprog_js_editor_output.setValue('');  

}

function netprog_jseditor_output_update () {
    netprog_js_editor_output.setValue ('');
}
