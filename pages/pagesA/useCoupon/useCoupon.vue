<template>
	<view class="useCoupon">
		<uni-nav-bar fixed="false" statusBar="false" title="优惠券" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<radio-group>
			<view class="coupon" v-for="(item,index) in lists" :key="index" @click="radioChange(index)">
				<view class="left" :style="'background-color:'+item.color">
					￥<text>{{item.reduceMoney}}</text>
				</view>
				<view class="center">
					<view>{{item.title}}</view>
					<view>有效期至：<text>{{item.endDate}}</text></view>
				</view>
				<radio :class="checkid == index ? 'checked' : 'circle'" :checked="checkid== index" color="red"
					:value="index" />
			</view>
		</radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: [],
				checkid: null, //选中id
				data: [], //传递的参数
			}
		},
		onLoad(data) {
			this.lists = JSON.parse(data.list)
			console.log('那些劝',this.lists);
			getApp().globalData.selectInd == null ? this.checkid = null : (this.checkid = getApp().globalData.selectInd,
				this.data = [], this.data.push(this.lists[this.checkid].reduceMoney), this.data.push(this.lists[this
					.checkid].no), this
				.data.push(this.lists[this.checkid].title))
		},
		methods: {
			back() {
				getApp().globalData.selectInd = this.checkid
				let eventChannel = this.getOpenerEventChannel()
				eventChannel.emit("chooseCoupon", this.data);
				uni.navigateBack({
					delta: 1
				})
			},
			radioChange(index) {
				let eventChannel = this.getOpenerEventChannel()
				if (this.checkid == index) { // 如果已经选中，则取消选中
					this.checkid = null;
					this.data = [];
					getApp().globalData.selectInd = null;
					eventChannel.emit("chooseCoupon", this.data);
					uni.navigateBack({
						delta: 1
					})
				} else { // 否则进行选中赋值
					this.checkid = index;
					this.data = []
					this.data.push(this.lists[index].reduceMoney)
					this.data.push(this.lists[index].no)
					this.data.push(this.lists[index].title)
					getApp().globalData.selectInd = this.checkid
					eventChannel.emit("chooseCoupon", this.data);
					uni.navigateBack({
						delta: 1
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.useCoupon {
		width: 100%;

		.coupon {
			width: 95%;
			min-height: 170rpx;
			margin: 20rpx auto;
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			position: relative;

			.left {
				width: 27%;
				color: #fff;
				text-align: center;
				line-height: 170rpx;
				font-size: 38rpx;
				border-top-left-radius: 10rpx;
				border-bottom-left-radius: 10rpx;
				// background: linear-gradient(90deg, #ff8f4d 25%, #ff6950 90%);
				border-right: 5rpx dashed #fff;

				text {
					font-size: 60rpx !important;
				}
			}

			.center {
				width: 60%;
				margin-left: 20rpx;
				border-top-right-radius: 10rpx;
				border-bottom-right-radius: 10rpx;

				view:first-child {
					margin-top: 20rpx;
				}

				view {
					width: 100%;
					padding-top: 10rpx;

					text {
						font-size: 26rpx;
					}
				}
			}

			.checked,
			.circle {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
</style>