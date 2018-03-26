import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Immutable from 'immutable';
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
    selectedComponents: PropTypes.object.isRequired,
    activeTab: PropTypes.object.isRequired,
    move: PropTypes.func.isRequired,
    updateWire: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
    selectWire: PropTypes.func.isRequired,
    addComponent: PropTypes.func.isRequired,
    setDraggingComponent: PropTypes.func.isRequired,
    updateSelectionBox: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.startComponentDrag = this.startComponentDrag.bind(this);
  }

  onMouseDown(e) {
    // Clear all selected components and wires
    this.props.selectComponent();
    this.props.selectWire();

    let point = this.grid.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.grid.getScreenCTM().inverse());

    this.props.updateSelectionBox({
      sX: point.x,
      sY: point.y,
    });

    const mousemove = moveEvent => {
      moveEvent.preventDefault();
      point.x = moveEvent.clientX;
      point.y = moveEvent.clientY;
      const cursor = point.matrixTransform(this.grid.getScreenCTM().inverse());

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
      let point = this.grid.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(this.grid.getScreenCTM().inverse());

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
    e.preventDefault();
    // Create reference point on grid
    let point = this.grid.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.grid.getScreenCTM().inverse());

    if (type !== 'vertex') {
      // Set quantise scale
      const qScale = 2;

      let dragOffsets = Immutable.Map({});
      let { selectedComponents } = this.props;

      // If a single component is selected, ignore store state and use directly passed uuid
      if (selectedComponents.size <= 1 && uuid) {
        selectedComponents = Immutable.Set([uuid]);
      }

      selectedComponents.forEach(componentUuid => {
        // Calculate drag offsets for all selected components
        dragOffsets = dragOffsets.setIn(
          [componentUuid, 'x'],
          point.x - this.props.components.getIn([componentUuid, 'x']),
        );
        dragOffsets = dragOffsets.setIn(
          [componentUuid, 'y'],
          point.y - this.props.components.getIn([componentUuid, 'y']),
        );
      });

      const mousemove = moveEvent => {
        moveEvent.preventDefault();
        const mousePoint = point;
        mousePoint.x = moveEvent.clientX;
        mousePoint.y = moveEvent.clientY;
        const cursor = mousePoint.matrixTransform(
          this.grid.getScreenCTM().inverse(),
        );
        // Iterate over all selected components
        selectedComponents.forEach(componentUuid => {
          const cX =
            Math.ceil(
              (cursor.x - dragOffsets.getIn([componentUuid, 'x'])) / qScale,
            ) * qScale;
          const cY =
            Math.ceil(
              (cursor.y - dragOffsets.getIn([componentUuid, 'y'])) / qScale,
            ) * qScale;

          if (
            cX > 0 &&
            cY > 0 &&
            cX < this.grid.getBoundingClientRect().right &&
            cY < this.grid.getBoundingClientRect().bottom
          ) {
            let newComponent = this.props.components.get(componentUuid);
            newComponent = newComponent.set('x', cX);
            newComponent = newComponent.set('y', cY);
            // Call reducer for component move
            this.props.move(componentUuid, newComponent, type, vertexId);
            // Call wire updater
            this.updateWires(newComponent);
          }
        });
      };

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    } else {
      this.startVertexDrag(e, uuid, type, vertexId, point);
    }
  }

  startVertexDrag(e, uuid, type, vertexId, point) {
    const vertex = this.props.wires.getIn([uuid, 'points', vertexId]);
    // Set quantise scale
    const qScale = 1;

    const dragOffset = {
      x: point.x - vertex.get('x'),
      y: point.y - vertex.get('y'),
    };

    const mousemove = moveEvent => {
      moveEvent.preventDefault();
      const mousePoint = point;
      mousePoint.x = moveEvent.clientX;
      mousePoint.y = moveEvent.clientY;
      const cursor = mousePoint.matrixTransform(this.grid.getScreenCTM().inverse());

      const cX = Math.ceil((cursor.x - dragOffset.x) / qScale) * qScale;
      const cY = Math.ceil((cursor.y - dragOffset.y) / qScale) * qScale;

      if (
        cursor.x > 0 &&
        cursor.y > 0 &&
        cursor.x < this.grid.getBoundingClientRect().right &&
        cursor.y < this.grid.getBoundingClientRect().bottom
      ) {
        let newVertex = vertex.set('x', cX);
        newVertex = newVertex.set('y', cY);
        // Call reducer for component move
        this.props.move(uuid, newVertex, type, vertexId);
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
    const path = this.props.activeTab.get('path');
    const componentsAtPath = path ? this.props.components.getIn(path.concat(['components'])) : this.props.components;
    const components = [];

    componentsAtPath.forEach((component, uuid) => {
      components.push(
        <DraggableComponentContainer
          key={uuid}
          uuid={uuid}
          component={component}
          moveComponent={this.startComponentDrag}
        />,
      );
    });

    return components;
  }

  renderWires() {
    const path = this.props.activeTab.get('path');
    const wiresAtPath = path ? this.props.components.getIn(path.concat(['wires'])) : this.props.wires;
    const wires = [];

    wiresAtPath.forEach((wire, uuid) => {
      if (wire.get('points'))
        wires.push(
          <WireContainer
            key={uuid}
            uuid={uuid}
            parents={this.props.activeTab.get('componentParents')}
            moveVertex={this.startComponentDrag}
          />,
        );
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
        ref={grid => (this.grid = grid)}
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
