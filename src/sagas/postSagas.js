import { effects } from 'redux-saga';
import { createPost, getPosts } from '../post';
import {
  SENDING_REQUEST,
  REQUEST_ERROR
} from '../actions/constants';

export function* createPostCall({
  title,
  content
}) {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(createPost, title, content);
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.errors || exception.error || 'API Server is down.'
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

export function* getPostsCall() {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(getPosts);
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.errors || exception.error || 'API Server is down.'
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}
