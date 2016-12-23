var makeMap = function(url){
//Use own server to serve map content

  //Set up SVG
  var svg = d3.select("#chart")


  var projection = d3.geo.mercator();

  var path = d3.geo.path()
    .projection(projection);
　　
  d3.json(url, function(error, json){
    console.log(json);

    var countries = topojson.feature(json, json.objects.ne_50m_admin_0_countries)
    var b = path.bounds(countries);
    console.log(b);
    //var s = Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var boundsWidth = b[1][0] - b[0][0];
    var boundsHeight = b[1][1] - b[0][1];
    
  svg.attr("width", boundsWidth)
  .attr("height", boundsHeight);
    console.log(boundsHeight);
    //var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(100)//.translate(t);

    var map = svg.append('g').attr('class', 'boundary');
    var l  = map.selectAll('path').data(countries.features)
　　　　l.enter()
    .append('path')
    .attr('d', path)
  });
  
  drawMeteors("/public/data/meteors.json", projection);

};

var drawMeteors = function(url, projection){
  svg = d3.select("#chart");
  d3.json(url, function(json){
     var meteors = svg.append('g')
     .selectAll('path')
     .data(json.features)
     .enter()
     .append('circle')
     .attr('cx', function(d){
	return projection([d.properties.reclong, d.properties.reclat])[0] 
      })
     .attr('cy', function(d) { 
        return projection([d.properties.reclong,d.properties.reclat])[1] 
      })
     .attr('r', 2)
     .attr('fill', 'blue')
     

     })
}

makeMap("/public/data/map.json");
