class Gauge {

    constructor() {
        this.setDefaults();
    }

    /*
     *  Update the view.
     */
    update(data) {

        if(typeof data !== "undefined") {
            this.data = data;
        }

        if(typeof this.debug !== "undefined") {
            this.toString();
            if(this.varsHasErrors()) {
                return;
            }
        }

        let vars = this.prepareVars();

        if(typeof this.tickModulus !== "undefined") {
            this.drawTicks(vars);
            this.drawTickBackground();
        }

        if(typeof this.background !== "undefined") {
            this.drawBackground(vars);
        }
        if(typeof this.dataFillType === "undefined") {

            let data = vars.data;

            if(typeof this.allowOverflow === "undefined" || !this.allowOverflow) {
                if(data > this.maxValue) {
                    data = this.maxValue;
                }
            }

            if(typeof this.allowUnderflow === "undefined" || !this.allowUnderflow) {
                if(data < this.minValue) {
                    data = this.minValue;
                }
            }

            for(let i = 0; i <= Math.abs(data / this.tickSize); i++) {
                let startAngle, endAngle

                if(vars.data > 0) {
                    startAngle = (vars.orientation - this.tickOffset + (vars.tick * i)) * Math.PI/180;
                    endAngle = (vars.orientation - this.tickOffset + 1 + (vars.tick * i)) * Math.PI/180;
                }
                else {
                    startAngle = (vars.orientation - this.tickOffset + (vars.tick * i * -1)) * Math.PI/180;
                    endAngle = (vars.orientation - this.tickOffset + 1 + (vars.tick * i * -1)) * Math.PI/180;
                }

                this.appendArc(startAngle, endAngle, vars, i);

            }
        }
        else {
            if(this.dataFillType === "needle") {

                let data = vars.data;

                if(typeof this.allowOverflow === "undefined" || !this.allowOverflow) {
                    if(data > this.maxValue) {
                        data = this.maxValue;
                    }
                }

                if(typeof this.allowUnderflow === "undefined" || !this.allowUnderflow) {
                    if(data < this.minValue) {
                        data = this.minValue;
                    }
                }

                let i = Math.abs(data / this.tickSize);
                let startAngle, endAngle;

                if(vars.data > 0) {
                    startAngle = (vars.orientation - this.tickOffset + (vars.tick * i)) * Math.PI/180;
                    endAngle = (vars.orientation + (vars.tick * i)) * Math.PI/180;
                }
                else {
                    startAngle = (vars.orientation - this.tickOffset + (vars.tick * i * -1)) * Math.PI/180;
                    endAngle = (vars.orientation + (vars.tick * i)) * Math.PI/180;
                }

                this.appendArc(startAngle, endAngle, vars, i);
            }

            else if(this.dataFillType === "full") {

                let data = vars.data;

                if(typeof this.allowOverflow === "undefined" || !this.allowOverflow) {
                    if(data > this.maxValue) {
                        data = this.maxValue;
                    }
                }

                if(typeof this.allowUnderflow === "undefined" || !this.allowUnderflow) {
                    if(data < this.minValue) {
                        data = this.minValue;
                    }
                }

                let startAngle, endAngle;

                if(vars.data > 0) {
                    startAngle = vars.orientation * Math.PI/180;
                    endAngle = (vars.orientation + (vars.tick * Math.abs(data / this.tickSize))) * Math.PI/180;
                    this.appendArc(startAngle, endAngle, vars, Math.abs(data / this.tickSize));
                }
                else {
                    startAngle = vars.orientation * Math.PI/180;
                    endAngle = (vars.orientation + (vars.tick * Math.abs(data / this.tickSize) * -1)) * Math.PI/180;
                    this.appendArc(startAngle, endAngle, vars, Math.abs(data / this.tickSize));
                }
            }

            this.populateLabels();
        }
    }

    appendArc(startAngle, endAngle, vars, offset, i) {
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

    /*
     *  Create a variable object to be used when drawing the gauge.
     */
     prepareVars() {
         let element = this.createRootElements();

         let thicknessBase = Math.min(this.width, this.height) * 0.3;
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
        element.node().style.height = this.height + "px";

        this.svg = element.append("svg")
                        .attr("id", this.rootElement + "-svg")
                        .attr("width", this.width)
                        .attr("height", this.height);
        return element;
    }

    /*
     *  Draw a background.
     */
    drawBackground(vars) {
        let startAngle = vars.orientation * Math.PI/180;
        let endAngle;

        let endDegrees = this.backgroundFill === "full" ? 360 : this.maxDegrees;

        if(this.data >= 0) {
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

        let angleDiff = Math.abs(this.maxDegrees);

        let ticksPerAngle = angleDiff/this.maxValue;

        for(let i = 0; i <= this.maxValue; i++) {
            if(i % this.tickModulus == 0) {
                let angle = (this.maxDegrees / this.maxValue) * i;
                this.drawLine(angle, 1, 0);
            }
        }

        for(let i = 0; i <= this.maxValue; i++) {
            if(i % this.bigTickModulus == 0) {
                let angle = (this.maxDegrees / this.maxValue) * i;
                this.drawLine(angle, 3, 1);
                this.drawTickLabels(angle, i + this.unit);
            }
        }

        if(this.minValue < 0) {
            for(let i = this.minValue; i <= 0; i++) {
                if(i % this.tickModulus == 0) {
                    let angle = (this.maxDegrees / this.maxValue) * i;
                    this.drawLine(angle, 1, 0);
                }
            }

            for(let i = this.minValue; i <= 0; i++) {
                if(i % this.bigTickModulus == 0) {
                    let angle = (this.maxDegrees / this.maxValue) * i;
                    this.drawLine(angle, 3, 1);
                    this.drawTickLabels(angle, i + this.unit);
                }
            }
        }
    }

    drawTickBackground() {
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", 0);
        circle.setAttribute("cy", 0);
        circle.setAttribute("r", this.width/this.tickCoverRadius);
        circle.setAttribute("fill", this.tickCoverColor);
        circle.setAttribute("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");

        let svg = d3.select("#" + this.rootElement + "-svg").node();
        svg.appendChild(circle);
    }

    drawLine(angle, thickness, length) {

        angle = angle * -1; // Need to change the orientation.

        let radius = this.width/(3 - length/10);
        let x1 = Math.cos((90 - this.orientation + angle) * Math.PI/180) * radius;
        let y1 = -1 * Math.sin((90 - this.orientation + angle) * Math.PI/180) * radius;

        let line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("d", "M0,0" + "L" + x1 + "," + y1);
        line.setAttribute("stroke", this.tickColor);
        line.setAttribute("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");
        line.setAttribute("stroke-width", thickness)
        let svg = d3.select("#" + this.rootElement + "-svg").node();
        svg.appendChild(line);
    }

    drawTickLabels(angle, text) {

        angle = angle * -1;

        let radius, x, y;

        if(angle < -1) {
            radius = this.width/(2.5) + 10;
            x = Math.cos((90 - this.orientation + angle) * Math.PI/180) * radius;
            y = -1 * Math.sin((90 - this.orientation + angle) * Math.PI/180) * radius;
        }
        else {
            radius = this.width/(2.5) + 10;
            x = Math.cos((90 - this.orientation + angle) * Math.PI/180) * radius;
            y = -1 * Math.sin((90 - this.orientation + angle) * Math.PI/180) * radius;
        }

        let transformX = (this.width + ((this.width/100) * -3)) / 2;
        let transformY = (this.height + ((this.height/100) * 2)) / 2;

        let textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", x);
        textElement.setAttribute("y", y);
        textElement.style.fontSize = this.tickLabelSize;
        textElement.setAttribute("transform", "translate(" + transformX + "," + transformY + ")");
        textElement.style.fill = this.tickLabelColor;
        textElement.style.fontFamily = this.tickLabelFontFamily;
        textElement.textContent = text;

        if(Math.ceil(Math.abs(angle)) === this.maxDegrees) {
            if(angle > 0) {
                textElement.setAttribute("y", +textElement.getAttribute("y") + this.tickLabelSize/4 * 3);
            }
            else {
                textElement.setAttribute("y", +textElement.getAttribute("y") + this.tickLabelSize/4 * 4 * -1);
            }
        }

        let svg = d3.select("#" + this.rootElement + "-svg").node();
        svg.appendChild(textElement);
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
            NORTH: 0,
            SOUTH: 180,
            EAST: 90,
            WEST: 270
        }
    }

    /*
     *  Set default values.
     */
    setDefaults() {
        this.width = 400;
        this.height = 400;
        this.thickness = 3;
        this.tickSize = 1;
        this.offset = 0;
        this.orientation = this.orientationVar().NORTH;
        this.unit = "";
        this.minValue = -50;
        this.maxValue = 50;
        this.allowOverflow = false;
        this.allowUnderflow = true;
        this.maxDegrees = 360;
        this.color = "#aaa";
        this.overflowColor = "#aaa";
        this.underflowColor = "#aaa";
        this.showTickLabels = false;
        this.background = "rgba(0,0,0,0)";
        this.backgroundFill = "maxDegrees";
        this.marginOffset = 50;
        this.tickColor = "#000";
        this.tickCoverColor = "#fff";
        this.tickLabelSize = "11px";
        this.tickLabelColor = "#000";
        this.tickLabelFontFamily = "monospace";
        this.tickOffset = 1;
        this.tickCoverRadius = 3.2;
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
        this.overflowColor = typeof config.overflowColor === "undefined" ? this.color : config.overflowColor;
        this.underflowColor = typeof config.underflowColor === "undefined" ? this.color : config.underflowColor;
        this.showTickLabels = typeof config.showTickLabels === "undefined" ? this.showTickLabels : config.showTickLabels;
        this.tickModulus = typeof config.tickModulus === "undefined" ? this.tickModulus : config.tickModulus;
        this.bigTickModulus = typeof config.bigTickModulus === "undefined" ? this.bigTickModulus : config.bigTickModulus;
        this.background = typeof config.background === "undefined" ? this.background : config.background;
        this.backgroundFill = typeof config.backgroundFill === "undefined" ? this.backgroundFill : config.backgroundFill;
        this.tickColor = typeof config.tickColor === "undefined" ? this.tickColor : config.tickColor;
        this.tickCoverColor = typeof config.tickCoverColor === "undefined" ? this.tickCoverColor : config.tickCoverColor;
        this.tickLabelColor = typeof config.tickLabelColor === "undefined" ? this.tickLabelColor : config.tickLabelColor;
        this.tickLabelSize = typeof config.tickLabelSize === "undefined" ? this.tickLabelSize : config.tickLabelSize;
        this.tickLabelFontFamily = typeof config.tickLabelFontFamily === "undefined" ? this.tickLabelFontFamily : config.tickLabelFontFamily;
        this.tickOffset = typeof config.tickOffset === "undefined" ? this.tickOffset : config.tickOffset;
        this.tickCoverRadius = typeof config.tickCoverRadius === "undefined" ? this.tickCoverRadius : config.tickCoverRadius;
        this.dataFillType = typeof config.dataFillType === "undefined" ? this.dataFillType : config.dataFillType;
    }
}
