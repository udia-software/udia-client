import { post } from '../api';

export function createPost(title, content) {
  return post('/posts', {
    title,
    content,
    type: 'text'
  });
}
