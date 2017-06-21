import distance from '../utils/distance';

export default class Line {
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