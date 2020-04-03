import io from 'socket.io-client';
import { SERVER_ADDRESS } from './env';

export const socket = io('http://localhost:8000');
