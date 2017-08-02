import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    inserted_at: PropTypes.string,
    updated_at: PropTypes.string
  })
};

const defaultProps = {
  currentUser: {}
};

class Navbar extends Component {
  render() {
    const { currentUser } = this.props;
    const loggedIn = !!Object.keys(currentUser || {}).length;

    return (
      <Menu>
        <Menu.Item as={Link} to="/" name="home">
          <strong>UDIA</strong>
        </Menu.Item>
        <Menu.Item as={Link} to="/about" name="about">
          About
        </Menu.Item>
        {loggedIn &&
          <Menu.Menu position="right">
            <Dropdown
              text={`Hello, ${currentUser.username}!`}
              pointing
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Header>{currentUser.username}</Dropdown.Header>
                <Dropdown.Item as={Link} to={`/users/${currentUser.username}`}>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/account" name="account">
                  Account Settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/posts/create" name="createPost">
                  Write Post
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/journeys/create">
                  Start Journey
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>}
        {!loggedIn &&
          <Menu.Menu position="right">
            <Menu.Item as={Link} to="/signin" name="signin">
              Sign In
            </Menu.Item>
            <Menu.Item as={Link} to="/signup" name="signup">
              Sign Up
            </Menu.Item>
          </Menu.Menu>}
      </Menu>
    );
  }
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps)(Navbar);
