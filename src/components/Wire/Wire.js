import React from 'react';
import PropTypes from 'prop-types';

class Wire extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    wire: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
    selectComponent: PropTypes.func.isRequired,
    deleteWire: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.keyDown = this.keyDown.bind(this);
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

    return "black";
  }

  isSelectedComponent() {
    return this.props.selectedComponent.get('uuid') === this.props.uuid;
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

  render() {
    if (this.isSelectedComponent()) {
      document.addEventListener('keydown', this.keyDown);
    } else {
      document.removeEventListener('keydown', this.keyDown);
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
      </svg>
    );
  }
}

export default Wire;
