import { take, fork } from "redux-saga/effects";
import { authActions } from "./actions";

function* signIn(payload) {
  try {
    console.log(payload);
    console.log("signing in... (todo)");
    yield true;
  } catch (error) {
    yield false;
  }
}

// ============
//   WATCHERS
// ============

function* watchSignIn() {
  while (true) {
    let { payload } = yield take(authActions.SIGN_IN_REQUEST);
    yield fork(signIn, payload);
  }
}

export const authSagas = [fork(watchSignIn)];
