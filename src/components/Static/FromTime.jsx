import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

const propTypes = {
  time: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date)
  ]).isRequired
};

class FromTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTime: moment(this.props.time).fromNow()
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
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
    var intervalId = -1;
    if (moment().diff(this.props.time, "days")) {
      intervalId = setInterval(this.setTime, 86400000);
    } else if (moment().diff(this.props.time, "hours")) {
      intervalId = setInterval(this.setTime, 3600000);
    } else if (moment().diff(this.props.time, "minutes")) {
      intervalId = setInterval(this.setTime, 60000);
    } else {
      intervalId = setInterval(this.setTime, 1000);
    }
    const stateDiff = {
      displayTime: moment(this.props.time).toNow(true),
      intervalId
    };
    this.setState(stateDiff);
  };

  render() {
    return <span>{this.state.displayTime}</span>;
  }
}

FromTime.propTypes = propTypes;

export default FromTime;
