h = innerHeight;
w = innerWidth;
landColor = "#AEA8E5";
meteorColor = "#615D7F";
color3 = "#7E79A6";
color4 = "#747099";
color5 = "#444159";

var div = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

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

    l.transition()
    .attr('fill', landColor).duration(1000);

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
     .attr('r', function(d) { 
        var range = 718750/2/2;
    
        if (d.properties.mass <= range) return 2;
        else if (d.properties.mass <= range*2) return 10;
        else if (d.properties.mass <= range*3) return 20;
        else if (d.properties.mass <= range*20) return 30;
        else if (d.properties.mass <= range*100) return 40;
        return 50;
      })
     
     m.transition()
     .attr('opacity', .9)
     .attr('fill', meteorColor).duration(1000);

     m.on('mouseover', function(d) {
        d3.select(this).attr('d', path).style('fill', 'black');
        // Show tooltip
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html( '<span class="def">fall:</span> ' + d.properties.fall + '<br>' + 
                  '<span class="def">mass:</span> ' + d.properties.mass + '<br>' + 
                  '<span class="def">name:</span> ' + d.properties.name + '<br>' + 
                  '<span class="def">nametype:</span> ' + d.properties.nametype + '<br>' +
                  '<span class="def">recclass:</span> ' + d.properties.recclass + '<br>' + 
                  '<span class="def">reclat:</span> ' + d.properties.reclat + '<br>' + 
                  '<span class="def">year:</span> ' + d.properties.year + '<br>')
          .style('left', (d3.event.pageX+30) + 'px')
          .style('top', (d3.event.pageY/1.5) + 'px')
      })
      .on('mouseout', function(d) {
        // Reset color of dot
        d3.select(this).attr('d', path).style('fill', function(d) { return d.properties.hsl });

        // Fade out tooltip
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });

    

   //This event structure is off
   // It should be mousemove looking to see if mousedown has flagged
    var flag = [0,0]; 

    svg
    .on("mousemove", function(){
	if(d3.event.buttons === 1){
	  var newT = [d3.event.clientX - flag[0], d3.event.clientY - flag[1]];
	  oldT = projection.translate();
	  flag = [d3.event.clientX,d3.event.clientY];
	  projection.translate([newT[0]+oldT[0], newT[1]+oldT[1]]);
	  l.attr('d', path);
          m.attr('cx', function(d){
	    return projection([d.properties.reclong, d.properties.reclat])[0] 
          })
          m.attr('cy', function(d) { 
            return projection([d.properties.reclong,d.properties.reclat])[1] 
          })
	}
     }, false)
    .on("mousedown", function(){
	flag = [d3.event.clientX,d3.event.clientY];
	m.transition().attr('opacity', '.2').duration(100);
	l.transition().attr('opacity', '.5').duration(100);
     }, false)
    .on("mouseup", function(){
	
	m.transition().attr('opacity', '1').duration(400);
	l.transition().attr('opacity', '1').duration(400);
     }, false);
   });
};


makeMap();
