import React from 'react';
import PropTypes from 'prop-types';
import {
  STROKE_WIDTH,
  NODE_RADIUS,
  LEG_LENGTH,
} from '../../componentConstants';

class XORGate extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(React.Component).isRequired,
  };

  render() {
    return (
      <g>
        <path
          d={`M ${LEG_LENGTH - 4},2
            c 10,0 10,${this.props.height - 2} 0,${this.props.height - 2}
            M ${LEG_LENGTH - 4},2
            c 32,0 32,${this.props.height - 2} 0,${this.props.height - 2}`}
          fill="white"
          stroke={this.props.colour}
          strokeWidth={2}
        />
        <path
          d={`M ${LEG_LENGTH - 8},2
            c 10,0 10,${this.props.height - 2} 0,${this.props.height - 2}`}
          fill="white"
          stroke={this.props.colour}
          strokeWidth={2}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="6"
          x2={LEG_LENGTH + 1}
          y2="6"
          stroke={this.props.colour}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="25"
          x2={LEG_LENGTH + 1}
          y2="25"
          stroke={this.props.colour}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1="40"
          y1={this.props.height / 2 + STROKE_WIDTH / 2}
          x2={40 + LEG_LENGTH - NODE_RADIUS * 2}
          y2={this.props.height / 2 + STROKE_WIDTH / 2}
          stroke={this.props.colour}
          strokeWidth={STROKE_WIDTH}
        />
        {this.props.nodes}
      </g>
    );
  }
}

export default XORGate;
