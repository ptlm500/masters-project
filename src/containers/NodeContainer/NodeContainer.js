import { connect } from 'react-redux';
import Node from '../../components/Node/Node';
import { getComponentIdFromNodeId } from '../../helpers';
import { startNodeConnection, cancelNodeConnection, connectNodes } from '../../store/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.components.getIn(['components', getComponentIdFromNodeId(ownProps.uuid), 'nodes', ownProps.uuid]),
    activeNode: state.components.get('activeNode'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startNodeConnection: (nodeId, node) => {
      dispatch(startNodeConnection(nodeId, node));
    },
    cancelNodeConnection: () => {
      dispatch(cancelNodeConnection());
    },
    connectNodes: nodes => {
      dispatch(connectNodes(nodes));
    },
  };
};

const NodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);

export default NodeContainer;
