import _ from 'lodash';
import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import LayoutActions from '../../../../actions/LayoutActions';
import HoverButtons from './../../core/hoverButtons/index';
import InternalItem from './internalItem';
import './item.scss';
import layoutItem from './layoutItem';

@layoutItem
class Item extends Component {
  static propTypes = {
    hover: PropTypes.bool.isRequired,
    isHoveredChild: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    children: PropTypes.any,
    number: PropTypes.number,
    id: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
    parentId: PropTypes.string,
    selectedStyle: PropTypes.object,
    selectedId: PropTypes.string,
    registerHoveredState: PropTypes.func,
    markToDelete: PropTypes.func,
    getCounter: PropTypes.func.isRequired,
    incrementCounter: PropTypes.func.isRequired,
    onMouseEnterHandler: PropTypes.func.isRequired,
    onMouseLeaveHandler: PropTypes.func.isRequired,
    childHoverStateRegistration: PropTypes.func.isRequired,
    childHoverStates: PropTypes.object,
  };

  state = {
    childComponents: [],
    childItems: [],
    style: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      flexWrap: 'nowrap',
      flexGrow: '1',
    },
  };

  componentDidUpdate(prevProps, prevState) {
    /** Handle registered hover map */
    if (prevProps.hover !== this.props.hover) {
      const { registerHoveredState, id } = this.props;
      if (registerHoveredState) registerHoveredState(id, this.props.hover);
    }
    /** Handle change in selected Style */
    if (this.props.isSelected && !_.isEqual(this.state.style, this.props.selectedStyle)) {
      // TODO: Change this implementation not to set in `componentDidUpdate`.
      this.setState({style: this.props.selectedStyle});
    }
  }

  onClick = () => {
    if (this.props.isHoveredChild) {
      this.selectItem();
    }
  };

  selectItem = () => {
    LayoutActions.selectItem({ id: this.props.id, style: this.state.style });
  };

  deleteChild = (id) => {
    return () => {
      LayoutActions.deleteItem(id);
      const newMap = this.props.childHoverStates;
      newMap.delete(id);
      this.setState({ childHoverStates: newMap });
      this.setState({ childItems: this.state.childItems.filter(item => item.props.id !== id) });
    };
  };

  addChild = () => {
    this.selectItem();
    const childItems = this.state.childItems;
    const itemId = `item-depth-${this.props.depth + 1}-num-${this.props.getCounter()}`;
    const newItem = (
      <Item
        key={itemId}
        id={itemId}
        depth={this.props.depth + 1}
        parentId={this.props.id}
        markToDelete={this.deleteChild(itemId)}
        registerHoveredState={this.props.childHoverStateRegistration}
        />
    );
    this.setState({ childItems: childItems.concat(newItem) });
  };

  addComponent = (component) => {
    this.selectItem();
    const childComponents = this.state.childComponents;
    this.setState({ childComponents: childComponents.concat(component) });
  };

  render() {
    const style = this.state.style;
    const containerClasses = classNames('layout-item-container', {
      'layout-item-container--selected': this.props.isSelected,
    });

    return (
      <div
        onMouseEnter={this.props.onMouseEnterHandler}
        onMouseLeave={this.props.onMouseLeaveHandler}
        className={containerClasses}>
        {this.props.isHoveredChild ? (
          <HoverButtons
            addChild={this.addChild}
            removeChild={this.props.id !== 'root' ? this.props.removeChild : undefined}
            />
        ) : null}
        <InternalItem
          onClick={this.onClick}
          addChild={this.addChild}
          addComponent={this.addComponent}
          id={this.props.id}
          style={style}
          getCounter={this.props.getCounter}
          childComponents={this.state.childComponents}
          >
          {this.state.childItems}
        </InternalItem>
      </div>
    );
  }
}

export default Item;
