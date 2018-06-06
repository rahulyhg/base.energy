<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------

// security issue, see http://stackoverflow.com/questions/20035101/no-access-control-allow-origin-header-is-present-on-the-requested-resource  
// TODO: remove if in production
header('Access-Control-Allow-Origin: *');

header('Content-type: application/json');
header("Cache-Control: no-cache");

// expected JSON in POST method 
//			{
//				"lat": lat,
//				"lng": lng
//			}
$post = file_get_contents('php://input');

// TODO: "Error Handling"
$latLng = json_decode ($post, false);
$lat = round($latLng->lat); // e.g. rounding lat 57.4356 to 57 which is in database
$lng = round($latLng->lng);

//--------------------------------------------------------------------------
// Connect to mysql database^and query data
//--------------------------------------------------------------------------
try {
	// get variable $conn with access to mysql
	include('dbaccess.php');
	
	$stmt = $conn->prepare("SELECT jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dez FROM GHI WHERE lat=$lat AND lng=$lng");
	$stmt->execute();
    
	$result = $stmt-> fetch();	
}
catch(PDOException $e){
    echo "Error: " . $e->getMessage();
	return;
}



//--------------------------------------------------------------------------
// echo result as json 
//--------------------------------------------------------------------------
echo json_encode($result);

?>