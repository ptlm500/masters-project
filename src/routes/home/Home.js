/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
// import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import GridContainer from '../../containers/GridContainer/GridContainer';
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer';
import TabBarContainer from '../../containers/TabBarContainer/TabBarContainer';

class Home extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <SidebarContainer />
        <div className={s.container}>
          <TabBarContainer/>
          <div className={s['grid-container']}>
            <GridContainer/>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
