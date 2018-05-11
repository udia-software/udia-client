// @flow
// name of local storage key for auth token
const AUTH_TOKEN = 'udia-auth-token';

// build time environment variable for GraphQL HTTP queries/mutations
const REACT_APP_GRAPHQL_HTTP_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT || '__SIMPLE_API_ENDPOINT__';

// build time environment variable for GraphQL subscriptions
const REACT_APP_SUBSCRIPTIONS_ENDPOINT =
  process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT || '__SUBSCRIPTION_API_ENDPOINT__';

const GOOGLE_API_KEY =
  process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyAw4tQaGI9lQL-saJXzjPKRxM2YazystLM';

export {
  AUTH_TOKEN,
  REACT_APP_GRAPHQL_HTTP_ENDPOINT,
  REACT_APP_SUBSCRIPTIONS_ENDPOINT,
  GOOGLE_API_KEY,
};
