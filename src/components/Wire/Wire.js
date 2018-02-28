import React from 'react';
import PropTypes from 'prop-types';

class Wire extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    wire: PropTypes.object.isRequired,
    wireState: PropTypes.number.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    selectComponent: PropTypes.func.isRequired,
    deleteWire: PropTypes.func.isRequired,
    moveVertex: PropTypes.func.isRequired,
    updateConnections: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.keyDown = this.keyDown.bind(this);
  }

  componentDidUpdate() {
    this.props.updateConnections(this.props.wireState);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
  }

  getPoints() {
    let points = '';

    this.props.wire.get('points').forEach(point => {
      points = points.concat(` ${point.get('x')}, ${point.get('y')}`);
    });

    return points;
  }

  getWireColour() {
    if (this.isSelectedComponent()) {
      return "blue";
    }

    return this.props.wireState === 0 ? 'black' : 'green';
  }

  isSelectedComponent() {
    return this.props.selectedComponents.includes(this.props.uuid);
  }

  selectWire(e) {
    e.stopPropagation();
    this.props.selectComponent(this.props.uuid);
  }

  keyDown(e) {
    console.log(e);
    if (this.isSelectedComponent() && (e.key === 'Delete' || e.key === 'Backspace')) {
      this.props.deleteWire(this.props.uuid);
    }
  }

  moveVertex(e, vertex, vertexId) {
    e.stopPropagation();
    this.props.moveVertex(e, this.props.uuid, 'vertex', vertexId);
  }

  renderVertices() {
    const vertices = [];
    const points = this.props.wire.get('points');
    for (let i = 1; i < points.size - 1; i += 1) {
      vertices.push(
        <circle
          key={i}
          onMouseDown={e => this.moveVertex(e, points.get(i), i)}
          cx={points.getIn([i, 'x'])}
          cy={points.getIn([i, 'y'])}
          r={2}
          fill="white"
          stroke="black"
          strokeWidth={2}
        />,
      );
    }

    return vertices;
  }

  render() {
    if (this.isSelectedComponent()) {
      document.addEventListener('keydown', this.keyDown);
    }

    return (
      <svg
        key={this.props.uuid}
        onMouseDown={e => this.selectWire(e)}
        onKeyDown={e => this.keyDown(e)}
      >
        <polyline
          strokeWidth="2"
          stroke={this.getWireColour()}
          fill="none"
          points={this.getPoints()}
        />
        {this.renderVertices()}
      </svg>
    );
  }
}

export default Wire;
