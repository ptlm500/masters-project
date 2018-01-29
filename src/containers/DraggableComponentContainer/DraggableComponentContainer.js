import { connect } from 'react-redux';
import { moveComponent } from '../../store/actions';
import DraggableComponent from '../../components/DraggableComponent/DraggableComponent';

const mapStateToProps = (state, ownProps) => {
  console.log('***', state);
  return {
    component: state.getIn(['components', ownProps.uuid])
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: component => {
      dispatch(moveComponent(uuid, component))
    }
  }
}

const DraggableComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableComponent);

export default DraggableComponentContainer;
