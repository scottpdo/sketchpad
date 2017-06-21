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

  near(pt) {

    // is it near an end point?
    if (distance(pt, this.p1) < 15) return this.p1;
    if (distance(pt, this.p2) < 15) return this.p2;

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