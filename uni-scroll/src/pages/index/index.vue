<template>
	<view class="content">
		<scroll>
			<view class="line" v-for="(item, index) in dataList" :key="index">I am the No.{{ index }} line</view>
		</scroll>
	</view>
</template>

<script>
	import Scroll from '@/components/uScroll/uScroll'

	export default {
		data() {
			return {
				dataList: []
			}
		},
		components: {
			Scroll
		},
		methods: {
			requestData() {
				let arr = []
				for (var i = 1; i <= 10; i++) {
					arr.push(i)
				}
				this.dataList = this.dataList.concat(arr)
			}
		},
		onLoad() {
			this.requestData()
		}
	}
</script>

<style>
	.content {
		height: calc(100vh - 44px);
	}

	.line {
		height: 100upx;
		line-height: 100upx;
		padding-left: 40upx;
		color: #606c71;
		position: relative;
	}

	.line::after {
		content: "";
		position: absolute;
		left: -50%;
		bottom: 0;
		width: 200%;
		border-bottom: 1px solid #e5e5e5;
		transform: scale(0.5);
	}
</style>
