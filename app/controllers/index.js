var githubUrl = "https://raw.githubusercontent.com/jtedwards21/mapdata/master/public/json/ne_50m_admin_0_countries.geojson"

var width = 900
var height = 600

var projection = d3.geo.conicEqualArea()

var svg = d3.select("#chart")

svg.attr("width", width)
.attr("height", height)

var path = d3.geo.path()
.projection(projection)

var g = svg.append("g");


//How can I get JSON off github?
d3.json(githubUrl, function(error, topology){
window.topology = topology
console.log('l')
var t = topojson.object(topology.features)
console.log(t)
g.selectAll("path")
.data(t.geometries)
.enter()
.append("path")
.attr("d", path)
})
