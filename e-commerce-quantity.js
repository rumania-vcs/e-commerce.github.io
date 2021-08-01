async function init() {

  var ecommData = await d3.csv('e-commerce-agg-data.csv');

  console.log(ecommData);

  let yr = new Set();

  ecommData.forEach(d => {
    yr.add(+d.year)
  });

  console.log(yr);
  years = Array.from(yr);

  let yearlyData = [];
  years.forEach(year => {
    let yearSum = 0;
    ecommData.forEach(d => {
      if (d.year == year) {
        yearSum += +d.Quantity;
      }
    });
    yearlyData.push(yearSum)
  });
  console.log(yearlyData);

  d3.select('#years p')
    .text('Yearly Quantity Distribution')

  const yearSvg = d3.select('#years svg').selectAll('rect');

  yearSvg.data(yearlyData)
    .join('rect')
    .attr('x', 0)
    .attr('y', function (d, i) {
      return document.querySelector('#years svg').clientHeight / 4 * (i + 1);
    })
    .attr('height', function (d, i) {
      return document.querySelector('#years svg').clientHeight / 4 - 5;
    })
    .attr('width', d => d / 30000)
    .attr('id', (d, i) => `${years[i]}`)
    .style('fill', 'rgb(0,0,255)')
    .style('cursor', 'pointer');

  yearSvg.data(yearlyData)
    .join('text')
    .attr('x', d => d / 30000 + 10)
    .attr('y', (d, i) => {
      return (document.querySelector('#years svg').clientHeight / 4 * (i + 1) +
        (document.querySelector('#years svg').clientHeight / 4) / 2)
    })
    .text((d, i) => `${years[i]} - ${d}`)
    .style('font-size', '12')
    .style('font-weight', '500')
    .style('fill', 'gray');

  d3.select('#quarters p')
    .text('Click on year bar for more details')

  d3.select('#years')
    .selectAll('rect')
    .on('click', function (e, d) {
      console.log(this);
      d3.select('#quarters p')
        .text(`${this.id}: Quarterly Break-Up`)


      let quarterlyData = [];
      ecommData.forEach(d => {
        if (this.id == d.year) {
          quarterlyData.push(d)
        }
      });

      const quartersSvg = d3.select('#quarters svg').selectAll('rect');

      quartersSvg.data(quarterlyData)
        .join('rect')
        .attr('x', '0')
        .attr('y', (d, i) => {
          return document.querySelector('#years svg').clientHeight / 6 * (i + 1);
        })
        .attr('height', (d) => {
          return document.querySelector('#years svg').clientHeight / 6 - 5;
        })
        .attr('width', (d) => {
          return (d.Quantity) / 7000;
        })
        .attr('id', d => `${d.quarter}`)
        .style('fill', 'skyblue')


      d3.select('#quarters svg')
        .selectAll('text')
        .data(quarterlyData)
        .join('text')
        .attr('x', d => (d.Quantity) / 7000 + 10)
        .attr('y', (d, i) => {
          return (document.querySelector('#years svg').clientHeight / 6 * (i + 1) +
            (document.querySelector('#years svg').clientHeight / 6) / 2);
        })
        .text((d, i) => `${d.quarter} - ${(d.Quantity)}`)
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', 'gray');


    });

}