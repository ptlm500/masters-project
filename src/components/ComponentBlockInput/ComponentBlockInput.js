import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import NodeContainer from '../../containers/NodeContainer/NodeContainer';
import { STROKE_WIDTH, LEG_LENGTH } from '../componentConstants';
import { updateConnections } from '../../store/actions';

class ComponentBlockInput extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    parents: PropTypes.array,
    hidden: PropTypes.bool,
  };

  componentDidUpdate() {
    // Check if we need to update component output state
    if (!Immutable.is(this.nodes, this.props.component.get('nodes'))) {
      this.props.dispatch(
        updateConnections(
          this.props.uuid,
          'component',
          null,
          this.props.parents,
        ),
      );
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

    this.props.component.get('nodes').forEach((node, uuid) => {
      nodes.push(
        <NodeContainer
          x={node.get('x')}
          y={node.get('y')}
          uuid={uuid}
          key={uuid}
          node={node}
          parents={this.props.parents}
        />,
      );
    });

    return nodes;
  }

  render() {
    if (!this.props.hidden) {
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
    console.log('**', this.props.component.get('state'));

    return null;
  }
}

ComponentBlockInput.defaultProps = {
  parents: [],
  hidden: false,
};

export default connect()(ComponentBlockInput);
