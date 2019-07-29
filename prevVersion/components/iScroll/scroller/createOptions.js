export function createBehaviorOptions(iOptions, extraProp, bounces, rect) {
	const options = [
		'momentum',
		'momentumLimitTime',
		'momentumLimitDistance',
		'deceleration',
		'swipeBounceTime',
		'swipeTime'
	].reduce((prev, cur) => {
		prev[cur] = iOptions[cur]
		return prev
	})

	options.scrollable = iOptions[extraProp]
	options.bounces = bounces
	options.rect = rect
	return options
}
