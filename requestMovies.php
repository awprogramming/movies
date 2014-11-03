
<?php

	$title = urlencode($_GET['title']);
	//$title = urlencode("Brooklyn Nine Nine");

	$requestURL = "http://api.themoviedb.org/3/search/multi?query=".$title."&api_key=2bffedd413ae2a772435cafa06f30cb0";
	$response = file_get_contents($requestURL);

	if(json_decode($response)->total_results != 0)
	{
		$mt = json_decode($response)->results[0]->media_type;
		$id = json_decode($response)->results[0]->id;
		if($mt == "movie")
		{
			$requestURL = "http://api.themoviedb.org/3/movie/".$id."/credits?api_key=2bffedd413ae2a772435cafa06f30cb0";
		}
		else if($mt == "tv")
		{	
			$requestURL = "http://api.themoviedb.org/3/tv/".$id."/credits?api_key=2bffedd413ae2a772435cafa06f30cb0";
		}
		else
		{
			header("HTTP/1.1 406 Not Acceptable");
	        print("Media type unrecognized");
	        exit();
		}
			$response = file_get_contents($requestURL);
			print_r($response);
			exit();
	}
	else
	{
		header("HTTP/1.1 406 Not Acceptable");
        print("No Results for searched moive");
        exit();
	}
	
?>