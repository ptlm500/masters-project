import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './LoadButton.css';
import { saveState } from '../../../store/actions';

class LoadButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  onClick() {
    console.log('clicked');
    this.props.dispatch(saveState());
  }

  render() {
    return(
      <div className={s['button']} onClick={() => this.onClick()}>
        Load
      </div>
    );
  }
}

const styledComponent = withStyles(s)(LoadButton);

export default connect()(styledComponent);
