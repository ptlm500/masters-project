// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const START_COMPONENT_MOVE = 'START_COMPONENT_MOVE';
export const END_COMPONENT_MOVE = 'END_COMPONENT_MOVE';
export const START_NODE_CONNECTION = 'START_NODE_CONNECTION';
export const CONNECT_NODES = 'CONNECT_NODES';

// Action creators
export function moveComponent(uuid, component) {
  return {
    type: MOVE_COMPONENT,
    uuid,
    component,
  };
}

export function startComponentMove(uuid) {
  return {
    type: START_COMPONENT_MOVE,
    uuid,
  };
}

export function endComponentMove(uuid) {
  return {
    type: END_COMPONENT_MOVE,
    uuid,
  };
}

export function addComponent(uuid, component) {
  return {
    type: ADD_COMPONENT,
    uuid,
    component,
  };
}

export function startNodeConnection(nodeId, input) {
  return {
    type: START_NODE_CONNECTION,
    nodeId,
    input,
  };
}

export function connectNodes(startNodeId, endNodeId) {
  return {
    type: CONNECT_NODES,
    startNodeId,
    endNodeId,
  };
}
