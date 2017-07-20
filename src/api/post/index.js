import { get, post } from '../../api';

export function createPost(title, content) {
  return post('/posts', {
    type: 'text',
    title,
    content
  });
}

export function getPosts(page) {
  return get('/posts/', {page});
}

export function getPostById(id) {
  return get(`/posts/${id}`);
}