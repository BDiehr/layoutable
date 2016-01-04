import React, { Component} from 'react';
import Draggable from './../layoutComponents/draggable';
import TitleTextComponent from './../layoutComponents/titleText';
import './dragMenu.scss';

class Home extends Component {
  render() {
    return (
      <div className="drag-menu">
        <h2 className="text-center">Drag Menu</h2>
        <sub className="text-center">(drag a component to the editor)</sub>
        <hr />
        <Draggable />
        <TitleTextComponent />
      </div>
    );
  }
}

export default Home;
