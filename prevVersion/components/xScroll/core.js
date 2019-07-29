import Behavior from './Behavior'
import createOptions from './createOptions'
import DirectionLockAction from './DirectionLock'

import {
	getRect
} from './utils'

import {
	Direction,
	DirectionLock,
	Probe
} from './enums'

export default class Scroller {
	#vm;
	constructor(classNameW, classNameC, options, $vm) {
		this.classNameW = classNameW
		this.classNameC = classNameC
		this.options = createOptions(options)
		
		this.#vm = $vm
		this.startTime = undefined
		this.endTime = undefined
		
		const {
			left = true, right = true, top = true, bottom = true
		} = this.options.bounce
		// direction X
		this.scrollBehaviorX = new Behavior(classNameW, classNameC, createOptions({
			pullDownRefresh: this.options.pullDownRefresh,
			bounces: [left, right],
			rect: {
				size: 'width',
				position: 'left'
			}
		}))
		// direction Y
		this.scrollBehaviorY = new Behavior(classNameW, classNameC, createOptions({
			pullDownRefresh: this.options.pullDownRefresh,
			bounces: [top, bottom],
			rect: {
				size: 'height',
				position: 'top'
			}
		}))

		this.directionLockAction = new DirectionLockAction(
			this.options.directionLockThreshold,
			this.options.freeScroll,
			this.options.eventPassthrough
		)
	}



	/*
	-------------------------------------------------------
		TOUCH EVENT
	-------------------------------------------------------
	*/
	doTouchStart(e) {
		const touch = e.touches[0]
		const timestamp = +new Date()

		this.pointX = touch.pageX
		this.pointY = touch.pageY
		
		this.handleStart(e)
	}

	doTouchMove(e) {
		let touch = e.touches[0]
		let point = e.changedTouches[0]
		let deltaX = point.pageX - this.pointX
		let deltaY = point.pageY - this.pointY
		this.pointX = point.pageX
		this.pointY = point.pageY

		this.handlerMove(deltaX, deltaY, e)
	}

	doTouchEnd(e) {
		this.handlerEnd(e)
	}

	/*
	-------------------------------------------------------
		TOUCH HANDLER
	-------------------------------------------------------
	*/
	handleStart(e) {
		const timestamp = +new Date()
		this.moved = false

		this.startTime = timestamp

		this.directionLockAction.reset()

		this.scrollBehaviorX.start()
		this.scrollBehaviorY.start()
	}

	handlerMove(deltaX, deltaY, e) {
		const absDistX = this.scrollBehaviorX.getAbsDist(deltaX)
		const absDistY = this.scrollBehaviorY.getAbsDist(deltaY)
		const timestamp = +new Date()

		if (this.checkMomentum(absDistX, absDistY, timestamp)) {
			return true
		}

		if (this.directionLockAction.checkoutMovingDirection(absDistX, absDistY, e)) {
			return true
		}

		const delta = this.directionLockAction.adjustDelta(deltaX, deltaY)

		const newX = this.scrollBehaviorX.move(delta.deltaX)
		const newY = this.scrollBehaviorY.move(delta.deltaY)

		this.#vm.scrollTo(newX, newY)
		this.updatePositions({x: newX, y: newY})

		this.dispatchScroll(timestamp)
	}

	dispatchScroll(timestamp) {
		if (timestamp - this.startTime > this.options.momentumLimitTime) {
			this.startTime = timestamp
			this.scrollBehaviorX.updateStartPos()
			this.scrollBehaviorY.updateStartPos()
			if (this.options.probeType === Probe.Throttle) {
				this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos())
			}
		}

		if (this.options.probeType > Probe.Throttle) {
			this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos())
		}
	}

	checkMomentum(absDistX, absDistY, timestamp) {
		return (
			timestamp - this.endTime > this.options.momentumLimitTime &&
			absDistY < this.options.momentumLimitDistance &&
			absDistX < this.options.momentumLimitDistance
		)
	}

	handlerEnd() {
		const {
			x,
			y
		} = this.getCurrentPos()
		
		this.scrollBehaviorX.updateDirection()
		this.scrollBehaviorY.updateDirection()

		this.#vm.scrollTo(x, y)
		this.updatePositions({x, y})
		
		this.endTime = +new Date()
		
		const duration = this.endTime - this.startTime
	}

	getCurrentPos() {
		return {
			x: this.scrollBehaviorX.getCurrentPos(),
			y: this.scrollBehaviorY.getCurrentPos()
		}
	}
	
	updatePositions(pos) {
		this.scrollBehaviorX.updatePosition(pos.x)
		this.scrollBehaviorY.updatePosition(pos.y)
	}

	/*
	-------------------------------------------------------
		EXEC PULL-DOWN && PULL-UP
	-------------------------------------------------------
	*/
	triggerPullToRefresh() {
		if (!this.options.pullDownRefresh) {
			return false
		}
	}

	finishPullToRefresh() {
		this.pulling = false
	}

	checkPullDown() {
		if (!this.options.pullDownRefresh) {
			return false
		}

		const {
			threshold = 90, stop = 40
		} = this.options.pullDownRefresh

		if (this.scroll.directionY !== Direction.Negative || this.scroll.Y < threshold) {
			return false
		}

		if (!this.pulling) {
			this.pulling = true

			this.scroll.trigger('pullingDown')
		}

		this.#vm.scrollTo(
			this.scroll.x,
			stop,
			this.scroll.options.bounceTime,
			'bounce'
		)

		return this.pulling
	}

	resize() {
		clearTimeout(this.resizeTimeout)

		this.resizeTimeout = setTimeout(() => {
			this.refresh()
		}, this.options.resizePolling)
	}

	refresh() {
		this.scrollBehaviorX.refresh()
		this.scrollBehaviorY.refresh()
	}
}
