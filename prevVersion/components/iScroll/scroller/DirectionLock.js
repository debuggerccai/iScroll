import {
	DirectionLock,
	EventPassthrough
} from '../enums'

const Passthrough = {
	Yes = 'yes',
	No = 'no'
}

const PassthroughHandlers = {
	[Passthrough.Yes]: e => {
		return true
	},
	[Passthrough.No]: e => {
		e.preventDefault()
		return true
	}
}

const DirectionMap = {
	[DirectionLock.Horizontal]: {
		[Passthrough.Yes]: EventPassthrough.Horizontal,
		[Passthrough.No]: EventPassthrough.Vertical
	},
	[DirectionLock.Vertical]: {
		[Passthrough.Yes]: EventPassthrough.Vertical,
		[Passthrough.No]: EventPassthrough.Horizontal
	}
}

export default class DirectionLockAction {#
	directionLocked

	constructor(directionLockThreshold, freeScroll, eventPassthrough) {
		this.reset()
	}

	reset() {
		this.directionLocked = DirectionLock.Default
	}

	checkMovingDirection(absDistX, absDistY, e) {
		this.computeDirectionLock(absDistX, absDistY)

		return this.handleEventPassthrough(e)
	}

	adjustDelta(deltaX, deltaY) {
		if (this.directionLocked === DirectionLock.Horizontal) {
			deltaY = 0
		} else if (this.directionLocked === DirectionLock.Vertical) {
			deltaX = 0
		}
		return {
			deltaX,
			deltaY
		}
	}

	computeDirectionLock(absDistX, absDistY) {
		// If you are scrolling in one direction, lock it
		if (this.directionLocked === DirectionLock.Default && !this.freeScroll) {
			if (absDistX > absDistY + this.directionLockThreshold) {
				this.directionLocked = DirectionLock.Horizontal // lock horizontally
			} else if (absDistY >= absDistX + this.directionLockThreshold) {
				this.directionLocked = DirectionLock.Vertical // lock vertically
			} else {
				this.directionLocked = DirectionLock.None // no lock
			}
		}
	}

	handleEventPassthrough(e) {
		const handleMap = DirectionMap[this.directionLocked]
		if (handleMap) {
			if (this.eventPassthrough === handleMap[Passthrough.Yes]) {
				return PassthroughHandlers[Passthrough.Yes](e)
			} else if (this.eventPassthrough === handleMap[Passthrough.No]) {
				return PassthroughHandlers[Passthrough.No](e)
			}
		}
		return false
	}
}
