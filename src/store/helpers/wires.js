import { getWireLocation, getComponentLocation, getWirePoints } from './utils';
import { getComponentIdFromNodeId } from '../../helpers';

export function updateWire(state, action) {
  const wireLocation = getWireLocation(action.parents);
  const wire = state.getIn(wireLocation.concat([action.wireId]));
  if (wire) {
    return state.setIn(
      wireLocation.concat([action.wireId, 'points']),
      getWirePoints(
        state,
        wire.get('inputNode'),
        wire.get('outputNode'),
        action.parents,
      ),
    );
  }
  return state;
}

export function deleteWire(state, action) {
  const wireLocation = getWireLocation(action.parents);
  const componentLocation = getComponentLocation(action.parents);
  let newState = state;

  // TODO: IN COMPONENT BLOCKS, COMPONENTS CONNECTED TO BLOCK I/O HAVE NO WIRE, SO THIS WILL FAIL
  const wire = newState.getIn(wireLocation.concat([action.wireId]));

  const wireNodes = [wire.get('inputNode'), wire.get('outputNode')];
  // Iterate through wire connections
  wireNodes.forEach(nodeId => {
    // Delete connection record for nodes
    newState = newState.updateIn(
      componentLocation.concat([
        getComponentIdFromNodeId(nodeId),
        'nodes',
        nodeId,
        'connections',
      ]),
      connections => connections.delete(action.wireId),
    );
  });

  // Reset output node state to 0
  newState = newState.setIn(
    componentLocation.concat([
      getComponentIdFromNodeId(wire.get('outputNode')),
      'nodes',
      wire.get('outputNode'),
      'state',
    ]),
    0,
  );

  // Delete wire from store
  newState = newState.deleteIn(wireLocation.concat([action.wireId]));
  // Remove wire ID from selectedWires
  newState = newState.update('selectedWires', selectedWires =>
    selectedWires.delete(action.wireId),
  );
  return newState;
}
