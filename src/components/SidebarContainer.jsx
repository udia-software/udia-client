import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Sidebar, Menu } from "semantic-ui-react";

const propTypes = {
  visible: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    inserted_at: PropTypes.string,
    updated_at: PropTypes.string
  }),
  toggleSidebarVisibility: PropTypes.func.isRequired
};

const defaultProps = {
  currentUser: {}
};

class SidebarContainer extends Component {
  render() {
    const { currentUser, visible } = this.props;
    const loggedIn = !!Object.keys(currentUser || {}).length;
    return (
      <Sidebar
        as={Menu}
        animation="overlay"
        width="thin"
        direction="right"
        visible={visible}
        vertical
      >
        {loggedIn &&
          <Menu.Item>
            <Menu.Header>{currentUser.username}</Menu.Header>
            <Menu.Menu>
              <Menu.Item as={Link} to={`/users/${currentUser.username}`}>
                My Profile
              </Menu.Item>
              <Menu.Item as={Link} to="/account" name="account">
                Account Settings
              </Menu.Item>
              <Menu.Item as={Link} to="/posts/create" name="createPost">
                Write Post
              </Menu.Item>
              <Menu.Item as={Link} to="/journeys/create">
                Start Journey
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>}
        {!loggedIn &&
          <Menu.Item>
            <Menu.Header>Authentication</Menu.Header>
            <Menu.Menu>
              <Menu.Item as={Link} to="/signin" name="signin">
                Sign In
              </Menu.Item>
              <Menu.Item as={Link} to="/signup" name="signup">
                Sign Up
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>}
      </Sidebar>
    );
  }
}

SidebarContainer.propTypes = propTypes;
SidebarContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(SidebarContainer);
