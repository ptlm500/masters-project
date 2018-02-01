import Immutable from 'immutable';
import { combineReducers } from 'redux';
import { MOVE_COMPONENT, ADD_COMPONENT, START_COMPONENT_MOVE, END_COMPONENT_MOVE } from './actions';

// Define initial store state
const initialState = Immutable.fromJS({
  movingComponent: false,
  components: {
    a: {
      x: 5,
      y: 5
    },
    b: {
      x: 10,
      y: 10
    }
  }
});

// Component action reducers
function components(state = initialState, action) {
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT:
      return state.setIn(['components', action.uuid], action.component);
    case START_COMPONENT_MOVE:
    return state.set('movingComponent', true)
    case END_COMPONENT_MOVE:
      return state.set('movingComponent', false)
    case ADD_COMPONENT: {
      return state.set(action.uuid, action.component);
    }
    default:
      console.log(`created store with state ${state}`);
      return state;
  }
}

// function app(state = initialState, action) {
//   switch (action.type) {
//     case MOVE_COMPONENT:
//       return state.update('components',
//         components => components(state.get('components'), action))
//     case ADD_COMPONENT:
//       return state.update('components',
//         components => components(state.get('components'), action))
//     default:
//       return state;
//   }
// }

const appReducers = combineReducers({
  components
});

export default appReducers;
