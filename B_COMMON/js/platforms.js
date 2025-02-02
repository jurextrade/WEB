
//---------------------------------------------------- MAIN SIDE BAR    ------------------------------------------------ 

function ondragstart_treeitem (elt, event) {
    var name         = $(elt).find('label').html();
    var selector     = $(elt).attr('selector');   

    switch (selector) {
        case 'selectindicator' :
            event.dataTransfer.setData("text/plain", selector + '_' + name);
            break;
        case 'project_selectstrategy' :
            event.dataTransfer.setData("text/plain", selector + '_' + name);
            break;
        case 'project_selectproject' :
            event.dataTransfer.setData("text/plain", selector + '_' + name);
            break;
        case 'selectcondition' :
            event.dataTransfer.setData("text/plain", selector + '_' + name);
            break;            
        
    }
    
}

function onclick_treeitem(elt, event) {

    var name        = $(elt).find('label').html();
    var selector    = $(elt).attr('selector');   
    selector_select(selector, name)
}

function oncontextmenu_treeitem (elt, event) {

    var name        = $(elt).find('label').html();
    var selector    = $(elt).attr('selector');   


    switch (selector) {
        case "project_selectproject" :
            var menu = ReturnProjectMenu ();
        break;
        case "project_selectstrategy" :
            var menu = ReturnStrategyMenu ();
        break;
        default:
            return;
        break;    
    }
   sb.overlay({
        rootelt: $(elt).closest('.sb_root'),     
        event: event,                
        pageX: event.pageX,
        pageY: event.pageY,
        par : elt.innerText,
     //   treeparentid: treeparentid,
        onselect: function (elt, itemtext) {
            switch (parseInt(elt.id)) {
                case MENU_PROJECT_RENAME_ID :
                    var project = solution.project_GetProjectFromName(itemtext);
                    OnRenameProject (RemoveProject, project);
                break;
                case MENU_PROJECT_REMOVE_ID :
                    var project = solution.project_GetProjectFromName(itemtext);
                    OnRemoveProject (RemoveProject, project);
                break;
                case MENU_STRATEGY_RENAME_ID :
                    var strategy = solution.CurrentProject.PG.GetStrategyFromName(itemtext);
                    if (!strategy) return;

                    OnRenameStrategy(solution.CurrentProject, RenameStrategy, strategy);
                break;                        
                case MENU_STRATEGY_COPY_ID :
                    var strategy = solution.CurrentProject.PG.GetStrategyFromName(itemtext);
                    if (!strategy) return;

                    solution.StrategyClipBoard = strategy.Clone();
                break;
                case MENU_STRATEGY_CUT_ID :
                    var strategy = solution.CurrentProject.PG.GetStrategyFromName(itemtext);
                    if (!strategy) return;

                    solution.StrategyClipBoard = strategy.Clone();
                    DeleteStrategy(strategy);
                break;
                case MENU_STRATEGY_PASTE_ID :
                    PasteStrategy(solution.StrategyClipBoard);
                    break;
                case MENU_STRATEGY_REMOVE_ID :
                    var strategy = solution.CurrentProject.PG.GetStrategyFromName(itemtext);
                    if (!strategy) return;

                    OnDeleteStrategy(solution.CurrentProject, DeleteStrategy, strategy);
                break;
                case MENU_STRATEGY_EXPORT_ID:
                    break;
            }                    
        },        
        html: sb.menu (menu)
    });    	
}

function AddSelectItem (selectid, name) {
    var elt1 = document.getElementById('selectid');         
    elt1.insertAdjacentHTML('beforeend','<option value="' + name + '">' + name + '</option>');        
}

//------------------------------------------------------------------- TREE SIDEBAR---------------------------------------------------------------------

function selector_select (selector, name) {
    switch (selector) {
        case 'selectindicator' :
            var indicatorname =name;
            if (indicatorname == "Create Indicator") {
                SelectIndicator();
            } else {
                sb.tree_selectitem ('indicatorssidebar',name);                    
                openPopupObject (indicatorname);
            }
               
        return;

        case 'selectcondition' :
            var conditionname =name;
            if (conditionname == "Create Condition") {
                SelectCondition();
            } else {
                 openPopupCondition(conditionname);
            }
        return;

        case 'selectexpert' :
            var expertfile =name;
            OnDownloadExpert (DownloadStrategy, expertfile)
            return;
        
        case 'sidebar_newstrategy':
            SelectNewStrategy();
        break;
        
        case 'sidebar_newproject':
            SelectNewProject();
        break;

        case 'project_selectstrategy' :
            var strategyname =name;
            var strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyname);
            if (strategy == CurrentStrategy) return;
            SelectStrategy(strategy);
            break;

        case 'project_selectproject' :
            var projectname =name;
            var project = solution.project_GetProjectFromName(projectname);
            if (project == solution.CurrentProject) return;
            project_selectproject(project);
            break;

        case 'netprog_selectproject' :
            var projectname =name;
            var project = solution.netprog_GetProjectFromName(projectname);
            if (project == solution.netprog_CurrentProject) return;
            netprog_selectproject(project);
            break;
    
        case 'emv_selectproject' :
            var projectname =name;
            var project = solution.emv_GetProjectFromName(projectname);
            if (project == solution.emv_CurrentProject) return;
            emv_selectproject(project);
            break;            

        case 'tradedesk_selectterminal' :
            var terminaltype = TradedeskTypePanel_Type();
            var terminal = solution.GetTerminalFromNameType (name, terminaltype);
            tradedesk_selectterminal(terminal);
            break;

        case 'option_selectterminal' :
            var terminals = solution.GetTerminalsFromName (name);
            var terminal;
            for (var i = 0; i < terminals.length; i++) {
                if (terminals[i].DataPath == '//Main') continue;
                terminal = terminals[i];   // terminal has priority
            }
            option_selectterminal(terminal);
        break;
            
    }
}

function onclick_slidehideotherbox (elt) {
    if (!$(elt).hasClass ('rotate-180')) // opened nothing to do apart closing it
        return; 

    var rootelt = $(elt).closest('.sb_box').parent();
    var links = $(rootelt).find ('.sb_boxheader .box-btn-slide');
    var linksbefore = [];

    for (var i = 0; i < links.length; i++) {
        if (links[i] != elt) {
            linksbefore.push (links[i]);
        }
        else {
            break;
        }
    }
    $.each(linksbefore, function (index, link) {
        if (link != elt) {
            if (!$(link).hasClass ('rotate-180')) { //opened
                $(link).toggleClass('rotate-180').closest('.sb_box').find('.sb_boxbody').slideToggle();         // so close it       
            } 
        }
    });   
}

//------------------------------------------------------------------------- BAR PANEL -------------------------------------------------------------------------

function Selection_clear () {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else 
    if (document.selection) {
        document.selection.empty();    
    }
}

//------------------------------------------------------------------------- BOTTOM PANEL -------------------------------------------------------------------------

const BOTTOMPANEL_HEIGHT   = 200;
const BOTTOMPANEL_FLATSIZE = 35;

function BottomPanel_Flat (platform, flat, setflag) {

    let dragelth    = $('#' + platform.pname + '_mainpanel_drag');   
    let bottomelt = dragelth[0].nextElementSibling; 
    let topelt = dragelth[0].previousElementSibling

    let sb_bottomidarray   = sb.get(sb.interface, 'id', bottomelt.id)
    if (sb_bottomidarray.length == 0) {
        return;
    }
    let sb_bottom = sb_bottomidarray[0];
    
    let sb_topidarray   = sb.get(sb.interface, 'id', topelt.id)
    if (sb_topidarray.length == 0) {
        return;
    }
    let sb_top = sb_topidarray[0];


    let isflat = true;

    if ($(bottomelt).find('.box-btn-slide').hasClass ('rotate-180')) {
        isflat = true;
    } else {
        isflat = false;
    }

    if (!defined (flat)) {
        flat = !isflat;
    } else    
    if (flat == isflat) {
        return;
    }    
    if (!defined(sb_bottom.flatsize)) {
        sb_bottom.flatsize = BOTTOMPANEL_FLATSIZE;
    }
    
    if (!defined(sb_bottom.bottomheight)) {
        sb_bottom.bottomheight = BOTTOMPANEL_HEIGHT;
    }    
    sb_bottom.flat = flat;        

    let set = (defined(setflag) ? setflag : false);

    if (flat) {   
        sb_bottom.bottomheight = $(bottomelt).height(); 
        $(bottomelt).height(sb_bottom.flatsize);
        if(set) {
            $(bottomelt).find('.box-btn-slide').addClass ('rotate-180');     
        }
        $(bottomelt).find('.box-btn-fullscreen').addClass ('sb_none');            
        dragelth.addClass('sb_none');               
    }
    else {
        $(bottomelt).height(sb_bottom.bottomheight);
        if(set) {
            $(bottomelt).find('.box-btn-slide').removeClass ('rotate-180');                  
        }
        $(bottomelt).find('.box-btn-fullscreen').removeClass ('sb_none');                  
        dragelth.removeClass('sb_none');     
    }
    sb.resize(sb_bottom)    
    sb.resize(sb_top)        
}

function BottomPanel_Expand (platform, expand) {

    let dragelth    = $('#' + platform.pname + '_mainpanel_drag');   
    let bottomelt   = dragelth[0].nextElementSibling; 
    let topelt      = dragelth[0].previousElementSibling

    let sb_bottomidarray   = sb.get(sb.interface, 'id', bottomelt.id)
    if (sb_bottomidarray.length == 0) {
        return;
    }
    let sb_bottom = sb_bottomidarray[0];

    let sb_topidarray   = sb.get(sb.interface, 'id', topelt.id)
    if (sb_topidarray.length == 0) {
        return;
    }
    let sb_top = sb_topidarray[0];
    

    if (expand) {   
        sb_bottom.bottomheight = $(bottomelt).height();         
        $(bottomelt).css('height', 'calc(100% - 35px)');

        $(bottomelt).find('.box-btn-fullscreen').addClass ('sb_none');  
        $(bottomelt).find('.box-btn-compressscreen').removeClass ('sb_none');    
        $(bottomelt).find('.box-btn-slide').addClass ('sb_none');                     
        dragelth.addClass('sb_none');               
    }
    else {
        
        $(bottomelt).height(sb_bottom.bottomheight);     

        $(bottomelt).find('.box-btn-fullscreen').removeClass ('sb_none');  
        $(bottomelt).find('.box-btn-compressscreen').addClass ('sb_none');  
        $(bottomelt).find('.box-btn-slide').removeClass ('sb_none');                     
        dragelth.removeClass('sb_none');               
    }
    sb.resize(sb_bottom)
    sb.resize(sb_top)        

}

function onclick_controlsbottompanel (elt) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    switch (elt.id) {
        case 'slide':
            BottomPanel_Flat (platform);
        break;
        case 'fullscreen':
            BottomPanel_Expand (platform, true);
        break;
        case 'compressscreen':
            BottomPanel_Expand (platform, false);
        break;

    }
}

//----------------------------------------------------  ASSISTANT PANEL    ------------------------------------------------   

function onclick_assistant_nextprev(elt, event) {

    let assistantelet  = $(elt).parent().parent().parent().find('.assistant_panel ');
    let assistantid    = $(assistantelet).attr('id');

    let idstep       = assistantelet.find('.current a').attr('id')
    let nextstep = +idstep.slice(-1) + 1;
    let prevstep = +idstep.slice(-1) - 1;

    if ($(elt).hasClass ('next')) {
        if (nextstep >= 4) {
            return;
        }            
        event.preventDefault(); 
        $('#' + assistantid + '-t-' + nextstep).trigger('click');                                
    }
    else {
        if (prevstep < 0) {
            return;
        }            
        event.preventDefault();            
        $('#' + assistantid + '-t-' + prevstep).trigger('click');                                
    }
}

