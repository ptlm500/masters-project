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

  getNodeInfo(nodeId) {
    const component = this.props.components.get(
      getComponentIdFromNodeId(nodeId),
    );
    const node = {
      x: component.get('x') + component.getIn(['nodes', nodeId, 'x']),
      y: component.get('y') + component.getIn(['nodes', nodeId, 'y']),
      input: component.getIn(['nodes', nodeId, 'input']),
    };

    return node;
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
    // If start node is an input, the wire must first go left
    // If start node is an output, the wire must first go right
    // If end node x < start node x, the wire must clear the component and go left
    const wires = [];

    this.props.wires.keySeq().forEach(uuid => {
      const wire = this.props.wires.get(uuid);
      if (wire && wire.get('nodes').size > 1) {
        console.log(wire);
        const startNodeId = wire.getIn(['nodes', 0]);
        const startNode = this.getNodeInfo(startNodeId);
        const endNodeId = wire.getIn(['nodes', 1]);
        const endNode = this.getNodeInfo(endNodeId);

        let points = '';

        if (!startNode.input) {
          points = `${startNode.x + 4}, ${startNode.y}`;
          if (startNode.y !== endNode.y) {
            if (startNode.x < endNode.x) {
              points = points.concat(` ${startNode.x + (endNode.x - startNode.x) / 2}, ${startNode.y}`);
              points = points.concat(` ${startNode.x + (endNode.x - startNode.x) / 2}, ${endNode.y}`);
            } else if (startNode.x > endNode.x) {
              points = points.concat(` ${startNode.x + 10}, ${startNode.y}`);
              points = points.concat(` ${startNode.x + 10}, ${startNode.y + (endNode.y - startNode.y) / 2}`);
              points = points.concat(` ${endNode.x - 10}, ${startNode.y + (endNode.y - startNode.y) / 2}`);
              points = points.concat(` ${endNode.x - 10}, ${endNode.y}`);
            }
          }

          points = points.concat(` ${endNode.x - 4}, ${endNode.y}`);
        } else if (startNode.input) {
          points = `${startNode.x - 4}, ${startNode.y}`;
          if (startNode.y !== endNode.y) {
            if (startNode.x < endNode.x) {
              points = points.concat(` ${startNode.x - 10}, ${startNode.y}`);
              points = points.concat(` ${startNode.x - 10}, ${startNode.y + (startNode.x - endNode.x) / 4}`);
              points = points.concat(` ${endNode.x + 10}, ${startNode.y + (startNode.x - endNode.x) / 4}`);
              points = points.concat(` ${endNode.x + 10}, ${endNode.y}`);
            } else if (startNode.x > endNode.x) {
              points = points.concat(` ${startNode.x - (startNode.x - endNode.x) / 2}, ${startNode.y}`);
              points = points.concat(` ${startNode.x - (startNode.x - endNode.x) / 2}, ${endNode.y}`);
            }
          }
          points = points.concat(` ${endNode.x + 4}, ${endNode.y}`);
        }

        wires.push(
          <svg key={uuid}>
            <polyline strokeWidth="2" stroke="black" fill="none" points={points}/>
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
