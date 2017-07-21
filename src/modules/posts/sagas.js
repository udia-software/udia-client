import { effects } from "redux-saga";
import { getPosts } from "./api";
import { GET_POSTS_REQUEST } from "./constants";
import {
  isGettingPosts,
  setPostsError,
  clearPosts,
  setPostsPagination,
  addPosts
} from "./reducer.actions";

/**
 * Generator function for getting posts.
 * @param {Object} data - Payload for getting posts
 * @param {string} data.page - Page of posts to get
 */
function* getPostsCall(data) {
  yield effects.put(isGettingPosts(true));
  const { page } = data;
  try {
    return yield effects.call(getPosts, page);
  } catch (exception) {
    yield effects.put(setPostsError(exception));
    return false;
  } finally {
    yield effects.put(isGettingPosts(false));
  }
}

/**
 * Saga for getting posts. Listen for GET_POSTS_REQUEST action.
 */
export function* getPostsFlow() {
  while (true) {
    const request = yield effects.take(GET_POSTS_REQUEST);
    const wasSuccessful = yield effects.call(getPostsCall, request.data);
    if (wasSuccessful) {
      const { page_number } = wasSuccessful.pagination;
      if (page_number <= 1) yield effects.put(clearPosts());
      yield effects.put(setPostsPagination(wasSuccessful.pagination));
      yield effects.put(addPosts(wasSuccessful.data));
    }
  }
}
