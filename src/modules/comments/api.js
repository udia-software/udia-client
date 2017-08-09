import { get, patch, post } from "../baseApi";

export function createComment(content, post_id, parent_id) {
  return post("/comments", { type: "text", content, post_id, parent_id });
}

export function getComments(data) {
  return get("/comments", data);
}

export function editComment(comment_id, content) {
  return patch(`/comments/${comment_id}`, { comment: { content } });
}
