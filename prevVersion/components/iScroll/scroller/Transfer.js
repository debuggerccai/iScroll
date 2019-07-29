import EventEmitter from '../base/EventEmitter'

export default class Transfer {
	constructor() {
	    this.hooks = new EventEmitter([
			'start',
			'move',
			'end'
		])
	}
}