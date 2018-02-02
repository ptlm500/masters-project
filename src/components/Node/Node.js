import React from 'react'
import PropTypes from 'prop-types';
import { NODE_RADIUS, STROKE_WIDTH } from '../componentConstants';

class Node extends React.Component {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    input: PropTypes.bool.isRequired,
  }

  mouseDown(e) {
    console.log('Pressed node');
    e.stopPropagation();
  }

  render() {
    return (
      <circle
        cx={this.props.x}
        cy={this.props.y}
        onMouseDown={e => this.mouseDown(e)}
        r={NODE_RADIUS}
        fill="white"
        stroke="black"
        strokeWidth={STROKE_WIDTH}
      />
    );
  }
}

export default Node;
