import React, { Component, PropTypes } from 'react';
import Highlight from 'react-highlight';
import '../../../../node_modules/highlight.js/styles/darkula.css';

function tabs(n) {
  let tabsToAdd = '';
  for (let i = 0; i < n + 1; i++) {
    tabsToAdd = tabsToAdd + '\t';
  }
  return tabsToAdd;
}

function walkHTML(node, depth = 0) {
  if (node.children.length > 0) {
    return (
`${tabs(depth)}<div class="item ${node.model.id}">
  ${node.children
    .map(childNode => walkHTML(childNode, depth + 1))
    .reduce((a, b) => `${a}\n${b}`)
  }
${tabs(depth)}</div>`
    );
  } else {
    return `${tabs(depth)}<div class="item ${node.model.id}"></div>`;
  }
}

export default class HTMLViewer extends Component {
  static propTypes = {
    HTMLTree: PropTypes.any.isRequired,
  };

  getPrettyHTML() {
    const HTMLTree = this.props.HTMLTree;
    if (HTMLTree != null) {
      return `<div class="container">\n${walkHTML(HTMLTree)}\n</div>`;
    }

    return `<div class="container"><div class="item root" \></div>`;
  }

  render() {
    return (
      <Highlight className="html highlight">
        {this.getPrettyHTML()}
      </Highlight>
    );
  }
}
