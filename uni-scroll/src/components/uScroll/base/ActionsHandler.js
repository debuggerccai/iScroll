import EventEmitter from './EventEmitter.js'

export default class ActionsHandler {
	constructor(options) {
	    this.hooks = new EventEmitter([
			'start',
			'move',
			'end'
		])
	}
}
