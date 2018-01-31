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
import { addComponent, moveComponent } from '../../store/actions';
// import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';
import GridContainer from '../../containers/GridContainer/GridContainer';

class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <GridContainer/>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
