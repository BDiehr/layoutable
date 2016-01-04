import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import './headerComponent.scss';
/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag() {
    return { item: 'titleText' };
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      const component = <h1 contentEditable>Title Text</h1>;
      dropResult.addComponent.call(null, component);
    }
  },
};

@DragSource('ITEM', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class TitleTextComponent extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div className="header-component" style={{ opacity: isDragging ? 0.5 : 1 }}>
        Header Text
      </div>
    );
  }
}
