import _ from 'lodash';
import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import InternalBox from './internalBox';
import './box.scss';
import layoutItem from './../../core/layoutItem';

@layoutItem()
class Box extends Component {
  static propTypes = {
    hover: PropTypes.bool.isRequired,
    isHoveredChild: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
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
    onMouseEnterHandler: PropTypes.func.isRequired,
    onMouseLeaveHandler: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    removeChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    childHoverStateRegistration: PropTypes.func.isRequired,
    updateStyle: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
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

  render() {
    const {
      onMouseEnterHandler,
      onMouseLeaveHandler,
      isHoveredChild,
      id,
      removeChild,
      getCounter,
      children,
      onClick,
      style,
    } = this.props;

    const containerClasses = classNames('layout-item-container', {
      'layout-item-container--selected': this.props.isSelected,
    });

    return (
      <div
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        className={containerClasses}>
        <InternalBox
          isHoveredChild={isHoveredChild}
          addItem={this.addItem}
          removeChild={removeChild}
          onClick={onClick}
          id={id}
          style={style}
          getCounter={getCounter}
          >
          {children}
        </InternalBox>
      </div>
    );
  }
}

export default Box;
