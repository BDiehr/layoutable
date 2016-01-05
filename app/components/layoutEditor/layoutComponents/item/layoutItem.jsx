import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt/utils/connectToStores';
import LayoutStore from '../../../../stores/LayoutStore';
import LayoutActions from '../../../../actions/LayoutActions';

function layoutItem(Spec, ReactComponent = Spec) {

  @connectToStores
  class ItemConnection extends Component {
    static propTypes = {
      selectedStyle: PropTypes.object,
      selectedId: PropTypes.string,
      id: PropTypes.string.isRequired,
      parentId: PropTypes.string,
    };

    state = {
      childHoverStates: new Map(),
      hover: false,
    };

    static getStores() {
      return [LayoutStore];
    }

    childHoverStateRegistration = (id, state) => {
      const newMap = this.state.childHoverStates;
      newMap.set(id, state);
      this.setState({childHoverStates: newMap});
    };

    static getPropsFromStores() {
      return LayoutStore.getState();
    }

    onMouseEnterHandler = () => {
      this.setState({ hover: true });
    };

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

    removeChild = () => {
      const markToDelete = this.props.markToDelete;
      if (markToDelete) markToDelete();
    };

    componentWillMount() {
      LayoutActions.addItem({ id: this.props.id, parentId: this.props.parentId });
    }

    isSelected = () => {
      return this.props.selectedId != null && this.props.id === this.props.selectedId;
    };

    render() {
      return (
        <ReactComponent
          removeChild={this.removeChild}
          isSelected={this.isSelected()}
          onMouseEnterHandler={this.onMouseEnterHandler}
          onMouseLeaveHandler={this.onMouseLeaveHandler}
          isHoveredChild={this.isHoveredChild()}
          childHoverStateRegistration={this.childHoverStateRegistration}
          {...this.state}
          {...this.props}
          />
      );
    }
  }

  return ItemConnection;
}

export default layoutItem;
