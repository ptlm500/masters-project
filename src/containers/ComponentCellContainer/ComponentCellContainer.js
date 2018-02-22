import { connect } from 'react-redux';
import { setDraggingComponent } from '../../store/actions';
import ComponentCell from '../../components/Sidebar/ComponentCell/ComponentCell';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDraggingComponent: component => {
      dispatch(setDraggingComponent(component));
    },
  };
};

const ComponentCellContainer = connect(
  null,
  mapDispatchToProps
)(ComponentCell);

export default ComponentCellContainer;
