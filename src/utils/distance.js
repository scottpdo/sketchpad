import Point from '../shapes/point';

export default function distance(p1, p2) {
	console.assert(p1 instanceof Point && p2 instanceof Point);
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}