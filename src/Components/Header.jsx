import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { authActions, authSelectors } from "Modules/Auth";

const StyledHeader = styled.header`
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #040404;
  align-items: center;
  padding: 0 0.4em;
`;

const StyledTitleLink = styled(Link)`
  justify-self: start;
  padding: 0.4em;
  font-weight: 400;
  color: #fff;
  text-decoration: none;
  font-size: x-large;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  transition-property: border-left, border-right;
  transition-duration: 0.2s;
  &:hover {
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
  }
`;

const HeaderSubMenu = styled.div`
  justify-self: end;
  grid-auto-flow: column;
  display: grid;
  justify-items: end;
  align-items: center;
  justify-content: end;
  align-content: center;
`;

class HeaderController extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const { loading } = data;
    this.state = { userFetchLoading: loading };
  }

  componentWillReceiveProps(nextProps) {
    const oldLoading = this.state.userFetchLoading;
    const { data, dispatch } = nextProps;
    const { error, loading, me } = data;
    if (
      // on initial load, the loading param may be undefined
      // otherwise, check if the state switched between loading/not loading
      oldLoading && !loading
    ) {
      if (error) {
        console.error(error);
      }
      if (!!(me || {})._id) {
        dispatch(authActions.setAuthUser(me));
      } else {
        dispatch(authActions.clearAuthData());
      }
    }
  }

  render() {
    const { pathname, maybeAuthenticated, isAuthenticated } = this.props;

    const StyledSubTitleLink = StyledTitleLink.extend.attrs({
      style: ({ to }) => ({
        color:
          to === pathname ? "hsla(0, 0%, 100%, 1)" : "hsla(0, 0%, 100%, 0.5)"
      })
    })`
    font-size: medium;
    padding: 0.4em;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    color: hsla(0, 0%, 100%, 0.5);
    transition-property: border-left, border-right, color;
    &:hover {
      color: hsla(0, 0%, 100%, 1);
      border-right: 1px solid #fff;
      border-left: 1px solid #fff;
    }
  `;

    const MaybeAuthenticated = styled.svg`
      min-height: 2rem;
      max-height: 48px;
      min-width: 1rem;
    `;

    return (
      <StyledHeader>
        <StyledTitleLink to="/">UDIA</StyledTitleLink>
        {isAuthenticated && (
          <HeaderSubMenu>
            <StyledSubTitleLink to="/sign-out">Sign Out</StyledSubTitleLink>
          </HeaderSubMenu>
        )}
        {!isAuthenticated &&
          !maybeAuthenticated && (
            <HeaderSubMenu>
              <StyledSubTitleLink to="/sign-in">Sign In</StyledSubTitleLink>
              <StyledSubTitleLink to="/sign-up">Sign Up</StyledSubTitleLink>
            </HeaderSubMenu>
          )}
        {maybeAuthenticated &&
          !isAuthenticated && (
            <HeaderSubMenu>
              <MaybeAuthenticated
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 90 90"
                enableBackground="new 0 0 90 90"
              >
                <polygon
                  className="loader-bracket"
                  points="38.182,57.753 20.18,47.91 20.18,42.455 38.182,32.652 38.182,39.074 25.625,45.113 38.182,51.379 "
                />
                <polygon
                  className="loader-slash"
                  points="39.848,62.08 46.351,27.918 50.136,27.918 43.56,62.08 "
                />
                <polygon
                  className="loader-bracket"
                  points="51.8,57.78 51.8,51.4 64.372,45.181 51.8,39.028 51.8,32.696 69.82,42.5 69.82,47.91 "
                />
                <path
                  className="loader-hexagon"
                  d="M44.999,86.031L9.465,65.517V24.484L44.999,3.969l35.536,20.516v41.029L44.999,86.031L44.999,86.031z M13.07,63.434 l31.929,18.434L76.93,63.434V26.566L44.999,8.131L13.07,26.565V63.434L13.07,63.434z"
                />
              </MaybeAuthenticated>
            </HeaderSubMenu>
          )}
      </StyledHeader>
    );
  }
}

function mapStateToProps(state) {
  return {
    pathname: state.routing.location.pathname,
    maybeAuthenticated: authSelectors.maybeAuthenticated(state),
    isAuthenticated: authSelectors.isAuthenticated(state),
    user: state.auth.authUser
  };
}

const CHECK_USER_MUTATION = gql`
  query GetSelfUser {
    me {
      _id
      username
      createdAt
      updatedAt
      email
      emailVerified
    }
  }
`;

const Header = connect(mapStateToProps)(
  graphql(CHECK_USER_MUTATION, { fetchPolicy: "network-only" })(
    HeaderController
  )
);

export { Header };
export default Header;
