const DEFAULT_INTERVAL = 100 / 60

export const requestAnimationFrame = (() => {
	return function(callback) {
		return setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2)
	} 
})()

export const cancelAnimationFrame = (() => {
	return function(id){
		clearTimeout(id)
	}
})()