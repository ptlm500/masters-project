import React from 'react'
import PropTypes from 'prop-types';
import { NODE_RADIUS, STROKE_WIDTH } from '../componentConstants';

function isConnected(node) {
  return node.get('connections').size !== 0;
}

class Node extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    activeNode: PropTypes.object.isRequired,
    startNodeConnection: PropTypes.func.isRequired,
    cancelNodeConnection: PropTypes.func.isRequired,
    connectNodes: PropTypes.func.isRequired,
  };

  getStrokeColour() {
    if (this.props.activeNode.get('id') === this.props.uuid) {
      return 'orange';
    }
    return 'black';
  }

  canConnect(activeNode) {
    const inputNodeConnected = activeNode.get('input')
      ? isConnected(activeNode)
      : isConnected(this.props.node);
    if (
      activeNode.get('id') !== this.props.uuid &&
      activeNode.get('input') !== this.props.node.get('input') &&
      !inputNodeConnected
    ) {
      return true;
    }
    return false;
  }

  mouseDown(e) {
    console.log('Pressed node', this.props.activeNode.toJS());
    e.stopPropagation();
    // NEED TO CHECK IF ALREADY CONNECTED, AND STOP INPUT > INPUT CONNECTION etc.
    const activeNodeId = this.props.activeNode.get('id');
    if (activeNodeId !== '' && this.canConnect(this.props.activeNode)) {
      // Connect wire input to the output node, and wire output to the input node
      const nodes = {
        inputNodeId: !this.props.activeNode.get('input')
          ? activeNodeId
          : this.props.uuid,
        outputNodeId: this.props.activeNode.get('input')
          ? activeNodeId
          : this.props.uuid,
      };

      this.props.connectNodes(nodes);
    } else if (activeNodeId !== '') {
      this.props.cancelNodeConnection();
    } else if (!this.props.node.get('input') || !isConnected(this.props.node)) {
      this.props.startNodeConnection(this.props.uuid, this.props.node);
    }
  }

  render() {
    return (
      <circle
        cx={this.props.x}
        cy={this.props.y}
        onMouseDown={e => this.mouseDown(e)}
        r={NODE_RADIUS}
        fill="white"
        stroke={this.getStrokeColour()}
        strokeWidth={STROKE_WIDTH}
      />
    );
  }
}

export default Node;
