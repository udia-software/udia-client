import { get, post, patch } from "../baseApi";

export function createPost(title, content, journey_id) {
  return post("/posts", {
    type: "text",
    title,
    content,
    journey_id
  });
}

export function getPost(id) {
  return get(`/posts/${id}`);
}

export function editPost(id, payload) {
  return patch(`/posts/${id}`, { post: payload });
}
