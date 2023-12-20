<template>
	<view class="gifCard">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" title="礼品卡"></uni-nav-bar>
		<view class="top">
			<view>我的礼包</view>
			<view>卡片购买</view>
			<view>转增查询</view>
		</view>
		<view class="content">
			<view>礼品卡面值</view>
			<view>
				<view v-for="(item,Indexes) in list" :key="Indexes" @click="choose(item,Indexes)"
					:style="index == Indexes ? 'border:1rpx solid #0894ec' : ''">
					{{ item }}<text v-if="item!='其他金额'">元</text>
				</view>
			</view>
		</view>
		<view class="kamian">
			<view>自选卡面</view>
			<view>
				<scroll-view scroll-x="true" @click="scroll">
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
					<image src="../../../static/img/fail.png"></image>
				</scroll-view>
			</view>
		</view>
		<view class="bottom">
			<view>数量<u-number-box ref="numberBox" v-model="number" integer="false" disabledInput="true">
					<view slot="minus" class="minus" @click="minus">
						<u-icon name="minus" size="40"></u-icon>
					</view>
					<view slot="plus" class="plus" @click="plus">
						<u-icon name="plus" size="40"></u-icon>
					</view>
				</u-number-box>
			</view>
			<view>合计<text>￥{{allmoney}}</text></view>
		</view>
		<u-popup :show="isShow" @close="isShow=false" mode="center" round="30" closeIconPos="top-right"
			closeable="false">
			<view class="pop">
				<u-input v-model="value" placeholder="输入金额" border="bottom" clearable />
				<button class="btn" @click="btnsub">确定</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: ['88', '188', '500', '888', '1000', '其他金额'],
				index: 0, //默认不选中
				allmoney: 0,
				isShow: false,
				value: '',
				number: 1,
			}
		},
		watch: {
			number() {
				this.allmoney = this.number * this.money
			}
		},
		onLoad() {
			this.money = 88
			this.allmoney = this.money
		},
		methods: {
			choose(item, ind) {
				this.index = ind
				if (item != '其他金额') {
					this.money = item
					this.allmoney = this.money * this.number
				} else {
					this.value = ''
					this.isShow = true
				}
			},
			btnsub() {
				this.isShow = false
				this.money = this.value
				this.allmoney = this.value * this.number
			},
			minus() {
				if (this.number == 1) return
				this.number -= 1
			},
			plus() {
				this.number += 1
			},
		}
	}
</script>

<style lang="scss">
	.gifCard {
		width: 95%;
		margin: 0 auto;

		.pop {
			width: 95%;
			margin: 70rpx auto;
		}

		.btn {
			color: #fff;
			background-color: #d2331e;
			font-size: 28rpx;
			border-radius: 40rpx;
			margin-top: 20rpx;
		}

		.top {
			display: flex;
			justify-content: space-around;
			background-color: #FFFFFF;

			view {
				width: 33%;
				padding: 20rpx 0;
				text-align: center;
				color: #60646d;
			}

			>view:nth-child(2) {
				color: #0894ec;
				border-bottom: 4rpx solid #0894ec;
			}
		}

		.content {
			margin-top: 20rpx;

			&>view:first-child {
				color: #60646d;
				margin-bottom: 15rpx;
			}

			&>view:nth-child(2) {
				display: flex;
				flex-wrap: wrap;
				width: 95%;
				margin: 0 auto;

				view {
					background-color: #fff;
					margin: 20rpx 10rpx 0 13rpx;
					border: 2rpx solid #c6c6c6;
					width: 29%;
					font-size: 24rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 15rpx;
				}
			}
		}

		.kamian {
			margin-top: 20rpx;

			&>view:first-child {
				color: #60646d;
				margin-bottom: 15rpx;
			}

			&>view:nth-child(2) {
				scroll-view {
					white-space: nowrap;
					width: 100%;
				}

				image {
					width: 130rpx;
					height: 130rpx;
					border-radius: 10rpx;
					margin-right: 10rpx;
				}
			}
		}

		.bottom {
			padding: 20rpx;
			margin-top: 20rpx;
			border-bottom: 1rpx solid #60646d;
			border-top: 1rpx solid #60646d;
			background-color: #fff;

			>view {
				display: flex;
				justify-content: space-between;

				>text {
					font-size: 32rpx;
					color: red;
				}
			}

			>view:first-child {
				padding: 0 10rpx 10rpx 10rpx;
				border-bottom: 1rpx solid #60646d;

				.minus,
				.plus {
					width: 46rpx;
					height: 46rpx;
					background-color: #ebecee;
					display: flex;
					justify-content: center;
				}
			}

			>view:nth-child(2) {
				padding: 10rpx 10rpx 0 10rpx;
			}
		}
	}
</style>
