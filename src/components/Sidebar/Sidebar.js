import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.css';
import models from '../../logicModels/index';
import { setDraggingComponent } from '../../store/actions';

class Sidebar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  // onDragStart(e, key) {
  //   console.log('setting', key);
  //   e.dataTransfer.setData('text', key);

  // }

  renderComponentCells() {
    const componentCells = [];

    Object.keys(models).forEach(key => {
      componentCells.push(
        <div draggable onDragStart={() => this.props.dispatch(setDraggingComponent(models[key]))}>
          {key}
        </div>,
      );
    });

    return componentCells;
  }

  render() {
    return (
      <div className={s.root}>
        {this.renderComponentCells()}
      </div>
    );
  }
}

const styledSidebar = withStyles(s)(Sidebar);

export default connect()(styledSidebar);
