import { get, post, del } from "../baseApi";

export function createJourney(title, description) {
  return post("/journeys", {
      title,
      description
  });
}

export function getJourney(id) {
  return get(`/journeys/${id}`);
}

export function deleteJourney(id) {
  return del(`/journeys/${id}`);
}