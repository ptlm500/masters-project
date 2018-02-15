import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.css';

class Sidebar extends React.Component {
  render() {
    return (
      <div className={s.root}>
      </div>
    );
  }
}

export default withStyles(s)(Sidebar);