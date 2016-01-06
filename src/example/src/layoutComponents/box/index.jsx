import _ from 'lodash';
import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import './box.scss';
import layoutItem from './../../../../core/components/layoutItem';
import DetailPaneActions from '../../../../core/actions/DetailPaneActions';
import BoxDetailPane from './boxDetailPane';

const addBox = ({addChild, deleteChild, getCounter, id, depth}) => {
  return () => {
    const itemId = `item-depth-${depth + 1}-num-${getCounter()}`;
    addChild(
      <Box
        key={itemId}
        id={itemId}
        depth={depth + 1}
        parentId={id}
        markToDelete={deleteChild(itemId)}
        />
    );
  };
};

@layoutItem('BOX', {
  addItem: addBox,
})
class Box extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    depth: PropTypes.number.isRequired,
    number: PropTypes.number,
    id: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    selectedId: PropTypes.string,
    selectedStyle: PropTypes.object,
    markToDelete: PropTypes.func,
    getCounter: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    removeChild: PropTypes.func.isRequired,
    updateStyle: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    createHoverMenu: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { createHoverMenu, removeChild } = this.props;
    createHoverMenu({
      removeChild,
    });
  }

  componentDidUpdate(prevProps) {
    /** Handle change in selected Style */
    if (this.props.isSelected && !_.isEqual(this.props.style, this.props.selectedStyle)) {
      this.props.updateStyle(this.props.selectedStyle);
    }
    /** Update Detail Pane */
    if (this.props.isSelected && !prevProps.isSelected) {
      DetailPaneActions.selectPane(<BoxDetailPane />);
    }
  }

  renderChildren() {
    const { id, getCounter, children } = this.props;
    if (id === 'root' && children.length === 0) {
      return <div className="intro-text">Hover Over Me To See Options!</div>;
    } else {
      return children.map((child, i) => React.cloneElement(child, {
        number: i,
        getCounter: getCounter,
        key: i,
      }));
    }
  }

  render() {
    const { style, onClick, connectDragSource, connectDropTarget, inDragMenu } = this.props;
    const classes = classNames('layout-item', {
      'layout-item--selected': this.props.isSelected,
      'layout-item--in-drag-menu': inDragMenu,
    });

    return connectDropTarget(connectDragSource(
      <div
        onClick={onClick}
        style={style}
        className={classes}
        >
        { inDragMenu ? <span className="layout-item__drag-menu-title">Box</span> : null }
        {this.renderChildren()}
      </div>
    ));
  }
}

export default Box;
