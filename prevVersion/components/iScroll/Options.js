import {
	Probe,
	EventPassthrough
} from './enums'

export class Options {
	constructor() {
		this.startX = 0
		this.startY = 0
		this.scrollX = false
		this.scrollY = true
		this.freeScroll = false
		this.directionLockThreshold = 5
		this.eventPassthrough = EventPassthrough.None
		// this.click = false
		// this.dblclick = false
		// this.tap = ''

		this.bounce = {
			top: true,
			bottom: true,
			left: true,
			right: true
		}
		this.bounceTime = 800

		this.momentum = true
		this.momentumLimitTime = 300
		this.momentumLimitDistance = 15

		this.swipeTime = 2500
		this.swipeBounceTime = 500

		this.deceleration = 0.0015

		this.flickLimitTime = 200
		this.flickLimitDistance = 100

		this.resizePolling = 60
		this.probeType = Probe.Default

		this.stopPropagation = false
		this.preventDefault = true
		// this.preventDefaultException = {
		// 	tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
		// }

		this.HWCompositing = true
		this.useTransition = true

		// this.bindToWrapper = false
		// this.disableMouse = hasTouch
		// this.autoBlur = true
	}
	merge(options) {
		if (!options) return this
		for (let key in options) {
			this[key] = options[key]
		}
		return this
	}
}
