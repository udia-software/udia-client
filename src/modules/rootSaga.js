import { effects } from "redux-saga";
import { loginFlow, logoutFlow, registerFlow } from "./auth/sagas";
import { GET_COMMENTS_REQUEST } from "./comments/constants";
import {
  createCommentFlow,
  getCommentsFlow,
  editCommentFlow,
  getUserCommentsFlow
} from "./comments/sagas";
import { getPostFlow, createPostFlow, editPostFlow } from "./post/sagas";
import { getPostsFlow } from "./posts/sagas";
import { getUserFlow } from "./user/sagas";
import { getJourneyFlow, createJourneyFlow, deleteJourneyFlow, editJourneyFlow } from "./journey/sagas";
import { getJourneysFlow } from "./journeys/sagas";
import { GET_PERCEPTIONS_REQUEST } from "./perceptions/constants";
import { getPerceptionsFlow } from "./perceptions/sagas";

export default function* root() {
  yield effects.all([
    yield effects.fork(loginFlow),
    yield effects.fork(logoutFlow),
    yield effects.fork(registerFlow),
    yield effects.fork(createCommentFlow),
    yield effects.takeEvery(GET_COMMENTS_REQUEST, getCommentsFlow),
    yield effects.fork(getUserCommentsFlow),
    yield effects.fork(editCommentFlow),
    yield effects.fork(getPostFlow),
    yield effects.fork(createPostFlow),
    yield effects.fork(editPostFlow),
    yield effects.fork(getPostsFlow),
    yield effects.fork(getUserFlow),
    yield effects.fork(getJourneyFlow),
    yield effects.fork(editJourneyFlow),
    yield effects.fork(createJourneyFlow),
    yield effects.fork(deleteJourneyFlow),
    yield effects.fork(getJourneysFlow),
    yield effects.takeEvery(GET_PERCEPTIONS_REQUEST, getPerceptionsFlow)
  ]);
}
