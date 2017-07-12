import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';
import postReducer from './postReducer';

const reducer = combineReducers({
  auth: authReducer,
  api: apiReducer,
  postList: postListReducer,
  post: postReducer
});

export default reducer;
