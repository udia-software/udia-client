// @flow
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import {
  AUTH_TOKEN,
  REACT_APP_GRAPHQL_HTTP_ENDPOINT,
  REACT_APP_SUBSCRIPTIONS_ENDPOINT,
} from '../Constants';

export default function () {
  // Build the Apollo Http Link with the authentication token
  const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    const authorizationHeader = token ? `${token}` : null;
    operation.setContext({
      headers: {
        authorization: authorizationHeader,
      },
    });
    return forward(operation);
  });
  const httpLinkWithAuthToken = middlewareAuthLink.concat(new HttpLink({
    uri: REACT_APP_GRAPHQL_HTTP_ENDPOINT,
  }));

  // Build the Apollo Websocket Link with the authentication token
  const wsLinkWithAuthToken = new WebSocketLink({
    uri: REACT_APP_SUBSCRIPTIONS_ENDPOINT,
    options: {
      reconnect: true,
      connectionParams: {
        authorization: localStorage.getItem(AUTH_TOKEN),
      },
    },
  });

  // Determine which link to use. If operation is subscription, use WebsocketLink
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLinkWithAuthToken,
    httpLinkWithAuthToken,
  );
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  client.resetStore();
  return client;
}
