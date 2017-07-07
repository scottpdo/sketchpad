import Point from './point';
import Generic from './generic';

import distance from '../utils/distance';

export default class Line {

  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  update(cursor, isFinal) {

    if (!isFinal || !cursor.isOn()) return this.p2.update(cursor.target());
    
    this.p2 = cursor.target();
  }

  move(dx, dy) {
    this.p1.move(dx, dy);
    this.p2.move(dx, dy);
  }

  near(pt) {

    const minDistance = 12;
    const p1 = this.p1;
    const p2 = this.p2;

    // is it near an end point?
    if (distance(pt, p1) < minDistance) return p1;
    if (distance(pt, p2) < minDistance) return p2;

    // parametrize line segment
    const f = (t) => {
      return new Point(
        p1.x + t * (p2.x - p1.x),
        p1.y + t * (p2.y - p1.y)
      );
    };

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const l2 = dx * dx + dy * dy; // distance squared
    if (l2 === 0) return null;

    // project point onto line segment to get closest point
    const t = ((pt.x - p1.x) * (p2.x - p1.x) + (pt.y - p1.y) * (p2.y - p1.y)) / l2;
    const closest = f(t);
    const d = distance(pt, closest);

    if (d < minDistance) {
      return new Generic(closest.x, closest.y, this);
    }

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