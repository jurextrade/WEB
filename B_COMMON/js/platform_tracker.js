function onclick_tracker_addindicator (elt) {
    openPopupIndicator (null, 'tracker_addindicator()', false);
}

function onclick_tracker_selectindicator (elt, event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    console.log ('tracker indicator click')
    openPopupPickerIndicator(event, 'marketpanel', undefined, 'onclick_selectsignalindicator(this, event, \'' + platform.pname + '\')');
}

function onclick_trackerdeleterow (elt, event, row) {
    event.stopPropagation();
    $(elt).closest('tr').remove();     
}
 
function onclick_trackermarker (elt, row) {
    var symbolcanvas = solution.GetCanvasFromTerminal();

    if (!symbolcanvas) {
        return;
    }    

    var symbol       = symbolcanvas.CurrentSymbol;

    if (!symbol) {
        return;
    }

    let tablerow = elt.parentElement
    let trid = tablerow.id
    
    let rows = trid.split ('_');

    let tableid = rows[0] + '_' + rows[1];

    var scstsring = GetSCStringFromTableRow (tableid, row);
        
    var marker = Marker_Run (CreateMarker ('marker_' + symbolcanvas.MarkerNbr, scstsring, 'Boolean'));	
    
    let mcolor = MarkerColors[marker.Id]

    $('#' + trid).css("background-color", mcolor);
    $('#' + trid).css("color", "white");     
   // tools_panel_remove();          
}

function onclick_tracker_reset(elt, event) {
    let ui          = solution.get('ui') 
    let marketpanel =  ui.sb.get(main, 'pname', 'market')[0];
    let tableid     = $('#' + marketpanel.id + ' .trackertable').attr('id');
    let table       = sb.get(marketpanel, 'id', tableid)[0];  ;    
    sb.table_clear (table)
}

function tracker_load () {
    let ui  = solution.get('ui')     
    let marketpanel =  ui.sb.get(main, 'pname', 'market');

    if (marketpanel.length == 0) {
        solution.add_module('market');  
    }   
}

function tracker_update (terminal) {
// market      
    let ui  = solution.get('ui')     



    marketpanel =  ui.sb.get(main, 'pname', 'market') 
    marketpanel = marketpanel[0]
    tools_panel_select(1)


    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return null;  
    let tableid         = $('#' + marketpanel.id + ' .trackertable').attr('id');
    let table           = sb.get(marketpanel, 'id', tableid)[0];  ;

/*    
    let platform = ui.platform_get ('pname', ui.currentplatform_pname); 
    let tableid         = $('#' + platform.id + ' .trackertable').attr('id');
    let table           = sb.get(platform, 'id', tableid)[0];  ;
*/
    sb.table_clear(table);

//    $('#' + panelid).css('display', 'flex');
//    sb.resize(chartpanel);

    var trackobjects = symbolcanvas.TrackObjects;
    
    for (var i = 0; i < trackobjects.length; i++) {
        var trackobject = trackobjects[i];

        tracker_addrow (table, i, 
                            trackobject.object, 
                            trackobject.signalname,
                            1 << symbolcanvas.CurrentPeriod,
                            AlertOperationMenu[0].text,
                            '0',  //not
                            '0',  //prev
                            AlertTypeMenu[0].text,
                            AlertOpValueMenu[2].text,
                            trackobject.value,
                            trackobject.signaltype);
    }

    sb.table_setrows (table, table.rows)

//    $('#' + panelid +' td:nth-child(1)').attr('draggable', 'true');   
//    $('#' + panelid +' td:nth-child(1)').attr('ondragstart', 'ondragstart_TrackerRow(this, event)');
/*
    sidebarpanel_show(platform, 'sidebarpanel_' + platform.pname + 'charttools ');  
    if ($('#boxtrackerpanel_' + platform.pname + ' #slide').hasClass ('rotate-180')) {              //closed
        $('#boxtrackerpanel_' + platform.pname + ' #slide').click()    
    }
*/    
}
    
function tracker_addrow (table, rownumber, object, signalname, periods, operatorname, not, previous, typename, opvalue, value, signaltype, beginning) {
 
    var signals         = GetSignalsFromObject (object);
    
    var colname = table.columns;
    var i = 1;
    var rowtoadd = [];
   // rowtoadd.push (sb.render({id: 'signal_dragbutton_' + rownumber  + '\'', type: 'link', class: 'draggableicon  sb_transform', events: { onmousedown : "onmousedown_TrackerDrag (this," + "'" + rownumber + "')"}, icon: icon_ellipsis, title: 'Dragging'} ))
    rowtoadd.push (sb.render({id: 'signal_markerbutton_' + rownumber  + '\'', type: 'link', class: 'sb_transform', events: { onclick : "onclick_trackermarker (this," + "'" + rownumber + "')"}, icon: icon_eye, title: 'Show on chart'} ))

    rowtoadd.push ('<div id = "' + table.id +   '_' + rownumber + '_' + colname[i++] + '" class="objectname" onclick="openPopupObject(\'' + object.Name + '\')">' + object.Name + '</div>');
    rowtoadd.push (SignalsMenuPanel (table.id +   '_' + rownumber + '_' + colname[i++] , signals, signalname));
    rowtoadd.push (signaltype == 'Numeric' ? sb.select (table.id +   '_' + rownumber + '_' + colname[i++], 'typemenu', AlertOpValueMenu, opvalue) : '<input id="' + table.id +   '_' + rownumber + '_' + colname[i++] + '" class="form-control" type="text" value="" readonly/>');
    rowtoadd.push (signaltype == 'Numeric' ? '<input id="' + table.id +   '_' + rownumber + '_' + colname[i++] + '" class="form-control" type="text" value="' + value + '"/>' :  '<input id="' + table.id +   '_' + rownumber + '_' + colname[i++] + '" class="form-control" type="text" value="" readonly/>');
      
    rowtoadd.push (sb.checkbox(table.id + '_' + rownumber + '_' + colname[i], (previous == '1' ? 1 : 0))); i++;
    rowtoadd.push (sb.select (table.id +   '_' + rownumber + '_' + colname[i++], 'typemenu',      AlertTypeMenu,      typename));
    rowtoadd.push (sb.select (table.id +   '_' + rownumber + '_' + colname[i++], 'operatorsmenu', AlertOperationMenu, operatorname));

    
    for (var j = 0; j <= PeriodName.length; j++) {
        let oattributes = {};
        if  (periods  && (periods & (1 << j))) {
            oattributes.checked = ''
        }
        rowtoadd.push (sb.render({id: table.id + '_' + rownumber + '_' + colname[i], type: 'checkbox', attributes: oattributes}));            
        //rowtoadd.push (sb.checkbox(table.id + '_' + rownumber + '_' + colname[i],  (periods  && (periods & (1 << j)))));
        i++;
    }
           
  
   rowtoadd.push (sb.render({id: 'signal_deletebutton_' + rownumber  + '\'', type: 'link', class: 'sb_transform', events: { onclick : "onclick_trackerdeleterow (this, event, " + "'" + rownumber + "')"}, icon: icon_close, title: 'Delete row'} ))

   if (defined (beginning)) {
       table.rows.unshift (rowtoadd);
   } else {
       table.rows.push (rowtoadd);
   }
   return rowtoadd;    
}

function tracker_insert (objectname, signalname) {    
    let ui          = solution.get('ui') 
    let marketpanel =  ui.sb.get(main, 'pname', 'market')[0];
    let tableid     = $('#' + marketpanel.id + ' .trackertable').attr('id');
    let table       = sb.get(marketpanel, 'id', tableid)[0];  ;

    let PG                = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }
    let object          = PG.GetObjectFromName (objectname);
    if (!object) {
        return;
    }
    var signals         = GetSignalsFromObject (object);
    var signal          = GetSignalFromSignalName (signals, signalname);    
   
    if (!signal) {
        return;
    }
    
    var tooltip         = signal.description;
    var signaltype      = signal.type;

    var periods         = (1 << P_H1);    
    var operatorname    = 'OR';
    var not             = '0';
    var previous        = '0';
    var typename        = 'ANY BAR';
    var opvalue         =  signal.type == 'Boolean' ? '----' : AlertOpValueMenu[0].text;
    var value           = '';

    var id              = table.id;
    var rownumber       = table.rows.length;
    
    var rowtoadd = tracker_addrow (table, 
        rownumber, 
        object, 
        signalname, 
        periods, 
        operatorname, 
        not, 
        previous, 
        typename, 
        opvalue, 
        value, 
        signaltype, 
        true)

    var rowcontent = '<tr id= "' + id +  '_' + rownumber  + '" title="' + tooltip + '">';
      
    for (var j = 0; j < table.columns.length; j++) {
        rowcontent += '<td id= "' + id + '_' + rownumber + '_'  + j + '">' + rowtoadd[j] + '</td>';
    }
    rowcontent += '</tr>';               
 
    $('#' + id + ' tbody').prepend (rowcontent);    
}

function tracker_addindicator () {
    var result = NewIndicator ();

    if (!result || result == -1) {
        return;
    }

    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    let object      = result[0];
    let signalname  = result[1];
    //tracker_insert (object.Name, signalname, 'trackertable_' + platform.pname);
    tracker_insert (object.Name, signalname);
}


function onmouseover_trackertable(elt, event) {
    let trid = elt.id

    let ent = trid.split ('_');
    let rowindex = ent[2];
    let tableid = ent[0] + '_' + ent[1];
    //let table = sb.get (sb.interface, 'id', tableid)[0]
    
    let signaltitle = $('#' + tableid  + '_' + rowindex + '_' + 'Signal').find(":selected").attr('title');
    $(elt).attr('title', signaltitle)
}

