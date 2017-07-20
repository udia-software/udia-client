import { combineReducers } from "redux";
import authReducer from './auth/reducer';

const reducer = combineReducers({
  auth: authReducer,
});

export default reducer;
