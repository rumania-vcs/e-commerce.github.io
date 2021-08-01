const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

svg.append("circle").attr("cx", 280).attr("cy", 30).attr("r", 4).style("fill", "blue")
svg.append("circle").attr("cx", 280).attr("cy", 45).attr("r", 4).style("fill", "gray")
svg.append("text").attr("x", 290).attr("y", 30).text("Customer Present").style("font-size", "10px").attr("alignment-baseline", "middle")
svg.append("text").attr("x", 290).attr("y", 45).text("Customer Not Present").style("font-size", "10px").attr("alignment-baseline", "middle")

const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([200, 220]);


let data = new Map()
const colorScale = d3.scaleThreshold()
  .domain([260520, 2238283])
  .range(['rgb(0,0,255)']);

Promise.all([
  d3.json("world_geo.json"),
  d3.csv("e-commerce-map.csv", function (d) {
    data.set(d.code, +d.Quantity)
  })
]).then(function (loadData) {
  let topo = loadData[0]

  let mouseOver = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  map = svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("fill", function (d) {
      console.log(data);
      console.log(d3.geoPath().projection(projection));
      d.total = data.get(d.id) || 0;
      console.log(d.total, data)

      if (d.total === 0) {
        return "gray";

      } else {
        return colorScale(d.total);
      }
    })
    .style("stroke", "transparent")
    .attr("class", function (d) { return "Country" })
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    ;


});