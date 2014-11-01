
<?php

	$title = urlencode($_GET['title']);
	//$title = "Shrek";


	//*******CHANGE TO MULTI WITH CONDITIONAL FOR SECOND REQUEST BASED ON MEDIA TYPE*******
	$requestURL = "http://api.themoviedb.org/3/search/movie?query=".$title."&api_key=2bffedd413ae2a772435cafa06f30cb0";
	$response = file_get_contents($requestURL);
	if(json_decode($response)->total_results != 0)
	{
		$id = json_decode($response)->results[0]->id;
		$requestURL = "http://api.themoviedb.org/3/movie/".$id."/credits?api_key=2bffedd413ae2a772435cafa06f30cb0";
		$response = file_get_contents($requestURL);
		print_r($response);
	}
	else
	{
		header("HTTP/1.1 406 Not Acceptable");
        print("No Results for searched moive");
        exit();
	}
	
?>