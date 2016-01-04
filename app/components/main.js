import React from 'react';
import ReactDOM from 'react-dom';
require('../styles/bootstrap.css');
require('babel/polyfill');

const layoutEditor = React.createElement(require('./layoutEditor'));
ReactDOM.render(layoutEditor, document.getElementById('app'));
