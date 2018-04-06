// base energy GmbH 2016, www.base.energy
// Estimate solar yield wizard

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// we support english and German
function loadLanguage() {
    var url = window.location.href;
	console.log (url);
	
	var patt = /base.energy\/de\//;
	console.log(patt);
	if(patt.test(url)) return "de";
	else return "en";
}


(function(){

// Angular
var app = angular.module('electroscope', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngMap']);
var path = '';
var apps = {};

/* RUN ON STARTUP
// Wordpress specific, to localize script (get local paths) */
app.run(['$window', function($window){
  // the following data is fetched from the JavaScript variables created by wp_localize_script(), and stored in the Angular rootScope
	if ($window.WordPressObject) {
		path = $window.WordPressObject.childThemeUrl + '/';
	}
	
	// hide parts of user interface onload.
	// don't show results unless user clicked on app
	jQuery("#results").hide();
	
	// load right appliances DB
	if (loadLanguage() == "de") apps = appliancesdb_de;
	else apps = appliancesdb;
	
}]);



// Fix
// https://github.com/angular/angular.js/issues/1521
// $location.search() not working when there is no hash
// dont forget to add a base ref see http://stackoverflow.com/questions/26654428/angularjs-location-search-not-working
app.config(function($locationProvider) {
	//$locationProvider.html5Mode(true);
});


// custom colors
// https://angular-md-color.com/#/
app.config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#ffd49a',
        '100': '#ffc981',
        '200': '#ffbf67',
        '300': '#ffb44e',
        '400': '#ffa934',
        '500': '#FF9E1B',
        '600': '#ff9301',
        '700': '#e78500',
        '800': '#cd7600',
        '900': '#b46700',
        'A100': '#ffdfb4',
        'A200': '#ffeacd',
        'A400': '#fff5e7',
        'A700': '#9a5900'
    };
    $mdThemingProvider
        .definePalette('customPrimary', 
                        customPrimary);

    var customAccent = {
        '50': '#7f0a13',
        '100': '#970c16',
        '200': '#ae0e1a',
        '300': '#c6101d',
        '400': '#de1121',
        '500': '#ed1b2b',
        '600': '#f14b57',
        '700': '#f3626d',
        '800': '#f57a83',
        '900': '#f69299',
        'A100': '#f14b57',
        'A200': '#EF3341',
        'A400': '#ed1b2b',
        'A700': '#f8a9af'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

    var customWarn = {
        '50': '#ffd49a',
        '100': '#ffc981',
        '200': '#ffbf67',
        '300': '#ffb44e',
        '400': '#ffa934',
        '500': '#FF9E1B',
        '600': '#ff9301',
        '700': '#e78500',
        '800': '#cd7600',
        '900': '#b46700',
        'A100': '#ffdfb4',
        'A200': '#ffeacd',
        'A400': '#fff5e7',
        'A700': '#9a5900'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    var customBackground = {
        '50': '#b075a0',
        '100': '#a76495',
        '200': '#9a5888',
        '300': '#894f7a',
        '400': '#79456b',
        '500': '#693C5D',
        '600': '#59334f',
        '700': '#492940',
        '800': '#382032',
        '900': '#281724',
        'A100': '#b985ab',
        'A200': '#c295b6',
        'A400': '#cca5c1',
        'A700': '#180e15'
    };
    $mdThemingProvider
        .definePalette('customBackground', 
                        customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       //.backgroundPalette('customBackground')
});

// Theme 
app.config(function($mdThemingProvider) {

/*
	$mdThemingProvider.theme('default')
		.primaryPalette('grey')
		.accentPalette('grey')
		.warnPalette('grey')
		.backgroundPalette('grey');7
*/	
});


// We want to fill the solmate object during the wizard
app.factory('solmate', ['$rootScope', '$http', function($rootScope, $http) {
	
	var _self = this;
	_self.solmate = {
		name: 'Simon',
		
		// google.maps.Place
		tilt: 0,
		azimuth: 180,
		lat: 47.2592454,
		lng: 11.414501100000052,
		googlePlaceId: "54df41f80244c051ef0c1add5c4f9dad720959c8",
		formatted_address: "Burgenlandstraße 43, 6020 Innsbruck, Austria",
		//solmate: "basic",
		battery: "small",
		color: "yellow",
		power: "basic",
		module: "small",
		ghi: [0,0,0,0,0,0,0,0,0,0,0,0],
		setLocation: setLocation,
		updating: false

	}

	function setLocation (lat, lng, formatted_address, googlePlaceId) {
		_self.solmate.lat = lat;
		_self.solmate.lng = lng;
		_self.solmate.formatted_address = formatted_address;
		_self.solmate.googlePlaceId = googlePlaceId;
		
		// when location changed, we need to get the new ghi for the new location
		getGhi(lat, lng);
	}
		
	function getGhi (lat, lng) {
		
		// prepare JSON request
		var json = {
				"lat": lat,
				"lng": lng
			};
			
		var config = {
			method: "POST",
			url: "https://base.energy/webservice/getGhi.php",
			data: json,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }			
		};
		
		_self.solmate.updating = true;
		$http(config).then(onSuccess, onFail);
		
		function onSuccess (response) {
			//console.log(response.data);
			console.log("SUCCESS!");
			_self.solmate.updating = false;
			//save GHI in solcuibe object
			// object looks like [jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec]
			// 12 int values in an array
			_self.solmate.ghi = response.data;
			$rootScope.$emit("locationChanged", null);
		}
		function onFail (response) {
			//_self.loading = false;
			_self.solmate.updating = false;
			console.log('ERROR saving module Settings');
		}		
	}
	
	return _self.solmate;
	
}]);


app.controller('locationController', ['$scope', '$q', 'solmate', 'NgMap', function($scope, $q, solmate, NgMap) {

	// get our solmate object
	$scope.solmate = solmate;

	// exposed
	var _self = this;
	_self.search = search;
	_self.select = select;
	_self.autoLocate = autoLocate;
	_self.toggleSearch = toggleSearch;
	_self.showSearchField = false;
	_self.searchText = '';
	_self.selectedItem = null;
	_self.initialize = initialize;


	// internal
	var map = null;
	var placeService = null;
	var autocompleteService = null;	

	// Did ngMaps Module do its job?
	NgMap.getMap().then(function(mapObject) {
		
		map = mapObject;
		placeService = new google.maps.places.PlacesService(map);
		autocompleteService = new google.maps.places.AutocompleteService();
		
	});
	
	// When electroscope is loaded without passing location data, take default data
	function initialize () {
		
		if (getParameterByName ("googlePlaceId")) {
			
			// save data that is helpful for us into our main object			
			solmate.setLocation(
				getParameterByName ("lat"),
				getParameterByName ("lng"),
				getParameterByName ("formatted_address"),
				getParameterByName ("googlePlaceId")
			);			
			
		}
		else {
			
			// if there are no incoming location parameters that provide settings, take default settings
			// The address is Ferdinands apartment in Innsbruck
			solmate.setLocation(
				47.2592454, 
				11.414501100000052, 
				"Burgenlandstraße 43, 6020 Innsbruck, Austria", 
				"54df41f80244c051ef0c1add5c4f9dad720959c8"
			);				
			
		}
		
		if (getParameterByName ("tilt"))
			solmate.tilt = getParameterByName ("tilt");

		if (getParameterByName ("azimuth"))
			solmate.azimuth = getParameterByName ("azimuth");		
		

	}
	
	// Only show search bar when users want to change it
	function toggleSearch () {
		_self.showSearchField = !_self.showSearchField;
		
		if (!_self.showSearchField) {
			_self.searchText = '';
			_self.selectedItem = null;	
			
		}	

	}
			
	// Got the Material Design Autocomplete from https://plnkr.co/edit/dITwTF?p=preview		
	function getResults (address) {
		var deferred = $q.defer();
		autocompleteService.getQueryPredictions(
			{
				input: address
			},
			function(data) {
				deferred.resolve(data);
			}
		);
		
		return deferred.promise;
	}

	function getDetails (place) {
		var deferred = $q.defer();
		placeService.getDetails(
			{
				'placeId': place.place_id
			}, 
			function(details) {
				deferred.resolve(details);
			}
		);
		
		return deferred.promise;
	}

	function search (input) {
		if (!input || !map || !autocompleteService) {
			return {};
		}
		
		return getResults(input).then(function(places) {
			return places;
		});
	}

	function select (place) {

		// did we get a google Place object from autocomplete selection? 
		if (place) {
		
			getDetails(place).then(function(details) {
				
				
				// get address data in a format that we can further use
				savePlaceDetails (details);			
				
				// after we got everything, make the search field disappear and empty search field
				_self.toggleSearch();	
				
			});
		
		}
		
		// user entered text into autocomplete field but did click on "search" instead of item,
		else if (!place && _self.searchText.length > 0)
		{
			getResults($scope.searchText).then(function(places) {
					select (places[0]);
			});
		}
		else {
			//console.log ('Autocomplete field is empty now');
		}
		
	}
	
	// https://developers.google.com/maps/documentation/javascript/geolocation
	function autoLocate () {
		
		
        if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {

				var pos = {
				  lat: position.coords.latitude,
				  lng: position.coords.longitude
				};				
				reverseGeoCode (pos);
				
			
          }, function() {
            handleLocationCallback(true, this, map.getCenter());
          });	  
		  
        } else {
          // Browser doesn't support Geolocation
          handleLocationCallback(false, this, map.getCenter());
		  alert('Your browser does not support autolocation');
        }		
		
	}
	
	function handleLocationCallback(browserHasGeolocation, infoWindow, pos) {
		//console.log ('browserHasGeolocation: ' + browserHasGeolocation);
      
	}
	
	function reverseGeoCode (pos)
	{
		if (!google || !google.maps) {
			throw new Error('Google Maps JS library is not loaded!');
		}
		
		var geocoder = new google.maps.Geocoder;

		geocoder.geocode({'location': pos}, function(results, status) {
			if (status === 'OK') {
				
				if (results[1]) {

					// get address data in a format that we can further use
					savePlaceDetails (results[1]);
					
					// after we got everything, make the search field disappear
					_self.toggleSearch();	
					
					
					//setAutoCompleteText(results[1].formatted_address);
				} 
				else {
					console.log('No results found');
				}
			} 
			else {
				console.log('Geocoder failed due to: ' + status);
			}
        });		
				
	}
	
	function savePlaceDetails (place) {
		
		if (place.geometry) {
			
			// save data that is helpful for us into our main object			
			solmate.setLocation(
				place.geometry.location.lat(), 
				place.geometry.location.lng(), 
				place.formatted_address, 
				place.id
			);
		}
		else 
			console.log('Expected googlePlaceObject');
		
		
	}
		
		
}]); // End LocationCtrl	



app.directive ('locationControl', function() {
    return {
        restrict: 'E',
        templateUrl: path + 'html/locationControl.html',
        controller: 'locationController',
		controllerAs: "location",
        link: function(scope,elem,attr,ctrl){
			
			ctrl.initialize ();
        }
    };
});	




app.controller ('appGridController', ['$scope', '$window', '$document', 'solmate', function($scope, $window, $document, solmate) {

	// get our solmate object
	$scope.solmate = solmate;

	var _self = this;
	
	var appsCopy = jQuery.extend(true, {}, apps);
	_self.appliances = appsCopy;
	_self.tiles = _self.appliances;
	_self.selectApp = selectApp;
	_self.selectedApp = -1; // can cause error if not found in the array _self.appliances
	
	
	// make sure, GridList refreshes, when location changes
	$scope.$on('locationChanged', function(event, args) {
		
		// skip on initial load cause not 	
		selectApp(_self.selectedApp);
	});
	
	function selectApp (app) {
		
		// try to skip on first load
		if (app == -1) return;
		
		_self.selectedApp = app;
		
		var appsCopy = jQuery.extend(true, {}, apps);
		_self.appliances = appsCopy;
		_self.tiles = _self.appliances; // reset colors to original bavkgrounds
		changeTileBackgrounds (app); // highlight selected tile grey others
		_self.tiles = _self.appliances; // refresh gridlist with new background
		
		// reveal invisible results after app was clicked
		jQuery("#results").show();		

		jQuery('html, body').animate({
			scrollTop: jQuery("#results").offset().top
		}, 500);
		
		// basic info on selected app
		jQuery("#appIcon").attr("src", _self.appliances[app].icon);
		jQuery("#appName").text(_self.appliances[app].name);
		jQuery("#appLocation").text(solmate.formatted_address);
		jQuery("#appPower").text(_self.appliances[app].power);
		jQuery("#appWhPerCycle").text(_self.appliances[app].WhPerCycle);
		jQuery("#appUnit").text(_self.appliances[app].unit);
		
		// solCubes cycles on full charge	
		jQuery("#cyclesOnFullChargeBasic").text(getCyclesFullCharge(getSolCubeCfg("basic"), _self.appliances[app]) + " " + _self.appliances[app].unit);
		jQuery("#cyclesOnFullChargeStandard").text(getCyclesFullCharge(getSolCubeCfg("standard")	, _self.appliances[app]) + " " + _self.appliances[app].unit);
		jQuery("#cyclesOnFullChargePro").text(getCyclesFullCharge(getSolCubeCfg("pro"), _self.appliances[app]) + " " + _self.appliances[app].unit);
		jQuery("#cyclesOnFullChargeUltra").text(getCyclesFullCharge(getSolCubeCfg("ultra"), _self.appliances[app]) + " " + _self.appliances[app].unit);
		
		// module max cycles
		jQuery("#maxCyclesSmall").text("+" + getpeakcycle(_self.appliances[app].WhPerCycle, solmate.lat, solmate.ghi, solmate.tilt, solmate.azimuth, 50) + " " + _self.appliances[app].unit);
		jQuery("#maxCyclesMedium").text("+" + getpeakcycle(_self.appliances[app].WhPerCycle, solmate.lat, solmate.ghi, solmate.tilt, solmate.azimuth, 100) + " " + _self.appliances[app].unit);
		jQuery("#maxCycles2Medium").text("+" + getpeakcycle(_self.appliances[app].WhPerCycle, solmate.lat, solmate.ghi, solmate.tilt, solmate.azimuth, 200) + " " + _self.appliances[app].unit);
		jQuery("#maxCycles2Large").text("+" + getpeakcycle(_self.appliances[app].WhPerCycle, solmate.lat, solmate.ghi, solmate.tilt, solmate.azimuth, 300) + " " + _self.appliances[app].unit);
		
		//
		// Charging time
		//
		//Small module
		jQuery("#ChargeTimeSmallBasic").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 50, getSolCubeCfg("basic").battery));
		jQuery("#ChargeTimeSmallStandard").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 50, getSolCubeCfg("standard").battery));
		jQuery("#ChargeTimeSmallPro").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 50, getSolCubeCfg("pro").battery));		
		jQuery("#ChargeTimeSmallUltra").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 50, getSolCubeCfg("ultra").battery));

		// medium module
		jQuery("#ChargeTimeMediumBasic").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 100, getSolCubeCfg("basic").battery));
		jQuery("#ChargeTimeMediumStandard").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 100, getSolCubeCfg("standard").battery));
		jQuery("#ChargeTimeMediumPro").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 100, getSolCubeCfg("pro").battery));		
		jQuery("#ChargeTimeMediumUltra").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 100, getSolCubeCfg("ultra").battery));

		// 2 x medium
		jQuery("#ChargeTime2xMediumBasic").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 200, getSolCubeCfg("basic").battery));
		jQuery("#ChargeTime2xMediumStandard").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 200, getSolCubeCfg("standard").battery));
		jQuery("#ChargeTime2xMediumPro").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 200, getSolCubeCfg("pro").battery));		
		jQuery("#ChargeTime2xMediumUltra").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 200, getSolCubeCfg("ultra").battery));


		// 2 x Large
		jQuery("#ChargeTime2xLargeBasic").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 300, getSolCubeCfg("basic").battery));
		jQuery("#ChargeTime2xLargeStandard").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 300, getSolCubeCfg("standard").battery));
		jQuery("#ChargeTime2xLargePro").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 300, getSolCubeCfg("pro").battery));		
		jQuery("#ChargeTime2xLargeUltra").text(getbatterychargetime(solmate.lat, solmate.tilt, solmate.azimuth, solmate.ghi, 300, getSolCubeCfg("ultra").battery));
		
		
	}
	
	function getSolCubeCfg (cfg) {
		
		var solcubes = {
			basic: {
				power: 200,
				battery: 192
			},
			standard: {
				power: 200,
				battery: 237
			},
			pro: {
				power: 1000,
				battery: 237
			},
			ultra: {
				power: 1000,
				battery: 712
			}			
		}
		
		return solcubes[cfg];
	}
	
	
	
	function getCyclesFullCharge (solcube, app) {
		
		// first, let's find out, if SolCube power is enough to power the app
		if (solcube.power < app.power)
			return "X";
		
		else
			return Math.round(solcube.battery*1 / app.WhPerCycle*1);
	}

		// changeTileBackgrounds - highlights selected app and greys the others
	function changeTileBackgrounds (appNo) {
		
		for (var i = 0; i < Object.keys(_self.appliances).length; i++) {		
			var app = _self.appliances[i];
			
			if (appNo != i) {
				_self.appliances[i].background = "grey";
			}
		} // end for
		
		return;
	}

}]);

app.directive ('appliancesGridList', function() {
    return {
        restrict: 'E',
        templateUrl: path + 'html/appliancesGridList.html',
        controller: 'appGridController',
		controllerAs: 'appGrid',
        link: function(scope,elem,attr,ctrl){
			
			// nothing to do
			
        }
    };
});


})();