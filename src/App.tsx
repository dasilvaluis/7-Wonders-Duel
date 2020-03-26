import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import Board from './containers/Board/Board';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

export default () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/">
          <Board />
        </Route>
      </Switch>
    </Router>
  </Provider>
);
