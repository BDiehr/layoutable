import React, { Component, PropTypes } from 'react';
import './hoverButtons.scss';

export default class HoverButtons extends Component {
  static propTypes = {
    addChild: PropTypes.func.isRequired,
    removeChild: PropTypes.func.isRequired,
  };

  render() {
    const { addChild, removeChild } = this.props;
    return (
      <div className="hover-buttons-container">
        <div className="hover-buttons">
          {addChild ? <button className="hover-button" onClick={addChild}>Add</button> : null}
          {removeChild ? <button className="hover-button" onClick={removeChild}>Remove</button> : null}
        </div>
      </div>
    );
  }
}
