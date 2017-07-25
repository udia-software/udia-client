import { get } from '../baseApi';

/**
 * Get the specified user
 * @param {string} username The value of the user's username
 */
export function getUser(username) {
  return get(`/users/${username}`);
}
