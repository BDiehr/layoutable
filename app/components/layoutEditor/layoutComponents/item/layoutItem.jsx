import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt/utils/connectToStores';
import LayoutStore from '../../../../stores/LayoutStore';
import LayoutActions from '../../../../actions/LayoutActions';

function layoutItemCreator() {
  return function layoutItem(Spec, ReactComponent = Spec) {
    @connectToStores
    class ItemConnection extends Component {
      static propTypes = {
        selectedStyle: PropTypes.object,
        selectedId: PropTypes.string,
        id: PropTypes.string.isRequired,
        parentId: PropTypes.string,
        markToDelete: PropTypes.func,
      };

      state = {
        childItems: [],
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

      deleteChild = (id) => {
        return () => {
          LayoutActions.deleteItem(id);
          const newMap = this.state.childHoverStates;
          newMap.delete(id);
          this.setState({ childHoverStates: newMap });
          this.setState({ childItems: this.state.childItems.filter(item => item.props.id !== id) });
        };
      };

      addChild = (item) => {
        this.selectItem();
        this.setState({ childItems: this.state.childItems.concat(item) });
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

      render() {
        return (
          <ReactComponent
            onClick={this.onClick}
            updateStyle={this.updateStyle}
            addChild={this.addChild}
            deleteChild={this.deleteChild}
            removeChild={this.removeChild}
            onMouseEnterHandler={this.onMouseEnterHandler}
            onMouseLeaveHandler={this.onMouseLeaveHandler}
            isSelected={this.isSelected()}
            isHoveredChild={this.isHoveredChild()}
            childHoverStateRegistration={this.childHoverStateRegistration}
            {...this.state}
            {...this.props}
            >
            {this.state.childItems}
          </ReactComponent>
        );
      }
    }
    return ItemConnection;
  };
}

export default layoutItemCreator;
