import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import commentsReducer from "./comments/reducer";
import postReducer from "./post/reducer";
import postsReducer from "./posts/reducer";
import userReducer from "./user/reducer";
import journeyReducer from "./journey/reducer";
import journeysReducer from "./journeys/reducer";

const reducer = combineReducers({
  auth: authReducer,
  comments: commentsReducer,
  post: postReducer,
  posts: postsReducer,
  user: userReducer,
  journey: journeyReducer,
  journeys: journeysReducer
});

export default reducer;
