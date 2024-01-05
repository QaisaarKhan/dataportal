import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap/lib/Tab";
import PieChart from "../PieChart/PieChart";

export default class RightContent extends Component {
  render() {
    return (
      <Container style={{ backgroundColor: "#EEF3F6" }}>
        <Row style={{ justifyContent: "space-around", display: "flex" }}>
          <Col xs={6}>
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
          <Col style={{ paddingTop: "5%" }}>{this.props.text}</Col>
        </Row>
      </Container>
    );
  }
}
