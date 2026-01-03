import { compose, createStore } from 'redux';
import reducers from './reducers/reducers';

const devToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = import.meta.env.DEV && window && typeof devToolsCompose === 'function'
  ? devToolsCompose({ name: '7-Wonders-Duel' })
  : compose;

export default createStore(reducers, composeEnhancers());
