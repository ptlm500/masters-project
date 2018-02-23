import React from 'react';
import Immutable from 'immutable';
import { NODE_OFFSET, STROKE_WIDTH, LEG_LENGTH } from '../../components/componentConstants';

export function generateLED(uuid, x, y) {
  return Immutable.fromJS({
    type: 'LED',
    x,
    y,
    nodes: {
      [`${uuid}_1`]: {
        x: NODE_OFFSET,
        y: STROKE_WIDTH + 10,
        input: true,
        connections: Immutable.Set(),
        state: 0,
      },
    },
  });
}

export class LEDIcon extends React.Component {
  render() {
    return (
      <g>
        <circle
          cx={STROKE_WIDTH + LEG_LENGTH + 10}
          cy={STROKE_WIDTH + 10}
          r={10}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
          fill="grey"
        />
        <line
          x1={STROKE_WIDTH}
          y1={STROKE_WIDTH + 10}
          x2={STROKE_WIDTH + LEG_LENGTH}
          y2={STROKE_WIDTH + 10}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
      </g>
    );
  }
}
