import { connect } from 'react-redux';
import { createComponentBlock } from '../../store/actions';
import CreateComponentBlockButton from '../../components/Sidebar/CreateComponentBlockButton/CreateComponentBlockButton';

const mapStateToProps = (state, ownProps) => {
  return {
    selectedComponents: state.components.get('selectedComponents'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createComponentBlock: uuid => {
      dispatch(createComponentBlock(uuid));
    },
  };
};

const CreateComponentBlockButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateComponentBlockButton);

export default CreateComponentBlockButtonContainer;
