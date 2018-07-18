import React, { Component, ComponentClass } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { isAuthenticated as selectIsAuth } from "../../Modules/Reducers/Auth/Selectors";

interface IProps {
  isAuthenticated: boolean;
}

/**
 * With Authentication wrapper component
 * @param WrappedComponent React Component to wrap with authentication check
 * @param requireAuthentication True if needs to be auth'd, false if needs to be not auth'd
 * @param redirectToPath Where to redirect to if requireAuthentication not satisfied?
 */
const WithAuth = (
  WrappedComponent: ComponentClass<any>,
  requireAuthentication: boolean,
  redirectToPath: string
) => {
  class AuthenticationWrapper extends Component<IProps> {
    public shouldComponentUpdate(nextProps: IProps) {
      // We should only update this component if the authentication state changes.
      const oldIsAuthenticated = this.props.isAuthenticated;
      const nextIsAuthenticated = nextProps.isAuthenticated;
      return oldIsAuthenticated !== nextIsAuthenticated;
    }

    public render() {
      if (this.shouldRedirect()) {
        return <Redirect push={true} to={redirectToPath} />;
      } else {
        return <WrappedComponent {...this.props} />;
      }
    }

    private shouldRedirect = () => {
      const { isAuthenticated } = this.props;
      return (
        (requireAuthentication && !isAuthenticated) || // require auth but not authenticated
        (!requireAuthentication && isAuthenticated) // require no-auth but authenticated
      );
    };
  }

  const mapStateToProps = (state: IRootState) => ({
    isAuthenticated: selectIsAuth(state)
  });

  return connect(mapStateToProps)(AuthenticationWrapper);
};

export default WithAuth;
