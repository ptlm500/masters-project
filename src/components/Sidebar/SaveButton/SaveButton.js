import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './SaveButton.css';
import { saveState } from '../../../store/actions';

class SaveButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  onClick() {
    console.log('clicked');
    this.props.dispatch(saveState());
  }

  render() {
    return(
      <div className={s.button} onClick={() => this.onClick()}>
        Save
      </div>
    );
  }
}

const styledComponent = withStyles(s)(SaveButton);

export default connect()(styledComponent);
