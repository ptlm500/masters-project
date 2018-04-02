import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import NodeContainer from '../../containers/NodeContainer/NodeContainer';
import { STROKE_WIDTH, LEG_LENGTH } from '../componentConstants';

class ComponentBlockInput extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    parents: PropTypes.array,
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
          x={node.get('x')}
          y={node.get('y')}
          uuid={uuid}
          key={uuid}
          node={node}
        />,
      );
    });

    return nodes;
  }

  render() {
    const state = this.props.component.get('nodes').first().get('state');

    return (
      <g>
        <polygon points="0,0 0,21, 21,11 21,10" fill={this.getComponentColour()} />
        <line
          x1={20}
          y1={STROKE_WIDTH + 9}
          x2={20 + LEG_LENGTH}
          y2={STROKE_WIDTH + 9}
          stroke={state === 0 ? 'black' : 'green'}
          strokeWidth={STROKE_WIDTH}
        />
        {this.renderNodes()}
      </g>
    );
  }
}

ComponentBlockInput.defaultProps = {
  parents: [],
};

export default ComponentBlockInput;
