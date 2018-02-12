import { connect } from 'react-redux';
import Wire from '../../components/Wire/Wire';
import { selectComponent, deleteWire, updateConnections } from '../../store/actions';
import { getComponentIdFromNodeId } from '../../helpers';

const mapStateToProps = (state, ownProps) => {
  const inputNodeId = state.components.getIn([
    'wires',
    ownProps.uuid,
    'nodes',
    0,
  ]);

  return {
    wire: state.components.getIn(['wires', ownProps.uuid]),
    wireState: state.components.getIn([
      'components',
      getComponentIdFromNodeId(inputNodeId),
      'nodes',
      inputNodeId,
      'state',
    ]),
    selectedComponent: state.components.get('selectedComponent'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectComponent: uuid => {
      dispatch(selectComponent(uuid, 'wire'));
    },
    deleteWire: uuid => {
      dispatch(deleteWire(uuid));
    },
    updateConnections: wireState => {
      dispatch(updateConnections(ownProps.uuid, 'wire', wireState));
    },
  };
};

const WireContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wire);

export default WireContainer;
