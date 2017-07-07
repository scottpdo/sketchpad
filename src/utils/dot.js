import Point from '../shapes/point';

export default function dot(p1, p2) {
	console.assert(p1 instanceof Point && p2 instanceof Point);
	return p1.x * p2.x + p1.y * p2.y;
}