import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import NodeContainer from '../../../containers/NodeContainer/NodeContainer';
import {
  STROKE_WIDTH,
  NODE_RADIUS,
  LEG_LENGTH,
} from '../../componentConstants';
import { updateConnections } from '../../../store/actions';

class ANDGate extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    // Check if we need to update component output state
    if (!Immutable.is(this.nodes, this.props.component.get('nodes'))) {
      this.props.dispatch(updateConnections(this.props.uuid, 'component'));
      this.nodes = this.props.component.get('nodes');
    }
  }

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
        <line
          x1={NODE_RADIUS * 2}
          y1="6"
          x2={LEG_LENGTH}
          y2="6"
          stroke={this.getWireColour()}
          strokeWidth={STROKE_WIDTH}
        />
        <line
          x1={NODE_RADIUS * 2}
          y1="25"
          x2={LEG_LENGTH}
          y2="25"
          stroke={this.getWireColour()}
          strokeWidth={STROKE_WIDTH}
        />
        <path
          d={`M ${LEG_LENGTH},2
            L ${LEG_LENGTH},${this.componentHeight}
            l 8,0
            c 16,0 16,-${this.componentHeight - 2} 0,-${this.componentHeight - 2},
            Z`}
          fill="white"
          stroke={this.getWireColour()}
          strokeWidth={2}
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

export default connect()(ANDGate);
