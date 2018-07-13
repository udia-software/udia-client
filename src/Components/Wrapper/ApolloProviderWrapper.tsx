import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { DateTime } from "luxon";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { connect, DispatchProp } from "react-redux";
import { Dispatch } from "redux";
import { AUTH_TOKEN } from "../../Constants";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import initApolloClient from "../../Modules/InitApolloClient";
import {
  clearAuthData,
  setAuthJWT,
  setAuthUser
} from "../../Modules/Reducers/Auth/Actions";
import { selectSelfJWT } from "../../Modules/Reducers/Auth/Selectors";
import { clearNotesData } from "../../Modules/Reducers/Notes/Actions";
import { clearSecretsData } from "../../Modules/Reducers/Secrets/Actions";
import { base64Decode } from "../PureHelpers/Base64Util";
import { WrapperLoadingComponent } from "./WrapperViewShared";

interface IState {
  loading: boolean;
}

interface IProps extends DispatchProp {
  dispatch: Dispatch;
  token: string | null;
  user: FullUser | null;
}

// tslint:disable:no-console Authentication logic is special and gets to log to console

// Retire the token if its validity is less than this numer of days.
const TOKEN_RETIRE_DAYS = 6;

/**
 * Wrapper component for managing Apollo Client and web app auth state
 * GOTCHA: changing the client prop in the ApolloProvider does not update client in consumers
 * therefore, there's a loading state which forcibly mounts and unmounts the provider.
 */
const RefreshingApolloProviderWrapper = (WrappedComponent: JSX.Element) => {
  let client: ApolloClient<NormalizedCacheObject>;
  let userObserver: ZenObservable.Subscription | null = null;

  class RefreshingApolloProvider extends Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      const token =
        this.props.token && this.quickCheckJWT(this.props.token)
          ? this.props.token
          : null;
      client = initApolloClient(token);
      this.state = {
        loading: false
      };
      console.info(
        `Initialized ApolloProvider Client ${token ? `(JWT Set)` : "(No JWT)"}`
      );
    }

    public async componentDidMount() {
      window.addEventListener("storage", this.handleLocalStorageUpdated);
      const { token } = this.props;
      if (!token) {
        // Unauthenticated, just return the fetch attempt
        return this.fetchAndSubscribeToUser(client);
      }

      // Authenticated, perform JWT sanity checks
      const tokenRawExp = this.quickCheckJWT(token);
      const tokenExpiresAt = DateTime.fromMillis(tokenRawExp * 1000);
      console.info(
        `This JWT will expire:\n\t* in ${tokenExpiresAt
          .diffNow()
          .toFormat(
            "d 'days', h 'hours', m 'minutes', s 'seconds'"
          )}\n\t* on ${tokenExpiresAt.toLocaleString(
          DateTime.DATETIME_HUGE_WITH_SECONDS
        )}`
      );

      if (tokenExpiresAt.diffNow().as("days") < TOKEN_RETIRE_DAYS) {
        console.log(tokenExpiresAt.diffNow().as("days"));
        console.info("Token is getting old... attempt to refresh.");
        try {
          this.setState({ loading: true });
          const resp = await client.mutate<IRefreshJWTResponseData>({
            mutation: REFRESH_JWT_MUTATION
          });
          const { refreshJWT } = resp.data as IRefreshJWTResponseData;

          if (refreshJWT && this.quickCheckJWT(refreshJWT)) {
            const newTokenExpiresAt = DateTime.fromMillis(
              this.quickCheckJWT(refreshJWT) * 1000
            );
            console.info(
              `New JWT will expire:\n\t* in ${newTokenExpiresAt
                .diffNow()
                .toFormat(
                  "d 'days', h 'hours', m 'minutes', s 'seconds'"
                )}\n\t* on ${newTokenExpiresAt.toLocaleString(
                DateTime.DATETIME_HUGE_WITH_SECONDS
              )}`
            );
            this.props.dispatch(setAuthJWT(refreshJWT));
            client = initApolloClient(refreshJWT);
            // await this.fetchAndSubscribeToUser(newClient);
          } else {
            console.info(
              "Request was successful but no token was returned! Purging local user..."
            );
            this.clearLocalUser();
          }
        } catch (err) {
          console.error(err);
          await this.fetchAndSubscribeToUser(client);
        } finally {
          this.setState({ loading: false });
        }
      } else {
        console.info(
          `The JWT will refresh itself on a page reload after ` +
            `its life expectancy is less than ${TOKEN_RETIRE_DAYS} days.`
        );
        await this.fetchAndSubscribeToUser(client);
      }
    }

    public async componentDidUpdate(prevProps: IProps) {
      // Only do stuff if the token changed
      if (this.props.token !== prevProps.token) {
        this.setState({ loading: true });
        const token =
          this.props.token && this.quickCheckJWT(this.props.token)
            ? this.props.token
            : null;
        client = initApolloClient(token);
        console.info(
          `Refreshed ApolloProvider Client ${token ? `(JWT Set)` : "(No JWT)"}`
        );
        await this.fetchAndSubscribeToUser(client);
        this.setState({ loading: false });
      }
    }

    public componentWillUnmount() {
      window.removeEventListener("storage", this.handleLocalStorageUpdated);
      if (!!userObserver) {
        userObserver.unsubscribe();
      }
    }

    public render() {
      const { loading } = this.state;
      if (loading) {
        return WrapperLoadingComponent({});
      }
      return <ApolloProvider client={client} children={WrappedComponent} />;
    }

    /**
     * Detect when to re-initialize the apollo client from the server (usually when JWT changes)
     * @param {StorageEvent} e - when localstorage changed, check if the key was the AUTH_TOKEN.
     */
    protected handleLocalStorageUpdated = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN && e.newValue !== e.oldValue) {
        console.info(e);
        this.props.dispatch(setAuthJWT(e.newValue));
      }
    };

    /**
     * Get the logged in user and set an observable to detect users changes via server subscription callback
     * @param {ApolloClient<NormalizedCacheObject>} client - ApolloClient with the jwt set in the middleware
     */
    protected async fetchAndSubscribeToUser(
      clientInstance: ApolloClient<NormalizedCacheObject>
    ) {
      try {
        const { dispatch } = this.props;
        // if a user subscription already exists, unsubscribe
        if (!!userObserver) {
          userObserver.unsubscribe();
        }
        // Perform gql query to get the user
        const meQueryResponse = await client.query<IMeResponseData | null>({
          fetchPolicy: "network-only",
          query: GET_ME_QUERY
        });
        if (!meQueryResponse.data || !meQueryResponse.data.me) {
          // We successfully made a connection and the server verified the JWT is invalid or not set.
          this.clearLocalUser();
        } else {
          // If the user just logged in or signed up, this should be unnecessary but harmless
          dispatch(setAuthUser(meQueryResponse.data.me));
        }

        // Setup a websocket subscription for listening to user changes
        const newUserObserver = clientInstance
          .subscribe<{ data?: IMeResponseData }>({
            query: ME_SUBSCRIPTION
          })
          .subscribe(
            ({ data }) => {
              if (!data || !data.me) {
                // We successfully made a connection and the server verified the JWT is invalid or not set.
                this.clearLocalUser();
              } else {
                dispatch(setAuthUser(data.me));
              }
            },
            err => {
              console.error("ERR User Subscription", err);
            }
          );

        // set the observer in state, so we can unsubscribe later
        userObserver = newUserObserver;
      } catch (err) {
        // If the server is down, just clear the observer?
        if (userObserver) {
          userObserver.unsubscribe();
        }
      }
    }

    /**
     * Quick check the JSON web token. Does not perform signature verification!
     * Returns JWT payload exp number, or negative integer on error
     */
    private quickCheckJWT = (token: string) => {
      try {
        const [headerB64U, payloadB64U] = token.split(".");
        const jwtHeader: { alg: string; typ?: string } = JSON.parse(
          base64Decode(headerB64U)
        );
        if (jwtHeader.alg !== "HS256") {
          // supplied token algorithm is not HS256
          throw new Error(
            `Invalid header alg: '${jwtHeader.alg}' expected 'HS256'`
          );
        }
        const jwtPayload: {
          uuid: string;
          iat: number;
          exp: number;
        } = JSON.parse(base64Decode(payloadB64U));
        const { user } = this.props;
        if (user && user.uuid !== jwtPayload.uuid) {
          // the user is set locally, but the jwt UUID does not match
          throw new Error(
            `Invalid payload uuid: '${jwtPayload.uuid}' expected '${user.uuid}'`
          );
        }
        return jwtPayload.exp;
      } catch (err) {
        console.error("JWT failed quick check!", err);
        this.props.dispatch(setAuthJWT(token));
        return -1;
      }
    };

    /**
     * The server stated clearly that the user's token is invalid. Clear all sensitive data.
     */
    private clearLocalUser = () => {
      const { dispatch } = this.props;
      dispatch(clearSecretsData());
      dispatch(clearAuthData());
      dispatch(clearNotesData());
    };
  }

  const mapStateToProps = (state: IRootState) => ({
    token: selectSelfJWT(state),
    user: state.auth.authUser
  });

  return connect(mapStateToProps)(RefreshingApolloProvider);
};

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

const REFRESH_JWT_MUTATION = gql`
  mutation RefreshJWT {
    refreshJWT
  }
`;

interface IRefreshJWTResponseData {
  refreshJWT?: string | null;
}

export default RefreshingApolloProviderWrapper;
