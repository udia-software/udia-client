import { GET_PERCEPTIONS_REQUEST } from "./constants";

export function getPerceptionsRequest(data) {
  return {
    type: GET_PERCEPTIONS_REQUEST,
    data
  }
}