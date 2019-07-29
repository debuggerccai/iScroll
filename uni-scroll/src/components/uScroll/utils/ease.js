export const ease = {
	// easeOutQuint
	// 滚动
	swipe: {
		style: 'cubic-bezier(0.23, 1, 0.32, 1)',
		fn: function(t) {
			return 1 + --t * t * t * t * t
		}
	},
	// easeOutQuard
	// 滚动超出边缘
	swipeBounce: {
		style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		fn: function(t) {
			return t * (2 - t)
		}
	},
	// easeOutQuart
	// 滚动超出边缘回弹
	bounce: {
		style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		fn: function(t) {
			return 1 - --t * t * t * t
		}
	}
}
