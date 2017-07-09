import { Socket } from 'phoenix';
import { getToken } from '../auth';

const isDevelopment = process.env.NODE_ENV === 'development';

export let SOCKET_ENDPOINT = '/socket';
if (isDevelopment) {
  SOCKET_ENDPOINT = 'ws://127.0.0.1:4000/socket';
} else {
  SOCKET_ENDPOINT = 'wss://a.udia.ca/socket';
}

export function getSocket() {
  const socket = new Socket(SOCKET_ENDPOINT, {
    params: {
      token: getToken(),
    },
  });

  socket.connect();
  // TODO Wire up socket logic
  console.log(socket);
  return socket;
}
