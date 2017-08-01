import { get } from "../baseApi";

export function getJourneys(data) {
  return get("/journeys/", data);
}
