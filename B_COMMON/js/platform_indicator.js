var Accessor_NEWS = function(d, props, object, dataset) {

    var bartime = d.date.getTime();

    for (i = 0; i < solution.calendarnews.newsarray.length; i++) {
        var newsline = solution.calendarnews.newsarray[i];
        var reservtime = newsline.gettime + solution.DifferenceHoursTime;

        if (reservtime >= bartime) {

            if (newsline.Importance == 'High') {
                return newsline.Day + ' ' + newsline.Date + '   ' + newsline.GMT + '   ' + newsline.Currency + '   ' + newsline.Event;
            }
        }
    }
    return "";
}

var Accessor_BAR = function(d, props, object, dataset) {


    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas)
        return;

    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;
    if (!symbol)
        return;

    let currentbartime = d.date.getTime() / 1000;        
    
    expertcontext.ResetSignals([object.Id], null, [period], currentbartime, 1);
    expertcontext.FindBar(period, object, symbol.chartData[period], d.idx.index);

    var tracevalue = "";
    for (var index = 0; index < solution.ObjectSignals.length; index++) {
        if (solution.ObjectSignals[index].objectname == object.Name) {
            var signals = solution.ObjectSignals[index].signals;

            for (var j = 0; j < signals.length; j++) {
                var signaltype = SignalName.indexOf(signals[j].text);
                if (signals[j].type != SNumeric && signals[j].text != "BULL" && signals[j].text != "BEAR" && signals[j].text != "UP" && signals[j].text != "DOWN")
                    if (expertcontext.AndS(BAR, signaltype, period)) {
                        tracevalue += signals[j].text + "\n";
                    }
            }
        }
    }
    return tracevalue;
}

function Accessor_RS(d, name) {
    if (!d[name])
        return
    var Price1 = d[name][0][0];
    var Time1 = d[name][0][1];
    if (Price1 == undefined)
        return undefined;
    var Price2 = d[name][1][0];
    var Time2 = d[name][1][1];
    return LevelCalculate(Price1, Time1, Price2, Time2, d.idx.index);
}

const Fractal_group = ["RESISTANCE", "SUPPORT", "UPFRACTAL","DOWNFRACTAL"];
const Bar_group     = ["OPEN","CLOSE", "HIGH", "LOW"];
const Pivot_group   = ["PIVOT_RESISTANCE2", "PIVOT_RESISTANCE1", "PIVOT_RESISTANCE", "PIVOT_HIGH", "PIVOT_POINT", "PIVOT_LOW", "PIVOT_SUPPORT", "PIVOT_SUPPORT1", "PIVOT_SUPPORT2"];


function Indicator_isgroup (indicatorname) {
    if (Fractal_group.includes (indicatorname)) {
        return Fractal_group;
    } else 
    if (Bar_group.includes (indicatorname)) {
        return Bar_group;
    } else 
    if (Pivot_group.includes (indicatorname)) {
        return Pivot_group;
    } else {
        return null;
    }     
}

function Indicator_calculated (indicatorname) {
    if (indicatorname in Pivot_group) {
        return true;
    }
}

function IndicatorLayout(object) {
    this.react = null;
    this.calculator = null;

    this.object = object;

    let type = ObjectTypeName.indexOf(object.Type);

    switch (type) {
    case PREDEFINED_TYPE:
        switch (object.Name) {
        case "BAR":
            this.react = function(properties) {
                let symbol          = properties.symbol;  
                let period          = properties.period;  
                let object          = properties.object;  
                let yorigin         = properties.height;  
                let showaxes        = properties.showaxes;
                let symbolcanvas    = properties.canvas;  
                let xGrid           = properties.xgrid;   
                let yGrid           = properties.ygrid;   

                let xorigin = 4;
                var elt = React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d, props) {
                        return Accessor_BAR(d, props, object, symbol.plotData);
                    },
                    yDisplayFormat: function yDisplayFormat(d) {
                        return d;
                    },
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                });

                return elt;
            }
            ;

            break;
        case "RESISTANCE":              //everything is done in one ["RESISTANCE", "SUPPORT", "UPFRACTAL","DOWNFRACTAL"]
        case "SUPPORT":
            this.calculator = FRACTAL_calculate;

            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   

                var parameters = [];
                let xorigin = 4;
                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d) {
                        return Accessor_RS(d, object.Name);
                    },
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));
                return parameters;
            }
            break;
            case "UPFRACTAL":                                
            case "DOWNFRACTAL":
                this.calculator = FRACTAL_calculate;
    
                this.react = function(properties) {
                    let symbol   = properties.symbol;  
                    let period   = properties.period;  
                    let object   = properties.object;  
                    let yorigin  = properties.height;  
                    let showaxes = properties.showaxes;
                    let symbolcanvas   = properties.canvas;  
                    let xGrid    = properties.xgrid;   
                    let yGrid    = properties.ygrid;   
                    var parameters = [];
                    let xorigin = 4;
    
                    parameters.push(React.createElement(LineSeries, {
                        yAccessor: function yAccessor(d) {
                            return (d[object.Name]);
                        },
                        stroke: object.Name == "UPFRACTAL" ? "blue" : "red",
                        strokeDasharray: "ShortDash"
                    }));
    
                    parameters.push(React.createElement(ScatterSeries, {
                        yAccessor: function yAccessor(d) {
                            return (d[object.Name]);
                        },
                        marker: SquareMarker,
                        markerProps: {
                            width: 4,
                            stroke: object.Name == "UPFRACTAL" ? "blue" : "red",
                            fill: object.Name == "UPFRACTAL" ? "blue" : "red"
                        }
                    }));
    
                    parameters.push(React.createElement(SingleValueTooltip, {
                        origin: [xorigin, yorigin],
                        yAccessor: function yAccessor(d) {
                            return (d[object.Name]);
                        },
                        yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                        valueStroke: axiscolor,
                        yLabel: object.Name,
                        object: object,
                        onClick: function onClick(e) {
                            return openPopupObject(object.Name);
                        },
                        onClose: function onClose(e) {
                            indicatorclose(e, object.Name);
                        }
                    }));
                    return parameters;
                }
                break;
        case "NEWS":
            //this.calculator = NEWS_calculate;	        	        
            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let parameters = [];
                let xorigin = 4;
                //  parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: Symbol.periodSeperatorData[Period][i].start.value ,   strokeDasharray:"ShortDash",  stroke :"tomato"}));                          
                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d, props) {
                        return Accessor_NEWS(d, props, object, symbol.plotData);
                    },
                    yDisplayFormat: function yDisplayFormat(d) {
                        return d;
                    },
                    valueStroke: "tomato",
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return onclick_newsLink();
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));

                return parameters;
            }
            break;
        case "OPEN":                                    //everything is done in one ["OPEN","CLOSE", "HIGH", "LOW"]
        case "CLOSE":
        case "HIGH":
        case "LOW":                     
            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let chart_field = object.Name.toLowerCase();
                let xorigin = 4;

                var elt = React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d) {
                        return d[chart_field];
                    },
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                });
                return elt;
            }
            break;
        case "PIVOT_SUPPORT":
        case "PIVOT_RESISTANCE2":                         //everything is done in one ["PIVOT_RESISTANCE2","PIVOT_RESISTANCE1","PIVOT_RESISTANCE", "PIVOT_HIGH", "PIVOT_POINT", "PIVOT_LOW", "PIVOT_SUPPORT", "PIVOT_SUPPORT1", "PIVOT_SUPPORT2"]
        case "PIVOT_RESISTANCE1":
        case "PIVOT_RESISTANCE":
        case "PIVOT_HIGH":
        case "PIVOT_POINT":
        case "PIVOT_LOW":
        case "PIVOT_SUPPORT":
        case "PIVOT_SUPPORT1":
        case "PIVOT_SUPPORT2":

            this.calculator = PIVOT_calculate;

            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   

                let parameters = [];
                let xorigin = 4;
                let pivot_colors = ["turquoise", "turquoise", "turquoise", "green", "yellow", "pink", "pink", "pink"];
                let chart_field = object.Name;

                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return d[chart_field];
                    },
                    stroke: pivot_colors[object.Id - 4],
                }));

                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d) {
                        return d[chart_field];
                    },
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));
                return parameters;
            }
            break;
        case "HEIKEN_ASHI":
            this.calculator = HEIKEN_calculate;
            //eval ('_ReStock.indicator.heikinAshi()');  

            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                var parameters = [];
                let xorigin = 4;
                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d) {},
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));
                return parameters;
            }
            ;
            break;
        case "VOLUME":
           
            this.calculator = eval('_ReStock.indicator.sma().id(' + object.Id + ').windowSize(10).sourcePath("volume").merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(function (d) {return d.' + object.Name + ';})');

            this.react = function(properties) {
                let ui  = solution.get('ui')                     
                let symbol          = properties.symbol;  
                let period          = properties.period;  
                let object          = properties.object;  
                let yorigin         = properties.height;  
                let showaxes        = properties.showaxes;
                let symbolcanvas    = properties.canvas;  
                let xGrid           = properties.xgrid;   
                let yGrid           = properties.ygrid;   
                let showleftaxis    = properties.showleftaxis;  

                let smavolume = this.calculator;
                var parameters = [];
                let xorigin = 4;
                for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                    parameters.push(React.createElement(StraightLine, {
                        type: "vertical",
                        xValue: symbolcanvas.Marks[i],
                        stroke: "blue",
                        strokeDasharray: "ShortDash"
                    }));
                }

                parameters.unshift(MyChart,
                {
                    id: object.Id,
                    height: Indicator_Height,
                    yExtents: [function(d) {
                        return d.volume;
                    }
                    , smavolume.accessor()],
                    origin: function origin(w, h) {
                        return [0, h - yorigin];
                    }
                }, React.createElement(YAxis, {
                    axisAt: "right",
                    orient: "right",
                    ticks: 5,
                    tickFormat: d3.format(".0s"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), React.createElement(MouseCoordinateY, {
                    at: "right",
                    orient: "right",
                    displayFormat: d3.format(".4s"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }), )
                if (showleftaxis) {
                    parameters.push(React.createElement(YAxis, {
                        axisAt: "left",
                        orient: "left",
                        showTicks: true,
                        outerTickSize: 0,
                        tickFormat: d3.format(".0s"),
                        ...yGrid,
                        fontSize: 10,
                        fontFamily: "sans-serif",
                        stroke: axiscolor,
                        tickStroke: axiscolor
                    }), React.createElement(MouseCoordinateY, {
                        at: "left",
                        orient: "left",
                        displayFormat: d3.format(".4s"),
                        fontSize: 10,
                        fontFamily: "sans-serif"
                    }))

                } else {
                    parameters.push(React.createElement(YAxis, {
                        axisAt: "left",
                        orient: "left",
                        showTicks: false,
                        outerTickSize: 0,
                        tickFormat: d3.format(".0s"),
                        ...yGrid,
                        fontSize: 10,
                        fontFamily: "sans-serif",
                        stroke: axiscolor,
                        tickStroke: axiscolor
                    }))
                }

                parameters.push(React.createElement(BarSeries, {
                    yAccessor: function yAccessor(d) {
                        return d.volume;
                    },
                    fill: function fill(d) {
                        return d.close > d.open ? "#6BA583" : "#FF0000";
                    }
                }), React.createElement(AreaSeries, {
                    yAccessor: smavolume.accessor(),
                    stroke: smavolume.stroke(),
                    fill: smavolume.fill()
                }), React.createElement(SingleValueTooltip, {
                    origin: [0, 10],
                    yAccessor: function yAccessor(d) {
                        return d.volume;
                    },
                    yLabel: "VOLUME",
                    yDisplayFormat: d3.format(".0f"),
                    valueStroke: axiscolor,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }),
                React.createElement(XAxis, {
                    axisAt: "bottom",
                    orient: "bottom",
                    showDomain: true,
                    showTicks: showaxes,
                    outerTickSize: 0,
                    ...xGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), showaxes ? React.createElement(MouseCoordinateX, {
                    at: "bottom",
                    orient: "bottom",
                    displayFormat: returnperiodformat(period),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }) : '');
                return React.createElement.apply(null, parameters);
            }
            ;
            break;
        case "PROGRESS":
            this.calculator = PROGRESS_calculate;

            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let parameters = [];
                let xorigin = 4;                
                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d, props) {
                        return ProgressAccessor(d, props, object, symbol.plotData);
                    },
                    yDisplayFormat: function yDisplayFormat(d) {
                        return d;
                    },
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));

                return parameters;
            }
            ;
            break;
        case "FIBOLEVEL":
            this.calculator = FIBO_calculate;
            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let parameters = [];
                let xorigin = 4;
                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return (d.fibo_sell == -1 ? d.fibo_buy : d.fibo_sell);
                    },
                    stroke: "lime",
                    strokeDasharray: "ShortDash"
                }));

                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return d.fibo_takeprofit1;
                    },
                    stroke: "turquoise"
                }));
                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return d.fibo_takeprofit2;
                    },
                    stroke: "turquoise"
                }));
                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return d.fibo_takeprofit3;
                    },
                    stroke: "turquoise"
                }));

                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d, props) {
                        return (d.fibo_sell == -1 ? d.fibo_buy : d.fibo_sell);
                    },
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));
                return parameters;
            }
            ;

            break;
        case "FIBOSTOPLOSSLEVEL":
            this.calculator = FIBO_calculate;

            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let parameters = [];
                let xorigin = 4;

                parameters.push(React.createElement(LineSeries, {
                    yAccessor: function yAccessor(d) {
                        return d.fibo_stoploss;
                    },
                    stroke: "pink",
                    strokeDasharray: "ShortDash"
                }));
                parameters.push(React.createElement(SingleValueTooltip, {
                    origin: [xorigin, yorigin],
                    yAccessor: function yAccessor(d) {
                        return d.fibo_stoploss;
                    },
                    yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                    valueStroke: axiscolor,
                    yLabel: object.Name,
                    object: object,
                    onClick: function onClick(e) {
                        return openPopupObject(object.Name);
                    },
                    onClose: function onClose(e) {
                        indicatorclose(e, object.Name);
                    }
                }));
                return parameters;
            }
            ;
            break;
        case "SYSTEM":
            let ui  = solution.get('ui')                
            this.react = function(properties) {
                let symbol   = properties.symbol;  
                let period   = properties.period;  
                let object   = properties.object;  
                let yorigin  = properties.height;  
                let showaxes = properties.showaxes;
                let symbolcanvas   = properties.canvas;  
                let xGrid    = properties.xgrid;   
                let yGrid    = properties.ygrid;   
                let showleftaxis    = properties.showleftaxis;                  
                let parameters = [];
                let xorigin = 4;

                for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                    parameters.push(React.createElement(StraightLine, {
                        type: "vertical",
                        xValue: symbolcanvas.Marks[i],
                        stroke: "blue",
                        strokeDasharray: "ShortDash"
                    }));
                }
                parameters.unshift(MyChart, {
                    id: object.Id,
                    height: Indicator_Height,
                    yExtents: [function(d) {
                        return eval('Math.abs (d.' + object.Name + ');')
                    }
                    ],
                    origin: function origin(w, h) {
                        return [0, h - yorigin];
                    }
                }, React.createElement(YAxis, {
                    axisAt: "right",
                    orient: "right",
                    ticks: 5,
                    tickFormat: d3.format("." + symbol.Digits + "f"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), React.createElement(MouseCoordinateY, {
                    at: "right",
                    orient: "right",
                    displayFormat: d3.format(",." + symbol.Digits + "f"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }), )

                if (showleftaxis) {
                    parameters.push(React.createElement(YAxis, {
                        axisAt: "left",
                        orient: "left",
                        ticks: 5,
                        showTicks: true,
                        tickFormat: d3.format(",." + symbol.Digits + "f"),
                        outerTickSize: 20,
                        ...yGrid,
                        fontSize: 10,
                        fontFamily: "sans-serif",
                        stroke: axiscolor,
                        tickStroke: axiscolor
                    }), React.createElement(MouseCoordinateY, {
                        at: "left",
                        orient: "left",
                        displayFormat: d3.format(",." + symbol.Digits + "f"),
                        fontSize: 10,
                        fontFamily: "sans-serif"
                    }));
                } else {
                    parameters.push(React.createElement(YAxis, {
                        axisAt: "left",
                        orient: "left",
                        showTicks: false,
                        tickFormat: d3.format(",." + symbol.Digits + "f"),
                        outerTickSize: 20,
                        ...yGrid,
                        fontSize: 10,
                        fontFamily: "sans-serif",
                        stroke: axiscolor,
                        tickStroke: axiscolor
                    }));
                }

                parameters.push(React.createElement(BarSeries, {
                    yAccessor: function yAccessor(d) {
                        return eval('Math.abs (d.' + markername + ')')
                    },
                    opacity: 1,
                    fill: function fill(d) {
                        return eval('d.' + markername + '  >= 0 ? theme_chart_bullbody : theme_chart_bearbody');
                    }
                }),
                React.createElement(SingleValueTooltip, {
                    origin: [xorigin, 10],
                    yAccessor: function yAccessor(d) {
                        return eval('d.' + markername)
                    },
                    yLabel: markername,
                    yDisplayFormat: d3.format(".4f"),
                    valueStroke: axiscolor,
                    onClick: function onClick(e) {},
                    onClose: function onClose(e) {
                        markerclose(e, markername)
                    }
                }), React.createElement(XAxis, {
                    axisAt: "bottom",
                    orient: "bottom",
                    showDomain: true,
                    showTicks: showaxes,
                    outerTickSize: 0,
                    ...xGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), showaxes ? React.createElement(MouseCoordinateX, {
                    at: "bottom",
                    orient: "bottom",
                    displayFormat: returnperiodformat(period),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }) : '');
                return React.createElement.apply(null, parameters);
            }
            ;
            break;
        }

        break;
    case MA_TYPE:
        if (MaMethod[object.Method].text == 'Simple')
            this.calculator = eval('_ReStock.indicator.sma().id(' + object.Id + ').windowSize(' + object.Period + ').merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(function (d) {return d.' + object.Name + ';})');
        else if (MaMethod[object.Method].text == 'Exponential')
            this.calculator = eval('_ReStock.indicator.ema().id(' + object.Id + ').windowSize(' + object.Period + ').merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(function (d) {return d.' + object.Name + ';})');

        this.react = function(properties) {
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let xorigin = 4;
            let ema = this.calculator;
            let parameters = [];
            parameters.push(React.createElement(MovingAverageTooltip, {
                origin: [xorigin, yorigin],
                yAccessor: ema.accessor(),
                displayFormat: d3.format(",." + symbol.Digits + "f"),
                calculators: [ema],
                yLabel: object.Name + "(" + object.Period + ")",
                valueStroke: axiscolor,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }));

            //     parameters.push (React.createElement(SingleValueTooltip, {origin: [xorigin, yorigin], yAccessor: ema.accessor(), yDisplayFormat: d3.format(",." + symbol.Digits +"f"),	yLabel: object.Name + "(" + object.Period + ")", valueStroke:axiscolor,  onClick: function onClick(e) {return openPopupObject(object.Name);}, onClose : function onClose (e) {indicatorclose (e, object.Name);}}));              	

            parameters.push(React.createElement(LineSeries, {
                yAccessor: ema.accessor(),
                stroke: ema.stroke()
            }));
            return parameters;
        }
        ;
        break;
    case SAR_TYPE:
        this.calculator = eval('_ReStock.indicator.sar().accelerationFactor(' + object.Step + ').maxAccelerationFactor(' + object.Maximum + ').merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(d => d.' + object.Name + ')');

        this.react = function(properties) {
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let parameters = [];
            let xorigin = 4;
            let sar = this.calculator;

            parameters.push(React.createElement(SingleValueTooltip, {
                origin: [xorigin, yorigin],
                yAccessor: sar.accessor(),
                yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                yLabel: "SAR (" + object.Step + "," + object.Maximum + ")",
                valueStroke: axiscolor,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }));
            parameters.push(React.createElement(SARSeries, {
                yAccessor: sar.accessor()
            }));
            return parameters;
        }
        ;
        break;
    case BOLLINGER_TYPE:
        // period, deviation, apply, 
        this.calculator = eval('_ReStock.indicator.bollingerBand().id(' + object.Id + ').windowSize(' + object.Period + ').multiplier(' + object.Method + ').sourcePath("' + ApplyTo[object.Apply].text.toLowerCase() + '").merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(d => d.' + object.Name + ')');

        this.react = function(properties) {
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let parameters = [];
            let xorigin = 4;
            var bb = this.calculator;

            parameters.push(React.createElement(SingleValueTooltip, {
                origin: [xorigin, yorigin],
                yAccessor: bb.accessor(),
                yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                yLabel: object.Name + "(" + object.Period + ")",
                valueStroke: axiscolor,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }));

            parameters.push(React.createElement(BollingerSeries, {
                calculator: bb
            }));
            return parameters;
        }
        ;

        break;
    case CUSTOM_TYPE:
        break;
    case CCI_TYPE:

        break;
    case ADX_TYPE:
        this.calculator = ADX.calculate;

        break;

    case WPR_TYPE:
        this.calculator = WilliamsR.calculate;

        break;

    case ATR_TYPE:
        this.calculator = eval('_ReStock.indicator.atr().windowSize(' + object.Period + ').merge(function (d, c) {d.' + object.Name + '= c;}).accessor(function (d) {return d.' + object.Name + ';})');

        this.react = function(properties) {
            let ui  = solution.get('ui')                
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let showleftaxis    = properties.showleftaxis;              
            let parameters = [];
            let xorigin = 4;
            let atr = this.calculator;
            let levels = object.ReturnLevels(period);

            
            for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                parameters.push(React.createElement(StraightLine, {
                    type: "vertical",
                    xValue: symbolcanvas.Marks[i],
                    stroke: "blue",
                    strokeDasharray: "ShortDash"
                }));
            }

            parameters.unshift(MyChart,
            {
                id: object.Id,
                yExtents: atr.accessor(),
                height: Indicator_Height,
                origin: function origin(w, h) {
                    return [0, h - yorigin];
                }
            }, React.createElement(YAxis, {
                axisAt: "right",
                orient: "right",
                ticks: 2,
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor,
                tickFormat: d3.format(",." + symbol.Digits + "f")
            }), React.createElement(MouseCoordinateY, {
                at: "right",
                orient: "right",
                displayFormat: d3.format(",." + symbol.Digits + "f"),
                fontSize: 10,
                fontFamily: "sans-serif"
            }), )
            if (showleftaxis) {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    ticks: 2,
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor,
                    tickFormat: d3.format(",." + symbol.Digits + "f")
                }), React.createElement(MouseCoordinateY, {
                    at: "left",
                    orient: "left",
                    displayFormat: d3.format(",." + symbol.Digits + "f"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }))

            } else {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    showTicks: false,
                    ticks: 2,
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor,
                    tickFormat: d3.format(",." + symbol.Digits + "f")
                }))
            }
            parameters.push(React.createElement(YAxis, {
                axisAt: "left",
                orient: "left",
                showTicks: false,
                outerTickSize: 0,
                tickFormat: d3.format(".0s"),
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), React.createElement(LineSeries, {
                yAccessor: atr.accessor(),
                stroke: atr.stroke(),
                levels: levels
            }), React.createElement(SingleValueTooltip, {
                origin: [xorigin, 10],
                yAccessor: atr.accessor(),
                yLabel: "ATR (" + atr.windowSize() + ")",
                yDisplayFormat: d3.format(",." + symbol.Digits + "f"),
                valueStroke: axiscolor,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }), React.createElement(XAxis, {
                axisAt: "bottom",
                orient: "bottom",
                showDomain: true,
                showTicks: showaxes,
                outerTickSize: 0,
                ...xGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), showaxes ? React.createElement(MouseCoordinateX, {
                at: "bottom",
                orient: "bottom",
                displayFormat: returnperiodformat(period),
                fontSize: 10,
                fontFamily: "sans-serif"
            }) : '');
            return React.createElement.apply(null, parameters);

        }
        ;

        break;

    case RSI_TYPE:
        this.calculator = eval('_ReStock.indicator.rsi().windowSize(' + object.Period + ').sourcePath("' + ApplyTo[object.Apply].text.toLowerCase() + '").merge(function (d, c) {d.' + object.Name + ' = c;}).accessor(function (d) {return d.' + object.Name + ';})');

        this.react = function(properties) {
            let ui  = solution.get('ui')                
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let showleftaxis    = properties.showleftaxis;              
            let rsi = this.calculator;
            let levels = object.ReturnLevels(period);
            let parameters = [];
            let xorigin = 4;

            for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                parameters.push(React.createElement(StraightLine, {
                    type: "vertical",
                    xValue: symbolcanvas.Marks[i],
                    stroke: "blue",
                    strokeDasharray: "ShortDash"
                }));
            }

            parameters.unshift(MyChart, {
                id: object.Id,
                yExtents: rsi.domain(),
                height: Indicator_Height,
                origin: function origin(w, h) {
                    return [0, h - yorigin];
                }
            }, React.createElement(YAxis, {
                axisAt: "right",
                orient: "right",
                ticks: 2,
                tickValues: rsi.tickValues(),
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), React.createElement(MouseCoordinateY, {
                at: "right",
                orient: "right",
                displayFormat: d3.format(".2f"),
                fontSize: 10,
                fontFamily: "sans-serif"
            }), )
            if (showleftaxis) {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    outerTickSize: 0,
                    tickFormat: d3.format(".0s"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), React.createElement(MouseCoordinateY, {
                    at: "left",
                    orient: "left",
                    displayFormat: d3.format(".2f"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }))

            } else {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    showTicks: false,
                    outerTickSize: 0,
                    tickFormat: d3.format(".0s"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }))
            }

            parameters.push(React.createElement(YAxis, {
                axisAt: "left",
                orient: "left",
                showTicks: false,
                outerTickSize: 0,
                tickFormat: d3.format(".0s"),
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }),
            React.createElement(RSISeries, {
                calculator: rsi,
                levels: levels,
                stroke: {
                    line: "#4682B4",
                    extop: "pink",
                    top: "pink",
                    middle: axiscolor,
                    bottom: "pink",
                    exbottom: "pink"
                }
            }), React.createElement(RSITooltip, {
                origin: [xorigin, 10],
                calculator: rsi,
                object: object,
                yLabel: object.Name,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }), React.createElement(XAxis, {
                axisAt: "bottom",
                orient: "bottom",
                showDomain: true,
                showTicks: showaxes,
                outerTickSize: 0,
                ...xGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), showaxes ? React.createElement(MouseCoordinateX, {
                at: "bottom",
                orient: "bottom",
                displayFormat: returnperiodformat(period),
                fontSize: 10,
                fontFamily: "sans-serif"
            }) : '');
            return React.createElement.apply(null, parameters);
        }
        ;

        break;
    case STOCHASTIC_TYPE:
        this.calculator = eval('_ReStock.indicator.stochasticOscillator().windowSize(' + object.Period + ').kWindowSize(' + object.Value[0] + ').dWindowSize(' + object.Shift + ').merge((d, c) => {d.' + object.Name + ' = c}).accessor(d => d.' + object.Name + ')');

        this.react = function(properties) {
            let ui  = solution.get('ui')                
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let showleftaxis    = properties.showleftaxis;              
            let sto = this.calculator;
            let levels = object.ReturnLevels(period);
            let parameters = [];
            let xorigin = 4;

            for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                parameters.push(React.createElement(StraightLine, {
                    type: "vertical",
                    xValue: symbolcanvas.Marks[i],
                    stroke: "blue",
                    strokeDasharray: "ShortDash"
                }));
            }

            parameters.unshift(MyChart,
            {
                id: object.Id,
                yExtents: sto.domain(),
                height: Indicator_Height,
                origin: function origin(w, h) {
                    return [0, h - yorigin];
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            }, React.createElement(YAxis, {
                axisAt: "right",
                orient: "right",
                ticks: 2,
                tickValues: sto.tickValues(),
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), React.createElement(MouseCoordinateY, {
                at: "right",
                orient: "right",
                displayFormat: d3.format(".2f"),
                fontSize: 10,
                fontFamily: "sans-serif"
            }), )
            if (showleftaxis) {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    outerTickSize: 0,
                    tickFormat: d3.format(".2f"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), React.createElement(MouseCoordinateY, {
                    at: "right",
                    orient: "right",
                    displayFormat: d3.format(".2f"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }))

            } else {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    showTicks: false,
                    outerTickSize: 0,
                    tickFormat: d3.format(".2f"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }))
            }
            parameters.push(React.createElement(StochasticSeries, {
                calculator: sto,
                levels: levels,
                stroke: {
                    line: "#4682B4",
                    extop: "pink",
                    top: "pink",
                    middle: axiscolor,
                    bottom: "pink",
                    exbottom: "pink"
                }
            }), React.createElement(StochasticTooltip, {
                origin: [xorigin, 10],
                calculator: sto,
                object: object,
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }),
            React.createElement(XAxis, {
                axisAt: "bottom",
                orient: "bottom",
                showDomain: true,
                showTicks: showaxes,
                outerTickSize: 0,
                ...xGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), showaxes ? React.createElement(MouseCoordinateX, {
                at: "bottom",
                orient: "bottom",
                displayFormat: returnperiodformat(period),
                fontSize: 10,
                fontFamily: "sans-serif"
            }) : '');
            return React.createElement.apply(null, parameters);
        }
        ;

        break;

    case MACD_TYPE:
        this.calculator = eval('_ReStock.indicator.macd().fast(' + object.Period + ').sourcePath("' + ApplyTo[object.Apply].text.toLowerCase() + '").slow(' + object.Method + ').signal(' + object.Shift + ').merge((d, c) => {d.' + object.Name + ' = c;}).accessor(d => d.' + object.Name + ')');

        this.react = function(properties) {
            let ui  = solution.get('ui')                
            let symbol   = properties.symbol;  
            let period   = properties.period;  
            let object   = properties.object;  
            let yorigin  = properties.height;  
            let showaxes = properties.showaxes;
            let symbolcanvas   = properties.canvas;  
            let xGrid    = properties.xgrid;   
            let yGrid    = properties.ygrid;   
            let showleftaxis    = properties.showleftaxis;  
            let macd = this.calculator;
            let levels = object.ReturnLevels(period);
            let parameters = [];
            let xorigin = 4;

            for (var i = 0; i < symbolcanvas.Marks.length; i++) {
                parameters.push(React.createElement(StraightLine, {
                    type: "vertical",
                    xValue: symbolcanvas.Marks[i],
                    stroke: "blue",
                    strokeDasharray: "ShortDash"
                }));
            }
            parameters.unshift(MyChart,
            {
                id: object.Id,
                yExtents: macd.accessor(),
                height: Indicator_Height,
                origin: function origin(w, h) {
                    return [0, h - yorigin];
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            }, React.createElement(YAxis, {
                axisAt: "right",
                orient: "right",
                ticks: 2,
                ...yGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), React.createElement(MouseCoordinateY, {
                at: "right",
                orient: "right",
                displayFormat: d3.format(",." + symbol.Digits + "f"),
                fontSize: 10,
                fontFamily: "sans-serif"
            }), )
            if (showleftaxis) {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    outerTickSize: 0,
                    tickFormat: d3.format(".0s"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }), React.createElement(MouseCoordinateY, {
                    at: "left",
                    orient: "left",
                    displayFormat: d3.format(",." + symbol.Digits + "f"),
                    fontSize: 10,
                    fontFamily: "sans-serif"
                }))

            } else {
                parameters.push(React.createElement(YAxis, {
                    axisAt: "left",
                    orient: "left",
                    showTicks: false,
                    outerTickSize: 0,
                    tickFormat: d3.format(".0s"),
                    ...yGrid,
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    stroke: axiscolor,
                    tickStroke: axiscolor
                }))
            }
            parameters.push(
            React.createElement(MACDSeries, {
                calculator: macd,
                levels: levels,
                stroke: "#4682B4"
            }), React.createElement(MACDTooltip, {
                origin: [0, 10],
                calculator: macd,
                object: object,
                displayFormat: d3.format(",." + symbol.Digits + "f"),
                onClick: function onClick(e) {
                    return openPopupObject(object.Name);
                },
                onClose: function onClose(e) {
                    indicatorclose(e, object.Name);
                }
            }), React.createElement(XAxis, {
                axisAt: "bottom",
                orient: "bottom",
                showDomain: true,
                showTicks: showaxes,
                outerTickSize: 0,
                ...xGrid,
                fontSize: 10,
                fontFamily: "sans-serif",
                stroke: axiscolor,
                tickStroke: axiscolor
            }), showaxes ? React.createElement(MouseCoordinateX, {
                at: "bottom",
                orient: "bottom",
                displayFormat: returnperiodformat(period),
                fontSize: 10,
                fontFamily: "sans-serif"
            }) : '');
            return React.createElement.apply(null, parameters);
        }
        ;

        break;
    }
}
//-------------------------------------------------------------------PIVOT------------------------------------------------------------------

var PIVOT_calculate = function(data) {

    var period = P_D1;

    var pivotpoint, pivotsupport, pivotsupport1, pivotsupport2, pivotresistance, pivotresistance1, pivotresistance2;
    var previoushigh = 0;
    var previouslow = 100000;

    var currentitem_start_idx;

    var currentitem_end_idx = data.length - 1;

    var currentday = GetSeperatorFromPeriod(data[currentitem_end_idx], period)

    var i = currentitem_end_idx;

    while (i >= 0 && currentday == GetSeperatorFromPeriod(data[i], period))
        i--;

    if (i < 0) {
        return data;
    }

    var currentitem_start_idx = i + 1;

    var previousday = GetSeperatorFromPeriod(data[i], period);

    var startindex = i;

    while (i >= 0) {

        previousclose = data[i].close;
        startindex = i;
        previoushigh = 0;
        previouslow = 100000;
        while (i >= 0 && previousday == GetSeperatorFromPeriod(data[i], period)) {
            previoushigh = Math.max(previoushigh, data[i].high);
            previouslow = Math.min(previouslow, data[i].low);
            i--;
        }
        if (i < 0) {
            for (var j = 0; j <= currentitem_end_idx; j++) {
                data[j].PIVOT_RESISTANCE2 = undefined;
                data[j].PIVOT_RESISTANCE1 = undefined;
                data[j].PIVOT_RESISTANCE = undefined;
                data[j].PIVOT_HIGH = undefined;
                data[j].PIVOT_POINT = undefined;
                data[j].PIVOT_LOW = undefined;
                data[j].PIVOT_SUPPORT = undefined;
                data[j].PIVOT_SUPPORT1 = undefined;
                data[j].PIVOT_SUPPORT2 = undefined;
            }
            return data;
        }
        previousday = GetSeperatorFromPeriod(data[i], period);

        pivotpoint = (previoushigh + previousclose + previouslow) / 3;
        pivotsupport = 2 * pivotpoint - previoushigh;
        pivotsupport1 = pivotpoint - (previoushigh - previouslow);
        pivotsupport2 = 2 * pivotpoint - ((2 * previoushigh) - previouslow);
        pivotresistance = 2 * pivotpoint - previouslow;
        pivotresistance1 = pivotpoint + (previoushigh - previouslow);
        pivotresistance2 = 2 * pivotpoint + (previoushigh - (2 * previouslow));

        for (var j = currentitem_start_idx; j <= currentitem_end_idx; j++) {
            data[j].PIVOT_RESISTANCE2 = pivotresistance2;
            data[j].PIVOT_RESISTANCE1 = pivotresistance1;
            data[j].PIVOT_RESISTANCE = pivotresistance;
            data[j].PIVOT_HIGH = previoushigh;
            data[j].PIVOT_POINT = pivotpoint;
            data[j].PIVOT_LOW = previouslow;
            data[j].PIVOT_SUPPORT = pivotsupport;
            data[j].PIVOT_SUPPORT1 = pivotsupport1;
            data[j].PIVOT_SUPPORT2 = pivotsupport2;
        }
        currentitem_start_idx = i + 1;
        currentitem_end_idx = startindex;
    }
    return data;
}
//-------------------------------------------------------------- FRACTALS AND RESISTANCE SUPPORT----------------------------------------------------------------

var LevelCalculate = function(Price1, Time1, Price2, Time2, NewTime) {
    var level, a, b;

    if (Time2 != Time1) {
        // Just in case, to avoid zero divide.
        a = (Price2 - Price1) / (Time2 - Time1);
        b = Price1 - (a * Time1);
        level = (a * NewTime) + b;
    } else {
        return (Price2);
    }
    return (level);
}

var FRACTAL_calculate = function(data) {

    var i;
    var bFound;
    var dCurrent;
    var lastupfractaltime;
    var lastdownfractaltime;

    var lastupfractal = undefined;
    var lastdownfractal = undefined;

    var lastresistance = undefined;
    var lastsupport = undefined;

    var length = data.length;

    if (length < 5)
        return;

    i = 2;

    //----Up and Down Fractals

    while (i < length - 2) {
        //----Fractals up
        data[i].UPFRACTAL = lastupfractal;
        data[i].RESISTANCE = lastresistance;
        data[i].DOWNFRACTAL = lastdownfractal;
        data[i].SUPPORT = lastsupport;
        bFound = 0;
        dCurrent = data[i].high;

        if (dCurrent > data[i - 1].high && dCurrent > data[i - 2].high && dCurrent > data[i + 1].high && dCurrent > data[i + 2].high) {
            bFound = i;
            data[i].UPFRACTAL = dCurrent;
            lastupfractaltime = i;
            data[i].RESISTANCE = [FindNextFractal(MODE_UPPER, data, i), [dCurrent, lastupfractaltime]];
        }
        //----6 bars Fractal

        if (!bFound && i >= 3) {

            if (dCurrent == data[i - 1].high && dCurrent > data[i - 2].high && dCurrent > data[i - 3].high && dCurrent > data[i + 1].high && dCurrent > data[i + 2].high) {
                bFound = i;
                data[i].UPFRACTAL = dCurrent;
                lastupfractaltime = i;
                data[i].RESISTANCE = [FindNextFractal(MODE_UPPER, data, i), [dCurrent, lastupfractaltime]];
            }
        }

        //----7 bars Fractal
        if (!bFound && i >= 4) {

            if (dCurrent >= data[i - 1].high && dCurrent == data[i - 2].high && dCurrent > data[i - 3].high && dCurrent > data[i - 4].high && dCurrent > data[i + 1].high && dCurrent > data[i + 2].high) {
                bFound = i;
                data[i].UPFRACTAL = dCurrent;
                lastupfractaltime = i;
                data[i].RESISTANCE = [FindNextFractal(MODE_UPPER, data, i), [dCurrent, lastupfractaltime]];
            }
        }

        //----8 bars Fractal                          
        if (!bFound && i >= 5) {

            if (dCurrent >= data[i - 1].high && dCurrent == data[i - 2].high && dCurrent == data[i - 3].high && dCurrent > data[i - 4].high && dCurrent > data[i - 5].high && dCurrent > data[i + 1].high && dCurrent > data[i + 2].high) {
                bFound = i;
                data[i].UPFRACTAL = dCurrent;
                lastupfractaltime = i;
                data[i].RESISTANCE = [FindNextFractal(MODE_UPPER, data, i), [dCurrent, lastupfractaltime]];
            }
        }

        //----9 bars Fractal                                        
        if (!bFound && i >= 6) {

            if (dCurrent >= data[i - 1].high && dCurrent == data[i - 2].high && dCurrent >= data[i - 3].high && dCurrent == data[i - 4].high && dCurrent > data[i - 5].high && dCurrent > data[i - 6].high && dCurrent > data[i + 1].high && dCurrent > data[i + 2].high) {
                bFound = i;
                data[i].UPFRACTAL = dCurrent;
                lastupfractaltime = i;
                data[i].RESISTANCE = [FindNextFractal(MODE_UPPER, data, i), [dCurrent, lastupfractaltime]];
            }
        }
        if (bFound) {
            lastupfractal = data[i].UPFRACTAL;
            lastresistance = data[i].RESISTANCE;
        } else {
            if (lastresistance != undefined) {
                var Price1 = data[i].RESISTANCE[0][0];
                var Time1 = data[i].RESISTANCE[0][1];
                if (Price1 != undefined) {

                    var Price2 = lastupfractal;
                    var Time2 = lastupfractaltime;
                    var level = LevelCalculate(Price1, Time1, Price2, Time2, i);
                    lastresistance[1][1] = i;
                    lastresistance[1][0] = level;
                }

            }

        }

        //----Fractals down
        bFound = 0;
        dCurrent = data[i].low;

        if (dCurrent < data[i - 1].low && dCurrent < data[i - 2].low && dCurrent < data[i + 1].low && dCurrent < data[i + 2].low) {
            bFound = i;
            data[i].DOWNFRACTAL = dCurrent;
            lastdownfractaltime = i;
            data[i].SUPPORT = [FindNextFractal(MODE_LOWER, data, i), [dCurrent, lastdownfractaltime]];

        }
        //----6 bars Fractal
        if (!bFound && i >= 3) {
            if (dCurrent == data[i - 1].low && dCurrent < data[i - 2].low && dCurrent < data[i - 3].low && dCurrent < data[i + 1].low && dCurrent < data[i + 2].low) {
                bFound = i;
                data[i].DOWNFRACTAL = dCurrent;
                lastdownfractaltime = i;
                data[i].SUPPORT = [FindNextFractal(MODE_LOWER, data, i), [dCurrent, lastdownfractaltime]];
            }
        }

        //----7 bars Fractal
        if (!bFound && i >= 4) {
            if (dCurrent <= data[i - 1].low && dCurrent == data[i - 2].low && dCurrent < data[i - 3].low && dCurrent < data[i - 4].low && dCurrent < data[i + 1].low && dCurrent < data[i + 2].low) {
                bFound = i;
                data[i].DOWNFRACTAL = dCurrent;
                lastdownfractaltime = i;
                data[i].SUPPORT = [FindNextFractal(MODE_LOWER, data, i), [dCurrent, lastdownfractaltime]];
            }
        }

        //----8 bars Fractal                          
        if (!bFound && i >= 5) {
            if (dCurrent <= data[i - 1].low && dCurrent == data[i - 2].low && dCurrent == data[i - 3].low && dCurrent < data[i - 4].low && dCurrent < data[i - 5].low && dCurrent < data[i + 1].low && dCurrent < data[i + 2].low) {
                bFound = i;
                data[i].DOWNFRACTAL = dCurrent;
                lastdownfractaltime = i;
                data[i].SUPPORT = [FindNextFractal(MODE_LOWER, data, i), [dCurrent, lastdownfractaltime]];
            }
        }

        //----9 bars Fractal                                        
        if (!bFound && i >= 6) {
            if (dCurrent <= data[i - 1].low && dCurrent == data[i - 2].low && dCurrent <= data[i - 3].low && dCurrent == data[i - 4].low && dCurrent < data[i - 5].low && dCurrent < data[i - 6].low && dCurrent < data[i + 1].low && dCurrent < data[i + 2].low) {
                bFound = i;
                data[i].DOWNFRACTAL = dCurrent;
                lastdownfractaltime = i;
                data[i].SUPPORT = [FindNextFractal(MODE_LOWER, data, i), [dCurrent, lastdownfractaltime]];
            }
        }
        if (bFound) {
            lastdownfractal = dCurrent;
            lastsupport = data[i].SUPPORT;
        } else {
            if (lastsupport != undefined) {
                var Price1 = data[i].SUPPORT[0][0];
                var Time1 = data[i].SUPPORT[0][1];
                if (Price1 != undefined) {
                    var Price2 = lastdownfractal;
                    var Time2 = lastdownfractaltime;
                    var level = LevelCalculate(Price1, Time1, Price2, Time2, i);
                    lastsupport[1][1] = i;
                    lastsupport[1][0] = level;
                }
            }
        }

        i++;
    }

    while (i < length) {
        data[i].UPFRACTAL = lastupfractal;
        data[i].DOWNFRACTAL = lastdownfractal;
        data[i].RESISTANCE = lastresistance;
        data[i].SUPPORT = lastsupport;
        if (lastsupport != undefined) {
            var Price1 = data[i].SUPPORT[0][0];
            var Time1 = data[i].SUPPORT[0][1];
            if (Price1 != undefined) {
                var Price2 = lastdownfractal;
                var Time2 = lastdownfractaltime;
                var level = LevelCalculate(Price1, Time1, Price2, Time2, i);
                lastsupport[1][1] = i;
                lastsupport[1][0] = level;
            }
        }
        if (lastresistance != undefined) {
            var Price1 = data[i].RESISTANCE[0][0];
            var Time1 = data[i].RESISTANCE[0][1];
            if (Price1 != undefined) {

                var Price2 = lastupfractal;
                var Time2 = lastupfractaltime;
                var level = LevelCalculate(Price1, Time1, Price2, Time2, i);
                lastresistance[1][1] = i;
                lastresistance[1][0] = level;
            }
        }
        i++;
    }

    return data;
}

//-------------------------------------------------------------- FIBO  ---------------------------------------------------------------

var FIBO_calculate = function(data) {

    var length = data.length - 1;

    data[0].fibo_buy = undefined;
    data[0].fibo_sell = undefined;
    data[0].fibo_stopLoss = undefined;

    data[0].fibo_takeprofit1 = undefined;
    data[0].fibo_takeprofit2 = undefined;
    data[0].fibo_takeprofit3 = undefined;

    for (var i = 1; i <= length; i++) {
        var currentitem = data[i];
        if (currentitem.close > data[i - 1].open) {
            currentitem.fibo_sell = -1;
            currentitem.fibo_buy = currentitem.high - (currentitem.high - currentitem.low) * 0.382;
            currentitem.fibo_stoploss = currentitem.high - (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit1 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit2 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 1;
            currentitem.fibo_takeprofit3 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 1.618;

        } else {

            currentitem.fibo_buy = -1;
            currentitem.fibo_sell = currentitem.low + (currentitem.high - currentitem.low) * 0.382;
            currentitem.fibo_stoploss = currentitem.low + (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit1 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 0.618;
            currentitem.fibo_takeprofit2 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 1;
            currentitem.fibo_takeprofit3 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 1.618;
        }
    }
    return data;
}

//-------------------------------------------------------------- HEIKEN  ---------------------------------------------------------------

var HEIKEN_calculate = function(data) {
    var lows = [];
    var closes = [];
    var highs = [];
    var opens = [];
    var dates = [];
    var volumes = [];
    for (var i = 0; i < data.length; i++) {
        closes.push(data[i].close);
        highs.push(data[i].high);
        lows.push(data[i].low);
        opens.push(data[i].open);
        dates.push(data[i].date);
        volumes.push(data[i].volume);
    }
    var resultdata = HeikinAshi.calculate({
        low: lows,
        close: closes,
        high: highs,
        open: opens
    });

    for (var i = 0; i < data.length; i++) {
        data[i].heikin_open = resultdata.open[i];
        data[i].heikin_close = resultdata.close[i];
        data[i].heikin_high = resultdata.high[i];
        data[i].heikin_low = resultdata.low[i];

    }
    return data;
}

var PROGRESS_calculate = function(data) {

    var PG, period, symbol;

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas)
        return;

    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;

    if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_PNAME) {
        PG = solution.CurrentTerminal.PG;
    } else {
        return;
        PG = solution.CurrentProject.PG;
    }
    var index = PG.GetSymbolIndexFromName(symbol.Name);

    var signal = ProgressSignalValueTab[0][index][period];
    // + solution.DifferenceHoursTime;
    var time = SystemSignalTimeTab[0][index][period] * 1000 + solution.DifferenceHoursTime;

    var barindex = FindIdxDataFromTime(time, data);
    if (barindex < 0)
        return data;

    eval('data[' + barindex + '].progress_' + signal + ' = 1;')

    return data;
}

//-------------------------------------------------------------- SYSTEM  ---------------------------------------------------------------

var SYSTEM_calculate = function(data) {

    var length = data.length - 1;

    data[0].fibo_buy = undefined;
    data[0].fibo_sell = undefined;
    data[0].fibo_stopLoss = undefined;

    data[0].fibo_takeprofit1 = undefined;
    data[0].fibo_takeprofit2 = undefined;
    data[0].fibo_takeprofit3 = undefined;

    let signalscallbackname = indicatorcontext.GetSignalCallbackFromObject(object);        

    for (var i = 1; i <= length; i++) {
        let currentitem       = data[i];
        let beforecurrentitem = data[i-1];

        if (currentitem.close > data[i - 1].open) {
            currentitem.fibo_sell = -1;
            currentitem.fibo_buy = currentitem.high - (currentitem.high - currentitem.low) * 0.382;
            currentitem.fibo_stoploss = currentitem.high - (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit1 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit2 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 1;
            currentitem.fibo_takeprofit3 = currentitem.fibo_buy + (currentitem.high - currentitem.low) * 1.618;

        } else {

            currentitem.fibo_buy = -1;
            currentitem.fibo_sell = currentitem.low + (currentitem.high - currentitem.low) * 0.382;
            currentitem.fibo_stoploss = currentitem.low + (currentitem.high - currentitem.low) * 0.618;
            currentitem.fibo_takeprofit1 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 0.618;
            currentitem.fibo_takeprofit2 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 1;
            currentitem.fibo_takeprofit3 = currentitem.fibo_sell + (currentitem.low - currentitem.high) * 1.618;
        }
    }
    let currentbartime = fullData[currentitem].date.getTime() / 1000;

    var k = 0;
    var tracevalue = "";

    var objects    = symbolcanvas.Indicators.map(x => symbolcanvas.PG.GetObjectFromId(x));
    var objidarray = objects.map(x => x.Id);    

      
    expertcontext.ResetSignals(objidarray, null, [period], currentbartime, 1);
   
   
    for (var i = 0; i < objects.length; i++) {
    
        let object =objects[i];
        if (!object) continue;
   
        let signalscallbackname = expertcontext.GetSignalCallbackFromObject(object);
   
        if (signalscallbackname != null) {

            eval('expertcontext.' + signalscallbackname + '(period, object, fullData, currentitem, 1)');
        }
    }
    expertcontext.ResetSignals(objidarray, null, [period], currentbartime);
   
   
    for (var i = 0; i < objects.length; i++) {
        
        var object =objects[i];
        if (!object) continue;

        let signalscallbackname = expertcontext.GetSignalCallbackFromObject(object);
        if (signalscallbackname != null) {
  
            eval('expertcontext.' + signalscallbackname + '(period, object, fullData, currentitem)');
        }
    }    


    for (var i = 0; i < objects.length; i++) {
        
        var object =objects[i];
        if (!object) continue;
  
// CROSS OBJECTS        
        if (object.Cross != "") {
           
            var cobject = symbolcanvas.PG.GetObjectFromName (object.Cross); 

            if (cobject) {
                if (expertcontext.SValue(object.Id, S_PREVIOUS, period) < expertcontext.SValue(cobject.Id, S_PREVIOUS, period) && expertcontext.SValue(object.Id, S_CURRENT, period) > expertcontext.SValue(cobject.Id, S_CURRENT, period)) {
                    expertcontext.SETSIGNAL(0, object.Id, S_RCROSSED, period, P_SIGNAL, 1);
                } else 
                if (expertcontext.SValue(object.Id, S_PREVIOUS,period) > expertcontext.SValue(cobject.Id, S_PREVIOUS, period) && expertcontext.SValue(object.Id, S_CURRENT, period) < expertcontext.SValue(cobject.Id, S_CURRENT, period)) {
                    expertcontext.SETSIGNAL(0, object.Id, S_RCROSSED, period, P_SIGNAL, 0);
                }
            }
        }
    }
// END CROSS OBJECTS         
        expertcontext.SetPreviousSignals(objidarray, null);          
}
