import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { OperationDefinitionNode } from "graphql";
import {
  GRAPHQL_HTTP_ENDPOINT,
  GRAPHQL_SUBSCRIPTIONS_ENDPOINT
} from "../Constants";

/**
 * Function for initalizing the Apollo Client for the app
 */
export default function initApolloClient(token: string | null) {
  // Build the Apollo HTTP Link with the authentication token.
  const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const authorizationHeader = token ? `Bearer ${token}` : undefined;
    operation.setContext({
      headers: {
        authorization: authorizationHeader
      }
    });
    return forward!(operation); // not sure when this is undefined
  });
  const httpLinkWithAuth = middlewareAuthLink.concat(
    new HttpLink({
      uri: GRAPHQL_HTTP_ENDPOINT
    })
  );

  // Build the Apollo WS Link with the authentication token.
  const wsLinkWithAuth = new WebSocketLink({
    uri: GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
    options: {
      reconnect: true,
      connectionParams: {
        authorization: token ? token : undefined
      }
    }
  });

  // Only use the websocket link when the operation is a subscription
  const link = split(
    ({ query }) => {
      const mainDefinition = getMainDefinition(query);
      if (mainDefinition.kind === "OperationDefinition") {
        const opDefintion: OperationDefinitionNode = mainDefinition;
        return opDefintion.operation === "subscription";
      }
      return false;
    },
    wsLinkWithAuth,
    httpLinkWithAuth
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: false
  });
}
