import React, { Component, PropTypes} from 'react';
import HoverButtons from './../../core/hoverButtons/index';
import classNames from 'classnames';

export default class InternalBox extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isHoveredChild: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    children: PropTypes.any,
    style: PropTypes.object.isRequired,
    number: PropTypes.number,
    id: PropTypes.string.isRequired,
    getCounter: PropTypes.func.isRequired,
    removeChild: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
  };

  renderChildren() {
    const { id, getCounter, children } = this.props;
    if (id === 'root' && children.length === 0) {
      return <div className="intro-text">Hover Over Me To See Options!</div>;
    } else {
      return children.map((child, i) => React.cloneElement(child, {
        number: i,
        getCounter: getCounter,
      }));
    }
  }

  render() {
    const { style, onClick, removeChild, addItem, isHoveredChild, id } = this.props;
    const classes = classNames({
      'layout-item': true,
    });

    return (
      <div
        onClick={onClick}
        style={style}
        className={classes}
        >
        {isHoveredChild ? (
          <HoverButtons
            addChild={addItem}
            removeChild={id !== 'root' ? removeChild : undefined}
            />
        ) : null}
        {this.renderChildren()}
      </div>
    );
  }
}
