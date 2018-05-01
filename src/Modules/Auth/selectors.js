// client may be authenticated if the JWT is set in local storage.
function maybeAuthenticated(state) {
  return !!state.auth.jwt;
}

// client is authenticated if the user id is set.
function isAuthenticated(state) {
  return !!(state.auth.authUser || {})._id;
}

function getSelfUsername(state) {
  return (state.auth.authUser || {}).username || "";
}

function getSelfCreatedAt(state) {
  return (state.auth.authUser || {}).createdAt || null;
}

function getSelfUpdatedAt(state) {
  return (state.auth.authUser || {}).updatedAt || null;
}

function getSelfEmail(state) {
  return (state.auth.authUser || {}).email || "";
}

function getSelfEmailVerified(state) {
  return (state.auth.authUser || {}).emailVerified;
}

export const authSelectors = {
  maybeAuthenticated,
  isAuthenticated,
  getSelfUsername,
  getSelfCreatedAt,
  getSelfUpdatedAt,
  getSelfEmail,
  getSelfEmailVerified,
};
