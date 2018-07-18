import { IRootState } from "../../ConfigureReduxStore";

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
 * Return username of signed in user, or false if not signed in
 * @param {IRootState} state - Application root reducer state
 */
export const selectSelfUsername = ({ auth }: IRootState) => {
  return !!auth.authUser && auth.authUser.username;
};
