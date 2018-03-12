import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import NodeContainer from '../../containers/NodeContainer/NodeContainer';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import WireContainer from '../../containers/WireContainer/WireContainer';
import { updateBlock } from '../../store/actions';
import { STROKE_WIDTH, LEG_LENGTH, NODE_RADIUS, LEG_SPACING } from '../componentConstants';

const WIDTH = 40;

class ComponentBlock extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    parents: PropTypes.array,
  };

  componentDidUpdate() {
    // Check if we need to update component output state
    if (!Immutable.is(this.nodes, this.props.component.get('nodes'))) {
      this.props.dispatch(updateBlock(this.props.uuid));
      this.nodes = this.props.component.get('nodes');
    }
  }

  getComponentColour() {
    if (this.isSelectedComponent()) {
      return 'blue';
    }

    return 'black';
  }

  isSelectedComponent() {
    return this.props.selectedComponents.includes(this.props.uuid);
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

  renderLegs() {
    const legs = [];

    this.props.component.get('nodes').keySeq().forEach(uuid => {
      const nodeX = this.props.component.getIn(['nodes', uuid, 'x']);
      const nodeY = this.props.component.getIn(['nodes', uuid, 'y']);
        const endX = this.props.component.getIn(['nodes', uuid, 'input'])
          ? nodeX + LEG_LENGTH - STROKE_WIDTH
          : nodeX - LEG_LENGTH + STROKE_WIDTH;

      legs.push(
        <line
          key={uuid}
          x1={nodeX}
          y1={nodeY}
          x2={endX}
          y2={nodeY}
          stroke={this.props.component.getIn(['nodes', uuid, 'state']) === 0 ? 'black' : 'green'}
          strokeWidth={STROKE_WIDTH}
        />
      );
    });

    return legs;
  }

  renderComponents() {
    const components = [];

    this.props.component.get('components').forEach((component, uuid) => {
      components.push(
        <DraggableComponentContainer
          key={uuid}
          uuid={uuid}
          component={component}
          moveComponent={() => console.log('plz no drag')}
          parents={this.props.parents.concat([this.props.uuid])}
        />,
      );
    });

    return components;
  }

  renderWires() {
    const wires = [];

    this.props.component.get('wires').forEach((wire, uuid) => {
      if (wire.get('points')) {
        wires.push(
          <WireContainer
            key={uuid}
            uuid={uuid}
            moveVertex={() => console.log('plz no drag')}
            parents={this.props.parents.concat([this.props.uuid])}
          />,
        );
      }
    });
    return wires;
  }

  render() {
    const HEIGHT =
      10 + (this.props.component.get('inputNodes') - 1) * LEG_SPACING;
    return (
      <g>
        <rect
          x={STROKE_WIDTH + LEG_LENGTH}
          y={STROKE_WIDTH / 2}
          width={WIDTH}
          height={HEIGHT}
          strokeWidth={STROKE_WIDTH}
          stroke={this.getComponentColour()}
          fill="white"
        />
        {this.renderLegs()}
        {this.renderNodes()}
        {this.renderComponents()}
        {this.renderWires()}
      </g>
    );
  }
}

ComponentBlock.defaultProps = {
  parents: [],
};

export default connect()(ComponentBlock);
