$(function(){


	$("#crunch").click(function(){
	

	$.ajax('requestMovies.php',   
	         {
	             type: 'GET',
	             data:{title:$("#title1").val()},
	             cache: false,
	             success: function (data) {checkt1($.parseJSON(data))},
	             error: function () {alert('Error receiving JSON');}
	});

	var checkt1 = function(jsonResponse)
	{
			var actors1 = jsonResponse.cast;

			actorIds = _.pluck(actors1,"id");
			console.log(actorIds);
			$.ajax('requestMovies.php',   
	         {
	             type: 'GET',
	             actorIds1:actorIds,
	             data:{title:$("#title2").val()},
	             cache: false,
	             success: function (data) {checkt2($.parseJSON(data),this.actorIds1);},
	             error: function () {alert('Error receiving JSON');}
				});
	}

	var checkt2 = function(jsonResponse,actorIds1)
	{
			var actors2 = jsonResponse.cast;
			actorIds2 = _.pluck(actors2,"id");
			console.log(actorIds2);
			findIntersection(actorIds1,actorIds2);
	}

	var findIntersection = function(actorIds1,actorIds2){

		var intersection = _.intersection(actorIds1,actorIds2);
		if(intersection.length > 0)
			requestActors(intersection);
		else
			alert("No matches found");


	}

	var requestActors = function(idList){
		$.ajax('requestActors.php',   
	         {
	             type: 'GET',
	             data:{actorIds:JSON.stringify(idList)},
	             cache: false,
	             success: function (data) {placeActors(data);},
	             error: function () {alert('Error receiving JSON');}
				});
	}

	});

	var placeActors = function(jsonResponse){
		var actors = $.parseJSON(jsonResponse);
		var placementDiv = $('#actors');
		placementDiv.html("");
		for(var i = 0; i<actors.length;i++)
		{
			var actorDiv = $('<div></div>');
			var actorImage = $('<img src="'+actors[i].photoURL+'">');
			actorDiv.append(actorImage);
			var actorName = $('<p>'+actors[i].name+'</p>');
			actorDiv.append(actorName);
			placementDiv.append(actorDiv);
		}
	}

	

});