var calculatorpanel = {
    id: 'calculatorpanel',
    type: 'html',
    class: 'sb_main sb_column sb_formcontainer',
    content: 'OptionCalculatorPanel("optioncalculator")',
}

var boxoptioncalculatorpanel = {
    id: 'boxoptioncalculatorpanel',
    type: 'box',
    closed: false, 
    header: {item: 'Option Calculator',  control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [calculatorpanel]        
}