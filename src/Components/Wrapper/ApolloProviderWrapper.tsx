import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { connect, DispatchProp } from "react-redux";
import { Dispatch } from "redux";
import { AUTH_TOKEN } from "../../Constants";
import initApolloClient from "../../Modules/InitApolloClient";
import {
  clearAuthData,
  setAuthJWT,
  setAuthUser
} from "../../Modules/Reducers/Auth/Actions";
import { selectSelfJWT } from "../../Modules/Reducers/Auth/Selectors";
import { clearNotesData } from "../../Modules/Reducers/Notes/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { FullUser } from "../../Types";
import { WrapperLoadingComponent } from "./WrapperViewShared";

interface IState {
  loading: boolean;
  client: ApolloClient<NormalizedCacheObject>;
  userObserver: ZenObservable.Subscription | null;
}

interface IProps extends DispatchProp {
  dispatch: Dispatch;
  token: string | null;
}

/**
 * Wrapper component for managing Apollo Client and web app auth state
 * GOTCHA: changing the client prop in the ApolloProvider does not update client in consumers
 * therefore, there's a loading state which forcibly mounts and unmounts the provider.
 */
export default function RefreshingApolloProviderWrapper(
  WrappedComponent: JSX.Element
) {
  class RefreshingApolloProvider extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      const token = props.token;
      const client = initApolloClient(token);
      this.state = {
        loading: false,
        client,
        userObserver: null
      };
      // tslint:disable-next-line:no-console
      console.info(
        `Initialized ApolloProvider Client ${token ? `(JWT Set)` : "(No JWT)"}`
      );
    }

    public async componentDidMount() {
      window.addEventListener("storage", this.handleLocalStorageUpdated);
      const { client } = this.state;
      await this.fetchAndSubscribeToUser(client);
    }

    public async componentDidUpdate(prevProps: IProps) {
      // Only do stuff if the token changed
      if (this.props.token !== prevProps.token) {
        this.setState({ loading: true });
        const newClient = initApolloClient(this.props.token);
        // tslint:disable-next-line:no-console
        console.info(
          `Refreshed ApolloProvider Client ${
            this.props.token ? `(JWT Set)` : "(No JWT)"
          }`
        );
        await this.fetchAndSubscribeToUser(newClient);
        this.setState({ loading: false, client: newClient });
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
      const { loading, client } = this.state;
      if (!loading) {
        return <ApolloProvider client={client} children={WrappedComponent} />;
      } else {
        return WrapperLoadingComponent({});
      }
    }

    /**
     * Detect when to re-initialize the apollo client from the server (usually when JWT changes)
     * @param {StorageEvent} e - when localstorage changed, check if the key was the AUTH_TOKEN.
     */
    protected handleLocalStorageUpdated = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN && e.newValue !== e.oldValue) {
        // tslint:disable-next-line:no-console
        console.info(e);
        this.props.dispatch(setAuthJWT(e.newValue));
      }
    };

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
        const meQueryResponse = await client.query<IMeResponseData | null>({
          fetchPolicy: "network-only",
          query: GET_ME_QUERY
        });
        if (!meQueryResponse.data || !meQueryResponse.data.me) {
          dispatch(clearAuthData());
          dispatch(clearNotesData());
        } else {
          // If the user just logged in or signed up, this should be unnecessary but harmless
          dispatch(setAuthUser(meQueryResponse.data.me));
        }

        // Setup a websocket subscription for listening to user changes
        const newUserObserver = client
          .subscribe<{ data?: IMeResponseData }>({
            query: ME_SUBSCRIPTION
          })
          .subscribe(
            ({ data }) => {
              if (!data || !data.me) {
                dispatch(clearAuthData());
                dispatch(clearNotesData());
              } else {
                dispatch(setAuthUser(data.me));
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
        const { dispatch } = this.props;
        const { userObserver } = this.state;
        // If the server is down, clear the user and the subscription
        if (userObserver) {
          userObserver.unsubscribe();
        }
        dispatch(clearAuthData());
        dispatch(clearNotesData());
      }
    }
  }
  const mapStateToProps = (state: IRootState) => ({
    token: selectSelfJWT(state)
  });

  return connect(mapStateToProps)(RefreshingApolloProvider);
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
      pubVerifyKey
      encPrivateSignKey
      pubEncryptKey
      encPrivateDecryptKey
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
      pubVerifyKey
      encPrivateSignKey
      pubEncryptKey
      encPrivateDecryptKey
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

interface IMeResponseData {
  me: FullUser;
}
