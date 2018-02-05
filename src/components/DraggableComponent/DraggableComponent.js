import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';
import { STROKE_WIDTH, NODE_RADIUS, LEG_LENGTH, NODE_OFFSET } from '../componentConstants';

import NodeContainer from '../../containers/NodeContainer/NodeContainer';

class DraggableComponent extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.shape({}).isRequired,
    moveComponent: PropTypes.func.isRequired
  };

  setComponentDimensions(nodeCount) {
    this.componentHeight = nodeCount * 10;
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
          <NodeContainer
            x={NODE_OFFSET}
            y={6}
            uuid={`${this.props.uuid}_1`}
          />
          <NodeContainer
            x={NODE_OFFSET}
            y={25}
            uuid={`${this.props.uuid}_2`}
          />
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
          <NodeContainer
            x={40 + LEG_LENGTH - NODE_OFFSET}
            y={this.componentHeight / 2 + STROKE_WIDTH / 2}
            uuid={`${this.props.uuid}_3`}
          />
        </g>
      </svg>
    );
  }
}

export default withStyles(s)(DraggableComponent);
