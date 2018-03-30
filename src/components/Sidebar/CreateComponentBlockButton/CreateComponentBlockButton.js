import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateComponentBlockButton.css';
import { createUuid } from '../../../helpers';

class CreateComponentBlockButton extends React.Component {
  static propTypes = {
    selectedComponents: PropTypes.object.isRequired,
    parents: PropTypes.array,
    createComponentBlock: PropTypes.func.isRequired,
  };

  onClick() {
    this.props.createComponentBlock(createUuid(), this.props.parents);
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
    return(
      <div className={s['button']} onClick={() => this.onClick()}>
        Create component block
      </div>
    );
  }
}

CreateComponentBlockButton.defaultProps = {
  parents: [],
};

export default withStyles(s)(CreateComponentBlockButton);
