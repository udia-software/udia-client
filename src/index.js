import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
// import { createLogger } from 'redux-logger';

import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers';
import rootSaga from './sagas';
import App from './components/App';

const sagaMiddleware = createSagaMiddleware();
// For debugging purposes
// const logger = createLogger();
// const store = createStore(reducer, applyMiddleware(logger, sagaMiddleware));
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
const supportsHistory = 'pushState' in window.history;

sagaMiddleware.run(rootSaga);

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      <App />
    </BrowserRouter>
  </Provider>, 
  rootElement
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter forceRefersh={!supportsHistory}>
          <NextApp />
        </BrowserRouter>
      </Provider>, 
      rootElement      
    )
  })
}

registerServiceWorker();
