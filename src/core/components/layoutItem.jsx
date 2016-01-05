import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import connectToStores from '../../../node_modules/alt/utils/connectToStores';
import LayoutStore from '../stores/LayoutStore';
import LayoutActions from '../actions/LayoutActions';
import HoverButtons from './hoverButtons/index';
import childOwner from './childOwner';

function layoutItemCreator(itemType) {
  return function layoutItem(Spec, ReactComponent = Spec) {
    const boxTarget = {
      drop(props, monitor) {
        const hasDroppedOnChild = monitor.didDrop() && monitor.isOver({ shallow: true });
        return hasDroppedOnChild === undefined
          ? undefined
          : { id: props.id, addChild: props.addChild };
      },
    };
    @childOwner()
    @DropTarget(itemType, boxTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }))
    @connectToStores
    class ItemConnection extends Component {
      static propTypes = {
        isHovered: PropTypes.bool.isRequired,
        isHoveredLeaf: PropTypes.bool.isRequired,
        registerHoverState: PropTypes.func,
        selectedStyle: PropTypes.object,
        selectedId: PropTypes.string,
        id: PropTypes.string.isRequired,
        parentId: PropTypes.string,
        markToDelete: PropTypes.func,
        connectDropTarget: PropTypes.func.isRequired,
        childItems: PropTypes.any,
        addChild: PropTypes.func.isRequired,
        removeChildFromTop: PropTypes.func.isRequired,
        onMouseEnter: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
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

      deleteChild = (id) => {
        return () => {
          this.props.removeChildFromTop(id);
        };
      };

      removeChild = () => {
        const markToDelete = this.props.markToDelete;
        if (markToDelete) markToDelete();
      };

      updateStyle = (style) => {
        this.setState({ style });
      };

      selectItem = () => {
        LayoutActions.selectItem({ id: this.props.id, style: this.state.style });
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
        const { connectDropTarget, addChild, isHoveredLeaf } = this.props;
        const containerClasses = classNames('layout-item-container', {
          'layout-item-container--selected': this.isSelected(),
        });
        return connectDropTarget(
          <div
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            className={containerClasses}
            >
            {isHoveredLeaf && this.state.hoverMenu != null ? this.state.hoverMenu : null}
            <ReactComponent
              createHoverMenu={this.createHoverMenu}
              onClick={this.onClick}
              updateStyle={this.updateStyle}
              deleteChild={this.deleteChild}
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
