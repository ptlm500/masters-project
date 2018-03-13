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
    selectedComponents: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    parents: PropTypes.array,
    hidden: PropTypes.bool,
  };

  componentDidUpdate() {
    // Check if we need to update component output state
    if (!Immutable.is(this.nodes, this.props.component.get('nodes'))) {
      console.log('updating', this.props.uuid);
      this.props.dispatch(updateConnections(this.props.uuid, 'component', null, this.props.parents));
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
    return this.props.selectedComponents.includes(this.props.uuid);
  }

  render() {
    if (this.props.hidden) {
      return null;
    } else if (this.props.gateType) {
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

LogicGate.defaultProps = {
  parents: [],
  hidden: false,
};

export default connect()(LogicGate);
