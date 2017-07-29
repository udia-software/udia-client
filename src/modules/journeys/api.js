import { get } from "../baseApi";

export function getJourneys(page) {
  return get("/journeys/", { page });
}
