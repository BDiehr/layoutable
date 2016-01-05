import React, { Component } from 'react';
import LayoutActions from '../../../actions/LayoutActions';

function childOwnerClosure() {
  return function childOwner(Spec, ReactComponent = Spec) {
    class ChildOwner extends Component {
      state = {
        isHovered: false,
        childItemHoverStates: [],
        childItems: [],
      };

      onMouseEnter = () => {
        this.setState({ isHovered: true });
      };

      onMouseLeave = () => {
        this.setState({ isHovered: false });
      };

      addChild = (child) => {
        const id = child.props.id;
        const childWithUtils = React.cloneElement(child, {
          registerHoverState: (state) => {
            const hoverStates = this.state.childItemHoverStates
              .filter(h => h.id !== id)
              .concat({ id, state });
            this.setState({ childItemHoverStates: hoverStates });
          },
        });
        this.setState({ childItems: this.state.childItems.concat(childWithUtils) });
      };

      removeChildFromTop = (id) => {
        LayoutActions.deleteItem(id);
        this.setState({ childItemHoverStates: this.state.childItemHoverStates.filter(childState => childState.id !== id) });
        this.setState({ childItems: this.state.childItems.filter(item => item.props.id !== id) });
      };

      isHoveredLeaf() {
        return this.state.isHovered && !this.state.childItemHoverStates.some(h => h.state === true);
      }

      render() {
        const { childItems, isHovered } = this.state;
        return (
          <ReactComponent
            {...this.props}
            childItems={childItems}
            isHovered={isHovered}
            isHoveredLeaf={this.isHoveredLeaf()}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            removeChildFromTop={this.removeChildFromTop}
            addChild={this.addChild}
            />
        );
      }
    }
    return ChildOwner;
  };
}

export default childOwnerClosure;
