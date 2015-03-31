var createFormalSets = function(setsArray){
  
  var jvennObj = new Object();
  jvennObj.series = [];
  for(var i  = 0; i < setsArray.length; i++)
  {
    var serie = new Object();
    serie.name = setsArray[i].title;
    serie.data = setsArray[i].actors;
    for(var j = 0; j < serie.data.length; j++)
    {
      serie.data[j] = serie.data[j].toString();
    }
    console.log(serie.data);
    jvennObj.series.push(serie);
  }
  jvennObj.fnClickCallback = function(){
      placepics(this);
  }
  console.log(jvennObj);
  $('.mds').jvenn(jvennObj);

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

var placepics = function(section)
{
  
  var value = "|";
  for (name in section.listnames) {
      value += " "+section.listnames[name] + " |";
      }

  $('#titlePosition').html(value);
  var placementDiv = $('#actors');
  placementDiv.html("");
  if(section.list.length == 0)
  {
    placementDiv.append('<span>No similar actors limited to these movies</span>');
  }
  else
  {
    for (val in section.list) {
      actorID = parseInt(section.list[val]);
      var name = localStorage.getItem(actorID);
      var photoURL = localStorage.getItem(actorID+'pic');
      var photoURL = localStorage.getItem(actorID+'pic');
      var actorDiv = $('<div class="item"></div>');
      var actorImage = $('<img src="'+photoURL+'">');
      actorDiv.append(actorImage);
      var actorName = $('<p>'+name+'</p>');
      actorDiv.append(actorName);
      placementDiv.append(actorDiv);
      }
  }
}