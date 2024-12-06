/*------------------------ STROKE HANZI -----------------------------------------------------------*/

function onclick_hanzi (elt, event) {
    sb.overlay({
        id : 'overlay_stroke',
        rootelt: $('body'),
        pageX: event.pageX,
        pageY: event.pageY + 20,
        event: event,                
        keepopen: false,
        classes: '',
        style:'width:300px;height:300px',
        onshow : function () {
            hanzistroke('zoom_stroke', elt);
        
        },        
        html: '<div id="zoom_stroke" style="width: 100%;height: 100%;background: var(--theme-main-bg-color);"></div>'
    });     

}

function hanzistroke (id, text, options) {
    let hanzistroke_default_options = {
        padding: 0,
        outlineColor: '#6B8EBD',
        strokeAnimationSpeed: 1, // 5x normal speed
        delayBetweenStrokes: 100, // milliseconds
        strokeColor: theme_main_color.toString(),
        radicalColor: '#e33192'
    } 

    options    = defined(options) ? {...hanzistroke_default_options, ...options} : hanzistroke_default_options;

    var content = '';
    
    $('#' + id).html ('');
    
    for (var i = 0; i < text.length; i++) {
        content += '<div class="hanzi_stroke" id="' + id + '-character-target-div' + i + '" style="width: 100%;height: 100%;" onclick="onclick_hanzi (\'' + text[i] + '\', event)"></div>';
    }
    $('#' + id).html (content);

    for (var i = 0; i < text.length; i++) {
        var writer = HanziWriter.create( id + '-character-target-div' + i , text[i], options).loopCharacterAnimation();
    }
}