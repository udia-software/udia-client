import { get, post } from "../baseApi";

export function createJourney(title, description) {
  return post("/journeys", {
      title,
      description
  });
}