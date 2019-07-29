import EventEmitter from '../base/EventEmitter'

export default class ScrollerActions {
	constructor(transfer, scrollBehaviorX, scrollBehaviorY, options) {
		this.transfer = transfer
		this.scrollBehaviorX = scrollBehaviorX
		this.scrollBehaviorY = scrollBehaviorY
		this.options = options

		this.enabled = true

		this.bindActionsHandler()
	}

	bindActionsHandler() {
		this.transfer.hooks.on('start', (e) => {
			if (!this.enabled) return true
			return this.handleStart(e)
		})

		this.transfer.hooks.on('move', (deltaX, deltaY, e) => {
			if (!this.enabled) return true
			this.handleMove(deltaX, deltaY, e)
		})

		thhis.transfer.hooks.on('end', (e) => {
			if (!this.enabled) return true
			return this.handleEnd(e)
		})
	}

	handleStart(e) {
		const timestamp = +new Date()
		this.moved = false

		this.startTime = timestamp

		this.scrollBehaviorX.start()
		this.scrollBehaviorY.start()
		
		this.transfer.hooks.trigger('stop')
	}

	handleMove(deltaX, deltaY, e) {
		const timestamp = +new Date()
		const absDistX = this.scrollBehaviorX.getAbsDist(deltaX)
		const absDistY = this.scrollBehaviorY.getAbsDist(deltaY)

		if (this.checkMomentum(absDistX, absDistY, timestamp)) {
			return true
		}

		if (this.directionLockAction.checkMovingDirection(absDistX, absDistY, e)) {
			this.transfer.setInitiated()
			return true
		}
	}

	checkMomentum(absDistX, absDistY, timestamp) {
		return (
			timestamp - this.endTime > this.options.momentumLimitTime &&
			absDistY < this.options.momentumLimitDistance &&
			absDistX < this.options.momentumLimitDistance
		)
	}

	handleEnd(e) {

	}

	adjustDelta(deltaX, deltaY) {
		if (!this.options.scrollX) {
			deltaX = 0
		}
		if (!this.options.scrollY) {
			deltaY = 0
		}
		return {
			deltaX,
			deltaY
		}
	}
}
