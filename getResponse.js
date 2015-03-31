var setsArray = [];
$(function(){

	
	
	$("#crunch").click(function(){
	setsArray = [];
	sets =[];
	overlaps = [];
	$('.mds').html("");
	$('#actors').html("");
	$('#titlePosition').html("");
	requestMovies(0);
	});
});

var requestMovies = function(inputNum)
{
	if($(".title")[inputNum]!=null)
	{
		var index = inputNum+1;
		var title = $(".title:nth-child("+index+")").val();
		var set = new Object();
		set.title = title;
		var forCache = $.trim(title.toLowerCase());
		if(localStorage.getItem(forCache))
		{
			set.actors = JSON.parse(localStorage.getItem(forCache));
			setsArray.push(set);
			inputNum++;
			requestMovies(inputNum);
		}
		else
		{
			$.ajax('requestMovies.php',   
	        {
	             type: 'GET',
	             set:set,
	             inputNum:inputNum,
	             data:{title:title},
	             cache: false,
	             success: function (data) {pullIds($.parseJSON(data),this.set,this.inputNum)},
	             error: function () {alert('Error receiving JSON');}
			});
		}
	}
	else
	{
		requestActors(0);
	}
}
	
var pullIds = function(jsonResponse,curSet,curInputNum)
{
	var actors = jsonResponse.cast;
	actorIds = _.pluck(actors,"id");
	localStorage.setItem($.trim(curSet.title.toLowerCase()),JSON.stringify(actorIds));
	curSet.actors = actorIds;
	setsArray.push(curSet);
	curInputNum++;
	requestMovies(curInputNum);
}

var requestActors = function(curSet)
{
	if(setsArray[curSet]!=null)
	{
		var idList = setsArray[curSet].actors.slice(0);
		//cache all actors for later use
		
		for(var i = 0; i < idList.length; i++)
		{
			if(localStorage.getItem(idList[i]))
			{
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
		             success: function (data) {finishCaching(data,curSet);},
		             error: function () {alert('Error receiving JSON');}
					});
		}
		else
		{
			curSet++;
			requestActors(curSet);
		}
	}
	else
	{
		
		createFormalSets(setsArray);
	}
 }

 var finishCaching = function(names,curSet)
 {
 	var actors = JSON.parse(names);
	
	for(var i = 0; i<actors.length; i++)
	{
		localStorage.setItem(actors[i].id,actors[i].name);
		localStorage.setItem(actors[i].id+'pic',actors[i].photoURL);
	}
	curSet++;
	requestActors(curSet);
 }

