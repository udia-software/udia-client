import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';
import postReducer from './postReducer';
import userReducer from './userReducer';

const reducer = combineReducers({
  auth: authReducer,
  api: apiReducer,
  postList: postListReducer,
  post: postReducer,
  user: userReducer,
});

export default reducer;
