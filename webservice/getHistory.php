<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------

// security issue, see http://stackoverflow.com/questions/20035101/no-access-control-allow-origin-header-is-present-on-the-requested-resource  
// TODO: remove if in production
header('Access-Control-Allow-Origin: *');


header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-type: application/json');
header("Cache-Control: no-cache");

// expected JSON in POST method 
//			{
//				"sender": arduino,
//				"from": localClietDateTimeFrom,
//				"to": localClientDateTimeTo,
//
//			}
$post = file_get_contents('php://input');

// TODO: "Error Handling"
$reqHistory = json_decode ($post, false);
$sender = $reqHistory->sender;
$from = $reqHistory->from;
$to = $reqHistory->to;

// Lets get some default values, in case we are missing input parameters
if (0 == 1) { // TODO: If from and to is empty
	$dtFrom = new DateTime("now - 48 hours", new DateTimeZone("Europe/Vienna")); 
	$from = $dtFrom->format("Y-m-d H:i:s");
	$dtTo = new DateTime("now", new DateTimeZone("Europe/Vienna"));
	$to = $dtTo->format("Y-m-d H:i:s");
	
}

//--------------------------------------------------------------------------
// Connect to mysql database^and query data
//--------------------------------------------------------------------------

try {
	// get variable $conn with access to mysql
	include('dbaccess.php');
	
	// see selectTimeslice.sql sample
	$q = "
		SELECT d.timeslice
			 , TRUNCATE(AVG(h.volt), 2) AS volt
			 , TRUNCATE(AVG(h.amps), 2) AS amps
			 , TRUNCATE(volt * amps, 2) AS voltamps
		  FROM ( SELECT min_date + INTERVAL n*1 HOUR AS timeslice
				   FROM ( SELECT TIMESTAMP('$from') AS min_date
							   , TIMESTAMP('$to') AS max_date ) AS m
				 CROSS
				   JOIN numbers
				  WHERE min_date + INTERVAL n*1 HOUR <= max_date
			   ) AS d
		LEFT
		  JOIN healthlog AS h
			ON h.sendtime BETWEEN d.timeslice
								AND d.timeslice + INTERVAL 1 HOUR
		GROUP BY d.timeslice";
	
	
	$sth = $conn->prepare($q);
	$sth->execute();
	$result = $sth->fetchAll(PDO::FETCH_NUM);
	
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