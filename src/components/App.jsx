import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import PrivateRoute from './Auth/PrivateRoute';
import Profile from './Auth/Profile';
import Signin from './Auth/Signin';
import Signup from './Auth/Signup';
import CreatePost from './Posts/CreatePost';
import Post from './Posts/Post';
import PostList from './Posts/PostList';
import CreateJourney from './Journeys/CreateJourney';
import User from './Users/User';
import About from './About';
import Navbar from './Navbar';

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
          <Route exact path='/' component={PostList} />
          <Route path='/about' component={About} />
          <Route path='/signin' component={Signin} />
          <Route path='/signup' component={Signup} />
          <Route path='/users/:username' component={User} />
          <Route exact path='/posts' component={PostList} />
          <PrivateRoute path='/posts/create' component={CreatePost} />
          <Route path='/posts/:id' component={Post} />
          <PrivateRoute path='/journeys/create' component={CreateJourney} />
          <PrivateRoute path='/profile' component={Profile} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default App;
