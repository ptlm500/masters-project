import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

import Node from '../Node/Node';

class DraggableComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    component: PropTypes.object.isRequired,
    moveComponent: PropTypes.func.isRequired
  };

  render() {
    return(
      <svg
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        ref={e => (this.svgRectElem = e)}
        onMouseDown={e => (
          this.props.moveComponent(e, this.props.uuid, this.props.component))}
      >
        <g>
        <line x1="1" y1="5" x2="6" y2="5" stroke="black" strokeWidth={1}/>
        <line x1="1" y1="11" x2="6" y2="11" stroke="black" strokeWidth={1}/>
        <Node x="2" y="5" input={true}/>
        <Node x="2" y="11" input={true}/>
        <path d="M 6,2 L 6,14 l 3,0 c 8,0 8,-12 0,-12, Z" fill="white" stroke="black" strokeWidth={1}/>
        <line x1="15" y1="8" x2="20" y2="8" stroke="black" strokeWidth={1}/>
        <Node x="19" y="8" input={false}/>
        </g>
      </svg>
    );
  }
}

export default withStyles(s)(DraggableComponent);
