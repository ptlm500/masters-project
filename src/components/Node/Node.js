import React from 'react'
import PropTypes from 'prop-types';
import { NODE_RADIUS, STROKE_WIDTH } from '../componentConstants';

class Node extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    activeNode: PropTypes.object.isRequired,
    startNodeConnection: PropTypes.func.isRequired,
    connectNodes: PropTypes.func.isRequired
  }



  mouseDown(e) {
    console.log('Pressed node', this.props.activeNode.toJS());
    e.stopPropagation();
    // NEED TO CHECK IF ALREADY CONNECTED, AND STOP INPUT > INPUT CONNECTION etc.
    if (this.props.activeNode.get('id') !== ''
        && this.props.activeNode.get('id') !== this.props.uuid
        && this.props.activeNode.get('input') !== this.props.node.get('input')) {
      this.props.connectNodes(this.props.activeNode.get('id'), this.props.uuid);
    } else {
      this.props.startNodeConnection(this.props.uuid, this.props.node.get('input'));
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
        stroke="black"
        strokeWidth={STROKE_WIDTH}
      />
    );
  }
}

export default Node;
