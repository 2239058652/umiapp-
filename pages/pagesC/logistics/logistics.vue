<template>
	<view class="logistics">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" title="物流"></uni-nav-bar>
		<view class="logtop">
			<view>
				取件出示手机号码：1111111111
			</view>
			<view>
				取件地址：111111111111
			</view>
		</view>
		<view class="logcontent">
			<view class="person">
				<view><text class="aj aj-kuaidiyuan"></text>快递员：XXX</view>
				<view@click="goPhone">拨打电话</view>
			</view>
			<view class="order">
				<view>
					<text class="aj aj-31daishouhuo"></text>
				</view>
				<view>
					<view style="display: flex;">
						<view class="ordersn">订单编号：1111111111111111</view>
						<text class="fuzhi" @tap="onCopy( orderDetail.orderSn )">复制</text>
					</view>
					<view>收货地址：<text>地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址</text></view>
				</view>
			</view>

		</view>
		<view class="step">
			<u-steps current="0" direction="column" dot>
				<u-steps-item title="已下单" desc="换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行换行"></u-steps-item>
				<u-steps-item title="已出库" desc="10:35"></u-steps-item>
				<u-steps-item title="运输中" desc="11:40"></u-steps-item>
			</u-steps>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			// 复制
			onCopy(code) {
				uni.setClipboardData({
					data: code,
					success: function(data) {
						uni.showToast({
							title: '已复制到剪切板',
							icon: "none"
						});
					}
				});
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
	@import "@/static/style/uni.scss";
	.logistics {
		.logtop {
			padding: 10rpx 15rpx;
			background-color: #fff;
			margin-bottom: 15rpx;

			>view:first-child {
				font-size: 35rpx;
				font-weight: 600;
				color: #10b406;
			}
		}

		.logcontent {
			padding: 10rpx 15rpx;
			background-color: #fff;

			.person {
				display: flex;
				justify-content: space-between;
				margin-bottom: 15rpx;
				>view:first-child {
					padding: 10rpx 0;
					width: 75%;
				}
				.aj-kuaidiyuan{
					font-size: 45rpx;
					margin-right: 10rpx;
				}
				>view:nth-child(2) {
					padding: 10rpx 0;
					width: 25%;
					border: 1rpx solid #989898;
					border-radius: 10rpx;
					text-align: center;
				}
			}

			.order {
				display: flex;

				.aj-31daishouhuo {
					font-size: 45rpx;
					margin-right: 10rpx;
				}
				.fuzhi {
					border: 1rpx solid #000;
					border-radius: 10rpx;
					padding: 0 10rpx;
					margin-left: 20rpx;
				}
				.ordersn{
					width:80%;
				}
			}
		}

		.step {
			background-color: #fff;
			padding: 15rpx 15rpx;
			margin-top: 15rpx;
			/deep/ .u-text__value{
				font-size: 30rpx !important;
			}
		}
	}
</style>
