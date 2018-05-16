// @flow
import { ApolloClient } from 'apollo-client';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider, connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import App from './Containers/App';
import { configureStore, initializeApolloClient } from './Modules';
import registerServiceWorker from './registerServiceWorker';

type Props = {
  jwt: string,
};

type State = {
  client: ApolloClient,
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Element `root` does not exist!');
}

const { persistor, store } = configureStore();

/* Workaround for getting the Apollo client to referesh on login/logout */
class RefreshingApolloProvider extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      client: initializeApolloClient(),
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.jwt !== nextProps.jwt;
  }

  componentDidUpdate = async () => {
    const newClient = initializeApolloClient();
    await newClient.resetStore();
    this.setState({ client: newClient });
  };

  render() {
    // eslint-disable-next-line no-console
    console.log(`Refreshed ApolloProvider ${this.props.jwt ? '(JWT Set!)' : '(No JWT)'}`);
    return <ApolloProvider {...this.props} client={this.state.client} />;
  }
}

const HydratedApolloProvider = connect(({ auth }) => ({ jwt: auth.jwt }))(RefreshingApolloProvider);

const supportsHistory = 'pushState' in window.history;

/* eslint-disable react/jsx-filename-extension */
function render(AppComponent) {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HydratedApolloProvider>
          <BrowserRouter forceRefresh={!supportsHistory}>
            <AppComponent />
          </BrowserRouter>
        </HydratedApolloProvider>
      </PersistGate>
    </Provider>,
    rootElement,
  );
}
render(App);
registerServiceWorker();
