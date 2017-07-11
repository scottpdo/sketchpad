import _ from 'lodash';

import distance from '../utils/distance';

export default class Point {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  update(cursor, isFinal) {

    console.assert(_.isNumber(cursor.x) && _.isNumber(cursor.y));
    console.assert(_.isBoolean(isFinal));

    this.x = cursor.x;
    this.y = cursor.y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  near(pt) {
    if (distance(pt, this) < 12) return this;
    return null;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    context.stroke();
  }
}
