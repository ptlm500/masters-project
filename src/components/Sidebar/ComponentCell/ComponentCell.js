import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentCell.css';
import ANDGate from '../../logic/ANDGate/ANDGate';

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
        key={this.props.componentModel}
        draggable
        onDragStart={() =>
          this.props.setDraggingComponent(this.props.componentModel)
        }
      >
        {this.props.name}
        <svg className={s.svg}>
          <ANDGate height={30} colour="black"/>
        </svg>
      </div>
    );
  }
}

export default withStyles(s)(ComponentCell);
