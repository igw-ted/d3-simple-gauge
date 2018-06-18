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

        let tickLabelPadding = 0;

        if(this.showTickLabels) {
            tickLabelPadding = 40;
        }

        let element = d3.select("#" + this.rootElement);
        element.node().innerHTML = "";

        element.node().style.width = this.width + "px";
        element.node().style.height = (this.height + tickLabelPadding * 3) + "px";

        this.svg = element.append("svg")
                        .attr("id", this.rootElement + "-svg")
                        .attr("width", this.width - tickLabelPadding)
                        .attr("height", this.height + tickLabelPadding * 3);

        let thicknessBase = Math.min(this.width, this.height) * 0.5;
        let tick = (this.maxDegrees) / (this.maxValue / this.tickSize);


        let orientation = this.orientation;
        switch(orientation) {
            case "north": orientation = 0; break;
            case "south": orientation = 180; break;
            case "east": orientation = 90; break;
            case "west": orientation = -90; break;
        }


        let data = this.data;
        data = this.data > this.maxValue ? this.maxValue : this.data;
        data = this.data < this.minValue ? this.minValue : this.data;

        for(let i = 0; i < Math.abs(data / this.tickSize); i++) {

            let startAngle, endAngle;

            if(this.data > 0) {
                startAngle = (orientation + (tick * i)) * Math.PI/180;
                endAngle = (orientation + (tick * i) + this.tickThickness) * Math.PI/180;
            }
            else {
                startAngle = (orientation - tick + (tick * i * -1)) * Math.PI/180;
                endAngle = (orientation  - tick + (tick * i * -1) + this.tickThickness) * Math.PI/180;
            }

            let arc = d3.arc().innerRadius(thicknessBase - this.offset - thicknessBase * this.thickness / 10)
            .outerRadius(thicknessBase - this.offset)
            .startAngle(startAngle)
            .endAngle(endAngle);

            let color = this.color;

            if(this.data > this.maxValue) {
                color = this.overflowColor;
            }
            else if(this.data < this.minValue) {
                color = this.underflowColor;
            }

            this.svg.append("path")
            .attr("id", "arc-" + i)
            .attr("d", arc)
            .attr("transform", "translate(" + (this.width - tickLabelPadding)/2 + "," + (this.height - tickLabelPadding)/2 + ")")
            .attr("fill", color);

        }

        if(this.showTickLabels) {
            this.setTickLabels(thicknessBase, orientation, tick, tickLabelPadding);
        }
        d3.select("#" + this.labelElement).text(this.data + this.unit)
    }

    setTickLabels(thicknessBase, orientation, tick, tickLabelPadding) {

        let startAngle, endAngle;

        for(let i = 0; i <= Math.floor(Math.abs(this.maxValue - this.minValue) / this.tickSize); i++) {

            let label = this.minValue + (i * this.tickSize);

            if(label % this.tickModulus !== 0) {
                continue;
            }

            let angleOffset = label > 0 ? 5 : 5;

            startAngle = (orientation - tick + angleOffset + (tick * i * -1)) * Math.PI/-180;
            endAngle = (orientation  - tick + angleOffset + (tick * i * -1) + this.tickThickness) * Math.PI/-180;

            let offset = label > 0 ? this.offset + 5 : this.offset;

            let arc = d3.arc().innerRadius(thicknessBase - offset + 50 - thicknessBase * this.thickness / 10)
            .outerRadius(thicknessBase - offset + 10)
            .startAngle(startAngle)
            .endAngle(endAngle);

            let scale = this.minValue + (i * this.tickSize) > 0 ? "-1 1" : "1 1";

            if(label > 0) {
                label = this.maxValue - (this.minValue + (i * this.tickSize));
            }

            this.svg.append("path")
            .attr("id", "arc-label-" + i)
            .attr("d", arc)
            .attr("transform", "translate(" + (this.width - tickLabelPadding)/2 + "," + (this.height - tickLabelPadding)/1.5 + ")scale(" + scale + ")")
            .attr("fill", "rgba(0,0,0,0)");

            let text = this.svg.append("text")
            .style("font-size", "7px");

            text.append("textPath")
            .attr("xlink:href", "#arc-label-" + i)
            .attr("startOffset", "10%")
            .attr("text-anchor", "start")
            .text(label);
        }
    }

    /*
     *  The unit to be shown after the label..
     */
    setUnit(unit) {
        this.unit = unit;
    }

    /*
     *  The minimum value of the gauge.
     */
    setMinValue(value) {
        this.minValue = +value;
    }

    /*
     *  The maximum value of the gauge.
     */
    setMaxValue(value) {
        this.maxValue = +value;
    }

    /*
     *  Enable debug.
     */
    setDebug() {
        this.debug = 1;
    }

    /*
     *  Disable debug.
     */
    unsetDebug() {
        delete this.debug;
    }

    /*
     *  Set the root element for the gauge. Needs to be unique.
     */
    setRootElement(rootElement) {
        this.rootElement = rootElement;
    }

    /*
     *  Where to output the label. Need to be unique.
     */
    setLabelElement(labelElement) {
        this.labelElement = labelElement;
    }

    /*
     *  Set the width for the gauge.
     */
    setWidth(width) {
        this.width = +width;
    }

    /*
     *  Set the height of the gauge.
     */
    setHeight(height) {
        this.height = +height;
    }

    /*
     *  Set the stroke thickness of the gauge.
     */
    setThickness(thickness) {
        this.thickness = +thickness;
    }

    /*
     *  Set the size of the tick..
     */
    setTickSize(tickSize) {
        this.tickSize = +tickSize;
    }

    /*
     *  Set the orientation of the gauge with the
     *  variable from the help method orientation().
     *
     *  May also be any number corresponding degrees.
     */
    setOrientation(orientation) {
        this.orientation = +orientation;
    }

    /*
     *  Allow overflow. If set, then anything above
     *  maxValue is depicted by the ">" caracter in the label.
     */
    setAllowOverflow(allowOverflow) {
        this.allowOverflow = allowOverflow;
    }

    /*
     *  Allow underflow. If set, then anything above
     *  minValue is depicted by the "<" caracter in the label.
     */
    setAllowUnderflow(allowUnderflow) {
        this.allowUnderflow = allowUnderflow;
    }

    /*
     *  Max degrees of the gauge. Allows for non-full circles.
     */
    setMaxDegrees(maxDegrees) {
        this.maxDegrees = maxDegrees;
    }

    setData(data) {
        this.data = data;
    }

    setColor(color) {
        this.color = color;
    }

    setShowTickLabels(showTickLabels) {
        this.showTickLabels = showTickLabels;
    }

    setTickModulus(tickModulus) {
        this.tickModulus = tickModulus;
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

    setDefaults(config) {
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
    }



    error(message) {
        console.log("ERROR: " + message);
    }

    toString() {
        console.log();
        console.log("Root Element: " + this.rootElement);
        console.log("Width: " + this.width);
        console.log("Height: " + this.height);
        console.log("Thickness: " + this.thickness);
        console.log("Tick Size: " + this.tickSize);
        console.log("Tick Margin: " + this.tickThickness);
        console.log("Tick Margin: " + this.offset);
        console.log("Orientation: " + this.orientation);
        console.log("Unit: " + this.unit);
        console.log("Min Value: " + this.minValue);
        console.log("Max Value: " + this.maxValue);
        console.log("Allow Overflow: " + this.allowOverflow);
        console.log("Allow Underflow: " + this.allowUnderflow);
        console.log("Maximum Degrees: " + this.maxDegrees);
        console.log("Data: " + this.data);
        console.log("Color: " + this.color);
        console.log("Overflow Color: " + this.overflowColor);
        console.log("Underflow Color: " + this.underflowColor);
        console.log("Show Tick Labels: " + this.showTickLabels);
        console.log("Tick Modulus: " + this.tickModulus);
        console.log();
    }

    varsHasErrors() {

        let hasErrors = false;

        if(typeof this.debug !== "undefined") {
            console.log()
        }
        if(typeof this.rootElement === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("rootElement must be set");
            }
            hasErrors = true;
        }

        if(typeof this.labelElement === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("labelElement must be set");
            }
            hasErrors = true;
        }

        if(typeof this.width === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("width must be set");
            }
            hasErrors = true;
        }

        if(typeof this.height === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("height must be set");
            }
            hasErrors = true;
        }

        if(typeof this.thickness === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("thickness must be set");
            }
            hasErrors = true;
        }

        if(typeof this.tickSize === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("tickSize must be set");
            }
            hasErrors = true;
        }

        if(typeof this.tickThickness === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("tickThickness must be set");
            }
            hasErrors = true;
        }

        if(typeof this.offset === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("offset must be set");
            }
            hasErrors = true;
        }

        if(typeof this.orientation === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("orientation must be set");
            }
            hasErrors = true;
        }

        if(typeof this.unit === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("unit must be set");
            }
            hasErrors = true;
        }

        if(typeof this.minValue === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("minValue must be set");
            }
            hasErrors = true;
        }

        if(typeof this.maxValue === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("maxValue must be set");
            }
            hasErrors = true;
        }

        if(typeof this.allowOverflow === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("allowOverflow must be set");
            }
            hasErrors = true;
        }

        if(typeof this.allowUnderflow === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("allowUnderflow must be set");
            }
            hasErrors = true;
        }

        if(typeof this.maxDegrees === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("maxDegrees must be set");
            }
            hasErrors = true;
        }

        if(typeof this.data === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("data must be set");
            }
            hasErrors = true;
        }

        if(typeof this.color === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("color must be set");
            }
            hasErrors = true;
        }

        if(typeof this.overflowColor === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("overflowColor must be set");
            }
            hasErrors = true;
        }

        if(typeof this.underflowColor === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("underflowColor must be set");
            }
            hasErrors = true;
        }

        if(typeof this.showTickLabels  === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("showTickLabels  must be set");
            }
            hasErrors = true;
        }

        if(typeof this.tickModulus  === "undefined") {
            if(typeof this.debug !== "undefined") {
                this.error("tickModulus  must be set");
            }
            hasErrors = true;
        }

        if(typeof this.debug !== "undefined") {
            console.log();
        }

        return hasErrors;
    }
}
