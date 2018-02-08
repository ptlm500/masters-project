import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

import ANDGate from '../logic/ANDGate/ANDGate';
import ORGate from '../logic/ORGate/ORGate';

class DraggableComponent extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
    moveComponent: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
  };

  onMouseDown(e) {
    e.stopPropagation();
    this.props.selectComponent(this.props.uuid);
    this.props.moveComponent(e, this.props.uuid, this.props.component, 'component');
  }

  renderComponent() {
    switch (this.props.component.get('type')) {
      case 'ANDGate':
        return (
          <ANDGate uuid={this.props.uuid} component={this.props.component} selectedComponent={this.props.selectedComponent}/>
        );
      case 'ORGate':
        return (
          <ORGate uuid={this.props.uuid} component={this.props.component} selectedComponent={this.props.selectedComponent}/>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <svg
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        onMouseDown={e => this.onMouseDown(e)}
      >
       {this.renderComponent()}
      </svg>
    );
  }
}

export default withStyles(s)(DraggableComponent);
