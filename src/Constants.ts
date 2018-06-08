// Name of the local storage key for the JSON web token
const AUTH_TOKEN = "udia-auth-jwt";

// build time environment variable for GraphQL HTTP queries and mutations
const GRAPHQL_HTTP_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT || "__SIMPLE_API_ENDPOINT__";

// build time environment variable for GraphQL WS subscriptions
const GRAPHQL_SUBSCRIPTIONS_ENDPOINT =
  process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT ||
  "__SUBSCRIPTION_API_ENDPOINT__";

export { AUTH_TOKEN, GRAPHQL_HTTP_ENDPOINT, GRAPHQL_SUBSCRIPTIONS_ENDPOINT };
