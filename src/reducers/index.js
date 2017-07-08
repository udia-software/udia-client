import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import apiReducer from './apiReducer';

const reducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  api: apiReducer
});

export default reducer;
