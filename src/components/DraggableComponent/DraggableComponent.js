import React from 'react';
import Draggable from 'react-draggable'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

class DraggableComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    component: PropTypes.object.isRequired,
    moveComponent: PropTypes.func.isRequired
  };

  endDrag(e) {
    document.removeEventListener('mousemove', this.mouseMove.bind(this));
    this.coords = {};
  }

  render() {
    return (
      <rect
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        width="20"
        height="20"
        ref={e => (this.svgRectElem = e)}
        onMouseDown={e => (
          this.props.moveComponent(e, this.props.uuid, this.props.component))}
      />
    );
  }
}

export default withStyles(s)(DraggableComponent);
