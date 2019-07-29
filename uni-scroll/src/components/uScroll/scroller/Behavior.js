import {
	Direction,
} from '../enums'

import {
	getRect
} from '../utils'

export default class Behavior {
	constructor(classNameW, classNameC, options) {
		this.classNameW = classNameW
		this.classNameC = classNameC
		this.options = options
		this.currentPos = 0
		this.startPos = 0

		this.refresh()
	}

	start() {
		this.direction = Direction.Default
		this.movingDirection = Direction.Default
		this.dist = 0
	}

	move(delta) {
		this.movingDirection =
			delta > 0 ?
			Direction.Negative :
			delta < 0 ?
			Direction.Positive :
			Direction.Default

		let newPos = this.currentPos + delta

		// Slow down or stop if outside of the boundaries
		if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
			if (
				(newPos > this.minScrollPos && this.options.bounces[0]) ||
				(newPos < this.maxScrollPos && this.options.bounces[1])
			) {
				newPos = this.currentPos + delta / 3
			} else {
				newPos = newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos
			}
		}
		
		return newPos
	}

	end(duration) {
		let momentumInfo = { duration: 0 }
		
		const absDist = Math.abs(this.currentPos - this.startPos)
	}

	momentum() {

	}

	updateDirection() {
		const absDist = Math.round(this.currentPos) - this.absStartPos
		this.direction =
			absDist > 0 ?
			Direction.Negative :
			absDist < 0 ?
			Direction.Positive :
			Direction.Default
	}

	async refresh() {
		const {
			size,
			position
		} = this.options.rect
		const threshold = this.options.pullDownRefresh.threshold

		const wrapperRect = await getRect(this.classNameW)
		this.wrapperSize = wrapperRect[size]

		const contentRect = await getRect(this.classNameC)
		this.contentSize = contentRect[size]

		this.relativeOffset = contentRect[position]

		this.minScrollPos = 0
		this.maxScrollPos = this.wrapperSize - this.contentSize

		if (this.maxScrollPos < 0) {
			this.maxScrollPos -= this.relativeOffset
		}
	}
	
	updatePosition(pos) {
		this.currentPos = pos
	}

	getAbsDist(delta) {
		this.dist += delta
		return Math.abs(this.dist)
	}

	getCurrentPos() {
		return Math.round(this.currentPos)
	}

	updateStartPos() {
		this.startPos = this.currentPos
	}
}
