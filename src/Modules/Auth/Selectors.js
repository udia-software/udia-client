// @flow
import type { IRootState } from "../RootReducer";

// client may be authenticated if the JWT is set in local storage.
function maybeAuthenticated(state: IRootState) {
  return !!state.auth.jwt;
}

// client is authenticated if the user id is set.
function isAuthenticated(state: IRootState) {
  return !!(state.auth.authUser || {})._id;
}

function getSelfUsername(state: IRootState) {
  return (state.auth.authUser || {}).username || "";
}

function getSelfCreatedAt(state: IRootState) {
  return (state.auth.authUser || {}).createdAt || null;
}

function getSelfUpdatedAt(state: IRootState) {
  return (state.auth.authUser || {}).updatedAt || null;
}

function getSelfEmail(state: IRootState) {
  return (state.auth.authUser || {}).email || "";
}

function getSelfEmailVerified(state: IRootState) {
  return (state.auth.authUser || {}).emailVerified;
}

export const AuthSelectors = {
  maybeAuthenticated,
  isAuthenticated,
  getSelfUsername,
  getSelfCreatedAt,
  getSelfUpdatedAt,
  getSelfEmail,
  getSelfEmailVerified
};
