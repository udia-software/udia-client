import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { authSelectors } from "Modules/Auth";
import { CenterContainer, GridLoadingOverlay } from "Components/Styled";

const AuthenticationLoadingComponent = (
  <CenterContainer>
    <GridLoadingOverlay loading={true} />
  </CenterContainer>
);

/**
 * With Authentication wrapper component
 * @param {*} WrappedComponent React Component to wrap with authentication check
 * @param {bool} requireAuthentication True if needs to be auth'd, false if needs to be not auth'd
 * @param {string} redirectToPath Where to redirect to if requireAuthentication not satisfied?
 * @param {string} redirectReferrer Who is this being referred from?
 */
function WithAuthentication(
  WrappedComponent,
  requireAuthentication,
  redirectToPath,
  redirectReferrer
) {
  const RedirectToComponent = (
    <Redirect
      to={{ pathname: redirectToPath, state: { from: redirectReferrer } }}
    />
  );

  class AuthenticationWrapper extends Component {
    shouldComponentUpdate = nextProps => {
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
      } else {
        if (isAuthenticated) {
          return RedirectToComponent;
        } else if (maybeAuthenticated) {
          return AuthenticationLoadingComponent;
        }
      }
      return <WrappedComponent />;
    }
  }

  function mapStateToProps(state) {
    return {
      maybeAuthenticated: authSelectors.maybeAuthenticated(state),
      isAuthenticated: authSelectors.isAuthenticated(state)
    };
  }

  return connect(mapStateToProps)(AuthenticationWrapper);
}

export { WithAuthentication };
export default WithAuthentication;
