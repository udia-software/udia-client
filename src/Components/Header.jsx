// @flow

import gql from 'graphql-tag';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { AuthActions, AuthSelectors } from '../Modules/Auth';
import { AUTH_TOKEN } from '../Constants';

const CHECK_USER_MUTATION = gql`
  query GetSelfUser {
    me {
      uuid
      username
      emails {
        email
        primary
        verified
        createdAt
        updatedAt
        verificationExpiry
      }
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwSalt
      createdAt
      updatedAt
    }
  }
`;

const ME_SUBSCRIPTION = gql`
  subscription MeSubscription {
    me {
      uuid
      username
      emails {
        email
        primary
        verified
        createdAt
        updatedAt
        verificationExpiry
      }
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwSalt
      createdAt
      updatedAt
    }
  }
`;

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

type Props = {
  data: {
    error?: any,
    fetchMore: Function,
    loading: boolean,
    me: any,
    networkStatus: number,
    refetch: Function,
    startPolling: Function,
    stopPolling: Function,
    subscribeToMore: Function,
    updateQuery: Function,
    variables: {},
  },
  dispatch: Function,
  location: any,
  subscribeToMe: Function,
  maybeAuthenticated: boolean,
  isAuthenticated: boolean,
  username: string,
};

class HeaderController extends Component<Props> {
  componentDidMount() {
    this.props.subscribeToMe();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleLocalStorageJWTUpdated);
    }
  }

  /**
   * We should update if the user changed, the loading state changed,
   * or we're getting the username from our dispatch.
   * @param {Props} nextProps
   */
  shouldComponentUpdate(nextProps: Props) {
    const {
      data: { loading: wasLoading, me: oldMe },
      username: oldUsername,
    } = this.props;
    const {
      data: { loading: isLoading, me: newMe },
      username: newUsername,
    } = nextProps;
    const userChanged = oldMe !== newMe;
    const loadingChanged = wasLoading !== isLoading;
    const usernameChanged = oldUsername !== newUsername;
    return userChanged || loadingChanged || usernameChanged;
  }

  componentDidUpdate() {
    const { data, dispatch } = this.props;
    const { error, loading, me } = data;
    if (!loading) {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      }
      if ((me || {}).uuid) {
        dispatch(AuthActions.setAuthUser(me));
      } else {
        dispatch(AuthActions.clearAuthData());
      }
    }
  }

  handleLocalStorageJWTUpdated = () => {
    const jwt = localStorage.getItem(AUTH_TOKEN);
    if (jwt) {
      const {
        data: { me: user },
      } = this.props;
      this.props.dispatch(AuthActions.setAuthData({ jwt, user }));
    } else {
      this.props.dispatch(AuthActions.clearAuthData());
    }
  };

  render() {
    const {
      location, maybeAuthenticated, isAuthenticated, username,
    } = this.props;

    const StyledSubTitleLink = StyledTitleLink.extend.attrs({
      style: ({ to }) => ({
        color: to === location.pathname ? 'hsla(0, 0%, 100%, 1)' : 'hsla(0, 0%, 100%, 0.5)',
      }),
    })`
    font-size: medium;
    padding: 0.4em;
    color: hsla(0, 0%, 100%, 0.5);
    &:hover {
      color: hsla(0, 0%, 100%, 1);
      border-right: 1px solid #fff;
      border-left: 1px solid #fff;
    }
  `;

    return (
      <StyledHeader>
        <StyledTitleLink to="/">UDIA</StyledTitleLink>
        {isAuthenticated && (
          <HeaderSubMenu>
            <StyledSubTitleLink to="/sign-out">Sign Out</StyledSubTitleLink>
            <StyledSubTitleLink to="/profile">{username}</StyledSubTitleLink>
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
              <StyledSubTitleLink to="/profile">Loading...</StyledSubTitleLink>
            </HeaderSubMenu>
          )}
      </StyledHeader>
    );
  }
}

function mapStateToProps(state) {
  return {
    maybeAuthenticated: AuthSelectors.maybeAuthenticated(state),
    isAuthenticated: AuthSelectors.isAuthenticated(state),
    username: AuthSelectors.getSelfUsername(state),
  };
}

const withSubscriptionData = graphql(CHECK_USER_MUTATION, {
  fetchPolicy: 'network-only',
  props: props => ({
    ...props,
    subscribeToMe: () =>
      props.data.subscribeToMore({
        document: ME_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => ({ ...prev, ...subscriptionData.data }),
      }),
  }),
});

export default withRouter(connect(mapStateToProps)(withSubscriptionData(HeaderController)));
