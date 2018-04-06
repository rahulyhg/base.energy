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
var batterysize;
var verbraucher;
function crate(batterysize, verbraucher){
	
	var crate = verbraucher/batterysize;
	//console.log("crate "+crate+ " batterysize vor crate "+ batterysize	);
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
return batterysize;
}
var batterystatus= new Array(366);
for (var i=0; i<366; i++){
	batterystatus[i]= new Array(24);
}
var clearskyhourly= new Array(366);
for (var i=0; i<366; i++){
	clearskyhourly[i]= new Array(24);
}
var nosun= new Array(13);
for (var i=0; i<13; i++){
	nosun[i]= 0;
}
var realskydaily= new Array(366);
var clearskydaily= new Array(366);
var clearskymonthlyhorizontal= new Array(13);
var clearskymonthly= new Array(13);
var realskymonthly= new Array(13);
var skyfacmonthly= new Array(13);
var realskyhourly= new Array(366);
var cosdetahourly= new Array(366);
var sunazimuthhourly= new Array(366);
var sunaltitudehourly= new Array(366);

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
var anfang = 1;
var ende = 365;
var tagesstunde;
var jahrestag;
var einheitenfactor=1; //1000 für kWh
var irradiance = 1367;                         //W/m2
var effizienzreel = 0.75;
var realsumme;
var solarautarkie;
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var solmateday = Math.floor(diff / oneDay);
var solmatehour = now.getHours();
for (var i=0; i<13; i++){
	realskymonthly[i]= 0;
}
for (var i=0; i<13; i++){
	skyfacmonthly[i]= 0;
}
function ClearskyValue(latitude, tilt, moduleazi){
	moduleazirad = mathtoradians(moduleazi);
//console.log(latitude + " =latitude " + moduleazi + " =moduleazi " +tilt+ " =tilt");
	tilt = mathtoradians(tilt);
	for (var i=0; i<13; i++){
	clearskymonthly[i]= 0;
}
	var summe=0;
	for (jahrestag=1; jahrestag<=365;jahrestag++){
	clearskydaily[jahrestag]=0;
	var month=jahrestagzumonat(jahrestag);
	var declinationnow = declination(jahrestag);
	var irradiancenow= irradiance*(1+(0.034*Math.cos((mathtoradians(360/365.25)*jahrestag))))/einheitenfactor;
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
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
		clearskyhourly[jahrestag][tagesstunde]=0;
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
		var cosdeta = Math.round10(((Math.sin(sunaltitude)*Math.cos(tilt))+(Math.cos(sunaltitude)*Math.sin(tilt)*Math.cos(moduleazirad-sunazimutnow))), -6);
			//	console.log("part 1 "+(Math.sin(sunaltitude)*Math.cos(tilt))+" part2 "+(Math.cos(sunaltitude)*Math.sin(tilt)*Math.cos(moduleazirad-sunazimutnow))+" und des noamal"+Math.cos(moduleazirad-sunazimutnow));
				//console.log("part 3 "+Math.sin(sunaltitude)+" part2 "+Math.cos(tilt)+" und des noamal "+Math.cos(sunaltitude)+" und "+Math.sin(tilt));
		//console.log("moduleazi "+moduleazirad+ " houranglenow " + houranglenow+ " sunaltitude "+sunaltitude+ " sunazimutnow "+sunazimutnow+" cosdeta "+cosdeta);
		if(cosdeta>=0){
			if(sunrise<=houranglenow && houranglenow<=sunset){
				clearskyhourly[jahrestag][tagesstunde]+=Math.round10((cosdeta*irradiancenow), -4);
				//console.log(month +" month und cosdeta "+cosdeta);
				clearskydaily[jahrestag] += Math.round10(((cosdeta*irradiancenow)), -2);
			clearskymonthly[month]=Math.round10(((clearskymonthly[month]+(cosdeta*irradiancenow))), -4);
				summe +=(cosdeta*irradiancenow); //in Wh pro zeitspanne
				if ((82==jahrestag) && (tagesstunde==9)){	
				//console.log("Die clearStrahlung am "+jahrestag+"."+month+" um "+tagesstunde+ " " +houranglenow+" hourangle, beträgt "+clearskyhourly[jahrestag][tagesstunde]+ " tilt = "+tilt+"und cosdeta "+ cosdeta+ " sunaltitude "+sunaltitude+" azitemp "+azitemp+" sunazimutnow" +sunazimutnow);
				}
			}
		}
	}
}
}
function getclearskydaily(latitude, tilt, moduleazi){
	ClearskyValue(latitude, tilt, moduleazi);
	return (clearskydaily);
}
function getclearskymonthly(latitude, tilt, moduleazi){
	ClearskyValue(latitude, tilt, moduleazi);
	return (clearskymonthly);
}
function getclearskymonthlyhorizontal(latitude, moduleazi){
	moduleazirad = mathtoradians(moduleazi);
//console.log(latitude + " =latitude " + moduleazi + " =moduleazi " +tilt+ " =tilt");
	tilt = 0;
	for (var i=0; i<13; i++){
	clearskymonthlyhorizontal[i]= 0;
}
	for (jahrestag=1; jahrestag<=365;jahrestag++){
	var month=jahrestagzumonat(jahrestag);
	var declinationnow = declination(jahrestag);
	var irradiancenow= irradiance*(1+(0.034*Math.cos((mathtoradians(360/365.25)*jahrestag))))/einheitenfactor;
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
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
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
		var cosdeta = Math.round10(((Math.sin(sunaltitude)*Math.cos(tilt))+(Math.cos(sunaltitude)*Math.sin(tilt)*Math.cos(moduleazirad-sunazimutnow))), -6);
			//	console.log("part 1 "+(Math.sin(sunaltitude)*Math.cos(tilt))+" part2 "+(Math.cos(sunaltitude)*Math.sin(tilt)*Math.cos(moduleazirad-sunazimutnow))+" und des noamal"+Math.cos(moduleazirad-sunazimutnow));
				//console.log("part 3 "+Math.sin(sunaltitude)+" part2 "+Math.cos(tilt)+" und des noamal "+Math.cos(sunaltitude)+" und "+Math.sin(tilt));
		//console.log("moduleazi "+moduleazirad+ " houranglenow " + houranglenow+ " sunaltitude "+sunaltitude+ " sunazimutnow "+sunazimutnow+" cosdeta "+cosdeta);
		if(cosdeta>=0){
			if(sunrise<=houranglenow && houranglenow<=sunset){
			clearskymonthlyhorizontal[month]+=Math.round10((cosdeta*irradiancenow), -4);
				if ((82==jahrestag) && (tagesstunde==9)){	
				//console.log("Die clearStrahlung am "+jahrestag+"."+month+" um "+tagesstunde+ " " +houranglenow+" hourangle, beträgt "+clearskyhourly[jahrestag][tagesstunde]+ " tilt = "+tilt+"und cosdeta "+ cosdeta+ " sunaltitude "+sunaltitude+" azitemp "+azitemp+" sunazimutnow" +sunazimutnow);
				}
			}
		}
	}
}

	return (clearskymonthlyhorizontal);
}
function RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	moduleazirad = mathtoradians(moduleazi);
	tiltrad = mathtoradians(tilt);
	//console.log(latitude + " =latitude " + moduleazi + " =moduleazi " +tilt+ " =tilt");
	var horizontal=0;
	for (var i=0; i<366; i++){
	realskyhourly[i]= new Array(24);
}
	for (var i=0; i<366; i++){
	cosdetahourly[i]= new Array(24);
}
	for (var i=0; i<366; i++){
	sunaltitudehourly[i]= new Array(24);
}
	for (var i=0; i<366; i++){
	sunazimuthhourly[i]= new Array(24);
}
	for (var i=0; i<13; i++){
	realskymonthly[i]= 0;
}
realsumme =0;
	var clearskymonthlyhorizontal = getclearskymonthlyhorizontal(latitude, moduleazi);
	//console.log(clearskymonthlyhorizontal);
	var clearskymonthly = getclearskymonthly(latitude, tilt, moduleazi);
	//console.log(clearskymonthlyhorizontal);
	for (var jahrestag=1; jahrestag<=365;jahrestag++){
	realskydaily[jahrestag]=0;
	var month=jahrestagzumonat(jahrestag);
	var slotfinder=(month-1);
	monatstage=monatzumonatstage(month);
	var skyfactor = (realskyaverage[slotfinder]*1000)/(clearskymonthlyhorizontal[month]/monatstage);
	skyfacmonthly[month]=skyfactor;
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
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
		realskyhourly[jahrestag][tagesstunde]=0;
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
				realskyhourly[jahrestag][tagesstunde]=Math.round10((cosdeta*irradiancenow*skyfactor*effizienzreel*ratedpower/1000), -4);
				realsumme +=(cosdeta*irradiancenow*ratedpower*effizienzreel*skyfactor/1000);
				realskydaily[jahrestag] += Math.round10((cosdeta*irradiancenow*effizienzreel*ratedpower*skyfactor/1000), -2);
				realskymonthly[month] += Math.round10((cosdeta*irradiancenow*effizienzreel*ratedpower*skyfactor/1000), -4);
			if ((82==jahrestag) && (tagesstunde>9)){	
			//console.log("Die realStrahlung am "+jahrestag+"."+month+" um "+tagesstunde+" beträgt "+realskyhourly[jahrestag][tagesstunde]+" tilt = "+tilt+" und cosdeta "+ cosdeta+ " sunaltitude "+sunaltitude+" azitemp "+azitemp+" sunazimutnow" +sunazimutnow);
			//console.log(" um "+tagesstunde+" realskyhourly " +realskyhourly[jahrestag][tagesstunde]+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskyhourly[jahrestag][tagesstunde]+ " aber ist "+(realskyhourly[jahrestag][tagesstunde]/(skyfactor*effizienzreel)));
			}
			}
		}
	}
	//console.log("realskymonthly " +realskymonthly[month]+" am "+jahrestag+"."+month+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskymonthly[month]+ " aber ist "+(realskymonthly[month]/(skyfactor*effizienzreel)));
	//console.log("realskydaily " +realskydaily[jahrestag]+" am "+jahrestag+"."+month+ " durch skyfac "+ skyfactor+ " sollte csv sein "+clearskydaily[jahrestag]+ " aber ist "+(realskydaily[jahrestag]/(skyfactor*effizienzreel)));
}
}
function getrealskydaily(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	//console.log(skyfacmonthly);
	return (realskydaily);
}
function getrealskyhourly(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	return (realskyhourly);
}
function getrealskymonthly(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	return (realskymonthly);
}
function getsunaltitudehourly(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	return (sunaltitudehourly);
}
function getsunazimuthhourly(latitude, realskyaverage, tilt, moduleazi, ratedpower){
	RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	return (sunazimuthhourly);
}
function CycleCounter(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, whpercycle, app, anfang, ende) {
var einheitenfactor=1; //1000 für kWh
verbraucher = verbraucher/einheitenfactor;
//var cycletime = whpercycle/verbraucher // time per cycle in hours
batterysize = crate(batterysize, verbraucher)/einheitenfactor;
//console.log("batterysize = "+(batterysize)+ " Wh")
var peakcycle = [];
var basecycle=[];
var increase;
var cyclecounter=0;
var cyclecounter2=0;
//get cycles with realsky
var realsky = getrealskyhourly(latitude, realskyaverage, tilt, moduleazi, ratedpower);
for (var jahrestag=anfang; jahrestag<=ende;jahrestag++){
	var month=jahrestagzumonat(jahrestag);
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
	var	output= verbraucher* app[tagesstunde];
	if (output==NaN){
		//console.log("output NaN punkt statt komma bei dezimalstelle");
	}
		batterystatus[jahrestag][tagesstunde]=0;
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
//console.log("batterystatus um "+(tagesstunde-1)+" am "+(jahrestag-0)+"= " +batterystatus[jahrestag][tagesstunde-1]+" realsky " +realsky[jahrestag][tagesstunde-1]+ " output = "+output);			var decrease= (realsky[jahrestag][tagesstunde-1]>output)? 0:(output-realsky[jahrestag][tagesstunde-1]);
		var decrease= (realsky[jahrestag][tagesstunde-1]>output)? 0:(output-realsky[jahrestag][tagesstunde-1]);
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
	//console.log("peakcycle am "+jahrestag+ " beträgt "+peakcycle[jahrestag]+" realsky "+realskydaily[jahrestag]);
	basecycle[jahrestag] = cyclecounter - basecycle[jahrestag-1];
	}
	var basecycleyearly = Math.floor(cyclecounter/ende);
	solarautarkie = cyclecounter/(cyclecounter+cyclecounter2);
}
function getpeakcycle(whpercycle, latitude, realskyaverage, tilt, moduleazi, ratedpower){
		RealskyValue(latitude, realskyaverage, tilt, moduleazi, ratedpower);
	var maxcycles = Math.floor(realsumme/(whpercycle*365));
	return (maxcycles);
}

function getbatterystatus(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, whpercycle, app, anfang, ende){
		CycleCounter(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, whpercycle, app, anfang, ende);
	return (batterystatus);
}
function getbasecyclesyearly(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, app, anfang, ende){
		CycleCounter(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, app, anfang, ende);
	return(basecycleyearly);
}
function getsolarautarkie(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, whpercycle, app, anfang, ende){
		CycleCounter(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize, verbraucher, whpercycle, app, anfang, ende);
	return(solarautarkie);
}
function getzombiemode(latitude, tilt, moduleazi, ratedpower, batterysize, verbraucher, app, anfang, ende){
var increase;
var daycounter =0;
batterysize = crate(batterysize,verbraucher)/einheitenfactor;
//get cycles with realsky
var realsky = getrealskyhourly(latitude, nosun, tilt, moduleazi, ratedpower);
	var month=jahrestagzumonat(jahrestag);
jahresablauf:
for (var jahrestag=anfang; jahrestag<=ende;jahrestag++){
			daycounter +=1;
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
	var	output= verbraucher*app[(tagesstunde+1)];
		batterystatus[jahrestag][tagesstunde]=0;
		switch(tagesstunde){
		case 0:
		if (jahrestag==anfang){
			batterystatus[jahrestag][tagesstunde]=batterysize;
		}else{
			if ((((batterystatus[jahrestag-1][23]+realsky[jahrestag-1][23])-output)/batterysize)>0.99){
			var decrease= (realsky[jahrestag-1][23]>output)? 0:(output-realsky[jahrestag-1][23]);
			batterystatus[jahrestag][tagesstunde]=(batterysize*0.99)-decrease;
		}
		else{
			if ((batterystatus[jahrestag-1][23]+realsky[jahrestag-1][23]-output)>(0.10)){
				increase = realsky[jahrestag-1][23]-output;
			}
				else{
					increase = realsky[jahrestag-1][23];
					if (output>0){
						break jahresablauf;
					}
				}
			batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag-1][23]+increase;
		}
		}
		break;
		default:
		if ((((batterystatus[jahrestag][tagesstunde-1]+realsky[jahrestag][tagesstunde-1])-output)/batterysize)>0.99){
			var decrease= (realsky[jahrestag][tagesstunde-1]>output)? 0:(output-realsky[jahrestag][tagesstunde-1]);
			batterystatus[jahrestag][tagesstunde]=(batterysize*0.99)-decrease;
			if (output>0){
					}
		}
		else{
			if ((batterystatus[jahrestag][tagesstunde-1]+realsky[jahrestag][tagesstunde-1]-output)>(0.10)){
				increase = realsky[jahrestag][tagesstunde-1]-output;
			}
				else{
					increase = realsky[jahrestag][tagesstunde-1];
						break jahresablauf;
				}
			batterystatus[jahrestag][tagesstunde]=batterystatus[jahrestag][tagesstunde-1]+increase;
		}
		}
		//console.log("Der Batteriestatus am "+jahrestag+"."+month+" um "+tagesstunde+" beträgt "+(batterystatus[jahrestag][tagesstunde]/batterysize*100));
		}
	}

	return(daycounter);
}

function getbatterychargetime(latitude, tilt, moduleazi, realskyaverage, ratedpower, batterysize){
var increase;
var hourcounter=0;
anfang=solmateday;
anfangsstunde=solmatehour;
for (var i=0; i<366; i++){
	for (var b=0; b<24; b++){
				batterystatus[i][b]=0;
	}
}
//console.log("day "+ solmateday+" hour "+solmatehour);
//get cycles with realsky
var realsky = getrealskyhourly(latitude, realskyaverage, tilt, moduleazi, ratedpower);
if (anfang > 350){
	anfang = 1;
}
ende = (anfang+60);
jahresablauf:
for (var jahrestag=anfang; jahrestag<=ende;jahrestag++){
	for (tagesstunde=0;tagesstunde<=23;tagesstunde++){
/*if (tagesstunde < anfangsstunde){
	console.log("skip until anfangstunde");
}else{*/	
		switch(tagesstunde){
		case 0:
		if (jahrestag==anfang && tagesstunde==anfangsstunde){
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
			//System.out.println("increase by " +increase);
		}
		break;
		default:
		if (jahrestag==anfang && tagesstunde==anfangsstunde){
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
			//System.out.println("increase by " +increase);
		}
			}
		//console.log("Der Batteriestatus am "+jahrestag+" um "+tagesstunde+" beträgt "+batterystatus[jahrestag][tagesstunde]);
		}
}
return(hourcounter);
}
//C:\Users\Serles\Downloads\>"C:\Program Files\Java\jdk1.8.0_121\bin\javac" "C:\Users\Serles\Downloads\ClearskyValue.java"