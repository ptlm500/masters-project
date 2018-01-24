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
    svg: PropTypes.func,
  };


  startDrag(e) {
    // https://codepen.io/nasrullahs/pen/edwPyL
    e.preventDefault();
    let point = this.props.svg.createSVGPoint();
    let dragOffset = {};

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.props.svg.getScreenCTM().inverse());

    dragOffset = {
      x: point.x - this.state.rect.x,
      y: point.y - this.state.rect.y,
    };

    const mousemove = (e) => {
      e.preventDefault();
      point.x = e.clientX;
      point.y = e.clientY;
      const cursor = point.matrixTransform(this.props.svg.getScreenCTM().inverse());
      this.setState({
        rect: {
          x: cursor.x - dragOffset.x,
          y: cursor.y - dragOffset.y,
        },
      });
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  render() {
    return (
      <rect
        x={this.state.rect.x}
        y={this.state.rect.y}
        width="20"
        height="20"
        ref={e => (this.svgRectElem = e)}
        onMouseDown={e => this.startDrag(e)}
      />
    );
  }
}

export default withStyles(s)(DraggableComponent);
