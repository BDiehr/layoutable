import React, { Component } from 'react';
import LayoutActions from '../../../actions/LayoutActions';

function childOwnerClosure() {
  return function childOwner(Spec, ReactComponent = Spec) {
    class ChildOwner extends Component {
      state = {
        childItems: [],
      };

      addChild = (item) => {
        this.setState({ childItems: this.state.childItems.concat(item) });
      };

      removeChildFromTop = (id) => {
        LayoutActions.deleteItem(id);
        this.setState({ childItems: this.state.childItems.filter(item => item.props.id !== id) });
      };

      render() {
        return (
          <ReactComponent
            {...this.props}
            {...this.state}
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
