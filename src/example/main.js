import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.scss';
import 'babel/polyfill';
import LayoutEditor from './src/layoutEditor';

const layoutEditor = React.createElement(LayoutEditor);
ReactDOM.render(layoutEditor, document.getElementById('app'));
