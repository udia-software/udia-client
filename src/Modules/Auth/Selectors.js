// @flow
import type { IRootState } from '../RootReducer';

// client may be authenticated if the JWT is set in local storage.
const maybeAuthenticated = (state: IRootState) => !!state.auth.jwt;

// client is authenticated if the user id is set.
const isAuthenticated = (state: IRootState) => !!(state.auth.authUser || {}).uuid;

const getSelfUsername = (state: IRootState) => (state.auth.authUser || {}).username || '';

const getSelfCreatedAt = (state: IRootState) => (state.auth.authUser || {}).createdAt || null;

const getSelfUpdatedAt = (state: IRootState) => (state.auth.authUser || {}).updatedAt || null;

const getSelfEmails = (state: IRootState) => (state.auth.authUser || {}).emails || [];

export default {
  maybeAuthenticated,
  isAuthenticated,
  getSelfUsername,
  getSelfCreatedAt,
  getSelfUpdatedAt,
  getSelfEmails,
};
