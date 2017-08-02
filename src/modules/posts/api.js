import { get } from "../baseApi";

export function getPosts(params) {
  return get("/posts/", params);
}
