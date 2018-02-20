// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const SET_DRAGGING_COMPONENT = 'SET_DRAGGING_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const START_NODE_CONNECTION = 'START_NODE_CONNECTION';
export const CONNECT_NODES = 'CONNECT_NODES';
export const UPDATE_WIRE = 'UPDATE_WIRE';
export const DELETE_WIRE = 'DELETE_WIRE';
export const TOGGLE_STATE = 'TOGGLE_STATE';
export const UPDATE_CONNECTIONS = 'UPDATE_CONNECTIONS';
export const UPDATE_COMPONENT_OUTPUT = 'UPDATE_COMPONENT_OUTPUT';

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

export function updateConnections(uuid, startType, wireState) {
  return {
    type: UPDATE_CONNECTIONS,
    uuid,
    startType,
    wireState,
  };
}

export function updateComponentOutput(uuid, outputState) {
  return {
    type: UPDATE_COMPONENT_OUTPUT,
    uuid,
    outputState,
  };
}
