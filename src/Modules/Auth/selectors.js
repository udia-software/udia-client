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

export function getSelfCreatedAt(state) {
  return (state.auth.authUser || {}).createdAt || null;
}

export function getSelfUpdatedAt(state) {
  return (state.auth.authUser || {}).updatedAt || null;
}

export function getSelfEmail(state) {
  return (state.auth.authUser || {}).email || "";
}

export function getSelfEmailVerified(state) {
  return (state.auth.authUser || {}).emailVerified;
}

const authSelectors = {
  maybeAuthenticated,
  isAuthenticated,
  getSelfUsername,
  getSelfCreatedAt,
  getSelfUpdatedAt,
  getSelfEmail,
  getSelfEmailVerified,
};

export default authSelectors;
