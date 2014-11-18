var sets = [];
var overlaps = [];

var createFormalSets = function(setsArray){

	for(var i = 0; i<setsArray.length; i++){

		var set = new Object();
		set.label = "Set "+i;
		set.size = setsArray[i].length;
		sets.push(set);

		for(var j = 0; j<setsArray.length; j++)
		{
			if(j!=i)
			{
				var overlap = new Object();
				overlap.sets = [i,j];
				var intersection = _.intersection(setsArray[i],setsArray[j]);
				overlap.size = intersection.length;
				overlaps.push(overlap);
			}
		}
	}

	sets = venn.venn(sets, overlaps);
	// draw the diagram in the 'venn' div
	var diagram = venn.drawD3Diagram(d3.select(".venn"), sets, 500, 500);
}