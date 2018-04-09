import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.css';
import models from '../../logicModels/index';
import ComponentCellContainer from '../../containers/ComponentCellContainer/ComponentCellContainer';
import CreateComponentBlockButtonContainer from '../../containers/CreateComponentBlockButtonContainer/CreateComponentBlockButtonContainer';
import SelectedComponentEditorContainer from '../../containers/SelectedComponentEditorContainer/SelectedComponentEditorContainer';
import SaveButton from './SaveButton/SaveButton';
import LoadButton from './LoadButton/LoadButton';

class Sidebar extends React.Component {
  static propTypes = {
    activeTab: PropTypes.object.isRequired,
  };

  renderComponentCells() {
    const componentCells = [];

    Object.keys(models).forEach(key => {
      if (!this.props.activeTab.get('path')) {
        if (!models[key].hideInRoot)
          componentCells.push(
            <ComponentCellContainer name={key} componentModel={models[key]} />,
          );
      } else if (!models[key].hideInBlock) {
        componentCells.push(
          <ComponentCellContainer name={key} componentModel={models[key]} />,
        );
      }
    });

    return componentCells;
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.library}>
          {this.renderComponentCells()}
        </div>
        <SelectedComponentEditorContainer />
        <CreateComponentBlockButtonContainer />
        <div className={s['save-load']}>
          <SaveButton />
          <LoadButton />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Sidebar);
