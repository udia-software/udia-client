import { effects } from "redux-saga";
import { loginFlow, logoutFlow, registerFlow } from "./auth/sagas";
import { getPostsFlow } from "./posts/sagas";
import { getUserFlow } from "./user/sagas";

export default function* root() {
  yield effects.fork(loginFlow);
  yield effects.fork(logoutFlow);
  yield effects.fork(registerFlow);
  yield effects.fork(getPostsFlow);
  yield effects.fork(getUserFlow);
}
