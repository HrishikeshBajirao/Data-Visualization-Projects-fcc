let var1;

function whichQuarter(str){
  const month = str.slice(5, 7);
  if(month == "01")
    return "Q1";
  else if(month == "04")
    return "Q2";
  else if(month == "07")
    return "Q3";
  else if(month == "10")
    return "Q4";
}

document.addEventListener("DOMContentLoaded", () => {          
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(dataset => {
      const w = 900;
      const h = 450;
      var1 = dataset;
      const gdpdata = dataset.data;

      const padding = 50;
      const xScale = d3
        .scaleTime()
        .domain([d3.min(gdpdata, d => new Date(d[0])), d3.max(gdpdata, d => new Date(d[0]))])
        .range([padding, w-padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdpdata, d => d[1])])
        .range([h-padding, padding]);
      
      const barWidth = (w - 2 * padding) / gdpdata.length;
      
      const tooltip = document.getElementById("tooltip");
      const tipDate = document.getElementById("tooltip-date");
      const tipGdp = document.getElementById("tooltip-gdp");

      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
      
      svg
        .append('g')
        .attr('transform', 'translate(0,' + (h-padding) + ')')
        .call(xAxis)
        .attr('id', 'x-axis');
      
      svg
        .append('g')
        .attr('transform', 'translate(' + padding + ', 0)')     
        .call(yAxis)
        .attr('id', 'y-axis');
      
      svg
        .selectAll('rect')
        .data(gdpdata)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', (d, i) => xScale(new Date(d[0])))
        .attr('y', d =>  yScale(d[1]))
        .attr('width', barWidth)
        .attr('height', (d, i) => h - padding - yScale(d[1]))
        .attr('fill', 'lightblue')
        .on("mouseenter", (e, d) => {
          tooltip.style.opacity = "1";
          tooltip.style.top = "350px";
          tooltip.style.left = e.offsetX + 40 + "px";
          tooltip.dataset.date = d[0];
          tipGdp.innerText = "$" + d[1] + " Billion";
          const year = d[0].slice(0, 4);
          const quarter = whichQuarter(d[0]);
          tipDate.innerText = year + " " + quarter;
        })
        .on("mouseleave", () => {
          tooltip.style.opacity = "0";
        })
    });
});

