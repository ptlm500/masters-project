import React from 'react';
import PropTypes from 'prop-types';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';

class Grid extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    movingComponent: PropTypes.bool.isRequired,
    move: PropTypes.func.isRequired,
    startMove: PropTypes.func.isRequired,
    endMove: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.startDrag = this.startDrag.bind(this);
  }

  startDrag(e, uuid, component) {
    this.props.startMove(uuid);
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

    const mouseup = e => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      this.props.endMove(uuid);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  addComponent(e) {
    if (!this.props.movingComponent) {
      console.log(e)
    }
  }

  renderComponents() {
    const components = [];

    this.props.components.keySeq().forEach(uuid => {
      components.push(
        <DraggableComponentContainer
          key={uuid}
          uuid={uuid}
          moveComponent={this.startDrag}
        />,
      );
    });

    return components;
  }

  render() {
    return (
      <svg
        viewBox="0 0 500 500"
        ref={svg => (this.svg = svg)}
        onMouseDown={e => this.addComponent(e)}
      >
        {this.renderComponents()}
      </svg>
    );
  }
}

export default Grid;
