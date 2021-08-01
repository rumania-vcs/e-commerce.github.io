async function init() {

  var ecommData = await d3.csv('e-commerce-agg-data.csv');

  console.log(ecommData);

  let yr = new Set();

  ecommData.forEach(d => {
    yr.add(+d.year)
  })

  console.log(yr);


  years = Array.from(yr);

  let yearlyData = [];
  years.forEach(year => {
    let yearSum = 0;
    ecommData.forEach(d => {
      if (d.year == year) {
        yearSum += +d.UnitPrice;
      }
    });
    yearlyData.push(yearSum)
  });
  console.log(yearlyData);

  w = 300;
  h = 300;
  //const yearSvg = d3.select('#years svg').selectAll('rect');
  const yearSvg = d3.select('#years svg').selectAll('rect').attr("width", w).attr("height", h);

  // console.log(e,d)
  d3.select('#years p')
    .text('Yearly Sales Amount')

  function yRect(t, d, i) {
    if (t == 'y') {
      return document.querySelector('#years svg').clientHeight / 4 * (i + 1);
    } else {
      return document.querySelector('#years svg').clientHeight / 6 * (i + 1);
    }

  }

  function hRect(t, d, i) {
    if (t == 'y') {
      return document.querySelector('#years svg').clientHeight / 4 - 5;
    } else {
      return document.querySelector('#years svg').clientHeight / 6 - 5;
    }
  }


  function txtyRect(t, d, i) {
    if (t == 'y') {
      return (document.querySelector('#years svg').clientHeight / 4 * (i + 1) +
        (document.querySelector('#years svg').clientHeight / 4) / 2);
    } else {
      return (document.querySelector('#years svg').clientHeight / 6 * (i + 1) +
        (document.querySelector('#years svg').clientHeight / 6) / 2)
    }
  }

  function wRect(t, d, i) {
    if (t == 'n') {
      return d / 15000
    } else {
      return (d / 15000) + 10
    }

  }

  function idRect(d, i) {
    return `${years[i]}`
  }

  function txtxRect(d, i) {
    return (d / 15000) + 10
  }

  function txtRect(d, i) {
    return `${years[i]} - $${d}`
  }


  yearSvg.data(yearlyData)
    .join('rect')
    .attr('x', 0)
    .attr('y', function (d, i) { return yRect('y', d, i); })
    .attr('height', function (d, i) { return hRect('y', d, i); })
    .attr('width', function (d, i) { return wRect('n', d, i); })
    .attr('id', function (d, i) { return idRect(d, i); })
    .style('fill', 'rgb(0,0,255)')
    .style('cursor', 'pointer');

  yearSvg.data(yearlyData)
    .join('text')
    .attr('x', function (d, i) { return wRect('y', d, i); })
    .attr('y', function (d, i) { return txtyRect('y', d, i); })
    .text(function (d, i) { return txtRect(d, i); })
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
        .attr('y', function (d, i) { return yRect('n', d, i); })
        .attr('height', function (d, i) { return hRect('n', d, i); })
        .attr('width', function (d, i) { return (d.UnitPrice) / 3000; })
        .attr('id', function (d, i) { return `${d.quarter}`; })
        .style('fill', 'skyblue')


      d3.select('#quarters svg')
        .selectAll('text')
        .data(quarterlyData)
        .join('text')
        .attr('x', function (d, i) { return (d.UnitPrice / 3000) + 10; })
        .attr('y', function (d, i) { return txtyRect('n', d, i); })
        .text(function (d, i) { return `${d.quarter} - $${(d.UnitPrice)}`; })
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', 'gray');


    });


};