<template>
  <view class="content">
    <u-scroll>
      <view class="line" v-for="(item, index) in dataList" :key="index">I am the No.{{ index }} line</view>
    </u-scroll>
  </view>
</template>

<script>
import UScroll from "@/components/uScroll/uScroll";

export default {
  data() {
    return {
      dataList: []
    };
  },
  components: {
    UScroll
  },
  methods: {
    requestData() {
      let arr = [];
      for (var i = 1; i <= 20; i++) {
        arr.push(i);
      }
      this.dataList = this.dataList.concat(arr);
    }
  },
  onLoad() {
    this.requestData();
  }
};
</script>

<style>
.content {
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
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
