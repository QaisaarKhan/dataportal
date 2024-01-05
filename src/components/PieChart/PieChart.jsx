import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
export default class PieChart extends Component {
  state = {
    year: 0,
  };

  showButtons = this.props.showButtons;
  rec_data = this.props.data;
  chartId = `chartdiv+${this.props.id}`;
  this_year = Object.keys(this.rec_data)[0];

  changeYear(setYear) {
    this.setState({
      year: setYear,
    });
  }

  componentDidMount() {
    let chart = am4core.create(this.chartId, am4charts.PieChart);

    chart.innerRadius = 20;
    chart.radius = 50;
    chart.data = this.rec_data[this.this_year];
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "description";

    pieSeries.slices.template.stroke = am4core.color("#4a2abb");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    pieSeries.hiddenState.properties.endAngle = -90;

    // chart.legend = new am4charts.Legend();
    // chart.legend.fontSize = 9;
    // // chart.legend.position = "anchor";
    // pieSeries.labels.template.text = ;

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this.this_year;
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;

    this.chart = chart;
    this.label = label;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.year !== this.state.year) {
      this.chart.data = this.rec_data[this.state.year];
      this.label.text = this.state.year;
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  length = Object.keys(this.rec_data);

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div id={this.chartId}></div>
        {this.showButtons == true
          ? this.length.map((item) => {
              return (
                <button key={item} onClick={() => this.changeYear(item)}>
                  {item}
                </button>
              );
            })
          : ""}
      </div>
    );
  }
}
