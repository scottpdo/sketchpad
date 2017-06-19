import React, { Component } from 'react';
import _ from 'lodash';

class Canvas extends Component {

  constructor() {

    super();

    // mimic a slow refresh rate
    const refreshRate = 10;

    this.state = {
      t: 0
    };

    this.onResize = this.onResize.bind(this);

    this.update = _.throttle(
      this.update.bind(this),
      Math.round(1000 / refreshRate)
    );
  }

  onResize() {
    const canvas = this.refs.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  update(e) {

    let t = this.state.t;

    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    const randColor = () => Math.round((Math.random() * 255));
    const randRGB = () => 'rgb(' + randColor() + ',' + randColor() + ',' + randColor() + ')';

    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (e) {
      context.fillStyle = 'rgb(255, 255, 255)';
      context.beginPath();
      context.arc(e.x, e.y, 50, 0, 2 * Math.PI);
      context.fill();
    }

    t++;
    this.setState({ t });

  }

  componentDidMount() {

    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    this.onResize();
    this.update();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.update);
  }

  render() {
    return <canvas ref="canvas" />;
  }
}

export default Canvas;
