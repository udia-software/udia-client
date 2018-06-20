import { IRootState } from "../RootReducer";

/**
 * Return boolean indicating if user is authenticated
 * @param {IRootState} state - Application root reducer state
 */
export const isAuthenticated = ({ auth }: IRootState) => {
  const hasJWT = !!auth.jwt;
  const authUser = auth.authUser;
  if (hasJWT && !!authUser) {
    return !!authUser.uuid;
  }
  return false;
};

/**
 * Return boolean indicating if user is maybe authenticated (we'll need to fetch full user)
 * @param {IRootState} state - Application root reducer staet
 */
export const maybeAuthenticated = ({ auth }: IRootState) => !!auth.jwt;
