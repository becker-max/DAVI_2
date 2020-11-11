    // The svg
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(140)
        .center([25, -20])
        .translate([width / 2, height / 4 * 3]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([50, 55, 60, 65, 70, 75, 80])
        //.domain([1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000])
        .range(d3.schemeOranges[7]);

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "./data/Dataset_klein.csv")
        .await(ready);

    function ready(error, topo, test) {
        
        console.log(test);
        
    var overall = d3.nest()
        .key(function(d) { return d.cc; })
        .rollup(function(v) { return Math.round(d3.mean(v, function(d) { return parseInt(d.overall); })); })
        .object(test);
        
        data = d3.map(overall);
        
        console.log(data);

        /*
        var options = d3.keys(test[0]);
        
        console.log(options);
        */
        
        var options = ["overall","value_eur","wage_per_week"];

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(options)
            .enter()
            .append('option')
            .text(function (d) {
                if (d == "overall"){ return "Players average overall rating" }
                else if (d == "value_eur"){ return "Players average value in EUR" }
                else if (d == "wage_per_week"){ return "Players average wage per week in EUR" }
                else return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned by the button
        
                // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            console.log(selectedOption);
            // run the updateChart function with this selected option
            update(error, topo, test, selectedOption)
        })
        
        d3.select("#clickMe").on("click", function(d){
            //get stuff
                var selectedOption = d3.select("#selectButton").property("value");
            
                var field = document.getElementById("position").value;
                var ratA = document.getElementById("rating_from").value;
                var ratB = document.getElementById("rating_to").value;
                var ageA = document.getElementById("age_from").value;
                var ageB = document.getElementById("age_to").value;
                //var valueType = document.getElementById("selectButton").value;
                var values = [field,ratA,ratB,ageA,ageB];
            
                //alert(values[0]+values[1]+values[2]+values[3]+values[4]+values[5]);
            
                update2(error, topo, test, selectedOption, values)
        })
        
        
        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1.0)
                .style("stroke", "black")

            d3.select(".tooltip")
                .style("display", "block")
                //.style("left", xPos + "px")
                //.style("top", yPos + "px")
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html("Country Code: " + d.id + " " + "Result: " + data.get(d.id))

        }

        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
            d3.select(".tooltip")
                .style("display", "none")
                .html("")

        }

        d3.select("#circleBasicTooltip")
            .on("mouseover", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (event.pageY - 800) + "px").style("left", (event.pageX - 800) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            //.attr("data", d3.csv("./data/Dataset_Country - Durchschnitte.csv"))
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })

            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .style("opacity", 1.0)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
    }


 function update(error, topo, test, selectedOption) {
        
      // Create new data with the selection
     
     console.log(test);
     
     console.log(selectedOption);
     
     var temp = String(selectedOption);
     
    var overall = d3.nest()
        .key(function(d) { return d.cc; })
        .rollup(function(v) { return Math.round(d3.mean(v, function(d) { return parseInt(d[temp]); })); })
        .object(test);
        
        data = d3.map(overall);
        
        console.log(data);
     
    
    //Change domain and colorscales since value and wage per week are bigger values then mean overall
     
     if (selectedOption == "value_eur"){
         
        var colorScale = d3.scaleThreshold()
        .domain([1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000])
        .range(d3.schemeOranges[7]);
         

     } else if(selectedOption == "overall"){
         
        var colorScale = d3.scaleThreshold()
        .domain([50, 55, 60, 65, 70, 75, 80])
        .range(d3.schemeOranges[7]);
         
     } else if (selectedOption == "wage_per_week"){
         
        var colorScale = d3.scaleThreshold()
        .domain([1000, 2000, 3000, 4000, 5000, 10000, 20000])
        .range(d3.schemeOranges[7]);
         
     }
         

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1.0)
                .style("stroke", "black")

            d3.select(".tooltip")
                .style("display", "block")
                //.style("left", xPos + "px")
                //.style("top", yPos + "px")
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html("Country Code: " + d.id + " " + "Result: " + data.get(d.id))

        }
        
        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
            d3.select(".tooltip")
                .style("display", "none")
                .html("")

        }

        d3.select("#circleBasicTooltip")
            .on("mouseover", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (event.pageY - 800) + "px").style("left", (event.pageX - 800) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })

            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .style("opacity", 1.0)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
      
    }

function update2(error, topo, test, selectedOption, values) {
        
      // Create new data with the selection
     
    console.log(test);
    console.log(values);
    
    var filteredTest = test;
    
    if (parseInt(values[1]) > parseInt(values[2])){
        alert("Rating Bis ist kleiner als Rating Von, bitte korrigieren");
        return;
    }
    if (parseInt(values[3]) > parseInt(values[4])){
        alert("Alter Bis ist kleiner als Alter Von, bitte korrigieren");
        return;
    }
    
    
    
    if (values[0] !== ""){
        filteredTest = filteredTest.filter(function(d){return d.field == values[0]});
    }
    
    filteredTest = filteredTest.filter(function(d){return d.overall >= parseInt(values[1])});
    if (parseInt(values[2]) > 0){
        filteredTest = filteredTest.filter(function(d){return d.overall <= parseInt(values[2])});
    }
    
    filteredTest = filteredTest.filter(function(d){return d.gge >= parseInt(values[3])});
    if (parseInt(values[4]) > 0){
        filteredTest = filteredTest.filter(function(d){return d.gge <= parseInt(values[4])});
    }
    
    console.log(filteredTest);
     
     var temp = String(selectedOption);
     
    var overall = d3.nest()
        .key(function(d) { return d.cc; })
        .rollup(function(v) { return Math.round(d3.mean(v, function(d) { return parseInt(d[temp]); })); })
        .object(filteredTest);
        
        data = d3.map(overall);
        
        console.log(data);
     
    
    //Change domain and colorscales since value and wage per week are bigger values then mean overall
     
     if (selectedOption == "value_eur"){
         
        var colorScale = d3.scaleThreshold()
        .domain([1000000,2000000,3000000,4000000,5000000,6000000,7000000,8000000])
        .range(d3.schemeOranges[7]);
         
         
     } else if(selectedOption == "overall"){
         
        var colorScale = d3.scaleThreshold()
        .domain([50, 55, 60, 65, 70, 75, 80])
        .range(d3.schemeOranges[7]);
         
     } else if (selectedOption == "wage_per_week"){
         
        var colorScale = d3.scaleThreshold()
        .domain([1000, 2000, 3000, 4000, 5000, 10000, 20000])
        .range(d3.schemeOranges[7]);
         
     }
         

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")

            d3.select(".tooltip")
                .style("display", "block")
                //.style("left", xPos + "px")
                //.style("top", yPos + "px")
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html("Country Code: " + d.id + " " + "Result: " + data.get(d.id))

        }
        
        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
            d3.select(".tooltip")
                .style("display", "none")
                .html("")

        }

        d3.select("#circleBasicTooltip")
            .on("mouseover", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (event.pageY - 800) + "px").style("left", (event.pageX - 800) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            })

            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .style("opacity", 1.0)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
      
    }
