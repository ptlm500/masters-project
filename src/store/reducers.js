import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {
  MOVE_COMPONENT,
  SET_DRAGGING_COMPONENT,
  ADD_COMPONENT,
  START_NODE_CONNECTION,
  CONNECT_NODES,
  UPDATE_WIRE,
  SELECT_COMPONENT,
  DELETE_WIRE,
  TOGGLE_STATE,
  UPDATE_CONNECTIONS,
  DELETE_COMPONENT,
} from './actions';
import { getComponentIdFromNodeId, createUuid, getOutputNodeId } from '../helpers';

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
        connections: Set,
        state: 0
      }
    }
  }
*/

/*
  Wire structure
  uuid: {
    inputNode: '',
    outputNode: '',
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
          x: endNode.x + 10,
          y: startNode.y + (endNode.y - startNode.y) / 2,
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
  draggingComponent: null,
  activeNode: {
    id: '',
    input: true,
  },
  activeWire: '',
  selectedComponent: {
    id: '',
    type: '',
  },
  components: {},
  wires: {},
});

// Component action reducers
function components(state = initialState, action) {
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT:
      if (action.moveType === 'component') {
        return state.setIn(['components', action.uuid], action.component);
      } else if (action.moveType === 'vertex') {
        return state.setIn(
          ['wires', action.uuid, 'points', action.vertexId],
          action.component,
        );
      }
      break;
    case SET_DRAGGING_COMPONENT: {
      return state.set('draggingComponent', action.component);
    }
    case ADD_COMPONENT: {
      let newState = state.setIn(['components', action.uuid], action.component);
      console.log('***', newState.toJS());
      return newState;
    }
    case SELECT_COMPONENT: {
      return state.set('selectedComponent', Immutable.Map({
        uuid: action.uuid,
        type: action.componentType,
      }));
    }
    case DELETE_COMPONENT: {
      return state.deleteIn(['components', action.uuid]);
    }
    case START_NODE_CONNECTION: {
      let newState = state;
      newState = newState.set('activeNode', Immutable.Map({
        id: action.nodeId,
        input: action.input
      }));

      newState = newState.set('activeWire', createUuid());

      console.log(newState.toJS());

      return newState;
    }
    case CONNECT_NODES: {
      let newState = state;
      // Update input node connection info
      newState = newState.updateIn(
        [
          'components',
          getComponentIdFromNodeId(action.nodes.inputNodeId),
          'nodes',
          action.nodes.inputNodeId,
          'connections',
        ],
        connections => connections.add(newState.get('activeWire')),
      );
      // Update output node connection info
      newState = newState.updateIn(
        [
          'components',
          getComponentIdFromNodeId(action.nodes.outputNodeId),
          'nodes',
          action.nodes.outputNodeId,
          'connections',
        ],
        connections => connections.add(newState.get('activeWire')),
      );
      // Set output node initial state
      newState = newState.setIn(
        [
          'components',
          getComponentIdFromNodeId(action.nodes.outputNodeId),
          'nodes',
          action.nodes.outputNodeId,
          'state',
        ],
        newState.getIn([
          'components',
          getComponentIdFromNodeId(action.nodes.inputNodeId),
          'nodes',
          action.nodes.inputNodeId,
          'state',
        ]),
      );
      // Set wire info
      newState = newState.setIn(
        ['wires', newState.get('activeWire')],
        Immutable.Map({
          inputNode: action.nodes.inputNodeId,
          outputNode: action.nodes.outputNodeId,
          points: getWirePoints(
            newState,
            action.nodes.inputNodeId,
            action.nodes.outputNodeId,
          ),
        }),
      );

      // Clear activeNode and activeWire
      newState = newState.set('activeNode',
        Immutable.Map({
          id: '',
          input: true,
        }),
      );
      newState = newState.set('activeWire', '');
      console.log(newState.toJS())
      return newState;
    }
    case UPDATE_WIRE: {
      const wire = state.getIn(['wires', action.wireId]);
      return state.setIn(
        ['wires', action.wireId, 'points'],
        getWirePoints(state, wire.get('inputNode'), wire.get('outputNode')),
      );
    }
    case DELETE_WIRE: {
      let newState = state;

      const wire = newState.getIn(['wires', action.wireId]);
      const wireNodes = [wire.get('inputNode'), wire.get('outputNode')];
      // Iterate through wire connections
      wireNodes.forEach(nodeId => {
        // Delete connection record for nodes
        newState = newState.updateIn(
          [
            'components',
            getComponentIdFromNodeId(nodeId),
            'nodes',
            nodeId,
            'connections',
          ],
          connections => connections.delete(action.wireId),
        );
      });

      // Reset output node state to 0
      newState = newState.setIn(
        [
          'components',
          getComponentIdFromNodeId(wire.get('outputNode')),
          'nodes',
          wire.get('outputNode'),
          'state',
        ],
        0,
      );

      newState = newState.deleteIn(['wires', action.wireId]);
      return newState;
    }
    case TOGGLE_STATE: {
      const newComponentState = state.getIn(['components', action.uuid, 'state']) === 0 ? 1 : 0;
      let newState = state;

      // Update component state
      newState = newState.setIn(
        ['components', action.uuid, 'state'],
        newComponentState,
      );

      // Update output node state
      newState = newState.updateIn(
        ['components', action.uuid, 'nodes'],
        nodes =>
          nodes.map(
            node =>
              !node.get('input') ? node.set('state', newComponentState) : node,
          ),
      );

      return newState;
    }
    case UPDATE_CONNECTIONS: {
      let newState = state;

      if (action.startType === 'component') {
        const f = newState.getIn(['components', action.uuid, 'f']);

        if (f) {
          // Evaluate component function, f and set output state
          newState = newState.setIn(
            [
              'components',
              action.uuid,
              'nodes',
              getOutputNodeId(newState.getIn(['components', action.uuid])),
              'state',
            ],
            f(newState.getIn(['components', action.uuid, 'nodes'])),
          );
        }
      } else if (action.startType === 'wire') {
        const wireOutputNode = newState.getIn(['wires', action.uuid, 'outputNode']);
        // Update wire output node
        newState = newState.setIn(
          [
            'components',
            getComponentIdFromNodeId(wireOutputNode),
            'nodes',
            wireOutputNode,
            'state',
          ],
          action.wireState,
        );

        // for (let i = 1; i < wire.get('nodes').size; i += 1) {
        //   const nodeId = wire.getIn(['nodes', i]);
        //   // Update connected node with wire state
        //   newState = newState.setIn(
        //     [
        //       'components',
        //       getComponentIdFromNodeId(nodeId),
        //       'nodes',
        //       nodeId,
        //       'state',
        //     ],
        //     action.wireState,
        //   );
        // }
      }

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
