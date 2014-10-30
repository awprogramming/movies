
<?php

	$actorList= json_decode($_GET['actorIds']);

	$out = array();
	for($i=0;$i<count($actorList);$i++)
	{
		$id = $actorList[$i];
		$requestURL = "http://www.myapifilms.com/imdb?idName=" . $id . "&format=JSON&actors=F";
		$response = json_decode(file_get_contents($requestURL));
		
		$out[] = array(
        'name' => $response->name,
        'photoURL' => $response->urlPhoto,
        );
	}
	echo json_encode($out);
	
?>