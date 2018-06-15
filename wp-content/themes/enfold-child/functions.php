<?php

/*
* Add your own functions here. You can also copy some of the theme functions into this file. 
* Wordpress will use those functions instead of the original functions then.
*/


// custom logo URL / image for single SolCube page
// http://www.kriesi.at/support/topic/change-a-header-logo-on-one-page-only/
/*
add_filter('avf_logo','av_change_logo');
function av_change_logo($logo)
{
    if(is_page(1309))  {
		$logo = "https://base.energy/wp-content/uploads/2017/05/SolCube-logo.png";
    }
    return $logo;
}
*/

/*
add_filter('avf_logo_link','av_change_logo_link');
function av_change_logo_link($link)
{
    if(is_page(59)){
		$link = "http://www.kriesi.at";
    }
    return $link;
}*/

// Page id 1309 = solCube One Pager
// Page id 1531 = SolCube Assistant
function my_theme_enqueue_styles() {

    $parent_style = 'parent-style'; // This is 'twentyseventeen-style' for the Twenty Sixteen theme.

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );

    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
	
	if ( is_page( 1531 ) ) {
		wp_enqueue_style('electroscope', get_stylesheet_directory_uri() . '/css/electroscope.css');
		
		wp_enqueue_style('MaterialIcons', 'https://fonts.googleapis.com/icon?family=Material+Icons');
		wp_enqueue_style('angular-material', 'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css');
	}
	
	
}

function my_theme_enqueue_scripts() {

	if ( is_page( array(1309, 1531) )) {	
		wp_enqueue_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTQpan3Ib_UezXZQuCbPzIfTycv0H3-eQ&libraries=places');
	}
	
	if ( is_page (1309)) {
		wp_register_script( 'electroscope-plugin', get_stylesheet_directory_uri().'/js/electroscope-plugin.js', array('google-maps'), null, true); 
		wp_enqueue_script('electroscope-plugin');
	}	
	

	if ( is_page( 1531 ) ) {
		
		wp_enqueue_script('angular', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular.min.js', array('jquery'));
		wp_enqueue_script('angular-animate', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-animate.min.js', array('jquery'));
		wp_enqueue_script('angular-aria', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-aria.min.js', array('jquery'));
		wp_enqueue_script('angular-messages', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular-messages.min.js', array('jquery'));	
		wp_enqueue_script('angular-material', 'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js', array('jquery'));

		wp_register_script( 'electroscope', get_stylesheet_directory_uri().'/js/electroscope.js', array('jquery', 'SolarAutarki'), null, true); 
		wp_enqueue_script('electroscope');	

		wp_register_script( 'SolarAutarki', get_stylesheet_directory_uri().'/js/SolarAutarki.js', null, null, true); 
		wp_enqueue_script('SolarAutarki');		

		wp_register_script( 'ng-map', get_stylesheet_directory_uri().'/js/ng-map.js', null, null, true); 
		wp_enqueue_script('ng-map');				
		
		// TODO: Get from a real database
		wp_register_script( 'appliancesDB', get_stylesheet_directory_uri().'/js/appliancesDB.js', null, null, true); 
		wp_enqueue_script('appliancesDB');
		wp_register_script( 'appliancesDB-DE', get_stylesheet_directory_uri().'/js/appliancesDB_de.js', null, null, true); 
		wp_enqueue_script('appliancesDB-DE');			

		// in order to access images and other files from custom javascript, see http://wordpress.stackexchange.com/questions/89791/theme-path-in-javascript-file
		$translation_array = array( 'childThemeUrl' => get_stylesheet_directory_uri() );
		wp_localize_script( 'electroscope', 'WordPressObject', $translation_array );	
		wp_localize_script( 'appliancesDB', 'WordPressObject', $translation_array );		
		

	} 
	
	
	
}

add_action('wp_enqueue_scripts', 'my_theme_enqueue_styles');
add_action('wp_enqueue_scripts', 'my_theme_enqueue_scripts');



?>