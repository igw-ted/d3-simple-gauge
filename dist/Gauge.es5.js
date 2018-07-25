"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gauge = function () {
    function Gauge() {
        _classCallCheck(this, Gauge);

        this.setDefaults();
    }

    /*
     *  Update the view.
     */


    _createClass(Gauge, [{
        key: "update",
        value: function update() {
            if (typeof this.debug !== "undefined") {
                this.toString();
                if (this.varsHasErrors()) {
                    return;
                }
            }

            var vars = this.prepareVars();

            if (typeof this.tickModulus !== "undefined") {
                this.drawTicks(vars);
                this.drawTickBackground();
            }

            if (typeof this.background !== "undefined") {
                this.drawBackground(vars);
            }
            if (typeof this.dataFillType === "undefined") {
                for (var i = 0; i <= Math.abs(vars.data / this.tickSize); i++) {
                    var startAngle = void 0,
                        endAngle = void 0;

                    if (vars.data > 0) {
                        startAngle = (vars.orientation - this.tickOffset + vars.tick * i) * Math.PI / 180;
                        endAngle = (vars.orientation - this.tickOffset + vars.tick * i + this.tickThickness) * Math.PI / 180;
                    } else {
                        startAngle = (vars.orientation - this.tickOffset + vars.tick * i * -1) * Math.PI / 180;
                        endAngle = (vars.orientation - this.tickOffset + vars.tick * i * -1 + this.tickThickness) * Math.PI / 180;
                    }

                    this.appendArc(startAngle, endAngle, vars, i);
                }
            } else {

                var _i = Math.abs(vars.data / this.tickSize);
                var _startAngle = void 0,
                    _endAngle = void 0;

                if (vars.data > 0) {
                    _startAngle = (vars.orientation - this.tickOffset + vars.tick * _i) * Math.PI / 180;
                    _endAngle = (vars.orientation - this.tickOffset + vars.tick * _i + this.tickThickness) * Math.PI / 180;
                } else {
                    _startAngle = (vars.orientation - this.tickOffset + vars.tick * _i * -1) * Math.PI / 180;
                    _endAngle = (vars.orientation - this.tickOffset + vars.tick * _i * -1 + this.tickThickness) * Math.PI / 180;
                }

                this.appendArc(_startAngle, _endAngle, vars, _i);
            }

            this.populateLabels();
        }
    }, {
        key: "appendArc",
        value: function appendArc(startAngle, endAngle, vars, offset, i) {
            var arc = d3.arc().innerRadius(vars.thicknessBase - this.offset - vars.thicknessBase * this.thickness / 10).outerRadius(vars.thicknessBase - this.offset).startAngle(startAngle).endAngle(endAngle);

            this.svg.append("path").attr("id", "arc-" + i).attr("d", arc).attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")").attr("fill", vars.color);
        }

        /*
         *  Create a variable object to be used when drawing the gauge.
         */

    }, {
        key: "prepareVars",
        value: function prepareVars() {
            var element = this.createRootElements();

            var thicknessBase = Math.min(this.width, this.height) * 0.3;
            var tick = this.maxDegrees / (this.maxValue / this.tickSize);

            var data = this.data;
            data = this.data > this.maxValue ? this.maxValue : this.data;
            data = this.data < this.minValue ? this.minValue : this.data;

            var color = this.color;

            if (this.data > this.maxValue) {
                color = this.overflowColor;
            } else if (this.data < this.minValue) {
                color = this.underflowColor;
            }

            var orientation = this.orientation;

            return {
                element: element,
                thicknessBase: thicknessBase,
                tick: tick,
                data: data,
                color: color,
                orientation: orientation

            };
        }

        /*
         *  Create the root elements
         */

    }, {
        key: "createRootElements",
        value: function createRootElements() {
            var element = d3.select("#" + this.rootElement);
            element.node().innerHTML = "";

            element.node().style.width = this.width + "px";
            element.node().style.height = this.height + "px";

            this.svg = element.append("svg").attr("id", this.rootElement + "-svg").attr("width", this.width).attr("height", this.height);
            return element;
        }

        /*
         *  Draw a background.
         */

    }, {
        key: "drawBackground",
        value: function drawBackground(vars) {
            var startAngle = vars.orientation * Math.PI / 180;
            var endAngle = void 0;

            var endDegrees = this.backgroundFill === "full" ? 360 : this.maxDegrees;

            if (this.data > 0) {
                endAngle = (vars.orientation + endDegrees) * Math.PI / 180;
            } else {
                endAngle = (vars.orientation - endDegrees) * Math.PI / 180;
            }

            var arc = d3.arc().innerRadius(vars.thicknessBase - this.offset - vars.thicknessBase * this.thickness / 10).outerRadius(vars.thicknessBase - this.offset).startAngle(startAngle).endAngle(endAngle);

            this.svg.append("path").attr("d", arc).attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")").attr("fill", this.background);
        }

        /*
         *  Draw the ticks, if requested.
         */

    }, {
        key: "drawTicks",
        value: function drawTicks(vars) {

            var angleDiff = Math.abs(this.maxDegrees);

            var ticksPerAngle = angleDiff / this.maxValue;

            for (var i = 0; i <= this.maxValue; i++) {
                if (i % this.tickModulus == 0) {
                    var angle = this.maxDegrees / this.maxValue * i;
                    this.drawLine(angle, 1, 0);
                }
            }

            for (var _i2 = 0; _i2 <= this.maxValue; _i2++) {
                if (_i2 % this.bigTickModulus == 0) {
                    var _angle = this.maxDegrees / this.maxValue * _i2;
                    this.drawLine(_angle, 3, 1);
                    this.drawTickLabels(_angle, _i2 + this.unit);
                }
            }

            if (this.minValue < 0) {
                for (var _i3 = this.minValue; _i3 <= 0; _i3++) {
                    if (_i3 % this.tickModulus == 0) {
                        var _angle2 = this.maxDegrees / this.maxValue * _i3;
                        this.drawLine(_angle2, 1, 0);
                    }
                }

                for (var _i4 = this.minValue; _i4 <= 0; _i4++) {
                    if (_i4 % this.bigTickModulus == 0) {
                        var _angle3 = this.maxDegrees / this.maxValue * _i4;
                        this.drawLine(_angle3, 3, 1);
                        this.drawTickLabels(_angle3, _i4 + this.unit);
                    }
                }
            }
        }
    }, {
        key: "drawTickBackground",
        value: function drawTickBackground() {
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", 0);
            circle.setAttribute("cy", 0);
            circle.setAttribute("r", this.width / this.tickCoverRadius);
            circle.setAttribute("fill", this.tickCoverColor);
            circle.setAttribute("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

            var svg = d3.select("#" + this.rootElement + "-svg").node();
            svg.appendChild(circle);
        }
    }, {
        key: "drawLine",
        value: function drawLine(angle, thickness, length) {

            angle = angle * -1; // Need to change the orientation.

            var radius = this.width / (3 - length / 10);
            var x1 = Math.cos((90 - this.orientation + angle) * Math.PI / 180) * radius;
            var y1 = -1 * Math.sin((90 - this.orientation + angle) * Math.PI / 180) * radius;

            var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            line.setAttribute("d", "M0,0" + "L" + x1 + "," + y1);
            line.setAttribute("stroke", this.tickColor);
            line.setAttribute("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
            line.setAttribute("stroke-width", thickness);
            var svg = d3.select("#" + this.rootElement + "-svg").node();
            svg.appendChild(line);
        }
    }, {
        key: "drawTickLabels",
        value: function drawTickLabels(angle, text) {

            angle = angle * -1;

            var radius = void 0,
                x = void 0,
                y = void 0;

            if (angle < -1) {
                radius = this.width / 2.5 + 10;
                x = Math.cos((90 - this.orientation + angle) * Math.PI / 180) * radius;
                y = -1 * Math.sin((90 - this.orientation + angle) * Math.PI / 180) * radius;
            } else {
                radius = this.width / 2.5 + 10;
                x = Math.cos((90 - this.orientation + angle) * Math.PI / 180) * radius;
                y = -1 * Math.sin((90 - this.orientation + angle) * Math.PI / 180) * radius;
            }

            var transformX = (this.width + this.width / 100 * -3) / 2;
            var transformY = (this.height + this.height / 100 * 2) / 2;

            var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textElement.setAttribute("x", x);
            textElement.setAttribute("y", y);
            textElement.style.fontSize = this.tickLabelSize;
            textElement.setAttribute("transform", "translate(" + transformX + "," + transformY + ")");
            textElement.style.fill = this.tickLabelColor;
            textElement.style.fontFamily = this.tickLabelFontFamily;
            textElement.textContent = text;

            if (Math.ceil(Math.abs(angle)) === this.maxDegrees) {
                if (angle < 0) {
                    textElement.setAttribute("y", +textElement.getAttribute("y") + this.tickLabelSize);
                } else {
                    textElement.setAttribute("y", +textElement.getAttribute("y") + this.tickLabelSize / 4 * 2 * -1);
                }
            }

            var svg = d3.select("#" + this.rootElement + "-svg").node();
            svg.appendChild(textElement);
        }

        /*
         *  Populate the label tags.
         */

    }, {
        key: "populateLabels",
        value: function populateLabels() {
            d3.select("#" + this.labelElement).text(this.data + this.unit);
        }

        /*
         *  Orientation help variables.
         */

    }, {
        key: "orientationVar",
        value: function orientationVar() {
            return {
                NORTH: 0,
                SOUTH: 180,
                EAST: 90,
                WEST: 270
            };
        }

        /*
         *  Set default values.
         */

    }, {
        key: "setDefaults",
        value: function setDefaults() {
            this.width = 400;
            this.height = 400;
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

    }, {
        key: "setConfig",
        value: function setConfig(config) {
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
    }]);

    return Gauge;
}();
