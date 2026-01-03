import { Provider } from 'react-redux';
import Board from './containers/Board';
import { WebSocketProvider } from './containers/WebSocketProvider/WebSocketProvider';
import store from './store';

export default () => (
  <Provider store={store}>
    <WebSocketProvider>
      <Board />
    </WebSocketProvider>
  </Provider>
);
