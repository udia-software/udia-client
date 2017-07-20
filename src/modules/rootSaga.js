import { effects } from "redux-saga";
import { loginFlow, logoutFlow, registerFlow } from "./auth/sagas";

export default function* root() {
  yield effects.fork(loginFlow);
  yield effects.fork(logoutFlow);
  yield effects.fork(registerFlow);
}
