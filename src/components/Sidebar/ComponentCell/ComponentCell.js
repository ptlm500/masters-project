import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentCell.css';

class ComponentCell extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    componentModel: PropTypes.object.isRequired,
    setDraggingComponent: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div
        className={s.column}
        key={this.props.name}
        draggable
        onDragStart={() =>
          this.props.setDraggingComponent(this.props.componentModel.generator)
        }
      >
        {this.props.name}
        <svg className={s.svg} viewbox="0 0 50 50">
          {this.props.componentModel.icon}
        </svg>
      </div>
    );
  }
}

export default withStyles(s)(ComponentCell);
