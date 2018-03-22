import { connect } from 'react-redux';
import {
  moveComponent,
  updateWire,
  selectComponent,
  selectWire,
  addComponent,
  setDraggingComponent,
  updateSelectionBox,
} from '../../store/actions';
import Grid from '../../components/Grid/Grid';

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components.get('components'),
    wires: state.components.get('wires'),
    draggingComponent: state.components.get('draggingComponent'),
    selectedComponents: state.components.get('selectedComponents'),
    selectionBox: state.components.get('selectionBox'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (uuid, component, moveType, vertexId) => {
      dispatch(moveComponent(uuid, component, moveType, vertexId));
    },
    updateWire: wireId => {
      dispatch(updateWire(wireId));
    },
    selectComponent: (uuid, clearPrevious) => {
      dispatch(selectComponent(uuid, clearPrevious));
    },
    selectWire: (uuid, clearPrevious) => {
      dispatch(selectWire(uuid, clearPrevious));
    },
    addComponent: (uuid, component) => {
      dispatch(addComponent(uuid, component));
    },
    setDraggingComponent: () => {
      dispatch(setDraggingComponent(null, null));
    },
    updateSelectionBox: coords => {
      dispatch(updateSelectionBox(coords));
    }
  };
};

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
