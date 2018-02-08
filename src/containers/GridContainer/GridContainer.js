import { connect } from 'react-redux';
import { moveComponent, updateWire, selectComponent } from '../../store/actions';
import Grid from '../../components/Grid/Grid';

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components.get('components'),
    wires: state.components.get('wires'),
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (uuid, component, moveType, vertexId) => {
      dispatch(moveComponent(uuid, component, moveType, vertexId));
    },
    updateWire: (wireId) => {
      dispatch(updateWire(wireId));
    },
    selectComponent: () => {
      dispatch(selectComponent('', ''));
    },
  };
};

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
