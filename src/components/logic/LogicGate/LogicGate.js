import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { updateConnections } from '../../../store/actions';

import NodeContainer from '../../../containers/NodeContainer/NodeContainer';

class LogicGate extends React.Component {
  static propTypes = {
    gateType: PropTypes.func.isRequired,
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

  getComponentColour() {
    if (this.isSelectedComponent()) {
      return 'blue';
    }

    return 'black';
  }

  getNodes() {
    const nodes = [];

    this.props.component
      .get('nodes')
      .keySeq()
      .forEach(uuid => {
        nodes.push(
          <NodeContainer
            x={this.props.component.getIn(['nodes', uuid, 'x'])}
            y={this.props.component.getIn(['nodes', uuid, 'y'])}
            uuid={uuid}
            key={uuid}
          />,
        );
      });

    return nodes;
  }

  isSelectedComponent() {
    return this.props.selectedComponent.get('uuid') === this.props.uuid;
  }

  render() {
    if (this.props.gateType) {
      return (
        <this.props.gateType
          height={this.props.component.get('nodes').size * 10}
          colour={this.getComponentColour()}
          nodes={this.getNodes()}
        />
      );
    }
    console.error(
      `[LogicGate] No gate type provided for component ${this.props.uuid}`,
    );
    return null;
  }
}

export default connect()(LogicGate);
