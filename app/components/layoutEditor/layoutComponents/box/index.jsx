import _ from 'lodash';
import HoverButtons from './../../core/hoverButtons/index';
import React, { Component, PropTypes} from 'react';
import './box.scss';
import layoutItem from './../../core/layoutItem';

@layoutItem()
class Box extends Component {
  static propTypes = {
    children: PropTypes.any,
    hover: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    isHoveredChild: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    depth: PropTypes.number.isRequired,
    number: PropTypes.number,
    id: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    selectedId: PropTypes.string,
    selectedStyle: PropTypes.object,
    registerHoveredState: PropTypes.func,
    markToDelete: PropTypes.func,
    getCounter: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    removeChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    updateStyle: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    childHoverStateRegistration: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    /** Handle registered hover map */
    if (prevProps.hover !== this.props.hover) {
      const { registerHoveredState, id } = this.props;
      if (registerHoveredState) registerHoveredState(id, this.props.hover);
    }
    /** Handle change in selected Style */
    if (this.props.isSelected && !_.isEqual(this.props.style, this.props.selectedStyle)) {
      this.props.updateStyle(this.props.selectedStyle);
    }
  }

  addItem = () => {
    const itemId = `item-depth-${this.props.depth + 1}-num-${this.props.getCounter()}`;
    this.props.addChild(
      <Box
        key={itemId}
        id={itemId}
        depth={this.props.depth + 1}
        parentId={this.props.id}
        markToDelete={this.props.deleteChild(itemId)}
        registerHoveredState={this.props.childHoverStateRegistration}
        />
    );
  };

  renderChildren() {
    const { id, getCounter, children } = this.props;
    if (id === 'root' && children.length === 0) {
      return <div className="intro-text">Hover Over Me To See Options!</div>;
    } else {
      return children.map((child, i) => React.cloneElement(child, {
        number: i,
        getCounter: getCounter,
      }));
    }
  }

  render() {
    const { style, onClick, removeChild, isHoveredChild, id } = this.props;

    return (
      <div
        onClick={onClick}
        style={style}
        className="layout-item"
        >
        {isHoveredChild ? (
          <HoverButtons
            addChild={this.addItem}
            removeChild={id !== 'root' ? removeChild : undefined}
            />
        ) : null}
        {this.renderChildren()}
      </div>
    );
  }
}

export default Box;
