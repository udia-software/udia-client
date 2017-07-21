import { combineReducers } from "redux";
import authReducer from './auth/reducer';
import postsReducer from './posts/reducer';
import userReducer from './user/reducer';

const reducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  user: userReducer,
});

export default reducer;
