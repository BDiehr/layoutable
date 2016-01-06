import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import connectToStores from '../../../node_modules/alt/utils/connectToStores';
import LayoutStore from '../stores/LayoutStore';
import LayoutActions from '../actions/LayoutActions';
import HoverButtons from './hoverButtons/index';
import childOwner from './childOwner';

/**
 * React Drag n Drop Decorator Functions
 */


function layoutItemCreator(itemType, options) {
  const layoutItemSource = {
    beginDrag() {
      return { item: 'box' };
    },

    endDrag(props, monitor) {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        const { addChild, getCounter, id, depth, removeChildFromTop } = dropResult;
        const deleteChild = (childId) => () => removeChildFromTop(childId);
        options.addItem({addChild, deleteChild, getCounter, id, depth})();
      }
    },
  };

  const layoutItemTarget = {
    drop(props, monitor) {
      const hasDroppedOnChild = monitor.didDrop() && monitor.isOver({ shallow: true });
      return hasDroppedOnChild === undefined
        ? undefined
        : props;
    },
  };

  // TODO: Make root not draggable
  return function layoutItem(Spec, ReactComponent = Spec) {
    @childOwner()
    @DragSource('BOX', layoutItemSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }))
    @DropTarget(itemType, layoutItemTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }))
    @connectToStores
    class ItemConnection extends Component {
      static propTypes = {
        /** React-dnd related */
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        isOver: PropTypes.bool.isRequired,
        isOverCurrent: PropTypes.bool.isRequired,
        /** Misc */
        inDragMenu: PropTypes.bool,
        isHovered: PropTypes.bool.isRequired,
        isHoveredLeaf: PropTypes.bool.isRequired,
        registerHoverState: PropTypes.func,
        selectedStyle: PropTypes.object,
        selectedId: PropTypes.string,
        id: PropTypes.string.isRequired,
        parentId: PropTypes.string,
        markToDelete: PropTypes.func,
        childItems: PropTypes.any,
        addChild: PropTypes.func.isRequired,
        removeChildFromTop: PropTypes.func.isRequired,
        onMouseEnter: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
      };

      static defaultProps = {
        inDragMenu: false,
      };

      state = {
        hoverMenu: null,
        style: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          flexGrow: '1',
        },
      };

      componentWillMount() {
        LayoutActions.addItem({ id: this.props.id, parentId: this.props.parentId });
      }

      componentDidUpdate(prevProps) {
        const { registerHoverState, isHovered } = this.props;
        if (registerHoverState != null && prevProps.isHovered !== isHovered) {
          registerHoverState(isHovered);
        }
      }

      onClick = () => {
        if (this.props.isHoveredLeaf) {
          this.selectItem();
        }
      };

      static getStores() {
        return [LayoutStore];
      }

      static getPropsFromStores() {
        return LayoutStore.getState();
      }

      isSelected = () => {
        return this.props.selectedId != null && this.props.id === this.props.selectedId;
      };

      removeChild = () => {
        const markToDelete = this.props.markToDelete;
        if (markToDelete) markToDelete();
      };

      updateStyle = (style) => {
        if (!this.props.inDragMenu) this.setState({ style });
      };

      selectItem = () => {
        if (!this.props.inDragMenu) LayoutActions.selectItem({ id: this.props.id, style: this.state.style });
      };

      createHoverMenu = ({ addChild, removeChild }) => {
        const hoverMenu = (
          <HoverButtons
            addChild={addChild}
            removeChild={this.props.id !== 'root' ? removeChild : undefined}
            />
        );
        this.setState({ hoverMenu });
      };

      render() {
        const { addChild, isHoveredLeaf, inDragMenu } = this.props;
        const containerClasses = classNames('layout-item-container', {
          'layout-item-container--selected': this.isSelected(),
        });
        return (
          <div
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            className={containerClasses}
            >
            {!inDragMenu && isHoveredLeaf && this.state.hoverMenu != null ? this.state.hoverMenu : null}
            <ReactComponent
              createHoverMenu={this.createHoverMenu}
              onClick={this.onClick}
              updateStyle={this.updateStyle}
              removeChild={this.removeChild}
              isSelected={this.isSelected()}
              addChild={addChild}
              style={this.state.style}
              {...this.props}
              >
              {this.props.childItems}
            </ReactComponent>
          </div>
        );
      }
    }
    return ItemConnection;
  };
}

export default layoutItemCreator;
