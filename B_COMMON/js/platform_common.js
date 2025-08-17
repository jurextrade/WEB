//------------------------------------------------------------ ASSISTANT PANEL ----------------------------------------------------------

function AssistantGoToStep (id, stepnumber) {
    var tablist_item = '#' + id + '-t-';
    $(tablist_item+stepnumber).trigger('click');
}

function onclick_alertnotificationpanel(elt) {
    var rowindex = alertstable.rows.length - 1;
    var alertid = $(elt).attr ('alertid');
    DrawAlert(rowindex, alertid);
}

function AlertNotificationPanel() {
    var content = '<input id ="alertnotificationpanel" class="form-control" type="text" onclick= "onclick_alertnotificationpanel (this, event)" readonly>';
    return content;
}


//------------------------------------------------------------ COMMENT PANEL ----------------------------------------------------------

var Interval_messageblink       = 0;        // display
var OpCount                     = 0;


function BlinkOperation(elt, line, bgcolor, opcount) {
    var blinkcolor = 'var(--theme-color)';
    var blinkbg = bgcolor;
    elt.children().html(line);
  
    if (OpCount % 2) {
        elt.css ('color', '');
        elt.css ('background', '');
      
    } else {
        elt.css ('color', blinkcolor);
        elt.css ('background', blinkbg);
        elt.children().html (line);
    }
    if (OpCount == opcount) {
        clearInterval(Interval_messageblink);
        elt.remove();
    }
    OpCount++;
 }

function TreatInfo(line, id, color) {
    sound = true;
    DisplayInfo(line, sound, id, color);
}

function DisplayInfo(line, withsound, id, bgcolor, opcount) {
    let operationpanel = {
        id: 'operationpanel',
        position: '',    
        type: 'group',    
        class: 'sb_overlay',
        items:
            [
                {id: '',    type: 'link',  attributes: {readonly:''}}  
            ]
    }    
    id = 'operationpanel';
    let elt = $('#' + id);    

    if (elt.length == 0) {
        $('body').append(sb.render(operationpanel));
        elt = $('#' + id)        
    }
    OpCount = 0;
    if (!bgcolor) {
        bgcolor = 'var(--theme-platform-color)'
    }
    
    opcount = 5;
    clearInterval(Interval_messageblink);
    if (line.startsWith("Check Account")) bgcolor = theme_bear;

    BlinkOperation(elt, line, bgcolor);

    Interval_messageblink = setInterval(BlinkOperation, 500, elt, line, bgcolor, opcount);

    if (withsound) {
        let gsound          = solution.get('sound')     
        gsound.speak(line);
    }
 }

//------------------------------------------------------------ ANIMATION ----------------------------------------------------------

 function AnimationPanel (text) {
    var content = 
    '<h1 class="ml_1">' +
    '    <span class="text-wrapper">' +
    '        <span class="line line1"></span>' +
    '        <span class="letters_1">' + text + '</span>' +
    '        <span class="line line2"></span>' +
    '    </span>' +
    '</h1>';
    return content;
}

function AnimationInit(pname, pageid) {
    let iAnimation = document.createElement('div');
    iAnimation.id               = pname + '_animation';
    iAnimation.style.position   = "relative";
   // iAnimation.style.visibility = 'hidden';
     let root;
    
    if (pageid) {
        root = document.getElementById(pageid);        
    } else {
        root = document.body;
    }
  

    root.prepend(iAnimation);
    let animationid = '#' + pname + '_animation';    
    $(animationid).css ('width',  $(pageid).width());
    $(animationid).css ('height', $(pageid).height());  
    $(animationid).css ('top',    '50%');    
    iAnimation.innerHTML = AnimationPanel ('');
    
}

function AnimationReset (id) {
  return;
  var els = document.querySelectorAll( '#' + id + ' .ml_1 .letter');
  for (var i = 0; i < els.length; i++) {
    els[i].parentElement.removeChild(els[i]);
  }
}

function AnimationDisplay (pname, text, rootid, keep) {
    let animationid = '#' + pname + '_animation';
    $(animationid).remove();             



   // let rootid = id.replace('main', 'root');

    AnimationInit(pname, rootid);
    
    
   //$(animationid).css ('top',    rect.top);
   //$(animationid).css ('left',   rect.left);
   //$(animationid).css ('width',  $(pageid).width());
   //$(animationid).css ('height', $(pageid).height());

    $(animationid)[0].keep = keep ? keep : false;
    

   // $('#animation').html(AnimationPanel (''))
   // $('#animation').css ('visibility', 'visible');
    
    $(animationid + ' .letters_1').html (text.replace(/\S/g, "<span class='letter'>$&</span>"));
                

    var opacity = 0.7;
    var loop    = false;
    anime.timeline({loop: (loop ? true :false)})
        .add({targets: animationid + ' .ml_1 .letter', scale: [0.3,1], opacity: [0,1], translateZ: 0, easing: "easeOutExpo", duration: 700, delay: (el, i) => 10 * (i+1)})
        .add({targets: animationid + ' .ml_1 .line', scaleX: [0,1], opacity: [0.5,1], easing: "easeOutExpo", duration: 700, offset: '-=875', delay: (el, i, l) => 10 * (l - i)})
        .add({targets: animationid + ' .ml_1', opacity: opacity, duration: 100, easing: "easeOutExpo", delay: 10, hide: keep ? false : true,
            begin: function () {
            },
            complete: function (par) {
                if ($(animationid).length != 0 && !$(animationid)[0].keep) {
                    $(animationid).remove();             
                }
            }
        });    
}

function resetDemo() {
    var els = document.querySelectorAll('.el');
    for (var i = 0; i < els.length; i++) {
      anime.remove(els[i]);
      els[i].style = '';
    }
  }


//------------------------------------------------------------ SPINNER ----------------------------------------------------------

function LoaderChartHistory (display) {
    if (display) {
         $(".spinner-border").attr("style", 'display:block');
    } else {
         $(".spinner-border").attr("style", 'display:none');
    }
}

//------------------------------------------------------------ WARNNING ALERT ----------------------------------------------------------

function ReturnWarningALert (content) {
    let item = {id: 'tree_warning', type: 'panel', class: 'alert alert-warning', items: [{id: 'textarea', type: 'label', class: '', item: content}]}
    return item;
}

function SubmitRequest(content, filename, synchrone) {
    let  site           = solution.get('site');    

    var sendmode = !synchrone ? true : synchrone;    
    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.get('user').id;
  
    var http = new XMLHttpRequest();
    http.open('POST', url, sendmode);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {}
    }
    http.send(params);
}

function SubmitProfileRequest(terminalfolder, terminaltype, content, filename, asynchrone) {
    let  site           = solution.get('site');    

    var sendmode = !asynchrone ? false : asynchrone;
    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.get('user').id + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
   
    var http = new XMLHttpRequest();
    http.open('POST', url, sendmode);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            return 1;
        }
    }
    http.send(params);
}

function SubmitDistributeRequest(projectfolder, filename, terminalfolder, terminaltype) {
    let  site           = solution.get('site');    

    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(projectfolder) + '&userid=' + solution.get('user').id + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
  
    var http = new XMLHttpRequest();
    http.open('POST', url, false); //false = SYNC
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function (object) { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseURL  + http.responseText, 1);
            returnvalue = http.responseText;
        }
    }
    http.send(params);
}

function SubmitProjectRequest (platformfolder, projectfolder, projectname, content, phpfilename, async) {
    let  site    = solution.get('site');   
    let  user    = solution.get('user')           
    let url = site.address + '/' + phpfilename;
    
    let param = {
        user_id :  user.id,
        platform_folder : platformfolder,        
        project_folder: projectfolder,
        project_name : projectname,
        content: content          
    }
    
    let callback = function (responsetext, values) {
        console.log(responsetext + ' OK' + responsetext, 1);
        return responsetext;
    }

    url_submit ('POST', url, param /*object {}*/, async, callback, []);
}

function SubmitTerminalRequest(terminalfolder, terminaltype, content, filename, asynchrone) {
    let  site    = solution.get('site');    

    var sendmode = !asynchrone ? false : asynchrone;    
    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.get('user').id + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
    
    var http = new XMLHttpRequest(); 
    http.open('POST', url, sendmode); //false = SYNC
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseURL + ' OK' + http.responseText, 1);
        }
    }
    http.send(params);
}

function SubmitFileRequest(content, filename, projectnamme, filetype, fileoperation, rule) {
    let  site    = solution.get('site');    

    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.get('user').id + '&project_name=' + projectnamme + '&file_type=' + filetype + '&file_operation=' + fileoperation + '&rule=' + rule;
 
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {}
    }
    http.send(params);
}


//-------------------------------------------------------------- DIALOG ALERTS... ------------------------------------------------------------------------
  

//---------------------------------------------------- REMOVE PROJECT ---------------------------------------------- 

function RemoveProjectConfirm(callafter, param) {
    var project = param;
    sb.confirm_modal('Are you sure you want to delete '   + project.Name + ' ?', 'Delete Current Project',  null, true).yes(function () {
        callafter(param);
        $("#confirmmodal").modal('hide');           

    }).no(function () {
    })
}

function OnRemoveProject(callafter, param) {
    var project = param;
    
    if (!project) return;

    RemoveProjectConfirm(callafter, project);
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 

function OnRenameProject(callafter, param) {
    var project = param;    
    if (!project) return;

    RenameProjectConfirm(callafter, param);
}

function RenameProjectConfirm(callafter, param) {
    var project = param;

    var content = '<input  type="text" id="renameprojectname" name="NewProject_0" class="required form-control error" value="' + project.Name + '" autocomplete="off" onkeypress="return CheckChar(event)">';
    sb.confirm_modal(content , "Rename Current Project",  function() {focusAndCursor("#renameprojectname")},  true).yes(function () {
        var newname = $('#renameprojectname').val();
        callafter(project, newname);
        $("#confirmmodal").modal('hide');          
    }).no(function () {})
}

//---------------------------------------------------- CLOSE PROJECT ---------------------------------------------- 

function OnCloseProject (project, callback, param, param1) {
    if (!project) return;

    CloseProjectConfirm(project, callback, param, param1);
}

function CloseProjectConfirm(project, callback, param, param1) {
  
    sb.confirm_modal('Exit Project ' + project.Name + ' ?').yes(function () {
        setTimeout(callback, 300, param, param1);        
        $("#confirmmodal").modal('hide');      
    }).no(function () {})
}


const emv_default_projectname         = "DemoProject";
const project_default_projectname     = "DemoProject";
const netprog_default_projectname     = "DemoProject";
const tradedesk_default_terminalname  = "FP Markets MT4 Terminal";
const option_default_projectname      = "DemoProject";

const emv_default_router_name   = 'localhost';
const emv_default_router_port     = 5080;
const emv_default_router_sport    = 5443;
const emv_default_router_reconnection   = true;

const project_default_server_name   = 'localhost';
const project_default_server_port     = 2080;
const project_default_server_sport     =2443;
const project_default_server_reconnection   = true;

const tradedesk_default_server_name   = 'localhost';
const tradedesk_default_server_port   = 2080;
const tradedesk_default_server_sport  = 2443;
const tradedesk_default_server_reconnection   = true;

const netprog_default_server_name   = 'localhost';
const netprog_default_server_port     = 4080;
const netprog_default_server_sport    = 4443;
const netprog_default_server_reconnection   = true;

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

function selector_select (selector, name, type) {
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
            sb.tree_selectitem ('project_tree_experts', expertfile);                      
        //    OnDownloadExpert (DownloadStrategy, expertfile)
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
            if (strategy == CurrentStrategy) return strategy;
            return project_selectstrategy(strategy);
        break;
        case 'project_selectproject' :
            var projectname =name;
            var project = solution.project_GetProjectFromName(projectname);
            if (project == solution.CurrentProject) return project;
            return project_selectproject(project);
        break;
        case 'netprog_selectproject' :
            var projectname =name;
            var project = solution.netprog_GetProjectFromName(projectname);
            if (project == solution.netprog_CurrentProject) return project;
            return netprog_selectproject(project);
        break;    
        case 'emv_selectproject' :
            var projectname =name;
            var project = solution.emv_GetProjectFromName(projectname);
            if (project == solution.emv_CurrentProject) return project;
            return emv_selectproject(project);
        break;
        case 'tradedesk_selectterminal' :
            let terminaltype    = TradedeskTypePanel_Type();
            var terminal        = solution.GetTerminalFromNameType (name, terminaltype);     
            if (terminal == solution.CurrentTerminal) return terminal;
            return tradedesk_selectterminal(terminal);
        break;
        case 'option_selectterminal' :
            let terminals = solution.GetTerminalsFromName (name);
            var terminal;
            for (var i = 0; i < terminals.length; i++) {
                if (terminals[i].DataPath == '//Main') continue;
                terminal = terminals[i];   // terminal has priority
            }
            return option_selectterminal(terminal);
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


function bottompanel_select (platform, tabid) { 
    if (!platform) {
        return;
    }
    $('#' +  platform.pname + '_bottomtabs' +  ' #' + CSS.escape(tabid)).tab('show');    
    BottomPanel_Flat (platform, false ,true);    
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

function ProfilePanel () {
    var content =    
'       <div id="profilepanel" class="sb_column">' +
            ContactPanel () +
'       </div>';
    return content;
}


function ContactPanel () {
    var content =    
       `<div>This site is still under development</div> 
       <div>I can assist you in software developments</div> 
       <div>You can check other developements 
            <button id="Platforms" class="sb_sbutton sb_link" onclick="onclick_rightsidebarmenu('rightsidebar_solution', 1);event.stopPropagation()" title="See other Platforms"> <i class="fas fa-download"></i> <label class="sb_label">Platforms</label></button>       
       </div>
       <br>
       <div>Please feel free to contact me 
       </div>
       <br><p>JUREXTRADE<br><span style="line-height: 1.5;">Gabriel Jureidini</span><br><span style="line-height: 1.5;">Paris-France</span></p>
       <label><i class="fas fa-envelope"></i> Email<br><span style="line-height: 1.5;">contact@jurextrade.com</span></label>`

    return content;
}

function openPopupContact () {
    sb.render ({
        header: 'Contact', 
        id:'popupcontact',
        type:'modal',
        resizable: true,
        body: ContactPanel(),
        footer: '<button data-bs-dismiss="modal" class="sb_mbutton">Close</button>',
    });
}