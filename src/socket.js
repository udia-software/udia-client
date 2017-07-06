import { Socket } from 'phoenix';
import { SOCKET_ENDPOINT } from './api';
import { getToken } from './auth';

const socket = new Socket(SOCKET_ENDPOINT, {
  params: {
    token: getToken(),
  },
});

socket.connect();

const channel = socket.channel('post:1', {});
channel.join()
  .receive('ok', resp => {
    console.log('Joined successfully!', resp);
  })
  .receive('error', resp => {
    console.error('Unable to join!', resp);
  });

export default socket;
