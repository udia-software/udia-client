import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';

const reducer = combineReducers({
  auth: authReducer,
  post: postReducer
});

export default reducer;
