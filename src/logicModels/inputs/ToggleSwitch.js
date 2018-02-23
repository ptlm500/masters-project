import React from 'react';
import Immutable from 'immutable';
import {
  STROKE_WIDTH,
  NODE_OFFSET,
  NODE_RADIUS,
  LEG_LENGTH,
} from '../../components/componentConstants';

export function generateToggleSwitch(uuid, x, y) {
  return Immutable.fromJS({
    type: 'ToggleSwitch',
    x,
    y,
    state: 0,
    nodes: {
      [`${uuid}_1`]: {
        x: 51 + LEG_LENGTH - NODE_OFFSET,
        y: 16,
        input: false,
        connections: Immutable.Set(),
        state: 0,
      },
    },
  });
}

export class ToggleSwitchIcon extends React.Component {
  render() {
    const HEIGHT = 30;
    const WIDTH = 50;

    return (
      <g>
        <rect
          x={STROKE_WIDTH / 2}
          y={STROKE_WIDTH / 2}
          width={WIDTH}
          height={HEIGHT}
          strokeWidth={STROKE_WIDTH}
          stroke="black"
          fill="white"
        />
        <rect
          x={STROKE_WIDTH}
          y={STROKE_WIDTH}
          height={HEIGHT - STROKE_WIDTH}
          width={WIDTH / 2}
          fill="grey"
        />
        <line
          x1={WIDTH + STROKE_WIDTH}
          y1={HEIGHT / 2 + STROKE_WIDTH / 2}
          x2={WIDTH + LEG_LENGTH - NODE_RADIUS * 2}
          y2={HEIGHT / 2 + STROKE_WIDTH / 2}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
      </g>
    );
  }
}
