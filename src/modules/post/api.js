import { get, post } from "../baseApi";

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
