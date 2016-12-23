h = innerHeight;
w = innerWidth;


var makeMap = function(){
//Use own server to serve map content

  //Set up SVG
  var svg = d3.select("#chart")
  svg.attr("width", innerWidth)
  .attr("height", innerHeight);

  //Set up Projection
  var projection = d3.geo.mercator();
  s = 300;
  projection.scale(s)

  var t = [innerWidth / 2,innerHeight /2];
  projection.translate(t);

  var map = svg.append('g').attr('class', 'boundary');
  d3.selectAll(".boundary")
    .attr("width", innerWidth)
    .attr("height", innerHeight);

  var path = d3.geo.path()
    .projection(projection);
　　
  //Get Meteors
  var meteors = svg.append('g')

  var l;
  var m;

　//Get Json
 d3.json("/public/data/map.json", function(error, json){
    var countries = topojson.feature(json, json.objects.ne_50m_admin_0_countries);

    l = map.selectAll('path').data(countries.features)
　　　　.enter()
    .append('path')
    .attr('d', path)
    .attr('fill', 'red');

    var flag = [0,0]

  });

  d3.json("/public/data/meteors.json", function(json){
      m = meteors.selectAll('path').data(json.features)
     .enter()
     .append('circle')
     .attr('cx', function(d){
	return projection([d.properties.reclong, d.properties.reclat])[0] 
      })
     .attr('cy', function(d) { 
        return projection([d.properties.reclong,d.properties.reclat])[1] 
      })
     .attr('r', 2)
     .attr('fill', 'blue');

    var flag = [0,0]

    svg
    .on("mousedown", function(){
	flag = [d3.event.clientX,d3.event.clientY];
}, false)
    .on("mouseup", function(){
	var newT = [d3.event.clientX - flag[0], d3.event.clientY - flag[1]];
	oldT = projection.translate();
	projection.translate([newT[0]+oldT[0], newT[1]+oldT[1]]);
	l.attr('d', path);
        
         m.attr('cx', function(d){
	return projection([d.properties.reclong, d.properties.reclat])[0] 
      })
     m.attr('cy', function(d) { 
        return projection([d.properties.reclong,d.properties.reclat])[1] 
      })
}, false);
   });


};


makeMap();
