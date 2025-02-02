function onclick_emv_database_treenode(elt, event) {
    switch (elt.id) {
        case 'emv_database_tree_aid' : 
            emv_aidspanel_update();
        break;       
        case 'emv_database_tree_tags' :       
            emv_tagspanel_update();   
        break;       

        case 'emv_database_tree_apdu' :       
            emv_capdupanel_update();
        break;       
        case 'emv_database_tree_bankcode' :   
        break;       

        case 'emv_database_tree_currencycode' :    
        break;       

    }

}

//---------------------------------------------------------   TAGS PANEL    -------------------------------------------------------------     

function emv_tagspanel_update () {
    if (!sb.tab_finditem(emv_maintabs, 'emv_tags_tab')) { 
        let filetabitem    = {id: 'emv_tags_tab',     item: 'TAGS',    type:'link', icon:  icon_structure,  items: [emv_tagspanel],  onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'List of Tags',   events: {onclick:"onclick_emv_tab(this)"}}
        sb.tab_additem(emv_maintabs, filetabitem);
    
        $('#emv_tags_table').removeAttr('width').DataTable({
            'serverMethod': 'post',
            'ajax': {
                'url':'/php/get_table.php?tablename=' + 'gtags', 
                'contentType': 'application/json; charset=utf-8',       
            },
            fixedColumns: false,   
            autoWidth: true,
            resizableColumns: true,    
            scrollY:        true,
            scrollX:        true,
            scrollCollapse: true,
            paging:         false,       
            rowCallback: function(row, data, index) {
                $(row).addClass(data.Origin);
            },               
            columnDefs: [
                {title: "Tag",           width: 200, targets: 0 },
                {title: "Name",          width: 300, targets: 1 },
                {title: "Origin",        width: 100, targets: 2 },
                {title: "Description",   width: 500, targets: 3 },
                {title: "Template",      width: 50, targets: 4 },
                {title: "Format",        width: 50, targets: 5 },
                {title: "Length(min)",   width: 50, targets: 6 },
                {title: "Length(max)",   width: 50, targets: 7 },
                {title: "P/C",           width: 50, targets: 8 },
            ],
            columns: [
            {name: "Tag",           data: 'Tag' },
            {name: "Name",          data: 'Name' },
            {name: "Origin",        data: 'Origin'},
            {name: "Description",   data: 'Description' },              
            {name: "Template",      data: 'Template' },          
            {name: "Format",        data: 'Format'},
            {name: "Length(min)",   data: 'Length(min)'},
            {name: "Length(max)",   data: 'Length(max)'},
            {name: "P/C",           data: 'P/C' },    
                                                                
            ]
            
        });  
    }
    $('#emv_tags_table_filter .sb_sidebarheadertitle').html('TAGS LISTING')        
    sb.tab_select(emv_maintabs, 'emv_tags_tab');
}

//----------------------------------------------------   AIDS PANEL    ------------------------------------------------   

function emv_aidspanel_update () {
    if (!sb.tab_finditem(emv_maintabs, 'emv_aid_tab')) { 
        let filetabitem    = {id: 'emv_aid_tab',      item: 'AID',    type:'link', icon:  icon_structure,  items: [emv_aidspanel],  onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'List of AIDS',   events: {onclick:"onclick_emv_tab(this)"}}
        sb.tab_additem(emv_maintabs, filetabitem);

        $('#emv_aids_table').removeAttr('width').DataTable({
            'serverMethod': 'post',
            'ajax': {
                'url':'/php/get_table.php?tablename=' + 'aids', 
                'contentType': 'application/json; charset=utf-8',       
            },
            fixedColumns:       true,   
            autoWidth:          false,
            resizableColumns:   true,    
            scrollY:            true,
            scrollX:            true,
            scrollCollapse:     true,
            paging:             false,       
            rowCallback: function(row, data, index) {
                $(row).addClass(data.Origin);
            },               
            columnDefs: [
                {title: "Type",          width: 100, targets: 4 },
                {title: "PIX",           width: 100, targets: 2 },
                {title: "AID",           width: 200, targets: 0 },
                {title: "RID",           width: 100, targets: 1 },
                {title: "Vendor",                    targets: 3 },
                {title: "Name",                      targets: 5 },
                {title: "Country",                   targets: 6 },
                {title: "Description",               targets: 7 },
            ],
            columns: [
                {name: "AID",           data: 'AID' },              
                {name: "RID",           data: 'RID' },
                {name: "PIX",           data: 'PIX'},
                {name: "Vendor",        data: 'Vendor' },          
                {name: "Type",          data: 'Type' },
                {name: "Name",          data: 'Name'},
                {name: "Country",       data: 'Country'},
                {name: "Description",   data: 'Description'},
                ]
        });  
    }
    $('#emv_aids_table_filter .sb_sidebarheadertitle').html('APPLICATION INDENTFIER (AID)')            
    sb.tab_select(emv_maintabs, 'emv_aid_tab');
}

//----------------------------------------------------   CADUP PANEL    ------------------------------------------------  

function emv_capdupanel_update () {
    if (!sb.tab_finditem(emv_maintabs, 'emv_apdu_tab')) { 
        let filetabitem    = {id: 'emv_apdu_tab',     item: 'APDU',      type:'link', icon:  icon_structure,  items: [emv_apdumainpanel],  onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'APDU Structure', events: {onclick:"onclick_emv_tab(this)"}}             
        sb.tab_additem(emv_maintabs, filetabitem);    

        $('#emv_capdu_table').removeAttr('width').DataTable({
            'serverMethod': 'post',
            'ajax': {
                'url':'/php/get_table.php?tablename=' + 'cadpu',  
                'contentType': 'application/json; charset=utf-8',       
            },
            fixedColumns: true,   
            autoWidth: false,
            resizableColumns: true,    
            scrollY:        true,
            scrollX:        true,
            scrollCollapse: true,
            paging:         false,       
            rowCallback: function(row, data, index) {
                $(row).addClass(data.Origin);
            },               
            columnDefs: [
                {title: "CLA",           width: 30, targets: 0 },
                {title: "INS",           width: 30, targets: 1 },
                {title: "P1",            width: 20, targets: 2 },
                {title: "P2",            width: 20, targets: 3 },
                {title: "LC",            width: 20, targets: 4 },
                {title: "LE",            width: 20, targets: 5 },
                {title: "Name",          targets: 6 },            
            ],
            columns: [
                {name: "CLA",           data: "CLA",},
                {name: "INS",           data: "INS",},
                {name: "P1",            data: "P1", },
                {name: "P2",            data: "P2", },
                {name: "LC",            data: "LC", },
                {name: "LE",            data: "LE", },
                {name: "Name",          data: "Name"},                   
            ]
            
        });  
        emv_sw1sw2panel_update ()            
    }
    $('#emv_capdu_table_filter .sb_sidebarheadertitle').html('APDU COMMANDS')       
    sb.tab_select(emv_maintabs, 'emv_apdu_tab');
}      


//----------------------------------------------------   SW1SW2 PANEL    ------------------------------------------------  

function emv_sw1sw2panel_update () {
    $('#emv_sw1sw2_table').removeAttr('width').DataTable({
        'serverMethod': 'post',
        'ajax': {
            'url':'/php/get_table.php?tablename=' + 'sw1sw2',  
            'contentType': 'application/json; charset=utf-8',       
        },
        fixedColumns: true,   
        autoWidth: false,
        resizableColumns: true,    
        scrollY:        true,
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,       
        rowCallback: function(row, data, index) {
            $(row).addClass(data.Origin);
          },               
        columnDefs: [
            {title: "SW1",           width: 30, targets: 0 },
            {title: "SW2",           width: 30, targets: 1 },
            {title: "Info",          width: 20, targets: 2 },
            {title: "Description",   targets: 3 },
        ],
        columns: [
            {name: "SW1",           data: 'SW1' },
            {name: "SW2",           data: 'SW2' },
            {name: "Info",          data: 'Info'},
            {name: "Description",   data: 'Description' },              
        ]
        
      });  
      $('#emv_sw1sw2_table_filter .sb_sidebarheadertitle').html('APDU RESULTS')         
 }



