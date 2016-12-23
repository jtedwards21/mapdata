var makeMap = function(url){
//Use own server to serve map content

  var width = 500;
  var height = 500;

  //Set up SVG
  var svg = d3.select("#chart")

  svg.attr("width", width)
  .attr("height", height)

  var projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([0, 0])
    .parallels([50, 60])
    .scale(60)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);
　　
  d3.json(url, function(error, json){
    console.log(json);
    //var admin_1 = topojson.feature(json, json.objects.ne_50m_admin_0_countries);

    svg.append("path")
    .datum(topojson.feature(json, json.objects.ne_50m_admin_0_countries))
    .attr('d', path)
  });
};

makeMap("/public/data/map.json");
