import connectToStores from 'alt/utils/connectToStores';
import LayoutStore from '../../stores/LayoutStore';
import DetailPaneStore from '../../stores/DetailPaneStore';
import LayoutActions from '../../actions/LayoutActions';
import React, { Component, PropTypes } from 'react';
import Box from './layoutComponents/box';
import Container from './container';
import DetailPane from './core/detailPane';
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
        <div className="body">
          <h1 className="text-center"><strong>Layoutable</strong></h1>
          <hr />
          <div className="directions">
            <h4>Directions</h4>
            <ol>
              <li>Hover over a box to see the controls to add child elements, select or remove (if it's not the root element).</li>
              <li>A selected <span className="green-example">green</span> box can be modified by the control panel below.</li>
            </ol>
          </div>
          <Container>
            <DragMenu />
            <Box getCounter={this.getCounter} number={1} id="root" depth={0}/>
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
      </div>
    );
  }
}

export default LayoutEditor;
