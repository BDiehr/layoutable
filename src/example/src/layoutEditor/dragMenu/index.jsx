import React, { Component} from 'react';
import './dragMenu.scss';
/** Layout Items */
import Box from '../../layoutComponents/box';

class Home extends Component {
  render() {
    return (
      <div className="drag-menu">
        <h2 className="text-center">Drag Menu</h2>
        <sub className="text-center">(drag a component to the editor)</sub>
        <hr />
        <Box inDragMenu />
      </div>
    );
  }
}

export default Home;
