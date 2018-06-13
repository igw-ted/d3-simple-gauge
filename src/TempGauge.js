function initTempGauge(rootElement) {
    let element = d3.select("#" + rootElement);

    let width = +element.attr("g-width");
    let height = +element.attr("g-height");

    element.node().style.width = +element.attr("g-width") + "px";
    element.style("text-align", "center");

    let svg = element.append("svg")
                    .attr("id", rootElement + "-svg")
                    .attr("width", element.attr("g-width"))
                    .attr("height", element.attr("g-height"));

    updateTempGauge(rootElement, 0, 0, 0);
}

function updateTempGauge(rootElement, t1, t2, t3) {

    let element = d3.select("#" + rootElement);

    element.selectAll("path").remove();
    element.selectAll("span").remove();

    let width = +element.attr("g-width");
    let height = +element.attr("g-height");
    let thickness = Math.min(width, height) * 0.5;
    let minTemp = +element.attr("g-min");
    let maxTemp = +element.attr("g-max");

    let t1label, t2label, t3label, t1meter, t2meter, t3meter;

    let svg = d3.select("#" + rootElement + " > svg");

    if(t1 !== null) {
        t1label = t1;
        t1 = t1 > maxTemp ? maxTemp : t1;
        t1 = t1 < minTemp ? minTemp : t1;
        t1meter = (180/maxTemp * t1) - 90;

    } else {
        t1 = +element.select("t1label").text();
    }

    let temp1 = d3.arc().innerRadius(thickness * 1 - thickness * 0.2)
    .outerRadius(thickness * 1)
    .startAngle(-90 * (Math.PI/180))
    .endAngle(t1meter * (Math.PI/180));

    svg.append("path")
    .attr("id", "temp1")
    .attr("d", temp1)
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .attr("fill", element.selectAll("div:nth-child(1)").attr("g-color"));

    if(t2 !== null) {
        t2label = t2;
        t2 = t2 > maxTemp ? maxTemp : t2;
        t2 = t2 < minTemp ? minTemp : t2;
        t2meter = (180/maxTemp * t2) - 90;

    } else {
        t2 = +element.select("t2label").text();
    }

    let temp2 = d3.arc().innerRadius(thickness * 0.8 - thickness * 0.25)
    .outerRadius(thickness * 0.75)
    .startAngle(-90 * (Math.PI/180))
    .endAngle(t2meter * (Math.PI/180));

    svg.append("path")
    .attr("id", "temp2")
    .attr("d", temp2)
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .attr("fill", element.selectAll("div:nth-child(2)").attr("g-color"));

    if(t3 !== null) {
        t3label = t3;
        t3 = t3 > maxTemp ? maxTemp : t3;
        t3 = t3 < minTemp ? minTemp : t3;
        t3meter = (180/maxTemp * t3) - 90;

    } else {
        t1 = +element.select("t1label").text();
    }

    let temp3 = d3.arc().innerRadius(thickness * 0.6 - thickness * 0.3)
    .outerRadius(thickness * 0.5)
    .startAngle(-90 * (Math.PI/180))
    .endAngle(t3meter * (Math.PI/180));

    svg.append("path")
    .attr("id", "temp3")
    .attr("d", temp3)
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .attr("fill", element.selectAll("div:nth-child(3)").attr("g-color"));

    element.append("span")
            .attr("id", "t1label")
            .style("font-size", "2em")
            .style("margin-left", "10px")
            .style("margin-right", "10px")
            .style("font-family", "monospace")
            .style("position", "relative")
            .style("top", "-1em")
            .text(t1label);

    element.append("span")
            .attr("id", "t2label")
            .style("font-size", "2em")
            .style("margin-left", "10px")
            .style("margin-right", "10px")
            .style("font-family", "monospace")
            .style("position", "relative")
            .style("top", "-1em")
            .text(t2label);

    element.append("span")
            .attr("id", "t3label")
            .style("font-size", "2em")
            .style("margin-left", "10px")
            .style("margin-right", "10px")
            .style("font-family", "monospace")
            .style("position", "relative")
            .style("top", "-1em")
            .text(t3label);
}
