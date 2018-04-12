// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const SET_DRAGGING_COMPONENT = 'SET_DRAGGING_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const CREATE_COMPONENT_BLOCK = 'CREATE_COMPONENT_BLOCK';
export const CREATE_COMPONENT_BLOCK_FROM_SELECTED =
  'CREATE_COMPONENT_BLOCK_FROM_SELECTED';
export const DELETE_COMPONENT = 'DELETE_COMPONENT';
export const UPDATE_COMPONENT_NAME = 'UPDATE_COMPONENT_NAME';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const SELECT_WIRE = 'SELECT_WIRE';
export const START_NODE_CONNECTION = 'START_NODE_CONNECTION';
export const CANCEL_NODE_CONNECTION = 'CANCEL_NODE_CONNECTION';
export const CONNECT_NODES = 'CONNECT_NODES';
export const UPDATE_WIRE = 'UPDATE_WIRE';
export const DELETE_WIRE = 'DELETE_WIRE';
export const TOGGLE_STATE = 'TOGGLE_STATE';
export const UPDATE_CONNECTIONS = 'UPDATE_CONNECTIONS';
export const UPDATE_BLOCK = 'UPDATE_BLOCK';
export const UPDATE_BLOCK_OUTPUT = 'UPDATE_BLOCK_OUTPUT';
export const DELETE_BLOCK_NODE = 'DELETE_BLOCK_NODE';
export const UPDATE_SELECTION_BOX = 'UPDATE_SELECTION_BOX';
export const SET_VIEW_CONTEXT = 'SET_VIEW_CONTEXT';
export const SAVE_STATE = 'SAVE_STATE';
export const LOAD_STATE = 'LOAD_STATE';

// Action creators
export function moveComponent(uuid, component, moveType, vertexId, parents) {
  return {
    type: MOVE_COMPONENT,
    uuid,
    component,
    moveType,
    vertexId,
    parents,
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

export function selectWire(uuid, clearPrevious) {
  return {
    type: SELECT_WIRE,
    uuid,
    clearPrevious,
  };
}

export function addComponent(uuid, component, parents) {
  return {
    type: ADD_COMPONENT,
    uuid,
    component,
    parents,
  };
}

export function createComponentBlock(uuid, parents) {
  return {
    type: CREATE_COMPONENT_BLOCK,
    uuid,
    parents,
  };
}

export function createComponentBlockFromSelected(uuid, parents) {
  return {
    type: CREATE_COMPONENT_BLOCK_FROM_SELECTED,
    uuid,
    parents,
  };
}

export function deleteComponent(uuid, parents) {
  return {
    type: DELETE_COMPONENT,
    uuid,
    parents,
  };
}

export function updateComponentName(uuid, parents, name) {
  return {
    type: UPDATE_COMPONENT_NAME,
    uuid,
    parents,
    name,
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

export function connectNodes(nodes, parents) {
  return {
    type: CONNECT_NODES,
    nodes,
    parents,
  };
}

export function updateWire(wireId, parents) {
  return {
    type: UPDATE_WIRE,
    wireId,
    parents,
  };
}

export function deleteWire(wireId, parents) {
  return {
    type: DELETE_WIRE,
    wireId,
    parents,
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

export function updateBlockOutput(uuid, parents) {
  return {
    type: UPDATE_BLOCK_OUTPUT,
    uuid,
    parents,
  };
}

export function deleteBlockNode(uuid, parents) {
  return {
    type: DELETE_BLOCK_NODE,
    uuid,
    parents,
  };
}

export function updateSelectionBox(coords) {
  return {
    type: UPDATE_SELECTION_BOX,
    coords,
  };
}

export function setViewContext(path, name) {
  return {
    type: SET_VIEW_CONTEXT,
    path,
    name,
  };
}

export function saveState() {
  return {
    type: SAVE_STATE,
  };
}

export function loadState(state) {
  return {
    type: LOAD_STATE,
    state,
  };
}
