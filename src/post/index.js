import { get, post } from '../api';

export function createPost(title, content) {
  return post('/posts', {
    type: 'text',
    title,
    content
  });
}

export function getPosts() {
  // TO DO add pagination
  return get('/posts/');
}