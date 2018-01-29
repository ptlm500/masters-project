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
import { addComponent } from '../../store/actions';
import DraggableComponentContainer from '../../containers/DraggableComponentContainer/DraggableComponentContainer';

class Home extends React.Component {
  constructor() {
    super();
    this.state = { rect: { x: 5, y: 2 } };
  }
  // static propTypes = {
  // };

  startDrag(e) {
    // https://codepen.io/nasrullahs/pen/edwPyL
    e.preventDefault();
    let point = this.svg.createSVGPoint();
    let dragOffset = {};

    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM().inverse());

    dragOffset = {
      x: point.x - this.state.rect.x,
      y: point.y - this.state.rect.y,
    };

    const mousemove = (e) => {
      e.preventDefault();
      point.x = e.clientX;
      point.y = e.clientY;
      const cursor = point.matrixTransform(this.svg.getScreenCTM().inverse());
      this.setState({
        rect: {
          x: cursor.x - dragOffset.x,
          y: cursor.y - dragOffset.y,
        },
      });
    };

    const mouseup = (e) => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  placeShape(e) {
    console.log('Place shape')
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <svg
            viewBox="0 0 100 100"
            ref = {(svg) => this.svg = svg}
            onMouseDown={e => this.placeShape(e)}
          >

            <rect
              x={this.state.rect.x}
              y={this.state.rect.y}
              width="20"
              height="20"
              ref={e => (this.svgRectElem = e)}
              onMouseDown={e => this.startDrag(e)}
            />
          </svg>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
