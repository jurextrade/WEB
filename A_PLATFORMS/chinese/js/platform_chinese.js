//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function chinese_init () {
    let dt = chinese_hsk_update();
}

function chinese_end () {
}

//---------------------------------------------------------------------MODULE END   -----------------------------------------------------------------------------//

function chinese_select (name) {
    let ui  = solution.get('ui')              
    ui.platform_expand(name, true);

// market          
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    AnimationReset('animation')
}

function chinese_hsk_update () {

    let datatable = $('#chinese_hsk_table').removeAttr('width').DataTable({
        'serverMethod': 'post',
        'ajax': {
            'url':'/php/get_table.php?tablename=' + 'hsk', 
            'contentType': 'application/json; charset=utf-8',       
        },
        fixedColumns: true,   
        autoWidth: false,
        resizableColumns: true,    
        scrollY:        true,
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,       
        rowCallback: function(row, data, index) {
            $(row).addClass(data.Origin);
        },               
        columnDefs: [
            {title: 'LEVEL',     width: 10,     targets: 0 },
            {title: 'CH',        width: 50,     targets: 1 },
            {title: 'PIN',       width: 50,     targets: 2 },
            {title: 'ENG',       width: 100,    targets: 3 },            
            {title: 'ID',        width: 80,     targets: 4 },
            {title: 'PIN_S',     width: 140,                targets: 5 },
            {title: 'ENG_S',     width: 140,                targets: 6 },
            {title: 'CH_S',      width: 140,                 targets: 7 },
            {title: 'ATTR',      width: 5,                 targets: 8 },
        ],

        //['ID', 'HSK', 'GR', 'CH', 'PIN', 'ENG', 'PIN_S', 'ENG_S', 'CH_S'],        
        columns: [
            {name: 'LEVEL',                     data: 'hsk_type'},     
            {name: 'ID',                        data: 'hsk_id'},                 
            {name: 'CH',                        data: 'hsk_ch'},        
            {name: 'PIN',                       data: 'hsk_pin'},  
            {name: 'ENG',                       data: 'hsk_eng'},  
            {name: 'PIN_S',                     data: 'hsk_pin_s'},
            {name: 'ENG_S',                     data: 'hsk_eng_s'},
            {name: 'CH_S',                      data: 'hsk_ch_s'}, 
            {name: 'ATTR',                      data: 'hsk_gr'},   
            ]        
    })  
    $('#chinese_hsk_table_filter .sb_sidebarheadertitle').html('HSK')     
    return datatable; 
}

$(document).ready(function(){
    $('#chinese_hsk_table tbody').on('click', 'tr', function () {

        sb.table_selectnone (chinese_hsk_table);
        $(this).addClass ('active')
        let gsound          = solution.get('sound')
        let sound_lang = gsound.get_lang()

        if (sound_lang != 'zh') {
            let voice = gsound.set_lang ('zh');
            if (voice) {
                Update_VoicePanel('sound_voice', gsound.lang, voice.lang.substring(3))
            }
        }    
        
        let result          = $('#chinese_hsk_table').DataTable().row( this ).data().hsk_ch_s;
        let pinyinresponse  = '\r\n' + hanzipinyin (result);

        hanzistroke ('chinese_hanzi_writer', result);

    //    translation_editor.output_setvalue (result  + pinyinresponse)
        gsound.speak(result);
    });
})

var hsk3 = [
    {"id": 1,  "name": "Raddishes",   "icon": "raddish",    "price": { "USD": 3.26, "NOK": 17.43 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/Iuiye1z0YP4"},
    {"id": 2,  "name": "Artichokes",  "icon": "artichoke",  "price": { "USD": 9.44, "NOK": 15.82 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/C75psJlrC0I"},
    {"id": 3,  "name": "Broccoli",    "icon": "broccoli",   "price": { "USD": 5.20, "NOK": 16.66 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/u-ELIQr4Wn4"},
    {"id": 5,  "name": "Cabbages",    "icon": "cabbage",    "price": { "USD": 0.95, "NOK": 62.33 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/Uoem1IlpwUE"},
    {"id": 6,  "name": "Cherries",    "icon": "cherry",     "price": { "USD": 1.04, "NOK": 62.50 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/URqw1bQj3ag"},
    {"id": 7,  "name": "Carrots",     "icon": "carrot",     "price": { "USD": 4.82, "NOK": 72.74 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/LLvAVyhmKv0"},
    {"id": 8,  "name": "Corn",        "icon": "corn",       "price": { "USD": 7.53, "NOK": 99.43 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/UOY3FCMrPmo"},
    {"id": 9,  "name": "Grapes",      "icon": "grapes",     "price": { "USD": 4.94, "NOK": 88.29 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/4ZtTnnL9HGI"},
    {"id": 10, "name": "Onions",      "icon": "onion",      "price": { "USD": 6.45, "NOK": 69.53 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/xX5aRgKTfJk"},
    {"id": 11, "name": "Oranges",     "icon": "orange",     "price": { "USD": 9.95, "NOK": 96.53 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/qG--diaeAiU"},
    {"id": 12, "name": "Peas",        "icon": "peas",       "price": { "USD": 2.61, "NOK": 65.74 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/DOJNdSH8lsg"},
    {"id": 13, "name": "Pineapples",  "icon": "pineapple",  "price": { "USD": 1.62, "NOK": 35.22 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/ZwCVjIkWN_g"},
    {"id": 14, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      , "href": "https://www.youtube.com/embed/lHiMzLtQoso"},
    {"id": 15, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/yVINm5X8TcY"},
    {"id": 16, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      , "href": "https://www.youtube.com/embed/kihUvahrWwg"},
    {"id": 17, "name": "Raddishes",   "icon": "raddish",    "price": { "USD": 3.26, "NOK": 17.43 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/fy6idvFGeUs"},
    {"id": 18, "name": "Artichokes",  "icon": "artichoke",  "price": { "USD": 9.44, "NOK": 15.82 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/aRmpwz3jdZY"},
    {"id": 19, "name": "Broccoli",    "icon": "broccoli",   "price": { "USD": 5.20, "NOK": 16.66 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/UuQ5ku3xsk4"},
    {"id": 21, "name": "Cabbages",    "icon": "cabbage",    "price": { "USD": 0.95, "NOK": 62.33 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/P4bYWgjeFf0"},
    {"id": 22, "name": "Cherries",    "icon": "cherry",     "price": { "USD": 1.04, "NOK": 62.50 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/ZmA4QAz0ciE"},
    {"id": 23, "name": "Carrots",     "icon": "carrot",     "price": { "USD": 4.82, "NOK": 72.74 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/qmHV3rLJaVc"},
    {"id": 24, "name": "Corn",        "icon": "corn",       "price": { "USD": 7.53, "NOK": 99.43 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/1OnB9NPpRc4"},
    {"id": 25, "name": "Grapes",      "icon": "grapes",     "price": { "USD": 4.94, "NOK": 88.29 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/SwDqy0wM25c"},
    {"id": 26, "name": "Onions",      "icon": "onion",      "price": { "USD": 6.45, "NOK": 69.53 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/GhEDas5H2lY"},
    {"id": 27, "name": "Oranges",     "icon": "orange",     "price": { "USD": 9.95, "NOK": 96.53 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/G8dl1DYeGNY"},
    {"id": 28, "name": "Peas",        "icon": "peas",       "price": { "USD": 2.61, "NOK": 65.74 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/t4RFNVZY3xM"},
    {"id": 29, "name": "Pineapples",  "icon": "pineapple",  "price": { "USD": 1.62, "NOK": 35.22 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/Ii1kNm6h4KY"},
    {"id": 30, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      , "href": "https://www.youtube.com/embed/o94WR2TFPCY"},
    {"id": 31, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/Bj-wc9K9JpA"},
    {"id": 32, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      , "href": "https://www.youtube.com/embed/9WPI7UPSUu0"},
    {"id": 33, "name": "Grapes",      "icon": "grapes",     "price": { "USD": 4.94, "NOK": 88.29 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/0QZcdfVcPgg"},
    {"id": 34, "name": "Onions",      "icon": "onion",      "price": { "USD": 6.45, "NOK": 69.53 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/eKiEPaoRI9s"},
    {"id": 35, "name": "Oranges",     "icon": "orange",     "price": { "USD": 9.95, "NOK": 96.53 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/YC8pH_FnKMM"},
    {"id": 36, "name": "Peas",        "icon": "peas",       "price": { "USD": 2.61, "NOK": 65.74 }, "type": "vegetable" , "href": "https://www.youtube.com/embed/qOwvXQkQa24"},
    {"id": 37, "name": "Pineapples",  "icon": "pineapple",  "price": { "USD": 1.62, "NOK": 35.22 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/j2F4PcC_HOk"},
    {"id": 38, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      , "href": "https://www.youtube.com/embed/g8_E28W6YS4"},
    {"id": 39, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/esMmepg4RoA"},
    {"id": 40, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      , "href": "https://www.youtube.com/embed/NfNfdiCYZYg"},
    {"id": 41, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      , "href": "https://www.youtube.com/embed/3ob_L4pDTeA"},
    {"id": 42, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     , "href": "https://www.youtube.com/embed/DeAj7IxxYug"},
    {"id": 43, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      , "href": "https://www.youtube.com/embed/jNhaHjd3r5c"},
]