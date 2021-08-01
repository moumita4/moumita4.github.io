async function init() {



path = 'https://moumita4.github.io/Final_Lending_data.csv'
var  data = await d3.csv(path)

console.log(data[2]);

new_data = data.filter(function(d){ return d.Loan_Status == "Approved" })
console.log(new_data[2]);


var nestData = d3.nest()
.key(function(d) { return d.Education; })

.rollup(function(d) { return d.length; })
.entries(new_data);

console.log(nestData);

var total = 0;
nestData.forEach(function(d){total += d.value});
            
console.log(total);
var format = d3.format(".1f")
nestData.forEach(function(d) {
                d.percentage = format(d.value/total * 100);
            });
  
console.log(nestData);




//var data = [4,8,15,16,23,42];
var color = ['blue','orange'];
//var pie = d3.pie();
var pie = d3.pie().value(function(d){return d.value;});
var arc = d3.arc().innerRadius(0).outerRadius(100);

var svg = d3.select("svg"),
			margin = {top: 20, right: 20, bottom: 70, left: 150},
         width = +svg.attr("width")  - margin.left - margin.right,
         height = +svg.attr("height") - margin.top - margin.bottom
        radius = Math.min(width, height) / 2 - margin,
        g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

g.selectAll("path")
                .data(pie(nestData))
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill",function(d,i) {return color[i];})
               // .append('text')
               // .text(function(d){ return "grp " + d.key})
               // .style("text-anchor", "middle")
               // .style("font-size", 17)
                
g.data(pie(nestData))
.append('text')
 // .text(function(d){ return d.data.key})
  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
  .attr("fill", "white")
  //.attr("dy", ".35em")
  .text(function(d) { return d.data.percentage + "%"; })
  .style("text-anchor", "middle")
  .style("font-size", 15)
                
                
  //change formatting
    
                d3.select("svg").append("text") 
                     .attr("x", 400)
                     .attr("y", 80)
                     .text("Education:").attr("fill","white");
                d3.select("svg").append("rect").attr("x",400).attr("y",100).attr("height",10).attr("width",10).attr("fill","blue")
                 d3.select("svg").append("text") 
                     .attr("x", 420)
                     .attr("y", 110)
                     .text("Graduate").attr("fill","white");
                 d3.select("svg").append("rect").attr("x",400).attr("y",140).attr("height",10).attr("width",10).attr("fill","orange")
                 d3.select("svg").append("text") 
                     .attr("x", 420)
                     .attr("y", 150)
                     .text("Not Graduate").attr("fill","white");
    



}