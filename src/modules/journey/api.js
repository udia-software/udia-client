import { get, post, del, patch } from "../baseApi";

export function createJourney(title, description, start_date, end_date) {
  return post("/journeys", {
      title,
      description,
      start_date,
      end_date
  });
}

export function getJourney(id) {
  return get(`/journeys/${id}`);
}

export function editJourney(id, payload) {
  return patch(`/journeys/${id}`, {
    journey: {
      ...payload,
      type: "html"
    }
  });
}


export function deleteJourney(id) {
  return del(`/journeys/${id}`);
}
