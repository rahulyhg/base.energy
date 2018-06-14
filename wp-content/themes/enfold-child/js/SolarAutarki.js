// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  
  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

//math to radians
function mathtoradians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
//methode für declination für jeden tag
function declination (jahrestag)
{
	var declinationangle = Math.asin((0.39795*Math.cos((Math.PI*0.98563/180.00)*(jahrestag-173))));
	return declinationangle;
}
//methode für hourangle
function zeitzuangle (tagesstunde){
	var hourangle = 15*(tagesstunde-12);
	return mathtoradians(hourangle);
}
//crate beeinflusst batterysize

function crate(batterysize, verbraucher){
	
	var crate = verbraucher/batterysize;
	if (crate<0.6){
		batterysize=(batterysize*1);
	}else {
		if (crate>=0.6 && crate<1.6){
		batterysize=batterysize*0.92;
	}else {
				if (crate>=1.6 && crate<3.6){
		batterysize=batterysize*0.46;
	}else {
				if (crate>=3.6 && crate<7.6){
		batterysize=batterysize*0.23;
	}else {
				if (crate>=7.6 && crate<12){
		batterysize=batterysize*0.15;
	}else {
				if (crate>=12 && crate<17.4){
		batterysize=batterysize*0.12;
	}else {
		batterysize=batterysize*0.6;
}}}}}}
//console.log("crate "+crate+ " batterysize nach crate "+ batterysize	);
return batterysize;
}

function jahrestagzumonat(jahrestag){
	if (jahrestag<32){
	monat=1;	
	}else {
		if (31<jahrestag && jahrestag<=59){
		monat= 2;
	}else {
		if (59<jahrestag && jahrestag<=90){
		monat= 3;
	}else {
		if (90<jahrestag && jahrestag<=120){
	monat= 4;
	}else {
		if (120<jahrestag && jahrestag<=151){
	monat= 5;
	}else {
		if (151<jahrestag && jahrestag<=181){
	monat= 6;
	}else {
		if (181<jahrestag && jahrestag<=212){
	monat= 7;
	}else {
		if (212<jahrestag && jahrestag<=243){
	monat= 8;
	}else {
		if (243<jahrestag && jahrestag<=273){
	monat= 9;
	}else {
		if (273<jahrestag && jahrestag<=304){
	monat= 10;
	}else {
		if (304<jahrestag && jahrestag<=334){
	monat= 11;
	}else {
	monat= 12;
	}}}}}}}}}}}
	return monat;
}

function monatzumonatstage(monat){
	if (monat=1){
	tage=31;	
	}else {
		if (monat=1){
		tage= 28;
	}else {
		if (monat=3){
		tage= 31;
	}else {
		if (monat=4){
	tage= 30;
	}else {
		if (monat=5){
	monat= 31;
	}else {
		if (monat=6){
	tage= 30;
	}else {
		if (monat=7){
	tage= 31;
	}else {
		if (monat=8){
	tage=31 ;
	}else {
		if (monat=9){
	tage= 30;
	}else {
		if (monat=10){
	tage= 31;
	}else {
		if (monat=11){
	tage= 30;
	}else {
	tage= 31;
	}}}}}}}}}}}
	return tage;
}

var irradiance = 1367;                         //W/m2
var effizienzreel = 0.75;
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);

function getsolmateday(){

var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var solmateday = Math.floor(diff / oneDay);
return solmateday;
}
var solmatehour = now.getHours();

function ClearskyValue(latitude, tilt, moduleazi){
	var moduleazirad = mathtoradians(moduleazi);
	var tiltrad = mathtoradians(tilt);
	// declare objects properly and clean in the right scope
	var resultscsv = new Array (7);
	var cosdetahourly= new Array(366);
	for (var i=0; i<366; i++){
		cosdetahourly[i]= new Array(24);
	}
	var sunazimuthhourly= new Array(366);
	var sunaltitudehourly= new Array(366);
	for (var i=0; i<366; i++){
		sunaltitudehourly[i]= new Array(24);
	}
	for (var i=0; i<366; i++){
		sunazimuthhourly[i]= new Array(24);
	}
	var clearskyhourly= new Array(366);
	for (var i=0; i<366; i++){
	clearskyhourly[i]= new Array(24);
	}
	var clearskydaily= new Array(366);
	var clearskymonthly= new Array(13);
	for (var i=0; i<13; i++){
	clearskymonthly[i]= 0;
	}
	var summe=0;
	//console.log(latitude + " =latitude " + moduleazi + " =moduleazi " +tilt+ " =tilt");
	for (var jahrestag=1; jahrestag<=365;jahrestag++){
	clearskydaily[jahrestag]=0;
	var month=jahrestagzumonat(jahrestag);
	var declinationnow = declination(jahrestag);
	var irradiancenow= irradiance*(1+(0.034*Math.cos((mathtoradians(360/365.25)*jahrestag))));
	var sunrise = ((-1)*Math.acos((-1*Math.tan(declinationnow))*Math.tan(mathtoradians(latitude))));
	if (mathtoradians(latitude)<0){
		if (isNaN(sunrise)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunrise = sunrise;
	} else {
		sunrise = ((-1)*Math.PI);
	}
	}
	} else {
		if (isNaN(sunrise)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunrise = ((-1)*Math.PI);
	} else {
		sunrise = sunrise;
	}
	}	
	}
	var sunset = Math.acos((-1*Math.tan(declinationnow))*Math.tan(mathtoradians(latitude)));
	//console.log(sunset);
	if (mathtoradians(latitude)<0){
		if (isNaN(sunset)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunset = sunset;
	} else {
		sunset = Math.PI;
	}
	}
	} else {
		if (isNaN(sunset)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunset = Math.PI;
	} else {
		sunset = sunset;
	}
	}	
	}
	//console.log("Am "+ jahrestag + " sunrise um " + sunrise+" und sunset um "+ sunset);
	//console.log("Am "+ jahrestag + " declination " + declinationnow +" und irradiancenow " + irradiancenow);
	for (var tagesstunde=0;tagesstunde<=23;tagesstunde++){
		clearskyhourly[jahrestag][tagesstunde]=0;
		sunaltitudehourly[jahrestag][tagesstunde]=0;
		sunazimuthhourly[jahrestag][tagesstunde]=0;
		cosdetahourly[jahrestag][tagesstunde]=0;
		var houranglenow = zeitzuangle(tagesstunde);
		var sunaltitude = Math.asin(((Math.sin(declinationnow)*Math.sin(mathtoradians(latitude)))+(Math.cos(declinationnow)*Math.cos(houranglenow)*Math.cos(mathtoradians(latitude)))));
		var azitemp = Math.acos(((Math.sin(declinationnow)*Math.cos(mathtoradians(latitude)))-(Math.cos(declinationnow)*Math.cos(houranglenow)*Math.sin(mathtoradians(latitude))))/Math.cos(sunaltitude));
		var sunazimutnow;
				if(latitude<0){
		if (Math.sin(houranglenow)==0){
			sunazimutnow=0;	
			}
		else if (Math.sin(houranglenow)>0){
				sunazimutnow=azitemp;
		} else {
		sunazimutnow=(2*Math.PI)-azitemp;
		}}else{
			if (Math.sin(houranglenow)==0){
				sunazimutnow=Math.PI;
			} else if (Math.sin(houranglenow)>0){
			sunazimutnow=(2*Math.PI)-azitemp;
		} else {
			sunazimutnow=azitemp;
		}
			
		}
		var cosdeta = Math.round10(((Math.sin(sunaltitude)*Math.cos(tiltrad))+(Math.cos(sunaltitude)*Math.sin(tiltrad)*Math.cos(moduleazirad-sunazimutnow))), -6);
		cosdetahourly[jahrestag][tagesstunde]=Math.round10(((Math.sin(sunaltitude)*Math.cos(tiltrad))+(Math.cos(sunaltitude)*Math.sin(tiltrad)*Math.cos(moduleazirad-sunazimutnow))), -6);
		sunazimuthhourly[jahrestag][tagesstunde]=Math.round10(sunazimutnow, -2);
		sunaltitudehourly[jahrestag][tagesstunde]=Math.round10(sunaltitude, -2);
		//console.log("part 1 "+(Math.sin(sunaltitude)*Math.cos(tiltrad))+" part2 "+(Math.cos(sunaltitude)*Math.sin(tiltrad)*Math.cos(moduleazirad-sunazimutnow))+" und des noamal"+Math.cos(moduleazirad-sunazimutnow));
		//console.log("part 3 "+Math.sin(sunaltitude)+" part2 "+Math.cos(tiltrad)+" und des noamal "+Math.cos(sunaltitude)+" und "+Math.sin(tiltrad));
		//console.log("moduleazi "+moduleazirad+ " houranglenow " + houranglenow+ " sunaltitude "+sunaltitude+ " sunazimutnow "+sunazimutnow+" cosdeta "+cosdeta);
		if(cosdeta>=0){
			if(sunrise<=houranglenow && houranglenow<=sunset){
				clearskyhourly[jahrestag][tagesstunde]+=Math.round10((cosdeta*irradiancenow), -4);
				//console.log(month +" month und cosdeta "+cosdeta);
				clearskydaily[jahrestag] += Math.round10(((cosdeta*irradiancenow)), -2);
				clearskymonthly[month]+= Math.round10(((cosdeta*irradiancenow)), -2);
				summe +=(cosdeta*irradiancenow); //in Wh pro zeitspanne

				//console.log("Die clearStrahlung am "+jahrestag+"."+month+" um "+tagesstunde+ " " +houranglenow+" hourangle, beträgt "+clearskyhourly[jahrestag][tagesstunde]+ " tilt = "+tilt+"und cosdeta "+ cosdeta+ " sunaltitude "+sunaltitude+" azitemp "+azitemp+" sunazimutnow" +sunazimutnow);
			
			}
		}
	}
}
resultscsv[0] = cosdetahourly;
resultscsv[1] = sunazimuthhourly;
resultscsv[2] = sunaltitudehourly;
resultscsv[3] = clearskyhourly;
resultscsv[4] = clearskydaily;
resultscsv[5] = clearskymonthly;
resultscsv[6] = summe;
return (resultscsv);
}

function RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower, sunblock){
	    if (sunblock === undefined) {
          sunblock = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
	//console.log(realskyaverage);
	var moduleazirad = mathtoradians(moduleazi);
	var tiltrad = mathtoradians(tilt);
	var outerazi = (moduleazirad - (Math.PI/2));
	//console.log(latitude + " =latitude " + moduleazi + " =moduleazi " +tilt+ " =tilt");
	// declare objects properly and clean in the right scope
	var resultscsv = new Array (4);
	var realskymonthly= new Array(13);
	for (var i=0; i<13; i++){
		realskymonthly[i]= 0;
	}
	var realskyhourly= new Array(366);
	for (var i=0; i<366; i++){
	realskyhourly[i]= new Array(24);
	}
	var realskydaily= new Array(366);
	var realsumme =0;
	var clearsky = ClearskyValue(latitude, 0, moduleazi);
	var clearskymonthlyhorizontal= clearsky[5]
	//console.log(clearskymonthlyhorizontal);
	
	for (var jahrestag=1; jahrestag<=365;jahrestag++){
	realskydaily[jahrestag]=0;
	var month=jahrestagzumonat(jahrestag);
	var slotfinder=(month-1);
	var monatstage=monatzumonatstage(month);
	var skyfactor = (realskyaverage[slotfinder]*1000)/(clearskymonthlyhorizontal[month]/monatstage);
	//console.log("im " +month+ "ten Monat realskyaverage "+ realskyaverage[slotfinder]+ " clearskymonthly "+ clearskymonthlyhorizontal[month]+ " skyfactor "+ skyfactor);
	var declinationnow = declination(jahrestag);
	var irradiancenow= irradiance*(1+(0.034*Math.cos((mathtoradians(360/365.25)*jahrestag))));
	var sunrise = (-1)*Math.acos((-1*Math.tan(declinationnow))*Math.tan(mathtoradians(latitude)));
	if (mathtoradians(latitude)<0){
		if (isNaN(sunrise)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunrise = sunrise;
	} else {
		sunrise = ((-1)*Math.PI);
	}
	}
	} else {
		if (isNaN(sunrise)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunrise = ((-1)*Math.PI);
	} else {
		sunrise = sunrise;
	}
	}	
	}
	var sunset = Math.acos((-1*Math.tan(declinationnow))*Math.tan(mathtoradians(latitude)));
	if (mathtoradians(latitude)<0){
		if (isNaN(sunset)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunset = sunset;
	} else {
		sunset = Math.PI;
	}
	}
	} else {
		if (isNaN(sunset)){
			if ((82<jahrestag) && (jahrestag<264)){
		sunset = Math.PI;
	} else {
		sunset = sunset;
	}
	}	
	}
	//console.log("Am "+ jahrestag + " sunrise um " + sunrise+" und sunset um "+ sunset);
	//console.log("Am "+ jahrestag + " declination " + declinationnow);
	for (var tagesstunde=0;tagesstunde<=23;tagesstunde++){
		realskyhourly[jahrestag][tagesstunde]=0;
		var houranglenow = zeitzuangle(tagesstunde);
		var sunaltitude = Math.asin(((Math.sin(declinationnow)*Math.sin(mathtoradians(latitude)))+(Math.cos(declinationnow)*Math.cos(houranglenow)*Math.cos(mathtoradians(latitude)))));
		var azitemp = Math.acos(((Math.sin(declinationnow)*Math.cos(mathtoradians(latitude)))-(Math.cos(declinationnow)*Math.cos(houranglenow)*Math.sin(mathtoradians(latitude))))/Math.cos(sunaltitude));
		var sunazimutnow;
		if(latitude<0){
		if (Math.sin(houranglenow)==0){
			sunazimutnow=0;	
			}
		else if (Math.sin(houranglenow)>0){
				sunazimutnow=azitemp;
		} else {
		sunazimutnow=(2*Math.PI)-azitemp;
		}}else{
			if (Math.sin(houranglenow)==0){
				sunazimutnow=Math.PI;
			} else if (Math.sin(houranglenow)>0){
			sunazimutnow=(2*Math.PI)-azitemp;
		} else {
			sunazimutnow=azitemp;
		}
			
		}
		var cosdeta = Math.round10(((Math.sin(sunaltitude)*Math.cos(tiltrad))+(Math.cos(sunaltitude)*Math.sin(tiltrad)*Math.cos(moduleazirad-sunazimutnow))), -6);
		if(cosdeta>=0 && mathtoradians(sunblock[tagesstunde])<=sunaltitude){
				if(sunrise<=houranglenow && houranglenow<=sunset){
					realskyhourly[jahrestag][tagesstunde]=Math.round10((cosdeta*irradiancenow*skyfactor*effizienzreel*ratedpower/1000), -4);
					realsumme +=(cosdeta*irradiancenow*ratedpower*effizienzreel*skyfactor/1000);
					realskydaily[jahrestag] += Math.round10((cosdeta*irradiancenow*effizienzreel*ratedpower*skyfactor/1000), -2);
					realskymonthly[month] += Math.round10((cosdeta*irradiancenow*effizienzreel*ratedpower*skyfactor/1000), -4);
				//console.log("Die realStrahlung am "+jahrestag+"."+month+" um "+tagesstunde+" beträgt "+realskyhourly[jahrestag][tagesstunde]+" tilt = "+tilt+" und cosdeta "+ cosdeta+ " sunaltitude "+sunaltitude+" azitemp "+azitemp+" sunazimutnow" +sunazimutnow);
				//console.log(" um "+tagesstunde+" realskyhourly " +realskyhourly[jahrestag][tagesstunde]+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskyhourly[jahrestag][tagesstunde]+ " aber ist "+(realskyhourly[jahrestag][tagesstunde]/(skyfactor*effizienzreel)));
				}
			}
		}
	//console.log("realskymonthly " +realskymonthly[month]+" am "+jahrestag+"."+month+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskymonthly[month]+ " aber ist "+(realskymonthly[month]/(effizienzreel*ratedpower*skyfactor/1000)));
	//console.log("realskydaily " +realskydaily[jahrestag]+" am "+jahrestag+"."+month+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskydaily[jahrestag]+ " aber ist "+(realskydaily[jahrestag]/(effizienzreel*ratedpower*skyfactor/1000)));
}
resultscsv[0] = realskyhourly;
resultscsv[1] = realsumme;
resultscsv[2] = realskydaily;
resultscsv[3] = realskymonthly;
return (resultscsv);
}


function getpeakcycle(whpercycle, latitude, realskyaverage, tilt, moduleazi, ratedpower, sunblock){
		var realskyvalue= RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower, sunblock);
		var realsumme = realskyvalue[1];
	var maxcycles = Math.floor(realsumme/(whpercycle*365));
	return (maxcycles);
}

function CycleCounter(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, whpercycle, app, anfang, ende, sunblock, showcase) {
	//für 3tages forcast
	if (showcase === undefined) {showcase=1;}
//var cycletime = whpercycle/verbraucher // time per cycle in hours
//batterysize = crate(batterysize, verbraucher); zu komplex mit mehreren verbrauchern. außerderm laden mit sonne stimmt dann auch nicht
//console.log("batterysize = "+(batterysize)+ " Wh am: "+anfang);
var batterystatus= new Array(366);
for (var i=0; i<366; i++){
	batterystatus[i]= new Array(24);
	for (var j=0; j<25; j++){
		batterystatus[i][j]=0;
	}
}
var solarautarkie=0;
var peakcycle = [];
var basecycle= new Array(366);
var increase;
var cyclecounter=0;
var cyclecounter2=0;
//get cycles with realsky
var realskyvalue = RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower, sunblock);
var realsky = realskyvalue[0];
for (var k = 0; k<24; k++){
realsky[(anfang+2)][k] = (realsky[(anfang+2)][k]/(showcase));
}
var realskydaily=realskyvalue[2]
	for (var jahrestag=anfang; jahrestag<=ende;jahrestag++){
		var month=jahrestagzumonat(jahrestag);
		for (var tagesstunde=0;tagesstunde<=23;tagesstunde++){
		var	output= app[tagesstunde];
		if (output==NaN){
			console.log("output NaN punkt statt komma bei dezimalstelle");
		}
			switch(tagesstunde){
			case 0:
			if (jahrestag==anfang){
				batterystatus[jahrestag][tagesstunde]=batterysize*0.8;
			}else{
				if ((((batterystatus[jahrestag-1][23]+realsky[jahrestag-1][23])-output)/batterysize)>0.99){
			//console.log("batterystatus um "+(23)+" am "+(jahrestag-1)+"= " +batterystatus[jahrestag-1][23]+" realsky " +realsky[jahrestag-1][23]+ " output = "+output);
				var decrease= (realsky[jahrestag-1][23]>output)? 0:(output-realsky[jahrestag-1][23]);
				batterystatus[jahrestag][tagesstunde]=Math.round10(((batterysize*0.99)-decrease), -2);
						if (output>0){
							cyclecounter1 +=1;
							//console.log("cyclecounter "+cyclecounter);
						}
			}
			else{
				if (((batterystatus[jahrestag-1][23]+realsky[jahrestag-1][23]-output)/batterysize)>(0.10)){
			//console.log("batterystatus um "+(23)+" am "+(jahrestag-1)+"= " +batterystatus[jahrestag-1][23]+" realsky " +realsky[jahrestag-1][23]+ " output = "+output);
					increase = realsky[jahrestag-1][23]-output;
						if (output>0){
							cyclecounter +=1;
							//console.log("cyclecounter "+cyclecounter);
						}
				}
					else{
						increase = realsky[jahrestag-1][23];
						if (output>0){
							cyclecounter2 +=1;
							//console.log("cyclecounter2 "+cyclecounter2);
						}
					}
				batterystatus[jahrestag][tagesstunde]=Math.round10((batterystatus[jahrestag-1][23]+increase), -2);
			}
			}
			break;
			default:
			if ((((batterystatus[jahrestag][tagesstunde-1]+realsky[jahrestag][tagesstunde-1])-output)/batterysize)>0.99){
	//console.log("batterystatus um "+(tagesstunde-1)+" am "+(jahrestag-0)+"= " +batterystatus[jahrestag][tagesstunde-1]+" realsky " +realsky[jahrestag][tagesstunde-1]+ " output = "+output);
			decrease= (realsky[jahrestag][tagesstunde-1]>output)? 0:(output-realsky[jahrestag][tagesstunde-1]);
				batterystatus[jahrestag][tagesstunde]=Math.round10(((batterysize*0.99)-decrease), -2);
				if (output>0){
							cyclecounter +=1;
						//console.log("cyclecounter "+cyclecounter);
						}
			}
			else{
				if (((batterystatus[jahrestag][tagesstunde-1]+realsky[jahrestag][tagesstunde-1]-output)/batterysize)>(0.10)){
	//console.log("batterystatus um "+(tagesstunde-1)+" am "+(jahrestag-0)+"= " +batterystatus[jahrestag][tagesstunde-1]+" realsky " +realsky[jahrestag][tagesstunde-1]+ " output = "+output);				increase = realsky[jahrestag][tagesstunde-1]-output;
				increase = realsky[jahrestag][tagesstunde-1]-output;
					if (output>0){
							cyclecounter +=1;
							//console.log("cyclecounter "+cyclecounter);
						}
				}
					else{
						increase = realsky[jahrestag][tagesstunde-1];
	//console.log("batterystatus um "+(tagesstunde-1)+" am "+(jahrestag-0)+"= " +batterystatus[jahrestag][tagesstunde-1]+" realsky " +realsky[jahrestag][tagesstunde-1]+ " output = "+output);
						if (output>0){
							cyclecounter2 +=1;
							//console.log("cyclecounter2 "+cyclecounter2);
						}

					}
				batterystatus[jahrestag][tagesstunde]=Math.round10((batterystatus[jahrestag][tagesstunde-1]+increase), -2);
			}
			}
			//console.log("Der Batteriestatus am "+jahrestag+"."+month+" um "+tagesstunde+" beträgt "+(batterystatus[jahrestag][tagesstunde]));
			}
		peakcycle[jahrestag] = (realskydaily[jahrestag]/whpercycle);
		basecycle[jahrestag] = cyclecounter - basecycle[jahrestag-1];
		}
	var basecycleyearly = Math.floor(cyclecounter/ende);
	solarautarkie = cyclecounter/(cyclecounter+cyclecounter2);
	var resultscsv = new Array (5);
	resultscsv[0] = peakcycle;
	resultscsv[1] = basecycle;
	resultscsv[2] = solarautarkie;
	resultscsv[3] = batterystatus;
	resultscsv[4] = realsky;
return (resultscsv);
}

function getzombiemode(batterysize, app){

var hourcounter =0;
//batterysize = crate(batterysize,verbraucher);
var batterystatus= new Array(366);
for (var i=0; i<366; i++){
	batterystatus[i]= new Array(24);
}
jahresablauf:
for (var jahrestag=40; jahrestag<=365;jahrestag++){
	var month=jahrestagzumonat(jahrestag);
	for (var tagesstunde=0;tagesstunde<=23;tagesstunde++){
		hourcounter +=1;
	var	output= app[tagesstunde];
		batterystatus[jahrestag][tagesstunde]=0;
		switch(tagesstunde){
		case 0:
		if (jahrestag==40){
			batterystatus[jahrestag][tagesstunde]=batterysize;
		}else{
			if (((batterystatus[jahrestag-1][23]-output)/batterysize)>(0.10)){
				batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag-1][23]-output;
			}
				else{
						break jahresablauf;
						//console.log("cas 0 break");
				}
		}
		break;
		default:
								//console.log(tagesstunde);
								//console.log(((batterystatus[jahrestag][tagesstunde-1]-output)/batterysize));
			if (((batterystatus[jahrestag][tagesstunde-1]-output)/batterysize)>(0.10)){
					
					batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag][tagesstunde-1]-output;
			}
				else{
											//console.log("default break");
						break jahresablauf;
				}
		}
				//console.log("Der Batteriestatus am "+jahrestag+"."+month+" um "+tagesstunde+" beträgt "+(batterystatus[jahrestag][tagesstunde]/batterysize*100));
	}
}
	return(hourcounter);
}

function getbatterychargetime(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, sunblock){
var increase;
var hourcounter=0;
var batterystatus= new Array(366);
for (var i=0; i<366; i++){
	batterystatus[i]= new Array(24);
}
for (var i=0; i<366; i++){
	for (var b=0; b<24; b++){
				batterystatus[i][b]=0;
	}
}
var solmateday=getsolmateday();
//console.log("day "+ solmateday+" hour "+solmatehour);
//get cycles with realsky
var realskyvalue = RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower, sunblock);
var realsky = realskyvalue[0];
if (solmateday > 350){
	solmateday = 1;
}
ende = (solmateday+10);
jahresablauf:
for (var jahrestag=solmateday; jahrestag<=ende;jahrestag++){
	for (var tagesstunde=0;tagesstunde<=23;tagesstunde++){
/*if (tagesstunde < anfangsstunde){
	console.log("skip until anfangstunde");
}else{*/	
		switch(tagesstunde){
		case 0:
		if (jahrestag==solmateday && tagesstunde==solmatehour){
			batterystatus[jahrestag][tagesstunde]=batterysize*0;
			hourcounter=0;			
		}else{
			if (batterystatus[jahrestag-1][23]> batterysize){
						break jahresablauf;
		}
		else{
					increase = realsky[jahrestag-1][23];
				}
			batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag-1][23]+increase;
					if (increase>0){
						hourcounter+=1;
					}
		}
		break;
		default:
		if (jahrestag==solmateday && tagesstunde==solmatehour){
			batterystatus[jahrestag][tagesstunde]=batterysize*0;
			hourcounter=0;
		}else{
		if (batterystatus[jahrestag][tagesstunde-1]> batterysize){
						break jahresablauf;
		}
		else{
					increase = realsky[jahrestag][tagesstunde];
					//console.log(realsky[jahrestag][tagesstunde]);
				}
			batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag][tagesstunde-1]+increase;
					if (increase>0){
						hourcounter+=1;
					}
		}
			}
		//console.log("Der Batteriestatus am "+jahrestag+" um "+tagesstunde+" beträgt "+batterystatus[jahrestag][tagesstunde]);
		}
}
return(hourcounter);
}
//C:\Users\Serles\Downloads\>"C:\Program Files\Java\jdk1.8.0_121\bin\javac" "C:\Users\Serles\Downloads\ClearskyValue.java"