import React from 'react';
import PropTypes from 'prop-types';
import XORGate from '../XORGate/XORGate';

class XNORGate extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(React.Component).isRequired,
  };

  render() {
    return (
      <g>
        <XORGate
          height={this.props.height}
          colour={this.props.colour}
          nodes={this.props.nodes}
        />
        <circle
          cx="54"
          cy={this.props.height / 2 + 1}
          r="4"
          stroke={this.props.colour}
          fill="white"
          strokeWidth="1"
        />
      </g>
    );
  }
}

export default XNORGate;
