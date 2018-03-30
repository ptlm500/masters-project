import { connect } from 'react-redux';
import { createComponentBlock } from '../../store/actions';
import CreateComponentBlockButton from '../../components/Sidebar/CreateComponentBlockButton/CreateComponentBlockButton';

const mapStateToProps = (state, ownProps) => {
  return {
    selectedComponents: state.components.get('selectedComponents'),
    parents: state.components.getIn([
      'tabs',
      state.components.get('activeTab'),
      'componentParents',
    ]),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createComponentBlock: (uuid, parents) => {
      dispatch(createComponentBlock(uuid, parents));
    },
  };
};

const CreateComponentBlockButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateComponentBlockButton);

export default CreateComponentBlockButtonContainer;
