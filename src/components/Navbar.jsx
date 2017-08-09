import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const propTypes = {
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

class Navbar extends Component {
  render() {
    const { currentUser } = this.props;
    const loggedIn = !!Object.keys(currentUser || {}).length;

    return (
      <Menu style={{ margin: "0" }}>
        <Menu.Item as={Link} to="/" name="home">
          <strong>UDIA</strong>
        </Menu.Item>
        <Menu.Item as={Link} to="/about" name="about">
          About
        </Menu.Item>
        <Menu.Item 
          position="right"
          onClick={this.props.toggleSidebarVisibility}>
          {loggedIn && <span>{`Hello, ${currentUser.username}!`}</span>}
          {!loggedIn && <span>Menu</span>}
        </Menu.Item>
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
