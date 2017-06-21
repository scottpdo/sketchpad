import Point from './point';
import distance from '../utils/distance';
import angle from '../utils/angle';

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
    if (Math.abs(distance(pt, this) - this.r) < 12) {
      const a = angle(pt, this);
      let d = new Point(pt.x - this.x, pt.y - this.y);
      let m = distance(d, new Point());
      d.x *= 12 / m;
      d.y *= 12 / m;
      return new Point(this.x + d.x, this.y + d.y);
    }
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