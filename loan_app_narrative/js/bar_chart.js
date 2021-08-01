async  function init() {

    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 70, left: 150},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);
var z = d3.scaleOrdinal().range(["blue", "red"]);    

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var zKeys = ["Approved","Rejected"];

path = 'https://moumita4.github.io/Final_Lending_data.csv'
var  data = await d3.csv(path)

console.log(data[2]);


var nestData = d3.nest()
.key(function(d) { return d.Dependents; })
.key(function(d) { return d.Loan_Status; })

.rollup(function(leaves) { return leaves.length; })
.entries(data);

console.log(nestData);

var flatData = [];
nestData.forEach(function(d) {
    var obj = { Dependents: d.key }
        d.values.forEach(function(f) {
            obj[f.key] = f.value;
        });
    flatData.push(obj);
  });
  
console.log(flatData);

 x.domain(flatData.map(function(d) { return d.Dependents; }));
    y.domain([0, d3.max(nestData, function(d){return d3.sum(d.values, function(d){return d.value})})+20]);
    z.domain(zKeys) 
    
    
const annotationsRight = [
  {
    note: {
      //label: "Here is the annotation label",
      title: "58% approved loans -> borrowers with 0 dependents",
      wrap: 110,
      padding: 3
    },
    connector: {
      end: "arrow",        // none, or arrow or dot
      type: "curve",       // Line or curve
      points: 3,           // Number of break in the curve
      lineType : "horizontal"
    },
    color: ["yellow"],
    x: 250,
    y: 160,
    dy: 80,
    dx: 220
  }
]



var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(zKeys)(flatData))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Dependents); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
  	  .on("mouseout", function() { tooltip.style("display", "none"); })
  	   .on("mousemove", function(d) {
    		var xPosition = d3.mouse(this)[0] + 120;
    		var yPosition = d3.mouse(this)[1] + 5;
    		tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    		tooltip.select("text").text(d[1] - d[0]);
  		});
      
 g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("stroke","white").attr("fill","white")
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("text-anchor", "start")
      .attr("style","font-size:15px;")
      .text("No of dependents");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .attr("stroke","white").attr("fill","white")
    .append("text")
      //.attr("x", 2)
      //.attr("y", y(y.ticks().pop()) + 0.5)
      //.attr("dy", "0.32em")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+100)
      .attr("x", -margin.top -80)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("style","font-size:15px;")
      .text("Total Loans");



      
    //change formatting
    
                d3.select("svg").append("text") 
                     .attr("x", 370)
                     .attr("y", 60)
                     .text("Status:").attr("fill","white");
                d3.select("svg").append("rect").attr("x",370).attr("y",80).attr("height",10).attr("width",10).attr("fill","blue")
                 d3.select("svg").append("text") 
                     .attr("x", 390)
                     .attr("y", 90)
                     .text("Approved").attr("fill","white");
                 d3.select("svg").append("rect").attr("x",470).attr("y",80).attr("height",10).attr("width",10).attr("fill","red")
                 d3.select("svg").append("text") 
                     .attr("x", 490)
                     .attr("y", 90)
                     .text("Rejected").attr("fill","white");
    
                     
    //tooltip stuff//
    
    // Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .attr("fill", "white")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");
  
// Add annotation to the chart
const makeAnnotationsRight = d3.annotation()
  .annotations(annotationsRight)
d3.select("svg")
  .append("g")
  .call(makeAnnotationsRight)
  
  d3.select("svg").selectAll(".connector")
  .attr('stroke', "yellow")
  .style("stroke-dasharray", ("3, 3"))
  d3.select("svg").selectAll(".connector-end")
  .attr('stroke', "yellow")
  .attr('fill', "yellow")


    

}