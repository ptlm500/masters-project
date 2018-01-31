import { connect } from 'react-redux';
import { moveComponent } from '../../store/actions';
import Grid from '../../components/Grid/Grid';

const mapStateToProps = (state, ownProps) => {
  return {
    components: state.components.get('components')
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (uuid, component) => {
      dispatch(moveComponent(uuid, component))
    }
  }
}

const GridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

export default GridContainer;
