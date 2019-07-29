import { EventPassthrough } from './enums'

// 开启横向滚动
const scrollX = false
// 开启纵向滚动
const scrollY = true
// 同时支持横向和纵向滚动
const freeScroll = false
// 当锁定一个滚动方向时，以横轴和纵轴滚动距离的绝对值做差，当差值大于 directionLockThreshold 的时候来决定滚动锁定的方向
const directionLockThreshold = 5

// 在某个方向模拟滚动的时候，另一个方向保留原生的滚动
const eventPassthrough = EventPassthrough.None

// 滚动超出边缘回弹动画
const bounce = {
	top: true,
	bottom: true,
	left: true,
	right: true
}
// 回弹动画持续事件
const bounceTime = 800

//当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画
const momentum = true
// 只有在屏幕上快速滑动的时间小于 momentumLimitTime，才能开启 momentum 动画
const momentumLimitTime = 300
// 只有在屏幕上快速滑动的距离大于 momentumLimitDistance，才能开启 momentum 动画
const momentumLimitDistance = 15

// 设置 momentum 动画的动画时长
const swipeTime = 2500
// 设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间
const swipeBounceTime = 500

// 表示 momentum 动画的减速度
const deceleration = 0.0015

// 有的时候我们要捕获用户的轻拂动作（短时间滑动一个较短的距离）。只有用户在屏幕上滑动的时间小于 flickLimitTime ，才算一次轻拂
const flickLimitTime = 200
// 只有用户在屏幕上滑动的距离小于 flickLimitDistance ，才算一次轻拂
const flickLimitDistance = 100

// 当窗口的尺寸改变的时候，需要对 better-scroll 做重新计算，为了优化性能，我们对重新计算做了延时
const resizePolling = 60

export default function createOptions(options) {
	return Object.assign({
		scrollX,
		scrollY,
		freeScroll,
		directionLockThreshold,
		eventPassthrough,
		bounce,
		bounceTime,
		momentum,
		momentumLimitTime,
		momentumLimitDistance,
		swipeTime,
		swipeBounceTime,
		deceleration,
		flickLimitTime,
		flickLimitDistance,
		resizePolling
	}, options)
}
