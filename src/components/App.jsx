import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import PrivateRoute from "./PrivateRoute";
import Navbar from "./Navbar";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";

const Home = () => (
  <div>
    <h2>Home</h2>
    <p>This is the home page.</p>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
    <p>This is the about page.</p>
  </div>
);

const NoMatch = ({ location }) => (
  <div>
    <h3>Page not found!</h3>
    <p>No match found for <code>{location.pathname}</code></p>
    <p><Link to="/">Go to the home page →</Link></p>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default App;
