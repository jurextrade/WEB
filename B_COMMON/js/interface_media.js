var mediabar = {
    id: 'mediabar',    
    type: 'bar',
    toggle: true,                
    items:
        [ 
            {id: 'button_video',   type: 'button', toggle: true, icon: icon_video,    title: 'activate video' ,  events: {onclick: "onclick_mediabar (this, event)"}},
            {id: 'button_audio',   type: 'button', toggle: true, icon: icon_micro,    title: 'activate audio' ,  events: {onclick: "onclick_mediabar (this, event)"}},
        ]
}    


var media_header_panel = {
    id: 'media_header_panel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'COMMUNITY',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
        //<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>
    ]
}


var mediavideopanel = {
    id: 'mediavideopanel',
    type: 'html',
    container: 'video', 
    attributes: {
        controls: 'false',
        autoplay: '',
        playsinline: '', 
    }
}

function videohtml () {
    return '<video id="mediavideopanel" autoplay playsinline controls="false"/>';
}

var tradedesk_media_sidepanel = {
    id: 'tradedesk_media_sidepanel',
    type: 'panel',
    class: 'tradedesk_media_sidepanel sb_panel sb_column',
    items:[
        media_header_panel,
        mediabar,
        mediavideopanel,
    ]
}