import { connect } from 'react-redux';
import Wire from '../../components/Wire/Wire';
import { selectComponent, deleteWire } from '../../store/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    wire: state.components.getIn(['wires', ownProps.uuid]),
    selectedComponent: state.components.get('selectedComponent'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectComponent: uuid => {
      dispatch(selectComponent(uuid, 'wire'));
    },
    deleteWire: uuid => {
      dispatch(deleteWire(uuid));
    }
  };
};

const WireContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wire);

export default WireContainer;
