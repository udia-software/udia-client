import { Socket } from "phoenix";
import { getToken } from "./auth/api";

const isDevelopment = process.env.NODE_ENV === "development";

let SOCKET_ENDPOINT = "/socket";
if (isDevelopment) {
  SOCKET_ENDPOINT = "ws://127.0.0.1:4000/socket";
} else {
  SOCKET_ENDPOINT = "wss://a.udia.ca/socket";
}

/**
 * Create a websocket
 * @param {string} token - The Guardian generated JWT string
 */
export function getSocket(token) {
  const socket = new Socket(SOCKET_ENDPOINT, {
    params: { guardian_token: getToken() }
  });
  return socket;
}
