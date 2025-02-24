//---------------------------------------------------------- BYTE PANEL  -----------------------------------------------------------------

function onclick_emv_byte(elt, event) {
    let binarystr = '';
    //let bitcell   =  $('#' + elt.id + ' td[byte]');
    let bitcell   = $(elt).children('[byte]')
    let bytepanel = $(elt).closest ('.bytepanel');
    let nbrbytes  = bytepanel.find('.emvbyte').length;


    if (bytepanel.hasClass('editable')) {
         if ($(elt).children().last().html() != 'RFU' ) {
            if ($(elt).hasClass('selected')) {
                $(elt).removeClass('selected')
                bitcell.html('0')
            } else {
                $(elt).addClass('selected')
                bitcell.html('1')
            }
            bytepanel.find('[byte]').each(function() {
                binarystr += $(this).html();
            })
            bytepanel.attr ("value", binary_to_hexa(binarystr, nbrbytes))   
            bytepanel.trigger ('change')     
        }
    }
}

function emv_byte_init (panel) {
    for (var i = 0; i < panel.struct.length; i++) {
        for (var j = 0; j < panel.struct[i].length; j++) {
//            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + j).removeClass('selected')                
            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + j).attr('byte', panel.struct[i][j].id);      
            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + j).html('0');          
            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_8').html(panel.struct[i][j].item)
            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j).removeClass('selected')      
              
        }
    }
    return panel;
}

function emv_bytepanel_init (panel) {
    emv_byte_init(panel)    
    let index = panel.items.length -1;
    sb.tab_select (panel.items[index], "BYTE 1")
}

function emv_byte_update (panel, bytes, scroll, shift) {
    emv_byte_init (panel)    

    let binarystr = '';    
    let Shift = defined(shift) ? shift : 0;    
    let Byte  = Shift;

    let bytesint = bytes; //parseInt(bytes);
    for (var i = panel.struct.length - 1; i >= 0; i--) {
        let byte = (bytesint >> BigInt(i * 8));
        for (var j = 0; j < panel.struct[i].length; j++) {
            let id = parseInt(byte & BigInt(BIT[j]));
            if (id == 0) {
                binarystr += '0';                
                continue;
            }
            binarystr += '1';
            emv_byte_select(panel, (Byte << 8) |id, scroll);
        }
        Byte++;
    }
    $('#' +  panel.id).attr ("value", binary_to_hexa(binarystr, panel.struct.length))     
}

function emv_byte_select (panel, id, scroll) {
    let elt =  $('#' + panel.id + ' [byte="' + id + '"]');
    if (scroll) {

        let bytepanelid = elt.closest('[role="tabpanel"]').attr('id')
        let bytetabid   = elt.closest('.sb_tabs' ).attr('id')
        $('#' + bytetabid +  ' #' + CSS.escape($('[data-bs-target="#' + bytepanelid + '"]').attr('id'))).tab('show');        
        elt.closest ('.bytepanel')[0].scrollIntoView();  
        
        let panelid = $('#' + panel.id).closest('.tester_sidebar').attr('id');   
        let menuid = panelid.replace("sidebarpanel", "sidebar");
        let psidebarpanel   = $('#emv_tester_sidebarpanel');         
        trightsidebarpanel_select(psidebarpanel, menuid);        
    }    
    
    elt.html('1');    
    elt.parent().addClass('selected')
} 


function emv_byte_show (panel, id, show) { 
    let elt     = $('#' + panel.id + ' [byte="' + id + '"]');
    console.log('show')
    if (show) {    
        $('#emv_tester_sidebarpanel .sb_tablerow').removeClass('marked')
   

        let bytepanelid = elt.closest('[role="tabpanel"]').attr('id')        
        let bytetabid   = elt.closest('.sb_tabs' ).attr('id')
        $('#' + bytetabid +  ' #' + CSS.escape($('[data-bs-target="#' + bytepanelid + '"]').attr('id'))).tab('show');

        let panelid = $('#' + panel.id).closest('.tester_sidebar').attr('id');   
        let menuid = panelid.replace("sidebarpanel", "sidebar");
        let psidebarpanel   = $('#emv_tester_sidebarpanel'); 
        trightsidebarpanel_select(psidebarpanel, menuid);
       // elt.closest ('.bytepanel')[0].scrollIntoView()
        setTimeout (function essa (elt) {
            elt.closest ('.bytepanel')[0].scrollIntoView() 
        }, 3000, elt);  

        elt.parent().addClass('marked')

    } else {
        elt.parent().removeClass('marked')

     //   let psidebarpanel   = $('#emv_tester_sidebarpanel'); 
     //   if (!psidebarpanel.hasClass('pinned')) {    
     //       rightsidebarpanel_hide(psidebarpanel);
     //   }        
    }
    event.stopPropagation();
} 
 
function onclick_byteflatpanel (elt, event) {
    let checked = $('#' + elt.id).prop('checked');
    let parent = $('#' + elt.id).closest('.bytepanel');
    if (checked) {
        parent.find('.sb_tabcontainer').css('display', 'none')
        parent.find('[role="tabpanel"]').removeClass('sb_pane')             
        parent.find ('.sb_pane').css('display', 'flex')
        parent.find ('.sb_tabs .tagheader').css('display', 'block')
      
        parent.find ('.sb_content').addClass('sb_column').css('flex-wrap', 'wrap');
    } else {
        parent.find('[role="tabpanel"]').addClass('sb_pane')        
        parent.find('.sb_tabcontainer').css('display', '')
        parent.find ('.sb_pane').css('display', '')
        parent.find ('.sb_tabs .tagheader').css('display', 'none')
  
        parent.find ('.sb_content').removeClass('sb_column').css('flex-wrap', '');
    }
}

//---------------------------------------------------------- CID TYPE PANEL -----------------------------------------------------------------
function emv_cidbyte_init (panel) {

    for (var i = 0; i < panel.struct.length; i++) {
        for (var j = 0; j < panel.struct[i].length; j++) {
            
            $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j).removeClass('selected')  

            if (j < 4) {
                for (var col = 0; col < 2; col++) {
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('background', 'var(--theme-hover-bg-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('color', 'var(--theme-hover-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).attr('byte', j);    
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).removeClass('selected')                                            
                }
            } else
            if (j ==4) {
                for (var col = 2; col < 4; col++) {
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('background', 'var(--theme-hover-bg-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('color', 'var(--theme-hover-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).attr('byte',j); 
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).removeClass('selected')                                               
                }
            } else 
            if (j == 5 || j == 6) {
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + 4). css ('background', 'var(--theme-hover-bg-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + 4). css ('color', 'var(--theme-hover-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).attr('byte',j);            
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).removeClass('selected')                                    
            } else
            if (j > 6) {
                for (var col = 5; col < 8; col++) {
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('background', 'var(--theme-hover-bg-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col). css ('color', 'var(--theme-hover-color)')
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).attr('byte',j);            
                    $('#' + panel.id + ' #emv_bytetable_' + i + '_' + j + '_' + col).removeClass('selected')                                    
                }
            } 
        }
    }
    return panel;
}


function emv_cidbytepanel_init (panel) {
    emv_cidbyte_init(panel)    
    let index = panel.items.length -1;
    sb.tab_select (panel.items[index], "BYTE 1")
}

function emv_cidbyte_update (panel, bytes, scroll, shift) {
    console.log ('cid init')


    let binarystr = '';    
    let Shift = defined(shift) ? shift : 0;    
    let Byte  = Shift;
    let j = 0;
    while (j < 8) {
        let id = parseInt(bytes & BIT[j]);
        (id == 0 ? binarystr += '0' : binarystr += '1');
        j++;
    }
    j = 0;

    if ((bytes & EMV_CRYPTO_TYPE_AAR) == EMV_CRYPTO_TYPE_AAR){
        emv_cidbyte_select(panel, 3, scroll)
    }	else
    if ((bytes & EMV_CRYPTO_TYPE_ARQC) == EMV_CRYPTO_TYPE_ARQC) {
        emv_cidbyte_select(panel, 2, scroll)
    }	else
    if ((bytes & EMV_CRYPTO_TYPE_TC) == EMV_CRYPTO_TYPE_TC) {
        emv_cidbyte_select(panel, 1, scroll)
    }	else {
        emv_cidbyte_select(panel, 0, scroll);
    }

    if (bytes & EMV_CRYPTO_TYPE_PSS) {
        emv_cidbyte_select(panel, 4, scroll);
    }
    
    if (bytes & EMV_CRYPTO_AR) {
        emv_cidbyte_select(panel, 6, scroll)
    } else {
        emv_cidbyte_select(panel, 5, scroll);
    }
        
    if (bytes & EMV_CRYPTO_RFU) { 
        emv_cidbyte_select(panel, 12, scroll);
    }	else
    if (bytes & EMV_CRYPTO_IAF) { 
        emv_cidbyte_select(panel, 11, scroll);
    }	else
    if (bytes & EMV_CRYPTO_TLE) { 
        emv_cidbyte_select(panel, 10, scroll);
    }	else
    if (bytes & EMV_CRYPTO_SNA) { 
        emv_cidbyte_select(panel, 9, scroll);
    } else {
        emv_cidbyte_select(panel, 8, scroll);
    }
   
    $('#' +  panel.id).attr ("value", binary_to_hexa(binarystr, panel.struct.length))     
}

function emv_cidbyte_select (panel, id, scroll) {
    let elt =  $('#' + panel.id + ' [byte="' + id + '"]');
    if (scroll) {

        let bytepanelid = elt.closest('[role="tabpanel"]').attr('id')
        let bytetabid   = elt.closest('.sb_tabs' ).attr('id')
        $('#' + bytetabid +  ' #' + CSS.escape($('[data-bs-target="#' + bytepanelid + '"]').attr('id'))).tab('show');        
        elt.closest ('.bytepanel')[0].scrollIntoView();  
        
        let panelid = $('#' + panel.id).closest('.tester_sidebar').attr('id');   
        let menuid = panelid.replace("sidebarpanel", "sidebar");
        let psidebarpanel   = $('#emv_tester_sidebarpanel');         
        trightsidebarpanel_select(psidebarpanel, menuid);        
    }    
    
 //   elt.html('1');    
    elt.parent().addClass('selected')
    elt.addClass('selected')
} 

function emv_cidbyte_show (panel, id, show) {
    let elt =  $('#' + panel.id + ' [byte="' + id + '"]');
    if (show) {
        
        $('#emv_tester_sidebarpanel .sb_tablerow').removeClass('marked')
        $('#emv_tester_sidebarpanel .sb_tablecell').removeClass('marked') 
        
        
        let bytepanelid = elt.closest('[role="tabpanel"]').attr('id')
        let bytetabid   = elt.closest('.sb_tabs' ).attr('id')
        $('#' + bytetabid +  ' #' + CSS.escape($('[data-bs-target="#' + bytepanelid + '"]').attr('id'))).tab('show');        
        elt.closest ('.bytepanel')[0].scrollIntoView();  
        
        let panelid = $('#' + panel.id).closest('.tester_sidebar').attr('id');   
        let menuid = panelid.replace("sidebarpanel", "sidebar");
        let psidebarpanel   = $('#emv_tester_sidebarpanel');         
        trightsidebarpanel_select(psidebarpanel, menuid);        
        
        elt.parent().addClass('marked')
        elt.addClass('marked')        
    } else {
        
        elt.parent().removeClass('marked')
        elt.removeClass('marked')           
    }   
    
  

} 
//---------------------------------------------------------- TERMINAL TYPE PANEL -----------------------------------------------------------------

function onclick_emv_tt(elt, event) {
    let binarystr = '';
    let ttpanel = $(elt).closest ('.ttpanel');
    let ttpanelid = ttpanel.attr('id');

    if ( ttpanel.hasClass('editable')) {

        let elts =  $('#' + ttpanelid + ' .TT_value');
        elts.removeClass('selected')

        $('#' + ttpanelid +  ' #' + elt.id).addClass('selected')
        let content =  $(elt).html();
        let col = content.substring(0,1);
        let row = content.substring(1);
        $('#' + ttpanelid  + ' #' + col + '0'). addClass ('selected')
        $('#' + ttpanelid  + ' #' + '0' + row). addClass ('selected')

        ttpanel.attr ("value", content)   
        ttpanel.trigger ('change')           
    }
}

function onmouseover_emv_tt(elt, event) {
    let content =  $(elt).html();
    let col = content.substring(0,1);
    let row = content.substring(1);
    let ttpanel = $(elt).closest ('.ttpanel')    
    let ttpanelid = ttpanel.attr('id');


    $('#' + ttpanelid  + ' #' + col + '0'). css ('background', 'var(--theme-hover-bg-color)')
    $('#' + ttpanelid  + ' #' + col + '0'). css ('color', 'var(--theme-hover-color)')
    $('#' + ttpanelid  + ' #' + '0' + row). css ('background', 'var(--theme-hover-bg-color)')
    $('#' + ttpanelid  + ' #' + '0' + row). css ('color', 'var(--theme-hover-color)')
}

function onmouseout_emv_tt(elt, event) {
    let content =  $(elt).html();
    let col = content.substring(0,1);
    let row = content.substring(1);
    let ttpanel = $(elt).closest ('.ttpanel')  
    let ttpanelid = ttpanel.attr('id');        

    $('#' + ttpanelid  + '#' + col + '0'). css ('background', '')
    $('#' + ttpanelid  + '#' + col + '0'). css ('color', '')
    $('#' + ttpanelid  + '#' + '0' + row). css ('background', '')
    $('#' + ttpanelid  + '#' + '0' + row). css ('color', '')
}

function emv_tt_init (panel) {
    let elts =  $('#' + panel.id + ' .TT_value');
    elts.removeClass('selected')
}

function emv_tt_update (panel, byte, scroll) {
    emv_tt_init (panel)

    let byteint = parseInt(byte);
    emv_tt_select (panel, byteint, scroll)    
    $('#' +  panel.id).attr ("value", byteint)     
}

function emv_tt_select (panel, id, scroll) {
    let elt =  $('#' + panel.id + ' #' + id);
    let elts =  $('#' + panel.id + ' .TT_value');
    elts.removeClass('selected')

    if (scroll) {
        let ui       = solution.get('ui') 
        let platform = ui.platform_get ('pname',EMV_PLATFORM_PNAME);     
    
        BottomPanel_Flat (platform, false ,true);        
        elt[0].scrollIntoView();  

    }    
    elt.addClass('selected')
    let content =  elt.html();
    let col = content.substring(0,1);
    let row = content.substring(1);
    $('#' + panel.id + ' #' + col + '0'). addClass ('selected')
    $('#' + panel.id + ' #' + '0' + row). addClass ('selected')    
} 

//---------------------------------------------------------- TERMINAL COUNTRY CODE PANEL -----------------------------------------------------------------

function onchange_emv_cc (elt, event) {
    let ccpanel = $(elt).closest ('.ccpanel');    

    ccpanel.attr ("value", $('#' + elt.id + ' option:selected').val())         
    ccpanel.trigger ('change') 
}

function emv_cc_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    

    $('#' +  panel.id).attr ("value", val)       
}
//---------------------------------------------------------- TERMINAL SERIAL NUMBER PANEL -----------------------------------------------------------------

function onchange_emv_sn (elt, event) {
    let snpanel = $(elt).closest ('.snpanel');    

    snpanel.attr ("value", $(elt).val())     
    snpanel.trigger ('change') 
}

function emv_sn_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);  

    $('#' +  panel.id).attr ("value", val)   

}


//---------------------------------------------------------- AID PANEL -----------------------------------------------------------------------------------------

function onchange_emv_aid (elt, event) {
    let aidpanel = $(elt).closest ('.aidpanel');   
    
    aidpanel.attr ("value", $('#' + elt.id + ' option:selected').val())    
    aidpanel.trigger ('change') 
}

function emv_aid_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    

    $('#' +  panel.id).attr ("value", val)       
}


//---------------------------------------------------------- APPLICATION VERSION PANEL -----------------------------------------------------------------------------------------

function onchange_emv_avn (elt, event) {
    let avnpanel = $(elt).closest ('.avnpanel');    

    avnpanel.attr ("value", parseInt($(elt).val()).toString (16).toUpperCase().padStart(4, '0'))      
    avnpanel.trigger ('change') 
}

function emv_avn_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val.toString (16).toUpperCase().padStart(4, '0'))       

}

//----------------------------------------------------------MERCHANT CATEGORY CODE ------------------------------------------------------

function onchange_emv_mcc (elt, event) {
    let avnpanel = $(elt).closest ('.mccpanel');    

    avnpanel.attr ("value", $(elt).val().padStart(4, '0'))      
    avnpanel.trigger ('change') 
}


function emv_mcc_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val.padStart(4, '0'))       

}

//----------------------------------------------------------MERCHANT IDENTIFICATION ------------------------------------------------------

function onchange_emv_mi (elt, event) {
    let avnpanel = $(elt).closest ('.mipanel');    

    avnpanel.attr ("value", $(elt).val())      
    avnpanel.trigger ('change') 
}


function emv_mi_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val)       

}

//----------------------------------------------------------MERCHANT NAME AND LOCATION ------------------------------------------------------

function onchange_emv_mnl (elt, event) {
    let avnpanel = $(elt).closest ('.mnlpanel');    

    avnpanel.attr ("value", $(elt).val())      
    avnpanel.trigger ('change') 
}

function emv_mnl_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val)       

}


//----------------------------------------------------------ACCEPTOR TERMINAL IDENTIFICATION ------------------------------------------------------

function onchange_emv_ti (elt, event) {
    let avnpanel = $(elt).closest ('.tipanel');    

    avnpanel.attr ("value", $(elt).val())      
    avnpanel.trigger ('change') 
}

function emv_ti_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val)       

}

//----------------------------------------------------------ACQUIRER IDENTIFIER ------------------------------------------------------

function onchange_emv_ai (elt, event) {
    let aipanel = $(elt).closest ('.aipanel');  
    let val =  $(elt).val();  

    aipanel.attr ("value",val.padStart(val.length + val.length % 2, '0'))      
    aipanel.trigger ('change') 
}


function emv_ai_update (panel, val) {
    $('#emv_' + panel.id + '_container').val(val);    
    
    $('#' +  panel.id).attr ("value", val.padStart(val.length + val.length % 2, '0'))       

}

//---------------------------------------------------------- OUTSIDE -----------------------------------------------------------------

function o(e) {
    return {
        tag: e.children().siblings(".tv").text(),
        value: e.children().siblings(".tv-row").text()
    }
}

function C(e) {
    return `<input class="form-control" value="${e}" readonly style="font-family: unset;"></input>`
}

function g(tag) {
    if (!tag.value ) {
        return;
    }
    let e = tag.value;
    if (4 <= e.length) {
        e = e.match(/.{1,2}/g).map(function(e) {
            return String.fromCharCode(parseInt(e, 16))
        }).join("");
        if (/^[\x20-\x7E]+$/.test(e))
            return e
    }
    return null
}

function s(e) {
    $("#tlv-tag-container").show(),
    $("#tlv-value-hex-container").show(),
    $("#tlv-tag").val(gettagname(e.tag)),
    $("#tlv-value-hex").val(e.value),
    (extValueControl = gettagvalue_text(e)) ? ($("#tlv-value-ext-container").show(),
    $("#tlv-value-ext").empty(),
    $("#tlv-value-ext").append(extValueControl)) : ($("#tlv-value-ext-container").hide(),
    $("#tlv-value-ext").empty())
}

function emv_tlvparser_UpdateTree() {
    hidetagvalues()
    str = (str = $("#input-tlv").val()).replace(/\s/g, "").toUpperCase();

//    var e = new URL(window.location.href);
//    e.searchParams.set("data", str)
//    window.history.replaceState(null, null, e)
    if (0 === str.length) {
        $("#label-tlv-error").text("Empty input");
        $("#input-tlv").addClass("is-invalid");
    }
    else if (/^[0-9A-Fa-f]+$/.test(str))
        if (str.length % 2 != 0)
            $("#label-tlv-error").text("Must be an even number of hexadecimal digits"),
            $("#input-tlv").addClass("is-invalid");
        else {
            try {
                var a = TLVParse(str);
                if (0 === a.length)
                    return
            } catch (e) {
                if ($("#label-tlv-error").text(e.message),
                $("#input-tlv").addClass("is-invalid"),
                0 === e.parsed.length)
                    return;
                a = e.parsed
            }
            tlv_data = function e(a, t=0) {
                for (var n = `<ul class="${t ? "" : "root"}">`, i = 0; i < a.length; i++)
                    n += `<li class="${1 < a.length && i != a.length - 1 ? "trunk" : ""}">
        <div class="treeview-row ${i == a.length - 1 ? "end" : "trunk"}">
        <div class="tv-row rh roww"><span class="tc">${a[i].value}</span></div>
        <div class="ctrl rh"></div>
        <div class="tv rh"><span class="tc">${a[i].tag}</span></div>
        </div>`,
                    null != a[i].child && (n += e(a[i].child, t + 1)),
                    n += "</li>";
                return n += "</ul>"
            }(a);
            tlv_html = `<div id="tlv-treetable" class="treetable sb_table" style="box-sizing: content-box;">
    <div class="header" >
        <ul class="header root">
        <li>
            <div>
            <div class="tv-row rh roww" >
            
            <div class="container ps-0 pe-0">
            <div class="row justify-content-between">
                <div class="col-auto me-auto"><b>Value</b></div>
            </div>
            </div>
            
            </div>
            <div class="tv rh"><b>Tag</b></div>
            </div>
        </li>
        </ul>
    </div>
    <div class="content" style=" height: 276px; resize:vertical;">
    <div >
    ${tlv_data}
    </div>
    </div>
    </div>`,
            $("#tlv-parsed").append(tlv_html);
            $("#tlv-treetable").click(showtagvalues);
           
        }
    else
        $("#label-tlv-error").text("Enter only hexadecimal digits 0-9 and A-F"),
        $("#input-tlv").addClass("is-invalid")
}

function resetStatus(t) {
    t.removeClass("is-valid")
    t.removeClass("is-invalid")
    t.removeClass("is-optional")
}

function hidetagvalues() {
    $("#tlv-tag-container").hide(),
    $("#tlv-value-hex-container").hide(),
    $("#tlv-value-ext-container").hide()
}

function showtagvalues(e) {
    $("#tlv-treetable .active").removeClass("active"),
    $(e.target).parent().hasClass("treeview-row") ? ($(e.target).parent().addClass("active"),
    s(tv = o($(e.target).parent()))) : $(e.target).parent().parent().hasClass("treeview-row") ? ($(e.target).parent().parent().addClass("active"),
    s(tv = o($(e.target).parent().parent()))) : hidetagvalues()
}

function emv_TLVParser_UpdateInput(content) {
    $("#input-tlv").val(content),
    $("#label-tlv-error").text(""),
    resetStatus($("#input-tlv")),
    $("#tlv-parsed").empty(),
    emv_tlvparser_UpdateTree()
}

function emv_TLVParserPanel_Update () {
    $("#input-tlv").on("change paste input", function() {
        $("#input-tlv").removeClass("is-invalid"),
        $("#label-tlv-error").text("")
    });
}

function onclick_tlvparser_parse (elt, event) {
    event.preventDefault();
    $("#tlv-parsed").empty();
    emv_tlvparser_UpdateTree();
}

function onclick_tlvparser_reset (elt, event) {
    event.preventDefault();
    $("#input-tlv").val("")    
    $("#tlv-parsed").empty()
    $("#label-tlv-error").text("")    
    resetStatus($("#input-tlv")); 
    hidetagvalues();
}

function emv_tlvparser_panel () {
    
    let content = `
    <div id="tlvparsereditor" class="">
        <div class="sb_row">
            <div class="sb_main">
                <textarea class="form-control form-control-sm" rows="5" id="input-tlv" style="background-image: unset;"></textarea>
            </div>
        </div>
        
        <div class="sb_row">
            <label class="sb_label"></label>
            <div class="sb_main sb_buttongroup">
                <button id="button-tlv-parse" class="btn sb_button" onclick="onclick_tlvparser_parse(this, event)">Parse</button>
                <button id="button-tlv-reset" class="btn sb_button" onclick="onclick_tlvparser_reset(this, event)">Reset</button>

            </div>
        </div>
        <div class="ps-2 text-nowrap " style="color: #dc3545; align-self: center;"><span id="label-tlv-error"></span></div>
        <div class="sb_row">
            <label class="sb_label" ></label>
            <div id="tlv-parsed" class="sb_main"></div>
        </div>
        
        <div class="sb_row" id="tlv-tag-container" style="display: none;">
            <label class="sb_label" >Tag</label>
            <div class="sb_main">
                <input class="form-control" id="tlv-tag" readonly style="font-family: unset;">
            </div>
        </div>
        
        <div class="sb_row" id="tlv-value-hex-container" style="display: none;">
            <label class="sb_label" >Value<sub>Hex</sub></label>
            <div class="sb_main">
                <input class="form-control" id="tlv-value-hex" readonly>
            </div>
        </div>
        
        <div class="sb_row" id="tlv-value-ext-container" style="display: none;">
            <label class="sb_label">Value<sub>Ext</sub></label>
            <div id="tlv-value-ext" class="sb_main">
            </div>
        </div>
    </div>`;
    return content;
   
}


function gettagclassname(e) {
    return (className = {    
// Here are tags for response 
    "6F": "FILE_CONTROL_INFORMATION_TEMPLATE",
    "77": "RESPONSE_MESSAGE_TEMPLATE_FORMAT_2",
    "80": "RESPONSE_MESSAGE_TEMPLATE_FORMAT_1",    
    "70": "READ_RECORD_RESPONSE_MESSAGE_TEMPLATE",        
    }[e]) || ""        
}

function getcommandclassname(e) {
    return (className = {
        "B0": "READ_BINARY",
        "D0": "WRITE_ BINARY",
        "D6": "UPDATE_BINARY",
        "0E": "ERASE_BINARY",
        "B2": "READ_RECORD",
        "D2": "WRITE_RECORD",
        "E2": "APPEND_RECORD",
        "DC": "UPDATE_RECORD",
        "CA": "GET_DATA",
        "DA": "PUT_DATA",
        "A4": "SELECT_FILE",
        "20": "VERIFY",
        "88": "INTERNAL_AUTHENTICATE",
        "82": "EXTERNAL_AUTHENTICATE",
        "84": "GET_CHALLENGE",
        "70": "MANAGE_CHALLENGE",
        "C0": "GET_RESPONSE",
        "C2": "ENVELOPE",
        "40": "VALIDATION",
        "A8": "GET_PROCESSING_OPTIONS",
        "1E": "APPLICATION_BLOCK",
        "18": "APPLICATION_UNBLOCK",
        "16": "CARD_BLOCK",
        "AE": "GENERATE_APPLICATION_CRYPTOGRAM",
        "A8": "GET_PROCESSING_OPTIONS",
        "24": "PERSONAL_IDENTIFICATION_NUMBER",
    }[e]) || ""        
}


function getcommandname(e) {
    return (commandName = {
        "B0": "READ BINARY",
        "D0": "WRITE BINARY",
        "D6": "UPDATE BINARY",
        "0E": "ERASE BINARY",
        "B2": "READ RECORD",
        "D2": "WRITE RECORD",
        "E2": "APPEND RECORD",
        "DC": "UPDATE RECORD",
        "CA": "GET DATA",
        "DA": "PUT DATA",
        "A4": "SELECT FILE",
        "20": "VERIFY",
        "88": "INTERNAL AUTHENTICATE",
        "82": "EXTERNAL AUTHENTICATE",
        "84": "GET CHALLENGE",
        "70": "MANAGE CHALLENGE",
        "C0": "GET RESPONSE",
        "C2": "ENVELOPE",
        "40": "validation (ratification du code PIN)",
        "A8": "GET PROCESSING OPTIONS (PDOL)",
        "1E": "APPLICATION BLOCK",
        "18": "APPLICATION UNBLOCK",
        "16": "CARD BLOCK",
        "AE": "GENERATE APPLICATION CRYPTOGRAM",
        "A8": "GET PROCESSING OPTIONS (GPO)",
        "24": "PERSONAL IDENTIFICATION NUMBER (PIN) CHANGE/UNBLOCK",
    }[e]) || ""        
}

function gettagname(e) {
    return (tagName = {
        "06": "Object Identifier (OID)",
        41: "Country code and national data",
        42: "Issuer Identification Number (IIN)",
        43: "Card service data",
        44: "Initial access data",
        45: "Card issuer's data",
        46: "Pre-issuing data",
        47: "Card capabilities",
        48: "Status information",
        "4D": "Extended header list",
        "4F": "Application Identifier (ADF Name)",
        50: "Application Label",
        51: "Path",
        52: "Command to perform",
        53: "Discretionary data, discretionary template",
        56: "Track 1 Equivalent Data",
        57: "Track 2 Equivalent Data",
        58: "Track 3 Equivalent Data",
        59: "Card expiration date",
        "5A": "Application Primary Account Number (PAN)",
        "5B": "Name of an individual",
        "5C": "Tag list",
        "5E": "Proprietary login data",
        "5F20": "Cardholder Name",
        "5F21": "Track 1, identical to the data coded",
        "5F22": "Track 2, identical to the data coded",
        "5F23": "Track 3, identical to the data coded",
        "5F24": "Application Expiration Date (YYMMDD)",
        "5F25": "Application Effective Date (YYMMDD)",
        "5F26": "Date, Card Effective",
        "5F27": "Interchange control",
        "5F28": "Issuer Country Code",
        "5F29": "Interchange profile",
        "5F2A": "Transaction Currency Code",
        "5F2B": "Date of birth",
        "5F2C": "Cardholder nationality",
        "5F2D": "Language Preference",
        "5F2E": "Cardholder biometric data",
        "5F2F": "PIN usage policy",
        "5F30": "Service Code",
        "5F32": "Transaction counter",
        "5F33": "Date, Transaction",
        "5F34": "Application Primary Account Number (PAN) Sequence Number (PSN)",
        "5F35": "Sex (ISO 5218)",
        "5F36": "Transaction Currency Exponent",
        "5F37": "Static internal authentication (one-step)",
        "5F38": "Static internal authentication - first associated data",
        "5F39": "Static internal authentication - second associated data",
        "5F3A": "Dynamic internal authentication",
        "5F3B": "Dynamic external authentication",
        "5F3C": "Transaction Reference Currency Code",
        "5F3D": "Transaction Reference Currency Exponent",
        "5F40": "Cardholder portrait image",
        "5F41": "Element list",
        "5F42": "Address",
        "5F43": "Cardholder handwritten signature image",
        "5F44": "Application image",
        "5F45": "Display message",
        "5F46": "Timer",
        "5F47": "Message reference",
        "5F48": "Cardholder private key",
        "5F49": "Cardholder public key",
        "5F4A": "Public key of certification authority",
        "5F4C": "Certificate holder authorization",
        "5F4D": "Integrated circuit manufacturer identifier",
        "5F4E": "Certificate content",
        "5F50": "Issuer Uniform resource locator (URL)",
        "5F53": "International Bank Account Number (IBAN)",
        "5F54": "Bank Identifier Code (BIC)",
        "5F55": "Issuer Country Code (alpha2 format)",
        "5F56": "Issuer Country Code (alpha3 format)",
        "5F57": "Account Type",
        60: "Template, Dynamic Authentication",
        6080: "Commitment",
        6081: "Challenge",
        6082: "Response",
        6083: "Committed challenge",
        6084: "Authentication code",
        6085: "Exponential",
        "60A0": "Template, Identification data",
        61: "Application Template",
        62: "File Control Parameters (FCP) Template",
        6280: "Number of data bytes in the file, excluding structural information",
        6281: "Number of data bytes in the file, including structural information if any",
        6282: "File descriptor byte",
        6283: "File identifier",
        6284: "DF name",
        6285: "Proprietary information, primitive encoding",
        6286: "Security attribute in proprietary format",
        6287: "Identifier of an EF containing an extension of the file control information",
        6288: "Short EF identifier",
        "628A": "Life cycle status byte (LCS)",
        "628B": "Security attribute referencing the expanded format",
        "628C": "Security attribute in compact format",
        "628D": "Identifier of an EF containing security environment templates",
        "62A0": "Template, Security attribute for data objects",
        "62A1": "Template, Security attribute for physical interfaces",
        "62A2": "One or more pairs of data objects, short EF identifier (tag 88) - absolute or relative path (tag 51)",
        "62A5": "Proprietary information, constructed encoding",
        "62AB": "Security attribute in expanded format",
        "62AC": "Identifier of a cryptographic mechanism",
        63: "Wrapper",
        64: "Template, File Management Data (FMD)",
        65: "Cardholder related data",
        66: "Template, Card data",
        67: "Template, Authentication data",
        68: "Special user requirements",
        "6A": "Template, Login",
        "6A80": "Qualifier",
        "6A81": "Telephone Number",
        "6A82": "Text",
        "6A83": "Delay indicators, for detecting an end of message",
        "6A84": "Delay indicators, for detecting an absence of response",
        "6B": "Template, Qualified name",
        "6B06": "Qualified name",
        "6B80": "Name",
        "6BA0": "Name",
        "6C": "Template, Cardholder image",
        "6D": "Template, Application image",
        "6E": "Application related data",
        "6F": "File Control Information (FCI) Template",
        "6FA5": "Template, FCI A5",
        70: "READ RECORD Response Message Template",
        71: "Issuer Script Template 1",
        7186: "Issuer Script Command",
        "719F18": "Issuer Script Identifier",
        72: "Issuer Script Template 2",
        73: "Directory Discretionary Template",
        77: "Response Message Template Format 2",
        78: "Compatible Tag Allocation Authority",
        79: "Coexistent Tag Allocation Authority",
        "7A": "Template, Security Support (SS)",
        "7A80": "Card session counter",
        "7A81": "Session identifier",
        "7A82": "File selection counter",
        "7A83": "File selection counter",
        "7A84": "File selection counter",
        "7A85": "File selection counter",
        "7A86": "File selection counter",
        "7A87": "File selection counter",
        "7A88": "File selection counter",
        "7A89": "File selection counter",
        "7A8A": "File selection counter",
        "7A8B": "File selection counter",
        "7A8C": "File selection counter",
        "7A8D": "File selection counter",
        "7A8E": "File selection counter",
        "7A93": "Digital signature counter",
        "7B": "Template, Security Environment (SE)",
        "7B80": "SEID byte, mandatory",
        "7B8A": "LCS byte, optional",
        "7BAC": "Cryptographic mechanism identifier template, optional",
        "7BA4": "Control reference template (CRT)",
        "7BAA": "Control reference template (CRT)",
        "7BB4": "Control reference template (CRT)",
        "7BB6": "Control reference template (CRT)",
        "7BB8": "Control reference template (CRT)",
        "7D": "Template, Secure Messaging (SM)",
        "7D80": "Plain value not coded in BER-TLV",
        "7D81": "Plain value not coded in BER-TLV",
        "7D82": "Cryptogram (plain value coded in BER-TLV and including secure messaging data objects)",
        "7D83": "Cryptogram (plain value coded in BER-TLV and including secure messaging data objects)",
        "7D84": "Cryptogram (plain value coded in BER-TLV, but not including secure messaging data objects)",
        "7D85": "Cryptogram (plain value coded in BER-TLV, but not including secure messaging data objects)",
        "7D86": "Padding-content indicator byte followed by cryptogram (plain value not coded in BER-TLV)",
        "7D87": "Padding-content indicator byte followed by cryptogram (plain value not coded in BER-TLV)",
        "7D8E": "Cryptographic checksum (at least four bytes)",
        "7D90": "Hash-code",
        "7D91": "Hash-code",
        "7D92": "Certificate (not BER-TLV coded data)",
        "7D93": "Certificate (not BER-TLV coded data)",
        "7D94": "Security environment identifier",
        "7D95": "Security environment identifier",
        "7D96": "Number Le in the unsecured command APDU (one or two bytes)",
        "7D97": "Number Le in the unsecured command APDU (one or two bytes)",
        "7D99": "Processing status of the secured response APDU (new SW1-SW2, two bytes)",
        "7D9A": "Input data element for the computation of a digital signature (the value field is signed)",
        "7D9B": "Input data element for the computation of a digital signature (the value field is signed)",
        "7D9C": "Public key",
        "7D9D": "Public key",
        "7D9E": "Digital signature",
        "7DA0": "Input template for the computation of a hash-code (the template is hashed)",
        "7DA1": "Input template for the computation of a hash-code (the template is hashed)",
        "7DA2": "Input template for the verification of a cryptographic checksum (the template is integrated)",
        "7DA4": "Control reference template for authentication (AT)",
        "7DA5": "Control reference template for authentication (AT)",
        "7DA8": "Input template for the verification of a digital signature (the template is signed)",
        "7DAA": "Template, Control reference for hash-code (HT)",
        "7DAB": "Template, Control reference for hash-code (HT)",
        "7DAC": "Input template for the computation of a digital signature (the concatenated value fields are signed)",
        "7DAD": "Input template for the computation of a digital signature (the concatenated value fields are signed)",
        "7DAE": "Input template for the computation of a certificate (the concatenated value fields are certified)",
        "7DAF": "Input template for the computation of a certificate (the concatenated value fields are certified)",
        "7DB0": "Plain value coded in BER-TLV and including secure messaging data objects",
        "7DB1": "Plain value coded in BER-TLV and including secure messaging data objects",
        "7DB2": "Plain value coded in BER-TLV, but not including secure messaging data objects",
        "7DB3": "Plain value coded in BER-TLV, but not including secure messaging data objects",
        "7DB4": "Control reference template for cryptographic checksum (CCT)",
        "7DB5": "Control reference template for cryptographic checksum (CCT)",
        "7DB6": "Control reference template for digital signature (DST)",
        "7DB7": "Control reference template for digital signature (DST)",
        "7DB8": "Control reference template for confidentiality (CT)",
        "7DB9": "Control reference template for confidentiality (CT)",
        "7DBA": "Response descriptor template",
        "7DBB": "Response descriptor template",
        "7DBC": "Input template for the computation of a digital signature (the template is signed)",
        "7DBD": "Input template for the computation of a digital signature (the template is signed)",
        "7DBE": "Input template for the verification of a certificate (the template is certified)",
        "7E": "Template, Nesting Interindustry data objects",
        "7F20": "Display control template",
        "7F21": "Cardholder certificate",
        "7F2E": "Biometric data template",
        "7F49": "Template, Cardholder public key",
        "7F4980": "Algorithm reference as used in control reference data objects for secure messaging",
        "7F4981": "RSA Modulus",
        "7F4982": "RSA Public exponent",
        "7F4983": "DSA Basis",
        "7F4984": "DSA Public key",
        "7F4985": "ECDSA Order",
        "7F4986": "ECDSA Public key",
        "7F4C": "Template, Certificate Holder Authorization",
        "7F4E": "Certificate Body",
        "7F4E42": "Certificate Authority Reference",
        "7F4E65": "Certificate Extensions",
        "7F60": "Template, Biometric information",
        80: "Response Message Template Format 1",
        81: "Amount, Authorised (Binary)",
        82: "Application Interchange Profile (AIP)",
        83: "Command Template",
        84: "Dedicated File (DF) Name",
        86: "Issuer Script Command",
        87: "Application Priority Indicator",
        88: "Short File Identifier (SFI)",
        89: "Authorisation Code",
        "8A": "Authorisation Response Code (ARC)",
        "8C": "Card Risk Management Data Object List 1 (CDOL1)",
        "8D": "Card Risk Management Data Object List 2 (CDOL2)",
        "8E": "Cardholder Verification Method (CVM) List",
        "8F": "Certification Authority Public Key Index (PKI)",
        90: "Issuer Public Key Certificate",
        91: "Issuer Authentication Data",
        92: "Issuer Public Key Remainder",
        93: "Signed Static Application Data (SAD)",
        94: "Application File Locator (AFL)",
        95: "Terminal Verification Results (TVR)",
        97: "Transaction Certificate Data Object List (TDOL)",
        98: "Transaction Certificate (TC) Hash Value",
        99: "Transaction Personal Identification Number (PIN) Data",
        "9A": "Transaction Date (YYMMDD)",
        "9B": "Transaction Status Information (TSI)",
        "9C": "Transaction Type",
        "9D": "Directory Definition File (DDF) Name",
        "9F01": "Acquirer Identifier",
        "9F02": "Amount, Authorised (Numeric)",
        "9F03": "Amount, Other (Numeric)",
        "9F04": "Amount, Other (Binary)",
        "9F05": "Application Discretionary Data",
        "9F06": "Application Identifier (AID), Terminal",
        "9F07": "Application Usage Control (AUC)",
        "9F08": "Application Version Number",
        "9F09": "Application Version Number",
        "9F0A": "Application Selection Registered Proprietary Data",
        "9F0B": "Cardholder Name - Extended",
        "9F0D": "Issuer Action Code - Default",
        "9F0E": "Issuer Action Code - Denial",
        "9F0F": "Issuer Action Code - Online",
        "9F10": "Issuer Application Data (IAD)",
        "9F11": "Issuer Code Table Index",
        "9F12": "Application Preferred Name",
        "9F13": "Last Online Application Transaction Counter (ATC) Register",
        "9F14": "Lower Consecutive Offline Limit (LCOL)",
        "9F15": "Merchant Category Code (MCC)",
        "9F16": "Merchant Identifier",
        "9F17": "Personal Identification Number (PIN) Try Counter",
        "9F18": "Issuer Script Identifier",
        "9F19": "Token Requestor ID",
        "9F1A": "Terminal Country Code",
        "9F1B": "Terminal Floor Limit",
        "9F1C": "Terminal Identification",
        "9F1D": "Terminal Risk Management Data",
        "9F1E": "Interface Device (IFD) Serial Number",
        "9F1F": "Track 1 Discretionary Data",
        "9F20": "Track 2 Discretionary Data",
        "9F21": "Transaction Time",
        "9F22": "Public Key Index, Certification Authority, Terminal",
        "9F23": "Upper Consecutive Offline Limit (UCOL)",
        "9F24": "Payment Account Reference (PAR)",
        "9F25": "Last 4 Digits of PAN",
        "9F26": "Application Cryptogram (AC)",
        "9F27": "Cryptogram Information Data (CID)",
        "9F29": "Extended Selection",
        "9F2A": "Kernel Identifier",
        "9F2D": "Integrated Circuit Card (ICC) PIN Encipherment Public Key Certificate",
        "9F2E": "Integrated Circuit Card (ICC) PIN Encipherment Public Key Exponent",
        "9F2F": "Integrated Circuit Card (ICC) PIN Encipherment Public Key Remainder",
        "9F32": "Issuer Public Key Exponent",
        "9F33": "Terminal Capabilities",
        "9F34": "Cardholder Verification Method (CVM) Results",
        "9F35": "Terminal Type",
        "9F36": "Application Transaction Counter (ATC)",
        "9F37": "Unpredictable Number (UN)",
        "9F38": "Processing Options Data Object List (PDOL)",
        "9F39": "Point-of-Service (POS) Entry Mode",
        "9F3A": "Amount, Reference Currency (Binary)",
        "9F3B": "Currency Code, Application Reference",
        "9F3C": "Currency Code, Transaction Reference",
        "9F3D": "Currency Exponent, Transaction Reference",
        "9F40": "Additional Terminal Capabilities",
        "9F41": "Transaction Sequence Counter",
        "9F42": "Currency Code, Application",
        "9F43": "Currency Exponent, Application Reference",
        "9F44": "Currency Exponent, Application",
        "9F45": "Data Authentication Code",
        "9F46": "Integrated Circuit Card (ICC) Public Key Certificate",
        "9F47": "Integrated Circuit Card (ICC) Public Key Exponent",
        "9F48": "Integrated Circuit Card (ICC) Public Key Remainder",
        "9F49": "Dynamic Data Authentication Data Object List (DDOL)",
        "9F4A": "Static Data Authentication Tag List (SDA)",
        "9F4B": "Signed Dynamic Application Data (SDAD)",
        "9F4C": "ICC Dynamic Number",
        "9F4D": "Log Entry",
        "9F4E": "Merchant Name and Location",
        "9F4F": "Log Format",
        "9F50": "Cardholder Verification Status",
        "9F51": "Application Currency Code",
        "9F52": "Application Default Action (ADA)",
        "9F53": "Consecutive Transaction Counter International Limit (CTCIL)",
        "9F54": "Cumulative Total Transaction Amount Limit (CTTAL)",
        "9F55": "Geographic Indicator",
        "9F56": "Issuer Authentication Indicator",
        "9F57": "Issuer Country Code",
        "9F58": "Consecutive Transaction Counter Limit (CTCL)",
        "9F59": "Consecutive Transaction Counter Upper Limit (CTCUL)",
        "9F5A": "Application Program Identifier (Program ID)",
        "9F5B": "Issuer Script Results",
        "9F5C": "Cumulative Total Transaction Amount Upper Limit (CTTAUL)",
        "9F5D": "Available Offline Spending Amount (AOSA)",
        "9F5E": "Consecutive Transaction International Upper Limit (CTIUL)",
        "9F5F": "DS Slot Availability",
        "9F60": "CVC3 (Track1)",
        "9F61": "CVC3 (Track2)",
        "9F62": "PCVC3 (Track1)",
        "9F63": "Offline Counter Initial Value",
        "9F64": "NATC (Track1)",
        "9F65": "PCVC3 (Track2)",
        "9F66": "Terminal Transaction Qualifiers (TTQ)",
        "9F67": "MSD Offset",
        "9F68": "Card Additional Processes",
        "9F69": "Card Authentication Related Data",
        "9F6A": "Unpredictable Number (Numeric)",
        "9F6B": "Card CVM Limit",
        "9F6C": "Card Transaction Qualifiers (CTQ)",
        "9F6D": "VLP Reset Threshold",
        "9F6E": "Third Party Data / Form Factor Indicator",
        "9F6F": "DS Slot Management Control",
        "9F70": "Protected Data Envelope 1",
        "9F71": "Protected Data Envelope 2",
        "9F72": "Protected Data Envelope 3",
        "9F73": "Protected Data Envelope 4",
        "9F74": "Protected Data Envelope 5",
        "9F75": "Unprotected Data Envelope 1",
        "9F76": "Unprotected Data Envelope 2",
        "9F77": "Unprotected Data Envelope 3",
        "9F78": "Unprotected Data Envelope 4",
        "9F79": "Unprotected Data Envelope 5",
        "9F7A": "VLP Terminal Support Indicator",
        "9F7B": "VLP Terminal Transaction Limit",
        "9F7C": "Customer Exclusive Data (CED)",
        "9F7D": "DS Summary 1",
        "9F7E": "Mobile Support Indicator",
        "9F7F": "DS Unpredictable Number",
        A5: "File Control Information (FCI) Proprietary Template",
        BF0C: "File Control Information (FCI) Issuer Discretionary Data",
        BF50: "Visa Fleet - CDO",
        BF60: "Integrated Data Storage Record Update Template",
        C3: "Card issuer action code -decline",
        C4: "Card issuer action code -default",
        C5: "Card issuer action code online",
        C6: "PIN Try Limit",
        C7: "CDOL 1 Related Data Length",
        C8: "Card risk management country code",
        C9: "Card risk management currency code",
        CA: "Lower cummulative offline transaction amount",
        CB: "Upper cumulative offline transaction amount",
        CD: "Card Issuer Action Code (PayPass) - Default",
        CE: "Card Issuer Action Code (PayPass) - Online",
        CF: "Card Issuer Action Code (PayPass) - Decline",
        D1: "Currency conversion table",
        D2: "Integrated Data Storage Directory (IDSD)",
        D3: "Additional check table",
        D5: "Application Control",
        D6: "Default ARPC response code",
        D7: "Application Control (PayPass)",
        D8: "AIP (PayPass)",
        D9: "AFL (PayPass)",
        DA: "Static CVC3-TRACK1",
        DB: "Static CVC3-TRACK2",
        DC: "IVCVC3-TRACK1",
        DD: "IVCVC3-TRACK2",
        DF56: "Terminal Action Code - Default",
        DF57: "Terminal Action Code - Denial",
        DF58: "Terminal Action Code - Online",                         
    }[e]) || ""
}

function gettagvalue_text(e) {
    var a, t, n, i, 
    r = {
        "9C": emv_TRT,                          // transaction type
        "9F35": emv_TT,                         // terminal type    
        "9F27": {
            "00": "AAC (declined offline)",
            40: "TC (approved offline)",
            80: "ARQC (go online for host decision)"
        },
        "9F19": {
            "050110030273": "Apple Pay",
            "050120834693": "Google Pay",
            "050174158869": "Fitbit Pay",
            "050183038325": "Garmin Pay",
            "050139059239": "Samsung Pay",
            "040010030273": "Apple Pay",
            "040010075001": "Google Pay",
            "040010043095": "Samsung Pay",
            "040010075196": "Microsoft Pay",
            "040010075338": "Visa checkout",
            "040010075449": "Facebook",
            "040010075839": "Netflix",
            "040010077056": "Fitbit Pay",
            "040010069887": "Garmin Pay"
        },
        "9F1A": emv_Country_Code,
        "5F2A": emv_Currency_Code,
        84: emv_AID
    };

    if ("95" === e.tag && 10 === e.value.length)
        return GetTVRControl(e.value);
    if ("9F0D"=== e.tag && 10 === e.value.length)
        return GetTVRControl(e.value, e.tag);
    if ("9F0E"=== e.tag && 10 === e.value.length)
        return GetTVRControl(e.value, e.tag);
    if ("9F0F"=== e.tag && 10 === e.value.length)
        return GetTVRControl(e.value, e.tag);
    if ("9F10" === e.tag)
        return GetIADControl(e.value);
    if ("82" === e.tag && 4 === e.value.length)
        return GetAIPControl(e.value);
    if ("9F33" == e.tag && 6 === e.value.length)
        return GetTermCapControl(e.value);
    if ("9F34" === e.tag && 6 === e.value.length)
        return GetCVMRControl(e.value);
    if ("9F6E" === e.tag)
        return GetFFI(e.value);
    if ("94" === e.tag) {
        var o = e.value;
        if (o.length % 4 != 0)
            return;
        var l = "";
        for (chunk of o.match(/.{8}/g))
            l += `<tr><td>${sfi = (parseInt(chunk.substr(0, 2), 16) >> 3).toString(16).padStart(2, "0").toUpperCase()}</td><td>${chunk.substr(2, 2)}</td><td>${chunk.substr(4, 2)}</td><td>${chunk.substr(6, 2)}</td></tr>`;
        return `
    <table class="cvmr">
    <colgroup>
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 60%;">
    </colgroup>
    <tbody>
        <tr><th>SFI</th><th>Start record</th><th>End Record</th><th>Number of records included in data authentication</th>
        </tr>
        ${l}
    </tbody>
    </table>`
    }
    if ("9F07" === e.tag)
        return GetAUCControl(e.value);

    if ("8E" === e.tag)
        return GetCVMLControl(e.value);
    
    if ("5F30" === e.tag)
        return 4 === (o = e.value).length ? (first = parseInt(o[1]),
        second = parseInt(o[2]),
        third = parseInt(o[3]),
        void 0 === (o = {
            1: "International use",
            2: "International use, chip (IC) card",
            5: "National use only",
            6: "National use only, chip (IC) card"
        }[first]) && (o = "Unknown"),
        void 0 === (t = {
            0: "Normal",
            2: "Contact issuer via online means",
            4: "Contact issuer via online means except under bilateral agreement"
        }[second]) && (t = "Unknown"),
        void 0 === (n = {
            0: "No restrictions, PIN required",
            1: "No restrictions",
            2: "Goods and services only (no cash)",
            3: "ATM only, PIN required",
            4: "Cash only",
            5: "Goods and services only (no cash), PIN required",
            7: "No restrictions, use PIN where feasible",
            6: "Goods and services only (no cash), use PIN where feasible"
        }[third]) && (n = "Unknown"),
        `
    <table class="cvmr">
    <colgroup>
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 80%;">
    </colgroup>
    <tbody>
        <tr><th>Postion</th><th>Value</th><th>Meaning</th>
        </tr>
        <tr>
            <td>1</td>
            <td>${first}</td>
            <td>${o}</td>
        </tr>
        <tr>
            <td>2</td>
            <td>${second}</td>
            <td>${t}</td>
        </tr>
        <tr>
            <td>3</td>
            <td>${third}</td>
            <td>${n}</td>
        </tr>
    </tbody>
    </table>`) : void 0;
    if ("8C" !== e.tag && "8D" !== e.tag && "9F38" !== e.tag && "9F4F" !== e.tag && "9F49" !== e.tag)
        return "9F0A" === e.tag ? (t = e.value,
        n = {
            "01": "EEA Debit Product",
            "02": "EEA Credit Product",
            "03": "EEA Commercial Product",
            "04": "EEA Pre-paid Product"
        },
        !(t.length < 8) && "0001" === (id = t.substr(0, 4)) && !((len = parseInt(t.substr(4, 2), 16)) < 1 || 2 * len > t.length - 6) && n[(content = t.substr(6, 2 * len)).substr(0, 2)] ? C(n[content.substr(0, 2)]) : void 0) : "9B" === e.tag && 4 === e.value.length ? (a = e.value,
        byte1 = GetBitmapControl(a.substr(0, 2), ["Offline data authentication was performed", "Cardholder verification was performed", "Card risk management was performed", "Issuer Authentication was performed", "Terminal risk management was performed", "Issuer Script processing was performed", "RFU", "RFU"]),
        a = (new Date).getTime().toString(16),
        result = `<nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
            <button class="nav-link active" id="i ${a}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-nav-byte1" type="button" role="tab" aria-controls="i ${a}-nav-byte1" aria-selected="true">Byte 1</button>
            <button class="nav-link disabled" id="i ${a}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-nav-byte2" type="button" role="tab" aria-controls="i ${a}-nav-byte2" aria-selected="true" aria-disabled="true">Byte 2 (RFU)</button>
        </div>
        </nav>
        <div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
        <div class="tab-pane show active" id="i ${a}-nav-byte1" role="tabpanel" aria-labelledby="i ${a}-nav-byte1-tab">${byte1}</div>
        <div class="tab-pane" id="i ${a}-nav-byte2" role="tabpanel" aria-labelledby="i ${a}-nav-byte2-tab"></div>
        </div>`) : "9F6C" === e.tag && 4 === e.value.length ? GetCTQControl(e.value) : "9F66" === e.tag && 8 === e.value.length ? GetTTQControl(e.value) : "9F40" === e.tag && 10 === e.value.length ? Get9F40Control(e.value) : "9F69" === e.tag && 14 === e.value.length ? (i = (a = e.value).substr(0, 2),
        s = a.substr(2, 8),
        a = a.substr(10, 4),
        "01" === i ? `
    <table class="cvmr">
    <colgroup>
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 80%;">
    </colgroup>
    <tbody>
        <tr><th>Byte</th><th>Value</th><th>Meaning</th>
        </tr>
        <tr>
            <td>Byte 1</td>
            <td>${i}</td>
            <td>fDDA Version Number</td>
        </tr>
        <tr>
            <td>Byte 2-5</td>
            <td>${s}</td>
            <td>(Card) Unpredictable Number</td>
        </tr>
        <tr>
            <td>Byte 6-7</td>
            <td>${a}</td>
            <td>Card Transaction Qualifiers</td>
        </tr>
    </tbody>
    </table>` : void 0) : r[tag = (tag = {
            "9F06": "84",
            "4F": "84",
            "5F28": "9F1A",
            "9F42": "5F2A"
        }[e.tag]) || e.tag] && r[tag][e.value] ? C(r[tag][e.value]) : null !== (i = g(e)) ? C(i) : null;
    for (var s = e.value, c = "", d = TLVGenerator(s); ; )
        try {
            if (void 0 === (tag = TLVTag(d)))
                break;
            len = TLVNext(d),
            c += `<tr><td>${tag.str}</td><td>${len}</td><td>${gettagname(tag.str)}</td></tr>`
        } catch (e) {
            return
        }
    return 0 !== c.length ? `
    <table class="cvmr sb_table">
    <colgroup>
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 70%;">
    </colgroup>
    <tbody>
        <tr><th>Tag</th><th>Length (bytes)</th><th>Name</th>
        </tr>
        ${c}
    </tbody>
    </table>` : void 0
}

function GetCVRByte3Control(t, e) {
    return bits = hex2bin(t),
    numOfScripts = parseInt(t[0], 16),
    `<table class="bitmap ">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span class="bgset2">${bits[0]}</span></td><td><span class="bgset2">${bits[1]}</span></td><td><span class="bgset2">${bits[2]}</span></td><td><span class="bgset2">${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="bgunset">${e[0]} (${numOfScripts})</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td></td><td></td><td></td><td><span class="${"1" === bits[4] ? "bgset" : "bgunset"}">${e[1]}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td><span>${bits[5]}</span></td><td></td><td></td><td><span class="${"1" === bits[5] ? "bgset" : "bgunset"}">${e[2]}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><span>${bits[6]}</span></td><td></td><td><span class="${"1" === bits[6] ? "bgset" : "bgunset"}">${e[3]}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span>${bits[7]}</span></td><td><span class="${"1" === bits[7] ? "bgset" : "bgunset"}">${e[4]}</span></td></tr>
</tbody>
</table>`
}

function GetTVRByte5Control(t) {
    return bits = hex2bin(t),
    RRP = {
        "00": "Relay resistance protocol not supported",
        "01": "Relay resistance protocol not performed",
        10: "Relay resistance protocol performed",
        11: "RFU"
    },
    `<table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[0] ? "bgset" : "bgunset"}">Default TDOL used</span></td></tr>
<tr><td></td><td><span>${bits[1]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[1] ? "bgset" : "bgunset"}">Issuer authentication failed</span></td></tr>
<tr><td></td><td></td><td><span>${bits[2]}</span></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[2] ? "bgset" : "bgunset"}">Script processing failed before final GENERATE AC</span></td></tr>
<tr><td></td><td></td><td></td><td><span>${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[3] ? "bgset" : "bgunset"}">Script processing failed after final GENERATE AC</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td></td><td></td><td></td><td><span class="${"1" === bits[4] ? "bgset" : "bgunset"}">Relay resistance threshold exceeded</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td><span>${bits[5]}</span></td><td></td><td></td><td><span class="${"1" === bits[5] ? "bgset" : "bgunset"}">Relay resistance time limits exceeded</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="bgset2">${bits[6]}</span></td><td><span class="bgset2">${bits[7]}</span></td><td><span class="bgunset">${RRP[bits[6] + bits[7]]}</span></td></tr>
</tbody>
</table>`
}

function GetTVRControl(t, tag) {
    let hexaarray = hexa_to_array(t)    
    let hexaint   = array_to_int(hexaarray)

    let panel = emv_bytepanel((tag ? tag + '_TVR' : 'TVR'), (tag ? tag : '9F07'), emv_TVR, {withbar: false, editable:false})
    let content = sb.render(panel)


    emv_byte_update(panel, BigInt(hexaint)) 
    return content;    
/*    
    byte1 = GetBitmapControl(t.substr(0, 2), ["Offline data authentication was not performed", "SDA failed", "ICC data missing", "Card appears on terminal exception file", "DDA failed", "CDA failed", "SDA selected", "RFU"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["ICC and terminal have different application versions", "Expired application", "Application not yet effective", "Service not allowed for card product", "New card", "RFU", "RFU", "RFU"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Cardholder verification was not successful", "Unrecognized CVM", "PIN Try Limit exceeded", "PIN entry required and PIN pad not present or not working", "PIN entry required, PIN pad present, but PIN was not entered", "Online PIN entered", "RFU", "RFU"]),
    byte4 = GetBitmapControl(t.substr(6, 2), ["Transaction exceeds floor limit", "Lower consecutive offline limit exceeded", "Upper consecutive offline limit exceeded", "Transaction selected randomly for online processing", "Merchant forced transaction online", "RFU", "RFU", "RFU"]),
    byte5 = GetTVRByte5Control(t.substr(8, 2));
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
			<button class="nav-link" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true">Byte 5</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" flattitle="TVR Byte 1 (Leftmost):" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane show" id="i ${t}-nav-byte2" role="tabpanel" flattitle="TVR Byte 2:" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane show" id="i ${t}-nav-byte3" role="tabpanel" flattitle="TVR Byte 3:" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane show" id="i ${t}-nav-byte4" role="tabpanel" flattitle="TVR Byte 4:" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		<div class="tab-pane show" id="i ${t}-nav-byte5" role="tabpanel" flattitle="TVR Byte 5 (Rightmost):" aria-labelledby="i ${t}-nav-byte5-tab">${byte5}</div>
		</div>`
*/        
}

function GetAIPControl(t) {
    byte1 = GetBitmapControl(t.substr(0, 2), ["RFU", "SDA Supported", "DDA Supported", "Cardholder verification is supported", "Terminal risk management is to be performed", "Issuer authentication is supported", "RFU", "CDA Supported"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["EMV Mode has been selected", "RFU / OTA capable mobile device", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" flattitle="AIP Byte 1 (Leftmost):" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" flattitle="AIP Byte 2 (Rightmost):" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		</div>`
}
function GetAUCControl(t) {

    let hexaarray = hexa_to_array(t)    
    let haxaint   = array_to_int(hexaarray)

    let panel = emv_bytepanel('R_AUC', '9F07', emv_AUC, {withbar:false, editable:false})
    let content = sb.render(panel)

    emv_byte_update(panel, BigInt(haxaint))
    return content;
/*        
    byte1 = GetBitmapControl(t.substr(0, 2), ["Valid for domestic cash transactions", "Valid for international cash transactions", "Valid for domestic goods", "Valid for international goods", "Valid for domestic services", "Valid for international services", "Valid at ATMs", "Valid at terminals other than ATMs"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Domestic cashback allowed", "International cashback allowed", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 0</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 1</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		</div>`
        */
}
function getCVRuleControl(t, e, a) {
    console.log ("getcvrule")
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
    var e, a = parseInt(t.substr(0, 8), 16), n = parseInt(t.substr(8, 8), 16);
    buf = '<div class="sb_row sb_widget-container" >';
    for (e of t.substr(16).match(/.{4}/g))
        buf += getCVRuleControl(e, a, n);
    return buf += "</div>"
}
function GetTermCapControl(t) {
    byte1 = GetBitmapControl(t.substr(0, 2), ["Manual key entry", "Magnetic stripe", "IC with contacts", "RFU", "RFU", "RFU", "RFU", "RFU"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Plaintext PIN for offline ICC verification", "Enciphered PIN for online verification", "Signature (paper)", "Enciphered PIN for offline verification", "No CVM Required", "RFU", "RFU", "RFU"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Static Data Authentication (SDA)", "Dynamic Data Authentication (DDA)", "Capture card", "RFU", "Combined DDA/Application Cryptogram Generation", "RFU", "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1 - Card Data Input Capability</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2 - CVM Capability</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3 - Security Capability</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" flattitle="Byte 1 - Card Data Input Capability:" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" flattitle="Byte 2 - CVM Capability:" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" flattitle="Byte 3 - Security Capability:" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		</div>`
}
function GetCVMRControl(t) {
    first = 63 & parseInt(t.substr(0, 2), 16),
    second = parseInt(t.substr(2, 2), 16),
    third = parseInt(t.substr(4, 2), 16);
    var e = {
        0: "Fail CVM processing",
        1: "Plaintext PIN verification performed by ICC",
        2: "Enciphered PIN verified online",
        3: "Plaintext PIN verification performed by ICC and signature (paper)",
        4: "Enciphered PIN verification performed by ICC",
        5: "Enciphered PIN verification performed by ICC and signature (paper)",
        6: "Facial biometric verified offline (by ICC)",
        7: "Facial biometric verified online",
        8: "Finger biometric verified offline (by ICC)",
        9: "Finger biometric verified online",
        10: "Palm biometric verified offline (by ICC)",
        11: "Palm biometric verified online",
        12: "Iris biometric verified offline (by ICC)",
        13: "Iris biometric verified online",
        14: "Voice biometric verified offline (by ICC)",
        15: "Voice biometric verified online",
        30: "Signature (paper)",
        31: "No CVM required",
        63: "No CVM Performed"
    }[first]
      , a = (void 0 === e && (e = "Unrecognized"),
    {
        0: "Always",
        1: "If unattended cash",
        2: "If not unattended cash and not manual cash and not purchase with cashback",
        3: "If terminal supports the CVM",
        4: "If manual cash",
        5: "If purchase with cashback",
        6: "If transaction is in the application currency and is under X value",
        7: "If transaction is in the application currency and is over X value",
        8: "If transaction is in the application currency and is under Y value",
        9: "If transaction is in the application currency and is over Y value"
    }[second])
      , n = (void 0 === a && (a = "RFU or Reserved for use by individual payment systems"),
    {
        0: "Unknown",
        1: "Failed",
        2: "Successful"
    }[third]);
    return void 0 === n && (n = "Unrecognized"),
    bits = hex2bin(t.substr(0, 2)),
    bit1_desc = "1" === bits[1] ? "Apply succeeding CV Rule if this CVM is unsuccessful" : "Fail cardholder verification if this CVM is unsuccessful",
    `<div><div class="flat" flattitle="Byte 1 - CVM Performed"><table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="bgunset">RFU</span></td></tr>
<tr><td></td><td><span>${bits[1]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="bgunset">${bit1_desc}</span></td></tr>
<tr><td></td><td></td><td><span>${bits[2]}</span></td><td><span>${bits[3]}</span></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset">${e}</span></td></tr>
</tbody>
</table></div><div class="flat" flattitle="Byte 2 - CVM Condition"><div>${t.substr(2, 2).toUpperCase()} = ${a}</div></div><div class="flat" flattitle="Byte 3 - CVM Result"><div>${t.substr(4, 2).toUpperCase()} = ${n}</div></div></div>`
}
function GetBitmapControl(t, e) {
    bits = hex2bin(t);
    var t = e[0]instanceof Array ? e[0][bits[0]] : e[0]
      , a = e[1]instanceof Array ? e[1][bits[1]] : e[1]
      , n = e[2]instanceof Array ? e[2][bits[2]] : e[2]
      , i = e[3]instanceof Array ? e[3][bits[3]] : e[3]
      , r = e[4]instanceof Array ? e[4][bits[4]] : e[4]
      , s = e[5]instanceof Array ? e[5][bits[5]] : e[5]
      , o = e[6]instanceof Array ? e[6][bits[6]] : e[6]
      , e = e[7]instanceof Array ? e[7][bits[7]] : e[7];
    return `<table class="bitmap sb_table emvbyte">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[0] ? "bgset" : "bgunset"}">${t}</span></td></tr>
<tr><td></td><td><span>${bits[1]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[1] ? "bgset" : "bgunset"}">${a}</span></td></tr>
<tr><td></td><td></td><td><span>${bits[2]}</span></td><td></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[2] ? "bgset" : "bgunset"}">${n}</span></td></tr>
<tr><td></td><td></td><td></td><td><span>${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="${"1" === bits[3] ? "bgset" : "bgunset"}">${i}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td></td><td></td><td></td><td><span class="${"1" === bits[4] ? "bgset" : "bgunset"}">${r}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td><span>${bits[5]}</span></td><td></td><td></td><td><span class="${"1" === bits[5] ? "bgset" : "bgunset"}">${s}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><span>${bits[6]}</span></td><td></td><td><span class="${"1" === bits[6] ? "bgset" : "bgunset"}">${o}</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span>${bits[7]}</span></td><td><span class="${"1" === bits[7] ? "bgset" : "bgunset"}">${e}</span></td></tr>
</tbody>
</table>`
}

function Get9F40Control(t) {
    byte1 = GetBitmapControl(t.substr(0, 2), ["Cash", "Goods", "Services", "Cashback", "Inquiry", "Transfer", "Payment", "Administrative"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Cash Deposit", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Numeric keys", "Alphabetical and special characters keys", "Command keys", "Function keys", "RFU", "RFU", "RFU", "RFU"]),
    byte4 = GetBitmapControl(t.substr(6, 2), ["Print, attendant", "Print, cardholder", "Display, attendant", "Display, cardholder", "RFU", "RFU", "Code table 10", "Code table 9"]),
    byte5 = GetBitmapControl(t.substr(8, 2), ["Code table 8", "Code table 7", "Code table 6", "Code table 5", "Code table 4", "Code table 3", "Code table 2", "Code table 1"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
			<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
				<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
				<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
				<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
				<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
				<button class="nav-link" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true">Byte 5</button>
			</div>
			</nav>
			<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
			<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" flattitle="Byte 1 (Leftmost):" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
			<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" flattitle="Byte 2:" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
			<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" flattitle="Byte 3:" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
			<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" flattitle="Byte 4:" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
			<div class="tab-pane" id="i ${t}-nav-byte5" role="tabpanel" flattitle="Byte 5 (Rightmost):" aria-labelledby="i ${t}-nav-byte5-tab">${byte5}</div>
			</div>`
}

function GetTTQControl(t) {
    byte1 = GetBitmapControl(t.substr(0, 2), ["MSD supported", "RFU", "qVSDC supported", "EMV contact chip supported", "Offline-only reader", "Online PIN supported", "Signature supported", "Offline Data Authentication (ODA) for Online Authorizations supported."]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Online cryptogram required", "CVM required", "(Contact Chip) Offline PIN supported", "RFU", "RFU", "RFU", "RFU", "RFU"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Issuer Update Processing supported", "Mobile functionality supported (CDCVM)", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]),
    byte4 = GetBitmapControl(t.substr(6, 2), ["RFU", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" flattitle="Byte 1:" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" flattitle="Byte 2:" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" flattitle="Byte 3:" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" flattitle="Byte 4:" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		</div>`
}

function GetIADControl(t) {
    return 64 === t.length && "0F" === t.substr(0, 2) && "0F" === t.substr(32, 2) ? GetIADCCDCompliant(t) : 14 <= t.length && "06" == t.substr(0, 2) && "03" == t.substr(6, 2) || "1F" == t.substr(0, 2) && 64 == t.length ? GetIADVisa(t) : 36 === t.length || 40 === t.length || 52 === t.length || 56 === t.length ? GetIADMastercardMChip(t) : void 0
}

function GetCTQControl(t) {
    byte1 = GetBitmapControl(t.substr(0, 2), ["Online PIN Required", "Signature Required", "Go Online if Offline Data Authentication Fails and Reader is online capable", "Switch Interface if Offline Data Authentication fails and Reader supports contact chip", "Go Online if Application Expired", "Switch Interface for (manual) Cash Transactions", "Switch Interface for Cashback Transactions", ["Valid for contactless ATM transactions", "Not valid for contactless ATM transactions"]]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["CDCVM Performed", "Card supports Issuer Update Processing at the POS", "RFU", "RFU", "RFU", "RFU", "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" flattitle="Byte 1:" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" flattitle="Byte 2:" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		</div>`
}




function GetCVRBasicControl(t) {
    byte1 = GetCVRByte1Control(t.substr(0, 2), ["Cryptogram returned in second GENERATE AC", "Cryptogram returned in first GENERATE AC", "Issuer Authentication performed and failed", "Offline PIN verification performed", "Offline PIN verification failed", "Unable to go online"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Last online transaction not completed", "PIN Try Limit exceeded", "Exceeded velocity checking counters", "New card", "Issuer Authentication failure on last online transaction", "Issuer Authentication not performed after online authorization", "Application blocked by card because PIN Try Limit exceeded", "Offline static data authentication failed on last transaction"]),
    byte3 = GetCVRByte3Control(t.substr(4, 2), ["Number of Issuer Script Commands", "Issuer Script processing failed", "Offline dynamic data authentication failed on last transaction", "Offline dynamic data authentication performed", "PIN verification command not received for a PIN-Expecting card"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		</div>`
}
function GetCVRIADFormat2Control(t) {
    byte2 = GetCVRByte1Control(t.substr(2, 2), ["Cryptogram returned in second GENERATE AC", "Cryptogram returned in first GENERATE AC", "Issuer Authentication performed and failed", "Offline PIN verification performed", "Offline PIN verification failed", "Unable to go online"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Last online transaction not completed", "PIN Try Limit exceeded", "Exceeded velocity checking counters", "New card", "Issuer Authentication failure on last online transaction", "Issuer Authentication not performed after online authorization", "Application blocked by card because PIN Try Limit exceeded", "Offline static data authentication failed on last transaction"]),
    byte4 = GetCVRByte3Control(t.substr(6, 2), ["Number of Issuer Script Commands", "Issuer Script processing failed", "Offline dynamic data authentication failed on last transaction", "Offline dynamic data authentication performed", "PIN verification command not received for a PIN-Expecting card"]),
    byte5 = GetBitmapControl(t.substr(8, 2), ["RFU", "RFU", "RFU", "RFU", "RFU", "RFU", "CDCVM Successfully Performed", "Secure Messaging uses EMV Session keybased derivation"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link disabled" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true" aria-disabled="true">Byte 1 (RFU)</button>
			<button class="nav-link active" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
			<button class="nav-link" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true">Byte 5</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab"></div>
		<div class="tab-pane show active" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		<div class="tab-pane" id="i ${t}-nav-byte5" role="tabpanel" aria-labelledby="i ${t}-nav-byte5-tab">${byte5}</div>
		</div>`
}
function GetIAD4CVRByte1Control(t) {
    return CVMVERENT = {
        "0000": "No CD CVM was verified",
        "0001": "VMPA",
        "0010": "MG",
        "0011": "Co-residing SE app",
        "0100": "TEE app",
        "0101": "Mobile Application",
        "0110": "Terminal",
        "0111": "Verified in the cloud",
        1e3: "Verified by the mobile device OS"
    },
    CVMVERTYP = {
        "0000": "No CD CVM",
        "0001": "Passcode",
        "0010": "Finger biometric",
        "0011": "Mobile device pattern",
        "0100": "Facial biometric",
        "0101": "Iris biometric",
        "0110": "Voice biometric",
        "0111": "Palm biometric",
        1101: "Signature",
        1110: "Online PIN"
    },
    bits = hex2bin(t),
    void 0 === (entity = CVMVERENT[bits.substr(0, 4)]) && (entity = "RFU"),
    void 0 === (type = CVMVERTYP[bits.substr(4)]) && (type = "Unrecognized"),
    `<table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td><span>${bits[1]}</span></td><td><span>${bits[2]}</span></td><td><span>${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="bgunset">CVM Verifying Entity (${entity})</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset"}">CVM Verified Type (${type})</span></td></tr>
</tbody>
</table>`
}
function GetIAD4CVRByte2Control(t) {
    return CRYPTYP = {
        "00": "AAC returned in GPO",
        "01": "TC returned in GPO",
        10: "ARQC returned in GPO",
        11: "Application is disabled"
    },
    bits = hex2bin(t),
    void 0 === (ac = CRYPTYP[bits.substr(2, 2)]) && (ac = "Unrecognized"),
    `<table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td><span>${bits[1]}</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="bgunset">RFU</span></td></tr>
<tr><td></td><td></td><td><span class="bgset2">${bits[2]}</span></td><td><span  class="bgset2">${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="bgunset">AC (${ac})</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset"}">RFU</span></td></tr>
</tbody>
</table>`
}
function FFIMC(t) {
    return country = t.substr(0, 4),
    void 0 === (country_meaning = CNTR[country.substr(1)]) && (country_meaning = "Unrecognized"),
    uniqid = t.substr(4, 4),
    uniqid_meaning = "",
    "0000" === uniqid && (uniqid_meaning = "Proprietary Data not used"),
    devicetype = t.substr(8, 4),
    devicetype_a = hex2a(devicetype),
    void 0 === (devicetype_meaning = {
        "00": "Card",
        "01": "Mobile Network Operator (MNO) controlled removable secure element (SIM or UICC) personalized for use with a mobile phone or smartphone",
        "02": "Key Fob",
        "03": "Watch using a contactless chip or a fixed (non-removable) secure element not controlled by the MNO",
        "04": "Mobile Tag",
        "05": "Wristband",
        "06": "Mobile Phone Case or Sleeve",
        "07": "Mobile phone or smartphone with a fixed (non-removable) secure element controlled by the MNO, for example, code division multiple access (CDMA)",
        "08": "Removable secure element not controlled by the MNO, for example, memory card personalized for used with a mobile phone or smartphone",
        "09": "Mobile Phone or smartphone with a fixed (non-removable) secure element not controlled by the MNO",
        10: "MNO controlled removable secure element (SIM or UICC) personalized for use with a tablet or e-book",
        11: "Tablet or e-book with a fixed (non-removable) secure element controlled by the MNO",
        12: "Removable secure element not controlled by the MNO, for example, memory card personalized for use with a tablet or e-book",
        13: "Tablet or e-book with fixed (non-removable) secure element not controlled by the MNO",
        14: "Mobile phone or smartphone with a payment application running in a host processor",
        15: "Tablet or e-book with a payment application running in a host processor",
        16: "Mobile phone or smartphone with a payment application running in the Trusted Execution Environment (TEE) of a host processor",
        17: "Tablet or e-book with a payment application running in the TEE of a host processor",
        18: "Watch with a payment application running in the TEE of a host processor",
        19: "Watch with a payment application running in a host processor",
        20: "Card",
        21: "Phone (Mobile phone)",
        22: "Tablet/e-reader (Tablet computer or e-reader)",
        23: "Watch/Wristband (Watch or wristband, including a fitness band, smart strap, disposable band, watch add-on, and security/ID band)",
        24: "Sticker",
        25: "PC (PC or laptop)",
        26: "Device Peripheral (Mobile phone case or sleeve)",
        27: "Tag (Key fob or mobile tag)",
        28: "Jewelry (Ring, bracelet, necklace, and cuff links)",
        29: "Fashion Accessory (Handbag, bag charm, and glasses)",
        30: "Garment (Dress)",
        31: "Domestic Appliance (Refrigerator, washing machine)",
        32: "Vehicle (Vehicle, including vehicle attached devices)",
        33: "Media/Gaming Device (Media or gaming device, including a set top box, media player, and television)"
    }[devicetype_a]) && (devicetype_meaning = "Unrecognized"),
    propdata = t.substr(12),
    `
	<table class="cvmr">
    <colgroup>
       <col span="1" style="width: 25%;">
       <col span="1" style="width: 15%;">
       <col span="1" style="width: 60%;">
    </colgroup>
    <tbody>
	    <tr><th>Data field</th><th>Value</th><th>Meaning</th>
		</tr>
        <tr>
            <td>Country Code</td>
            <td>${country}</td>
            <td>${country_meaning}</td>
        </tr>
		<tr>
            <td>Unique Identifier</td>
            <td>${uniqid}</td>
            <td>${uniqid_meaning}</td>
        </tr>
		<tr>
            <td>Device Type</td>
			<td>${devicetype} (${devicetype_a})</td>
            <td>${devicetype_meaning}</td>
        </tr>
		<tr>
            <td>Proprietary Data</td>
            <td>${propdata}</td>
            <td></td>
        </tr>
    </tbody>
	</table>`
}
function FFIVisa_Byte1(t) {
    return FORMFACTOR = {
        "00000": "Standard card",
        "00001": "Mini-card",
        "00010": "Non-card Form Factor",
        "00011": "Consumer mobile phone",
        "00100": "Wrist-worn device"
    },
    bits = hex2bin(t),
    void 0 === (device = FORMFACTOR[bits.substr(3)]) && (device = "Unrecognized"),
    `<table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td><span>${bits[1]}</span></td><td><span>${bits[2]}</span></td><td></td><td></td><td></td><td></td><td></td><td><span class="bgunset">Form Factor Indicator (FFI) Version</span></td></tr>
<tr><td></td><td></td><td></td><td><span>${bits[3]}</span></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset"}">${device}</span></td></tr>
</tbody>
</table>`
}
function FFIVisa_Byte3(t) {
    return bits = hex2bin(t),
    void 0 === (techn = {
        "0000": "Proximity: Contactless interface using [ISO 14443] (including NFC)",
        "0001": "Not used in VCPSd"
    }[bits.substr(4)]) && (techn = "Unrecognized"),
    `<table class="bitmap">
<tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
<tr><td><span>${bits[0]}</span></td><td><span>${bits[1]}</span></td><td><span>${bits[2]}</span></td><td><span>${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="bgunset">RFU</span></td></tr>
<tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset"}">${techn}</span></td></tr>
</tbody>
</table>`
}
function FFIVisa(t) {
    byte1 = FFIVisa_Byte1(t.substr(0, 2)),
    byte2 = GetBitmapControl(t.substr(2, 2), ["Passcode Capable", "Signature Panel", "Hologram", "CVV2", "Two-way Messaging", "Cloud Based Payment Credentials", "Biometric Cardholder Verification Capable", "RFU"]),
    byte3 = "",
    byte4 = FFIVisa_Byte3(t.substr(6, 2));
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1 - Form Factor</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2 - Device Features</button>
			<button class="nav-link disabled" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true" aria-disabled="true">Byte 3 - RFU</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4 - Technology</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		</div>`
}
function GetFFI(t) {
    return 8 == t.length ? FFIVisa(t) : 14 <= t.length ? FFIMC(t) : void 0
}


function GetCVRIADFormat4Control(t) {
    byte1 = GetIAD4CVRByte1Control(t.substr(0, 2)),
    byte2 = GetIAD4CVRByte2Control(t.substr(2, 2)),
    byte3 = GetBitmapControl(t.substr(4, 2), ["RFU", "Passcode Try Limit Exceeded", "Exceeded Velocity Checking Counters", "RFU", "Issuer Authentication failure on last transaction", "RFU", "RFU", "RFU"]),
    byte4 = GetCVRByte3Control(t.substr(6, 2), ["Number of Issuer Script Commands", "RFU", "RFU", "RFU", "RFU"]),
    byte5 = GetBitmapControl(t.substr(8, 2), [["Consumer Device is not in debug mode", "A debugger is attached while the Mobile Application is in use"], ["Consumer Device is not a rooted device", "A device is attempting to use the Mobile Application after the device has been rooted"], ["Mobile Application is not hooked", "An attacker has overridden a called function that resides in the Mobile Application"], ["Mobile Application integrity is intact", "Mobile Application integrity failure"], ["Consumer Device has data connectivity", "Data Connectivity is deliberately disabled on Consumer Device"], ["Consumer Device is genuine", "Consumer Device is an emulator"], "RFU", "RFU"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
			<button class="nav-link" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true">Byte 5</button>
			<button class="nav-link disabled" id="i ${t}-nav-byte6-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte6" type="button" role="tab" aria-controls="i ${t}-nav-byte6" aria-selected="true" aria-disabled="true">Byte 6 (RFU)</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		<div class="tab-pane" id="i ${t}-nav-byte5" role="tabpanel" aria-labelledby="i ${t}-nav-byte5-tab">${byte5}</div>
		<div class="tab-pane" id="i ${t}-nav-byte6" role="tabpanel" aria-labelledby="i ${t}-nav-byte6-tab"></div>
		</div>`
}
function getDateFromHours(t) {
    var e = new Date((new Date).getFullYear(),0,1);
    e.setTime(e.getTime() + 60 * parseInt(t) * 60 * 1e3);
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][e.getMonth()] + " " + e.getDate() + "; " + e.getHours() + ":00"
}
function GetIADInfoControl(e) {
    if (14 <= e.length) {
        if ("06" == e.substr(0, 2) && "03" == e.substr(6, 2))
            return general = "Application: VSDC<br>IAD Format: " + e.substr(4, 1) + "<br>Key Derivation Index: " + e.substr(2, 2) + "<br>Cryptogram Version Number: " + e.substr(4, 2) + " (CVN " + parseInt(e.substr(4, 2), 16) + ")<br>Card Verification Results (CVR): " + e.substr(8, 6),
            cvr = GetCVRBasicControl(e.substr(8, 6)),
            14 < e.length && (general = general + "<br><br>Issuer Discretionary Data (IDD): " + e.substr(14) + "<br>",
            36 == e.length && "0A" == e.substr(14, 2) ? (general = general + "IDD Option ID: " + e[17] + "<br>",
            "1" == e[17] ? general = general + "<ul><li>VLP Available Funds: " + e.substr(18, 10) + "</li>    <li>MAC: " + e.substr(28, 8) + "</li></ul>" : "2" == e[17] ? general = general + "<ul><li>Cumulative Total Transaction Amount (CTTA): " + e.substr(18, 10) + "</li>    <li>MAC: " + e.substr(28, 8) + "</li></ul>" : "5" == e[17] && (general = general + "<ul><li>Available Offline Spending Amount (AOSA): " + e.substr(18, 10) + "</li>    <li>MAC: " + e.substr(28, 8) + "</li></ul>")) : 46 == e.length && "0F" == e.substr(14, 2) && (general = general + "IDD Option ID: " + e[17] + "<br>",
            "3" == e[17] ? general = general + "<ul><li>VLP Available Funds: " + e.substr(18, 10) + "</li>    <li>Cumulative Total Transaction Amount (CTTA): " + e.substr(28, 10) + "</li>    <li>MAC: " + e.substr(38, 8) + "</li></ul>" : "4" == e[17] && (general = general + "<ul><li>Cumulative Total Transaction Amount (CTTA): " + e.substr(18, 10) + "</li>    <li>Cumulative Total Transaction Amount Limit (CTTAL): " + e.substr(28, 10) + "</li>    <li>MAC: " + e.substr(38, 8) + "</li></ul>"))),
            [general, cvr];
        if ("1F" === e.substr(0, 2) && 64 === e.length) {
            if ("22" == e.substr(2, 2) || "2C" == e.substr(2, 2))
                return general = "Application: VSDC<br>IAD Format: 2<br>Key Derivation Index: " + e.substr(4, 2) + "<br>Cryptogram Version Number: " + e.substr(2, 2) + " (CVN " + parseInt(e.substr(2, 2), 16) + ")<br>Card Verification Results (CVR): " + e.substr(6, 10),
                cvr = GetCVRIADFormat2Control(e.substr(6, 10)),
                [general = (general = general + "<br><br>Issuer Discretionary Data (IDD): " + e.substr(16) + "<br>") + "IDD Option ID: " + e[17] + "<br>", cvr];
            if ("43" === e.substr(2, 2))
                return general = "Application: VSDC<br>IAD Format: 4<br>Cryptogram Version Number: 43 (Limited Use Key Cryptogram)<br>Derivation Key Indicator: " + e.substr(4, 2) + "<br>Card Verification Results (CVR): " + e.substr(6, 12) + "<br>Digital Wallet Provider ID: " + e.substr(18, 8) + "<br>Derivation Data (0YHHHHCC): " + e.substr(26, 8) + "<br><ul><li>Y (least significant digit of the current year): " + e.substr(26, 8).substr(1, 1) + "</li><li>HHHH (number of hours since January 1st): " + e.substr(26, 8).substr(2, 4) + " (" + getDateFromHours(e.substr(26, 8).substr(2, 4)) + ")</li><li>CC (Limited Use Key counter): " + e.substr(26, 8).substr(6, 2) + "</li></ul>IDD Format: " + e.substr(34, 2) + "<br>IDD: " + e.substr(36),
                cvr = GetCVRIADFormat4Control(e.substr(6, 12)),
                [general, cvr];
            if ("4A" === e.substr(2, 2)) {
                var a = {
                    10030273: "Apple Pay",
                    20834693: "Google Pay",
                    74158869: "Fitbit Pay",
                    83038325: "Garmin Pay",
                    39059239: "Samsung Pay",
                    10075001: "Google Pay",
                    10043095: "Samsung Pay",
                    10075196: "Microsoft Pay",
                    10075338: "Visa checkout",
                    10075449: "Facebook",
                    10075839: "Netflix",
                    10077056: "Fitbit Pay",
                    10069887: "Garmin Pay"
                }
                  , n = (general = `<div class="alert alert-warning" role="alert">
					⚠ Below is just an assumption.<br> If you have documentation describing the format of cryptogram version 4A, we would be very grateful if you could share it.
				</div>`,
                e.substr(18, 8));
                let t = void 0 !== a[n] ? ` (${a[n]})` : "";
                return general += "Application: VSDC<br>IAD Format: 4<br>Cryptogram Version Number: 4A (Unknown)<br>Derivation Key Indicator: " + e.substr(4, 2) + "<br>Card Verification Results (CVR): " + e.substr(6, 12) + "<br>Token Requestor: " + n + t + "<br>Unknown: " + e.substr(26),
                cvr = GetCVRIADFormat4Control(e.substr(6, 12)),
                [general, cvr]
            }
        }
    }
    return [void 0, void 0]
}

function GetCVRByte3Control_Mastercard(t) {
    return bits = hex2bin(t),
    numOfScripts = parseInt(t[0], 16),
    pinTryCounter = parseInt(t[1], 16),
    `<table class="bitmap">
        <tbody><tr><th>b8</th><th>b7</th><th>b6</th><th>b5</th><th>b4</th><th>b3</th><th>b2</th><th>b1</th><th>Meaning</th></tr>
        <tr><td><span>${bits[0]}</span></td><td><span>${bits[1]}</span></td><td><span>${bits[2]}</span></td><td><span>${bits[3]}</span></td><td></td><td></td><td></td><td></td><td><span class="bgunset">Script Counter (${numOfScripts})</span></td></tr>
        <tr><td></td><td></td><td></td><td></td><td><span>${bits[4]}</span></td><td><span>${bits[5]}</span></td><td><span>${bits[6]}</span></td><td><span>${bits[7]}</span></td><td><span class="bgunset"}">PIN Try Counter (${pinTryCounter})</span></td></tr>
        </tbody>
    </table>`
}

function isMChipAdvance(t) {
    var e, a, n = t.substr(4, 12);
    return 40 === t.length || 52 === t.length || 56 === t.length || (t = hex2bin(n.substr(0, 2)),
    e = hex2bin(n.substr(2, 2)),
    a = hex2bin(n.substr(6, 2)),
    n = hex2bin(n.substr(10, 2)),
    "1" === t[4]) || "1" === e[5] || "1" === e[6] || "1" === e[7] || "1" === a[0] || null !== n.substr(0, 6).match(/1/)
}

function GetCVRMastercardMChip(t, e) {
    byte1 = GetCVRByte1Control(t.substr(0, 2), ["AC Returned In Second GENERATE AC", "AC Returned In First GENERATE AC", e ? "Date Check Failed" : "RFU", "Offline PIN Verification Performed", "Offline Encrypted PIN Verification Performed", "Offline PIN Verification Successful"]),
    byte2 = GetBitmapControl(t.substr(2, 2), ["DDA Returned", "Combined DDA/AC Generation Returned In First GENERATE AC", "Combined DDA/AC Generation Returned In Second GENERATE AC", "Issuer Authentication Performed", "CIAC – Default Skipped On CAT3", e ? "Offline Change PIN Result" : "RFU", e ? "Issuer Discretionary (M/Chip Advance)" : "RFU", e ? "Issuer Discretionary (contactless interface)" : "RFU"]),
    byte3 = GetCVRByte3Control_Mastercard(t.substr(4, 2)),
    byte4 = GetBitmapControl(t.substr(6, 2), [e ? "Last Online Transaction Not Completed" : "RFU", "Unable To Go Online Indicated ", "Offline PIN Verification Not Performed", "Offline PIN Verification Failed", "PTL Exceeded ", "International Transaction", "Domestic Transaction", "Terminal Erroneously Considers Offline PIN OK"]),
    byte5 = GetBitmapControl(t.substr(8, 2), [e ? "Lower Consecutive Counter 1 Limit Exceeded" : "Lower Consecutive Offline Limit Exceeded", e ? "Upper Consecutive Counter 1 Limit Exceeded" : "Upper Consecutive Offline Limit Exceeded", e ? "Lower Cumulative Accumulator 1 Limit Exceeded" : "Lower Cumulative Offline Limit Exceeded", e ? "Upper Cumulative Accumulator 1 Limit Exceeded" : "Upper Cumulative Offline Limit Exceeded", "Go Online On Next Transaction Was Set", "Issuer Authentication Failed", "Script Received", "Script Failed"]),
    byte6 = GetBitmapControl(t.substr(10, 2), [e ? "Lower Consecutive Counter 2 Limit Exceeded" : "RFU", e ? "Upper Consecutive Counter 2 Limit Exceeded" : "RFU", e ? "Lower Cumulative Accumulator 2 Limit Exceeded" : "RFU", e ? "Upper Cumulative Accumulator 2 Limit Exceeded" : "RFU", e ? "MTA Limit Exceeded" : "RFU", e ? "Number Of Days Offline Limit Exceeded" : "RFU", "Match Found In Additional Check Table", "No Match Found In Additional Check Table"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
			<button class="nav-link" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true">Byte 5</button>
			<button class="nav-link" id="i ${t}-nav-byte6-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte6" type="button" role="tab" aria-controls="i ${t}-nav-byte6" aria-selected="true">Byte 6</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		<div class="tab-pane" id="i ${t}-nav-byte5" role="tabpanel" aria-labelledby="i ${t}-nav-byte5-tab">${byte5}</div>
		<div class="tab-pane" id="i ${t}-nav-byte6" role="tabpanel" aria-labelledby="i ${t}-nav-byte5-tab">${byte6}</div>
		</div>`
}

function GetMChipCountersString(t) {
    return null === t.match(/[a-fA-F]/) ? "<ul><li>Cumulative Offline Transaction Amount: " + t.substr(0, 12) + "</li><li>Consecutive Offline Transactions Number: " + t.substr(12, 2) + "</li></ul>" : ""
}

function GetIADGeneralMastercardMChip(t, e) {
    var a = t.substr(0, 2)
      , n = t.substr(2, 2)
      , i = t.substr(4, 12)
      , r = t.substr(16, 4)
      , t = t.substr(20);
    return cvn_bits = hex2bin(n),
    skeys = {
        "00": "Mastercard Proprietary SKD session key",
        10: "EMV CSK session key"
    }[cvn_bits[5] + cvn_bits[6]],
    cntinc = {
        0: "Counters not included in AC data",
        1: "Counter included in AC data"
    }[cvn_bits[7]],
    general = "Application: M/Chip " + (e ? "Advance" : "4") + "<br>Key Derivation Index: " + a + "<br>Cryptogram Version Number: " + n + "<br>",
    void 0 !== skeys && void 0 !== cntinc && (general += "<ul><li>Session key used for AC computation: " + skeys + "</li><li>Counters included in AC computation: " + cntinc + "</li></ul>"),
    general = general + ("Card Verification Results (CVR): " + i + "<br>") + ("DAC/ICC Dynamic Number: " + r + "<br>"),
    16 === t.length || 32 === t.length ? general += "Counters/Accumulators: " + t + "<br>" : 20 !== t.length && 36 !== t.length || (general = (general += "Last Online ATC: " + t.substr(-4) + "<br>") + "Counters/Accumulators: " + t.substr(0, t.length - 4) + "<br>"),
    "FF" === t.substr(14, 2) && (general += GetMChipCountersString(t.substr(0, 14))),
    general
}
function GetIADGeneralCCD(t) {
    var e = t.substr(2, 2)
      , a = t.substr(4, 2)
      , n = t.substr(6, 10)
      , i = t.substr(16, 16)
      , t = t.substr(34);
    return void 0 === (algo = {
        "0101": "(Triple DES)",
        "0110": "(AES)"
    }[hex2bin(e).substr(-4)]) && (algo = ""),
    general = "Application: CCD-Compliant<br>",
    general += "Common Core Identifier: " + e + "<br>",
    "A" === e[0] && (general += "<ul><li>CCD Version 4.1 Cryptogram Version " + algo + "</li></ul>"),
    general += "Derivation Key Index: " + a + "<br>Card Verification Results (CVR): " + n + "<br>Counters: " + i + "<br>Issuer Discretionary Data: " + t + "<br>"
}
function GetCVRCCD(t) {
    byte1 = GetCVRByte1Control(t.substr(0, 2), ["AC Returned In Second GENERATE AC", "AC Returned In First GENERATE AC", "CDA Performed", "Offline DDA Performed", "Issuer Authentication Not Performed", "Issuer Authentication Failed"]),
    byte2 = GetCVRByte3Control(t.substr(2, 2), ["PIN Try Counter", "Offline PIN Verification Performed", "Offline PIN Verification Performed and PIN Not Successfully Verified", "PIN Try Limit Exceeded", "Last Online Transaction Not Completed"]),
    byte3 = GetBitmapControl(t.substr(4, 2), ["Lower Offline Transaction Count Limit Exceeded", "Upper Offline Transaction Count Limit Exceeded", "Lower Cumulative Offline Amount Limit Exceeded", "Upper Cumulative Offline Amount Limit Exceeded", "Issuer-discretionary bit 1", "Issuer-discretionary bit 2", "Issuer-discretionary bit 3", "Issuer-discretionary bit 4"]),
    byte4 = GetCVRByte3Control(t.substr(6, 2), ["Number of Successfully Processed Issuer Script Commands", "Issuer Script Processing Failed", "Offline Data Authentication Failed on Previous Transaction", "Go Online on Next Transaction was set", "Unable to go Online"]);
    t = (new Date).getTime().toString(16);
    return result = `<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
			<button class="nav-link active" id="i ${t}-nav-byte1-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte1" type="button" role="tab" aria-controls="i ${t}-nav-byte1" aria-selected="true">Byte 1</button>
			<button class="nav-link" id="i ${t}-nav-byte2-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte2" type="button" role="tab" aria-controls="i ${t}-nav-byte2" aria-selected="true">Byte 2</button>
			<button class="nav-link" id="i ${t}-nav-byte3-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte3" type="button" role="tab" aria-controls="i ${t}-nav-byte3" aria-selected="true">Byte 3</button>
			<button class="nav-link" id="i ${t}-nav-byte4-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte4" type="button" role="tab" aria-controls="i ${t}-nav-byte4" aria-selected="true">Byte 4</button>
			<button class="nav-link disabled" id="i ${t}-nav-byte5-tab" data-bs-toggle="tab" data-bs-target="#i ${t}-nav-byte5" type="button" role="tab" aria-controls="i ${t}-nav-byte5" aria-selected="true" aria-disabled="true">Byte 5 (RFU)</button>
		</div>
		</nav>
		<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px;">
		<div class="tab-pane show active" id="i ${t}-nav-byte1" role="tabpanel" aria-labelledby="i ${t}-nav-byte1-tab">${byte1}</div>
		<div class="tab-pane" id="i ${t}-nav-byte2" role="tabpanel" aria-labelledby="i ${t}-nav-byte2-tab">${byte2}</div>
		<div class="tab-pane" id="i ${t}-nav-byte3" role="tabpanel" aria-labelledby="i ${t}-nav-byte3-tab">${byte3}</div>
		<div class="tab-pane" id="i ${t}-nav-byte4" role="tabpanel" aria-labelledby="i ${t}-nav-byte4-tab">${byte4}</div>
		<div class="tab-pane" id="i ${t}-nav-byte5" role="tabpanel" aria-labelledby="i ${t}-nav-byte5-tab"></div>
		</div>`
}
function GetIADCCDCompliant(t) {
    var e = GetIADGeneralCCD(t)
      , t = GetCVRCCD(t.substr(6, 10))
      , a = (new Date).getTime().toString(16);
    return result = `<nav>
			<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
				<button class="nav-link active" id="i ${a}-general-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-general" type="button" role="tab" aria-controls="i ${a}-general" aria-selected="true">General</button>
				<button class="nav-link" id="i ${a}-cvr-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-cvr" type="button" role="tab" aria-controls="i ${a}-cvr" aria-selected="true">CVR</button>
			</div>
			</nav>
			<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px; height:250px; ">
			<div class="tab-pane show active" id="i ${a}-general" role="tabpanel" aria-labelledby="i ${a}-general-tab">
			<div style="overflow:auto; border:1px solid #ced4da; padding: .25rem .5rem; border-radius: 0.2rem;">${e}</div>
			</div>
			<div class="tab-pane" id="i ${a}-cvr" role="tabpanel" aria-labelledby="i ${a}-cvr-tab">${t}</div>
			</div>`
}

function GetIADMastercardMChip(t) {
    var e = GetIADGeneralMastercardMChip(t, advance = isMChipAdvance(t))
      , t = GetCVRMastercardMChip(t.substr(4, 12), advance)
      , a = (new Date).getTime().toString(16);
    return result = `<nav>
			<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
				<button class="nav-link active" id="i ${a}-general-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-general" type="button" role="tab" aria-controls="i ${a}-general" aria-selected="true">General</button>
				<button class="nav-link" id="i ${a}-cvr-tab" data-bs-toggle="tab" data-bs-target="#i ${a}-cvr" type="button" role="tab" aria-controls="i ${a}-cvr" aria-selected="true">CVR</button>
			</div>
			</nav>
			<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px; height:250px; ">
			<div class="tab-pane show active" id="i ${a}-general" role="tabpanel" aria-labelledby="i ${a}-general-tab">
			<div style="overflow:auto; border:1px solid #ced4da; padding: .25rem .5rem; border-radius: 0.2rem;">${e}</div>
			</div>
			<div class="tab-pane" id="i ${a}-cvr" role="tabpanel" aria-labelledby="i ${a}-cvr-tab">${t}</div>
			</div>`
}

function GetIADVisa(t) {
    var e = void 0
      , [t,a] = GetIADInfoControl(t)
      , n = (new Date).getTime().toString(16);
    return e = t ? `<nav>
			<div class="nav nav-tabs" id="nav-tab" role="tablist" style="margin-bottom: 10px; font-size: 0.9rem;">
				<button class="nav-link active" id="i ${n}-general-tab" data-bs-toggle="tab" data-bs-target="#i ${n}-general" type="button" role="tab" aria-controls="i ${n}-general" aria-selected="true">General</button>
				<button class="nav-link" id="i ${n}-cvr-tab" data-bs-toggle="tab" data-bs-target="#i ${n}-cvr" type="button" role="tab" aria-controls="i ${n}-cvr" aria-selected="true">CVR</button>
			</div>
			</nav>
			<div class="tab-content" id="nav-tabContent" style="margin-bottom: 20px; height:250px;">
			<div class="tab-pane show active" id="i ${n}-general" role="tabpanel" aria-labelledby="i ${n}-general-tab">
			<div style="overflow:auto; border: 1px solid #ced4da;padding: .25rem .5rem;border-radius: 0.2rem;">${t}</div>
			</div>
			<div class="tab-pane" id="i ${n}-cvr" role="tabpanel" aria-labelledby="i ${n}-cvr-tab">${a}</div>
			</div>` : e
}

function hex2bin(t) {
    return parseInt(t, 16).toString(2).padStart(8, "0")
}

function validateInput(t, e) {  
    var a = t.val();
    return 0 === a.length ? setStatus(t, "invalid", "Provide a value") : e.test(a) ? setStatus(t, "valid", "") : setStatus(t, "invalid", "Invalid input"),
    a
}

function validatePANInput(t) {
    var e = validateInput(t, /^[0-9]{13,19}$/);
    return t.hasClass("is-invalid") || checkLuhn(e) || setStatus(t, "optional", "Luhn checksum failed"),
    e
}

function validatePINInput(t) {
    return validateInput(t, /^[0-9]{4,12}$/)
}

function validateDataInput(t) {
    return 0 != (value = t.val()).length ? /^[0-9a-fA-F]+$/.test(value) ? 16 != value.length ? setStatus(t, "invalid", "Should contain 16 hex digits") : setStatus(t, "valid", "") : setStatus(t, "invalid", "Only hex digits accepted") : setStatus(t, "invalid", "Provide a value"),
    value
}
function validateKeyInput(t, e=/^[0-9a-fA-F]{16}$|^[0-9a-fA-F]{32}$|^[0-9a-fA-F]{48}$/) {
    e = validateInput(t, e);
    return t.hasClass("is-invalid") || (checkParity(e) ? setStatus(t, "valid", "KCV: " + des_key_kcv(e)) : setStatus(t, "optional", "Key parity error")),
    e
}

function resetStatus(t) {
    t.removeClass("is-valid"),
    t.removeClass("is-invalid"),
    t.removeClass("is-optional")
}

function setStatus(t, e, a) {
    resetStatus(t),
    t.addClass("is-" + e);
    var n = t.attr(e + "-feedback");
    (n ? $("#" + n) : t.siblings(`.${e}-feedback`)).text(a)
}

function checkParity(t) {
    var e = {
        0: "0000",
        1: "0001",
        2: "0010",
        3: "0011",
        4: "0100",
        5: "0101",
        6: "0110",
        7: "0111",
        8: "1000",
        9: "1001",
        A: "1010",
        B: "1011",
        C: "1100",
        D: "1101",
        E: "1110",
        F: "1111",
        a: "1010",
        b: "1011",
        c: "1100",
        d: "1101",
        e: "1110",
        f: "1111"
    };
    result = !0;
    for (byte of t.match(/.{2}/g))
        if (binary = e[byte[0]] + e[byte[1]],
        !(oddparity = (binary.match(/1/g) || []).length % 2)) {
            result = !1;
            break
        }
    return result
}

function xor(t, e) {
    return result = ((parseInt(t.substr(0, 8), 16) ^ parseInt(e.substr(0, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase(),
    result += ((parseInt(t.substr(8, 8), 16) ^ parseInt(e.substr(8, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase()
}

function op_and(t, e) {
    return result = ((parseInt(t.substr(0, 8), 16) & parseInt(e.substr(0, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase(),
    result += ((parseInt(t.substr(8, 8), 16) & parseInt(e.substr(8, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase()
}

function op_or(t, e) {
    return result = ((parseInt(t.substr(0, 8), 16) | parseInt(e.substr(0, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase(),
    result += ((parseInt(t.substr(8, 8), 16) | parseInt(e.substr(8, 8), 16)) >>> 0).toString(16).padStart(8, "0").toUpperCase()
}

function hex2bin(t) {
    return parseInt(t, 16).toString(2).padStart(8, "0")
}

function decimalize(t) {
    let e = "";
    for (var a of t)
        "0" <= a && a <= "9" && (e += a);
    decimal = {
        A: "0",
        B: "1",
        C: "2",
        D: "3",
        E: "4",
        F: "5"
    };
    for (var n of t)
        "0" <= n && n <= "9" || (e += decimal[n]);
    return e
}


function getapdu_error (e) {
    return errordescription = {
    "6200" :	    {type:'W',        description:	    'No information given (NV-Ram not changed)'},
    "6201" :	    {type:'W',        description:	    'NV-Ram not changed 1.'},
    "6281" :	{type:'W',        description:	    'Part of returned data may be corrupted'},
    "6282" :	{type:'W',        description:	    'End of file/record reached before reading Le bytes'},
    "6283" :	{type:'W',        description:	    'Selected file invalidated'},
    "6284" :	{type:'W',        description:	    'Selected file is not valid. FCI not formated according to ISO'},
    "6285" :	{type:'W',        description:	    'No input data available from a sensor on the card. No Purse Engine enslaved for R3bc'},
    "62A2" :	{type:'W',        description:	    'Wrong R-MAC'},
    "62A4" :	{type:'W',        description:	    'Card locked (during reset( ))'},
    "62CX" :	{type:'W',        description:	    'Counter with value x (command dependent)'},
    "62F1" :	{type:'W',        description:	    'Wrong C-MAC'},
    "62F3" :	{type:'W',        description:	    'Internal reset'},
    "62F5" :	{type:'W',        description:	    'Default agent locked'},
    "62F7" :	{type:'W',        description:	    'Cardholder locked'},
    "62F8" :	{type:'W',        description:	    'Basement is current agent'},
    "62F9" :	{type:'W',        description:	    'CALC Key Set not unblocked'},
    "6300" :	    {type:'W',        description:	    'No information given (NV-Ram changed)'},
    "6381" :	{type:'W',        description:	    'File filled up by the last write. Loading/updating is not allowed.'},
    "6382" :	{type:'W',        description:	    'Card key not supported.'},
    "6383" :	{type:'W',        description:	    'Reader key not supported.'},
    "6384" :	{type:'W',        description:	    'Plaintext transmission not supported.'},
    "6385" :	{type:'W',        description:	    'Secured transmission not supported.'},
    "6386" :	{type:'W',        description:	    'Volatile memory is not available.'},
    "6387" :	{type:'W',        description:	    'Non-volatile memory is not available.'},
    "6388" :	{type:'W',        description:	    'Key number not valid.'},
    "6389" :	{type:'W',        description:	    'Key length is not correct.'},
    "63C0" :	{type:'W',        description:	    'Verify fail, no try left.'},
    "63C1" :	{type:'W',        description:	    'Verify fail, 1 try left.'},
    "63C2" :	{type:'W',        description:	    'Verify fail, 2 tries left.'},
    "63C3" :	{type:'W',        description:	    'Verify fail, 3 tries left.'},
    "63CX" :	{type:'W',        description:	    'The counter has reached the value \'x\' (0 = x = 15) (command dependent).'},
    "63F1" :	{type:'W',        description:	    'More data expected.'},
    "63F2" :	{type:'W',        description:	    'More data expected and proactive command pending.'},
    "6400" :	    {type:'E',        description:	    'No information given (NV-Ram not changed)'},
    "6401" :	    {type:'E',        description:	    'Command timeout. Immediate response required by the card.'},
    "6500" :	    {type:'E',        description:	    'No information given'},
    "6501" :	    {type:'E',        description:	    'Write error. Memory failure. There have been problems in writing or reading the EEPROM. Other hardware problems may also bring this error.'},
    "6581" :	{type:'E',        description:	    'Memory failure'},
    "6600" :     {type:'S',        description:	    'Error while receiving (timeout)'},
    "6601" :     {type:'S',        description:	    'Error while receiving (character parity error)'},
    "6602" :     {type:'S',        description:	    'Wrong checksum'},
    "6603" :     {type:'S',        description:	    'The current DF file without FCI'},
    "6604" :     {type:'S',        description:	    'No SF or KF under the current DF'},
    "6669" :	{type:'S',        description:	    'Incorrect Encryption/Decryption Padding'},
    "6700" :	    {type:'E',        description:	    'Wrong length'},
    "6800" :	    {type:'E',        description:	    'No information given (The request function is not supported by the card)'},
    "6881" :	{type:'E',        description:	    'Logical channel not supported'},
    "6882" :	{type:'E',        description:	    'Secure messaging not supported'},
    "6883" :	{type:'E',        description:	    'Last command of the chain expected'},
    "6884" :	{type:'E',        description:	    'Command chaining not supported'},
    "6900" :	    {type:'E',        description:	    'No information given (Command not allowed)'},
    "6901" :	    {type:'E',        description:	    'Command not accepted (inactive state)'},
    "6981" :	{type:'E',        description:	    'Command incompatible with file structure'},
    "6982" :	{type:'E',        description:	    'Security condition not satisfied.'},
    "6983" :	{type:'E',        description:	    'Authentication method blocked'},
    "6984" :	{type:'E',        description:	    'Referenced data reversibly blocked (invalidated)'},
    "6985" :	{type:'E',        description:	    'Conditions of use not satisfied.'},
    "6986" :	{type:'E',        description:	    'Command not allowed (no current EF)'},
    "6987" :	{type:'E',        description:	    'Expected secure messaging (SM) object missing'},
    "6988" :	{type:'E',        description:	    'Incorrect secure messaging (SM) data object'},
    "6996" :	{type:'E',        description:	    'Data must be updated again'},
    "698D" :	{type:'	',        description:       'Reserved'},
    "69E1" :	{type:'E',        description:	    'POL1 of the currently Enabled Profile prevents this action.'},
    "69F0" :	{type:'E',        description:	    'Permission Denied'},
    "69F1" :	{type:'E',        description:	    'Permission Denied - Missing Privilege'},
    "6000" :	    {type:'E',        description:	    'No information given (Bytes P1 and/or P2 are incorrect)'},
    "6A80" :	{type:'E',        description:	    'The parameters in the data field are incorrect.'},
    "6A81" :	{type:'E',        description:	    'Function not supported'},
    "6A82" :	{type:'E',        description:	    'File not found'},
    "6A83" :	{type:'E',        description:	    'Record not found'},
    "6A84" :	{type:'E',        description:	    'There is insufficient memory space in record or file'},
    "6A85" :	{type:'E',        description:	    'Lc inconsistent with TLV structure'},
    "6A86" :	{type:'E',        description:	    'Incorrect P1 or P2 parameter.'},
    "6A87" :	{type:'E',        description:	    'Lc inconsistent with P1-P2'},
    "6A88" :	{type:'E',        description:	    'Referenced data not found'},
    "6A89" :	{type:'E',        description:	    'File already exists'},
    "6A8A" :	{type:'E',        description:	    'DF name already exists.'},
    "6AF0" :	{type:'E',        description:	    'Wrong parameter value'},
    "6B00" :	    {type:'E',        description:	    'Wrong parameter(s) P1-P2'},
    "6C00" :	    {type:'E',        description:	    'Incorrect P3 length.'},
    "6D00" :	    {type:'E',        description:	    'Instruction code not supported or invalid'},
    "6E00" :	    {type:'E',        description:	    'Class not supported'},
    "6F00" :	    {type:'E',        description:	    'Command aborted - more exact diagnosis not possible (e.g., operating system error).'},
    "6FFF" :	{type:'E',        description:	    'Card dead (overuse, ?)'},
    "9000" :	    {type:'I',        description:	    'Command successfully executed (OK).'},
    "9004" :	    {type:'W',        description:	    'PIN not succesfully verified, 3 or more PIN tries left'},
    "9008" :	    {type:'	',        description:       'Key/file not found'},
    "9080" :	{type:'W',        description:	    'Unblock Try Counter has reached zero'},
    "9100" :	    {type:'	',         description:      'OK'},
    "9101" :	    {type:'	',         description:      'States.activity, States.lock Status or States.lockable has wrong value'},
    "9102" :	    {type:'	',         description:      'Transaction number reached its limit'},
    "9140" :	{type:'	',         description:      'Invalid key number specified'},
    "910C" :	{type:'	',         description:      'No changes'},
    "910E" :	{type:'	',         description:      'Insufficient NV-Memory to complete command'},
    "911C" :	{type:'	',         description:      'Command code not supported'},
    "911E" :	{type:'	',         description:      'CRC or MAC does not match data'},
    "917E" :	{type:'	',         description:      'Length of command string invalid'},
    "919D" :	{type:'	',         description:      'Not allow the requested command'},
    "919E" :	{type:'	',         description:      'Value of the parameter invalid'},
    "91A0" :	{type:'	',         description:      'Requested AID not present on PICC'},
    "91A1" :	{type:'	',         description:      'Unrecoverable error within application'},
    "91AE" :	{type:'	',         description:      'Authentication status does not allow the requested command'},
    "91AF" :	{type:'	',         description:      'Additional data frame is expected to be sent'},
    "91BE" :	{type:'	',         description:      'Out of boundary'},
    "91C1" :	{type:'	',         description:      'Unrecoverable error within PICC'},
    "91CA" :	{type:'	',         description:      'Previous Command was not fully completed'},
    "91CD" :	{type:'	',         description:      'PICC was disabled by an unrecoverable error'},
    "91CE" :	{type:'	',         description:      'Number of Applications limited to 28'},
    "91DE" :	{type:'	',         description:      'File or application already exists'},
    "91EE" :	{type:'	',         description:      'Could not complete NV-write operation due to loss of power'},
    "91F0" :	{type:'	',         description:      'Specified file number does not exist'},
    "91F1" :	{type:'	',         description:      'Unrecoverable error within file'},
    "9210" :	{type:'E',         description:	    'Insufficient memory. No more storage available.'},
    "9240" :	{type:'E',         description:	    'Writing to EEPROM not successful.'},
    "920x" :	{type:'I',         description:	    'Writing to EEPROM successful after \'x\' attempts.'},
    "9301" :	    {type:'	',         description:      'Integrity error'},
    "9302" :	    {type:'	',         description:      'Candidate S2 invalid'},
    "9303" :	    {type:'E',         description:	    'Application is permanently locked'},
    "9400" :	    {type:'E',         description:	    'No EF selected.'},
    "9401" :	    {type:'	',        description:       'Candidate currency code does not match purse currency'},
    "9402" :	    {type:'	',        description:       'Candidate amount too high'},
    "9402" :	    {type:'E',        description:	    'Address range exceeded.'},
    "9403" :	    {type:'	',        description:       'Candidate amount too low'},
    "9404" :	    {type:'E',        description:	    'FID not found, record not found or comparison pattern not found.'},
    "9405" :	    {type:'	',        description:       'Problems in the data field'},
    "9406" :	    {type:'E',        description:	    'Required MAC unavailable'},
    "9407" :	    {type:'	',        description:       'Bad currency : purse engine has no slot with R3bc currency'},
    "9408" :	    {type:'	',        description:       'R3bc currency not supported in purse engine'},
    "9408" :	    {type:'E',        description:	    'Selected file type does not match command.'},
    "9580" :	{type:'	',        description:       'Bad sequence'},
    "9681" :	{type:'	',        description:       'Slave not found'},
    "9700" :	    {type:'	',        description:       'PIN blocked and Unblock Try Counter is 1 or 2'},
    "9702" :	    {type:'	',        description:       'Main keys are blocked'},
    "9704" :	    {type:'	',        description:       'PIN not succesfully verified, 3 or more PIN tries left'},
    "9784" :	{type:'	',        description:       'Base key'},
    "9785" :	{type:'	',        description:       'Limit exceeded - C-MAC key'},
    "9786" :	{type:'	',        description:       'SM error - Limit exceeded - R-MAC key'},
    "9787" :	{type:'	',        description:       'Limit exceeded - sequence counter'},
    "9788" :	{type:'	',        description:       'Limit exceeded - R-MAC length'},
    "9789" :	{type:'	',        description:       'Service not available'},
    "9802" :	    {type:'E',        description:	    'No PIN defined.'},
    "9804" :	    {type:'E',        description:	    'Access conditions not satisfied, authentication failed.'},
    "9835" :	{type:'E',        description:	    'ASK RANDOM or GIVE RANDOM not executed.'},
    "9840" :	{type:'E',        description:	    'PIN verification not successful.'},
    "9850" :	{type:'E',        description:	    'INCREASE or DECREASE could not be executed because a limit has been reached.'},
    "9862" :	{type:'E',        description:	    'Authentication Error, application specific (incorrect MAC)'},
    "9900" :	    {type:'W',        description:	    '1 PIN try left'},
    "9904" :	    {type:'E',        description:	    'PIN not succesfully verified, 1 PIN try left'},
    "9985" :	{type:'E',        description:	    'Wrong status - Cardholder lock'},
    "9986" :	{type:'E',        description:	    'Missing privilege'},
    "9987" :	{type:'E',        description:	    'PIN is not installed'},
    "9988" :	{type:'E',        description:	    'Wrong status - R-MAC state'},
    "9A00" :	    {type:'E',        description:	    '2 PIN try left'},
    "9A04" :	    {type:'E',        description:	    'PIN not succesfully verified, 2 PIN try left'},
    "9A71" :	{type:'E',        description:	    'Wrong parameter value - Double agent AID'},
    "9A72" :	{type:'E',        description:	    'Wrong parameter value - Double agent Type'},
    "9D05" :	    {type:'E',        description:	    'Incorrect certificate type'},
    "9D07" :	    {type:'E',        description:	    'Incorrect session data size'},
    "9D08" :	    {type:'E',        description:	    'Incorrect DIR file record size'},
    "9D09" :	    {type:'E',        description:	    'Incorrect FCI record size'},
    "9D10" :	{type:'E',        description:	    'Insufficient memory to load application'},
    "9D11" :	{type:'E',        description:	    'Invalid AID'},
    "9D12" :	{type:'E',        description:	    'Duplicate AID'},
    "9D13" :	{type:'E',        description:	    'Application previously loaded'},
    "9D14" :	{type:'E',        description:	    'Application history list full'},
    "9D15" :	{type:'E',        description:	    'Application not open'},
    "9D17" :	{type:'E',        description:	    'Invalid offset'},
    "9D18" :	{type:'E',        description:	    'Application already loaded'},
    "9D19" :	{type:'E',        description:	    'Invalid certificate'},
    "9D20" :	{type:'E',        description:	    'Application not loaded'},
    "9D21" :	{type:'E',        description:	    'Invalid Open command data length'},
    "9D30" :	{type:'E',        description:	    'Check data parameter is incorrect (invalid start address)'},
    "9D31" :	{type:'E',        description:	    'Check data parameter is incorrect (invalid length)'},
    "9D32" :	{type:'E',        description:	    'Check data parameter is incorrect (illegal memory check area)'},
    "9D40" :	{type:'E',        description:	    'Invalid MSM Controls ciphertext'},
    "9D41" :	{type:'E',        description:	    'MSM controls already set'},
    "9D42" :	{type:'E',        description:	    'Set MSM Controls data length less than 2 bytes'},
    "9D43" :	{type:'E',        description:	    'Invalid MSM Controls data length'},
    "9D44" :	{type:'E',        description:	    'Excess MSM Controls ciphertext'},
    "9D45" :	{type:'E',        description:	    'Verification of MSM Controls data failed'},
    "9D50" :	{type:'E',        description:	    'Invalid MCD Issuer production ID'},
    "9D51" :	{type:'E',        description:	    'Invalid MCD Issuer ID'},
    "9D52" :	{type:'E',        description:	    'Invalid set MSM controls data date'},
    "9D53" :	{type:'E',        description:	    'Invalid MCD number'},
    "9D54" :	{type:'E',        description:	    'Reserved field error'},
    "9D55" :	{type:'E',        description:	    'Reserved field error'},
    "9D56" :	{type:'E',        description:	    'Reserved field error'},
    "9D57" :	{type:'E',        description:	    'Reserved field error'},
    "9D60" :	{type:'E',        description:	    'MAC verification failed'},
    "9D61" :	{type:'E',        description:	    'Maximum number of unblocks reached'},
    "9D62" :	{type:'E',        description:	    'Card was not blocked'},
    "9D63" :	{type:'E',        description:	    'Crypto functions not available'},
    "9D64" :	{type:'E',        description:	    'No application loaded'},
    "9D0A" :	{type:'E',        description:	    'Incorrect code size'},
    "9D1A" :	{type:'E',        description:	    'Invalid signature'},
    "9D1B" :	{type:'E',        description:	    'Invalid KTU'},
    "9D1D" :	{type:'E',        description:	    'MSM controls not set'},
    "9D1E" :	{type:'E',        description:	    'Application signature does not exist'},
    "9D1F" :	{type:'E',        description:	    'KTU does not exist'},
    "9E00" :	    {type:'E',        description:	    'PIN not installed'},
    "9E04" :	    {type:'E',        description:	    'PIN not succesfully verified, PIN not installed'},
    "9F00" :	    {type:'E',        description:	    'PIN blocked and Unblock Try Counter is 3'},
    "9F04" :	    {type:'E',        description:	    'PIN not succesfully verified, PIN blocked and Unblock Try Counter is 3'},
    }[e] || ''
}


