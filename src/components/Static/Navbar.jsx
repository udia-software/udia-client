import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";

export class Navbar extends Component {
  render() {
    return <NavbarView />;
  }
}

const NavbarView = ({ isAuthenticated, user }) => (
  <Menu>
    <Menu.Item as={Link} to="/">UDIA</Menu.Item>
    {isAuthenticated &&
      <Menu.Menu position="right">
        <Dropdown item text={user.username || "..."}>
          <Dropdown.Menu>
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>}
    {!isAuthenticated &&
      <Menu.Menu position="right">
        <Menu.Item as={Link} to="/signin">Sign In</Menu.Item>
        <Menu.Item as={Link} to="/signup">Sign Up</Menu.Item>
      </Menu.Menu>}
  </Menu>
);

NavbarView.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};
NavbarView.defaultProps = {
  isAuthenticated: false,
  user: {}
};

export default connect()(Navbar);
