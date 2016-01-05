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

      addChild = (item) => {
        this.setState({ childItems: this.state.childItems.concat(item) });
      };


      removeChildFromTop = (id) => {
        LayoutActions.deleteItem(id);
        this.setState({ childItemHoverStates: this.state.childItemHoverStates.filter(childState => childState.id !== id) });
        this.setState({ childItems: this.state.childItems.filter(item => item.props.id !== id) });
      };

      render() {
        return (
          <ReactComponent
            {...this.props}
            childItems={this.state.childItems}
            isHovered={this.state.isHovered}
            isHoveredLeaf={!this.state.childItemHoverStates.some(state => state.isHovered === true)}
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
