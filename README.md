# Gauge Proof of Concept v0.1b

## Triggers

| Variable      | Default | Possible Values | Description   |
|-|-|-|-|
| `rootElement` | *None* | Any element ID | The root element where the gauge will generate. Replaces the content of the element. |
| `labelElement` | *None* | Any element ID | The element where the label will be added. Replaces the content of the element. |
| `width` | `300` | Any natural number | The width of the gauge.
| `height` | `300` | Any natural number | The height of the gauge. |
| `tickSize` | `1` | Any natural number | The size of the tick. 1 means that the tick equals 1 and will generate 100 ticks in a gauge reaching from 0-100, 2 will generate 50 and so on. |
| `tickThickness` | `3` | Any natural number | The thickness of the tick. |
| `offset` | `0` | Any natural number | The offset of the gauge. The greater the number, the smaller the gauge. Good if you want to show multiple gauges inside one another. |
| `orientation` | `0` | Any integer  or orientationVar().[NORTH SOUTH EAST WEST] | From which rotation the gauge should start to generate. |
| `unit` | *None* | Anything | The unit to show after the data in the label. |
| `minValue` | `-50` | Any real number | The minimum allowed data value. |
| `maxValue` | `50` | Any real number | The maximum allowed data value. |
| `allowOverflow` | `true` | `[true false]` | Whether or not to allow the gauge data to overflow and keep on filling the gauge above the maxValue. |
| `allowUnderflow` | `true` | `[true false]` | Whether or not to allow the gauge data to negatively overflow and keep on filling the gauge below the minValue. |
| `color` | `"#aaa"` | Any color in the hex/rgb/rgba format. | The color to fill the gauge with. |
| `overflowColor` | `"#aaa"` | Any color in the hex/rgb/rgba format. | The color to fill an overflowed gauge with. |
| `underflowColor` | `"#aaa"` | Any color in the hex/rgb/rgba format. | The color to fill an underflowed gauge with. |
| `showTickLabels` | `false` | [true false] | Whether or not to show tick labels. |
| `tickModulus` | `10` | Any natural number | The frequency of the tick label using tickValue % tickModulus = 0 |
| `data` | *None* | Any real number | The data to show in the gauge. |
| `debug` | `undefined` | Anything | Triggers the debug. If it's not defined the debug is off. Otherwise it's on. |

## Methods

| Method | Possible Input Variables | Description | Example |
|-|-|-|-|
| `setConfig()` | An object of configs | You can add your configs by passing an object of configs to the `setConfig()` method. | `setConfig({width: 400, offset: 20, unit: "%"})` |
| `setNN()` | New values for variables. | NN meaning any of the variables above. | `setData(23)` |
| `update()` | *None* | Call this to update the view. | `SetData(25); update();` |
| setDebug() | *None* | If you call this

## How To Use

Most of the settings have a default, but at the very least you need to set the `rootElement` and something to add into the `data` variable. If you plan to show labels, you need to set the `labelElement` and possibly add the unit to plan to use, if any, to `unit` as well.

**HTML**    
```
<div id="gauge"></div>
```

**JS**
```
let gauge = new Gauge();
gauge.rootElement("gauge");
gauge.config(
        data: 40,
        color: "#444",
        debug: true
);
gauge.update();
```
