import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import Board from './containers/Board';

export default () => (
  <Provider store={store}>
    <Board />
  </Provider>
);
