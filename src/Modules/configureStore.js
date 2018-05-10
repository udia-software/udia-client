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
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
}
