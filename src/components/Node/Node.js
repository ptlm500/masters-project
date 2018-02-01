import React from 'react'
import PropTypes from 'prop-types';


class Node extends React.Component {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    input: PropTypes.bool.isRequired
  }

  render() {
    return(
      <circle
        cx={this.props.x}
        cy={this.props.y}
        r="1"
        stroke="black"
        strokeWidth="1"
      />
    );
  }
}

export default Node;
