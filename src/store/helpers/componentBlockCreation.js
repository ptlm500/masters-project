import Immutable from 'immutable';
import {
  NODE_OFFSET,
  LEG_LENGTH,
  STROKE_WIDTH,
} from '../../components/componentConstants';
import { createUuid } from '../../helpers';
import { getComponentLocation } from './utils';

export function getComponentBlockNode(node, nodeCounters, invert) {
  console.log(nodeCounters, 6 + nodeCounters.input * 20);
  const input = invert ? !node.get('input') : node.get('input');
  return Immutable.Map({
    x: input ? NODE_OFFSET : 40 + (LEG_LENGTH + STROKE_WIDTH) * 2 - NODE_OFFSET,
    y: input ? 6 + nodeCounters.input * 20 : 6 + nodeCounters.output * 20,
    input,
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

export function getNodeTotals(nodes) {
  const nodeCounters = {
    input: 0,
    output: 0,
  };

  if (nodes) {
    nodes.forEach(node => {
      node.get('input')
        ? (nodeCounters.input += 1)
        : (nodeCounters.output += 1);
    });
  }

  console.log(nodeCounters);

  return nodeCounters;
}

export function addBlockNode(state, action) {
  let newState = state;
  const path = action.parents;
  const blockUuid = path.pop();
  const componentLocation = getComponentLocation(path);
  const nodeTotals = getNodeTotals(
    newState.getIn(componentLocation.concat([blockUuid, 'nodes'])),
  );

  newState = newState.setIn(
    componentLocation.concat([
      blockUuid,
      'nodes',
      `${blockUuid}_${nodeTotals.input + nodeTotals.output}`,
    ]),
    getComponentBlockNode(
      action.component.get('nodes').first(),
      nodeTotals,
      true,
    ),
  );

  if (action.component.get('input')) {
    let inputNodes = newState.getIn(
      componentLocation.concat([blockUuid, 'inputNodes']),
    );
    inputNodes = inputNodes ? 1 : (inputNodes += 1);

    newState = newState.setIn(
      componentLocation.concat([blockUuid, 'inputNodes'], inputNodes),
    );
  }

  return newState;
}
