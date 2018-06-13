function initPercentGauge(rootElement) {
    let element = d3.select("#" + rootElement);

    let width = +element.attr("g-width");
    let height = +element.attr("g-height");

    element.node().style.width = +element.attr("g-width") + "px";
    element.style("text-align", "center");

    let svg = element.append("svg")
                    .attr("id", rootElement + "-svg")
                    .attr("width", element.attr("g-width"))
                    .attr("height", element.attr("g-height"));

    updatePercentGauge(rootElement, 0, 0, 0);
}

function updatePercentGauge(rootElement, p1, p2) {


    let element = d3.select("#" + rootElement);

    element.selectAll("path").remove();
    element.selectAll("span").remove();

    let width = +element.attr("g-width");
    let height = +element.attr("g-height");
    let thickness = Math.min(width, height) * 0.5;

    let p1label, p2label, t3label, p1meter, p2meter, t3meter;

    let svg = d3.select("#" + rootElement + " > svg");

    if(p1 !== null) {
        p1label = p1;
        p1 = p1 > 100 ? 100 : p1;
        p1 = p1 < 0 ? 0 : p1;
        p1meter = (300/100 * p1) - 150;

    } else {
        p1 = +element.select("p1label").text();
    }

    let temp1 = d3.arc().innerRadius(thickness * 1 - thickness * 0.3)
    .outerRadius(thickness * 1)
    .startAngle(-150 * (Math.PI/180))
    .endAngle(p1meter * (Math.PI/180));

    svg.append("path")
    .attr("id", "temp1")
    .attr("d", temp1)
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .attr("fill", element.selectAll("div:nth-child(1)").attr("g-color"));

    if(p2 !== null) {
        p2label = p2;
        p2 = p2 > 100 ? 100 : p2;
        p2 = p2 < 0 ? 0 : p2;
        p2meter = (300/100 * p2) - 150;

    } else {
        p2 = +element.select("p2label").text();
    }

    let perc2 = d3.arc().innerRadius(thickness * 0.7 - thickness * 0.35)
    .outerRadius(thickness * 0.65)
    .startAngle(-150 * (Math.PI/180))
    .endAngle(p2meter * (Math.PI/180));

    svg.append("path")
    .attr("id", "perc2")
    .attr("d", perc2)
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .attr("fill", element.selectAll("div:nth-child(2)").attr("g-color"));

    element.append("span")
            .attr("id", "p1label")
            .style("font-size", "2em")
            .style("margin-left", "10px")
            .style("margin-right", "10px")
            .style("font-family", "monospace")
            .style("position", "relative")
            .style("top", "-2em")
            .text(p1label);

    element.append("span")
            .attr("id", "p2label")
            .style("font-size", "2em")
            .style("margin-left", "10px")
            .style("margin-right", "10px")
            .style("font-family", "monospace")
            .style("position", "relative")
            .style("top", "-2em")
            .text(p2label);

}
