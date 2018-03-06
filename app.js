// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
var svgWidth = 960;
var svgHeight = 560;

var margin = { top: 20, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.csv("data.csv", function(err, csv_data) {
    if (err) {
        throw err;
    }

    csv_data.forEach(function(data) {
        data.grad_degree= +data.grad_degree;
        data.salary = +data.salary;
    });
        // Create scale functions
        var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([0, d3.max(csv_data, function(data) {
        return +data.grad_degree;
    })]);
    yLinearScale.domain([0, d3.max(csv_data, function(data) {
        return +data.salary;
    })]);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var degree = +data.grad_degree;
            var hs = +data.hs_degree;
            var bs = +data.bs_degree;
            var salary = +data.salary;
            return ("<br> % With $50,000+ Salary: " + salary);
        });

    chart.call(toolTip);

    chart.selectAll("circle")
        .data(csv_data)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.grad_degree);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.salary);
        })
        .attr("r", "10")
        .attr("fill", "tomato")
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% With $50,000+ Salary");

    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axis-text active")
        .attr("data-axis-name", "grad_degree")
        .text("% With Graduate Degree");
    
    chart
        .append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")")
        // This axis label is inactive by default
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "hs_degree")
        .text("% With HS Degree or Below");

    chart
        .append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 60) + ")")
        // This axis label is inactive by default
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "bs_degree")
        .text("% With Bachelors or Higher");

    // Change an axis's status from inactive to active when clicked (if it was inactive)
    // Change the status of all active axes to inactive otherwise
    function labelChange(clickedAxis) {
        d3
            .selectAll(".axis-text")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        clickedAxis.classed("inactive", false).classed("active", true);
    }

    function findMinAndMax(dataColumnX) {
        return d3.extent(csv_data, function(data) {
            return +data[dataColumnX];
        });
    }

    d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
        var clickedSelection = d3.select(this);
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
        var clickedAxis = clickedSelection.attr("data-axis-name");
        console.log("current axis: ", clickedAxis);

        // The onclick events below take place only if the x-axis is inactive
        // Clicking on an already active axis will therefore do nothing
        if (isClickedSelectionInactive) {
            // Set the domain for the x-axis
            xLinearScale.domain(findMinAndMax(clickedAxis));
            svg
                .select(".x-axis")
                .transition()
                .duration(1800)
                .call(bottomAxis);
            d3.selectAll("circle").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("cx", function(data) {
                        return xLinearScale(+data[clickedAxis]);
                    })
                    .duration(1800);
            });

            labelChange(clickedSelection);
        }
    });
}); 