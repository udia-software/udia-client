import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const propTypes = {
  currentUser: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  location: PropTypes.object.isRequired
};

const PrivateRoute = ({ currentUser, component, ...rest }) => {
  const loggedIn = !!Object.keys(currentUser || {}).length;
  return (
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
};

PrivateRoute.propTypes = propTypes;

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(PrivateRoute);
