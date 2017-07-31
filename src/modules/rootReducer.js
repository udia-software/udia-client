import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import commentsReducer from "./comments/reducer";
import postReducer from "./post/reducer";
import postsReducer from "./posts/reducer";
import presenceReducer from "./presence/reducer";
import userReducer from "./user/reducer";

const reducer = combineReducers({
  auth: authReducer,
  comments: commentsReducer,
  post: postReducer,
  posts: postsReducer,
  presence: presenceReducer,
  user: userReducer
});

export default reducer;