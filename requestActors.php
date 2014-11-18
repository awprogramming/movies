
<?php

	$requestURL = "http://api.themoviedb.org/3/configuration?api_key=2bffedd413ae2a772435cafa06f30cb0";
	$response = file_get_contents($requestURL);
	$decoded = json_decode($response);
	$baseURL = $decoded->images->base_url;
	$size = $decoded->images->profile_sizes[1];


	$actorList= json_decode($_GET['actorIds']);
	//$actorList = array(12073);
	$out = array();
	for($i=0;$i<count($actorList);$i++)
	{
		$id = $actorList[$i];
		$requestURL = "http://api.themoviedb.org/3/person/".$id."?api_key=2bffedd413ae2a772435cafa06f30cb0";
		$response = file_get_contents($requestURL);
		$decoded = json_decode($response);
		$out[] = array(
		'id' => $id,
        'name' => $decoded->name,
        'photoURL' => $baseURL . $size . $decoded->profile_path,
        );
	}
	echo json_encode($out);
?>