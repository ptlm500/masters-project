import { connect } from 'react-redux';
import Immutable from 'immutable';
import SelectedComponentEditor from '../../components/Sidebar/SelectedComponentEditor/SelectedComponentEditor';
import { getParentsFromPath } from '../../helpers';
import { getComponentLocation } from '../../store/helpers/utils';
import { updateComponentName } from '../../store/actions';

const mapStateToProps = (state, ownProps) => {
  const parents = getParentsFromPath(
    state.components.getIn(['tabs', state.components.get('activeTab'), 'path']),
  );

  let selectedComponents = Immutable.Map({});

  state.components.get('selectedComponents').forEach(componentUuid => {
    selectedComponents = selectedComponents.set(
      componentUuid,
      state.components.getIn(
        getComponentLocation(parents).concat([componentUuid]),
      ),
    );
  });

  return {
    selectedComponents,
    parents,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateComponentName: (uuid, name) => {
      dispatch(updateComponentName(uuid, ownProps.parents, name));
    },
  };
};

const SelectedComponentEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectedComponentEditor);

export default SelectedComponentEditorContainer;
