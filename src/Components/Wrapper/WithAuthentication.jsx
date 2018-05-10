// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AuthSelectors } from '../../Modules/Auth';
import { CenterContainer, GridLoadingOverlay } from '../Styled';

const AuthenticationLoadingComponent = (
  <CenterContainer>
    <GridLoadingOverlay loading />
  </CenterContainer>
);

/**
 * With Authentication wrapper component
 * @param {*} WrappedComponent React Component to wrap with authentication check
 * @param {bool} requireAuthentication True if needs to be auth'd, false if needs to be not auth'd
 * @param {string} redirectToPath Where to redirect to if requireAuthentication not satisfied?
 * @param {string} redirectReferrer Who is this being referred from?
 */
export default function WithAuthentication(
  WrappedComponent: any, // should be a react component like thing
  requireAuthentication: boolean,
  redirectToPath: string,
  redirectReferrer: string,
) {
  const RedirectToComponent = (
    <Redirect to={{ pathname: redirectToPath, state: { from: redirectReferrer } }} />
  );

  type Props = {
    isAuthenticated: boolean,
    maybeAuthenticated: boolean,
  };

  class AuthenticationWrapper extends Component<Props> {
    shouldComponentUpdate = (nextProps) => {
      // We should only update this component if the authentication state changes.
      const oldIsAuthenticated = this.props.isAuthenticated;
      const nextIsAuthenticated = nextProps.isAuthenticated;
      const oldMaybeAuthenticated = this.props.maybeAuthenticated;
      const nextMaybeAuthenticated = nextProps.maybeAuthenticated;
      return (
        oldIsAuthenticated !== nextIsAuthenticated ||
        oldMaybeAuthenticated !== nextMaybeAuthenticated
      );
    };

    render() {
      const { maybeAuthenticated, isAuthenticated } = this.props;
      if (requireAuthentication) {
        if (!maybeAuthenticated) {
          return RedirectToComponent;
        } else if (maybeAuthenticated && !isAuthenticated) {
          return AuthenticationLoadingComponent;
        }
      } else if (isAuthenticated) {
        return RedirectToComponent;
      } else if (maybeAuthenticated) {
        return AuthenticationLoadingComponent;
      }
      return <WrappedComponent />;
    }
  }

  function mapStateToProps(state) {
    return {
      maybeAuthenticated: AuthSelectors.maybeAuthenticated(state),
      isAuthenticated: AuthSelectors.isAuthenticated(state),
    };
  }

  const ConnectedAuthenticationWrapper = connect(mapStateToProps)(AuthenticationWrapper);
  return ConnectedAuthenticationWrapper;
}
