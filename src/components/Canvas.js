import React, { Component } from 'react';
import _ from 'lodash';

import Point from '../shapes/point';
import Generic from '../shapes/generic';
import Line from '../shapes/line';
import Circle from '../shapes/circle';

import Cursor from '../cursor';

class Canvas extends Component {

  constructor() {

    super();

    // mimic a slow refresh rate
    const refreshRate = 12;

    this.state = {
      t: 0,
      isMouseDown: false,
      action: "",
      cursor: new Cursor()
    };

    this.keys = {
      67: "CIRCLE",
      76: "LINE",
      77: "MOVE",
      80: "COPY",
      88: "DELETE",
    };

    this.commands = {

      CIRCLE: cursor => {

        // only begin if mouse is down
        if (!this.state.isMouseDown) return;
        // only begin if not already drawing
        if (this.state.action === "drawing") return;

        this.toggleAction("drawing", () => {

          const pt = cursor.target();

          const circle = new Circle(pt.x, pt.y, 0);

          // set as active object and push to objects
          this.activeObj = circle;
          this.objects.push(circle);
        });
      },

      LINE: cursor => {

        // only begin if mouse is down
        if (!this.state.isMouseDown) return;
        // only begin if not already drawing
        if (this.is("drawing")) return;

        this.toggleAction("drawing", () => {

          if (!this.is("drawing")) return this.cancel(cursor); // finished drawing

          const pt = cursor.target();

          const line = new Line(
            pt,
            new Point(pt.x, pt.y)
          );

          // set as active object and push to objects
          this.activeObj = line;
          this.objects.push(line);
        });
      },

      MOVE: cursor => {
        if (!this.state.isMouseDown) return;
        this.toggleAction("moving", () => {

          // if finished moving, or if cursor is not `at` any point, we're done
          if (!this.is("moving") || !cursor.isOn()) return this.cancel(cursor);

          this.objects.forEach(obj => {
            const near = obj.near(cursor);
            if (!near) return;

            this.activeObj = obj.near(cursor);
          });

          if (this.activeObj) this.activeObj.update(cursor, false);
        });
      },

      COPY: cursor => {
        // only begin if mouse is down
        if (!this.state.isMouseDown) return;
        this.toggleAction("moving", () => {

          // if finished moving, we're done
          if (!this.is("moving")) return this.cancel(cursor);

          this.objects.forEach(obj => {
            const near = obj.near(cursor);
            if (!near) return;

            this.activeObj = obj.near(cursor);
          });

          // if we found an object, copy it
          if (this.activeObj) {

            const copy = this.activeObj.original.clone();

            const genericCopy = new Generic(
              cursor.target().x,
              cursor.target().y,
              copy
            );

            this.objects.push(copy);
            this.activeObj = genericCopy;
          }
        });
      },

      DELETE: cursor => {
        if (this.is("moving") || this.is("drawing")) return;
        if (!this.state.isMouseDown) return;
        this.objects = this.objects.filter(obj => !obj.near(cursor));
        this.cancel(cursor);
      }
    };

    this.activeObj = null;
    this.objects = [];

    this.onResize = this.onResize.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.update = _.throttle(
      this.update.bind(this),
      Math.round(1000 / refreshRate)
    );
  }

  /*
   * If the given action is the current state action, turn it off.
   * Otherwise, set it to be the new state action.
   */
  toggleAction(action, callback) {
    const currentAction = this.state.action;
    this.setState({
      action: (action !== currentAction) ? action : ""
    }, callback || _.noop);
  }

  /*
   * Evaluate the current action.
   */
  is(action) {
    if (_.isNil(action)) return this.state.action;
    return this.state.action === action;
  }

  cancel(e) {
    this.update(e, true); // update once more (final)
    this.toggleAction("");
    this.activeObj = null;
  }

  onResize() {
    const canvas = this.refs.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  onKeyUp(e) {
    if (this.keys[e.keyCode]) {
      const command = this.keys[e.keyCode];
      this.commands[command](this.state.cursor);
    }
  }

  onMouseDown(e) {
    this.setState({ isMouseDown: true });
    this.update(e, false);
  }

  onMouseUp(e) {
    this.setState({ isMouseDown: false });
    this.cancel(e);
  }

  update(e, isFinal) {

    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    // draw black background
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // move cursor position
    this.state.cursor.off();
    this.state.cursor.update(e, false);

    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;

    context.beginPath();

    // draw crosshairs
    if (this.state.isMouseDown) {
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
    }

    // determine if cursor is `near` any object
    this.objects.forEach(obj => {

      if (this.is("moving")) return;

      // don't count activeObj among objects that cursor could be near
      // (it's probably near it already)
      if (obj === this.activeObj) return;

      // if cursor is near an object, put it `on` that object
      const near = obj.near(this.state.cursor.target());
      if (!near) return;

      this.state.cursor.on(near);
    });

    // draw center of cursor target (might not be where mouse is)
    const center = this.state.cursor.target();

    context.lineWidth = 0;
    context.fillStyle = 'rgb(255, 255, 255)';

    context.beginPath();

    context.arc(center.x, center.y, 2, 0, 2 * Math.PI);
    context.fill();

    // update active object, if it exists
    if (this.activeObj) {
      this.activeObj.update(this.state.cursor, isFinal);
    }

    // draw objects
    this.objects.forEach(obj => obj.draw(context));
  }

  componentDidMount() {

    const canvas = this.refs.canvas;
    const context = canvas.getContext('2d');

    this.onResize();

    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', e => this.update(e, false));
    window.addEventListener('keyup', this.onKeyUp);

    this.refs.canvas.addEventListener('mousedown', this.onMouseDown);
    this.refs.canvas.addEventListener('mouseup', this.onMouseUp);
  }

  render() {
    return <canvas ref="canvas" />;
  }
}

export default Canvas;
