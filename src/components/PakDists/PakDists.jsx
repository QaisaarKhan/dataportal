import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import pakDists from "../../districts";

export default class PakDists extends Component {
  componentDidMount() {
    this.initMap();
  }

  state = {
    recData: this.props.data,
    toolTipString: this.props.toolTipString,
  };

  dv_ids = this.props.dv_id;

  initMap() {
    let prov = ["Sindh", "Punjab", "Balochistan", "Khyber Pakhtunkhwa"];
    let color = ["#7499C1", "#275382", "#0058B5", "#003268"];
    for (let x in prov) {
      for (let i = 0; i < this.state.recData.features.length; i++) {
        if (
          prov[x] ==
          this.state.recData.features[i].properties.province_territory
        ) {
          this.state.recData.features[i].properties.fill = am4core.color(
            color[x]
          );
        }
      }
    }

    // console.log(`this.state.recData`, this.state.recData);

    let valArray = [];
    for (let i = 0; i < this.state.recData.features.length; i++) {
      valArray[i] = parseInt(this.state.recData.features[i].properties.value);
    }

    let map = am4core.create(this.props.id, am4maps.MapChart);
    map.geodata = this.state.recData;
    map.projection = new am4maps.projections.Miller();

    let polygonSeries = new am4maps.MapPolygonSeries();
    polygonSeries.useGeodata = true;
    map.series.push(polygonSeries);

    let polygonTemplate = polygonSeries.mapPolygons.template;

    // console.log('tooltipstring', this.state.toolTipString)

    polygonTemplate.tooltipHTML = this.state.toolTipString;

    polygonSeries.tooltip.getFillFromObject = false;
    polygonSeries.tooltip.label.fill = am4core.color("#000000");

    polygonSeries.calculateVisualCenter = true;
    polygonTemplate.tooltipPosition = "fixed";
    polygonSeries.tooltip.label.interactionsEnabled = true;
    polygonSeries.tooltip.keepTargetHover = true;

    let shadow = polygonSeries.tooltip.filters.push(
      new am4core.DropShadowFilter()
    );

    shadow.opacity = 0.01;

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#1E90FF");

    polygonTemplate.propertyFields.fill = "fill";

    polygonSeries.tooltip.background.cornerRadius = 10;

    map.marginTop = 50;
    // polygonSeries.tooltip.background.fill = am4core.color("#ffff00");

    // polygonSeries.heatRules.push({
    //   property: "fill",
    //   target: polygonSeries.mapPolygons.template,
    //   min: map.colors.getIndex(1).brighten(1),
    //   max: map.colors.getIndex(1).brighten(-0.3),
    //   logarithmic: true,
    // });

    // var max = 0; // Lower bound
    // var min = 0; // Upper bound
    // for (var x in valArray) {
    //   // Traverse indices
    //   if (valArray[x] > max) max = valArray[x]; // Update max if valArray[x] is greater
    //   if (valArray[x] < min) min = valArray[x]; // Update min if valArray[x] is smaller
    // }
    // // for (let i = 0; i < this.state.recData.features.length; i++)
    // console.log(max);
    // console.log(min);
    // // valArray.forEach((element) => {
    // //   console.log(parseInt(element));
    // // });

    // // let heatLegend = map.createChild(am4maps.HeatLegend);
    // // heatLegend.series = polygonSeries;
    // // heatLegend.align = "right";
    // // heatLegend.valign = "bottom";
    // // heatLegend.width = am4core.percent(20);
    // // heatLegend.marginRight = am4core.percent(4);
    // // heatLegend.minValue = min;
    // // heatLegend.maxValue = max;

    // // Set up custom heat map legend labels using axis ranges
    // // let minRange = heatLegend.valueAxis.axisRanges.create();
    // // minRange.value = heatLegend.minValue;
    // // minRange.label.text = heatLegend.minValue;
    // // let maxRange = heatLegend.valueAxis.axisRanges.create();
    // // maxRange.value = heatLegend.maxValue;
    // // maxRange.label.text = heatLegend.maxValue;

    // polygonSeries.mapPolygons.template.adapter.add(
    //   "fill",
    //   function (fill, mapPolygon) {
    //     var workingValue = mapPolygon.dataItem.values["value"].workingValue;
    //     var minValue = polygonSeries.dataItem.values["value"].low;
    //     var maxValue = polygonSeries.dataItem.values["value"].high;
    //     var percent = (workingValue - minValue) / (maxValue - minValue);
    //     if (am4core.type.isNumber(percent)) {
    //       if (percent > 0.5) {
    //         return new am4core.Color(
    //           am4core.colors.interpolate(
    //             heatColors[1].rgb,
    //             heatColors[2].rgb,
    //             (percent - 0.5) * 2
    //           )
    //         );
    //       } else {
    //         return new am4core.Color(
    //           am4core.colors.interpolate(
    //             heatColors[0].rgb,
    //             heatColors[1].rgb,
    //             percent * 2
    //           )
    //         );
    //       }
    //     }
    //     return fill;
    //   }
    // );

    // var heatColors = [
    //   am4core.color("rgb(96, 142, 150)"),
    //   am4core.color("rgb(170, 143, 104)"),
    //   am4core.color("rgb(205, 144, 82)"),
    //   am4core.color("rgb(233, 141, 59)"),
    // ];

    // // var gradient = new am4core.LinearGradient();
    // // heatColors.forEach(function (color) {
    // //   gradient.addColor(color);
    // // });
    // // heatLegend.markers.template.adapter.add("fill", function () {
    // //   return gradient;
    // // });

    // var heatLegendTop = map.createChild(am4maps.HeatLegend);
    // heatLegendTop.series = polygonSeries;
    // heatLegendTop.minColor = heatColors[0];
    // heatLegendTop.maxColor = heatColors[3];
    // heatLegendTop.marginBottom = 5;
    // heatLegendTop.paddingLeft = 20;
    // heatLegendTop.markerCount = 4;
    // heatLegendTop.events.on("inited", function () {
    //   heatLegendTop.markers.each(function (marker, markerIndex) {
    //     // Gradient colors!
    //     if (markerIndex < heatLegendTop.markerCount / 2) {
    //       marker.fill = new am4core.Color(
    //         am4core.colors.interpolate(
    //           heatColors[0].rgb,
    //           heatColors[1].rgb,
    //           (markerIndex / heatLegendTop.markerCount) * 2
    //         )
    //       );
    //     } else {
    //       marker.fill = new am4core.Color(
    //         am4core.colors.interpolate(
    //           heatColors[1].rgb,
    //           heatColors[3].rgb,
    //           ((markerIndex - heatLegendTop.markerCount / 2) /
    //             heatLegendTop.markerCount) *
    //             2
    //         )
    //       );
    //     }
    //   });
    // });

    // polygonSeries.mapPolygons.template.events.on("over", (event) => {
    //   handleHover(event.target);
    // });

    // polygonSeries.mapPolygons.template.events.on("hit", (event) => {
    //   handleHover(event.target);
    // });

    // function handleHover(mapPolygon) {
    //   if (!isNaN(mapPolygon.dataItem.value)) {
    //     heatLegendTop.valueAxis.showTooltipAt(mapPolygon.dataItem.value);
    //   } else {
    //     heatLegendTop.valueAxis.hideTooltip();
    //   }
    // }

    // // Legend items

    // // Blank out internal heat legend value axis labels
    // // heatLegend.valueAxis.renderer.labels.template.adapter.add(
    // //   "text",
    // //   function (labelText) {
    // //     return "";
    // //   }
    // // );

    let title = map.titles.create();
    title.text = this.state.recData.features[21].properties.title;
    title.fontSize = 16;
    title.marginBottom = 30;
    map.zoomLevel = 0;

    this.map = map;
    this.polygonTemplate = polygonTemplate;
    title.dx = -120;
    title.dy = 50;
  }

  changeToolTip() {
    this.polygonTemplate.tooltipHTML = this.state.toolTipString;
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Inside componentDidUpdate')
    // console.log('old data',prevProps.data);
    // console.log('new data',this.props.data);
    if (prevProps.data !== this.props.data) {
      this.setState(
        {
          recData: this.props.data,
          toolTipString: this.props.toolTipString,
        },
        () => {
          // this.changeToolTip();
          console.log("Updating component");
          this.initMap();
        }
      );
      // console.log('Inside componentDidUpdate IF')
    }
  }

  render() {
    return (
      <div>
        <div
          id={this.props.id}
          style={{ height: "650px", paddingTop: "30px" }}
        ></div>
      </div>
    );
  }
}
