import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Tab.css';

import {setViewContext} from '../../../store/actions';

class Tab extends React.Component {
  static propTypes = {
    tabId: PropTypes.string.isRequired,
    tabName: PropTypes.string.isRequired,
    tab: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.isActiveTab())
      this.props.dispatch(setViewContext(this.props.tab.get('path')));
  }

  isActiveTab() {
    return this.props.activeTab === this.props.tabId;
  }

  render() {
    const className =
      this.isActiveTab()
        ? s['tab-active']
        : s['tab-inactive'];

    return (
      <div key={this.props.tabName} className={className} onClick={this.onClick}>
        {this.props.tabName || this.props.tabId}
      </div>
    );
  }
}

const tabWithStyles = withStyles(s)(Tab)

export default connect()(tabWithStyles);
