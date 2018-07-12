import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import {
  isAuthenticated as selectIsAuth,
  maybeAuthenticated as selectMaybeAuth
} from "../../Modules/Reducers/Auth/Selectors";
import { WrapperLoadingComponent } from "./WrapperViewShared";

interface IProps {
  isAuthenticated: boolean;
  maybeAuthenticated: boolean;
}

/**
 * With Authentication wrapper component
 * @param {*} WrappedComponent React Component to wrap with authentication check
 * @param {bool} requireAuthentication True if needs to be auth'd, false if needs to be not auth'd
 * @param {string} redirectToPath Where to redirect to if requireAuthentication not satisfied?
 * @param {string} redirectReferrer Who is this being referred from?
 */
const WithAuth = (
  WrappedComponent: any, // should be a react component like thing
  requireAuthentication: boolean,
  redirectToPath: string
) => {
  const RedirectToComponent = (
    <Redirect
      push={true}
      to={{ pathname: redirectToPath }}
    />
  );

  class AuthenticationWrapper extends Component<IProps> {
    public shouldComponentUpdate(nextProps: IProps) {
      // We should only update this component if the authentication state changes.
      const oldIsAuthenticated = this.props.isAuthenticated;
      const nextIsAuthenticated = nextProps.isAuthenticated;
      const oldMaybeAuthenticated = this.props.maybeAuthenticated;
      const nextMaybeAuthenticated = nextProps.maybeAuthenticated;
      return (
        oldIsAuthenticated !== nextIsAuthenticated ||
        oldMaybeAuthenticated !== nextMaybeAuthenticated
      );
    }

    public render() {
      const { maybeAuthenticated, isAuthenticated } = this.props;
      const redirect =
        (requireAuthentication && !maybeAuthenticated) || // require auth but not authenticated
        (!requireAuthentication && isAuthenticated); // require no-auth but authenticated
      const pending =
        (requireAuthentication && maybeAuthenticated && !isAuthenticated) || // require auth but auth tbd
        (!requireAuthentication && maybeAuthenticated); // require no-auth but auth tbd
      if (redirect) {
        return RedirectToComponent;
      } else if (pending) {
        return WrapperLoadingComponent({
          loadingText: "Fetching user data..."
        });
      } else {
        return <WrappedComponent {...this.props} />;
      }
    }
  }

  const mapStateToProps = (state: IRootState) => ({
    maybeAuthenticated: selectMaybeAuth(state),
    isAuthenticated: selectIsAuth(state)
  });

  return connect(mapStateToProps)(AuthenticationWrapper);
};

export default WithAuth;
