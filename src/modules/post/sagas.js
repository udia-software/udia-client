import { effects } from "redux-saga";
import { createPost, getPost } from "./api";
import { CREATE_POST_REQUEST, GET_POST_REQUEST } from "./constants";
import {
  isSendingPost,
  setPostError,
  clearPostError,
  setPost,
  setPostTitle,
  setPostContent
} from "./reducer.actions";

/**
 * Generator function for creating a post
 * @param {Object} data - Create post payload
 * @param {string} data.title - Title of post
 * @param {string} data.content - Content of post
 */
function* createPostCall(data) {
  yield effects.put(isSendingPost(true));
  const { title, content, journey_id } = data;
  try {
    return yield effects.call(createPost, title, content, journey_id);
  } catch (exception) {
    yield effects.put(setPostError(exception));
    return false;
  } finally {
    yield effects.put(isSendingPost(false));
  }
}

/**
 * Generator function for getting a post
 * @param {Object} data - Get post payload
 * @param {string} data.id - ID of post to get
 */
function* getPostCall(data) {
  yield effects.put(isSendingPost(true));
  const { id } = data;
  try {
    return yield effects.call(getPost, id);
  } catch (exception) {
    yield effects.put(setPostError(exception));
    return false;
  } finally {
    yield effects.put(isSendingPost(false));
  }
}

/**
 * Saga for creating a new post. Listen for CREATE_POST_REQUEST action.
 */
export function* createPostFlow() {
  while (true) {
    const request = yield effects.take(CREATE_POST_REQUEST);
    const wasSuccessful = yield effects.call(createPostCall, request.data);

    if (wasSuccessful) {
      yield effects.put(setPostTitle(""));
      yield effects.put(setPostContent(""));
      yield effects.put(setPost(wasSuccessful.data));
      yield effects.put(clearPostError());
      // TODO: Redirect to Post Page
    }
  }
}

/**
 * Saga for getting a post. Listen for GET_POST_REQUEST action.
 */
export function* getPostFlow() {
  while (true) {
    const request = yield effects.take(GET_POST_REQUEST);
    const wasSuccessful = yield effects.call(getPostCall, request.data);
    if (wasSuccessful) {
      yield effects.put(setPost(wasSuccessful.data));
      yield effects.put(clearPostError());
    }
  }
}
