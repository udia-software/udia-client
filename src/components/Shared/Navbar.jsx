import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import { isAuthenticated } from "../../modules/auth";
import { authActions } from "../../modules/auth/actions";
import { SELF_USER_QUERY } from "../../constants";

export class Navbar extends Component {
  signout = () => {
    const { dispatch } = this.props;
    dispatch(authActions.clearAuthData());
  };

  componentWillReceiveProps(nextProps) {
    const { user, isAuthenticated, selfUserQuery, dispatch } = nextProps;
    if (!nextProps.selfUserQuery.loading) {
      if (isAuthenticated && user) {
        return;
      } else if (isAuthenticated && selfUserQuery.me) {
        dispatch(authActions.setAuthUser(selfUserQuery.me));
      } else if (isAuthenticated && selfUserQuery.me === null) {
        dispatch(authActions.clearAuthData());
      }
    }
  }

  render() {
    const { isAuthenticated, user } = this.props;
    return (
      <NavbarView
        isAuthenticated={isAuthenticated}
        user={user}
        signout={this.signout}
      />
    );
  }
}

const NavbarView = ({ isAuthenticated, user, signout }) => (
  <Menu inverted>
    <Menu.Item as={Link} to="/">
      UDIA
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item as={Link} to="/all">All Nodes</Menu.Item>
      {isAuthenticated && (
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/create">Create Node</Menu.Item>
          <Dropdown item text={!!user ? user["username"] : "..."}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={signout}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      )}
      {!isAuthenticated && (
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/signin">
            Sign In
          </Menu.Item>
          <Menu.Item as={Link} to="/signup">
            Sign Up
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu.Menu>
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

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state),
    user: state.auth.authUser
  };
}

export default graphql(SELF_USER_QUERY, {
  name: "selfUserQuery"
})(connect(mapStateToProps)(Navbar));
