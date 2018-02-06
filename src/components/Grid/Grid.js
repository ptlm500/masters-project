import React from 'react';
import PropTypes from 'prop-types';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import { getComponentIdFromNodeId } from '../../helpers';

class Grid extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    wires: PropTypes.object.isRequired,
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

      component = component.set('x', Math.ceil((cursor.x - dragOffset.x) / 2) * 2);
      component = component.set('y', Math.ceil((cursor.y - dragOffset.y) / 2) * 2);
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

  // wireTracker(e) {
  //   if (this.props.wires.size !== 0) {
  //     if (this.state.mouseBuffer.x === 0 && this.state.mouseBuffer.y === 0) {
  //       this.setState({
  //         mouseBuffer: {
  //           x: e.clientX,
  //           y: e.clientY
  //         }
  //       });
  //     }

  //     if (this.state.direction === 'horizontal' && Math.ceil(this.state.mouseBuffer.y / 10) !== Math.ceil(e.clientY / 10)) {
  //       console.log(
  //         'vertical',
  //         Math.ceil(this.state.mouseBuffer.y / 10),
  //         Math.ceil(e.clientY / 10),
  //       );
  //       this.setState({ direction: 'vertical' });
  //     }

  //   }
  // }

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
      const wire = this.props.wires.get(uuid);
      if (wire && wire.get('nodes').size > 1) {
        console.log(wire);
        const startNodeId = wire.getIn(['nodes', 0]);
        const startComponent = this.props.components.get(getComponentIdFromNodeId(startNodeId));
        const startNode ={
          x: startComponent.get('x') + startComponent.getIn(['nodes', startNodeId, 'x']) + 4,
          y: startComponent.get('y') + startComponent.getIn(['nodes', startNodeId, 'y']),
        };
        const endNodeId = wire.getIn(['nodes', 1]);
        const endComponent = this.props.components.get(getComponentIdFromNodeId(endNodeId));
        const endNode ={
          x: endComponent.get('x') + endComponent.getIn(['nodes', endNodeId, 'x']) + 4,
          y: endComponent.get('y') + endComponent.getIn(['nodes', endNodeId, 'y']),
        };

        wires.push(
          <svg key={uuid}>
            <polyline strokeWidth="2" stroke="black" points={`${startNode.x}, ${startNode.y} ${endNode.x - 8}, ${endNode.y}`}/>
          </svg>
        );
        console.log('start', startNode);
      }
    });
    return wires;
  }


  render() {
    return (
      <svg
        viewBox="0 0 500 500"
        ref={svg => (this.svg = svg)}
        onMouseDown={e => this.addComponent(e)}
      >
        {this.renderComponents()}
        {this.renderWires()}
      </svg>
    );
  }
}

export default Grid;
