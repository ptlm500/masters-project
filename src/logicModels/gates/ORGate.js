import Immutable from 'immutable';
import { NODE_OFFSET, LEG_LENGTH, STROKE_WIDTH } from '../../components/componentConstants';

function generateNodes(uuid, inputNodeCount) {
  let nodes = Immutable.Map({});

  for (let i = 0; i < inputNodeCount; i += 1) {
    nodes = nodes.set(
      uuid.concat(`_${i}`),
      Immutable.Map({
        x: NODE_OFFSET,
        y: 6 + i * 19,
        input: true,
        connections: Immutable.Set(),
        state: 0,
      }),
    );
  }

  nodes = nodes.set(
    uuid.concat(`_${inputNodeCount}`),
    Immutable.Map({
      x: 50 + LEG_LENGTH - NODE_OFFSET,
      y: (inputNodeCount + 1) * 10 / 2 + STROKE_WIDTH / 2,
      input: false,
      connections: Immutable.Set(),
      state: 0,
    }),
  );

  return nodes;
}

export default function generateORGate(uuid, x, y, inputNodeCount) {
  return Immutable.Map({
    type: 'ORGate',
    x,
    y,
    f: nodes => {
      console.log(nodes.toJS())
      let outputState = 0;

      nodes.forEach(node => {
        if (node.get('input') && node.get('state') === 1) {
          outputState = 1;
          return false;
        }
        return true;
      });

      return outputState;
    },
    nodes: generateNodes(uuid, inputNodeCount),
  });
}
