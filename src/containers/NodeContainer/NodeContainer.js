import { connect } from 'react-redux';
import Node from '../../components/Node/Node';
import { startNodeConnection, cancelNodeConnection, connectNodes } from '../../store/actions';

const mapStateToProps = (state, ownProps) => {
  return {
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
      dispatch(connectNodes(nodes, ownProps.parents));
    },
  };
};

const NodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);

export default NodeContainer;
