// tslint:disable-next-line
const { version } = require("../package.json"); // breaks when using import syntax

export const APP_VERSION = version;

// Name of the local storage key for the JSON web token
export const AUTH_TOKEN = "udia-auth-jwt";

// build time environment variable for GraphQL HTTP queries and mutations
export const GRAPHQL_HTTP_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT || "__SIMPLE_API_ENDPOINT__";

// build time environment variable for GraphQL WS subscriptions
export const GRAPHQL_SUBSCRIPTIONS_ENDPOINT =
  process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT ||
  "__SUBSCRIPTION_API_ENDPOINT__";
