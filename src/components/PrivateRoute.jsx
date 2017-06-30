import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  location: PropTypes.object.isRequired
};

const PrivateRoute = ({ loggedIn, component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (loggedIn) {
        return React.createElement(component, props);
      }
      return <Redirect to="/signin" />;
    }}
  />
);

PrivateRoute.propTypes = propTypes;

const mapStateToProps = state => ({
  loggedIn: state.loggedIn
});

export default connect(mapStateToProps)(PrivateRoute);
