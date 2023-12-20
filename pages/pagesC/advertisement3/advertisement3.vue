<template>
	<view class="advertisement3">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="专属导购" left-icon="back"></uni-nav-bar>
		<view v-if="isShow" class="null">暂无数据</view>
		<view v-else class="content">
			<view class="left">
				<image :src="image" mode=""></image>
			</view>
			<view class="center">
				<view>{{name}}</view>
				<text>{{phone}}</text>
			</view>
			<view class="right" @click="goPhone">
				<view>向TA咨询</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				phone:'',
				image:'',
				isShow:false
			}
		},
		onLoad(option) {
			this.name = option.name
			this.phone = option.phone
			this.image = option.image
			if(this.name=='' || this.phone==''){
				this.isShow = true
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goPhone() {
				uni.makePhoneCall({
						phoneNumber: this.phone,// 这里就是自己要拨打的电话号码
						success: (res) => {
							console.log('调用成功!',res)
						},
						fail: (res) => {
							console.log('调用失败!',res)
						}
					})
			},
		}
	}
</script>

<style lang="scss">
	.advertisement3 {
		.null{
			text-align: center;
			padding-top: 50%;
		}
		.content{
			background-color: #fff;
			margin-top: 20rpx;
			display: flex;
			padding: 15rpx 0;
			.left {
				width: 20%;

				image {
					display: block;
					margin: 0 auto;
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}

			.center {
				width: 55%;
				padding: 10rpx 0;
				view {
					font-size: 29rpx;
				}

				text {
					font-size: 28rpx;
					color: #a5a5a5;
				}
			}

			.right {
				width: 25%;
				position: relative;

				view {
					width: 83%;
					font-size: 28rpx;
					border: 1rpx solid #f74c39;
					border-radius: 15rpx;
					color: #f74c39;
					text-align: center;
					padding: 3rpx 0;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	}
</style>
