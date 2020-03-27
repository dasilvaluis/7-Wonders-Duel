import { createStore, compose } from 'redux';
import reducers from './reducers/reducers';
import { NODE_ENV } from './env';

const devToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = NODE_ENV === 'development' && window && typeof devToolsCompose === 'function'
  ? devToolsCompose({ name: '7-Wonders-Duel' })
  : compose;

export default createStore(reducers, composeEnhancers());
