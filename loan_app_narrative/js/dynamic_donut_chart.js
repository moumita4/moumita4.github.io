async function init()

{
	
				var format = d3.format(".1f")
				path = 'https://moumita4.github.io/Final_Lending_data.csv'
				var  data = await d3.csv(path)

				//console.log(data[2]);



				datasetTotal = d3.nest().key(function(d) { return d.Education; })
										.rollup(function(d) { return d.length; })
										.entries(data);

				//console.log(datasetTotal);
				
				var total = 0;
				datasetTotal.forEach(function(d){total += d.value});           
				//console.log(total);
				datasetTotal.forEach(function(d) {
                						d.percentage = format(d.value/total * 100);
            					});
            					
            	//console.log(datasetTotal);
		
				
				approved_data = data.filter(function(d){ return d.Loan_Status == "Approved" })
				console.log(approved_data[2]);
				
				datasetOption1 = d3.nest().key(function(d) { return d.Education; })
										.rollup(function(d) { return d.length; })
										.entries(approved_data);
										
				var total1 = 0;
				datasetOption1.forEach(function(d){total1 += d.value});           
				//console.log(total);
				datasetOption1.forEach(function(d) {
                						d.percentage = format(d.value/total1 * 100);
            					});
            					
            	console.log(datasetOption1);
										
				rejected_data = data.filter(function(d){ return d.Loan_Status == "Rejected" })
				console.log(approved_data[2]);
				
				datasetOption2 = d3.nest().key(function(d) { return d.Education; })
										.rollup(function(d) { return d.length; })
										.entries(rejected_data);
										
				var total2 = 0;
				datasetOption2.forEach(function(d){total2 += d.value});           
				//console.log(total);
				datasetOption2.forEach(function(d) {
                						d.percentage = format(d.value/total2 * 100);
            					});
            					
            	console.log(datasetOption2);
		
	
		// Initialize the plot with the first dataset
		//update(nestFilteredData)
		change(datasetTotal);

}


function selectDataset()
{
    var value = this.value;
    if (value == "total")
    {
        change(datasetTotal);
    }
    else if (value == "option1")
    {
        change(datasetOption1);
    }
    else if (value == "option2")
    {
        change(datasetOption2);
    }
}

function change(data) {




	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.key });

    slice.enter()
        .append('path')
        .attr('d', arc)
        .style("fill", function(d) { return color(d.data.key); })
        .attr("class", "slice")
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.key)+"<br>"+(d.data.percentage)+"%");
        })
        slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.key)+"<br>"+(d.data.percentage)+"%");
        })
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

   

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }



    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select('.lines').selectAll('polyline')
        .data(pie(data), function(d){ return d.data.key });

    polyline.enter()
        .append('polyline')
        .attr('points', function(d) {
  
                    // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });

    polyline.transition().duration(1000)
        .attrTween('points', function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();

 /* ------- TEXT LABELS -------*/

    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.key });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.key+": "+d.data.percentage+"%");
        })
        .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    });

        text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.key+": "+d.data.percentage+"%");
        });


    text.exit()
        .remove();
};