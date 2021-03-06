export function getRect(className){
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().select(className).boundingClientRect(function(data) {
			console.log(className, data)
			resolve(data)
		}).exec()
	}) 
}