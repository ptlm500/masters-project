import React from 'react';
import PropTypes from 'prop-types';

import {
  STROKE_WIDTH,
  NODE_RADIUS,
  LEG_LENGTH,
} from '../../componentConstants';

class ANDGate extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(React.Component).isRequired,
  };

  render() {
    return (
      <g>
        <line
          x1={NODE_RADIUS * 2}
          y1="6"
          x2={LEG_LENGTH}
          y2="6"
          stroke={this.props.colour}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="25"
          x2={LEG_LENGTH}
          y2="25"
          stroke={this.props.colour}
          strokeWidth={STROKE_WIDTH}
        />
        <path
          d={`M ${LEG_LENGTH},2
            L ${LEG_LENGTH},${this.props.height}
            l 8,0
            c 16,0 16,-${this.props.height - 2} 0,-${this.props.height - 2},
            Z`}
          fill="white"
          stroke={this.props.colour}
          strokeWidth={2}
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

export default ANDGate;
