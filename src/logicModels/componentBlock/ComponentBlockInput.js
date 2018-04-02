import React from 'react';
import Immutable from 'immutable';
import {
  STROKE_WIDTH,
  LEG_LENGTH,
  NODE_RADIUS,
} from '../../components/componentConstants';

export function generateComponentBlockInput(uuid, x, y) {
  return Immutable.fromJS({
    type: 'ComponentBlockInput',
    x,
    y,
    nodes: {
      [`${uuid}_1`]: {
        x: 21 + LEG_LENGTH + NODE_RADIUS,
        y: 11,
        input: false,
        connections: Immutable.Set([]),
        state: 0,
      }
    }
  });
}

export class ComponentBlockInputIcon extends React.Component {
  render() {
    return (
      <g>
        <polygon points="0,0 0,21, 21,11 21,10" fill="black" />
        <line
          x1={20}
          y1={STROKE_WIDTH + 9}
          x2={20 + LEG_LENGTH}
          y2={STROKE_WIDTH + 9}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
      </g>
    );
  }
}