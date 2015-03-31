var sets = [];
var overlaps = [];

var createFormalSets = function(setsArray){
	var combinations = [];
	for(var i  = 0; i < setsArray.length; i++)
	{
		combinations.push(i);
	}
	
	combinations = combine(combinations,1);
	comboLen = combinations.length;
	console.log(combinations);
	for(var i = 0; i < comboLen; i++)
	{
		if(combinations[i].length==1)
		{
			var set = new Object();
			set.label = setsArray[combinations[i][0]].title;
			set.size = 100;//setsArray[combinations[i][0]].actors.length;
			set.actors = setsArray[combinations[i][0]].actors;
			sets.push(set);
		}
		else
		{
			var overlap = new Object;
			overlap.sets = combinations[i];
			var label = setsArray[combinations[i][0]].title;
			var intersection = setsArray[combinations[i][0]].actors;
			for(var j = 1; j < combinations[i].length; j++)
			{
				intersection = _.intersection(intersection,setsArray[combinations[i][j]].actors);
				label = label + " / "+ setsArray[combinations[i][j]].title;
			}
			overlap.label = label;
			overlap.size = 10;//intersection.length;
			overlap.actors = intersection;
			overlaps.push(overlap);
		}
	}
		// get positions for each set
	sets = venn.venn(sets, overlaps, {layoutFunction: venn.classicMDSLayout})
	// draw the diagram in the 'mds' div
	var diagram = venn.drawD3Diagram(d3.select(".mds"), sets, 300, 300);
	// add a tooltip showing the size of each set/intersection
	var tooltip = d3.select("body").append("div")
	.attr("class", "venntooltip");
	
	d3.selection.prototype.moveParentToFront = function() {
	return this.each(function(){
	this.parentNode.parentNode.appendChild(this.parentNode);
	});
	};
	// hover on all the circles
	diagram.circles
	.style("stroke-opacity", 0)
	.style("stroke", "white")
	.style("stroke-width", "2");
	diagram.nodes
	.on("mouseover", function(d, i) {
	placepics(d);
	var selection = d3.select(this).select("circle");
	selection.moveParentToFront()
	.transition()
	.style("fill-opacity", .5)
	.style("stroke-opacity", 1);
	})
	.on("mouseout", function(d, i) {
	d3.select(this).select("circle").transition()
	.style("fill-opacity", .3)
	.style("stroke-opacity", 0);
	});
	// draw a path around each intersection area, add hover there as well
	diagram.svg.selectAll("path")
	.data(overlaps)
	.enter()
	.append("path")
	.attr("d", function(d) {
	return venn.intersectionAreaPath(d.sets.map(function(j) { return sets[j]; }));
	})
	.style("fill-opacity","0")
	.style("fill", "black")
	.style("stroke-opacity", 0)
	.style("stroke", "white")
	.style("stroke-width", "2")
	.on("mouseover", function(d, i) {
	placepics(d);
	d3.select(this).transition()
	.style("fill-opacity", .1)
	.style("stroke-opacity", 1);
	})
	.on("mouseout", function(d, i) {
	d3.select(this).transition()
	.style("fill-opacity", 0)
	.style("stroke-opacity", 0);
	})
}

var placepics = function(section)
{
	$('#titlePosition').html(section.label);
	var placementDiv = $('#actors');
	placementDiv.html("");
	var actors = section.actors;
	if(actors.length == 0)
	{
		placementDiv.append('<span>No similar actors</span>');
	}
	else
	{
		for(var i = 0; i < actors.length; i++)
		{
			var name = localStorage.getItem(actors[i]);
			var photoURL = localStorage.getItem(actors[i]+'pic');
			var actorDiv = $('<div class="item"></div>');
			var actorImage = $('<img src="'+photoURL+'">');
			actorDiv.append(actorImage);
			var actorName = $('<p>'+name+'</p>');
			actorDiv.append(actorName);
			placementDiv.append(actorDiv);
		}
	}
}

var combine = function(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

