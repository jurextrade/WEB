define("ace/theme/sc_on_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-sc_on_dark";
exports.cssText = ".ace-sc_on_dark .ace_gutter {\
background: #25282c;\
color: #C5C8C6\
}\
.ace-sc_on_dark .ace_print-margin {\
width: 1px;\
background: #25282c\
}\
.ace-sc_on_dark {\
background-color: #1D1F21;\
color: #C5C8C6\
}\
.ace-sc_on_dark .ace_cursor {\
color: #AEAFAD\
}\
.ace-sc_on_dark .ace_marker-layer .ace_selection {\
background: #373B41\
}\
.ace-sc_on_dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #1D1F21;\
}\
.ace-sc_on_dark .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-sc_on_dark .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid var(--theme-color)\
}\
.ace-sc_on_dark .ace_marker-layer .ace_active-line {\
    background: var(--theme-hover-bg-color)\
}\
.ace-sc_on_dark .ace_gutter {\
    background-color: var(--theme-bar-bg-color); \
    color: var(--theme-color);    \
    border-right: 1px solid var(--theme-border-color);    \
}\
.ace-sc_on_dark .ace_gutter-active-line {\
    background-color: var(--theme-hover-bg-color)\
}\
.ace-sc_on_dark .ace_marker-layer .ace_selected-word {\
    border: 1px solid #373B41\
}\
.ace-sc_on_dark .ace_invisible {\
    color: #4B4E55\
}\
.ace-sc_on_dark .ace_keyword,\
.ace-sc_on_dark .ace_meta,\
.ace-sc_on_dark .ace_storage,\
.ace-sc_on_dark .ace_storage.ace_type,\
.ace-sc_on_dark .ace_support.ace_type {\
    color: CadetBlue\
}\
.ace-sc_on_dark .ace_constant.ace_character,\
.ace-sc_on_dark .ace_constant.ace_language,\
.ace-sc_on_dark .ace_constant.ace_numeric,\
.ace-sc_on_dark .ace_keyword.ace_other.ace_unit,\
.ace-sc_on_dark .ace_support.ace_constant,\
.ace-sc_on_dark .ace_variable.ace_parameter {\
color: #DE935F\
}\
.ace-sc_on_dark .ace_constant.ace_language,\
.ace-sc_on_dark .ace_variable.ace_constant {\
    color: lime\
}\
.ace-sc_on_dark .ace_support.ace_logic {\
    color: var(--theme-IsBasic1LogicTColor);\
    background-color: var(--theme-IsBasic1LogicBColor)\
}\
.ace-sc_on_dark .ace_support.ace_objects {\
    color: var(--theme-indicator-color)\
}\
.ace-sc_on_dark .ace_support.ace_signals {\
    color: var(--theme-signal-color)\
}\
.ace-sc_on_dark .ace_support.ace_fields {\
    color: var(--theme-IsFieldInputBColor)\
}\
.ace-sc_on_dark .ace_constant.ace_other {\
    color: #CED1CF\
}\
.ace-sc_on_dark .ace_invalid {\
    color: #CED2CF;\
    background-color: #DF5F5F\
}\
.ace-sc_on_dark .ace_invalid.ace_deprecated {\
    color: #CED2CF;\
    background-color: #B798BF\
}\
.ace-sc_on_dark .ace_fold {\
    background-color: #81A2BE;\
    border-color: #C5C8C6\
}\
.ace-sc_on_dark .ace_entity.ace_name.ace_function,\
.ace-sc_on_dark .ace_support.ace_function,\
.ace-sc_on_dark .ace_variable {\
color: #81A2BE\
}\
.ace-sc_on_dark .ace_support.ace_class,\
.ace-sc_on_dark .ace_support.ace_type {\
color: #F0C674\
}\
.ace-sc_on_dark .ace_heading,\
.ace-sc_on_dark .ace_markup.ace_heading,\
.ace-sc_on_dark .ace_string {\
color: #B5BD68\
}\
.ace-sc_on_dark .ace_entity.ace_name.ace_tag,\
.ace-sc_on_dark .ace_entity.ace_other.ace_attribute-name,\
.ace-sc_on_dark .ace_meta.ace_tag,\
.ace-sc_on_dark .ace_string.ace_regexp,\
.ace-sc_on_dark .ace_variable {\
color: #CC6666\
}\
.ace-sc_on_dark .ace_comment {\
color: #969896\
}\
.ace-sc_on_dark .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    window.require(["ace/theme/sc_on_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            

           
                                  