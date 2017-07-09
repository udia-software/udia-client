import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import PrivateRoute from './PrivateRoute';
import About from './About';
import Home from './Home';
import Navbar from './Navbar';
import Signin from './Signin';
import Signup from './Signup';
import Profile from './Profile';
import CreatePost from './Posts/CreatePost';
import ListUsers from './Users/ListUsers';
import Feed from './Feed/Feed';

const NoMatch = ({ location }) => (
  <div>
    <h3>Page not found!</h3>
    <p>No match found for <code>{location.pathname}</code></p>
    <p><Link to='/'>Go to the home page →</Link></p>
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
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/feed' component={Feed} />
          <Route path='/signin' component={Signin} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/users' component={ListUsers} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default App;
