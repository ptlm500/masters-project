import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

import LogicGate from '../logic/LogicGate/LogicGate';
import ANDGate from '../logic/ANDGate/ANDGate';
import ORGate from '../logic/ORGate/ORGate';
import XORGate from '../logic/XORGate/XORGate';
import ToggleSwitch from '../input/ToggleSwitch/ToggleSwitch';
import LED from '../output/LED/LED';

class DraggableComponent extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponent: PropTypes.object.isRequired,
    moveComponent: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
    dragEnter: PropTypes.func.isRequired,
  };

  onMouseDown(e) {
    e.stopPropagation();
    this.props.selectComponent(this.props.uuid);
    this.props.moveComponent(
      e,
      this.props.uuid,
      'component',
    );
  }

  renderComponent() {
    switch (this.props.component.get('type')) {
      case 'ANDGate':
        return (
          <LogicGate
            uuid={this.props.uuid}
            gateType={ANDGate}
            component={this.props.component}
            selectedComponent={this.props.selectedComponent}
          />
        );
      case 'ORGate':
        return (
          <LogicGate
            uuid={this.props.uuid}
            gateType={ORGate}
            component={this.props.component}
            selectedComponent={this.props.selectedComponent}
          />
        );
      case 'XORGate':
        return (
          <LogicGate
            uuid={this.props.uuid}
            gateType={XORGate}
            component={this.props.component}
            selectedComponent={this.props.selectedComponent}
          />
        );
      case 'ToggleSwitch':
        return (
          <ToggleSwitch
            uuid={this.props.uuid}
            component={this.props.component}
            selectedComponent={this.props.selectedComponent}
          />
        );
      case 'LED':
        return (
          <LED
            uuid={this.props.uuid}
            component={this.props.component}
            selectedComponent={this.props.selectedComponent}
          />
        )
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
