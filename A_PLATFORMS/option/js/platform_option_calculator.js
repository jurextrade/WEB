  
var call_option_price = 0.0;
var put_option_price = 0.0;
var call_delta       = 0.0;
var put_delta        = 0.0;
var call_gamma       = 0.0;
var put_gamma        = 0.0;
var call_theta       = 0.0;
var put_theta        = 0.0;
var call_vega        = 0.0;
var put_vega         = 0.0;
var call_rho         = 0.0;
var put_rho          = 0.0;

//--------------------------------

var div_yield        = 0.0;
var price            = 0.0;
var strike           = 0.0;
var rate             = 0.0;
var vol              = 0.0;

//--------------------------------

function getCRROptionPrice(S, X, vol, rate, time, steps, div_yield, is_put) {
    var t = time/steps;
    var u = Math.exp(vol * Math.sqrt(t));
    var d = 1.0/u;
    var e = Math.exp(rate * t);
    var u2 = u*u;
    var R = Math.exp((rate - div_yield) * t);
    var p_up = (R-d)/(u-d);
    var p_down = 1 - p_up;
    var prices = new Array(steps + 1);
    var values = new Array(steps + 1);
    prices[0] = S * Math.pow(d, steps); /* stock down price at step "steps" */


    for (i=1; i <= steps; ++ i) {
         prices[i] = u2 * prices[i-1];
    }
    for (i=0; i <= steps; ++ i)  {
       if (is_put) {
           values[i] = X - prices[i] > 0 ? X - prices[i] : 0.0;
       }
       else {
           values[i] = prices[i] - X > 0 ? prices[i] - X : 0.0;
       }
    }
    for (s = steps-1; s >= 0; -- s) {
       for (i=0; i <= s; ++ i) {
            values[i] = (p_up * values[i+1] + p_down * values[i])/e;
            prices[i] = d * prices[i+1];
  
            if (is_put) {
                values[i] = X - prices[i] > values[i] ? X - prices[i] : values[i];
            }
            else {
                values[i] = prices[i] - X > values[i] ? prices[i] - X : values[i];
            }
       }
    }
    return values[0];
  }

function getCRROptionPriceAndGreeks(S, X, vol, rate, time, steps, div_yield, is_put) {
    var t = time/steps;
    var u = Math.exp(vol * Math.sqrt(t));
    var d = 1.0/u;
    var e = Math.exp(rate * t);
    var u2 = u*u;
    var R = Math.exp((rate - div_yield) * t);
    var p_up = (R-d)/(u-d);
    var p_down = 1 - p_up;
    var prices = new Array(steps + 1);
    var values = new Array(steps + 1);
    prices[0] = S * Math.pow(d, steps); /* stock down price at step "steps" */
    for (i=1; i <= steps; ++ i) {
       prices[i] = u2 * prices[i-1];
    }
    for (i=0; i <= steps; ++ i) {
       if (is_put)
       {
           values[i] = X - prices[i] > 0 ? X - prices[i] : 0.0;
       }
       else {
           values[i] = prices[i] - X > 0 ? prices[i] - X : 0.0;
       }
    }
    var Cu = 0.0;
    var Cd = 0.0;
    var Cuu = 0.0;
    var Cud = 0.0;
    var Cdd = 0.0;

    for (s = steps-1; s >= 0; -- s) {
       for (i=0; i <= s; ++ i) {
            values[i] = (p_up * values[i+1] + p_down * values[i])/e;
            prices[i] = d * prices[i+1];
  
            if (is_put)
            {
                values[i] = X - prices[i] > values[i] ? X - prices[i] : values[i];
            }
            else {
                values[i] = prices[i] - X > values[i] ? prices[i] - X : values[i];
            }
          if (s == 1) {                 /* for delta */
                if (i == 0){ Cd = values[i]; }
                else { Cu = values[i]; }
            }
            if (s == 2) {            /* for gamma */
                if (i == 0) {
                    Cdd = values[i];
                }
                else if (i == 1) {
                    Cud = values[i];
                }
                else {
                    Cuu = values[i];
                }
            }
       }
    }
    var option_price = values[0];
            /* Delta is: (Cu - Cd)/(Su - Sd) and is determined at nodes u and d */
    var delta = ((Cu - Cd) / (S*u - S*d));
            /* Gamma is:
            delta_two-delta_one/c;
            with
            delta_two = (Cuu - Cud)/(Suu - Sd)
            delta_one = (Cdu - Cdd)/(S - Sdd)
            and change c = 1/2*(Suu - Sdd)
            */
    var Suu = S*u2;
    var Sdd = S*d*d;
    var gamma = (((Cuu - Cud)/(Suu - S))-((Cud - Cdd)/(S - Sdd)))/(0.5*(Suu - Sdd));
    /*
    Theta is (Cud  - C) * 2t (time interval duration)
    */
    var theta = ((Cud - option_price)/(2*t))/365;
    /*
       Vega: use a new tree with a new volatility of 0.01
    */
    var vol_diff = 0.01;
    var v_price = getCRROptionPrice(S, X, vol+vol_diff, rate, time, steps, div_yield, is_put);
    var vega = ((v_price-option_price)/vol_diff)/100;
    /*
        Rho: same as above with variation in rate of 0.01
    */
    var rate_diff = 0.01;
    var r_price = getCRROptionPrice(S, X, vol, rate+rate_diff, time, steps, div_yield, is_put);
    var rho = ((r_price - option_price)/rate_diff)/100;
    return [option_price, delta, gamma, theta, vega, rho];
  }

  function validate(p, s, r, v_c, v_p, t, d, o) {
	var msg = "";
	euro_opt = o == 'a' ? false : true;


	price       = parseFloat(p);
	strike      = parseFloat(s);
	rate        = parseFloat(r);
	vol_c       = parseFloat(v_c);
	vol_p       = parseFloat(v_p);
	time        = parseFloat(t);
	dividend    = parseFloat(d);

    if (isNaN(price)){ msg += "Stock Price, "; }
	if (isNaN(strike)){ msg += "Strike Price, "; }
	if (isNaN(rate)){ msg += "Interest Rate, "; }
	if (isNaN(vol_c)){ msg += "Implied Volatility Call, "; }
	if (isNaN(vol_p)){ msg += "Implied Volatility Put, "; }
	if (isNaN(time)){ msg += "Days to Expiration, "; }
	if (isNaN(dividend)){ dividend = 0.0; }
	div_yield = dividend/100;
	if (msg == ""){
		time /= 365; 
		rate = rate/100;
		vol_c = vol_c/100;
		vol_p = vol_p/100;
	   return true;
	} else { 
		msgcrop = msg.substr(0,(msg.length-2));
		$('#alert_msg p').html('Please make sure you have entered valid digits for: <br class="hidden-xs" /> '+msgcrop+' ');
		$('#alert_msg').css( 'display', 'block' );
		return false;
	}
}  

function getOptionPrices(p, s, r, v_c, v_p, t, d, o) {
    if (!validate(p, s, r, v_c, v_p, t, d, o)){
        return false;
    }

    var call_price_greeks = getCRROptionPriceAndGreeks(price,strike,vol_c,rate,time,steps,div_yield,false);
    var put_price_greeks  = getCRROptionPriceAndGreeks(price,strike,vol_p,rate,time,steps,div_yield,true);

    call_option_price   = call_price_greeks[0];
    put_option_price    = put_price_greeks[0];
    call_delta          = call_price_greeks[1];
    put_delta           = put_price_greeks[1];
    call_gamma          = call_price_greeks[2];
    put_gamma           = put_price_greeks[2];
    call_theta          = call_price_greeks[3];
    put_theta           = put_price_greeks[3];
    call_vega           = call_price_greeks[4];
    put_vega            = put_price_greeks[4];
    call_rho            = call_price_greeks[5];
    put_rho             = put_price_greeks[5];
    return true;
}

function calculate(f) {
	if (getOptionPrices(f.price.value, f.strike.value, f.rate.value, f.volatility_c.value, f.volatility_p.value, f.time.value, f.dividend.value)) {
		f.call_price.value  = RoundTo(call_option_price, round_to);
		f.put_price.value   = RoundTo(put_option_price, round_to);
		f.call_delta.value  = RoundTo(call_delta, round_to);
		f.put_delta.value   = RoundTo(put_delta, round_to);
		f.call_gamma.value  = RoundTo(call_gamma, round_to);
		f.put_gamma.value   = RoundTo(put_gamma, round_to);
		f.call_theta.value  = RoundTo(call_theta, round_to);
		f.put_theta.value   = RoundTo(put_theta, round_to);
		f.call_vega.value   = RoundTo(call_vega, round_to);
		f.put_vega.value    = RoundTo(put_vega, round_to);
		f.call_rho.value    = RoundTo(call_rho, round_to);
		f.put_rho.value     = RoundTo(put_rho, round_to);
		$("#alert_msg").css( "display", "none" );
	}
}

function reset () {
    document.bs.reset();
}

//---------------------------------------------------- OPTION CALCULATOR PANEL  -------------------------------------------------------- 

function calculate_from_contract (price, strike, rate, nbrdays, dividend, volatility_c, volatility_p) {
    var f = document.bs;
    f.price.value =  price; //+symbol.Last;
    f.strike.value = strike; //contract.summary.strike;
    f.rate.value = rate; //contract.value.rate; 
    f.time.value = nbrdays; //contract.time.strike; // DaysDifference
    f.dividend.value = dividend; //contract.value.pvDividend;
    f.volatility_c.value = volatility_c; //contract.value.impliedVol;
    f.volatility_p.value = volatility_p; //contract.value.impliedVol;
    calculate(f);
}             

//-------------------------------------------------------------- OPTION CALCULATOR PANEL  -------------------------------------------------------------   

function OptionCalculatorPanel (id, classnames) {
    var content     = '';
    content +=     
'   <form  id="' + id + '" class="' + (classnames ? classnames : '')  + '" name="bs">' +    
'       <div class="sb_formcontainer calcBkgd">' +
'           <div  class="sb_formgroup">' +
'    	        <label>Stock Price</label>' +
'    		    <input type="number" name="price" class="form-control" id="inp_price" value="100.0"  min="0" autocomplete="off">' +
'     	        <label class="right-inline">Strike Price</label>' +
'    		    <input type="number" name="strike" class="form-control" id="inp_strike" value="100.0"  min="0" autocomplete="off">' +
'    		</div>' +
'		    <div  class="sb_formgroup">' +
'    		    <label>Interest Rate (in %)</label>' +
'    			<input type="number" name="rate" class="form-control" id="inp_rate" value="10.0" autocomplete="off">' +
'   			<label class="right-inline">Dividend Yield (in %)</label>' +
'    			<input type="number" name="dividend" class="form-control" id="inp_dividend" value="0" autocomplete="off">' +
'    		</div>' +
'       	<div  class="sb_formgroup">' +
'               <label>Volatility Call (in %)</label>' +
'        	    <input type="number" name="volatility_c" class="form-control" id="inp_volatility" value="10.0" autocomplete="off">' +
'               <label class="right-inline">Volatility Put (in %)</label>' +
'        	    <input type="number" name="volatility_p" class="form-control" id="inp_volatility1" value="10.0" autocomplete="off">' +
'    		</div>' +
'           <div  class="sb_formgroup">' +
'               <label>Days to Expiration</label>' +
'               <input type="number" name="time" class="form-control" id="inp_time" value="365" min="0" autocomplete="off">' +
'           </div>' +
'    	</div>' +
'       <div class="sb_buttongroup">' + 
'           <a class="sb_button" id="resetBtn" onclick="reset()">Reset</a>' +
'           <a class="sb_button" id="calculateBtn" onclick="calculate(document.bs)">Calculate</a>' +
'       </div>' +
'       <div class="sb_formcontainer" >' +
'           <div class="row">' +
'    		    <div class="col-6 calcCallResult">' +
'                  <div class="CallTitle">CALL</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Option Price</label>' +
'    				  	<input id="call_price" class="form-control" name="call_price" type="text" value="0" disabled="disabled" readonly="">' +
'    				</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Delta</label>' +
'    				  	<input id="call_delta" class="form-control" name="call_delta" type="text" value="0" disabled="disabled" readonly="">' +
'    				</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Gamma</label>' +
'    				  	<input id="call_gamma" class="form-control" name="call_gamma" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Theta</label>' +
'    				  	<input id="call_theta" class="form-control" name="call_theta" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Vega</label>' +
'    				  	<input id="call_vega" class="form-control" name="call_vega" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Rho</label>' +
'    				  	<input id="call_rho" class="form-control" name="call_rho" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'               </div>' +
'    			<div class="col-6 calcPutResult sb_left">' +
'                  <div class="PutTitle">PUT</div>'+
'    				    <div  class="sb_formgroup">' +
'    				        <label>Option Price</label>' +
'    				  	    <input id="put_price" class="form-control" name="put_price" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	    </div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Delta</label>' +
'    				  	<input id="put_delta" class="form-control" name="put_delta" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Gamma</label>' +
'    				  	<input id="put_gamma" class="form-control" name="put_gamma" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Theta</label>' +
'    				  	<input id="put_theta" class="form-control" name="put_theta" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Vega</label>' +
'    				  	<input id="put_vega" class="form-control" name="put_vega" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    				<div  class="sb_formgroup">' +
'    				    <label>Rho</label>' +
'    				  	<input id="put_rho" class="form-control" name="put_rho" type="text" value="0" disabled="disabled" readonly="">' +
'    			  	</div>' +
'    		    </div>' +
'           </div><!-- close row -->' +
'      </div>' +
'   </form>';
    return content;
}