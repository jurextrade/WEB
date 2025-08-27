const monthnames    = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daynames      = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const clocktags     = ['dayname','monthname', 'day', 'month', 'date', 'fullyear', 'hours', 'minutes', 'seconds', 'utc_hours', 'utc_minutes', 'utc_seconds', 'pe', 'gmt'];


const clock_default_tags =  [    
    {tag: 'gmttime',   format: '%utc_hours:%utc_minutes:%utc_seconds %gmt'},
    {tag: 'localtime', format: '%hours:%minutes:%seconds %pe'},
    {tag: 'localdate', format: '%month-%date-%fullyear'},
    {tag: 'dayname',   format: '%dayname'}            
]        

Number.prototype.pad = function(digits){
    for(var n = this.toString(); n.length < digits; n = 0 + n);
    return n;
}

class clock {
    constructor (tags) {
        this.tags           = [];
        this.day            = '';
        this.month          = '';
        this.date           = '';
        this.fullyear       = '';
        this.hours          = '';
        this.minutes        = '';
        this.seconds        = '';
        this.utc_hours      = '';
        this.utc_minutes    = '';
        this.utc_seconds    = '';
        this.pe             = '';
        this.gmt            = '';
        this.dayname        = '';
        this.monthname      = '';  
           
        this.add_tag = function (tag) {
            let tagtype = typeof tag;
            if (tagtype != 'object') {
                return
            } 
            let objecttype = js_objecttype(tag);
            if (objecttype == 'Array') {
                for (var i = 0; i < tag.length; i++) {
                    this.tags.push(tag[i])
                }
            }
            else {
                this.tags.push(tag)
            }
        }  
        this.init = function () {
            this.tags = [];
        }

        this.get_content = function (format) {
            let content = format;
            clocktags.forEach((tag) => content = content.replace ('%' + tag, this[tag]))
            return content;            
        }

        this.update = function () {
            
            if (this.tags.length == 0) {
                return;
            }          

            var now             = new Date();    

            this.day            = now.getDay();
            this.month          = now.getMonth() + 1 ;
            this.date           = now.getDate().pad(2);
            this.fullyear       = now.getFullYear();
            this.hours          = now.getHours();
            this.minutes        = now.getMinutes().pad(2);
            this.seconds        = now.getSeconds().pad(2);
            this.utc_hours      = now.getUTCHours().pad(2);
            this.utc_minutes    = now.getUTCMinutes().pad(2);
            this.utc_seconds    = now.getUTCSeconds().pad(2);
            this.pe             = "AM";
            this.gmt            = "GMT";
            this.dayname        = daynames[this.day]
            this.monthname      = monthnames[this.month + 1]
          
            
            if(this.hours >= 12){
                this.pe = "PM";
            } else
            if(this.hours == 0){
                this.hours = 12;
            }
        
            if(this.hours > 12){
                this.hours = this.hours - 12;
            }
        
            this.hours = this.hours.pad(2);
            this.month = this.month.pad(2);
        
            for (var i= this.tags.length - 1; i >= 0; i--) {
                var content = this.get_content(this.tags[i].format);
                let $tags = $('[tag="' + this.tags[i].tag + '"]');
                if ($tags.length == 0) {
                    this.tags.splice(i, 1);     
                }
                $tags.html(content);
            }    
        }
        setInterval(function(clock) {clock.update()}, 1000, this);     
    }    
}       