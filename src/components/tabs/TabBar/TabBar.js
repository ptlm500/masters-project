import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TabBar.css';

import Tab from '../Tab/Tab';

class TabBar extends React.Component {
  static propTypes = {
    tabs: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
  };

  renderTabs() {
    const tabs = [];

    if (this.props.tabs) {
      this.props.tabs.forEach((tab, tabId) => {
        tabs.push(
          <Tab tabName={tab.get('name')} tab={tab} activeTab={this.props.activeTab} tabId={tabId}/>,
        );
      });
    }

    return tabs;
  }

  render() {
    return (
      <div className={s['tab-container']}>
        {this.renderTabs()}
      </div>
    )
  }
}

export default withStyles(s)(TabBar);
