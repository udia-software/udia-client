import { Socket } from "phoenix";

const isDevelopment = process.env.NODE_ENV === "development";

let SOCKET_ENDPOINT = "/socket";
if (isDevelopment) {
  SOCKET_ENDPOINT = "ws://127.0.0.1:4000/socket";
} else {
  SOCKET_ENDPOINT = "wss://a.udia.ca/socket";
}

let socket;

/**
 * Connects the websocket to the server
 * @param {string} token - The Guardian generated JWT string
 */
export function setSocket(token) {
  if (socket) {
    socket.disconnect();
  }
  socket = new Socket(SOCKET_ENDPOINT, {
    params: { guardian_token: token }
  });
  socket.connect();
  console.log(socket);
  return socket;
}

export default socket;
