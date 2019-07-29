export default class Scroller {
	#vm;
	
	constructor(classNameW, classNameC, options, $vm) {
		this.classNameW = classNameW
		this.classNameC = classNameC
		
		this.moved = false
		this.position = {
			top: 0,
			left: 0
		}
		
		this.#vm = $vm
	}
	
	init () {
		// this.transfer = new Transfer()
		// this.scrollBehaviorX = new Behavior(this.classNameW, this.classNameC, this.options)
		// this.scrollBehaviorY = new Behavior(this.classNameW, this.classNameC, this.options)
		// 
		// this.actions = new ScrollerActions(
		// 	this.transfer
		// 	this.scrollBehaviorX,
		// 	this.scrollBehaviorY,
		// 	this.options
		// )
	}

	getPosition() {
		const {top, left} = this.position
		return {top, left}
	}
	
	/*
	-------------------------------------------------------
		TOUCH EVENT
	-------------------------------------------------------
	*/

	doTouchStart(e) {
		const touch = e.touches[0]
		const timestamp = +new Date()
		
		this.startX = touch.pageX
		this.startY = touch.pageY
		this.startTime = timestamp		
	}

	doTouchMove(e, cb) {
		let touch = e.touches[0]
		let endx = e.changedTouches[0].pageX
		let endy = e.changedTouches[0].pageY
		
		let deltaX = endx - this.startX
		let deltaY = endy - this.startY
		
		console.log(deltaX, deltaY)
	}

	doTouchEnd(e) {
		let endy = e.changedTouches[0].pageY
		// this.position.top += endy - this.startY
	}
	
	/*
	-------------------------------------------------------
		TOUCH HANDLER
	-------------------------------------------------------
	*/
	handleStart () {
		
	}
	
	handlerMove () {
		
	}
	
	handlerEnd () {
		
	}

	momentum(current, start, time) {
		
	}

	refresh() {
		
	}
	
	updatePosition(pos) {
		
	}
}

