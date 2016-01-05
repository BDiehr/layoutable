import React, { Component, PropTypes } from 'react';
import './detailPane.scss';

export default class DetailPane extends Component {
  static propTypes = {
    children: PropTypes.any,
    selectedId: PropTypes.string,
    selectedStyle: PropTypes.object,
  };

  renderChildren() {
    const { selectedId, selectedStyle, children = [] } = this.props;
    if (children == null) return null;
    const firstChild = children[0] || children;
    return React.cloneElement(firstChild, { selectedId, selectedStyle });
  }

  render() {
    return (
      <div className="detail-pane">
        <div className="control-container-title">
          <div className="control-container-title__text">Control Panel</div>
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}
