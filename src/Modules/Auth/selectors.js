// client may be authenticated if the JWT is set in local storage.
export function maybeAuthenticated(state) {
  return !!state.auth.jwt;
}

// client is authenticated if the user id is set.
export function isAuthenticated(state) {
  return !!(state.auth.authUser || {})._id;
}

const authSelectors = {
  maybeAuthenticated,
  isAuthenticated
};

export default authSelectors;
