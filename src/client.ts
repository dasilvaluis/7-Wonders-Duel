import io from 'socket.io-client';
import { SERVER_ADDRESS } from './env';

export const socket = io(SERVER_ADDRESS);
