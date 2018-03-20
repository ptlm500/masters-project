import Immutable from 'immutable';
import {
  NODE_OFFSET,
  LEG_LENGTH,
  STROKE_WIDTH,
} from '../../components/componentConstants';
import { createUuid } from '../../helpers';

export function getComponentBlockNode(node, nodeUuid, nodeCounters) {
  return Immutable.Map({
    x: node.get('input')
      ? NODE_OFFSET
      : 40 + (LEG_LENGTH + STROKE_WIDTH) * 2 - NODE_OFFSET,
    y: node.get('input')
      ? 6 + nodeCounters.input * 20
      : 6 + nodeCounters.output * 2,
    input: node.get('input'),
    connections: node.get('connections'),
    state: node.get('state'),
  });
}

export function updateComponentNode(
  newBlock,
  componentUuid,
  nodeUuid,
  action,
  nodeCounters,
) {
  const nodeTotal = nodeCounters.input + nodeCounters.output;
  let modifiedBlock = newBlock;
  if (
    !newBlock.getIn(['components', componentUuid, 'nodes', nodeUuid, 'input'])
  ) {
    // Add wire
    modifiedBlock = modifiedBlock.setIn(
      ['wires', createUuid()],
      Immutable.Map({
        inputNode: nodeUuid,
        outputNode: `${action.uuid}_${nodeTotal}`,
        points: Immutable.fromJS([{x: 0, y: 0}]),
      }),
    );
  }
  // Remap component connections with new wire
  modifiedBlock = modifiedBlock.setIn(
    ['components', componentUuid, 'nodes', nodeUuid, 'connections'],
    Immutable.Set([
      `${action.uuid}_${nodeCounters.input + nodeCounters.output}`,
    ]),
  );

  return modifiedBlock;
}