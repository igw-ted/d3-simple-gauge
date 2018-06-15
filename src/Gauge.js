class Gauge {

    /*
     *  Update the view.
     */
    update() {
        if(typeof this.debug !== "undefined") {
            this.toString();
        }
        if(this.varsHasErrors()) {
            return;
        }

        let element = d3.select("#" + this.rootElement);
        element.node().innerHTML = "";

        element.node().style.width = this.width + "px";
        element.node().style.height = this.height + "px";

        let svg = element.append("svg")
                        .attr("id", this.rootElement + "-svg")
                        .attr("width", this.width)
                        .attr("height", this.height);

        let orientation = this.orientation;
        switch(orientation) {
            case "north": orientation = 0; break;
            case "south": orientation = 180; break;
            case "east": orientation = 90; break;
            case "west": orientation = -90; break;
        }

        let thicknessBase = Math.min(this.width, this.height) * 0.5;

        let tick = (this.maxDegrees) / (this.maxValue / this.tickSize);

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

            svg.append("path")
            .attr("id", "arc-" + i)
            .attr("d", arc)
            .attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")")
            .attr("fill", color);

            d3.select("#" + this.labelElement).text(this.data + this.unit)
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

    setConfig(config) {
        this.rootElement = config.rootElement;
        this.labelElement = config.labelElement;
        this.width = config.width;
        this.height = config.height;
        this.thickness = config.thickness;
        this.tickSize = config.tickSize;
        this.tickThickness = config.tickThickness;
        this.offset = config.offset;
        this.orientation = config.orientation;
        this.unit = config.unit;
        this.minValue = config.minValue;
        this.maxValue = config.maxValue;
        this.allowOverflow = config.allowOverflow;
        this.allowUnderflow = config.allowUnderflow;
        this.maxDegrees = config.maxDegrees;
        this.data = config.data;
        this.color = config.color;
        this.overflowColor = config.overflowColor;
        this.underflowColor = config.underflowColor;
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

        if(typeof this.debug !== "undefined") {
            console.log();
        }

        return hasErrors;
    }
}
