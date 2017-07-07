import distance from '../utils/distance';

export default class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  update(cursor) {
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

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    context.stroke();
  }
}