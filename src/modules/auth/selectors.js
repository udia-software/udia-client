export function isAuthenticated(state) {
  return !!state.auth.jwt;
}
