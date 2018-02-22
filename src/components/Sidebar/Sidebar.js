import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.css';
import models from '../../logicModels/index';
import ComponentCellContainer from '../../containers/ComponentCellContainer/ComponentCellContainer';

function renderComponentCells() {
  const componentCells = [];

  Object.keys(models).forEach(key => {
    componentCells.push(
      <ComponentCellContainer name={key} componentModel={models[key]} />,
    );
  });

  return componentCells;
}

class Sidebar extends React.Component {
  render() {
    return (
      <div className={s.root}>
        {renderComponentCells()}
      </div>
    );
  }
}

export default withStyles(s)(Sidebar);
