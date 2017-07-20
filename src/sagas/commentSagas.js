import { effects } from 'redux-saga';
import { createComment, getComments } from '../api/comment';
import { API_DOWN_MESSAGE } from '../sagas';
import {
  SENDING_COMMENT_REQUEST,
  COMMENT_REQUEST_ERROR
} from '../actions/constants';

export function* createCommentCall({
  content,
  post_id,
  parent_id
}) {
  yield effects.put({
    type: SENDING_COMMENT_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(createComment, content, post_id, parent_id)
  } catch (exception) {
    yield effects.put({
      type: COMMENT_REQUEST_ERROR,
      error: exception.errors || exception.error || API_DOWN_MESSAGE
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_COMMENT_REQUEST,
      sending: false
    });
  }
}

export function* getCommentsCall({
  page,
  post_id,
  parent_id
}) {
  try {
    return yield effects.call(getComments, page, post_id, parent_id)
  } catch (exception) {
    console.log(exception);
    return false;
  }
}
