var width = 900
var height = 600

var projection = d3.geoConicEqualArea()

var svg = d3.select("#chart")

svg.attr("width", width)
.attr("height", height)

var path = d3.geoPath()
.projection(projection)

var g = svg.append("g");


//How can I get JSON off github?
d3.json("world.json", function(error, topology){
g.selectAll("path")
.data(topojson.object(topology, topology.objects.countries).geometries)
.enter()
.append("path")
.attr("d", path)
})
