import React, { Component } from "react";
import PakDists from "components/PakDists/PakDists";
import axios from "axios";
import pakDists_geodata from "../districts";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";

const _ = require("lodash");

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default class map extends Component {
  state = {
    data: [],
    dv_ids: [],
    date: [],
    sDate: "2012",
    toolTipString: "",
  };

  str = [];
  toolTip;

  changeDate(val) {
    console.log("I have been selected", val);
    this.setState({
      sDate: val,
    });
  }

  parseData(data) {
    let districts = _.cloneDeep(pakDists_geodata);

    for (let x in data) {
      for (let i = 0; i < districts.features.length; i++) {
        if (
          data[x].value == "" ||
          data[x].value == null ||
          data[x].value == undefined
        ) {
          continue;
        } else {
          if (districts.features[i].properties.name == data[x].location) {
            districts.features[i].properties.title = data[x].g_description;
            if (data[x].unit == "percent") {
              districts.features[i].properties[`desc${data[x].dv_id}`] =
                data[x].dv_description;
              districts.features[i].properties[`value${data[x].dv_id}`] =
                data[x].value;
              districts.features[i].properties[`unit`] = "Percent";
            } else if (data[x].unit == "unit") {
              districts.features[i].properties[`desc${data[x].dv_id}`] =
                data[x].dv_description;
              districts.features[i].properties[`value${data[x].dv_id}`] =
                data[x].value / 100000;
              districts.features[i].properties[`unit`] = "Hundred Thousand";
            }
          }
        }
      }
    }
    return districts;
  }

  getData(date) {
    let parsedData;
    axios
      .get("http://192.168.18.87:5000/get_dv_from_cat/4")
      .then((response) => {
        let res = response.data.response_message;
        let dv_id = [];
        for (let x in res) {
          dv_id[x] = res[x].dv_id;
        }
        this.setState({
          dv_ids: dv_id,
        });
      });

    axios.get("http://192.168.18.87:5000/get_years/4").then((response) => {
      let res = response.data.response_message;
      let time = [];
      for (let x in res) {
        time[x] = res[x].duration;
      }

      this.setState({
        date: time,
      });
    });

    if (date == undefined) {
      date = 2012;
      // this.setTooltip();
    }

    axios
      .get(`http://192.168.18.87:5000/get_var_data/${date}/4`)
      .then((response) => {
        parsedData = this.parseData(response.data.response_message);
        this.setState(
          {
            data: parsedData,
          },
          () => {
            this.setTooltip();
          }
        );

        console.log(this.state.data);
      });
  }

  setTooltip() {
    this.toolTip = `
      <div style="width:100%;padding-bottom:10px;">
    <table style="width:100%">
          <tr>
          <td style="color:#003268;padding-left:15px;padding-top:8px;padding-bottom:9px;margin-bottom:15px">
          <strong>{name}</strong>
          </td>
          <td style="padding-left:15px;padding-right:9px;text-align:left">
          <strong>{unit}</strong>
            </td>
          </tr>
          `;

    let str = [];

    for (let x in this.state.dv_ids) {
      str[x] = `<tr>
      <td style="padding-left:15px;padding-right:9px;text-align:left">{desc${this.state.dv_ids[x]}}</td>
      <td style="text-align:right;padding-right:9px;">{value${this.state.dv_ids[x]}}</td></tr>
      `;
      this.toolTip = this.toolTip.concat(str[x]);
    }

    let toolTipStringEnd = `</table></div>`;
    this.toolTip = this.toolTip.concat(toolTipStringEnd);
    this.setState({
      toolTipString: this.toolTip,
    });
  }

  // getData2() {
  //   let parsedData;
  //   axios.get("http://fawad-book:5000/get_dv_from_cat/2").then((response) => {
  //     let res = response.data.response_message;
  //     let dv_id = [];
  //     for (let x in res) {
  //       dv_id[x] = res[x].dv_id;
  //     }
  //     this.setState({
  //       dv_ids2: dv_id,
  //     });
  //   });

  //   axios.get("http://fawad-book:5000/get_var_data/2014/2").then((response) => {
  //     parsedData = this.parseData(response.data.response_message);
  //     this.setState({
  //       data2: parsedData,
  //     });
  //   });
  // }
  dates = Object.keys(this.state.date);

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sDate !== this.state.sDate) {
      this.getData(this.state.sDate);
    }
  }

  render() {
    return (
      <div>
        <div>
          {Object.keys(this.state.data).length > 0 &&
          Object.keys(this.state.data).length > 0 &&
          this.state.toolTipString.length > 0 ? (
            <PakDists
              data={this.state.data}
              dv_id={this.state.dv_ids}
              id='1'
              toolTipString={this.state.toolTipString}
              style={{ height: "100%", width: "100%" }}
            ></PakDists>
          ) : (
            ""
          )}
        </div>

        <Swiper
            spaceBetween={0}
            slidesPerView={3}
            navigation
            slideToClickedSlide={true}
            centeredSlides={true}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
            style={{
              paddingLeft: "35%",
              paddingTop: "1%",
              paddingRight: "28%",
            }}
        >
          {this.state.date.map((item) => {
            return (
              <SwiperSlide key={item}>
                {({ isActive }) =>
                  isActive ? (
                    <button
                      key={item}
                      style={{
                        // marginRight: "50px",
                        border: "none",
                        background: "none",
                        color: "#003268",
                        fontSize: "20px",
                      }}
                      value={item}
                      onClick={() => this.changeDate(item)}
                    >
                      <strong>{item}</strong>
                    </button>
                  ) : (
                    <button
                      key={item}
                      style={{
                        // marginRight: "50px",
                        border: "none",
                        background: "none",
                        color: "#B2C1D1",
                      }}
                      value={item}
                    >
                      {item}
                    </button>
                  )
                }
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
}
