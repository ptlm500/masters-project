// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const SET_DRAGGING_COMPONENT = 'SET_DRAGGING_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const DELETE_COMPONENT = 'DELETE_COMPONENT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const START_NODE_CONNECTION = 'START_NODE_CONNECTION';
export const CANCEL_NODE_CONNECTION = 'CANCEL_NODE_CONNECTION';
export const CONNECT_NODES = 'CONNECT_NODES';
export const UPDATE_WIRE = 'UPDATE_WIRE';
export const DELETE_WIRE = 'DELETE_WIRE';
export const TOGGLE_STATE = 'TOGGLE_STATE';
export const UPDATE_CONNECTIONS = 'UPDATE_CONNECTIONS';
export const UPDATE_BLOCK = 'UPDATE_BLOCK';
export const UPDATE_COMPONENT_OUTPUT = 'UPDATE_COMPONENT_OUTPUT';
export const UPDATE_SELECTION_BOX = 'UPDATE_SELECTION_BOX';

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

export function setDraggingComponent(component) {
  return {
    type: SET_DRAGGING_COMPONENT,
    component,
  };
}

export function selectComponent(uuid, clearPrevious) {
  return {
    type: SELECT_COMPONENT,
    uuid,
    clearPrevious,
  };
}

export function addComponent(uuid, component) {
  return {
    type: ADD_COMPONENT,
    uuid,
    component,
  };
}

export function deleteComponent(uuid) {
  return {
    type: DELETE_COMPONENT,
    uuid,
  };
}

export function startNodeConnection(nodeId, node) {
  return {
    type: START_NODE_CONNECTION,
    nodeId,
    node,
  };
}

export function cancelNodeConnection() {
  return {
    type: CANCEL_NODE_CONNECTION,
  };
}

export function connectNodes(nodes) {
  return {
    type: CONNECT_NODES,
    nodes,
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

export function toggleState(uuid) {
  return {
    type: TOGGLE_STATE,
    uuid,
  };
}

export function updateConnections(uuid, startType, wireState, parents) {
  return {
    type: UPDATE_CONNECTIONS,
    uuid,
    startType,
    wireState,
    parents,
  };
}

export function updateBlock(uuid) {
  return {
    type: UPDATE_BLOCK,
    uuid,
  };
}

export function updateComponentOutput(uuid, outputState) {
  return {
    type: UPDATE_COMPONENT_OUTPUT,
    uuid,
    outputState,
  };
}

export function updateSelectionBox(coords) {
  return {
    type: UPDATE_SELECTION_BOX,
    coords,
  };
}
