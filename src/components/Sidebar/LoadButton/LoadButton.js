import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './LoadButton.css';
import { loadState } from '../../../store/actions';

class LoadButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  // onFilesChange(files) {
  //   console.log(files);
  // }
  handleChange(e) {
    const reader = new FileReader();
    reader.onload = loadEvent => {
      let state;

      try {
        state = JSON.parse(loadEvent.target.result);
        this.props.dispatch(loadState(state));
      } catch (error) {
        console.error(`[LoadButton]: ${error}`);
      }
    }

    reader.readAsText(e.target.files[0]);
  }

  render() {
    return (
      <div className={s.wrapper}>
        <div className={s.button}>Load</div>
        <input
          className={s.input}
          type="file"
          accept=".json"
          onChange={e => this.handleChange(e)}
        />
      </div>
    );
  }
}

const styledComponent = withStyles(s)(LoadButton);

export default connect()(styledComponent);
