const aceditors = []

function GetEditorFromId(id) {
    for (var i = 0; i < aceditors.length; i++) {
        if (aceditors[i].Id == id) return aceditors[i];
    }
    return null;
}


class aceeditor {
    constructor (id, theme, mode) {
        ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6");
        this.Id = id;
        this.aceEditor = null;
        this.aceSessions = null;
        this.Theme = theme;
        this.Mode = mode;
        this.currentSession = ace.createEditSession("", mode);
        this.Options = {};
        this.programchanged = 0;
        this.Commands = [];
        this.Markers  = [];
        aceditors.push (this)
    }
    setMode () {
        //console.log ('set mode   .........................................')
        if (!this.currentSession.$modes[this.Mode]) return;
        this.currentSession.$modes[this.Mode].$tokenizer = null;
        this.currentSession.$modes[this.Mode].$highlightRules = null;
        this.currentSession.setMode("");
        this.currentSession.setMode(this.Mode);
    }
    getValue () {
        return this.currentSession.getValue();
    }
    setValue (value, cursorpos) {
        try {
            //cursorPos	Number	
            //Required. Where to set the new value. undefined or 0 is selectAll, -1 is at the document start, and 1 is at the end
            this.programchanged = 1;
            this.currentSession.setValue(value, cursorpos);
        } catch (error) {}
        if ($('#' + this.Id). children().length == 0) {
            var editor;
            var iddefined = true;
            try {
                editor = ace.edit(this.Id);
            } catch (error) {
                iddefined = false;
            }
            if (iddefined) {
                editor.setTheme(this.Theme);
                editor.setSession(this.currentSession);
                editor.getSession().setMode(this.Mode);
                editor.setOptions(this.Options);
                //            editor.renderer.setShowGutter(false);		
                this.aceEditor = editor;
                for (var i = 0; i < this.Commands.length; i++) {
                    editor.commands.addCommand(this.Commands[i]);       
                }
            }
        }
    }
    reset () {
        this.aceEditor = null;
    }
    refresh () {
        if (document.getElementById(this.Id)) {
            this.setValue(this.getValue(), -1);
        }
    }
    resize () {
        if (this.aceEditor) {
            this.aceEditor.resize();
        }
    }

    setOptions (options) {
        this.Options = {...this.Options, ...options};
        if (this.aceEditor) {
           this.aceEditor.setOptions(this.Options);
        }
    }
    
    addCommand (option) {
        this.Commands.push(option);        
    }
    gotoEnd () {
        let row     = this.currentSession.getLength() - 1
        let column  = this.currentSession.getLine(row).length // or simply Infinity
        this.aceEditor.gotoLine(row + 1, column)    
    }    
    getSelection (){
        return this.currentSession.doc.getTextRange(this.aceEditor.selection.getRange());
    }

    addMarker (rowStart, columnStart, rowEnd, columnEnd) {
        var Range = ace.require('ace/range').Range 
        let range = new  Range(rowStart, columnStart, rowEnd, columnEnd);
        let marker = this.currentSession.addMarker(range, "ace_error_selected", "text", 1);        
        this.Markers.push (marker);
        this.refresh();
    }
   
    removeMarker (marker) {
        for (var i = 0; i < this.Markers.length; i++) {
            if (this.Markers[i]== marker) {
                this.Markers.splice(i, 1);
                this.currentSession.removeMarker(marker);
            }
        }
    }
    removeAllMarkers () {
        for (var i = 0; i < this.Markers.length; i++) {
            this.currentSession.removeMarker(this.Markers[i]);
        }
        this.Markers = []
    }
}