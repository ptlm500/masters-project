import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {
  MOVE_COMPONENT,
  ADD_COMPONENT,
  START_COMPONENT_MOVE,
  END_COMPONENT_MOVE,
  START_NODE_CONNECTION,
  CONNECT_NODES,
} from './actions';
import { getComponentIdFromNodeId, uuid } from '../helpers';

/*
  Component structure

  uuid: {
    x: "",
    y: "",
    component: < />,
    function: func,
    nodes: {
      nodeId: {
        input: bool,
        connection: "",
        state: 0
      }
    }
  }
*/

/*
  Wire structure
  uuid: {
    nodes: [],
    state: 0
  }

*/

import { NODE_OFFSET, LEG_LENGTH, STROKE_WIDTH } from '../components/componentConstants';

// Define initial store state
const initialState = Immutable.fromJS({
  movingComponent: false,
  activeNode: {
    id: '',
    input: true
  },
  activeWire: '',
  components: {
    a: {
      x: 5,
      y: 5,
      nodes: {
        a_1: {
          x: NODE_OFFSET,
          y: 6,
          input: true,
          connection: '',
          state: 0,
        },
        a_2: {
          x: NODE_OFFSET,
          y: 25,
          input: true,
          connection: '',
          state: 0,
        },
        a_3: {
          x: 40 + LEG_LENGTH - NODE_OFFSET,
          y: 30 / 2 + STROKE_WIDTH / 2, // 30 should be replaced by component height
          input: false,
          connection: '',
          state: 0,
        },
      },
    },
    b: {
      x: 10,
      y: 10,
      nodes: {
        b_1: {
          x: NODE_OFFSET,
          y: 6,
          input: true,
          connection: '',
          state: 0,
        },
        b_2: {
          x: NODE_OFFSET,
          y: 25,
          input: true,
          connection: '',
          state: 0,
        },
        b_3: {
          x: 40 + LEG_LENGTH - NODE_OFFSET,
          y: 30 / 2 + STROKE_WIDTH / 2, // 30 should be replaced by component height
          input: false,
          connection: '',
          state: 0,
        },
      },
    },
  },
  wires: {},
});

// Component action reducers
function components(state = initialState, action) {
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT:
      return state.setIn(['components', action.uuid], action.component);
    case START_COMPONENT_MOVE:
      return state.set('movingComponent', true);
    case END_COMPONENT_MOVE:
      return state.set('movingComponent', false)
    case ADD_COMPONENT: {
      return state.set(action.uuid, action.component);
    }
    case START_NODE_CONNECTION: {
      let newState = state;
      newState = newState.set('activeNode', Immutable.Map({
        id: action.nodeId,
        input: action.input
      }));

      const wireUuid = uuid();

      newState = newState.setIn(['wires', wireUuid], Immutable.fromJS({
        nodes: [action.nodeId]
      }));

      newState = newState.set('activeWire', wireUuid);

      console.log(newState.toJS());

      return newState;
    }
    case CONNECT_NODES: {
      let newState = state;
      // Update start node connection info
      newState = newState.setIn(
        [
          'components',
          getComponentIdFromNodeId(action.startNodeId),
          'nodes',
          action.startNodeId,
          'connection',
        ],
        action.endNodeId,
      );
      // Update end node connection info
      newState = newState.setIn(
        [
          'components',
          getComponentIdFromNodeId(action.endNodeId),
          'nodes',
          action.endNodeId,
          'connection',
        ],
        action.startNodeId,
      );
      // Update wire node info
      newState = newState.updateIn(
        ['wires', newState.get('activeWire'), 'nodes'],
        nodes => nodes.push(action.endNodeId),
      );
      // Clear activeNode and activeWire
      newState = newState.set('activeNode',
        Immutable.Map({
          id: '',
          input: true
        })
      );
      newState = newState.set('activeWire', '');
      console.log(newState.toJS())
      return newState;
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
