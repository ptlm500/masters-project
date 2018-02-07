import { connect } from 'react-redux';
import { selectComponent } from '../../store/actions';
import DraggableComponent from '../../components/DraggableComponent/DraggableComponent';

const mapStateToProps = (state, ownProps) => {
  // console.log(state.components.getIn(['components', ownProps.uuid]).toJS())
  return {
    component: state.components.getIn(['components', ownProps.uuid]),
    selectedComponent: state.components.get('selectedComponent'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectComponent: uuid => {
      dispatch(selectComponent(uuid, 'component'));
    },
  };
};

const DraggableComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableComponent);

export default DraggableComponentContainer;
