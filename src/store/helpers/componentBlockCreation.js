import Immutable from 'immutable';
import {
  NODE_OFFSET,
  LEG_LENGTH,
  STROKE_WIDTH,
} from '../../components/componentConstants';
import { createUuid } from '../../helpers';
import { getComponentLocation } from './utils';
import { deleteWire } from './wires';

export function getComponentBlockNode(node, nodeCounters) {
  const input = node.get('input');
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

  return nodeCounters;
}

export function addBlockNode(state, action) {
  let newState = state;
  const path = action.parents.slice();
  const blockUuid = path.pop();
  const componentLocation = getComponentLocation(path);
  const nodeTotals = getNodeTotals(
    newState.getIn(componentLocation.concat([blockUuid, 'nodes'])),
  );
  const blockNodeUuid = `${blockUuid}_${nodeTotals.input + nodeTotals.output}`;

  newState = newState.setIn(
    componentLocation.concat([blockUuid, 'nodes', blockNodeUuid]),
    getComponentBlockNode(action.component.get('nodes').first(), nodeTotals),
  );

  newState = newState.updateIn(
    getComponentLocation(action.parents).concat([
      action.uuid,
      'nodes',
      `${action.uuid}_0`,
      'connections',
    ]),
    connections => connections.add(blockNodeUuid),
  );

  return newState;
}

export function deleteBlockNode(state, action) {
  // Delete node from component block
  // Delete wires connected to component block node
  let newState = state;
  const path = action.parents.slice();
  const blockUuid = path.pop();
  const componentLocation = getComponentLocation(path);
  const blockNodeUuid = newState
    .getIn(
      getComponentLocation(action.parents).concat([
        action.uuid,
        'nodes',
        `${action.uuid}_0`,
        'connections',
      ]),
    )
    .first();

  const blockNodeExternalConnections = newState.getIn(
    componentLocation.concat([
      blockUuid,
      'nodes',
      blockNodeUuid,
      'connections',
    ]),
  );

  if (blockNodeExternalConnections) {
    blockNodeExternalConnections.forEach(connection => {
      newState = deleteWire(newState, {
        parents: path,
        wireId: connection,
      });
    });
  }

  newState
    .getIn(
      getComponentLocation(action.parents).concat([
        action.uuid,
        'nodes',
        `${action.uuid}_1`,
        'connections',
      ]),
    )
    .forEach(connection => {
      newState = deleteWire(newState, {
        parents: action.parents,
        wireId: connection,
      });
    });

  newState = newState.deleteIn(
    componentLocation.concat([blockUuid, 'nodes', blockNodeUuid]),
  );

  return newState;
}
