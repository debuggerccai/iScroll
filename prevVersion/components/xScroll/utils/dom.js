export function getRect(className) {
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().select(className).boundingClientRect(function(data) {
			resolve(data)
		}).exec()
	})
}

export function getWinRect() {
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().selectViewport().boundingClientRect(data => {
			resolve(data)
		}).exec()
	})
}
