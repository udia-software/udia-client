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
import ListUsers from './Users/ListUsers';
import CreatePost from './Posts/CreatePost';
import PostList from './Posts/PostList';
import Post from './Posts/Post';

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
          <Route path='/signin' component={Signin} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute exact path='/posts' component={PostList} />
          <PrivateRoute path='/posts/create' component={CreatePost} />
          <PrivateRoute path='/posts/:id' component={Post} />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/users' component={ListUsers} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default App;
