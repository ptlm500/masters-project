import React from 'react';
import PropTypes from 'prop-types';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import WireContainer from '../../containers/WireContainer/WireContainer';

class Grid extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    wires: PropTypes.object.isRequired,
    movingComponent: PropTypes.bool.isRequired,
    move: PropTypes.func.isRequired,
    updateWire: PropTypes.func.isRequired,
    startMove: PropTypes.func.isRequired,
    endMove: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.startDrag = this.startDrag.bind(this);
  }

  updateWires(component) {
    component.get('nodes').forEach(node => {
      if (node.get('connection')) {
        console.log('updating wire', node.get('connection'));
        this.props.updateWire(node.get('connection'));
      }
    });
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

      component = component.set('x', Math.ceil((cursor.x - dragOffset.x) / 2) * 2);
      component = component.set('y', Math.ceil((cursor.y - dragOffset.y) / 2) * 2);
      this.props.move(uuid, component);
      this.updateWires(component);
    };

    const mouseup = e => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      this.props.endMove(uuid);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  onMouseDown(e) {
    this.props.selectComponent();
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

  renderWires() {
    const wires = [];

    this.props.wires.keySeq().forEach(uuid => {
      if (this.props.wires.getIn([uuid, 'points'])) {
        wires.push(<WireContainer key={uuid} uuid={uuid} />);
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
