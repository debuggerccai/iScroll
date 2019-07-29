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
			<view class="empty-wrapper"></view>

			<!-- 上拉加载更多 -->
			<view class="pullup-wrapper"></view>
		</view>
	</view>
</template>

<script>
	import Scroller from './scroller/Scroller'
	import { ease } from './utils'

	export default {
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
			scrollIntoView: String
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
		created() {

		},
		async mounted() {
			// await this.getScrollHeight()
			let options = {
				scrollX: this.scrollX,
				scrollY: this.scrollY
			}
			
			this.iScroll = new Scroller('#' + this.containerId, '#' + this.contentId, options, this)

			if (this.onRefresh) {
				this.iScroll.on('pullingDown', this.onRefresh)
			}
			
			if (this.onInfinite) {
				this.iScroll.on('pullingUp', this.onInfinite)
			}
		},
		methods: {
			touchstartEvent(e) {
				this.iScroll && this.iScroll.doTouchStart(e)
			},

			touchmoveEvent(e) {
				this.iScroll && this.iScroll.doTouchMove(e)
			},

			touchendEvent(e) {
				this.iScroll && this.iScroll.doTouchEnd(e)
			},

			scrollTo(x = 0, y = 0, time = 0, easing = 'swipe') {
				this.scrollLeft = x
				this.scrollTop = y
				this.transitionDuration = time + 'ms'
				this.transitionTimingFunction = ease[esing].style
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

	.pulldown-wrapper {
		height: 120upx;
		margin-top: -120upx;
	}
	
	.pulldown-wrapper .text {
		line-height: 120upx;
		text-align: center;
		font-size: 40upx;
		color: #606C71;
	}
</style>
