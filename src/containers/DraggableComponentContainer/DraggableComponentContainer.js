import { connect } from 'react-redux';
// import { moveComponent } from '../../store/actions';
import DraggableComponent from '../../components/DraggableComponent/DraggableComponent';

const mapStateToProps = (state, ownProps) => {
  // console.log(state.components.getIn(['components', ownProps.uuid]).toJS())
  return {
    component: state.components.getIn(['components', ownProps.uuid])
  };
}

const DraggableComponentContainer = connect(
  mapStateToProps,
)(DraggableComponent);

export default DraggableComponentContainer;
