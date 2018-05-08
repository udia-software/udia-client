// @flow
// name of local storage key for auth token
export const AUTH_TOKEN = 'udia-auth-token';

// build time environment variable for GraphQL HTTP queries/mutations
export const REACT_APP_GRAPHQL_HTTP_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT || '__SIMPLE_API_ENDPOINT__';

// build time environment variable for GraphQL subscriptions
export const REACT_APP_SUBSCRIPTIONS_ENDPOINT =
  process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT || '__SUBSCRIPTION_API_ENDPOINT__';
