import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {
  MOVE_COMPONENT,
  ADD_COMPONENT,
  START_COMPONENT_MOVE,
  END_COMPONENT_MOVE,
  START_NODE_CONNECTION,
  CONNECT_NODES,
  UPDATE_WIRE,
  SELECT_COMPONENT,
  DELETE_WIRE,
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

function getNodeInfo(state, nodeId) {
  const component = state.getIn(['components', getComponentIdFromNodeId(nodeId)]);
  const node = {
    x: component.get('x') + component.getIn(['nodes', nodeId, 'x']),
    y: component.get('y') + component.getIn(['nodes', nodeId, 'y']),
    input: component.getIn(['nodes', nodeId, 'input']),
  };

  return node;
}

function getWirePoints(state, startNodeId, endNodeId) {
  const startNode = getNodeInfo(state, startNodeId);
  const endNode = getNodeInfo(state, endNodeId);

  const points = [];

  if (!startNode.input) {
    points.push({ x: startNode.x + 4, y: startNode.y });
    if (startNode.y !== endNode.y) {
      if (startNode.x < endNode.x) {
        points.push({
          x: startNode.x + (endNode.x - startNode.x) / 2,
          y: startNode.y,
        });
        points.push({
          x: startNode.x + (endNode.x - startNode.x) / 2,
          y: endNode.y,
        });
      } else if (startNode.x > endNode.x) {
        points.push({ x: startNode.x + 10, y: startNode.y });
        points.push({
          x: startNode.x + 10,
          y: startNode.y + (endNode.y - startNode.y) / 2,
        });
        points.push({
          x: endNode.x - 10,
          y: startNode.y + (endNode.y - startNode.y) / 2,
        });
        points.push({ x: endNode.x - 10, y: endNode.y });
      }
    }
    points.push({ x: endNode.x - 4, y: endNode.y });
  } else if (startNode.input) {
    points.push({ x: startNode.x - 4, y: startNode.y });
    if (startNode.y !== endNode.y) {
      if (startNode.x < endNode.x) {
        points.push({ x: startNode.x - 10, y: startNode.y });
        points.push({
          x: startNode.x - 10,
          y: startNode.y + (endNode.y - startNode.y) / 2,
        });
        points.push({
          x: endNode.x - 10,
          y: startNode.y + (endNode.y - startNode.y) / 2,
        });
        points.push({ x: endNode.x - 10, y: endNode.y });
        points.push({
          x: startNode.x - 10,
          y: startNode.y + (startNode.y - endNode.y) / 2,
        });
        points.push({
          x: endNode.x + 10,
          y: startNode.y + (startNode.y - endNode.y) / 2,
        });
        points.push({ x: endNode.x + 10, y: endNode.y });
      } else if (startNode.x > endNode.x) {
        points.push({
          x: startNode.x - (startNode.x - endNode.x) / 2,
          y: startNode.y,
        });
        points.push({
          x: startNode.x - (startNode.x - endNode.x) / 2,
          y: endNode.y,
        });
      }
    }
    points.push({ x: endNode.x + 4, y: endNode.y });
  }

  return Immutable.fromJS(points);
}

import { NODE_OFFSET, LEG_LENGTH, STROKE_WIDTH } from '../components/componentConstants';

// Define initial store state
const initialState = Immutable.fromJS({
  movingComponent: false,
  activeNode: {
    id: '',
    input: true
  },
  activeWire: '',
  selectedComponent: {
    id: '',
    type: '',
  },
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
    case SELECT_COMPONENT: {
      return state.set('selectedComponent', Immutable.Map({
        uuid: action.uuid,
        type: action.componentType,
      }));
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
        newState.get('activeWire'),
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
        newState.get('activeWire'),
      );
      // Update wire node info
      newState = newState.updateIn(
        ['wires', newState.get('activeWire'), 'nodes'],
        nodes => nodes.push(action.endNodeId),
      );
      // Set wire point info
      newState = newState.setIn(
        ['wires', newState.get('activeWire'), 'points'],
        getWirePoints(newState, action.startNodeId, action.endNodeId),
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
    case UPDATE_WIRE: {
      const wire = state.getIn(['wires', action.wireId]);
      return state.setIn(
        ['wires', action.wireId, 'points'],
        getWirePoints(state, wire.getIn(['nodes', 0]), wire.getIn(['nodes', 1])),
      );
    }
    case DELETE_WIRE: {
      let newState = state;
      const wireNodes = newState.getIn(['wires', action.wireId, 'nodes']);
      // Delete connection record for nodes
      wireNodes.forEach(nodeId => {
        newState = newState.setIn(
          [
            'components',
            getComponentIdFromNodeId(nodeId),
            'nodes',
            nodeId,
            'connection',
          ],
          '',
        );

        newState = newState.deleteIn(['wires', action.wireId]);
      });

      return newState;
    }
    default:
      console.log(`created store with state ${state} for ${action.type}`);
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
