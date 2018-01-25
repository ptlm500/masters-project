import Immutable from 'immutable';
import { MOVE_COMPONENT, ADD_COMPONENT } from './actions';

// Define initial store state
const initialState = Immutable.Map({
  components: {}
})

// Component action reducers
function components(state = initialState, action) {
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT:
      return state.updateIn(['components', action.uuid],
        action.component)
    case ADD_COMPONENT: {
      return state.update('components',
        map => map.set(action.uuid, action.component));
    }
    default:
      return state;
  }
}