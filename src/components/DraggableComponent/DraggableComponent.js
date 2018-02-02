import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';
import { STROKE_WIDTH, NODE_RADIUS, LEG_LENGTH, LEG_SPACING } from '../componentConstants';

import Node from '../Node/Node';

class DraggableComponent extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.shape({}).isRequired,
    moveComponent: PropTypes.func.isRequired
  };

  setComponentDimensions(nodeCount) {
    this.componentHeight = nodeCount * 10;
    this.nodeOffset = NODE_RADIUS + STROKE_WIDTH / 2;
  }

  render() {
    this.setComponentDimensions(this.props.component.get('nodes').size);
    return (
      <svg
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        onMouseDown={e =>
          this.props.moveComponent(e, this.props.uuid, this.props.component)
        }
      >
        <g>
          <line
            x1={NODE_RADIUS * 2}
            y1="6"
            x2={LEG_LENGTH}
            y2="6"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={NODE_RADIUS * 2}
            y1="25"
            x2={LEG_LENGTH}
            y2="25"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
          />
          <Node x={this.nodeOffset} y="6" input />
          <Node x={this.nodeOffset} y="25" input />
          <path
            d={
              `M ${LEG_LENGTH},2
              L ${LEG_LENGTH},${this.componentHeight}
              l 8,0
              c 16,0 16,-28 0,-28,
              Z`}
            fill="white"
            stroke="black"
            strokeWidth={2}
          />
          <line
            x1="40"
            y1={this.componentHeight / 2 + STROKE_WIDTH / 2}
            x2={40 + LEG_LENGTH - NODE_RADIUS * 2}
            y2={this.componentHeight / 2 + STROKE_WIDTH / 2}
            stroke="black"
            strokeWidth={STROKE_WIDTH}
          />
          <Node
            x={40 + LEG_LENGTH - this.nodeOffset}
            y={this.componentHeight / 2 + STROKE_WIDTH / 2}
            input={false}
          />
        </g>
      </svg>
    );
  }
}

export default withStyles(s)(DraggableComponent);
