import Point from './shapes/point';

export default class Cursor extends Point {

	on(pt) {
		this.at = pt;
	}

	off() {
		this.at = null;
	}

	isOn() {
		return !!this.at;
	}

	target() {
		return this.at || new Point(this.x, this.y);
	}
}