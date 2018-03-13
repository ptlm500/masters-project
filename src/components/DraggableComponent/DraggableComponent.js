import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DraggableComponent.css';

import LogicGate from '../logic/LogicGate/LogicGate';
import ANDGate from '../logic/ANDGate/ANDGate';
import ORGate from '../logic/ORGate/ORGate';
import XORGate from '../logic/XORGate/XORGate';
import NANDGate from '../logic/NANDGate/NANDGate';
import NORGate from '../logic/NORGate/NORGate';
import XNORGate from '../logic/XNORGate/XNORGate';
import ToggleSwitch from '../input/ToggleSwitch/ToggleSwitch';
import LED from '../output/LED/LED';
import ComponentBlock from '../ComponentBlock/ComponentBlock';

class DraggableComponent extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    component: PropTypes.object.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    moveComponent: PropTypes.func.isRequired,
    selectComponent: PropTypes.func.isRequired,
    deleteComponent: PropTypes.func.isRequired,
    deleteWire: PropTypes.func.isRequired,
    parents: PropTypes.array,
    hidden: PropTypes.bool,
  };

  constructor() {
    super();

    this.keyDown = this.keyDown.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
  }

  onMouseDown(e) {
    e.stopPropagation();
    if (!this.isSelectedComponent()) {
      this.props.selectComponent();
    }
    this.props.moveComponent(
      e,
      this.props.uuid,
      'component',
    );
  }

  isSelectedComponent() {
    return this.props.selectedComponents.includes(this.props.uuid);
  }

  keyDown(e) {
    console.log(e);
    if (this.isSelectedComponent() && (e.key === 'Delete' || e.key === 'Backspace')) {
      this.props.component.get('nodes').forEach(node => {
        if (node.get('connections').size !== 0) {
          node.get('connections').forEach(connection => {
            this.props.deleteWire(connection);
          });
        }
      });
      this.props.deleteComponent();
    }
  }

  renderComponent() {
    switch (this.props.component.get('type')) {
      case 'ANDGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={ANDGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'ORGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={ORGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'XORGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={XORGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'NANDGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={NANDGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'NORGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={NORGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'XNORGate':
        return (
          <LogicGate
            hidden={this.props.hidden}
            uuid={this.props.uuid}
            gateType={XNORGate}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      case 'ToggleSwitch':
        return (
          <ToggleSwitch
            uuid={this.props.uuid}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
          />
        );
      case 'LED':
        return (
          <LED
            uuid={this.props.uuid}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
          />
        );
      case 'ComponentBlock':
        return (
          <ComponentBlock
            uuid={this.props.uuid}
            component={this.props.component}
            selectedComponents={this.props.selectedComponents}
            parents={this.props.parents}
          />
        );
      default:
        return null;
    }
  }

  render() {
    if (this.isSelectedComponent()) {
      document.addEventListener('keydown', this.keyDown);
    }
    return (
      <svg
        x={this.props.component.get('x')}
        y={this.props.component.get('y')}
        onMouseDown={e => this.onMouseDown(e)}
        onKeyDown={e => this.keyDown(e)}
      >
       {this.renderComponent()}
      </svg>
    );
  }
}

DraggableComponent.defaultProps = {
  parents: [],
  hidden: false,
};

export default withStyles(s)(DraggableComponent);
