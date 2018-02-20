import { connect } from 'react-redux';
import { moveComponent, updateWire, selectComponent, addComponent, setDraggingComponent } from '../../store/actions';
import Grid from '../../components/Grid/Grid';

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components.get('components'),
    wires: state.components.get('wires'),
    draggingComponent: state.components.get('draggingComponent'),
    selectedComponent: state.components.get('selectedComponent'),
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
    selectComponent: uuid => {
      dispatch(selectComponent(uuid, ''));
    },
    addComponent: (uuid, component) => {
      dispatch(addComponent(uuid, component));
    },
    setDraggingComponent: () => {
      dispatch(setDraggingComponent(null, null));
    },
  };
};

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
