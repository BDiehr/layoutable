import connectToStores from 'alt/utils/connectToStores';
import LayoutStore from '../../../core/stores/LayoutStore';
import DetailPaneStore from '../../../core/stores/DetailPaneStore';
import LayoutActions from '../../../core/actions/LayoutActions';
import DetailPane from '../../../core/components/detailPane';
import React, { Component, PropTypes } from 'react';
import Box from '../layoutComponents/box';
import Container from './container';
import CodeViewer from './codeViewer';
import DragMenu from './dragMenu';
import './layoutEditor.scss';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
@DragDropContext(HTML5Backend)
@connectToStores
class LayoutEditor extends Component {
  static propTypes = {
    selectedId: PropTypes.string.isRequired,
    styleMap: PropTypes.any.isRequired,
    HTMLTree: PropTypes.any,
    detailPane: PropTypes.any,
    selectedStyle: PropTypes.any,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { counter: 0 };
  }

  componentWillUnmount() {
    LayoutActions.clear();
  }

  static getStores() {
    return [LayoutStore, DetailPaneStore];
  }

  static getPropsFromStores() {
    return Object.assign({},
      LayoutStore.getState(),
      DetailPaneStore.getState());
  }

  getCounter = () => {
    const counter = this.state.counter;
    this.setState({ counter: counter + 1 });
    return counter;
  };

  render() {
    const { selectedId, styleMap, HTMLTree, detailPane, selectedStyle } = this.props;
    return (
      <div>
        <div className="title-container">
          <h1 className="title"><strong>Layoutable</strong></h1>
        </div>
        <Container>
          <DragMenu />
          <Box className="drag-menu__box" getCounter={this.getCounter} number={1} id="root" depth={0}/>
        </Container>
        <DetailPane
          selectedId={selectedId}
          selectedStyle={selectedStyle}
          >
          {detailPane}
        </DetailPane>
        <CodeViewer
          HTMLTree={HTMLTree}
          styleMap={styleMap}
          />
      </div>
    );
  }
}

export default LayoutEditor;
