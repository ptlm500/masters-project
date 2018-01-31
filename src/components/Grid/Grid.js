import React from 'react';
import PropTypes from 'prop-types';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';

class Grid extends React.Component {
  constructor() {
    super();

    this.startDrag = this.startDrag.bind(this);
  }

  static propTypes = {
    components: PropTypes.object.isRequired,
    move: PropTypes.func.isRequired
  };

  startDrag(e, uuid, component) {
    e.preventDefault();
    let point = this.svg.createSVGPoint();
    let dragOffset = {};

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM().inverse());

    dragOffset = {
      x: point.x - component.get('x'),
      y: point.y - component.get('y'),
    };

    const mousemove = (e) => {
      e.preventDefault();
      point.x = e.clientX;
      point.y = e.clientY;
      const cursor = point.matrixTransform(this.svg.getScreenCTM().inverse());

      component = component.set('x', cursor.x - dragOffset.x);
      component = component.set('y', cursor.y - dragOffset.y)
      this.props.move(uuid, component)
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  renderComponents() {
    let components = [];

    this.props.components.keySeq().forEach(uuid => {
      components.push(
        <DraggableComponentContainer
          key={uuid}
          uuid={uuid}
          moveComponent={this.startDrag}
        />
      );
    });

    return components;
  }

  render() {
    return (
      <svg viewBox="0 0 100 100" ref={svg => (this.svg = svg)}>
        {this.renderComponents()}
      </svg>
    );
  }
}

export default Grid;
