import Point from './shapes/point';

export default class Cursor extends Point {

	on(pt) {
		this.at = pt;
	}

	off() {
		this.at = null;
	}

	/*
	 * Return a boolean that is true if the cursor is
	 * currently "at" a target point (near an endpoint or midpoint,
	 * for example).
	 */
	isOn() {
		return !!this.at;
	}

	target() {
		return this.at || new Point(this.x, this.y);
	}
}
