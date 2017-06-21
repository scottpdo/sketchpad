export default function angle(pt1, pt2) {
	if (Math.abs(pt2.x - pt1.x) < 0.001) return 0.5 * Math.PI;
	return Math.atan((pt2.y - pt1.y) / (pt2.x - pt1.x));
}