// @flow
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore } from 'redux';
import RootReducer from './RootReducer';

export const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'],
};

export default function () {
  const persistedReducer = persistCombineReducers(rootPersistConfig, RootReducer);
  /* eslint-disable no-underscore-dangle */
  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
  /* eslint-enable */
  const persistor = persistStore(store);
  return { store, persistor };
}
