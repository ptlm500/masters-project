import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NodeContainer from '../../containers/NodeContainer/NodeContainer';
import { STROKE_WIDTH, LEG_LENGTH } from '../componentConstants';
import { addBlockNode } from '../../store/actions';

class ComponentBlockInput extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    parents: PropTypes.array,
    hidden: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(
      addBlockNode(this.props.uuid, this.props.component, this.props.parents),
    );
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

    return null;
  }
}

ComponentBlockInput.defaultProps = {
  parents: [],
  hidden: false,
};

export default connect()(ComponentBlockInput);
