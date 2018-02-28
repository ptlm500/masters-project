import { connect } from 'react-redux';
import Wire from '../../components/Wire/Wire';
import { selectComponent, deleteWire, updateConnections } from '../../store/actions';
import { getComponentIdFromNodeId } from '../../helpers';

const mapStateToProps = (state, ownProps) => {
  const wire = state.components.getIn(['wires', ownProps.uuid])
  return {
    wire,
    wireState: state.components.getIn([
      'components',
      getComponentIdFromNodeId(wire.get('inputNode')),
      'nodes',
      wire.get('inputNode'),
      'state',
    ]),
    selectedComponents: state.components.get('selectedComponents'),
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
