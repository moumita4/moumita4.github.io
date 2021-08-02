async function init(status)

{
	
		
				path = 'https://moumita4.github.io/Final_Lending_data.csv'
				const data = await d3.csv(path);
		

		new_filtered_data = data.filter(function(d){ return d.Loan_Status == status })
		//console.log(new_approved_data[2]);
		
		var nestFilteredData = d3.nest().key(function(d) { return d.Property_Area; })
								.sortKeys(d3.ascending)
								.rollup(function(d) { return d.length; })
								.entries(new_filtered_data);

	
		// Initialize the plot with the first dataset
		update(nestFilteredData)
		
		

}


// A function that create / update the plot for a given variable:
function update(data) {

	

  // Update the X axis
  x.domain(data.map(function(d) { return d.key; }))
  xAxis.call(d3.axisBottom(x))
  .attr("stroke","white").attr("fill","white")
   .append("text")
      .attr("x", 2)
      .attr("y", 35)
      .attr("dy", "0.32em")
      .attr("text-anchor", "start")
      .attr("style","font-size:15px;")
      .text("Borrower Property Area");

  

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.value }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y))
  .attr("stroke","white").attr("fill","white")
  

     svg.append("text")
     .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+130)
      .attr("x", -margin.top -80)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("style","font-size:15px;")
      .text("Total Loans");



  // Create the u variable
  var u = svg.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .on("mouseover", d => {tooltip.text("Total loans" + " : " + (d.value)); return tooltip.style("visibility", "visible")})
    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    .on("mouseout", () => tooltip.style("visibility", "hidden"))
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
    	.attr("fill", function(d) { return z(d.key); })
     // .attr("fill", "#69b3a2")



var tooltip = d3.select("body")
                .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", 10)
                    .style("visibility", "hidden")
                    .text("Simple text");

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()

}