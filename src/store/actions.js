// Redux store action types

// Action types
export const MOVE_COMPONENT = 'MOVE_COMPONENT';
export const ADD_COMPONENT = 'ADD_COMPONENT';

// Action creators
export function moveComponent(uuid, component) {
  return {
    type: MOVE_COMPONENT,
    uuid,
    component
  };
}

export function addComponent(uuid, component) {
  return {
    type: ADD_COMPONENT,
    uuid,
    component
  }
}
