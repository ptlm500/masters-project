import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import WireContainer from '../../containers/WireContainer/WireContainer';
import { createUuid } from '../../helpers';
import s from './Grid.css';

class Grid extends React.Component {
  static propTypes = {
    components: PropTypes.object.isRequired,
    wires: PropTypes.object.isRequired,
    selectionBox: PropTypes.object.isRequired,
    draggingComponent: PropTypes.func,
    move: PropTypes.func.isRequired,
    updateWire: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
    addComponent: PropTypes.func.isRequired,
    setDraggingComponent: PropTypes.func.isRequired,
    updateSelectionBox: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.startComponentDrag = this.startComponentDrag.bind(this);
  }

  onMouseDown(e) {
    this.props.selectComponent();

    let point = this.svg.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM().inverse());

    this.props.updateSelectionBox({
      sX: point.x,
      sY: point.y,
    });

    const mousemove = moveEvent => {
      moveEvent.preventDefault();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const cursor = point.matrixTransform(this.svg.getScreenCTM().inverse());

      this.props.updateSelectionBox({
        eX: cursor.x,
        eY: cursor.y,
      });
    };

    const mouseup = () => {
      this.props.updateSelectionBox({
        sX: null,
        sY: null,
        eX: null,
        eY: null,
      });
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  onDrop(e) {
    e.preventDefault();
    if (this.props.draggingComponent) {
      // Initialize drop point
      let point = this.svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(this.svg.getScreenCTM().inverse());

      const componentUuid = createUuid();
      // Create component
      this.props.addComponent(
        componentUuid,
        this.props.draggingComponent(componentUuid, point.x, point.y, 2),
      );
      this.props.selectComponent(componentUuid, true);
      this.props.setDraggingComponent();
    }
  }

  startComponentDrag(e, uuid, type, vertexId) {
    let component = this.props.components.get(uuid);
    if (type === 'vertex') {
      component = this.props.wires.getIn([uuid, 'points', vertexId]);
    }
    e.preventDefault();
    // Set quantise scale
    const qScale = type === 'component' ? 2 : 1;

    let point = this.svg.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM().inverse());

    const dragOffset = {
      x: point.x - component.get('x'),
      y: point.y - component.get('y'),
    };

    const mousemove = moveEvent => {
      moveEvent.preventDefault();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const cursor = point.matrixTransform(this.svg.getScreenCTM().inverse());

      const cX = Math.ceil((cursor.x - dragOffset.x) / qScale) * qScale;
      const cY = Math.ceil((cursor.y - dragOffset.y) / qScale) * qScale;

      if (
        cursor.x > 0 &&
        cursor.y > 0 &&
        cursor.x < this.svg.getBoundingClientRect().right &&
        cursor.y < this.svg.getBoundingClientRect().bottom
      ) {
        let newComponent = component.set('x', cX);
        newComponent = newComponent.set('y', cY);
        // Call reducer for component move
        this.props.move(uuid, newComponent, type, vertexId);
        // If component is moving, call wire updater
        if (type === 'component') {
          this.updateWires(newComponent);
        }
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
      if (node.get('connections').size > 0) {
        node.get('connections').forEach(connection => {
          this.props.updateWire(connection);
        });
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

  renderSelectionBox() {
    const box = this.props.selectionBox;
    if (
      box &&
      box.get('sX') &&
      box.get('sY') &&
      box.get('eX') &&
      box.get('eY')
    ) {
      return (
        <polygon
          points={`${box.get('sX')} ${box.get('sY')}
                    ${box.get('eX')} ${box.get('sY')}
                    ${box.get('eX')} ${box.get('eY')}
                    ${box.get('sX')} ${box.get('eY')}`}
          fill="blue"
          opacity="0.3"
        />
      );
    }

    return null;
  }

  render() {
    return (
      <svg
        className={s.svg}
        ref={svg => (this.svg = svg)}
        onMouseDown={e => this.onMouseDown(e)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => this.onDrop(e)}
      >
        {this.renderComponents()}
        {this.renderWires()}
        {this.renderSelectionBox()}
      </svg>
    );
  }
}

Grid.defaultProps = {
  draggingComponent: null,
};

export default withStyles(s)(Grid);
