import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { ReactNode } from "react";
import { ApolloProvider } from "react-apollo";
import { connect, DispatchProp } from "react-redux";
import { AUTH_TOKEN } from "../../Constants";
import initApolloClient from "../../Modules/InitApolloClient";
import {
  clearAuthData,
  setAuthUser
} from "../../Modules/Reducers/Auth/Actions";
import { FullUser } from "../../Types";

interface IState {
  token: string | null;
  client: ApolloClient<NormalizedCacheObject>;
  userObserver: ZenObservable.Subscription | null;
}

interface IProps extends DispatchProp {
  children: ReactNode; // Child must exist, this is a wrapper
}

const GET_ME_QUERY = gql`
  query GetMeQuery {
    me {
      uuid
      username
      emails {
        email
        primary
        verified
        createdAt
        updatedAt
        verificationExpiry
      }
      encSecretKey
      pubSignKey
      encPrivSignKey
      pubEncKey
      encPrivEncKey
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
      createdAt
      updatedAt
    }
  }
`;

const ME_SUBSCRIPTION = gql`
  subscription MeSubscription {
    me {
      uuid
      username
      emails {
        email
        primary
        verified
        createdAt
        updatedAt
        verificationExpiry
      }
      encSecretKey
      pubSignKey
      encPrivSignKey
      pubEncKey
      encPrivEncKey
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
      createdAt
      updatedAt
    }
  }
`;

/**
 * Wrapper component for managing Apollo Client and web app auth state
 */
class RefreshingApolloProvider extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const token = localStorage.getItem(AUTH_TOKEN);
    this.state = {
      token,
      client: initApolloClient(token),
      userObserver: null
    };
    // tslint:disable-next-line:no-console
    console.info(`Initialized ApolloProvider ${token ? "(JWT!)" : "(No JWT)"}`);
    this.handleLocalStorageUpdated.bind(this);
  }

  public async componentDidMount() {
    window.addEventListener("storage", this.handleLocalStorageUpdated);
    const { client } = this.state;
    await this.fetchAndSubscribeToUser(client);
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return nextState.token !== this.state.token;
  }

  public async componentDidUpdate(prevProps: IProps, prevState: IState) {
    // Only do stuff if the token changed
    if (this.state.token !== prevState.token) {
      const newClient = initApolloClient(this.state.token);
      await newClient.resetStore();
      // tslint:disable-next-line:no-console
      console.info(
        `Refreshed ApolloProvider ${this.state.token ? "(JWT!)" : "(No JWT)"}`
      );
      await this.fetchAndSubscribeToUser(newClient);
      this.setState({ client: newClient });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("storage", this.handleLocalStorageUpdated);
    const { userObserver } = this.state;
    if (!!userObserver) {
      userObserver.unsubscribe();
    }
  }

  public render() {
    return <ApolloProvider {...this.props} client={this.state.client} />;
  }

  /**
   * Detect when to re-initialize the apollo client from the server (usually when JWT changes)
   * @param {StorageEvent} e - when localstorage changed, check if the key was the AUTH_TOKEN.
   */
  protected async handleLocalStorageUpdated(e: StorageEvent) {
    if (e.key === AUTH_TOKEN && e.newValue !== e.oldValue) {
      this.setState({ token: e.newValue });
    }
  }

  /**
   * Get the logged in user and set an observable to detect users changes via server subscription callback
   * @param {ApolloClient<NormalizedCacheObject>} client - ApolloClient with the jwt set in the middleware
   */
  protected async fetchAndSubscribeToUser(
    client: ApolloClient<NormalizedCacheObject>
  ) {
    try {
      const { dispatch } = this.props;
      const { userObserver } = this.state;
      // if a user subscription already exists, unsubscribe
      if (userObserver) {
        userObserver.unsubscribe();
      }

      // Perform gql query to get the user
      const meQueryResponse = await client.query<FullUser | null>({
        fetchPolicy: "network-only",
        query: GET_ME_QUERY
      });
      if (!meQueryResponse.data) {
        dispatch(clearAuthData());
      } else {
        // If the user just logged in or signed up, this should be unnecessary
        dispatch(setAuthUser(meQueryResponse.data));
      }

      // Setup a websocket subscription for listening to user changes
      const newUserObserver = client
        .subscribe<FullUser | null>({
          query: ME_SUBSCRIPTION
        })
        .subscribe(
          data => {
            if (!data) {
              dispatch(clearAuthData());
            } else {
              dispatch(setAuthUser(data));
            }
          },
          err => {
            // tslint:disable-next-line:no-console
            console.error("ERR User Subscription", err);
          }
        );

      // set the observer in state, so we can unsubscribe later
      this.setState({ userObserver: newUserObserver });
    } catch (err) {
      const { userObserver } = this.state;
      // If the server is down, clear the user and the subscription
      if (userObserver) {
        userObserver.unsubscribe();
      }
    }
  }
}

export default connect()(RefreshingApolloProvider);
