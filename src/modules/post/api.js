import { get, post } from "../baseApi";

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
