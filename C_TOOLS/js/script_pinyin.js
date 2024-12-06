function hanzipinyin (text) {
    var entry = pinyin(text);

    var strpinyin = "";    
    for (var i = 0; i < entry.length; i++) {
        strpinyin += entry[i][0] + (i != entry.length -1 ? " " : ""); 
    }
    return strpinyin;
}
