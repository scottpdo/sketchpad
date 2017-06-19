import React, { Component } from 'react';
import _ from 'lodash';

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  update(e) {
    this.x2 = e.x;
    this.y2 = e.y;
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.stroke();
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  update(e) {
    const dx = e.x - this.x;
    const dy = e.y - this.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    this.r = r;
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.stroke();
  }
}

class Canvas extends Component {

  constructor() {

    super();

    // mimic a slow refresh rate
    const refreshRate = 10;

    this.state = {
      t: 0,
      drawing: false,
      cursor: { x: 0, y: 0 }
    };

    this.keys = {
      // CIRCLE
      67: e => {
        this.setState({ drawing: !this.state.drawing }, () => {

          if (!this.state.drawing) return this.activeObj = null; // finished drawing

          let circle = new Circle(e.x, e.y, 0);
          
          // set as active object and push to objects
          this.activeObj = circle;
          this.objects.push(circle);
        });
      },
      // LINE
      76: e => {
        this.setState({ drawing: !this.state.drawing }, () => {

          if (!this.state.drawing) return this.activeObj = null; // finished drawing

          let line = new Line(e.x, e.y, e.x, e.y);
          
          // set as active object and push to objects
          this.activeObj = line;
          this.objects.push(line);
        });
      }
    };

    this.activeObj = null;
    this.objects = [];

    this.onResize = this.onResize.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

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

  onKeyUp(e) {
    if (this.keys[e.keyCode]) this.keys[e.keyCode](this.state.cursor);
  }

  update(e) {

    let t = this.state.t;

    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (e) {

      this.setState({
        cursor: { x: e.x, y: e.y }
      });

      context.strokeStyle = 'rgb(255, 255, 255)';
      context.lineWidth = 2;

      context.beginPath();

      // left
      context.moveTo(e.x - 20, e.y);
      context.lineTo(e.x - 5, e.y);
      // right
      context.moveTo(e.x + 5, e.y);
      context.lineTo(e.x + 20, e.y);
      // top
      context.moveTo(e.x, e.y + 5);
      context.lineTo(e.x, e.y + 20);
      // bottom
      context.moveTo(e.x, e.y - 5);
      context.lineTo(e.x, e.y - 20);

      context.stroke();

      context.lineWidth = 0;
      context.fillStyle = 'rgb(255, 255, 255)';

      context.beginPath();
      context.arc(e.x, e.y, 2, 0, 2 * Math.PI);
      context.fill();
    }

    // update active object
    if (this.activeObj) this.activeObj.update(e);

    // draw objects
    this.objects.forEach((obj) => {
      obj.draw(context);
    });

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
    window.addEventListener('keyup', this.onKeyUp);
  }

  render() {
    return <canvas ref="canvas" />;
  }
}

export default Canvas;
