const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

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

  d3.select('svg').selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text("Customer Not Present")
    .attr("y", 40)
    .attr("x", 200)
    .attr("font-family", "sans-serif")
    .attr("font-size", "8px")
    .attr("fill", "gray")
    .attr("border","2px");





});