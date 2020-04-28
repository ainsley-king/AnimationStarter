var dur = 1000

var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}


var initAxes = function(lengths,target,xScale,yScale)
{    
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis")
    
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+lengths.margins.left+","
             +(lengths.margins.top+lengths.graph.height)+")")
    
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+lengths.margins.left+","
             +(lengths.margins.top)+")")
}

var updateAxes = function(target,xScale,yScale)
{
   var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale); 
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis)
}


var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    var lengths = {
        screen:screen,
        margins:margins,
        graph:graph
    }

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    initAxes(lengths,target,xScale,yScale);
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to display graphs.");
    
    

}



var updateGraph = function(students,target,lengths,xScale,yScale,xProp,yProp)
{
    
    console.log("Updating graph.");
    
    updateAxes(target,xScale,yScale);
    
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    //Join
    var circ = d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .data(students, function(entry){return entry.grade;})
    
    //Enter
    circ.enter()
        .append("circle");
    
    //Exit
    circ.exit()
        .remove();
    
    //Update
    
    //reselect
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .transition()
        .duration(dur)
        .attr("cx",function(student)
              {
            return xScale(getMeanGrade(student[xProp]));    
        })
        .attr("cy",function(student)
              {
            return yScale(getMeanGrade(student[yProp]));    
        })
        .attr("r",4);
}

var initButtons = function(students,target,xScale,yScale)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        var yScale = d3.scaleLinear()
        .domain([0,50])
        .range([345,0]);
        
        updateGraph(students,target,length,xScale,yScale,"final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        var xScale = d3.scaleLinear()
        .domain([50,0])
        .range([400,0]);
        
        updateGraph(students,target,length,xScale,yScale,"homework","test");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        updateGraph(students,target,length,xScale,yScale,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        var yScale = d3.scaleLinear()
        .domain([0,10])
        .range([345,0]);
        
        updateGraph(students,target,length,xScale,yScale,"test","quizes");
    })
    
}

var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}




var penguinPromise = d3.json("classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});
