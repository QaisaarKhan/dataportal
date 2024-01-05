import PieChart from "components/PieChart/PieChart";
import React, { Component } from "react";
import axios from "axios";

class Charts extends Component {
  state = {
    data: [],
  };

  //The tracker object to keep track of index of the incoming data
  trackerObj = {};

  //Tracker function to track incoming data index to sum them in the end
  //Quick summary, Piechart expects only one value and category from each obj to make slices.
  //Refer to the am4charts.Piechart docs for more detailed information.
  tracker(duration, id, index) {
    if (this.trackerObj[duration] === undefined) {
      this.trackerObj[duration] = {};
    }
    if (this.trackerObj[duration][id] === undefined) {
      this.trackerObj[duration][id] = {};
    }

    this.trackerObj[duration][id] = index;
  }

  //This function is used to parse data into compatible format for the am4core.piecharts

  parseData(p_data) {
    let data = {};
    p_data.map((item) => {
      if (data[item.duration] === undefined) {
        data[item.duration] = [];
      }

      if (this.trackerObj[item.duration] === undefined) {
        let value = data[item.duration].length;
        data[item.duration].push({
          dv_id: item.dv_id,
          value: parseFloat(item.value),
          description: item.dv_description,
        });
        this.tracker(item.duration, item.dv_id, value);
      } else {
        if (this.trackerObj[item.duration][item.dv_id] === undefined) {
          let value = data[item.duration].length;
          data[item.duration].push({
            dv_id: item.dv_id,
            value: parseFloat(item.value),
            description: item.dv_description,
          });
          this.tracker(item.duration, item.dv_id, value);
        } else {
          let index = this.trackerObj[item.duration][item.dv_id];
          let oldValue = data[item.duration][index].value;
          data[item.duration][index] = {
            dv_id: item.dv_id,
            value: parseFloat(item.value) + parseFloat(oldValue),
            description: item.dv_description,
          };
        }
      }
    });

    return data;
  }

  //Function to request data from the server. All following chart modules will have requesting functions as this one.
  //In case you are wondering to pull all axios/request calls in same function. Be my guest. The purpose of different functions
  //is so that other piechart components can load if one of them fails a request.

  getPieData() {
    axios
      .get("http://localhost:5000/get_var_data/1")
      .then((result) => {
        //res_ as in result data to avoid confusion between the recieved data and declared variable
        if (result.data.response_message.length > 0) {
          let res_data = result.data.response_message;
          let ret_data = this.parseData(res_data);
          this.setState({ data: ret_data });
        } else {
        }
      })
      .catch((error) => {});
  }

  //Run these functions as soon as this component is loaded
  componentDidMount() {
    //Request data from the server as soon as page loads
    this.getPieData();
    // this.getPieData2();
  }

  render() {
    return (
      <div>
        <div style={{ height: "300px" }}>
          {Object.keys(this.state.data).length > 0 ? (
            <PieChart id='1' data={this.state.data} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Charts;
