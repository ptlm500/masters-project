import Immutable from 'immutable';
import { NODE_OFFSET, LEG_LENGTH } from '../../components/componentConstants';

export default function generateToggleSwitch(uuid, x, y) {
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
