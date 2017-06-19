import React, { Component } from 'react';
import _ from 'lodash';

function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update(e) {
    this.x = e.x;
    this.y = e.y;
  }

  near(pt) {
    if (distance(pt, this) < 12) return this;
    return null;
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    context.stroke();
  }
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  update(e) {
    this.p2.update(e);
  }

  near(pt) {
    if (distance(pt, this.p1) < 12) return this.p1;
    if (distance(pt, this.p2) < 12) return this.p2;
    return null;
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
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

  near(pt) {
    // TODO?
    return null;
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
    const refreshRate = 30;

    this.state = {
      t: 0,
      drawing: false,
      moving: false,
      cursor: { x: 0, y: 0, at: null }
    };

    this.keys = {
      // CIRCLE
      67: cursor => {
        this.setState({ drawing: !this.state.drawing }, () => {

          if (!this.state.drawing) return this.activeObj = null; // finished drawing

          const pt = cursor.at || cursor;

          const circle = new Circle(pt.x, pt.y, 0);
          
          // set as active object and push to objects
          this.activeObj = circle;
          this.objects.push(circle);
        });
      },
      // LINE
      76: cursor => {
        this.setState({ drawing: !this.state.drawing }, () => {

          if (!this.state.drawing) return this.activeObj = null; // finished drawing

          const pt = cursor.at || new Point(cursor.x, cursor.y);

          const line = new Line(
            pt,
            new Point(pt.x, pt.y)
          );
          
          // set as active object and push to objects
          this.activeObj = line;
          this.objects.push(line);
        });
      },
      // MOVE
      77: cursor => {
        this.setState({ moving: !this.state.moving }, () => {

          // if finished moving, or if cursor is not `at` any point, we're done
          if (!this.state.moving || !cursor.at) return this.activeObj = null;

          this.objects.forEach(obj => {
            if (obj.near(cursor)) this.activeObj = obj.near(cursor);
          });
          
          if (this.activeObj) this.activeObj.update(cursor);
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
        cursor: { x: e.x, y: e.y, at: null }
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

      let center = e;
      this.objects.forEach(obj => {
        if (this.state.moving) return;
        if (obj.near(e)) {
          center = obj.near(e);
          this.setState({ 
            cursor: Object.assign(this.state.cursor, { at: center }) 
          });
        }
      });

      context.arc(center.x, center.y, 2, 0, 2 * Math.PI);
      context.fill();

      // update active object
      if (this.activeObj) this.activeObj.update(center);
    }

    // draw objects
    this.objects.forEach(obj => {
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
