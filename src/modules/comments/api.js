import { get, post } from "../baseApi";

export function createComment(content, post_id, parent_id) {
  return post("/comments", { type: "text", content, post_id, parent_id });
}

export function getComments(page, post_id, parent_id) {
  return get("/comments", { page, post_id, parent_id });
}