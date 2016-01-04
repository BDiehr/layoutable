import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
require('../styles/bootstrap.css');
require('babel/polyfill');

const routes = (
  <Router>
    <Route path="/" component={require('./shared/layout/index')}>
      <IndexRoute path="layout-editor" component={require('./pages/layoutEditor')} />
      <Route path="*" component={require('./pages/notfound/index')} />
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
