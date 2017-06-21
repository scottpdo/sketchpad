import distance from '../utils/distance';

export default class Point {
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