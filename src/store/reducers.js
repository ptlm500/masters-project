import Immutable from 'immutable';
import { combineReducers } from 'redux';
import { MOVE_COMPONENT, ADD_COMPONENT } from './actions';

// Define initial store state
const initialState = Immutable.Map({
  components: Immutable.Map({
    a: Immutable.Map({
      x: 5,
      y: 5
    })
  })
});

// Component action reducers
function components(state = initialState, action) {
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT:
      return state.update(action.uuid, component => action.component)
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
