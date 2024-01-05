import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap/lib/Tab";
import PieChart from "../PieChart/PieChart";

export default class LeftContent extends Component {
  //   chartData = this.props.data;
  //   textData = this.props.text;
  render() {
    console.log(this.chartData);
    // console.log(this.props.data);
    return (
      // <div>
      <Container>
        <Row
          style={{
            justifyContent: "space-around",
            display: "flex",
          }}
        >
          <Col xs={4} style={{ paddingTop: "5%" }}>
            {this.props.text}
          </Col>
          <Col style={{ paddingLeft: "15%" }}>
            {Object.keys(this.props.data).length > 0 ? (
              <PieChart
                id={this.props.id}
                data={this.props.data}
                showButtons={false}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
      // </div>
    );
  }
}
