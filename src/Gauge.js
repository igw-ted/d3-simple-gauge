class Gauge {

    constructor() {
        this.setDefaults();
    }

    /*
     *  Update the view.
     */
    update() {
        if(typeof this.debug !== "undefined") {
            this.toString();
            if(this.varsHasErrors()) {
                return;
            }
        }

        let vars = this.prepareVars();

        if(typeof this.background !== "undefined") {
            this.drawBackground(vars);
        }

        if(typeof this.tickModulus !== "undefined") {
            this.drawTicks(vars);
        }

        for(let i = 0; i < Math.abs(vars.data / this.tickSize); i++) {
            let startAngle, endAngle;

            if(vars.data > 0) {
                startAngle = (vars.orientation + (vars.tick * i)) * Math.PI/180;
                endAngle = (vars.orientation + (vars.tick * i) + this.tickThickness) * Math.PI/180;
            }
            else {
                startAngle = (vars.orientation - vars.tick + (vars.tick * i * -1)) * Math.PI/180;
                endAngle = (vars.orientation  - vars.tick + (vars.tick * i * -1) + this.tickThickness) * Math.PI/180;
            }

            let arc = d3.arc().innerRadius(vars.thicknessBase - this.offset - vars.thicknessBase * this.thickness / 10)
            .outerRadius(vars.thicknessBase - this.offset)
            .startAngle(startAngle)
            .endAngle(endAngle);

            this.svg.append("path")
            .attr("id", "arc-" + i)
            .attr("d", arc)
            .attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")")
            .attr("fill", vars.color);

        }

        this.populateLabels();
    }

    /*
     *  Create a variable object to be used when drawing the gauge.
     */
     prepareVars() {
         let element = this.createRootElements();

         let thicknessBase = Math.min(this.width, this.height) * 0.5;
         let tick = (this.maxDegrees) / (this.maxValue / this.tickSize);

         let data = this.data;
         data = this.data > this.maxValue ? this.maxValue : this.data;
         data = this.data < this.minValue ? this.minValue : this.data;

         let color = this.color;

         if(this.data > this.maxValue) {
             color = this.overflowColor;
         }
         else if(this.data < this.minValue) {
             color = this.underflowColor;
         }

         let orientation = this.orientation;

         switch(orientation) {
             case "north": orientation = 0; break;
             case "south": orientation = 180; break;
             case "east": orientation = 90; break;
             case "west": orientation = -90; break;
         }

         return {
             element: element,
             thicknessBase: thicknessBase,
             tick: tick,
             data: data,
             color: color,
             orientation: orientation

         }
     }

    /*
     *  Create the root elements
     */
    createRootElements() {
        let element = d3.select("#" + this.rootElement);
        element.node().innerHTML = "";

        element.node().style.width = this.width + "px";
        element.node().style.height = (this.height * 3) + "px";

        this.svg = element.append("svg")
                        .attr("id", this.rootElement + "-svg")
                        .attr("width", this.width)
                        .attr("height", this.height * 3);
        return element;
    }

    /*
     *  Draw a background.
     */
    drawBackground(vars) {
        let startAngle = vars.orientation * Math.PI/180;
        let endAngle;

        let endDegrees = this.backgroundFill === "full" ? 360 : this.maxDegrees;

        if(this.data > 0) {
            endAngle = (vars.orientation + endDegrees) * Math.PI/180;
        }
        else {
            endAngle = (vars.orientation - endDegrees) * Math.PI/180;
        }

        let arc = d3.arc().innerRadius(vars.thicknessBase - this.offset - vars.thicknessBase * this.thickness / 10)
        .outerRadius(vars.thicknessBase - this.offset)
        .startAngle(startAngle)
        .endAngle(endAngle);

        this.svg.append("path")
        .attr("d", arc)
        .attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")")
        .attr("fill", this.background);
    }

    /*
     *  Draw the ticks, if requested.
     */
    drawTicks(vars) {

    }

    /*
     *  Populate the label tags.
     */
    populateLabels() {
        d3.select("#" + this.labelElement).text(this.data + this.unit);
    }

    /*
     *  Orientation help variables.
     */
    orientationVar() {
        return {
            NORTH: "north",
            SOUTH: "south",
            EAST: "east",
            WEST: "west"
        }
    }

    /*
     *  Set default values.
     */
    setDefaults() {
        this.width = 300;
        this.height = 300;
        this.thickness = 3;
        this.tickSize = 1;
        this.tickThickness = 3;
        this.offset = 0;
        this.orientation = this.orientationVar().NORTH;
        this.unit = "";
        this.minValue = -50;
        this.maxValue = 50;
        this.allowOverflow = true;
        this.allowUnderflow = true;
        this.maxDegrees = 360;
        this.color = "#aaa";
        this.overflowColor = "#aaa";
        this.underflowColor = "#aaa";
        this.showTickLabels = false;
        this.tickModulus = 10;
        this.background = "rgba(0,0,0,0)";
        this.backgroundFill = "maxDegrees";
    }

    /*
     *  Parse the config file.
     */
    setConfig(config) {
        this.rootElement = typeof config.rootElement === "undefined" ? this.rootElement : config.rootElement;
        this.labelElement = typeof config.labelElement === "undefined" ? this.labelElement : config.labelElement;
        this.width = typeof config.width === "undefined" ? this.width : config.width;
        this.height = typeof config.height === "undefined" ? this.height : config.height;
        this.thickness = typeof config.thickness === "undefined" ? this.thickness : config.thickness;
        this.tickSize = typeof config.tickSize === "undefined" ? this.tickSize : config.tickSize;
        this.tickThickness = typeof config.tickThickness === "undefined" ? this.tickThickness : config.tickThickness;
        this.offset = typeof config.offset === "undefined" ? this.offset : config.offset;
        this.orientation = typeof config.orientation === "undefined" ? this.orientation : config.orientation;
        this.unit = typeof config.unit === "undefined" ? this.unit : config.unit;
        this.minValue = typeof config.minValue === "undefined" ? this.minValue : config.minValue;
        this.maxValue = typeof config.maxValue === "undefined" ? this.maxValue : config.maxValue;
        this.allowOverflow = typeof config.allowOverflow === "undefined" ? this.allowOverflow : config.allowOverflow;
        this.allowUnderflow = typeof config.allowUnderflow === "undefined" ? this.allowUnderflow : config.allowUnderflow;
        this.maxDegrees = typeof config.maxDegrees === "undefined" ? this.maxDegrees : config.maxDegrees;
        this.data = typeof config.data === "undefined" ? this.data : config.data;
        this.color = typeof config.color === "undefined" ? this.color : config.color;
        this.overflowColor = typeof config.overflowColor === "undefined" ? this.overflowColor : config.overflowColor;
        this.underflowColor = typeof config.underflowColor === "undefined" ? this.underflowColor : config.underflowColor;
        this.showTickLabels = typeof config.showTickLabels === "undefined" ? this.showTickLabels : config.showTickLabels;
        this.tickModulus = typeof config.tickModulus === "undefined" ? this.tickModulus : config.tickModulus;
        this.background = typeof config.background === "undefined" ? this.background : config.background;
        this.backgroundFill = typeof config.backgroundFill === "undefined" ? this.backgroundFill : config.backgroundFill;
    }
}
