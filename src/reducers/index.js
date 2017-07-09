import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';

const reducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  api: apiReducer,
  postList: postListReducer
});

export default reducer;
