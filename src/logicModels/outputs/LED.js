import Immutable from 'immutable';
import { NODE_OFFSET, STROKE_WIDTH } from '../../components/componentConstants';

export default function generateLED(uuid, x, y) {
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
