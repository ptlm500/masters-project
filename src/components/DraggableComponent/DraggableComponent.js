import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

class DraggableComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { rect: { x: 5, y: 2 } };
  }

  static propTypes = {
    component: PropTypes.object.isRequired,
    move: PropTypes.func.isRequired
  };

  render() {
    return (
      <rect
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        width="20"
        height="20"
        ref={e => (this.svgRectElem = e)}
        onMouseDown={e => this.startDrag(e)}
      />
    );
  }
}

export default withStyles(s)(DraggableComponent);
