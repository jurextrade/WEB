function ThemePanel (id) {
    let content= '';
    content += 
    '   <h6 class="sb_sidebarheader">Themes</h6>' + 
        sb.render ({id: id +'_dark',      item: 'Dark (dark)',        type: 'radio', attributes: {name: 'theme_' + id, checked: true}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_light',     item: 'Light (light)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_remix',     item: 'Remix (dark)',       type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_midcentury',item: 'Midcentury (light)', type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_candy',     item: 'Candy (light)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_hackerowl', item: 'HackerOwl (dark)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_cerulean',  item: 'Cerulean (light)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_flatly',    item: 'Flatly (light)',     type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_spacelab',  item: 'Spacelab (light)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_cyborg',    item: 'Cyborg (dark)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}});
    return content;
}

function ServerPanel (id) {

    switch (id) {
        case 'tradedesk' :
            return tradedesk_ServerPanel();   
        break;
        case 'emv' :
            return emv_ServerPanel();  
        break;
        case 'netprog' :
            return netprog_ServerPanel();  
        break;
    }
    return '';
}

function ThemePanel_Update () {
}

function onclick_theme (elt, event) {
    
    let themeid = elt.id.split('_')[1];
    let rootelt  = $(elt).closest ('.sb_root');    
    rootelt.attr('theme', themeid)
}

