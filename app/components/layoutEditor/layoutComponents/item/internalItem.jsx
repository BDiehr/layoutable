import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';

class InternalItem extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    children: PropTypes.any,
    style: PropTypes.object.isRequired,
    number: PropTypes.number,
    id: PropTypes.string.isRequired,
    getCounter: PropTypes.func.isRequired,
    addComponent: PropTypes.func.isRequired,
  };

  renderChildren() {
    const children = this.props.children || [];
    if (this.props.id === 'root' && children.length === 0) {
      return <div className="intro-text">Hover Over Me To See Options!</div>;
    } else {
      return children.map((child, i) => React.cloneElement(child, {
        number: i,
        getCounter: this.props.getCounter,
      }));
    }
  }

  render() {
    const { style, onClick } = this.props;
    const classes = classNames({
      'layout-item': true,
    });

    return (
      <div
        onClick={onClick}
        style={style}
        className={classes}
        >
        {this.renderChildren()}
      </div>
    );
  }
}

export default InternalItem;
