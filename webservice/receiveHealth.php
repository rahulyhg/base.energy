<?php

// we use DateTime to utilize DateTimeZone

$dt = new DateTime("now", new DateTimeZone("Europe/Vienna"));
$dt->setTimestamp(time());
$dtFormatted = $dt->format("Y-m-d H:i:s");


// Lets write health to our database
try {
	// how to handle passwords for public repositories in GitHub
	// See https://www.reddit.com/r/learnprogramming/comments/3wkf4w/php_how_do_i_use_github_without_revealing_mysql/
	include("dbaccess.php"); // access to $host, $database, $user, $password

    $conn = new PDO("mysql:host=$host;dbname=$database", $user, $password);
	
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // use exec() because no results are returned
	
	$volt = $_GET["volt"];
    $conn->exec("INSERT INTO healthlog (sendtime, volt) VALUES ('$dtFormatted', $volt)");
	$conn = null;
}
catch(PDOException $e) {
    echo $sql . "<br>" . $e->getMessage();
	return;
}

echo "OK";
?>