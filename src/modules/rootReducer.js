import { combineReducers } from "redux";
import authReducer from './auth/reducer';
import postsReducer from './posts/reducer';

const reducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
});

export default reducer;
