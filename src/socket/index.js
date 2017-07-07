import { Socket } from 'phoenix';
import { getToken } from '../auth';

const isDevelopment = process.env.NODE_ENV === 'development';

export let SOCKET_ENDPOINT = '/socket';
if (isDevelopment) {
  SOCKET_ENDPOINT = 'ws://127.0.0.1:4000/socket';
} else {
  SOCKET_ENDPOINT = 'wss://udia-staging.herokuapp.com/socket';
}

export function getSocket() {
  const socket = new Socket(SOCKET_ENDPOINT, {
    params: {
      token: getToken(),
    },
  });

  socket.connect();
  console.log(socket);
  return socket;
}
