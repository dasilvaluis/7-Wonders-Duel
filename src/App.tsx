import { Provider } from 'react-redux';
import { Board } from './containers/Board/board';
import { WebSocketProvider } from './containers/WebSocketProvider/WebSocketProvider';
import store from './state/store';

export default () => (
  <Provider store={store}>
    <WebSocketProvider>
      <Board />
    </WebSocketProvider>
  </Provider>
);
