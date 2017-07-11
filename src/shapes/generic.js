import _ from 'lodash';

import Point from './point';
import Cursor from '../cursor';

export default class Generic extends Point {

	constructor(x, y, original) {
		super(x, y);
		this.original = original;
	}

	update(cursor, isFinal) {

		console.assert(cursor instanceof Cursor);
		console.assert(_.isBoolean(isFinal));

		const target = cursor.target();
		const dx = target.x - this.x;
		const dy = target.y - this.y;

		this.original.move(dx, dy);

		this.x += dx;
		this.y += dy;
	}
}
