function daysIntoYear(date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

Number.prototype.pad = function(digits){
    for(var n = this.toString(); n.length < digits; n = 0 + n);
    return n;
}


function OSDateHour() {
    var now           = new Date();    
    
    return {time: parseInt(now.getUTCHours().pad(2) + now.getUTCMinutes().pad(2) + now.getUTCSeconds().pad(2)), 
            date: parseInt((now.getUTCFullYear() - 1990).pad(2) + daysIntoYear(now).pad(3))};
}
