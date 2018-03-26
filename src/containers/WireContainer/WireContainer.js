import { connect } from 'react-redux';
import Wire from '../../components/Wire/Wire';
import { selectWire, deleteWire, updateConnections } from '../../store/actions';
import { getComponentIdFromNodeId } from '../../helpers';

const mapStateToProps = (state, ownProps) => {
  let wireLocation = ['wires', ownProps.uuid];
  let inputNodeLocation = ['components'];
  if (ownProps.parents && ownProps.parents.length !== 0) {
    wireLocation = ['components']
    ownProps.parents.forEach(parent => {
      wireLocation = wireLocation.concat([parent, 'wires']);
      inputNodeLocation = inputNodeLocation.concat([parent, 'components']);
    });

    wireLocation = wireLocation.concat([ownProps.uuid]);
  }
  const wire = state.components.getIn(wireLocation);

  return {
    wire,
    wireState: state.components.getIn(
      inputNodeLocation.concat([
        getComponentIdFromNodeId(wire.get('inputNode')),
        'nodes',
        wire.get('inputNode'),
        'state',
      ]),
    ),
    selectedWires: state.components.get('selectedWires'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectWire: uuid => {
      dispatch(selectWire(uuid, 'wire'));
    },
    deleteWire: uuid => {
      dispatch(deleteWire(uuid));
    },
    updateConnections: wireState => {
      dispatch(
        updateConnections(ownProps.uuid, 'wire', wireState, ownProps.parents),
      );
    },
  };
};

const WireContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wire);

export default WireContainer;
