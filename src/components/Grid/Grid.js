import React from 'react';
import PropTypes from 'prop-types';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import WireContainer from '../../containers/WireContainer/WireContainer';

class Grid extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    wires: PropTypes.object.isRequired,
    move: PropTypes.func.isRequired,
    updateWire: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.startComponentDrag = this.startComponentDrag.bind(this);
  }

  onMouseDown(e) {
    this.props.selectComponent();
  }

  startComponentDrag(e, uuid, component, type, vertexId) {
    e.preventDefault();
    // Set quantise scale
    const qScale = type === 'component' ? 2 : 1;

    let point = this.svg.createSVGPoint();
    let dragOffset = {};

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM().inverse());

    dragOffset = {
      x: point.x - component.get('x'),
      y: point.y - component.get('y'),
    };

    const mousemove = moveEvent => {
      moveEvent.preventDefault();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const cursor = point.matrixTransform(this.svg.getScreenCTM().inverse());

      let newComponent = component.set(
        'x',
        Math.ceil((cursor.x - dragOffset.x) / qScale) * qScale,
      );
      newComponent = newComponent.set(
        'y',
        Math.ceil((cursor.y - dragOffset.y) / qScale) * qScale,
      );
      // Call reducer for component move
      this.props.move(uuid, newComponent, type, vertexId);
      // If component is moving, call wire updater
      if (type === 'component') {
        this.updateWires(newComponent);
      }
    };

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  updateWires(component) {
    component.get('nodes').forEach(node => {
      if (node.get('connection')) {
        this.props.updateWire(node.get('connection'));
      }
    });
  }

  renderComponents() {
    const components = [];

    this.props.components.keySeq().forEach(uuid => {
      components.push(
        <DraggableComponentContainer
          key={uuid}
          uuid={uuid}
          moveComponent={this.startComponentDrag}
        />,
      );
    });

    return components;
  }

  renderWires() {
    const wires = [];

    this.props.wires.keySeq().forEach(uuid => {
      if (this.props.wires.getIn([uuid, 'points'])) {
        wires.push(
          <WireContainer
            key={uuid}
            uuid={uuid}
            moveVertex={this.startComponentDrag}
          />,
        );
      }
    });
    return wires;
  }

  render() {
    return (
      <svg
        viewBox="0 0 500 500"
        ref={svg => (this.svg = svg)}
        onMouseDown={e => this.onMouseDown(e)}
      >
        {this.renderComponents()}
        {this.renderWires()}
      </svg>
    );
  }
}

export default Grid;
