import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import { logoutRequest } from "../actions";

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    inserted_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  })
};

const defaultProps = {
  currentUser: {
    username: "",
    inserted_at: "",
    updated_at: "",
  }
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleSignOut = () => {
    this.props.dispatch(logoutRequest());
  };

  render() {
    const { activeItem } = this.state;
    const { loggedIn, currentUser } = this.props;
    return (
      <Menu>
        <Menu.Item
          as={Link}
          to="/"
          name="home"
          active={activeItem === "home"}
          onClick={this.handleItemClick}
        >
          <strong>UDIA</strong>
        </Menu.Item>
        {loggedIn &&
          <Menu.Menu>
            <Menu.Item
              as={Link}
              to="/posts"
              name="posts"
              active={activeItem === "posts"}
              onClick={this.handleItemClick}
            >
              Posts
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/posts/create"
              name="createPost"
              active={activeItem === "createPost"}
              onClick={this.handleItemClick}
            >
              Write Post
            </Menu.Item>
          </Menu.Menu> }
        {loggedIn &&
          <Menu.Menu position="right">
            <Dropdown
              text={`Hello, ${currentUser.username}!`}
              pointing
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Header>{currentUser.username}</Dropdown.Header>
                <Dropdown.Item
                  as={Link}
                  to="/about"
                  name="about"
                  active={activeItem === "about"}
                  onClick={this.handleItemClick}
                >
                  About
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/profile"
                  name="profile"
                  active={activeItem === "profile"}
                  onClick={this.handleItemClick}
                >
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item
                  name="signout"
                  active={activeItem === "signout"}
                  onClick={this.handleSignOut}
                >
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>}
        {!loggedIn &&
          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to="/signin"
              name="signin"
              active={activeItem === "signin"}
              onClick={this.handleItemClick}
            >
              Sign In
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/signup"
              name="signup"
              active={activeItem === "signup"}
              onClick={this.handleItemClick}
            >
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
