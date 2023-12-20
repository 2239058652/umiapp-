<template>
	<view class="advertisement4">
		<u-navbar leftIconColor="white" leftfont="40" leftIconSize="36" left-text="店铺详情" @leftClick="leftClick" bgColor="#fe6850"></u-navbar>
		<!-- 页头背景色 -->
		<view class="bj"></view>
		<view class="body">
			<view>
				<view>
					<image :src="image" mode=""></image>
				</view>
				<view>{{name}}</view>
			</view>
			<!-- <view class="message">
				信息
			</view> -->
		</view>
		<view class="goods"  @click="goAll">查看全部商品</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				image:'',
			};
		},
		onLoad(option) {
			this.shopNo = option.shopNo
			this.name = option.name
			this.image = option.image
			this.value = ''
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			goAll(){
				uni.navigateTo({
					url:`/pages/pagesC/storeSearch/storeSearch?value=${this.value}&shopNo=${this.shopNo}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.advertisement4 {
		.bj {
			background: #fe6850;
			width: 100%;
			height: 251rpx;
		}

		.body {
			width: 90%;
			position: absolute;
			top: 160rpx;
			left: 50%;
			transform: translateX(-50%);
			>view:first-child {
				background-color: #fff;
				display: flex;
				border-radius: 20rpx;
				padding: 25rpx 0;
				>view:first-child {
					width: 25%;

					image {
						display: block;
						@include image(120rpx, 120rpx, 50%) background-color: #ebebeb;
						margin: 0 auto;
					}
				}

				>view:nth-child(2) {
					width: 75%;
					line-height: 120rpx;
				}
			}

		}
		.goods {
			font-size: 28rpx;
			padding: 30rpx 0;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			width: 100%;
			text-align: center;
		}
	}
</style>
