import { get } from "../baseApi";

export function getPerceptions(data) {
  return get("/perceptions", data);
}
