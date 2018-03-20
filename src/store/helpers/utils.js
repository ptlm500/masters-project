import Immutable from 'immutable';
import { getComponentIdFromNodeId } from '../../helpers';

export function getComponentLocation(parents) {
  let componentLocation = ['components'];
  // If this component has parents, update the location
  if (parents && parents.length !== 0) {
    parents.forEach(parent => {
      componentLocation = componentLocation.concat([parent, 'components']);
    });
  }

  return componentLocation;
}

export function getWireLocation(parents) {
  let wireLocation = ['wires'];
  // If this wire has parents, update the location
  if (parents && parents.length !== 0) {
    wireLocation = getComponentLocation(parents);
     // Replace the last value in the array with 'wires' to get correct location
    wireLocation[wireLocation.length - 1] = 'wires';
  }

  return wireLocation;
}

export function getNodeInfo(state, nodeId) {
  const component = state.getIn(['components', getComponentIdFromNodeId(nodeId)]);
  const node = {
    x: component.get('x') + component.getIn(['nodes', nodeId, 'x']),
    y: component.get('y') + component.getIn(['nodes', nodeId, 'y']),
    input: component.getIn(['nodes', nodeId, 'input']),
  };

  return node;
}

export function getWirePoints(state, startNodeId, endNodeId) {
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