export function createBehaviorOptions(bsOptions, extraProp, bounces, rect) {
	const options = Object.assign(bsOptions, {
		scrollable: bsOptions[extraProp],
		bounces: bounces,
		rect: rect
	})
	
	console.log(options)
	
	return options
}
