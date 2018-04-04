import React from 'react';
import PropTypes from 'prop-types';
import NodeContainer from '../../../containers/NodeContainer/NodeContainer';
import { STROKE_WIDTH, LEG_LENGTH } from '../../componentConstants';

class LED extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
  };

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

    this.props.component.get('nodes').forEach((node, uuid) => {
      nodes.push(
        <NodeContainer
          x={this.props.component.getIn(['nodes', uuid, 'x'])}
          y={this.props.component.getIn(['nodes', uuid, 'y'])}
          uuid={uuid}
          key={uuid}
          node={node}
        />
      );
    });

    return nodes;
  }

  render() {
    const state = this.props.component.get('nodes').first().get('state');
    let fill = 'grey';

    if (state === 1) {
      fill = 'green';
    }

    return (
      <g>
        <circle
          cx={STROKE_WIDTH + LEG_LENGTH + 10}
          cy={STROKE_WIDTH + 10}
          r={10}
          stroke={this.getComponentColour()}
          strokeWidth={STROKE_WIDTH}
          fill={fill}
        />
        <line
          x1={STROKE_WIDTH}
          y1={STROKE_WIDTH + 10}
          x2={STROKE_WIDTH + LEG_LENGTH}
          y2={STROKE_WIDTH + 10}
          stroke={state === 0 ? 'black' : 'green'}
          strokeWidth={STROKE_WIDTH}
        />
        {this.renderNodes()}
      </g>
    );
  }
}

export default LED;
