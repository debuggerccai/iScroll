export function bubbling(source, target, events) {
	events.forEach(event => {
		let sourceEvent, targetEvent
		if (typeof event === 'string') {
			sourceEvent = targetEvent = event
		} else {
			sourceEvent = event.source
			targetEvent = event.target
		}
		source.on(sourceEvent, function(...args) {
			return target.trigger(targetEvent, ...args)
		})
	})
}
