import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import NodeContainer from '../../../containers/NodeContainer/NodeContainer';
import {toggleState } from '../../../store/actions';
import { STROKE_WIDTH, LEG_LENGTH, NODE_RADIUS } from '../../componentConstants';

const HEIGHT = 30;
const WIDTH = 50;

class ToggleSwitch extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  getComponentColour() {
    if (this.isSelectedComponent()) {
      return 'blue';
    }

    return 'black';
  }

  isSelectedComponent() {
    return this.props.selectedComponent.get('uuid') === this.props.uuid;
  }

  switchPressed(e) {
    e.stopPropagation();
    this.props.dispatch(toggleState(this.props.uuid));
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

  renderSwitch() {
    let fill = 'grey';
    let x = STROKE_WIDTH;

    if (this.props.component.get('state') === 1) {
      fill = 'green';
      x = WIDTH / 2;
    }

    return (
      <rect
        x={x}
        y={STROKE_WIDTH}
        height={HEIGHT - STROKE_WIDTH}
        width={WIDTH / 2}
        onMouseDown={e => this.switchPressed(e)}
        fill={fill}
      />
    );
  }

  render() {
    return (
      <g>
        <rect
          x={STROKE_WIDTH / 2}
          y={STROKE_WIDTH / 2}
          width={WIDTH}
          height={HEIGHT}
          strokeWidth={STROKE_WIDTH}
          stroke={this.getComponentColour()}
          fill="white"
        />
        {this.renderSwitch()}
        <line
          x1={WIDTH + STROKE_WIDTH}
          y1={HEIGHT / 2 + STROKE_WIDTH / 2}
          x2={WIDTH + LEG_LENGTH - NODE_RADIUS * 2}
          y2={HEIGHT / 2 + STROKE_WIDTH / 2}
          stroke={this.props.component.get('state') === 0 ? 'grey' : 'green'}
          strokeWidth={STROKE_WIDTH}
        />
        {this.renderNodes()}
      </g>
    );
  }
}

export default connect()(ToggleSwitch);
