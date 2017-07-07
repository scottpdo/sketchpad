import Point from './point';
import Generic from './generic';
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

    const minDistance = 12;
    
    if (Math.abs(distance(pt, this) - this.r) > minDistance) return null;
    
    let d = new Point(pt.x - this.x, pt.y - this.y);
    let m = distance(d, new Point());
    d.x *= this.r / m;
    d.y *= this.r / m;
    d.x = Math.round(d.x);
    d.y = Math.round(d.y);

    return new Generic(this.x + d.x, this.y + d.y, this);
  }

  draw(context) {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.stroke();
  }
}