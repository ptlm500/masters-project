// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const START_NODE_CONNECTION = 'START_NODE_CONNECTION';
export const CONNECT_NODES = 'CONNECT_NODES';
export const UPDATE_WIRE = 'UPDATE_WIRE';
export const DELETE_WIRE = 'DELETE_WIRE';

// Action creators
export function moveComponent(uuid, component, moveType, vertexId) {
  return {
    type: MOVE_COMPONENT,
    uuid,
    component,
    moveType,
    vertexId,
  };
}

export function selectComponent(uuid, componentType) {
  return {
    type: SELECT_COMPONENT,
    uuid,
    componentType,
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

export function updateWire(wireId) {
  return {
    type: UPDATE_WIRE,
    wireId,
  };
}

export function deleteWire(wireId) {
  return {
    type: DELETE_WIRE,
    wireId,
  };
}
