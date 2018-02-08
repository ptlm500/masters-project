import React from 'react';
import PropTypes from 'prop-types';
import NodeContainer from '../../../containers/NodeContainer/NodeContainer';
import {
  STROKE_WIDTH,
  NODE_RADIUS,
  LEG_LENGTH,
} from '../../componentConstants';

class ANDGate extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
  };

  setComponentDimensions(nodeCount) {
    this.componentHeight = nodeCount * 10;
  }

  getWireColour() {
    if (this.isSelectedComponent()) {
      return 'blue';
    }

    return 'black';
  }

  isSelectedComponent() {
    return this.props.selectedComponent.get('uuid') === this.props.uuid;
  }

  renderNodes() {
    const nodes = [];

    this.props.component.get('nodes').keySeq().forEach(uuid => {
      nodes.push(
        <NodeContainer
          x={this.props.component.getIn(['nodes', uuid, 'x'])}
          y={this.props.component.getIn(['nodes', uuid, 'y'])}
          uuid={uuid}
          key={uuid}
        />
      );
    });

    return nodes;
  }

  render() {
    this.setComponentDimensions(this.props.component.get('nodes').size);

    return (
      <g>
        <path
          d={`M ${LEG_LENGTH - 4},2
            c 10,0 10,${this.componentHeight - 2} 0,${this.componentHeight - 2}
            M ${LEG_LENGTH - 4},2
            c 32,0 32,${this.componentHeight - 2} 0,${this.componentHeight - 2}`}
          fill="white"
          stroke={this.getWireColour()}
          strokeWidth={2}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="6"
          x2={LEG_LENGTH + 1}
          y2="6"
          stroke={this.getWireColour()}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="25"
          x2={LEG_LENGTH + 1}
          y2="25"
          stroke={this.getWireColour()}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1="40"
          y1={this.componentHeight / 2 + STROKE_WIDTH / 2}
          x2={40 + LEG_LENGTH - NODE_RADIUS * 2}
          y2={this.componentHeight / 2 + STROKE_WIDTH / 2}
          stroke={this.getWireColour()}
          strokeWidth={STROKE_WIDTH}
        />
        {this.renderNodes()}
      </g>
    );
  }
}

export default ANDGate;
