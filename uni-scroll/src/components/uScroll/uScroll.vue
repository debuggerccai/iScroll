<template>
	<view class="scroll-wrapper" :id="containerId" @touchstart="touchstartEvent" @touchmove="touchmoveEvent" @touchend="touchendEvent"
	 @touchcancel="touchcancelEvent">
		<view class="content" :id="contentId" :style="{transitionTimingFunction, transitionDuration, transform}">
			<!-- 下拉刷新 -->
			<view class="pulldown-wrapper">
				<view class="text" v-text="refreshText"></view>
			</view>

			<!-- 主内容插槽 -->
			<slot></slot>

			<!-- 空内容 -->
			<view class="empty-wrapper">

			</view>

			<!-- 上拉加载更多 -->
			<view class="pullup-wrapper">
				<view class="spinner-holder">
					<text class="dot" v-for="i in 4"></text>
				</view>

				<view class="no-data-text" v-text="noDataText" :class="{active: !showLoading && loadingState === 2}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import UScroll from './index'
	import {
		ease
	} from './utils'

	export default {
		name: 'uni-scroll',
		data() {
			return {
				iScroll: '',
				scroll: {
					height: ''
				},
				downOptions: {
					height: ''
				},
				upOptions: {
					height: ''
				},
				transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
				transitionDuration: '0ms',
				scrollTop: 0,
				scrollLeft: 0,
				containerId: 'outer-' + Math.random().toString(36).substring(3, 8),
				contentId: 'inner-' + Math.random().toString(36).substring(3, 8)
			}
		},
		props: {
			scrollX: {
				default: false,
				type: Boolean
			},
			scrollY: {
				default: true,
				type: Boolean
			},
			onRefresh: Function,
			onInfinite: Function,
			refreshText: {
				default: '下拉刷新',
				type: String
			},
			noDataText: {
				default: '没有更多数据',
				type: String
			},
			loadingState: 0, // 0: stop, 1: loading, 2: stopping loading
			showLoading: false,
			scrollIntoView: String,
			pullDownRefresh: {
				default: function (){
					return {
						threshold: 90,
						stop: 40
					}
				},
				type: Object
			}
		},
		watch: {
			scrollIntoView: function(val) {
				this.$nextTick(function() {
					uni.createSelectorQuery().in(this).select('#' + val).boundingClientRect(function(data) {
						this.scrollTo(data.left, data.top)
					}).exec()
				})
			}
		},
		computed: {
			transform() {
				return `translate(${this.scrollLeft}px, ${this.scrollTop}px) scale(1) translateZ(0px)`
			}
		},
		onLoad() {

		},
		async mounted() {
			// await this.getScrollHeight()
			let options = {
				scrollX: this.scrollX,
				scrollY: this.scrollY,
				pullDownRefresh: this.pullDownRefresh
			}

			this.iScroll = new UScroll('#' + this.containerId, '#' + this.contentId, options, this)
			this.iScroll.on('scrollTo', this.scrollTo)

			uni.onWindowResize((res) => {
				this.iScroll.resize()
			})

			if (this.onRefresh) {
				this.onRefresh(this.finishPullToRefresh)
			}

			if (this.onInfinite) {
				this.onInfinite(this.finishInfinite)
			}
		},
		methods: {
			touchstartEvent(e) {
				this.iScroll && this.iScroll.scoller.doTouchStart(e)
				// this.iScroll && this.iScroll.trigger('scrollStart', e)
			},

			touchmoveEvent(e) {
				this.iScroll && this.iScroll.scroller.doTouchMove(e)
				// this.iScroll && this.iScroll.trigger('scroll', e)
			},

			touchendEvent(e) {
				this.iScroll && this.iScroll.scroller.doTouchEnd(e)
				// this.iScroll && this.iScroll.trigger('scrollEnd', e)
			},

			scrollTo(x = 0, y = 0, time = 0, easing = 'swipe') {
				this.scrollLeft = x
				this.scrollTop = y
				this.transitionDuration = time + 'ms'
				this.transitionTimingFunction = ease[easing].style
			},

			// 正在进入下拉刷新的操作
			pullingDown() {

			},

			// 触发下拉刷新
			triggerPullToRefresh() {
				this.iScroll && this.iScroll.triggerPullToRefresh()
			},

			// 结束下拉刷新
			finishPullToRefresh() {
				this.iScroll && this.iScroll.finishPullToRefresh()
			},

			// 结束加载
			finishInfinite() {

			},

			getScrollHeight() {
				let that = this
				return new Promise((resolve, reject) => {
					uni.createSelectorQuery().in(this).select(".content").boundingClientRect(function(data) {
						Object.assign(that.scroll, {
							height: data.height
						})
						resolve(data)
					}).exec()
				})
			}
		}
	}
</script>

<style lang="css" scoped>
	.scroll-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.pulldown-wrapper,
	.empty-wrapper {
		height: 120upx;
		margin-top: -120upx;
	}

	.pulldown-wrapper .text {
		line-height: 120upx;
		text-align: center;
		font-size: 32upx;
		color: #606C71;
	}

	.pullup-wrapper {
		height: 120upx;
	}

	.no-data-text {
		line-height: 120upx;
		text-align: center;
		font-size: 36upx;
		color: #606C71;
		opacity: 0;
		transition: opacity .15s linear;
		-webkit-transition: opacity .15s linear;
	}

	.no-data-text.active {
		opacity: 1;
	}

	.spinner-holder {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner-holder .dot {
		display: inline-block;
		width: 20upx;
		height: 20upx;
		background: #4DB6AC;
		opacity: .5;
		border-radius: 20px;
		animation: animation 1s linear .3s infinite;
	}

	.spinner-holder .dot:nth-child(2) {
		animation: animation 1s linear .2s infinite;
	}

	.spinner-holder .dot:nth-child(3) {
		animation: animation 1s linear .1s infinite;
	}

	.spinner-holder .dot:nth-child(4) {
		animation: animation 1s linear infinite;
	}

	@keyframes animation {
		0% {
			-webkit-transform: translateY(-20upx);
			box-shadow: 0 0 3px rgba(0, 0, 0, .1)
		}

		25%,
		75% {
			-webkit-transform: translateY(0px);
			box-shadow: 0 20px 3px rgba(0, 0, 0, .05)
		}

		100% {
			-webkit-transform: translateY(-20upx);
			box-shadow: 0 0 3px rgba(0, 0, 0, .1)
		}
	}
</style>
