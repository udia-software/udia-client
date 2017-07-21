import { get } from "../baseApi";

export function getPosts(page) {
  return get("/posts/", { page });
}
