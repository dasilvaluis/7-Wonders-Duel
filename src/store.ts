import { createStore, compose } from 'redux';
import reducers from './reducers/reducers';

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: '7-Wonders-Duel' })) || compose;

export default createStore(reducers, composeEnhancers());
