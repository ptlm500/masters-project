import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {
  MOVE_COMPONENT,
  SET_DRAGGING_COMPONENT,
  ADD_COMPONENT,
  START_NODE_CONNECTION,
  CANCEL_NODE_CONNECTION,
  CONNECT_NODES,
  UPDATE_WIRE,
  SELECT_COMPONENT,
  DELETE_WIRE,
  TOGGLE_STATE,
  UPDATE_CONNECTIONS,
  DELETE_COMPONENT,
  UPDATE_SELECTION_BOX,
  UPDATE_BLOCK,
  CREATE_COMPONENT_BLOCK,
  CREATE_COMPONENT_BLOCK_FROM_SELECTED,
  SELECT_WIRE,
  SET_VIEW_CONTEXT,
  ADD_BLOCK_NODE,
} from './actions';
import { getComponentIdFromNodeId, createUuid, getOutputNodeId, getParentsFromPath, } from '../helpers';
import {
  getComponentLocation,
  getWireLocation,
  getNodeInfo,
  getWirePoints,
} from './helpers/utils';
import {
  getComponentBlockNode,
  updateComponentNode,
  getNodeTotals,
  addBlockNode,
} from './helpers/componentBlockCreation';
import {
  NODE_OFFSET,
  LEG_LENGTH,
  STROKE_WIDTH,
  NODE_RADIUS,
} from '../components/componentConstants';

/*
  Component structure

  uuid: {
    x: "",
    y: "",
    type: '',
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
  Component block structure

  uuid: {
    x: "",
    y: "",
    type: 'componentBlock',
    components: {
      componentId: component
    },
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

// Define initial store state
const initialState = Immutable.fromJS({
  // SHOULD SPLIT
  activeTab: 'Root',
  tabs: {
    'Root': {
      path: '',
    },
  },
  //
  movingComponent: false,
  draggingComponent: null,
  activeNode: {
    id: '',
    input: true,
    connections: [],
  },
  activeWire: '',
  selectedComponents: Immutable.Set([]),
  selectedWires: Immutable.Set([]),
  selectionBox: {
    sX: null,
    sY: null,
    eX: null,
    eY: null,
  },
  components: {
    // a: {
    //   x: '20',
    //   y: '20',
    //   type: 'ComponentBlock',
    //   components: {
    //     'or': {
    //       type: 'ORGate',
    //       x: '40',
    //       y: '40',
    //       f: nodes => {
    //         let outputState = 0;

    //         nodes.forEach(node => {
    //           if (node.get('input') && node.get('state') === 1) {
    //             outputState = 1;
    //             return false;
    //           }
    //           return true;
    //         });

    //         return outputState;
    //       },
    //       nodes: {
    //         'or_1': {
    //           input: true,
    //           connections: Immutable.Set(['a_3']),
    //           state: 0,
    //         },
    //         'or_2': {
    //           input: true,
    //           connections: Immutable.Set(['a_4']),
    //           state: 0,
    //         },
    //         'or_3': {
    //           input: false,
    //           connections: Immutable.Set(['w_2']),
    //           state: 0,
    //         },
    //       }
    //     },
    //     'and': {
    //       type: 'ANDGate',
    //       x: '40',
    //       y: '40',
    //       f: nodes => {
    //         let outputState = 1;

    //         nodes.forEach(node => {
    //           if (node.get('input')) {
    //             if (node.get('state') === 0) {
    //               outputState = 0;
    //               return false;
    //             }
    //             return true;
    //           }
    //           return true;
    //         });

    //         return outputState;
    //       },
    //       nodes: {
    //         'and_1': {
    //           input: true,
    //           connections: Immutable.Set(['a_1']),
    //           state: 0,
    //         },
    //         'and_2': {
    //           input: true,
    //           connections: Immutable.Set(['a_2']),
    //           state: 0,
    //         },
    //         'and_3': {
    //           input: false,
    //           connections: Immutable.Set(['w_1']),
    //           state: 0,
    //         },
    //       }
    //     },
    //     'xor': {
    //       type: 'XORGate',
    //       x: '40',
    //       y: '40',
    //       f: nodes => {
    //         let nodeTotal = 0;

    //         nodes.forEach(node => {
    //           if (node.get('input')) {
    //             nodeTotal += node.get('state');
    //           }
    //         });

    //         if (nodeTotal === 1 || (nodes.size > 3 && nodeTotal === nodes.size - 1)) {
    //           return 1;
    //         }
    //         return 0;
    //       },
    //       nodes: {
    //         'xor_1': {
    //           input: true,
    //           connections: Immutable.Set(['w_1']),
    //           state: 0,
    //         },
    //         'xor_2': {
    //           input: true,
    //           connections: Immutable.Set(['w_2']),
    //           state: 0,
    //         },
    //         'xor_3': {
    //           input: false,
    //           connections: Immutable.Set(['a_5']),
    //           state: 0,
    //         },
    //       }
    //     },
    //   },
    //   wires: {
    //     w_1: {
    //       inputNode: 'and_3',
    //       outputNode: 'xor_1',
    //       points: Immutable.fromJS([{x: 0, y: 0}])
    //     },
    //     w_2: {
    //       inputNode: 'or_3',
    //       outputNode: 'xor_2',
    //       points: Immutable.fromJS([{x: 0, y: 0}])
    //     },
    //     w_3: {
    //       inputNode: 'xor_3',
    //       outputNode: 'a_5',
    //       points: Immutable.fromJS([{x: 0, y: 0}])
    //     },
    //   },
    //   inputNodes: 4,
    //   nodes: {
    //     a_1: {
    //       x: NODE_OFFSET,
    //       y: 6,
    //       input: true,
    //       connections: Immutable.Set([]),
    //       state: 0,
    //     },
    //     a_2: {
    //       x: NODE_OFFSET,
    //       y: 26,
    //       input: true,
    //       connections: Immutable.Set([]),
    //       state: 0,
    //     },
    //     a_3: {
    //       x: NODE_OFFSET,
    //       y: 46,
    //       input: true,
    //       connections: Immutable.Set([]),
    //       state: 0,
    //     },
    //     a_4: {
    //       x: NODE_OFFSET,
    //       y: 66,
    //       input: true,
    //       connections: Immutable.Set([]),
    //       state: 0,
    //     },
    //     a_5: {
    //       x: 40 + (LEG_LENGTH + STROKE_WIDTH) * 2 - NODE_OFFSET,
    //       y: 37,
    //       input: false,
    //       connections: Immutable.Set([]),
    //       state: 0,
    //     },
    //   },
    // },
  },
  wires: {},
});

// Component action reducers
function components(state = initialState, action) {
  // console.log('***', action.type);
  switch (action.type) {
    // NB: reducer composition may remove the need for 'components'
    case MOVE_COMPONENT: {
      const componentLocation = getComponentLocation(action.parents);
      const wireLocation = getWireLocation(action.parents);

      if (action.moveType === 'component') {
        // This is a component move
        return state.setIn(
          componentLocation.concat([action.uuid]),
          action.component,
        );
      } else if (action.moveType === 'vertex') {
        // This is a wire move
        return state.setIn(
          wireLocation.concat([action.uuid, 'points', action.vertexId]),
          action.component,
        );
      }
      return state;
    }
    case SET_DRAGGING_COMPONENT: {
      return state.set('draggingComponent', action.component);
    }
    case ADD_COMPONENT: {
      const componentLocation = getComponentLocation(action.parents);
      let newState = state.setIn(
        componentLocation.concat([action.uuid]),
        action.component,
      );

      if (
        action.component.get('type') === 'ComponentBlockInput' ||
        action.component.get('type') === 'ComponentBlockOutput'
      ) {
        newState = addBlockNode(newState, action);
      }

      console.log(newState.toJS())

      return newState;
    }
    case CREATE_COMPONENT_BLOCK: {
      let newState = state;
      const componentLocation = getComponentLocation(action.parents);

      const newBlock = Immutable.Map({ x: 10, y: 10, type: 'ComponentBlock'});


      newState = newState.setIn(
        componentLocation.concat([action.uuid]),
        newBlock,
      );

      // console.log(newState.toJS());

      return newState;
    }
    case CREATE_COMPONENT_BLOCK_FROM_SELECTED: {
      const componentLocation = getComponentLocation(action.parents);
      const wireLocation = getWireLocation(action.parents);
      let newState = state;
      let newBlock = Immutable.Map({ x: 10, y: 10, type: 'ComponentBlock'});
      let componentsToMove = Immutable.Map({});
      let wiresToMove = Immutable.Map({});

      // Add selected components to componentsToMove
      newState.get('selectedComponents').forEach(componentUuid => {
        componentsToMove = componentsToMove.set(
          componentUuid,
          newState.getIn(componentLocation.concat([componentUuid])),
        );
        // Delete component from old position
        newState = newState.deleteIn(['components', componentUuid]);
      });

      // Add selected wires to wiresToMove
      newState.get('selectedWires').forEach(wireUuid => {
        wiresToMove = wiresToMove.set(
          wireUuid,
          newState.getIn(wireLocation.concat(wireUuid)),
        );
        // Delete wire from old position
        newState = newState.deleteIn(['wires', wireUuid]);
      });

      newBlock = newBlock.set('components', componentsToMove);
      newBlock = newBlock.set('wires', wiresToMove);

      const inputNodes = [];
      const outputNodes = [];
      const nodeCounters = {
        input: 0,
        output: 0,
      };
      // Examine componentsToMove, if there are any nodes without a wire in
      // wiresToMove, then they are an external input/output
      componentsToMove.forEach((component, componentUuid) => {
        component.get('nodes').forEach((node, nodeUuid) => {
          if (node.get('connections').size === 0) {
            const nodeTotal = nodeCounters.input + nodeCounters.output;
            node.get('input')
              ? inputNodes.push(nodeUuid)
              : outputNodes.push(nodeUuid);

            newBlock = newBlock.setIn(
              ['nodes', `${action.uuid}_${nodeTotal}`],
              getComponentBlockNode(node, nodeCounters),
            );
            newBlock = updateComponentNode(
              newBlock,
              componentUuid,
              nodeUuid,
              action,
              nodeCounters,
            );
            node.get('input')
              ? (nodeCounters.input += 1)
              : (nodeCounters.ouptut += 1);
          } else {
            const nodeTotal = nodeCounters.input + nodeCounters.output;
            node.get('connections').forEach(connection => {
              if (!wiresToMove.has(connection)) {
                node.get('input')
                  ? inputNodes.push(nodeUuid)
                  : outputNodes.push(nodeUuid);

                newBlock = newBlock.setIn(
                  ['nodes', `${action.uuid}_${nodeTotal}`],
                  getComponentBlockNode(node, nodeCounters),
                );
                newBlock = updateComponentNode(
                  newBlock,
                  componentUuid,
                  nodeUuid,
                  action,
                  nodeCounters,
                );
                node.get('input')
                  ? (nodeCounters.input += 1)
                  : (nodeCounters.ouptut += 1);
                return false;
              }
              return true;
            });
          }
        });
      });

      newBlock = newBlock.set('inputNodes', inputNodes.length);

      newState = newState.setIn(['components', action.uuid], newBlock);

      console.log(newState.toJS());

      return newState;
    }
    case SELECT_COMPONENT: {
      let newState = state;
      if (action.clearPrevious) {
        // Clear all other selections
        newState = newState.set('selectedComponents', Immutable.Set([]));
        newState = newState.set('selectedWires', Immutable.Set([]));
      }
      if (!action.uuid) {
        // Clear selections if no id given
        newState = newState.set('selectedComponents', Immutable.Set([]));
      } else if (!newState.get('selectedComponents').includes(action.uuid)) {
        newState = newState.update('selectedComponents', selectedComponents =>
          selectedComponents.add(action.uuid),
        );
      }
      return newState;
    }
    case SELECT_WIRE: {
      let newState = state;
      if (action.clearPrevious) {
        // Clear all other selections
        newState = newState.set('selectedWires', Immutable.Set([]));
        newState = newState.set('selectedComponents', Immutable.Set([]));
      }
      if (!action.uuid) {
        // Clear selections if no id given
        newState = newState.set('selectedWires', Immutable.Set([]));
      } else if (!newState.get('selectedWires').includes(action.uuid)) {
        newState = newState.update('selectedWires', selectedWires =>
          selectedWires.add(action.uuid),
        );
      }
      return newState;
    }
    case DELETE_COMPONENT: {
      const componentLocation = getComponentLocation(action.parents);
      let newState = state;

      newState.get('selectedComponents').forEach(componentUuid => {
        newState = newState.deleteIn(componentLocation.concat([componentUuid]));
      });

      newState = newState.set('selectedComponents', Immutable.Set([]));

      return newState;
    }
    case START_NODE_CONNECTION: {
      let newState = state;
      newState = newState.set(
        'activeNode',
        Immutable.Map({
          id: action.nodeId,
          input: action.node.get('input'),
          connections: action.node.get('connections'),
        }),
      );

      newState = newState.set('activeWire', createUuid());

      console.log(newState.toJS());

      return newState;
    }
    case CANCEL_NODE_CONNECTION: {
      let newState = state;
      newState = newState.set(
        'activeNode',
        Immutable.Map({
          id: '',
          input: true,
          connections: [],
        }),
      );

      newState = newState.set('activeWire', '');

      return newState;
    }
    case CONNECT_NODES: {
      let newState = state;
      const componentLocation = getComponentLocation(action.parents);
      const wireLocation = getWireLocation(action.parents);


      console.log('***', action.parents, newState.getIn(componentLocation.concat([
        getComponentIdFromNodeId(action.nodes.inputNodeId)
      ])));
      // Update input node connection info
      newState = newState.updateIn(
        componentLocation.concat([
          getComponentIdFromNodeId(action.nodes.inputNodeId),
          'nodes',
          action.nodes.inputNodeId,
          'connections',
        ]),
        connections => connections.add(newState.get('activeWire')),
      );
      console.log(newState.toJS(), action.nodes.outputNodeId);
      // Update output node connection info
      newState = newState.updateIn(
        componentLocation.concat([
          getComponentIdFromNodeId(action.nodes.outputNodeId),
          'nodes',
          action.nodes.outputNodeId,
          'connections',
        ]),
        connections => connections.add(newState.get('activeWire')),
      );
      // Set output node initial state
      newState = newState.setIn(
        componentLocation.concat([
          getComponentIdFromNodeId(action.nodes.outputNodeId),
          'nodes',
          action.nodes.outputNodeId,
          'state',
        ]),
        newState.getIn(
          componentLocation.concat([
            getComponentIdFromNodeId(action.nodes.inputNodeId),
            'nodes',
            action.nodes.inputNodeId,
            'state',
          ]),
        ),
      );
      // Set wire info
      newState = newState.setIn(
        wireLocation.concat([newState.get('activeWire')]),
        Immutable.Map({
          inputNode: action.nodes.inputNodeId,
          outputNode: action.nodes.outputNodeId,
          points: getWirePoints(
            newState,
            action.nodes.inputNodeId,
            action.nodes.outputNodeId,
            action.parents,
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
      return newState;
    }
    case UPDATE_WIRE: {
      const wireLocation = getWireLocation(action.parents);
      const wire = state.getIn(wireLocation.concat([action.wireId]));
      if (wire) {
        return state.setIn(
          wireLocation.concat([action.wireId, 'points']),
          getWirePoints(
            state,
            wire.get('inputNode'),
            wire.get('outputNode'),
            action.parents,
          ),
        );
      }
      return state;
    }
    case DELETE_WIRE: {
      const wireLocation = getWireLocation(action.parents);
      const componentLocation = getComponentLocation(action.parents);
      let newState = state;

      // TODO: IN COMPONENT BLOCKS, COMPONENTS CONNECTED TO BLOCK I/O HAVE NO WIRE, SO THIS WILL FAIL
      const wire = newState.getIn(wireLocation.concat([action.wireId]));

      const wireNodes = [wire.get('inputNode'), wire.get('outputNode')];
      // Iterate through wire connections
      wireNodes.forEach(nodeId => {
        // Delete connection record for nodes
        newState = newState.updateIn(
          componentLocation.concat([
            getComponentIdFromNodeId(nodeId),
            'nodes',
            nodeId,
            'connections',
          ]),
          connections => connections.delete(action.wireId),
        );
      });

      // Reset output node state to 0
      newState = newState.setIn(
        componentLocation.concat([
          getComponentIdFromNodeId(wire.get('outputNode')),
          'nodes',
          wire.get('outputNode'),
          'state',
        ]),
        0,
      );

      // Delete wire from store
      newState = newState.deleteIn(wireLocation.concat([action.wireId]));
      // Remove wire ID from selectedWires
      newState = newState.update('selectedWires', selectedWires =>
        selectedWires.delete(action.wireId),
      );
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
        let componentLocation = getComponentLocation(action.parents);

        // Get the component function
        componentLocation = componentLocation.concat([action.uuid]);
        const f = newState.getIn(componentLocation.concat(['f']));

        if (f) {
          // Evaluate component function, f and set output state
          newState = newState.setIn(
            componentLocation.concat([
              'nodes',
              getOutputNodeId(newState.getIn(componentLocation)),
              'state',
            ]),
            f(newState.getIn(componentLocation.concat(['nodes']))),
          );
        }
      } else if (action.startType === 'wire') {
        const wireLocation = getWireLocation(action.parents).concat([
          action.uuid,
        ]);
        const outputNodeLocation = getComponentLocation(action.parents);

        const wireOutputNode = newState.getIn(
          wireLocation.concat(['outputNode']),
        );

        // If the wire output node is attached to a parent component
        // set the output node location accordingly
        if (
          action.parents &&
          getComponentIdFromNodeId(wireOutputNode) ===
            action.parents.slice(-1)[0]
        ) {
          outputNodeLocation.splice(-2, 2);
        }

        // Update wire output node
        newState = newState.setIn(
          outputNodeLocation.concat([
            getComponentIdFromNodeId(wireOutputNode),
            'nodes',
            wireOutputNode,
            'state',
          ]),
          action.wireState,
        );
      }

      return newState;
    }
    case UPDATE_BLOCK: {
      let newState = state;

      // Update internal input nodes connected to external input nodes
      newState
        .getIn(['components', action.uuid, 'components'])
        .forEach((component, componentId) => {
          component.get('nodes').forEach((node, nodeId) => {
            if (node.get('input')) {
              node.get('connections').forEach((connection, connectionId) => {
                // Check if node is connected to an external connection
                if (getComponentIdFromNodeId(connectionId) === action.uuid) {
                  newState = newState.setIn(
                    [
                      'components',
                      action.uuid,
                      'components',
                      componentId,
                      'nodes',
                      nodeId,
                      'state',
                    ],
                    newState.getIn([
                      'components',
                      action.uuid,
                      'nodes',
                      connectionId,
                      'state',
                    ]),
                  );
                }
              });
            }
          });
        });

      return newState;
    }
    case UPDATE_SELECTION_BOX: {
      const parents = getParentsFromPath(
        state.getIn(['tabs', state.get('activeTab'), 'path']),
      );
      const componentLocation = getComponentLocation(parents);
      const wireLocation = getWireLocation(parents);

      let newState = state;
      newState = state.update('selectionBox', original =>
        original.merge(Immutable.Map(action.coords)),
      );

      const selectionBox = newState.get('selectionBox');

      const minX = Math.min(selectionBox.get('eX'), selectionBox.get('sX'));
      const maxX = Math.max(selectionBox.get('eX'), selectionBox.get('sX'));
      const minY = Math.min(selectionBox.get('eY'), selectionBox.get('sY'));
      const maxY = Math.max(selectionBox.get('eY'), selectionBox.get('sY'));

      if (
        selectionBox.get('sX') &&
        selectionBox.get('eX') &&
        newState.getIn(componentLocation)
      ) {
        newState.getIn(componentLocation).forEach((component, uuid) => {
          if (
            component.get('x') > minX &&
            component.get('x') < maxX &&
            component.get('y') > minY &&
            component.get('y') < maxY
          ) {
            if (!newState.get('selectedComponents').includes(uuid)) {
              newState = newState.update(
                'selectedComponents',
                selectedComponents => selectedComponents.add(uuid),
              );
            }
          } else if (newState.get('selectedComponents').includes(uuid)) {
            newState = newState.update(
              'selectedComponents',
              selectedComponents => selectedComponents.delete(uuid),
            );
          }
        });

        if (newState.getIn(wireLocation)) {
          newState.getIn(wireLocation).forEach((wire, uuid) => {
            const xPoints = [];
            const yPoints = [];
            wire.get('points').forEach(point => {
              xPoints.push(point.get('x'));
              yPoints.push(point.get('y'));
            });

            const minPX = Math.min(...xPoints);
            const maxPX = Math.max(...xPoints);
            const minPY = Math.min(...yPoints);
            const maxPY = Math.max(...yPoints);

            if (
              minPX > minX &&
              maxPX < maxX &&
              minPY > minY &&
              maxPY < maxY &&
              newState
                .get('selectedComponents')
                .includes(getComponentIdFromNodeId(wire.get('inputNode'))) &&
              newState
                .get('selectedComponents')
                .includes(getComponentIdFromNodeId(wire.get('outputNode')))
            ) {
              if (!newState.get('selectedWires').includes(uuid)) {
                newState = newState.update('selectedWires', selectedWires =>
                  selectedWires.add(uuid),
                );
              }
            } else if (newState.get('selectedWires').includes(uuid)) {
              newState = newState.update('selectedWires', selectedWires =>
                selectedWires.delete(uuid),
              );
            }
          });
        }
      }

      return newState;
    }
    case SET_VIEW_CONTEXT: {
      let newState = state;
      let tabExists;

      newState.get('tabs').forEach((tab, tabName) => {
        if (tab.get('path') === action.path) {
          tabExists = tabName;
          newState = newState.setIn(['tabs', tabName, 'active'], true);
        }
      });

      if (!tabExists) {
        newState = newState.setIn(
          ['tabs', `Block ${newState.get('tabs').size}`],
          Immutable.Map({
            path: action.path,
          }),
        );
      }

      newState = newState.set('activeTab', tabExists || `Block ${newState.get('tabs').size - 1}`);

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
  components,
});

export default appReducers;
