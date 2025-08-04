const register_needed_label        = "You should register to perform operations on your platform";


//---------------------------------------------------- HEADER BAR    ------------------------------------------------   


function mouseleave_header (elt, event) {
    let ui  = solution.get('ui')        
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    
    //console.log ('leave header')    
    let pname = platform.pname;
    let expanded = $('#header').hasClass (pname + '_expanded')
    if (expanded) {
        $('#header').css ('display', 'none');
    }
} 

function mouseleave_main (elt, event) {
    let ui  = solution.get('ui')        
    let platform = ui.currentplatform;

    if (!platform) {
        return;
    }        
   // console.log ('leave main')    

    let pname = platform.pname;
    let expanded = $('#header').hasClass (pname + '_expanded')
    if (expanded && event.clientY <= elt.offsetTop) {
        $('#header').css ('display', '');
    }
} 

function mousenter_main (elt, event) {
    let ui  = solution.get('ui')        
    let platform = ui.currentplatform;

    if (!platform) {
        return;
    }    
    //console.log ('enter main event:' + event.clientY + ' topoffset:' + elt.offsetTop)        

    let pname = platform.pname;
    let expanded = $('#header').hasClass (pname + '_expanded')
    if (expanded && event.clientY > $('header').height()) {
        $('#header').css ('display', 'none');
    } 
    else {
         $('#header').css ('display', '');
     
    }
}  

function click_main (elt, event) {
    let psidebarpanel   = $('#right_sidebarpanel'); 
    
    if (!psidebarpanel.hasClass('pinned')) {    
        rightsidebarpanel_hide(psidebarpanel);
    }
}

class SOLUTION {
    constructor (userid, username, usermail, userfirstname, userlastname, userdname, userphoto, action, key, login, error, dynamic) {
        this.properties = {
            userid: userid, 
            username: username, 
            usermail: usermail, 
            userfirstname: userfirstname, 
            userlastname: userlastname, 
            userdname: userdname, 
            userphoto: userphoto, 
            action: action, 
            key: key, 
            login: login, 
            error: error, 
            dynamic: dynamic
        }

        this.configuration  = null;
        this.languages      = [];
        this.modules        = {header: [], left: [], main: [], right: [], footer: []};
        this.includefiles   = []; 

        this.dynamic        = dynamic ? true : false;
        this.withcontent    = true;


        this.Init(this)
    }

    Init (c_solution) {

        let prop = c_solution.properties;
        c_solution.LocalGMTOffset = (new Date()).getTimezoneOffset() / 60;
        c_solution.DifferenceHoursTime = c_solution.LocalGMTOffset * 60 * 60 * 1000;

        c_solution.site         = new site();        
        c_solution.navigator    = new _navigator();
        c_solution.user         = new user();   
        
        c_solution.user.set (prop.userid, prop.username, prop.usermail, prop.userfirstname, prop.userlastname, prop.userdname, prop.userphoto);        
        
        this.load_configurationfile(document.location.protocol + '//' + document.location.host + c_solution.user.path + '/configuration.json')
        
        if (prop.dynamic) {
            this.add_configuration_scripts(this.Init)
        } else {   //some are already loaded, let's merge module parameter with SB
            for (var i = 0; i < main.items.length; i++) {
                let struct_module = this.get_modulefrompname(main.items[i].pname)
                main.items[i] =  {...main.items[i], ...struct_module.module}
            }
            for (var i = 0; i < footer.items.length; i++) {
                let struct_module = this.get_modulefrompname(footer.items[i].pname)
                footer.items[i] =  {...footer.items[i], ...struct_module.module}
            }
            for (var i = 2; i < default_right_sidebarpanel.items.length; i++) {
                let struct_module = this.get_modulefrompname(default_right_sidebarpanel.items[i].items[0].pname)
                default_right_sidebarpanel.items[i].items[0] =  {...default_right_sidebarpanel.items[i].items[0], ...struct_module.module}
            }            
        }  

        this.user.send({Name: 'scandir_r',Values: this.user.is_admin () ? ['.', ''] : [this.user.path  + '/NetProg', '.']}, false,  function (content, values) {
            let dirstruct = JSON.parse (content);
            values[0].fileexplorer = dirstruct.Values[0]}, [this.user])
        
        c_solution.machine      = new machine();
        c_solution.ui           = new ui(this.configuration.theme);        
       
        c_solution.get_languages();    

        if (prop.action != ''){
            switch (prop.action) {
                case 'login' :
                    SignIn ();
                break;    
                case 'register' :
                    Register ();                
                break;    
                case 'lostpassword' :
                    LostPassword(error);
                break;    
                case 'resetpassword' :
                    ResetPassword(key, login);
                break;    
            }
        }     
        c_solution.basic = { ...c_solution};      

        solution          = c_solution;

        solution.update_interface ();                    //render all

        solution.evaluate_interface ();                  //launch init on each module
      
        solution_update();               

        if (solution.dynamic) {
            InitApp (solution)    
        }      
    }

    Init_module (solution, module, placement) {

        let sb_elt = solution.update_module (module, placement)
                
        if (!sb_elt) {
            return;
        }

        solution.module_init (sb_elt)

        solution_module_update(module, placement);                
    }

    End_module (solution, module, placement) {

        let sb_elt  = solution.ui.sb.get(body, 'pname', module.pname);  

        if (sb_elt.length == 0) {
            return;
        }
        sb_elt = sb_elt[0];

        solution.module_end (sb_elt)

        solution.update_module (module, placement, true)
        solution_module_update(module, placement);             
    }

    //---------------------------------------------------------------- LOAD SCRIPT FILE DYNAMICALLY ---------------------------------------------------------

    load_configurationfile (urlfile) {
        this.configuration = JSON.parse (this.get_file(urlfile));    
    }

    save_configuration () {

    }

    check_configuration () {                   //check if rightsidebar panel and menu are initialized with settings

        let rightsidebarpanel   = this.ui.sb.get(right, 'id', 'right_sidebarpanel');    
        if (rightsidebarpanel.length == 0) {
            rightsidebarpanel = default_right_sidebarpanel;
            right.items.push (rightsidebarpanel);
        } 
        
        let rightsidebarmenu   = this.ui.sb.get(right, 'id', 'right_sidebarmenu');    
        if (rightsidebarmenu.length == 0) {
            rightsidebarmenu = default_right_sidebarmenu; 
            right.items.push (rightsidebarmenu);
        }    
        let headerbaritems   = this.ui.sb.get(header, 'id', 'headerbar_items');    

        if (headerbaritems.length == 0) {
            headerbaritems = {id: 'headerbar_items', type: 'group', position: 'me-auto', toggle: true, items: [],}        
            header.items.unshift (headerbaritems)
        }

        if (main.items.length != 0) {        // program loaded with main not empty
            this.header_updateplatforms();        
        }
    }

    check_global_loaded () {                     // we check in case of static loading if all global files are present           
        if (!this.dynamic) {                                    
            let root = this.configuration;

        //global_library
            let global_css = root.global_library.stylesheet;
            let global_js  = root.global_library.javascript;
            
            for (var i = 0; i < global_css.length; i++) {
                if (!this.script_exist (global_css[i], 'text/css')) {
                    this.get_script (global_css[i], 'text/css', this.withcontent)
                }
            }
            for (var i = 0; i < global_js.length; i++) {
                if (!this.script_exist (global_js[i], 'text/javascript')) {
                    this.get_script (global_js[i], 'text/javascript', this.withcontent)
                }                
            }

        //tools_library
            let tools_css = root.tools_library.stylesheet;
            let tools_js  = root.tools_library.javascript;
            
            for (var i = 0; i < tools_css.length; i++) {
                if (!this.script_exist (tools_css[i], 'text/css')) {
                    this.get_script (tools_css[i], 'text/css', this.withcontent)
                }            
            }
            for (var i = 0; i < tools_js.length; i++) {
                if (!this.script_exist (tools_js[i], 'text/javascript')) {
                    this.get_script (tools_js[i], 'text/javascript', this.withcontent)
                }
            }
        }   

    }

    //-------------------------------------------------- Uploading or Deleting scripts ------------------------------------------------------------------------------

    add_configuration_scripts () {                                   //read modules in configuration file and upload all scripts
        let root = this.configuration;
    //title and icon
        let title = root.title;
        let icon  = root.icon;
        if (title) {
            this.get_htmltag('title', title)
        }
        if (icon) {
            let async = true;
            this.get_script(icon, 'image/x-icon', this.withcontent, async)
        }

    //global_library
        let global_css = root.global_library.stylesheet;
        let global_js  = root.global_library.javascript;
        
        for (var i = 0; i < global_css.length; i++) {
            if (!this.script_exist (global_css[i], 'text/css')) {
                this.get_script (global_css[i], 'text/css', this.withcontent)
            }
        }
        for (var i = 0; i < global_js.length; i++) {
            if (!this.script_exist (global_js[i], 'text/javascript')) {                    
                this.get_script (global_js[i], 'text/javascript', this.withcontent)
            }
        }
    //tools_library
        let tools_css = root.tools_library.stylesheet;
        let tools_js  = root.tools_library.javascript;
        
        for (var i = 0; i < tools_css.length; i++) {
            if (!this.script_exist (tools_css[i], 'text/css')) {
                this.get_script (tools_css[i], 'text/css', this.withcontent)
            }
        }
        for (var i = 0; i < tools_js.length; i++) {
            if (!this.script_exist (tools_js[i], 'text/javascript')) {                
                this.get_script (tools_js[i], 'text/javascript', this.withcontent)
            }
        }

    //common_library
        let common_css = root.common_library.stylesheet;
        let common_js  = root.common_library.javascript;
        
        for (var i = 0; i < common_css.length; i++) {
            if (!this.script_exist (common_css[i], 'text/css')) {
                this.get_script (common_css[i], 'text/css', this.withcontent)
            }
        }
        for (var i = 0; i < common_js.length; i++) {
            if (!this.script_exist (common_js[i], 'text/javascript')) {                
                this.get_script (common_js[i], 'text/javascript', this.withcontent)
            }
        }
    // modules     
        let placements = ['header', 'left', 'main', 'right', 'footer']
        for (var p = 0; p < placements.length; p++) {
            let modules =  root.body[placements[p]] &&  root.body[placements[p]].modules ? root.body[placements[p]].modules : null;
            if (modules) {
                for (var j = 0; j < modules.length; j++) {
                    let module = modules[j];
                    this.add_module_scripts(module, placements[p])
                }           
            }
        }
    
    // body_library

        let body_css = root.body.library.stylesheet;
        let body_js  = root.body.library.javascript;
        
        for (var i = 0; i < body_css.length; i++) {
            if (!this.script_exist (body_css[i], 'text/css')) {
                this.get_script (body_css[i], 'text/css', this.withcontent)
            }
        }
        for (var i = 0; i < body_js.length; i++) {
            if (!this.script_exist (body_js[i], 'text/javascript')) {                
                this.get_script (body_js[i], 'text/javascript', this.withcontent)
            }
        }       
    
    //    this.script_is_loaded(this.Init, this)
    }

    add_module_scripts  (module, placement, forceactive) {     //upload a module in configuration file that is not loaded (not active) and insert in loaded modules
        let modules =  this.modules[placement]

        if (forceactive) {
            module.active = true;
        }

        if (!module.active) {
//            console.log ('module is not active')
            return null;
        }

        if (modules.includes(module)) {                        
            console.log ('module already loaded')
            if (this.withcontent) {                                     // only add styles which are not in memory  
                let module_css = module.library.stylesheet;
                for (var i = 0; i < module_css.length; i++) {
                    if (!this.script_exist (module_css[i], 'text/css')) {            
                        this.get_script (module_css[i], 'text/css', this.withcontent)
                    }
                }
            }
            return module;
        }         

        modules.push (module)
       
        let module_css = module.library.stylesheet;
        let module_js  = module.library.javascript;
        
        for (var i = 0; i < module_css.length; i++) {
            if (!this.script_exist (module_css[i], 'text/css')) {            
                this.get_script (module_css[i], 'text/css', this.withcontent)
            }
        }
        for (var i = 0; i < module_js.length; i++) {
            if (!this.script_exist (module_js[i], 'text/javascript')) {                 
                this.get_script (module_js[i], 'text/javascript', this.withcontent)
            }
        }     
        return module
    }


    delete_module_scripts  (module, placement) {
        let modules =  this.modules[placement]

        module.active = false;

/*        
        let index = modules.indexOf(module);
        if (index >= 0) { 
            modules.splice(index, 1); // 2nd parameter means remove one item only
        } 
*/ 
        let module_css = module.library.stylesheet;
        let module_js  = module.library.javascript;
        
        for (var i = 0; i < module_css.length; i++) {
            if (!this.script_is_used (module_css[i])) {            
                this.delete_script_content (module_css[i])
            }
        }
        for (var i = 0; i < module_js.length; i++) {
            if (!this.script_is_used (module_js[i])) {                 
                this.delete_script_content (module_js[i])
            }
        }     
        return module
    }

    //-------------------------------------------------- 2 - Updating  SB items  then render ------------------------------------------------------------------------------

    update_interface () {                                             // add all sb_items and render body from all modules in configuration file
        this.check_configuration ()
                
        if (this.dynamic) {
            this.brand_update ();

            for (var i = 0; i < this.modules.header.length; i++) {
                this.header_update (this.modules.header[i])
            }
            for (var i = 0; i < this.modules.main.length; i++) {
                this.main_update (this.modules.main[i])
            }            
            for (var i = 0; i < this.modules.right.length; i++) {
                this.right_update (this.modules.right[i])
            }   
            for (var i = 0; i < this.modules.left.length; i++) {
                this.left_update (this.modules.left[i])
            } 
            for (var i = 0; i < this.modules.footer.length; i++) {
                this.footer_update (this.modules.footer[i])
            }                                       
        } 

        this.ui.update(); 
    }

    update_module (module, placement, remove) {                                // add corresponding sb_item and render
        let sb_elt = null;
        switch (placement) {
            case 'main':
                sb_elt = this.main_update(module, remove)
                this.ui.main_update (sb_elt, remove)
                break
            case 'right':
                sb_elt = this.right_update(module, remove)
                this.ui.right_update (sb_elt, remove)
                break
            case 'left':
                sb_elt = this.left_update(module, remove)
                this.ui.left_update (sb_elt, remove)
                break
            case 'footer':
                sb_elt = this.footer_update(module, remove)
                this.ui.footer_update (sb_elt, remove)
                break                    
            case 'header':
                break
        }
        return sb_elt;
    }

  //-------------------------------------------------- 3 - Evaluating  modules initialization  ------------------------------------------------------------------------------
    
    evaluate_interface () {                                           // launch module init for all modules if present                
        let rest_body = [header, main, footer]
        for (var p = 0; p < rest_body.length; p++) {
            for (var i= 0; i < rest_body[p].items.length; i++) {
                let sb_elt = rest_body[p].items[i];
                if (!sb_elt) {
                    continue;
                }
                this.module_init (sb_elt)

            }
        }         

        let right_sidebarpanel = right.items[0]
        if (right_sidebarpanel) {
            for (var i= 0; i < right_sidebarpanel.items.length; i++) {
                let sb_elt = right_sidebarpanel.items[i].items[0];
                if (!sb_elt) {
                    continue;
                }
                this.module_init (sb_elt)
            }          
        }            
    }

    module_init (sb_elt) {                                         // launch module init for module if present
        if (sb_elt.init) {
            try  {  
                eval (sb_elt.init)
                                                                   // look for dependency;
            }
            catch (e) {
                console.log (sb_elt.id + ' : Error in module launching module_init' + sb_elt.pname + ' :' + e);
            }   
        }
        if (sb_elt.dependency) {
            for (var i = 0; i < sb_elt.dependency.length; i++) {
                let panel =  this.ui.sb.get(main, 'pname', sb_elt.dependency[i]);

                if (panel.length == 0) {
                    solution.add_module(sb_elt.dependency[i]);  
                }   
            }
        }
    }

    module_end (sb_elt) {                                         // launch module init for module if present
        if (sb_elt.end) {
            try  {  
                eval (sb_elt.end)
            }
            catch (e) {
                console.log (sb_elt.id + ' : Error in module launching module end' + sb_elt.pname + ' :' + e);
            }   
        }
    }


    //---------------------------------------------------------------- sb update ------------------------------------------------------------

    brand_update (module){
    // header
        let brand =  this.configuration.body.header.brand;
        if (brand) {
            header.brand = brand;
        }
    }

    header_update (module, remove){
        let element  = window[module.pname + module.type];

        if (!element) {
//            console.log ('sb object not identified: ' + module.pname + module.type);
            return;
        }  
        if(!remove) {
            if (!header.items.includes(element)) {
                header.items.push (element);
            }
        } else {
        }
    }
 
    footer_update  (module, remove) {
        let element  = window[module.pname + module.type];
        if (!element) {
//            console.log ('sb object not identified: ' + module.pname + module.type);
            return;
        }  

        let index = solution.Get(footer.items, 'pname', element.pname)[1]

        if(!remove) {
            element =  {...element, ...module};

            if (index < 0) {
                footer.items.push (element);
            } else {                 //update sb_interface in case we change in configuration file
                window[module.pname + module.type] = element;            
                footer.items[index] = element;
            }
        } else {
            if (index >= 0) { 
                footer.items.splice(index, 1); 
            } 
        }

        return element;
    }

    main_update (module, remove) {
        let element  = window[module.pname + (module.type == 'root' ? 'platform' : module.type)];
        if (!element) {
//            console.log ('sb object not identified: ' + module.pname + module.type);
            return;
        }  
        
        let index  = this.Get(main.items, 'pname', element.pname)[1];  
        if (!remove) {
            element =  {...element, ...module};

            if (index < 0) {
                element =  {...element, ...module};

                let mainnbr      = main.items.length;
                if (mainnbr == 0 || element.index == null) {
                    main.items.push (element);
                }
                else {
                    if (element.index <= 0) {
                        main.items.unshift(element);
                    } else {
                        if (element.index > mainnbr) {                  
                            main.items.push (element);
                        } else {
                            main.items.splice (element.index -1, 0, element)
                        }
                    }
                } 
            } else {                 //update sb_interface in case we change in configuration file
                window[module.pname + (module.type == 'root' ? 'platform' : module.type)] = element;            
                main.items[index] = element;
            }
        } else {
            if (index >= 0) { 
                main.items.splice(index, 1); 
            } 
        }

        if (element.type == 'root') {
            this.header_updateplatform(element, remove)
        }

        return element;
    }
 
    header_updateplatforms () {                                   // update header bar for platforms loaded statically

        let platformitems   = this.ui.sb.get(body, 'type', 'root');
        if (platformitems.length == 0) {
//            console.log ('no root platform is found')
            return;
        }
        for (var i = 0; i < platformitems.length; i++) {
            let element = platformitems[i]
            this.header_updateplatform(element)
        }          
    }

    header_updateplatform (platform, remove) {                             // add header item for the corresponding main platform added
        let headerbaritems  = this.ui.sb.get(header, 'id', 'headerbar_items');    
        let headerbaritem   = this.ui.sb.get(headerbaritems[0], 'id', platform.id + '_menu');    //better rootpname

        if (!remove) {
            if (headerbaritem.length == 0) {
                headerbaritem = {id: platform.id + '_menu', item : platform.name, type: 'link',  title: '',  attributes: {rootpname: platform.pname}, 
                                    events: {onclick: "onclick_headerbaritems (this, event)"}
                                }
                headerbaritems      = headerbaritems[0];
                let headerbaritemslength  = headerbaritems.items.length;
                if (headerbaritemslength == 0 || platform.index == null) {
                    headerbaritems.items.push (headerbaritem);
                }
                else {
                    if (platform.index <= 0) {
                        headerbaritems.items.unshift(headerbaritem);
                    } else {
                        if (platform.index > headerbaritemslength) {                  
                            headerbaritems.items.push (headerbaritem);
                        } else {
                            headerbaritems.items.splice (platform.index -1, 0, headerbaritem)
                        }
                    }
                } 
            }         
        } else {
            let index = headerbaritems[0].items.indexOf(headerbaritem[0]);
            if (index !== -1) {
                headerbaritems[0].items.splice(index, 1); 
            }            
        }
    }  

    right_update (module, remove) {

        let element  = window[module.pname + (module.type == 'root' ? 'platform' : module.type)];
        if (!element) {
//            console.log ('sb object not identified: ' + module.pname + module.type);
            return;
        }  
        let rightsidebarpanel = this.ui.sb.get (right, 'id', 'right_sidebarpanel')[0]
        let rightsidebarmenu  = this.ui.sb.get (right, 'id', 'right_sidebarmenu')[0]

        let panelstruct  = solution.Get(rightsidebarpanel.items, 'id', 'rightsidebarpanel_' + module.pname);
        let panel = panelstruct[0]
        let index = panelstruct[1]    
        
        let menustruct  = solution.Get(rightsidebarmenu.items[0].items, 'id', 'rightsidebar_' + module.pname);
        let panelmenu = menustruct[0]
        let indexmenu = menustruct[1]   


        if (!remove) {
            
            let modulename = module.pname;
            let sbsidepanelitem;
            
            if (index < 0) {
                panel = {id: 'rightsidebarpanel_' + module.pname, type: 'panel',    class: 'sb_panel sb_main sb_none', items: []},
                rightsidebarpanel.items.splice(1, 0, panel);
            }     

            if (!panel.items.includes(element)) {
                panel.items.push (element);
            }

           
            if (indexmenu < 0) {
                panelmenu = {id: 'rightsidebar_' + modulename, type: 'link', title: module.title ? module.title : '', events: {onclick: "onclick_rightsidebarmenu(this.id)"}}
                module.iconfile ? panelmenu.iconfile = module.iconfile : module.icon ? panelmenu.icon = module.icon :   panelmenu.icon = sb_icons['icon_question'];
                rightsidebarmenu.items[0].items.push (panelmenu);
            } 

            if (element.type == 'root') {
//                console.log ('root can only be inserted in main')
            }
        } else {
            
            if (index >= 0) { 
                rightsidebarpanel.items.splice(index, 1); 
            } 
            if (indexmenu >= 0) { 
                rightsidebarmenu.items[0].items.splice(indexmenu, 1); 
            }             
        }   
        return element;
    }

    left_update (module, remove) {
        let element  = window[module.pname + module.type];
        if (!element) {
//            console.log ('sb object not identified: ' + module.pname + module.type);
            return;
        }  

        let lefttsidebarpanel   = this.ui.sb.get(right, 'id', 'left_sidebarpanel');    
        if (lefttsidebarpanel.length == 0) {
            lefttsidebarpanel = {
                id: 'left_sidebarpanel',
                type: 'panel',
                class: 'sb_sidebarpanel sb_right',     
                items : 
                [
                ]
            }
            left.items.push (lefttsidebarpanel);
        } else {
            lefttsidebarpanel = lefttsidebarpanel[0]
        }

        let modulename = module.pname;
        let sbsidepanelitem  = this.ui.sb.get(lefttsidebarpanel, 'id', 'leftsidebarpanel_' + modulename);
        if (sbsidepanelitem.length == 0) {
          
            sbsidepanelitem = {
                id: 'leftsidebarpanel_' + modulename,
                type: 'panel',    class: 'sb_panel', items: []},
                lefttsidebarpanel.items.unshift (sbsidepanelitem);
        } else {
            sbsidepanelitem = sbsidepanelitem[0]
        }        

        if (!sbsidepanelitem.items.includes(element)) {
            sbsidepanelitem.items.push (element);
        }
        if (element.type == 'root') {
//            console.log ('root can only be inserted in main')
        }
        return element;
    }

//-------------------------------------------------------- Modules that are added or deleted -----------------------------------------------------------------

    get_modulefrompname (pname) {
        let body = this.configuration.body;
        let placements =  ['header', 'main', 'right', 'left', 'footer']
        
        for (var i = 0; i < placements.length; i++) {
            let placement = placements[i];
            let modules = body[placement] && body[placement].modules ? body[placement].modules  : null
            if (!modules) continue;

            let module = this.Get (modules, 'pname', pname)[0];
            if (module) {
                return {module: module, placement: placement}
            }
        }
        return null;
    }

    add_module (pname) {                                  // upload the module and then launch module initialisation (sb interface)

        let struct_module = this.get_modulefrompname(pname)
        if (!struct_module) {
//            console.log ('add_module : configuration file does not contain the module' + pname);
            return;
        }
    
        this.check_global_loaded ()                     // for application not dynamic  need to be in terms with the configuration file
        
        let module      = struct_module.module;
        let placement   = struct_module.placement;
        
        if (this.add_module_scripts(module, placement, 1)) {
            this.script_is_loaded(this.Init_module, this, module, placement)
        }        
    }

    remove_module  (pname) {
        let struct_module = this.get_modulefrompname(pname)
        if (!struct_module) {
//            console.log ('remove_module : configuration file does not contain the module' + pname);
            return;
        }

        let module      = struct_module.module;
        let placement   = struct_module.placement;
        let remove      = true;

        if (this.delete_module_scripts(module, placement, remove)) {
            this.End_module (this, module, placement)            
        }        
    }

    get_file  (urlfile, async, callback, values, aftercallback, aftervalues)  {           //depends engine
        
        var callbackreturn = null;    //case synchrone
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
    
        xhttp.open('GET', urlfile, async);
       
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (callback)       { 
                    callbackreturn = callback (this.responseText, values);
                }
                else {
                    callbackreturn = this.responseText;
                }                    
                if (aftercallback)  {
                    aftercallback (aftervalues);                      
                }
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request');
            }            
        };
        try {
            xhttp.send();
        } catch (error) {
            console.log (error)
        }
        return callbackreturn;    
    }    

    script_is_used (filename) {
        return false;

    }
    script_is_loaded (callback, par, par1, par2) {

        if (!this.withcontent) {                                            // adding links
            let fileref = document.createElement('script');
            fileref.callback    = callback;
            fileref.param       = par;
            fileref.param1      = par1;
            fileref.param2      = par2;

            fileref.onload = function() {
                console.log(' is loaded.');

                this.callback (this.param, this.param1, this.param2)
            }
            fileref.setAttribute("type", 'text/javascript'); 
            fileref.setAttribute("module", "finish_loading");  
            fileref.setAttribute("src", "/js/empty_js.js");
            fileref.setAttribute("async", false);  
            document.getElementsByTagName("head")[0].appendChild(fileref)   
            return;
        }   
        callback(par, par1, par2)       
    }    

    script_exist (filename, mime) {
                                                                               // find out loaded in index static
        if (mime == "text/css"){ 
            return document.querySelector('[href="' + filename + '"]')                               
        }
        if (mime == "text/javascript") {
            return document.querySelector('[src="' + filename + '"]')                               
        }                           

        return document.querySelector('[module="' + filename + '"]');                     // find if loaded dynamically     
    }

    delete_script_content (filename) {
        let index = this.includefiles.indexOf(filename);
        if (index >= 0) { 
            this.includefiles.splice(index, 1); // 2nd parameter means remove one item only
        }        
        $('[module="' + filename + '"]').remove ();
    }

    get_script (filename, mime, withcontent, async) {                                   //default false

        var async = async ? async : false;

        if (this.includefiles.includes(filename)) {
        //    console.log ('file ' + filename  + ' already included')
            return;
        }
        this.includefiles.push (filename);

        let fileref;
        let content;        
        if (withcontent) {
            content = this.get_file(filename);
            if (content == null) {
                console.log ('Erreur in Reading module file ' + filename);
                return
            }
        }    
       
        if (mime == "text/javascript"){ //if filename is an external CSS file
            fileref = document.createElement('script');

            fileref.setAttribute("type", mime); 
            fileref.setAttribute("module", filename);  

            if (withcontent) {
                fileref.innerHTML = content;                
            } else {
                fileref.setAttribute("src", filename);
                fileref.setAttribute("async", async);            
            }

            document.getElementsByTagName("head")[0].appendChild(fileref)
        }  else

        if (mime == "text/css"){ //if filename is an external CSS file
            if (withcontent) {
                fileref = document.createElement('style');
            } else {
                fileref = document.createElement('link');
            }
            fileref.setAttribute("type", mime);   
            fileref.setAttribute("rel", 'stylesheet');  
            fileref.setAttribute("module", filename);  

            if (withcontent) {
                fileref.innerHTML = content;                
            } else {
                fileref.setAttribute("href", filename);   
                fileref.setAttribute("async", async);            
            }


            document.getElementsByTagName("head")[0].appendChild(fileref)                      
        } else

        if (mime == "image/x-icon"){ //if filename is an external CSS file
            let tagelts =  document.querySelectorAll('[type="' + mime + '"]');    

            if (tagelts && tagelts.length != 0) {
                fileref = tagelts[0];
            } else {
                fileref = document.createElement('link');
                document.getElementsByTagName("head")[0].appendChild(fileref)                      
            }
            fileref.setAttribute("type", mime);   
            fileref.setAttribute("rel", 'icon');                          
            fileref.setAttribute("module", filename);  

            fileref.setAttribute("href", filename);   
        }         
        else {
            return 
        }
    }    

    get_htmltag (tag, content) {
        let tagelts =  document.getElementsByTagName(tag);
        if (tagelts.length != 0) {
            tagelts[0].innerHTML = content;            
        }
        else {
            let tagref = document.createElement(tag)
            tagref.innerHTML = content;
            document.getElementsByTagName("head")[0].appendChild(tagref)                      
        }
    }
   
    get_languages (aftercallback, aftervalues) {
        let async = false;
        this.get_file('/res/languages.json', async, this.onrecv_languages, [this], aftercallback, aftervalues)        
    }   
    
    onrecv_languages (response, par) {
        let solution = par[0];
        solution.languages = JSON.parse(response).filter ((value) => {
            return S_Languages.includes(value.code)
         }).sort(function (a, b) {
            const aname = a.code.toUpperCase(), 
                  bname = b.code.toUpperCase();
            if (aname < bname ) return -1;
            else if (aname == bname) return 0;
            else return +1;
        });
    }    

    get_language (isolang) {
        for (var i= 0; i < this.languages.length; i++) {
            if (this.languages[i].code == isolang) {
                return this.languages[i]
            }
        }
        return -1;    
    }

    Get (array, option, value) {
        let elt = [null, -1];
        for (var i = 0; i < array.length; i++) {
            if (eval('array[i].' + option) == value) {
                return [array[i], i];
            }
        }    
        return elt;
    }
    
    get (attribute) {
        switch (attribute) {
            case 'languages':
                return this.languages;
            break;  
            case 'navigator':
                this.navigator;
            break;  
            case 'site':
                return this.site;
            break;        
            case 'machine':
                return this.machine;
            break;        
            case 'user':
                return this.user;
            break;        
            case 'openai':
                return this.machine.openai;
            break;        
            case 'login':
                return this.user.login;
            break;        
            case 'sound':
                return this.machine.sound;
            break;        
            case 'media':
                return this.machine.media;
            break;        
            case 'recognition':
                return this.machine.recognition;
            break;        
            case 'translation':
                return this.machine.translation;
            case 'clock':
                return this.machine.clock;
            break;                 
            case 'ip':
                return this.machine.ip;
            break;     
            case 'ui':
                return this.ui;
            break;    
            case 'platforms':
                return this.ui.platforms;
            break;                  
        }
    }
}

//-------------------------------------------------------------------------- UI ---------------------------------------------------------------------------

class ui {
    constructor (theme) {
        this.sb             = sb;
        this.platforms      = [];
        this.currentplatform_pname   = '';
        this.currentplatform   = null;

        if (theme) {
            this.sb.theme      = theme
        }
    }

    update () {
        this.sb.render(body)         

        $('main').on({
            click: function (event) {
                click_main (this, event);
            },
            mouseenter: function (event) {
                mousenter_main (this, event);
            },
            mouseleave: function (event) {
                mouseleave_main (this, event);
            },
        });   
        $('header').on({
            mouseleave: function (event) {
                mouseleave_header (this, event);
            }          
        })
        this.init_theme();
        this.platforms   = this.sb.get(this.sb.interface, 'type', 'root');            
    }

    header_update (module) {
        let $header =  $('header')[0]
        this.sb.update (headerbar_items);
    }

    footer_update (sb_elt, remove) {
        let $footer =  $('footer')
        let $module = $('footer #' + sb_elt.id)
        if (!remove) {
            if ($module.length == 0) {
                let $footerchildren = $footer.children();                
                let footernbr      = $footerchildren.length;
                if (footernbr == 0 || sb_elt.index == null) {
                    $footer.append(this.sb.render (sb_elt));
                }
                else {
                    if (sb_elt.index <= 0) {
                        $footer.prepend(this.sb.render (sb_elt));
                    } else {
                        if (sb_elt.index > mainnbr) {                  
                            $footer.append(this.sb.render (sb_elt));
                        } else {
                            $('#' + $footerchildren[sb_elt.index-1].id).before(this.sb.render (sb_elt))
                        }
                    }
                }

            } else {
                this.sb.update (sb_elt);
            }
            this.sb.drag_update();   // inform drag_update to update        
        } else {
            $module.remove();
        }
    }
    
    main_update (sb_elt, remove) {
        let $main =  $('main')
        let $module = $('main #' + sb_elt.id)

        if (!remove) {

            if ($module.length == 0) {
                if (sb_elt.type == 'root') {
                    $main.append(this.sb.render (sb_elt));
                } else {
                    let $mainchildren = $main.children(':not(.sb_root)');
                    let mainnbr      = $mainchildren.length;
                    if (mainnbr == 0 || sb_elt.index == null) {
                        $main.prepend(this.sb.render (sb_elt));
                    }
                    else {
                        if (sb_elt.index <= 0) {
                            $main.prepend(this.sb.render (sb_elt));
                        } else {
                            if (sb_elt.index > mainnbr) {                  
                                $main.append(this.sb.render (sb_elt));
                            } else {
                                $('#' + $mainchildren[sb_elt.index-1].id).before(this.sb.render (sb_elt))
                            }
                        }
                    }
                }
            } else {
                this.sb.update (sb_elt);
            }
            if (sb_elt.type != 'root') {
                return;
            }

            let sb_header_item   = this.sb.get(header, 'id', sb_elt.id + '_menu'); 
            if (sb_header_item.length == 0) {
                console.log ('error: header item sb element should be present')
                return;
            }          
            sb_header_item = sb_header_item[0]   

            let $header_baritems = $('header #headerbar_items')  
            if ($header_baritems.length == 0) {
                console.log ('header item dom element should be present')
                return;
            }       
                
            let $headeritem = $('#' + sb_elt.id + '_menu')

            if ($headeritem.length == 0) {
                let $headerchildren =  $header_baritems.children();
                let headeritemsnbr  = $headerchildren.length;
                if (headeritemsnbr == 0 || sb_elt.index == null) {
                    $header_baritems.append(this.sb.render (sb_header_item));
                } else {
                    if (sb_elt.index <= 0 ) {                  
                        $header_baritems.prepend(this.sb.render (sb_header_item));
                    } else {
                        if (sb_elt.index > headeritemsnbr) {                  
                            $header_baritems.append(this.sb.render (sb_header_item));
                        } else {
                            $('#' + $headerchildren[sb_elt.index-1].id).before(this.sb.render (sb_header_item))
                        }
                    }
                }
            } else {
                this.sb.update (sb_header_item)        
            }

            if (!this.platform_get ('pname', sb_elt.pname)) {
                this.platforms.push (sb_elt)
            }
            this.sb.drag_update();   // inform drag_update to update
        } else {
            $module.remove();
            $('#' + sb_elt.id + '_menu').remove();
         
        }
    }
    right_update (sb_elt, remove) {
        
        let $rightsidebarpanel =  $('#right .sb_rightsidebarpanel')
        if (!remove) {
            if ($rightsidebarpanel.length == 0) {
                $('#right').append(this.sb.render(this.sb.get(right,  'id', 'right_sidebarpanel')[0]))
            } else {
                let $module           = $('#right #rightsidebarpanel_' + sb_elt.pname)
                if ($module.length == 0) {
                    let sbsidepanelitem  = this.sb.get(right,  'id', 'rightsidebarpanel_' + sb_elt.pname);              
                    $rightsidebarpanel.append(this.sb.render (sbsidepanelitem[0]));

                } else {
                    let $elt =  $('#right #rightsidebarpanel_' + sb_elt.pname + ' #' + sb_elt.id)
                    if ($elt.length == 0) {
                        $module  = $('#right #rightsidebarpanel_' + sb_elt.pname    )
                        $module.append(this.sb.render (sb_elt));
                    } else {            
                        this.sb.update (sb_elt);
                    }
                }
            }
        
            let $rightsidebarmenu =  $('#right .sb_sidebarmenu')
            if ($rightsidebarmenu.length == 0) {
                $('#right').append(this.sb.render(this.sb.get(right,  'id', 'right_sidebarmenu')[0]))
            } else {
                let $rightsidebarmenugroup =  $('#right #right_sidebarmenu_maingroup')        
                let $menumodule            = $('#right #rightsidebar_' + sb_elt.pname)
                if ($menumodule.length == 0) {
                    let sbsidemenuitem  = this.sb.get(right,  'id', 'rightsidebar_' + sb_elt.pname);              
                    $rightsidebarmenugroup.append(this.sb.render (sbsidemenuitem[0]));

                } else {
                    this.sb.update (sb_elt);
                }
            }
            this.sb.drag_update();   // inform drag_update to update
        } else {
            $('#right #rightsidebarpanel_' + sb_elt.pname).remove();
            $('#right #rightsidebar_' + sb_elt.pname).remove();            
        }
    }

    left_update (sb_elt, remove) {
        let $leftsidebarpanel =  $('#left .sb_sidebarpanel')
        let $module           = $('#left #leftsidebarpanel_' + sb_elt.pname)
        if (!remove) {
            if ($module.length == 0) {
                let sbsidepanelitem  = this.sb.get(left,  'id', 'leftsidebarpanel_' + sb_elt.pname);              
                $leftsidebarpanel.append(this.sb.render (sbsidepanelitem[0]));

            } else {
                let $elt =  $('#left #leftsidebarpanel_' + sb_elt.pname + ' #' + sb_elt.id)
                if ($elt.length == 0) {
                    $module  = $('#left #leftsidebarpanel_' + sb_elt.panel)
                    $module.append(this.sb.render (sb_elt));
                } else {            
                    this.sb.update (sb_elt);
                }
            }
            this.sb.drag_update();   // inform drag_update to update
        } else {
            $module.remove ();
        }
    }
    main_select (platform) {
        for (var i=0; i < this.platforms.length; i++) {
            var cplatform = this.platforms[i];
            if (cplatform == platform) {
                $('#' + cplatform.id).css('display', 'flex');    
                $('#' + cplatform.id).css('pointerEvents', 'auto');                             
            } else {
                $('#' + cplatform.id).css('display', 'none');  
                $('#' + cplatform.id).css('pointerEvents', 'none');    
            }
        }    
    }
    brand_select (platform) {
        if (platform.brand) {
            let content = this.sb.bar_header(platform.brand);
            $('header ' + '.sb_brand').replaceWith(content)
        }

    }
    header_select  (platform) {
        let $platformsmenus = $('#' + platform.id + '_menu').parent().children();
        $.each($platformsmenus, function (index, menu) {
            $(menu).removeClass('active'); 
            $(menu).removeClass('checked');             
            });
        $('#' + platform.id + '_menu').addClass('active'); 
        $('#' + platform.id + '_menu').addClass('checked');    
        this.brand_select(platform)             
    }  

    platform_updatedata (pname, data) {
        let platform = this.platform_get('pname', pname);   
        if (!platform) {
            return
        }
        if (platform ==  this.currentplatform) {
            this.currentplatform.data = data;
        }
    }

    platform_select (pname, force_refresh) {
        let platform = this.platform_get('pname', pname);    
        if (!platform) {
            return;
        }

        if (!force_refresh && this.currentplatform_pname  == pname) {
            return;
        }

        this.currentplatform_pname  = pname;
        this.currentplatform        = platform;

        this.header_select (platform);
        this.main_select(platform);
        
        if (defined(platform.select)) {        //define external data to platform
            eval (platform.select);
        } else {
            platform.data = null;            
        }
        return platform;
    }

    platform_expand (pname, notoggle) {
        if (!pname) {
            pname = this.currentplatform_pname;
        }
        
        let platform = this.platform_get ('pname', pname) 
        if (!platform) {
            return;
        }
        let expanded = $('#header').hasClass (pname + '_expanded')
        
        expanded = notoggle ? expanded : !expanded;
        
        if (!expanded) {
            $('#header').css ('display', '');
            $('#header').removeClass (pname + '_expanded')
        } else {
            $('#header').css ('display', 'none');
            $('#header').addClass (pname + '_expanded')
        }
    }

    platform_get  (option, value) {
        for (var p = 0; p < this.platforms.length; p++) {
            if (eval('this.platforms[p].' + option) == value) {
                return this.platforms[p];
            }
        }
        return null;
    }
    
    platform_getidfromname (platformname) {
        let platform = this.platform_get ('name', platformname)   
        if (!platform) {
            return;
        } 
        return platform.id;
    }
    init_theme () {
        bg_terminal                 = getComputedStyle(document.documentElement).getPropertyValue('--bg-terminal');
        bg_strategycreator          = getComputedStyle(document.documentElement).getPropertyValue('--bg-strategycreator');
        bg_optionterminal           = getComputedStyle(document.documentElement).getPropertyValue('--bg-optionterminal');
    
        theme_main_color            = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-main-color');        
        theme_color                 = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-color');    
        theme_chart_bullstroke      = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullstroke');
        theme_chart_bearstroke      = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearstroke');
        theme_chart_bullwickstroke  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullwickstroke');
        theme_chart_bearwickstroke  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearwickstroke');
        theme_chart_bullbody        = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullbody');
        theme_chart_bearbody        = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearbody');
       
        theme_bull                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-bull');
        theme_bear                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-bear');
        theme_buy                   = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-buy');
        theme_sell                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-sell');
       
        theme_buysell               = getComputedStyle(document.documentElement).getPropertyValue('--theme-buysell');
       
        theme_on                    = getComputedStyle(document.documentElement).getPropertyValue('--theme-on');
           
        IsValueBColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsValueBColor'); 
        IsValueTColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsValueTColor');    
        IsVariableBColor        = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsVariableBColor'); 
        IsVariableTColor        = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsVariableTColor'); 
        IsLogicBColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsLogicBColor'); 
        IsLogicTColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsLogicTColor');
        IsBasic1LogicBColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsBasic1LogicBColor'); 
        IsBasic1LogicTColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsBasic1LogicTColor'); 
        IsBasic2LogicBColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsBasic2LogicBColor'); 
        IsBasic2LogicTColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsBasic2LogicTColor'); 
        IsMathBColor            = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsMathBColor'); 
        IsMathTColor            = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsMathTColor');
        IsInputBColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsInputBColor'); 
        IsInputTColor           = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsInputTColor'); 
        IsObjectInputBColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectInputBColor');
        IsObjectInputTColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectInputTColor');
    
        IsFieldInputBColor      = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsFieldInputBColor');
        IsFieldInputTColor      = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsFieldInputTColor');
        
        IsActionBColor          = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsActionBColor'); 
        IsActionTColor          = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsActionTColor'); 
    
        IsIfStatementBColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsIfStatementBColor');
        IsIfStatementTColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsIfStatementTColor');
        IsElseStatementBColor   = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsElseStatementBColor');
        IsElseStatementTColor   = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsElseStatementTColor');
        IsFunctionBColor        = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsFunctionBColor');
        IsFunctionTColor        = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsFunctionTColor');  
        IsObjectLogicBColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectLogicBColor');
        IsObjectLogicTColor     = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectLogicTColor');
    
        IsConditionBColor       = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsConditionBColor'); 
        IsConditionTColor       = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsConditionTColor'); 
    
        IsSetBColor             = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsSetBColor'); 
        IsSetTColor             = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsSetTColor');
        IsSetqBColor            = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsSetqBColor'); 
        IsSetqTColor            = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsSetqTColor');
       
        IsObjectBSelected       = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectBSelected'); 
        IsObjectTSelected       = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectTSelected');    
        IsObjectBInverted       = getComputedStyle(document.documentElement).getPropertyValue('--theme-IsObjectBInverted');   
    }

    update_theme(themeid) {

        this.sb.theme      = themeid
        $('.sb_body').attr('theme', themeid)

        theme_main_color            = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-main-color');           
        theme_color                 = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-color');       
        theme_chart_bullstroke      = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullstroke');
        theme_chart_bearstroke      = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearstroke');
        theme_chart_bullwickstroke  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullwickstroke');
        theme_chart_bearwickstroke  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearwickstroke');
        theme_chart_bullbody        = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bullbody');
        theme_chart_bearbody        = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-chart-bearbody');
        theme_bull                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-bull');
        theme_bear                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-bear');
        theme_buy                   = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-buy');
        theme_sell                  = getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('--theme-sell');    

    }
}

class login {
    constructor () {
        this.url_login      =  document.location.protocol + '//' + document.location.host + '/wp-login1.php',    
        this.url_register   =  document.location.protocol + '//' + document.location.host + '/wp-login1.php?action=register',
        this.url_resetpass  =  document.location.protocol + '//' + document.location.host + '/wp-login1.php?action=resetpassword',
        this.url_lostpass   =  document.location.protocol + '//' + document.location.host + '/wp-login1.php?action=lostpassword',
        this.url_logout     =  document.location.protocol + '//' + document.location.host + '/wp-login1.php?action=logout'                 
        this.component      = '';
    }
    set_url (urllogin, urlregister, urlresetpass, urllostpass, urllogout) {
        this.url_login      = urllogin    
        this.url_register   = urlregister 
        this.url_resetpass  = urlresetpass
        this.url_lostpass   = urllostpass 
        this.url_logout     = urllogout 
    }
}

class user {
    constructor () {
        this.id           = '';
        this.name         = '';
        this.password     = '';
        this.mail         = '';
        this.firstname    = '';
        this.lastname     = '';
        this.dname        = '';
        this.photo        = '';
        this.path         = '';
        this.fileexplorer = '';
        this.registering  = false;
        this.login        = new login ();    
    } 
    set (userid, username, usermail, userfirstname, userlastname, userdname, userphoto) {
        this.id        = userid;
        this.name      = username;
        this.password  = '';
        this.mail      = usermail;
        this.firstname = userfirstname;
        this.lastname  = userlastname;
        this.dname     = userdname;
        this.photo     = userphoto;
        this.path      = userid != 0 ? '/members/' + userid : '/members/1';
     //   this.send({Name: 'makedir',  Values: [this.path, 'NetProg']}, false, function (content, values) {}, [this])
     //   this.send({Name: 'makedir',  Values: [this.path  + '/NetProg', 'Script_Server']}, false)
     //   this.send({Name: 'makedir',  Values: [this.path  + '/NetProg', 'Script_Local']}, false)



    }

    is_registered () {
        return (this.id != 0)
    }

    is_admin () {
        return (this.id == 1)
    }

    onrecv (response, values) {
        //console.log (response)
    }

    send (message, async, onrecvcallback, values) {
        async =  async != undefined ? async : true;

        let smessage = JSON.stringify(message);
        url_submit ('POST', document.location.protocol + '//' + document.location.host + '/php/solution_dialog.php', {message: smessage} , async, onrecvcallback != undefined ? onrecvcallback : this.onrecv, values)

    }    
}

class site {                                                           // related to document
    constructor () {
        this.href     = document.location.href                         //returns the href (URL) of the current page
        this.hostname = document.location.hostname                     //returns the domain name of the web host
        this.pathname = document.location.pathname                     //returns the path and filename of the current page
        this.protocol = document.location.protocol                     //returns the web protocol used (http: or https:)
        this.assign   = document.location.assign                       //loads a new document
        this.host     = document.location.host;      
        this.port     = document.location.port;      
        this.address  = this.protocol + '//' + this.host;
        this.logo     = '';
    }
}

class _navigator {                                                           // related to document
    constructor () {
        this.cookieenabled  = window.navigator.cookieEnabled
        this.geolocation    = window.navigator.geolocation	
        this.language       = window.navigator.language	
        this.online         = window.navigator.onLine	
        this.useragent      = window.navigator.userAgent
        window.addEventListener("beforeunload", function(event) {
            solution.navigator.onbeforeunload (event);
          });   
          window.addEventListener("onunload", function(event) {
            solution.navigator.onunload (event);
          });                    
    //    window.onbeforeunload   = function (event) {solution.navigator.onbeforeunload (event)}
    //    window.onunload   = function (event) {solution.navigator.onunload (event)}        
    }
    onunload(event) {
        let cuser       = solution.get('user')            
        event.preventDefault();
 

        
    }    
    onbeforeunload(event) {
        let cuser       = solution.get('user')            

        let platforms = solution.ui.platforms;
        for (var i = 0; i < platforms.length; i++) {
            let platform = platforms[i];
            if (defined(platform.beforeunload)) {        //define external data to platform
                eval (platform.beforeunload);                
            }
        }
        if (cuser.id != "0")  {
            event.returnValue =  "Are you sure you want to leave?";    
        }
    }
    setCookie(cname, cvalue, exdays) {
        let expires = "Thu, 01 Jan 1970 00:00:00 UTC";
        if (exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            expires = "expires=" + d.toUTCString();
        }

        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
      
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

class machine {
    constructor () {
        this.sound        = new sound();
        this.recognition  = new recognition();
        this.openai       = new openai();
        this.translation  = new translation()        
        this.clock        = new clock();
        this.ip           = this.getip(this);   
        this.media        = new media();     


        this.clock.add_tag (clock_default_tags)

    } 
    getip (device) {
        let ip = false;
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;
    
        if (window.RTCPeerConnection) {
            ip = [];
            var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
            pc.createDataChannel('');
            pc.createOffer(pc.setLocalDescription.bind(pc), noop);
    
            pc.onicecandidate = function(event) {
                if (event && event.candidate && event.candidate.candidate)
                {
                    var s = event.candidate.candidate.split('\n');
                    ip.push(s[0].split(' ')[4]);
                    device.ip = ip[0];
                }
            }
        }
    }
}


//------------------------------------------------------------------- HEADER BAR ---------------------------------------------------------------------

function onclick_headerlogo (elt, event) {
    
}

function onclick_headerbaritems (elt, event) {
    let attr     = $(elt).attr('rootpname');
    let ui       = solution.get('ui')

    let platform = ui.platform_get('pname', attr);
    ui.platform_select (platform.pname);
}

function onclick_rightsidebarmenu (id, show) {
    if (show == undefined) {   //toggle
        if ($('#' + id).hasClass('checked')) {
            show = 0;
        }
        else {
            show = 1;
        }
    }
    let panelid = id.replace("sidebar", "sidebarpanel");
    let psidebarpanel   =  $('#' + panelid).parent ();    

    if (show == 1) {
        rightsidebarpanel_select(psidebarpanel, id);    
    } else    
    if (show == 0) {
        rightsidebarpanel_hide(psidebarpanel);            
    }
}


function rightsidebarpanel_hide (psidebarpanel) {
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass('pinned')

    psidebarpanel.css ({'transition':''});

    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });

    let sbmenus  = psidebarmenu.find('.sb_link');

    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    psidebarpanel.removeClass('toggled')

    if (toresize) {0
        sb.resize(sb.interface);        
    }
}


function rightsidebarpanel_select (psidebarpanel, id) {
    let sidebarmenu         = $('#' + id);    
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass ('pinned')
    console.log ('select right');
        
    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });
    
    let sidebarpanel   =  $('#' + id.replace("sidebar", "sidebarpanel"));  
    sidebarpanel.removeClass("sb_none");    
    sidebarpanel.addClass("sb_active");    
 
    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    sidebarmenu.addClass("checked");

    psidebarpanel.addClass('toggled')

    if (toresize) {
        sb.resize(sb.interface);        
    }
}

//------------------------------------------------------------------- MAIN SIDEBAR---------------------------------------------------------------------

function onclick_sidebarmenu (id, show) {
    let ui  = solution.get('ui') 

    let rootelt = $('#' + id).closest('.sb_root');
    let rootid = rootelt[0].id;
    let platform = ui.platform_get ('id', rootid);  
        
    if (show == undefined) {   //toggle
        if ($('#' + id).hasClass('checked')) {
            show = 0;
        }
        else {
            show = 1;
        }
    }
    if (show == 1) {
        sidebarpanel_select(platform, id.replace("sidebar", "sidebarpanel"));    
    }    
    if (show == 0) {
        sidebarpanel_hide(platform, id.replace("sidebar", "sidebarpanel"));            
    }
}

function sidebarpanel_hide (platform) {
    let psidebarmenu    = $('#' + platform.id + ' .sb_sidebarmenu'); 
    let psidebarpanel   = $('#' + platform.id + ' .sb_sidebarpanel'); 
    let drageltv        = psidebarpanel.next();  
    let toresize        = psidebarpanel.hasClass('toggled')


    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        $(panel).removeClass("sb_active");
        $(panel).addClass("sb_none");        
    });

    drageltv.addClass('sb_none');

    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });


    if (toresize) {
        psidebarpanel.removeClass('toggled')
        sb.resize(platform);
    }
}

function sidebarpanel_select (platform, id) {
    let sidebarpanel    =  $('#' + id);
    let psidebarpanel   = sidebarpanel.parent ();
    let drageltv        = psidebarpanel.next();  
    let toresize        = !psidebarpanel.hasClass ('toggled')

        
    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        $(panel).removeClass("sb_active");
        $(panel).addClass("sb_none");        
    });
    sidebarpanel.removeClass("sb_none");    

    sidebarpanel.addClass("sb_active");    
    
    drageltv.removeClass('sb_none');

    let sidebarmenu     = $('#' + id.replace("sidebarpanel", "sidebar"))
    
    let psidebarmenu    = sidebarmenu.closest('.sb_sidebarmenu'); 
    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    sidebarmenu.addClass("checked");

    if (toresize) {
        psidebarpanel.addClass('toggled')
        sb.resize(platform);
    }
}



//--------------------------------------------------------------------------------------------------------------------------------------------------
var theme_main_color;
var theme_color;
var theme_chart_bullstroke;    
var theme_chart_bearstroke;    
var theme_chart_bullwickstroke;
var theme_chart_bearwickstroke;
var theme_chart_bullbody;      
var theme_chart_bearbody;      
var bg_terminal;               
var bg_strategycreator;        
var bg_optionterminal;         
var theme_bull;                
var theme_bear;                
var theme_buy;                 
var theme_sell;                
var theme_buysell;      
var theme_on;       

var IsValueBColor; 
var IsValueTColor; 
var IsVariableBColor;       
var IsVariableTColor;  
var IsLogicBColor;           
var IsLogicTColor;  
var IsBasic1LogicBColor;     
var IsBasic1LogicTColor;     
var IsBasic2LogicBColor;     
var IsBasic2LogicTColor;  
var IsMathBColor;            
var IsMathTColor;  
var IsInputBColor;
var IsInputTColor;
var IsObjectInputBColor;     
var IsObjectInputTColor; 
var IsNumericInputBColor    =   "dimgray";
var IsNumericInputTColor    =   "mediumaquamarine";
var IsBooleanInputBColor    =   "skyblue";
var IsBooleanInputTColor    =   "plum";
var IsDateInputBColor       =   "mintcream";
var IsDateInputTColor       =   "honeydew";
var IsFieldInputBColor;
var IsFieldInputTColor;

var IsActionBColor;
var IsActionTColor;



var IsIfStatementBColor;     
var IsIfStatementTColor;     
var IsElseStatementBColor;   
var IsElseStatementTColor; 
var IsFunctionBColor;        
var IsFunctionTColor;        
var IsObjectLogicBColor;     
var IsObjectLogicTColor; 
var IsObjectLogicInputBColor=   "lightgreen";
var IsObjectLogicInputTColor=   "darkviolet";
var IsObjectBInverted;

var IsConditionBColor;      
var IsConditionTColor;      
var IsSignalNameBColor      =   "papayawhip";
var IsSignalNameTColor      =   "springgreen";
var IsPeriodNameBColor      =   "mistyrose";
var IsPeriodNameTColor      =   "powderblue";  
//Actionset
var IsSetBColor;             
var IsSetTColor;             
var IsSetqBColor;            
var IsSetqTColor; 

var IsObjectBSelected; 
var IsObjectTSelected; 
var IsObjectInverted;

// GSE COLORS

var RandomColors = ['darkseagreen', 'deeppink',  'lightseagreen','brown', 'olive', 'blueviolet', 'darkgreen', 'tomato', 'goldenrod', 'royalblue', 'lightcoral', 'violet', 'fuchsia', 'dodgerblue', 'lightgreen', 'lightblue', 'deeppink', 'mediumslateblue', 'greenyellow'];
var MarkerColors = ['rgb(199, 28, 34)', 'royalblue',  'fuchsia', 'tomato'];