import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateComponentBlockButton.css';
import { createUuid } from '../../../helpers';

class CreateComponentBlockButton extends React.Component {
  static propTypes = {
    selectedComponents: PropTypes.object.isRequired,
    createComponentBlock: PropTypes.func.isRequired,
  };

  onClick() {
    if (this.canCreateBlock()) {
      this.props.createComponentBlock(createUuid());
    }
  }

  canCreateBlock() {
    if (this.props.selectedComponents.size !== 0) {
      // if (
      //   this.props.selectedComponents.forEach(
      //     component => !component.get('type') === 'ToggleSwitch' || 'LED',
      //   )
      // )
        return true;
    }
    return false;
  }

  render() {
    const className = this.canCreateBlock() ? s.button : s['button-disabled'];

    return(
      <div className={className} onClick={() => this.onClick()}>
        Create component block
      </div>
    );
  }
}

export default withStyles(s)(CreateComponentBlockButton);
