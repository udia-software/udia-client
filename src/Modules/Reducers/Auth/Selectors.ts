import { IRootState } from "../RootReducer";

/**
 * Return boolean indicating if user is authenticated
 * @param {IRootState} state - Application root reducer state
 */
export const isAuthenticated = ({ auth }: IRootState) => {
  const authUser = auth.authUser; // can be null
  if (authUser) {
    return !!authUser.uuid;
  }
  return false;
};

/**
 * Return boolean indicating if user is maybe authenticated and we need to fetch full user
 * @param {IRootState} state - Application root reducer staet
 */
export const maybeAuthenticated = ({ auth }: IRootState) => {
  const jwt = auth.jwt;
  if (jwt) {
    return !!jwt;
  }
  return false;
};
