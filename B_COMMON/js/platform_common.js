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

function TreatOperation(line, id, color) {
    sound = true;
    DisplayOperation(line, sound, id, color);
}

function DisplayOperation(line, withsound, id, bgcolor, opcount) {
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
    //        gsound.speak(line);
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

function AnimationInit() {
    var iAnimation = document.createElement('div');
    var iMain = document.body;
    iMain.appendChild(iAnimation);
    iAnimation.id               = 'animation';
    iAnimation.style.position   = "fixed";
    iAnimation.style.visibility = 'hidden';
    
    iAnimation.innerHTML = AnimationPanel ('');
    
}
function AnimationReset (id) {
  var els = document.querySelectorAll( '#' + id + ' .ml_1 .letter');
  for (var i = 0; i < els.length; i++) {
    els[i].parentElement.removeChild(els[i]);
  }
}

function AnimationDisplay (id, text, keep) {
   // console.log ('AnimationDisplay')
    var animationid = 'animation';

    var rect = $('#' + id).offset();

    KEEP = keep;

    $('#animation').css ('top', rect.top);
    $('#animation').css ('left', rect.left);
    $('#animation').css ('width', $('#' + id).width());
    $('#animation').css ('height', $('#' + id).height());

    

    $('#animation').html(AnimationPanel (''))
    $('#animation').css ('visibility', 'visible');
    
    $('#animation' + ' .letters_1').html (text.replace(/\S/g, "<span class='letter'>$&</span>"));
                

    var opacity = 0.7;
    var loop    = false;
    anime.timeline({loop: (loop ? true :false)})
        .add({targets: '#animation .ml_1 .letter', scale: [0.3,1], opacity: [0,1], translateZ: 0, easing: "easeOutExpo", duration: 700, delay: (el, i) => 10 * (i+1)})
        .add({targets: '#animation .ml_1 .line', scaleX: [0,1], opacity: [0.5,1], easing: "easeOutExpo", duration: 700, offset: '-=875', delay: (el, i, l) => 10 * (l - i)})
        .add({targets: '#animation .ml_1', opacity: opacity, duration: 100, easing: "easeOutExpo", delay: 10,
            begin: function () {
            },
            complete: function (par) {
                $('#animation').css ('visibility', 'hidden');             
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
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.UserId;
  
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
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.UserId + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
   
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
    var params = 'content=' + encodeURIComponent(projectfolder) + '&userid=' + solution.UserId + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
  
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

function SubmitProjectRequest(projectfolder, projectname, content, phpfilename, asynchrone) {
    let  site    = solution.get('site');    

    var sendmode = !asynchrone ? false : asynchrone;    
    var projectname = (projectname ? projectname : "");
    var url = site.address + '/' + phpfilename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.UserId + '&project_folder=' + projectfolder + '&project_name=' + projectname;
    
    var http = new XMLHttpRequest();
    http.open('POST', url, sendmode); //false = SYNC
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function (objet) { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseURL + ' OK' + http.responseText, 1);
            return http.responseText;
        }
        else {
            console.log(http.responseURL + ' ERROR', 1);
            return -1;
        }
    }
    http.send(params);
    return 1;
}

function SubmitTerminalRequest(terminalfolder, terminaltype, content, filename, asynchrone) {
    let  site    = solution.get('site');    

    var sendmode = !asynchrone ? false : asynchrone;    
    var url = site.address + '/' + filename;
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.UserId + '&terminalfolder=' + terminalfolder + '&terminaltype=' + terminaltype;
    
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
    var params = 'content=' + encodeURIComponent(content) + '&user_id=' + solution.UserId + '&project_name=' + projectnamme + '&file_type=' + filetype + '&file_operation=' + fileoperation + '&rule=' + rule;
 
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {}
    }
    http.send(params);
}


//-------------------------------------------------------------- DIALOG ALERTS... ------------------------------------------------------------------------
  
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

function RenameProjectConfirm(callafter, param) {
    var project = param;

    var content = '<input  type="text" id="renameprojectname" name="NewProject_0" class="required form-control error" value="' + project.Name + '" autocomplete="off" onkeypress="return CheckChar(event)">';
    sb.confirm_modal(content , "Rename Current Project",  function() {focusAndCursor("#renameprojectname")},  true).yes(function () {
        var newname = $('#renameprojectname').val();
        callafter(project, newname);
        $("#confirmmodal").modal('hide');          
    }).no(function () {})
}

function OnRenameProject(callafter, param) {
    var project = param;    
    if (!project) return;

    RenameProjectConfirm(callafter, param);
}