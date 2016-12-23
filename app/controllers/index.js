h = innerHeight;
w = innerWidth;
console.log(h);


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


    svg.attr("width", innerWidth)
    .attr("height", innerHeight);
    s = 300;
    projection.scale(s)

    d3.selectAll(".boundary")
    .attr("width", innerWidth)
    .attr("height", innerHeight);

    var t = [innerWidth / 2,innerHeight /2];
    projection.translate(t);

    var map = svg.append('g').attr('class', 'boundary');
    var l  = map.selectAll('path').data(countries.features)
　　　　l.enter()
    .append('path')
    .attr('d', path)
    .attr('fill', 'red');
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
