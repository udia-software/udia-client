import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

const propTypes = {
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment)
};

class DiffTime extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.endTime)
    this.state = {
      displayTime: this.props.endTime
        ? moment(this.props.endTime).diff(this.props.startTime, "seconds")
        : moment().diff(this.props.startTime, "seconds")
    };
  }

  componentDidMount() {
    this.setTime();
  }

  componentWillUnmount() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  }

  setTime = () => {
    if (this.props.endTime) {
      return;
    }
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
    var intervalId = setInterval(this.setTime, 1000);
    const stateDiff = {
      displayTime: moment().diff(this.props.startTime, "seconds"),
      intervalId
    };
    this.setState(stateDiff);
  };

  render() {
    return <span>{this.state.displayTime} seconds</span>;
  }
}

DiffTime.propTypes = propTypes;

export default DiffTime;
