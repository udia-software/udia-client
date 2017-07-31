import { effects } from "redux-saga";
import { loginFlow, logoutFlow, registerFlow } from "./auth/sagas";
import { GET_COMMENTS_REQUEST } from "./comments/constants";
import { createCommentFlow, getCommentsFlow } from "./comments/sagas";
import { getPostFlow, createPostFlow, editPostFlow } from "./post/sagas";
import { getPostsFlow } from "./posts/sagas";
import { getUserFlow } from "./user/sagas";

export default function* root() {
  yield effects.all([
    yield effects.fork(loginFlow),
    yield effects.fork(logoutFlow),
    yield effects.fork(registerFlow),
    yield effects.fork(createCommentFlow),
    yield effects.takeEvery(GET_COMMENTS_REQUEST, getCommentsFlow),
    yield effects.fork(getPostFlow),
    yield effects.fork(createPostFlow),
    yield effects.fork(editPostFlow),
    yield effects.fork(getPostsFlow),
    yield effects.fork(getUserFlow)
  ]);
}