
<?php

	$title = urlencode($_GET['title']);

	$requestURL = "http://www.myapifilms.com/imdb?title=" . $title . "&format=JSON&actors=F";

	// Other parameters
	// $requestURL = $requestURL . "&lang=en-us&actors=S";
	
	$response = file_get_contents($requestURL);
	print_r($response);
?>