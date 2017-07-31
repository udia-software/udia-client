import { get, post, patch } from "../baseApi";

export function createPost(title, content) {
  return post("/posts", {
    type: "text",
    title,
    content
  });
}

export function getPost(id) {
  return get(`/posts/${id}`);
}

export function editPost(id, payload) {
  return patch(`/posts/${id}`, { post: payload });
}
