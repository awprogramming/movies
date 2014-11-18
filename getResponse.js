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
			var setsArray = [];
			setsArray.push(actorIds1);
			setsArray.push(actorIds2);

			createFormalSets(setsArray);
			//findIntersection(actorIds1,actorIds2);

	}

	// var findIntersection = function(actorIds1,actorIds2){

	// 	var intersection = _.intersection(actorIds1,actorIds2);
	// 	if(intersection.length > 0)
	// 		requestActors(intersection);
	// 	else
	// 		alert("No matches found");


	// }

	var requestActors = function(idList){
		
		var cached = [];
		for(var i = 0; i<idList.length;i++)
		{
			if(localStorage.getItem(idList[i]))
			{
				cached.push(idList[i]);
				idList.splice(i,1);
				i--;
			}
		}

		if(idList.length != 0)
		{
			$.ajax('requestActors.php',   
		         {
		             type: 'GET',
		             data:{actorIds:JSON.stringify(idList)},
		             cache: false,
		             success: function (data) {placeActors(cached,data);},
		             error: function () {alert('Error receiving JSON');}
					});
		}
		else
		{
			placeActors(cached,"");
		}
	}

	});

	var placeActors = function(cached, jsonResponse){
		
		var placementDiv = $('#actors');
		placementDiv.html("");
		if(cached.length!=0)
		{
			for(var i = 0; i<cached.length;i++)
			{
				placement(localStorage.getItem(cached[i]),localStorage.getItem(cached[i]+'pic'));
			}
		}
		if(jsonResponse!="")
		{
			var actors = $.parseJSON(jsonResponse);
			for(var i = 0; i<actors.length;i++)
			{
				localStorage.setItem(actors[i].id,actors[i].name);
				localStorage.setItem(actors[i].id+'pic',actors[i].photoURL);
				placement(actors[i].name,actors[i].photoURL)
			}
		}
	}

	var placement = function(name, photoURL){
		
		var placementDiv = $('#actors');
		var actorDiv = $('<div></div>');
		var actorImage = $('<img src="'+photoURL+'">');
		actorDiv.append(actorImage);
		var actorName = $('<p>'+name+'</p>');
		actorDiv.append(actorName);
		placementDiv.append(actorDiv);
	}

	

});