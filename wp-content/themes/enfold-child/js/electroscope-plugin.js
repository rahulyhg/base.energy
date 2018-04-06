// base energy GmbH 2016, www.base.energy
var pageLanguage = "en";
function loadLanguage() {
    var url = window.location.href;
	console.log (url);
	
	var patt = /base.energy\/de\//;
	console.log(patt);
	if(patt.test(url)) pageLanguage = "de";
	else pageLanguage="en";
}
loadLanguage();

// Used code sample:
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform?hl=de
var autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', getPlaceDetails);
  

// currently I am afraid of autolocate cause it shows popup to the user
//geolocate(); 
  
// [START region_fillform]
function getPlaceDetails() {
	
	// these input field ids must exist on the screen
	// see address components
	// https://developers.google.com/maps/documentation/geocoding/intro?hl=de
	/*
	var componentForm = {
		street_number: 'short_name',				// Street No
		route: 'long_name', 						// Street name
		locality: 'long_name',						// City
		administrative_area_level_1: 'short_name',	// Area
		country: 'short_name',						// Country
		postal_code: 'short_name'					// Post Code
	};*/
	
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();



	// Get each component of the address from the place details
	/* and fill the corresponding field on the form.
	for (var component in componentForm) {
		document.getElementById(component).value = '';
		document.getElementById(component).disabled = false;
	}
	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			document.getElementById(addressType).value = val;
		}
	}*/
	
	// formatted address
	document.getElementById('formatted_address').value = place.formatted_address;
  
	// In addition fetch GPS Coordinates
	document.getElementById('lat').value = place.geometry.location.lat();
	document.getElementById('lng').value = place.geometry.location.lng();
	
	// for later reference lets keep id
	document.getElementById('googlePlaceId').value = place.id;

	// The problem is, that when users start typing into location search
	// but do not pick anything out from the list, we need to handle that.
	// Therefore we show submit button and set form action after something was selected
	document.getElementById('escopeSubmit').style.visibility = "visible";
	
	if (pageLanguage == "de") {
		document.getElementById('locationsearch').action = "https://base.energy/de/solcube/solarrechner";
	}
	else
		document.getElementById('locationsearch').action = "https://base.energy/solcube/assistant";
	
	document.getElementById('locationsearch').setAttribute('target', '_blank');
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]

function selectLocation()
{
	var place = autocomplete.getPlace();
	console.log(place);
}
