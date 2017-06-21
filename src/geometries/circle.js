import Point from './point';
import distance from '../utils/distance';

export default class Circle extends Point {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
  }

  update(e) {
    // set new radius distance between cursor and center
    this.r = distance(e, this);
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