async function init()

{

var margin = {top: 50, right: 20, bottom: 20, left: 150},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
 

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var r = 1.5
  
var xAxis = d3.axisBottom()
		.scale(x);

var yAxis = d3.axisLeft()
		.scale(y);
  
var color = d3.scaleOrdinal(d3.schemeCategory10).range(["green", "red"]);
var symbols = d3.scaleOrdinal(d3.symbols);

// creates a generator for symbols
var symbol = d3.symbol().size(100);  
  


  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //var tooltip = d3.select("body").append("div")
         // .attr("class", "tooltip")
         // .style("opacity", 0);


d3.csv('https://moumita4.github.io/Final_Lending_data.csv', function(d){
    d.LoanAmount = +d.LoanAmount;
    d.ApplicantIncome  = +d.ApplicantIncome;
    d.Gender  = d.Gender;
    d.Self_Employed  = d.Self_Employed;
    return d;
	}).then(function(data){

	x.domain(d3.extent(data, function(d){
		return d.ApplicantIncome;
	})).nice();

	y.domain(d3.extent(data, function(d){
		return d.LoanAmount;
	})).nice();
  
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x axis')
    .call(xAxis)
    .attr("stroke","white").attr("fill","white")

  g.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'y axis')
    .call(yAxis)
    .attr("stroke","white").attr("fill","white");

	g.append('text')
		.attr('x', 10)
		.attr('y', 10)
		.attr('class', 'label')
		.text('Loan Amount')
    .attr("stroke","white").attr("fill","white");

	g.append('text')
		.attr('x', width)
		.attr('y', height - 10)
		.attr('text-anchor', 'end')
    .attr("stroke","white").attr("fill","white")
		.attr('class', 'label')
		.text('Applicant Income');
		
		
// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
var div = d3.select("#my_dataviz").append("div")
    .attr("class", "tooltip")
   .style("opacity", 1);
    
var mouseleave = function(d) {
    	//tooltip
    	div
     // .transition()
      //.duration(200)
      .style("opacity", 0)
  }
  

  	
  // we use the ordinal scale symbols to generate symbols
  // such as d3.symbolCross, etc..
  // -> symbol.type(d3.symbolCross)()
    g.selectAll(".symbol")
    .data(data)
  .enter().append("path")
    .attr("class", "symbol")
    .attr("d", function(d, i) { return symbol.type(symbols(d.Loan_Status))(); })
    .style("fill", function(d) { return color(d.Loan_Status); })
    .attr("transform", function(d) { 
      return "translate(" + x(d.ApplicantIncome) + "," + y(d.LoanAmount) +")"; 
    })
    .on("mouseover", function(d) {
       div
       .transition()
       .duration(20)
         .style("opacity", .9);
       div .html("Gender:"+
         d.Gender + // The first <a> tag
         "<br/>"  + 
         "SelfEmployed:"+
         d.Self_Employed)     
         .style("left", (d3.event.pageX) + "px")             
         .style("top", (d3.event.pageY - 28) + "px");
       })
      .on("mouseleave", mouseleave );
  
 
  var clicked = ""
  
  var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

  legend.append("path")
    .style("fill", function(d) { return color(d); })
    	.attr("d", function(d, i) { return symbol.type(symbols(d))(); })
	    .attr("transform", function(d, i) { 
    		return "translate(" + (width + 90) + "," + 80 + ")";
  		})
  		.on("click",function(d){
   d3.selectAll(".symbol").style("opacity",1)
   
   
   if (clicked !== d){
     d3.selectAll(".symbol")
       .filter(function(e){
       return e.Loan_Status !== d;
     })
       .style("opacity",0.1)
     clicked = d
   }
    else{
      clicked = ""
    }
  });
 
  legend.append("text")
      .attr("x", width + 70)
      .attr("y", 80)
      .attr("dy", ".40em")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .attr("fill","white");

});

const annotationsRight = [
  {
    note: {
      //label: "Here is the annotation label",
      title: "85K income applicant got rejected, seems to be an outlier",
      wrap: 110,
      padding: 3
    },
    connector: {
      end: "arrow",        // none, or arrow or dot
      type: "line",       // Line or curve
      points: 1,           // Number of break in the curve
      lineType : "horizontal"
    },
    color: ["yellow"],
    x: 720,
    y: 270,
    dy: 50,
    dx: 35
  }
]

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