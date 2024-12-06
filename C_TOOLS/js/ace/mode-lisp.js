define("ace/mode/lisp_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

function supportObjects() {
    var s = "";
    //console.log ('supportObjects function')
    if (typeof solution.GetPGFromTerminal === 'function') {
       // console.log ('supportObjects function goes in')
        let PG = solution.GetPGFromTerminal ();
        if (!PG) return s;
        for (var p in PG.Objects) {
            s += PG.Objects[p].Name + "|"
        }
    }
    return s;
}

var LispHighlightRules = function() {
    var keywordControl   = "case|do|let|loop|if|else|when|svalue|ands|andbs|andts|andps|spvalue|ors|orbs|orts|orps|spvalue|svalue";
    var keywordOperator  = "eq|neq|abs|min|max|getday|getweek|getmonth|gethours|getminutes|pips|pipvalue";
    var constantLanguage = "null|nil|start|buy|sell|exit_buy|exit_sell|close_buy|close_sell|hedge_buy|hedge_sell|exit|close|close_hedge_buy|close_hedge_sell|close_hedge|set|setq";
    var supportFunctions = "cons|car|cdr|cond|lambda|format|setf|quote|eval|append|list|listp|memberp|t|load|progn";
    var supportSignals   = "S_UP|S_DOWN|S_SIDEWAY|S_ABOVE|S_BELOW|S_TOUCHED|S_ALERT|S_CROSS_UP|S_CROSS_DOWN|S_REVERSE_UP|S_REVERSE_DOWN|S_MIDDLE|S_CHANGED|S_TARGET|S_DISTANCE|S_CURRENT|S_PREVIOUS|S_BULL|S_BEAR|S_RANGE|S_OVERBOUGHT|S_OVERSOLD|S_EXT_OVERBOUGHT|S_EXT_OVERSOLD|S_VERYWEAK|S_WEAK|S_NEUTRAL|S_STRONG|S_VERYSTRONG|S_ANGLE|S_PANGLE|S_NBRBARS|S_RCROSSED|S_BUY|S_SELL|S_EXIT_BUY|S_EXIT_SELL|S_DOJI|S_BULL_QUAD|S_BULL_HAMMER|S_BULL_HAMMER1|S_BULL_HAMMER2|S_BULL_ENGULFING|S_BULL_HARAMI|S_BULL_HARAMI|S_BULL_INVERTED_HAMMER|S_BULL_INVERTED_HAMMER1|S_BULL_INVERTED_HAMMER2|S_BULL_PIERCING_LINE|S_BULL_MORNING_STAR|S_BULL_MORNING_DOJI_STAR|S_BULL_THREE_WHITE_SOLDIERS|S_BULL_THREE_INSIDE_UP|S_BULL_THREE_OUTSIDE_UP|S_BEAR_QUAD|S_BEAR_HANGING_MAN|S_BEAR_HANGING_MAN1|S_BEAR_HANGING_MAN2|S_BEAR_ENGULFING|S_BEAR_HARAMI|S_BEAR_SHOOTING_STAR|S_BEAR_SHOOTING_STAR1|S_BEAR_SHOOTING_STAR2|S_BEAR_DARK_CLOUD_COVER|S_BEAR_EVENING_STAR|S_BEAR_EVENING_DOJI_STAR|S_BEAR_THREE_BLACK_CROWS|S_BEAR_THREE_INSIDE_DOWN|S_BEAR_THREE_OUTSIDE_DOWN|S_MAXINDAY|S_MININDAY|S_FIRSTINDAY|S_MAXINWEEK|S_MININWEEK|S_FIRSTINWEEK|S_MAXINMONTH|S_MININMONTH|S_FIRSTINMONTH|S_MAXINYEAR|S_MININYEAR|S_FIRSTINYEAR";
    var supportFields    = "T_OPERATION|T_START|T_STATUS|T_RULE|T_KEEPBUYSELL|T_SUSPEND|T_MINPROFIT|T_EXITMODE|T_PIPSTEP|T_TIMESTEP|T_ORDERTYPE|T_DIRECTION|T_DIRECTIONTYPE|T_RECOVERYMODE|T_RECOVERYVALUE|T_ILOT|T_BUYLOT|T_SELLLOT|T_MAXLOT|T_MAXLOSS|T_MAXTIME|T_MAXCOUNT|T_HEDGEMAGNITE|T_BUYLOTSL|T_BUYLOTTP|T_BUYLOTTS|T_SELLLOTSL|T_SELLLOTTP|T_SELLLOTTS|T_SL|T_TP|T_TS|T_BUYSL|T_BUYTP|T_BUYTS|T_SELLSL|T_SELLTP|T_SELLTS|T_HMAX|T_HMIN|T_MAX|T_MIN|T_EXITBUY|T_EXITSELL|T_CLOSEBUY|T_CLOSESELL|T_PROFITBUY|T_PROFITSELL|T_PROFIT|T_LASTLOT|T_LASTBUYLOT|T_LASTSET|T_STARTTRADE|T_NEUTRALPOINT|T_BUYAVERAGEPOINT|T_SELLAVERAGEPOINT|T_HEDGELLINE|T_HEDGENBRLOTS|T_BUYHEDGENBRLOTS|T_SELLHEDGENBRLOTS|T_HEDGETYPE|T_HEDGED|T_HASBEENHEDGED|T_HEDGEPROFIT|T_HEDGEBUYPROFIT|T_HEDGESELLPROFIT|T_BUYNBRTRADE|T_SELLNBRTRADE|T_BUYNBRLOTS|T_SELLNBRLOTS|T_LASTORDEROPENTIME|T_LASTORDERCLOSETIME|T_LASTORDEROPENPRICE|T_LASTORDERCLOSEPRICE|T_LASTORDERCLOSEPROFIT|T_LASTORDERCLOSETYPE|T_FIRSTORDEROPENTIME|T_FIRSTORDERCLOSETIME|T_FIRSTORDEROPENPRICE|T_FIRSTORDERCLOSEPRICE|T_LEVELPOINT|T_LASTORDERTYPE|T_ONEORDERPERBAR";
    var supportLogic     = "and|or|=|>=|>|<|<=|not";

    var keywordMapper = this.createKeywordMapper({
        "keyword.control":  keywordControl,
        "keyword.operator": keywordOperator,
        "constant.language":constantLanguage,
        "support.logic":    supportLogic,
        "support.function": supportFunctions,
        "support.objects":  supportObjects (),
        "support.signals":  SignalName.map (elt => {return 'S_' + elt}).join ('|'),
        "support.fields":   FieldName.map (elt => {return 'T_' + elt}).join ('|'),
    }, "identifier", true);
    this.$rules = 
        {
    "start": [
        {
            token : "comment",
            regex : ";.*$"
        },
        {
            token: ["storage.type.function-type.lisp", "text", "entity.name.function.lisp"],
            regex: "(?:\\b(?:(defun|defmethod|defmacro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)"
        },
        {
            token: ["punctuation.definition.constant.character.lisp", "constant.character.lisp"],
            regex: "(#)((?:\\w|[\\\\+-=<>'\"&#])+)"
        },
        {
            token: ["punctuation.definition.variable.lisp", "variable.other.global.lisp", "punctuation.definition.variable.lisp"],
            regex: "(\\*)(\\S*)(\\*)"
        },
        {
            token : "constant.numeric", // hex
            regex : "0[xX][0-9a-fA-F]+(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
        }, 
        {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
        },
        {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        },
        {
            token : "string",
            regex : '"(?=.)',
            next  : "qqstring"
        }
    ],
    "qqstring": [
        {
            token: "constant.character.escape.lisp",
            regex: "\\\\."
        },
        {
            token : "string",
            regex : '[^"\\\\]+'
        }, {
            token : "string",
            regex : "\\\\$",
            next  : "qqstring"
        }, {
            token : "string",
            regex : '"|$',
            next  : "start"
        }
    ]
};

};

oop.inherits(LispHighlightRules, TextHighlightRules);

exports.LispHighlightRules = LispHighlightRules;
});

define("ace/mode/lisp",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/lisp_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LispHighlightRules = require("./lisp_highlight_rules").LispHighlightRules;

var Mode = function() {
    this.HighlightRules = LispHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
       
    this.lineCommentStart = ";";
    
    this.$id = "ace/mode/lisp";
}).call(Mode.prototype);

exports.Mode = Mode;
});
                (function() {
                    window.require(["ace/mode/lisp"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            