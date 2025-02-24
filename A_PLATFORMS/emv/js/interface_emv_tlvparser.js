//--------------------------------------------------------------------- BYTES PANEL  --------------------------------------------------------------------

var emv_bytepanel = ((name, tag, entity, useroption) =>  {
    
    let defaultoption = {
        tabs : true,
        editable:true,
        withbar: true,
        class: '',
        bytetable: null,
        events: {}
    }
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let tabs     = option.tabs;
    let editable = option.editable;
    let withbar  = option.withbar;
    let bytetable    = option.bytetable;
    let items = [];

    for(var i= 0; i < entity.struct.length; i++) {
        tabs ? items.push ({id: name + '_bytetab_' + i,   cname: 'BYTE ' + (i + 1), item: 'BYTE ' + (i + 1),  type: 'link', 
                        items: [emv_byte(i, entity, tabs, bytetable)]}) :
               items.push (emv_byte(i, entity, tabs, bytetable)) 
               
    }

    let container = tabs ? 
    {
        id: 'emv_' + name + '_container', 
        type: 'tabs',    
        items : items,
    } :
    {
        id: 'emv_' + name + '_container', 
        type: 'panel',       
        class: 'sb_column',  
        items: items,
    } 

    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  bytepanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        struct: entity.struct,        
        events : option.events,   
        items:[        
            container,            
        ]
    }


    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {

                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname (tag),  class: 'sb_f_classic ', title: 'Tag: ' + tag},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: tag, events :{onmousedown: "emv_searchtag('" + tag + "', event)"} },                
                        ]
                    }, 
                    
                    {
                        id: 'emv_' + name + '_settingsgroup', 
                        type: 'group',                    
                        position: 'sb_end',
                        direction: 'row',
                        toggle : false,
                        items :
                            [     
                                {id: 'emv_' + name + '_type',         type: 'switch',  item: 'Flat', events: {onclick: "onclick_byteflatpanel (this, event)"}},
                            ]           
                    }
                ] 
            })
    }
    return panel;
})

var emv_byte = ((index, entity, tabs, bytetablefunc) =>  {return {
    id: 'emv_byte_' + index,
    type: 'panel',            
    class:'sb_column',
    style: "padding:0px;overflow: hidden;",     
    items : [
        {id: 'emv_description_' + index,  type: 'label',  style: tabs ? 'display:none;' : '', item: 'BYTE ' + (index + 1),  class: 'tagheader'},  
        bytetablefunc ? bytetablefunc(index, entity.struct[index]) : emv_bytetable(index, entity.struct[index]),
    ] 
}})

var emv_bytetable = ((id, desc) =>  {
    
    let tablerows = [];
    let titlerows = [];
    let stylerows = []
    for (var i = 0; i < desc.length; i++) {
        desc[i].type ?  tablerows.push(['x','x','x','x','x','x','x','x',desc[i].item]) : tablerows.push([0,0,0,0,0,0,0,0,desc[i].item]);
        titlerows.push (desc[i].item);
        desc[i].type ? stylerows.push ("background: var(--theme-hover-bg-color); color: var(--theme-hover-color);") : stylerows.push("");
    }

    return {
        id: 'emv_bytetable_' + id,
        type: 'table',            
        class:'emvbyte',
        events: {onclick: "onclick_emv_byte(this, event)"},
        columns :  ['b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2', 'b1', 'description'],
        columnstitle : ['bit 8', 'bit 7', 'bit 6', 'bit 5', 'bit 4', 'bit 3', 'bit 2', 'bit 1', 'description'],
        rowstitle : titlerows,  
        rowsstyle: stylerows,          
        rows : tablerows,
    }
}
)

var emv_cidbytetable = ((id, desc) =>  {
    
    let tablerows = [];
    let titlerows = [];
    let stylerows = []
    for (var i = 0; i < desc.length; i++) {
        titlerows.push (desc[i].item);
        desc[i].type ? stylerows.push ("background: var(--theme-hover-bg-color); color: var(--theme-hover-color);") : stylerows.push("");
    }
    console.log ('CIDDDDDDDDDDDDDDDDDDDDDDDDD')
    return {
        id: 'emv_bytetable_' + id,
        type: 'table',            
        class:'emvbyte',
        events: {onclick: "onclick_emv_byte(this, event)"},
        columns :  ['b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2', 'b1', 'description'],
        columnstitle : ['bit 8', 'bit 7', 'bit 6', 'bit 5', 'bit 4', 'bit 3', 'bit 2', 'bit 1', 'description'],
        rowstitle : titlerows,  
        rowsstyle: stylerows,          
        rows : [
            [0,0,'','','','','','',desc[0].item],
            [0,1,'','','','','','',desc[1].item],
            [1,0,'','','','','','',desc[2].item],
            [1,1,'','','','','','',desc[3].item],
            ['','','x','x','','','','',desc[4].item],
            ['','','','',0,'','','',desc[5].item],
            ['','','','',1,'','','',desc[6].item],
            ['','','','','','x','x','x',desc[7].item],
            ['','','','','',0,0,1,desc[8].item],
            ['','','','','',0,1,0,desc[9].item],
            ['','','','','',0,1,1,desc[10].item],
            ['','','','','',1,'x','x',desc[11].item],
        ]       
    }
}
)

//---------------------------------------------------------------------CVM PANEL  --------------------------------------------------------------------

function getCVRuleControl(t, e, a) {
    first = 63 & parseInt(t.substr(0, 2), 16),
    action = 64 & parseInt(t.substr(0, 2), 16) ? "Apply succeeding CV Rule" : "Fail cardholder verification",
    second = parseInt(t.substr(2, 2), 16);
    var n = {
        0: "Fail CVM processing",
        1: "Plaintext PIN verification performed by ICC",
        2: "Enciphered PIN verified online",
        3: "Plaintext PIN verification performed by ICC and signature (paper)",
        4: "Enciphered PIN verification performed by ICC",
        5: "Enciphered PIN verification performed by ICC and signature (paper)",
        30: "Signature (paper)",
        31: "No CVM required"
    }[first]
      , i = (void 0 === n && (n = "Unrecognized"),
    {
        0: "Always",
        1: "If unattended cash",
        2: "If not unattended cash and not manual cash and not purchase with cashback",
        3: "If terminal supports the CVM",
        4: "If manual cash",
        5: "If purchase with cashback",
        6: "If transaction is in the application currency and is under %X% value (implicit decimal point)",
        7: "If transaction is in the application currency and is over %X% value (implicit decimal point)",
        8: "If transaction is in the application currency and is under %Y% value (implicit decimal point)",
        9: "If transaction is in the application currency and is over %Y% value (implicit decimal point)"
    }[second]);
    return `<div class="sb_widget list-group-item-action ">
			<div class="sb_widget-title d-flex w-100 justify-content-between">
			<h6 class="mb-1">${n}</h6>
			<small class="text-muted">${t}</small>
			</div>
			<p class="mb-1">Condition: ${i = (i = void 0 === i ? "RFU or Reserved for use by individual payment systems" : i).replace("%X%", e).replace("%Y%", a)}</p>
			<small class="text-muted">If unsuccessful: ${action}</small>
		</div>`
}

function GetCVMLControl(t) {
    var e, 
        a = parseInt(t.substr(0, 8), 16),
        n = parseInt(t.substr(8, 8), 16);

    let buf = '<div class="sb_row sb_widget-container" >';
    for (e of t.substr(16).match(/.{4}/g))
        buf += getCVRuleControl(e, a, n);
    return buf += "</div>"
}

function emv_CVMPanel() {
    
    return `<div class="sb_widget list-group-item-action ">
    <div class="sb_widget-title d-flex w-100 justify-content-between">
    <h6 class="mb-1">${n}</h6>
    <small class="text-muted">${t}</small>
    </div>
    <p class="mb-1">Condition: ${i = (i = void 0 === i ? "RFU or Reserved for use by individual payment systems" : i).replace("%X%", e).replace("%Y%", a)}</p>
    <small class="text-muted">If unsuccessful: ${action}</small>
    </div>`
}

var emv_cvmpanel = ((name, value, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;

    let panel = {
        id: name, 
        type: 'html',  
        class: 'sb_column cvmpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',     
        events : option.events,           
        content: "emv_CVMPanel()"        
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F35'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F35'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F35', events :{onmousedown: "emv_searchtag('9F35', event)"} },                       
                        ]
                    } 
                ] 
            })
    }    
    return panel;    
})



//--------------------------------------------------------------------- TERMINAL TYPE PANEL  --------------------------------------------------------------------

var emv_ttpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;

    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column ttpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',     
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container', type: 'html',  style:"", content: 'emv_tt_panel("' +  (editable ? 'editable' : '') + '")'}    
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F35'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F35'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F35', events :{onmousedown: "emv_searchtag('9F35', event)"} },                       
                        ]
                    } 
                ] 
            })
    }    
    return panel;    
})



function emv_tt_panel (editable) {
    var content;
    content =
    `<table class="sb_table emvbyte ${editable}" width="523">
        <colgroup>
            <col style="mso-width-source:userset;mso-width-alt:1280;width:26pt">
            <col style="mso-width-source:userset;mso-width-alt:9508;width:128pt">
            <col style="mso-width-source:userset;mso-width-alt:4973;width:60pt">
            <col style="mso-width-source:userset;mso-width-alt:5266;width:60pt">
            <col style="mso-width-source:userset;mso-width-alt:5412;width:60pt">
        </colgroup>
        <tbody>
            <tr >
                <td colspan="2" rowspan="2" style="background-color: var(--theme-header-bg-color);color: var(--theme-header-color);">Environment</td>
                <td colspan="3" style="background-color: var(--theme-header-bg-color);color: var(--theme-header-color);">Operational Control Provided By:</td>
            </tr>
            <tr >
                <td id="10" class= "TT_value" >Financial Institution</td>
                <td id="20" class= "TT_value" >Merchant</td>
                <td id="30" class= "TT_value" >Cardholder</td>
            </tr>
            <tr >
                <td colspan="2" style="text-align:left;border-bottom:none;">Attended</td>
                <td style="border-bottom:none;"></td>
                <td style="border-bottom:none;"></td>
                <td style="border-bottom:none;"></td>
            </tr>
            <tr >
                <td style="border-right:none;border-top:none;"></td>
                <td  id="01" class= "TT_value" style="text-align:left;border-left:none;border-top:none;">Online only</td>
                <td  id="11" class= "TT_value" onclick="onclick_emv_tt(this, event)"  onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)">11</td>
                <td  id="21" class= "TT_value" onclick="onclick_emv_tt(this, event)"  onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)">21</td>
                <td style="">----</td>
            </tr>
            <tr >
                <td style="border-right:none"></td>
                <td id="02" class= "TT_value" style="text-align:left;border-left:none">Offline with online capability</td>
                <td id="12" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >12</td>
                <td id="22" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >22</td>
                <td>----</td>
            </tr>
            <tr >
                <td style="border-right:none"></td>
                <td id="03" class= "TT_value" style="text-align:left;border-left:none">Offline only</td>
                <td id="13" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >13</td>
                <td id="23" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >23</td>
                <td>----</td>
            </tr>
            <tr >
                <td colspan="2" style="text-align:left;border-bottom:none;">Unattended</td>
                <td style="border-bottom:none;"></td>
                <td style="border-bottom:none;"></td>
                <td style="border-bottom:none;"></td>
            </tr>
            <tr >
                <td style="border-right:none;border-top:none;"></td>
                <td id="04" class= "TT_value" style="text-align:left;border-left:none;border-top:none;">Online only</td>
                <td id="14" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" style="">14</td>
                <td id="24" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" style="">24</td>
                <td id="34" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" style="">34</td>
            </tr>
            <tr >
                <td style="border-right:none"></td>
                <td id="05" class= "TT_value" style="text-align:left;border-left:none">Offline with online capability</td>
                <td id="15" class="TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >15</td>
                <td id="25" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >25</td>
                <td id="35" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >35</td>
            </tr>
            <tr >
                <td style="border-right:none"></td>
                <td id="06" class= "TT_value" style="text-align:left;border-left:none">Offline only</td>
                <td id="16" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >16</td>
                <td id="26" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >26</td>
                <td id="36" class= "TT_value" onclick="onclick_emv_tt(this, event)" onmouseover="onmouseover_emv_tt(this, event)" onmouseout="onmouseout_emv_tt(this, event)" >36</td>
            </tr>
            </tbody>
        </table>`
    return content;
}    

//---------------------------------------------------------- TERMINAL SERIAL NUMBER PANEL -----------------------------------------------------------------

var emv_snpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;

    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column snpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',       
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container', type: 'text',  value: '', events: {onchange:'onchange_emv_sn(this, event)'},  attributes: {maxlength: "8", minlength: "8"},  title : 'Terminal Interface Device (IFD) Serial Number'},        
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1E'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F1E', events :{onmousedown: "emv_searchtag('9F1E', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})

//---------------------------------------------------------- TERMINAL COUNTRY CODE PANEL -----------------------------------------------------------------

var emv_ccpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;

    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column ccpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',     
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container', type: 'select',  value: '', menu: emv_Country_Code, events: {onchange:'onchange_emv_cc(this, event)'},  attributes: {minlength:"1", maxlength: "2"},   title : 'Terminal Country Code'},     
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1A'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1A'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F1A', events :{onmousedown: "emv_searchtag('9F1A', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})


//---------------------------------------------------------- AID PANEL -----------------------------------------------------------------------------------------

var emv_aidpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column aidpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'select',  value: '', menu: emv_AID, events: {onchange:'onchange_emv_aid(this, event)'},  attributes: {minlength:"1", maxlength: "2"},   title :'Application Identifier (AID) Terminal'},     
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1E'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F1E', events :{onmousedown: "emv_searchtag('9F1E', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})


//---------------------------------------------------------- APPLICATION VERSION PANEL -----------------------------------------------------------------------------------------

var emv_avnpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  avnpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'int',  value: '', events: {onchange:'onchange_emv_avn(this, event)'},  attributes: {min:0, max : 65535, minlength: 1},  title : 'Application Version Number'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1E'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F1E', events :{onmousedown: "emv_searchtag('9F1E', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})

//--------------------------------------------------------------------- MERCHANT CATEGORY CODE--------------------------------------------------------------------


var emv_mccpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  mccpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'text',  value: '', events: {onchange:'onchange_emv_mcc(this, event)'},  attributes: {minlength: "4", maxlength :"4"},  title : 'Acquirer Identifier'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F15'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F15'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F15', events :{onmousedown: "emv_searchtag('9F15', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})

//----------------------------------------------------------MERCHANT IDENTIFICATION ------------------------------------------------------


var emv_mipanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  mipanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'text',  value: '', events: {onchange:'onchange_emv_mi(this, event)'},  attributes: {minlength: "15", maxlength: "15"},  title : 'Acquirer Identifier'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F16'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F16'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F16', events :{onmousedown: "emv_searchtag('9F16', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})


//----------------------------------------------------------MERCHANT NAME AND LOCATION ------------------------------------------------------

var emv_mnlpanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  mnlpanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'text',  value: '', events: {onchange:'onchange_emv_mnl(this, event)'},  attributes: {},  title : 'Acquirer Identifier'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F4E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F4E'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F4E', events :{onmousedown: "emv_searchtag('9F4E', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})

//----------------------------------------------------------ACCEPTOR TERMINAL IDENTIFICATION ------------------------------------------------------

var emv_tipanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  tipanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'text',  value: '', events: {onchange:'onchange_emv_ti(this, event)'},  attributes: {minlength: "8", maxlength:"8"},  title : 'Acquirer Identifier'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1C'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1C'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F1C', events :{onmousedown: "emv_searchtag('9F1C', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})


//--------------------------------------------------------------------- ACQUIRER IDENTIFIER PANEL  --------------------------------------------------------------------



var emv_aipanel = ((name, useroption) => {
    let defaultoption = {
        editable:true,
        withbar: true,
        class: '',
        events: {}
    }
    
    let moption = defined(useroption) ? useroption : {};
    let option = {...defaultoption , ...moption};
    let editable = option.editable;
    let withbar  = option.withbar;
    let panel = {
        id: name, 
        type: 'panel',  
        class: 'sb_column  aipanel'+ (editable ? ' editable ' : ' ') + option.class,  
        style: option.style ? option.style : '',    
        events : option.events,   
        items:[        
            {id: 'emv_' + name + '_container',  type: 'text',  value: '', events: {onchange:'onchange_emv_ai(this, event)'},  attributes: {maxlength: "11", minlength: "6"},  title : 'Acquirer Identifier'},   
         
        ]
    }

    if (withbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + '_bar', 
                type: 'bar', 
                items: [
                    {
                        position: '',
                        id: 'emv_' + name + '_maingroup', 
                        type: 'group',                    
                        direction: 'row',
                        toggle : false,
                        items : 
                        [
                            {id: 'emv_' + name + '_description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F01'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F01'},
                            {id: 'emv_' + name + '_tag',          type: 'label',    class: 'emv_button_show', item: '9F01', events :{onmousedown: "emv_searchtag('9F01', event)"} },                       
                        ]
                    } 
                ] 
            })
    }
    return panel;        
})