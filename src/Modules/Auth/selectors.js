// client may be authenticated if the JWT is set in local storage.
export function maybeAuthenticated(state) {
  return !!state.auth.jwt;
}

// client is authenticated if the user id is set.
export function isAuthenticated(state) {
  return !!(state.auth.authUser || {})._id;
}

export function getSelfUsername(state) {
  return (state.auth.authUser || {}).username || "";
}

const authSelectors = {
  maybeAuthenticated,
  isAuthenticated,
  getSelfUsername
};

export default authSelectors;
