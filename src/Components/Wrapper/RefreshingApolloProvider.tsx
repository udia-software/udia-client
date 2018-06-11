import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import React, { ReactNode } from "react";
import { ApolloProvider } from "react-apollo";
import { AUTH_TOKEN } from "../../Constants";
import initApolloClient from "../../Modules/InitApolloClient";

interface IState {
  token: string | null;
  client: ApolloClient<NormalizedCacheObject>;
}

interface IProps {
  children: ReactNode; // Child must exist, this is a wrapper
}

/**
 * Wrapper component for managing Apollo Client and web application knowledge of auth state
 */
class RefreshingApolloProvider extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const token = localStorage.getItem(AUTH_TOKEN);
    this.state = {
      token,
      client: initApolloClient(token)
    };
    this.handleLocalStorageUpdated.bind(this);
  }

  public componentDidMount() {
    window.addEventListener("storage", this.handleLocalStorageUpdated);
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return nextState.token !== this.state.token;
  }

  public async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.state.token !== prevState.token) {
      const newClient = initApolloClient(this.state.token);
      await newClient.resetStore();
      this.setState({ client: newClient });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("storage", this.handleLocalStorageUpdated);
  }

  public render() {
    return <ApolloProvider {...this.props} client={this.state.client} />;
  }

  protected async handleLocalStorageUpdated(e: StorageEvent) {
    if (e.key === AUTH_TOKEN && e.newValue !== e.oldValue) {
      this.setState({ token: e.newValue });
    }
  }
}

export default RefreshingApolloProvider;
