import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import Board from './containers/Board';
import { WebSocketProvider } from './containers/WebSocketProvider/websocket-provider';

export default () => (
  <Provider store={store}>
    <WebSocketProvider>
      <Board />
    </WebSocketProvider>
  </Provider>
);
