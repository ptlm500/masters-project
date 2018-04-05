import React from 'react';
import PropTypes from 'prop-types';

class Wire extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    wire: PropTypes.object.isRequired,
    wireState: PropTypes.number.isRequired,
    selectedWires: PropTypes.object.isRequired,
    selectWire: PropTypes.func.isRequired,
    deleteWire: PropTypes.func.isRequired,
    moveVertex: PropTypes.func.isRequired,
    updateConnections: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
  };

  constructor() {
    super();

    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    this.updateWire();
  }

  componentDidUpdate() {
    this.updateWire();
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
    if (this.isSelectedWire()) {
      return "blue";
    }

    return this.props.wireState === 0 ? 'black' : 'green';
  }

  updateWire() {
    // Check if we need to update the wire and it's connections
    if (this.wireState !== this.props.wireState) {
      this.props.updateConnections(this.props.wireState);
      this.wireState = this.props.wireState;
    }
  }

  isSelectedWire() {
    return this.props.selectedWires.includes(this.props.uuid);
  }

  selectWire(e) {
    e.stopPropagation();
    this.props.selectWire(this.props.uuid);
  }

  keyDown(e) {
    console.log(e);
    if (this.isSelectedWire() && (e.key === 'Delete' || e.key === 'Backspace')) {
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
    if (this.props.hidden) {
      console.log('wire is hidden');
      return null;
    }

    if (this.isSelectedWire() && !this.keyListener) {
      document.addEventListener('keydown', this.keyDown);
      this.keyListener = true;
    } else if (!this.isSelectedWire() && this.keyListener) {
      document.removeEventListener('keydown', this.keyDown);
      this.keyListener = false;
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

Wire.defaultProps = {
  parents: [],
  hidden: false,
};

export default Wire;
