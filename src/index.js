import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers';
import rootSaga from './sagas';
import App from './App';
import './index.css';


const sagaMiddleware = createSagaMiddleware();


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
