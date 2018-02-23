import React from 'react';
import PropTypes from 'prop-types';
import ANDGate from '../ANDGate/ANDGate';

class NANDGate extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(React.Component).isRequired,
  };

  render() {
    return (
      <g>
        <ANDGate
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

export default NANDGate;
