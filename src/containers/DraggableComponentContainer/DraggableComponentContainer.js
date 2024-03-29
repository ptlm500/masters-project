import { connect } from 'react-redux';
import {
  selectComponent,
  deleteComponent,
  deleteWire,
  deleteBlockNode,
} from '../../store/actions';
import DraggableComponent from '../../components/DraggableComponent/DraggableComponent';

const mapStateToProps = (state, ownProps) => {
  // console.log(state.components.getIn(['components', ownProps.uuid]).toJS())
  return {
    // component: state.components.getIn(['components', ownProps.uuid]),
    selectedComponents: state.components.get('selectedComponents'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectComponent: () => {
      dispatch(selectComponent(ownProps.uuid, true));
    },
    deleteComponent: () => {
      dispatch(deleteComponent(ownProps.uuid, ownProps.parents));
    },
    deleteWire: (uuid, parents) => {
      dispatch(deleteWire(uuid, parents));
    },
    deleteBlockNode: (uuid, parents) => {
      dispatch(deleteBlockNode(uuid, parents));
    },
  };
};

const DraggableComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableComponent);

export default DraggableComponentContainer;
