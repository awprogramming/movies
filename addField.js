$(function(){

	$("#add").click(function(){
		
		$("#add").before('<input class="title" placeholder="Movie/TV Show"></input>');
		
	});

	$("#remove").click(function(){
		
		$("#add").prev().remove();

	});

	$("#clear").click(function(){

		localStorage.clear();

	});

});