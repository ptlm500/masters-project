import React from 'react';
import Immutable from 'immutable';
import {
  STROKE_WIDTH,
  LEG_LENGTH,
  NODE_RADIUS,
  NODE_OFFSET,
} from '../../components/componentConstants';

export function generateComponentBlockOutput(uuid, x, y) {
  return Immutable.fromJS({
    type: 'ComponentBlockOutput',
    x,
    y,
    f: nodes => nodes.last().get('state'),
    nodes: {
      [`${uuid}_0`]: {
        x: NODE_OFFSET,
        y: 11,
        input: false,
        connections: Immutable.Set([]),
        state: 0,
      },
      [`${uuid}_1`]: {
        x: NODE_OFFSET,
        y: 11,
        input: true,
        connections: Immutable.Set([]),
        state: 0,
      },
    },
  });
}

export class ComponentBlockOutputIcon extends React.Component {
  render() {
    return (
      <g>
        <line
          x1={NODE_OFFSET}
          y1={STROKE_WIDTH + 9}
          x2={20 + LEG_LENGTH}
          y2={STROKE_WIDTH + 9}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
        <polygon
          points={`
            ${NODE_RADIUS * 2 + LEG_LENGTH},0
            ${NODE_RADIUS * 2 + LEG_LENGTH},21,
            ${NODE_RADIUS * 2 + LEG_LENGTH + 21},11
            ${NODE_RADIUS * 2 + LEG_LENGTH + 21},10
          `}
          fill="black"
        />
      </g>
    );
  }
}