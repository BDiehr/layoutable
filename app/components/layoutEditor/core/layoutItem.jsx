import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import connectToStores from '../../../../node_modules/alt/utils/connectToStores';
import LayoutStore from '../../../stores/LayoutStore';
import LayoutActions from '../../../actions/LayoutActions';
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
        selectedStyle: PropTypes.object,
        selectedId: PropTypes.string,
        id: PropTypes.string.isRequired,
        parentId: PropTypes.string,
        markToDelete: PropTypes.func,
        connectDropTarget: PropTypes.func.isRequired,
        childItems: PropTypes.any,
        addChild: PropTypes.func.isRequired,
        removeChildFromTop: PropTypes.func.isRequired,
      };

      state = {
        hoverMenu: null,
        childHoverStates: new Map(),
        hover: false,
        style: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          flexGrow: '1',
        },
      };

      static getStores() {
        return [LayoutStore];
      }

      static getPropsFromStores() {
        return LayoutStore.getState();
      }

      childHoverStateRegistration = (id, state) => {
        const newMap = this.state.childHoverStates;
        newMap.set(id, state);
        this.setState({childHoverStates: newMap});
      };

      /*eslint-disable*/
      onMouseEnterHandler = () => {
        this.setState({ hover: true });
      };
      /*eslint-enable*/

      onMouseLeaveHandler = () => {
        this.setState({ hover: false });
      };

      isHoveredChild = () => {
        /** Determine if we should show the utility buttons */
        const iteratorOfChildHoverStates = this.state.childHoverStates.values();
        let hasHoveredChild = false;
        for (const hoverState of iteratorOfChildHoverStates) {
          if (hoverState) {
            hasHoveredChild = true;
            break;
          }
        }
        return this.state.hover && !hasHoveredChild;
      };

      componentWillMount() {
        LayoutActions.addItem({ id: this.props.id, parentId: this.props.parentId });
      }

      isSelected = () => {
        return this.props.selectedId != null && this.props.id === this.props.selectedId;
      };

      deleteChild = (id) => {
        return () => {
          const newMap = this.state.childHoverStates;
          newMap.delete(id);
          this.setState({ childHoverStates: newMap });
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

      onClick = () => {
        if (this.isHoveredChild()) {
          this.selectItem();
        }
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
        const { connectDropTarget, addChild } = this.props;
        const containerClasses = classNames('layout-item-container', {
          'layout-item-container--selected': this.isSelected(),
        });
        return connectDropTarget(
          <div
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
            className={containerClasses}
            >
            {this.isHoveredChild() ? this.state.hoverMenu : null}
            <ReactComponent
              createHoverMenu={this.createHoverMenu}
              onClick={this.onClick}
              updateStyle={this.updateStyle}
              addChild={addChild}
              deleteChild={this.deleteChild}
              removeChild={this.removeChild}
              isSelected={this.isSelected()}
              childHoverStateRegistration={this.childHoverStateRegistration}
              {...this.state}
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
