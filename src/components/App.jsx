import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import PrivateRoute from "./Auth/PrivateRoute";
import Account from "./Auth/Account";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import CreatePost from "./Posts/CreatePost";
import EditPost from "./Posts/EditPost";
import PostContainer from "./Posts/PostContainer";
import PostList from "./Posts/PostList";
import User from "./Users/User";
import About from "./About";
import Footer from "./Footer";
import Navbar from "./Navbar";

const NoMatch = ({ location }) => (
  <div>
    <h3>Page not found!</h3>
    <p>No match found for <code>{location.pathname}</code></p>
    <p><Link to="/">Go to the home page →</Link></p>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div style={{ minHeight: "86vh"}}>
          <Switch>
            <Route exact path="/" component={PostList} />
            <Route path="/about" component={About} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/users/:username" component={User} />
            <Route exact path="/posts" component={PostList} />
            <PrivateRoute path="/posts/create" component={CreatePost} />
            <Route path="/posts/:id/edit" component={EditPost} />
            <Route path="/posts/:id" component={PostContainer} />
            <PrivateRoute path="/account" component={Account} />
            <Route component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
