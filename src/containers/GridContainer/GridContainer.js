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
    activeTab: state.components.getIn([
      'tabs',
      state.components.get('activeTab'),
    ]),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (uuid, component, moveType, vertexId, parents) => {
      dispatch(moveComponent(uuid, component, moveType, vertexId, parents));
    },
    updateWire: (wireId, parents) => {
      dispatch(updateWire(wireId, parents));
    },
    selectComponent: (uuid, clearPrevious) => {
      dispatch(selectComponent(uuid, clearPrevious));
    },
    selectWire: (uuid, clearPrevious) => {
      dispatch(selectWire(uuid, clearPrevious));
    },
    addComponent: (uuid, component, parents) => {
      dispatch(addComponent(uuid, component, parents));
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
