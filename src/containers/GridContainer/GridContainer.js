import { connect } from 'react-redux';
import { moveComponent, startComponentMove, endComponentMove } from '../../store/actions';
import Grid from '../../components/Grid/Grid';

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components.get('components'),
    wires: state.components.get('wires'),
    movingComponent: state.components.get('movingComponent')
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (uuid, component) => {
      dispatch(moveComponent(uuid, component));
    },
    startMove: (uuid) => {
      dispatch(startComponentMove(uuid));
    },
    endMove: (uuid) => {
      dispatch(endComponentMove(uuid));
    },
  };
};

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
