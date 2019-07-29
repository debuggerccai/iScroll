import EventEmitter from './EventEmitter.js'

export default class ActionsHandler {
	#hooks;
	
	constructor(options) {
	    this.#hooks = new EventEmitter([
			'start',
			'move',
			'end'
		])
	}
}
