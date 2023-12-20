<template>
	<view>
		<view class="head">
			<view class="status_bar">
				<!-- 这里是状态栏 -->

			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco">提现</view>

			</view>

		</view>
		<view class=" btn1" @click="show=true">
			<view class="aj aj-yuebao yhk" v-if="type==0"></view>
			<view class="aj aj-yinhangka yhk" v-else></view>
			{{title}}
			<view class="aj aj-jiangxu yhk"></view>
		</view>
		<view class="consumptionbill">
			<view class="flex">
				<u-popup :show="show" :round="10" mode="bottom" @close="show=false" closeable='true'
					closeIconPos='top-left'>
					<view :class="pops">
						<view :class="title == item ? 'tabs active':'tabs'" v-for="(item,index) in tabs" :key="index"
							@click="choose(index,item)">{{item}}</view>
					</view>
				</u-popup>
			</view>
		</view>
		<view class="tixian">
			<view style="color:black;">提现金额 </view>
			<!-- <u--input placeholder="请输入金额" border="none" @change="change" type="number" :value='value1'></u--input> -->
			<input type="text" v-model="value1" placeholder="请输入金额">
		</view>
		<view class="wen">
			<view class="wen-top">当前可提现金额<text style="color: #e93423;font-size: 40rpx;">{{yu}}</text>,冻结金额<text
					style="color: #e93423;font-size: 40rpx;">{{lei}}</text>
				<view class="quanbu" @click="quan()">全部提现</view>
			</view>
			<view class="sm">说明:</view>
			<view>1、每笔佣金的冻结期为<text style="color: #e93423;">7</text>天，到期后即可提现！</view>
			<view>2、提现之后款项会在<text style="color: #e93423;">2</text>个工作日到账</view>
			<view>3、单笔提现金额最少是<text style="color: #e93423;">10</text>元</view>
		</view>

		<button class="btn" @click="tixian()">提现</button>
		<view class="daohang" @click="qiehuan_flag()">
			<u-icon v-if="!flag" name="arrow-left" color="#fff" size="45"></u-icon>
			<u-icon v-else name="arrow-right" color="#fff" size="45"></u-icon>

		</view>
		<view class="hutuis" v-if="flag">
			<u-icon name="home" @click="go_home()" color="#fff" size="45"></u-icon>
			<u-icon name="shopping-cart" @click="go_cart()" color="#fff" size="45"></u-icon>
			<u-icon @click="go_mine()" name="man-add" color="#fff" size="45"></u-icon>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value1: '',
				yu: 0,
				lei: 0,
				flag: false,
				num: 0,
				title: '卡余额',
				type: 0,
				tabs: ['卡余额', '银行卡'],
				Height: 0,
				show: false,
				isShow: false,
				// time: new Date().toISOString().slice(0, 10),//当前日期
				time: '选择日期',
				pops: 'pop', //账单选择样式
				list: [],
				jfList: [], 
				cardList: [],
				wxList: [],
				dzqList: [],
			}
		},
		onLoad(e) {
			this.yu = e.yu
			this.lei = e.lei
		},
		methods: {
			// 全部提现
			quan() {
				this.value1 = this.yu

			},
			// 输入框输入事件
			// change(e) {
			// 	this.num = e
			// },
			// 点击按钮提现
			tixian() {
				if (this.type == 1) {
					uni.showToast({
						title: '暂未开通，敬请期待！',
						icon: 'none',
						duration: 2000
					});
				} else {
					if (this.value1 >= 10) {
						this.$request.posttixian({
							mobile: this.$store.state.userInfo.mobile,
							// mobile: '18438005006',
							txMoney: this.value1,
							payType: this.type
						}, {
							'Content-type': 'application/x-www-form-urlencoded',
						}).then(res => {
							// this.num = 0
							if (res.code == 200) {
								this.value1 = ''
								uni.showToast({
									title: '申请成功，请等待审核',
									icon: 'none',
									duration: 2000
								});
								this.getdata()
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 2000
								});
							}

						})
					} else {
						uni.showToast({
							title: '提现金额不能低于10元',
							icon: 'none',
							duration: 2000
						});
					}
				}

			},
			getdata() {
				this.$request.getHHRshouyi({
					mobile: this.$store.state.userInfo.mobile,
				}).then(res => {
					this.yu = res.available
					// this.lei = res.unavailable + res.available
				})
			},
			// 点击切换flag
			qiehuan_flag() {
				setTimeout(() => {
					this.flag = !this.flag
				}, 200)
			},
			go_home() {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				});
			},
			go_cart() {
				uni.switchTab({
					url: '/pages/tabbar/shoppingCart/shoppingCart'
				});
			},
			go_mine() {
				uni.switchTab({
					url: '/pages/tabbar/my/my'
				});
			},
			go() {
				uni.navigateBack({
					delta: 1
				});
			},
			choose(index, item) {
				this.type = index
				this.title = item
				// this.list = []
				this.show = false
				// this.time = '选择日期'
				// if (this.title == '微信支付') {
				// 	this.list = this.wxList
				// } else if (this.title == '积分兑换') {
				// 	this.list = this.jfList
				// } else if (this.title == '卡支付') {
				// 	this.list = this.cardList
				// } else if (this.title == '电子券支付') {
				// 	this.list = this.dzqList
				// } else {
				// 	uni.navigateTo({
				// 		url: `/pages/pagesB/IntegralChange/IntegralChange?title=${this.title}`
				// 	})
				// }
				// this.alllist = this.list
			},
		}
	}
</script>

<style lang="scss">
	.quanbu {
		float: right;
		line-height: 50rpx;
		height: 50rpx;
		border: 2px solid #e93423;
		width: 150rpx;
		border-radius: 20rpx;
		text-align: center;
	}

	.head {

		/* height: 80rpx; */
		background-color: #e93423;
		/* line-height: 80rpx; */
		color: #fff;
		/* padding-left: 20rpx; */
	}

	.santu {
		width: 750rpx;
		height: 150rpx;
	}

	.tu_box {
		/* border: 1px solid #ccc; */
	}

	.tixian {
		height: 100rpx;
		color: balck;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
		border-top: 1px solid #ccc;
	}

	.tixian {
		display: flex;
		align-items: center;

	}

	.tixian view {
		color: #fff;
		font-size: 40rpx;
		line-heigh: 200rpx;
		margin-left: 40rpx;
		margin-right: 50rpx;
	}

	.tixian input {
		background-color: #fff;
		height: 70rpx;
		border-radius: 20rpx;
		padding-left: 10rpx;
	}

	.wen {
		padding: 30rpx;
	}

	.wen-top {
		/* color: #e93423; */
		margin-bottom: 20rpx;
	}

	.btn {
		margin-top: 40rpx;
		height: 80rpx;
		width: 80%;
		line-height: 80rpx;
		border-radius: 25px;
		background-color: red;
		color: #fff;
	}

	.daohang {
		width: 80rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 50%;
		position: fixed;
		right: 20rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hutuis {
		width: 242rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 25px;
		position: fixed;
		right: 117rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: space-around;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.toubu {
		display: flex;
		/* height: 200rpx; */
		align-items: center;
		padding-left: 20rpx;
		height: 100rpx;
	}

	.inco {
		margin: 0 20rpx 0 20rpx;
	}




	@import "@/static/style/uni.scss";

	.consumptionbill {
		.active {
			color: #fff;
			font-weight: 600;
			background-color: #cf2c27 !important;
		}

		.fixe {
			box-sizing: border-box;
			position: fixed;
			width: 100%;
			z-index: 999;
			background: #fff;
			display: flex;

			view {
				padding: 0 10rpx;
				height: 45rpx;
				line-height: 45rpx;
				background-color: #cf2c27;
				border-radius: 10rpx;
				font-size: 28rpx;
				color: #fff;
				margin: 10rpx 0 10rpx 20rpx;
			}
		}

		.pop {
			width: 90%;
			margin: 75rpx auto;
			display: flex;
			flex-wrap: wrap;

			.tabs {
				width: 48%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				background-color: #eee;
				margin-top: 2%;
				border-radius: 10rpx;
			}

			.tabs:nth-child(2n-1) {
				margin-right: 2%;
			}
		}

		.pop1 {
			width: 90%;
			margin: 75rpx auto;
			display: flex;
			flex-wrap: wrap;

			.tabs {
				width: 32%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				background-color: #eee;
				margin-top: 2%;
				border-radius: 10rpx;
				margin-right: 2%;
			}

			.tabs:nth-child(3n) {
				margin-right: 0;
			}
		}

		.none {
			text-align: center;
			padding-top: 100rpx;
		}

		.swiper {
			margin-top: 64rpx;

			.billcontent {
				width: 90%;
				margin: 0 auto;
				margin-bottom: 15rpx;
				padding: 15rpx;
				background-color: #fff;
				border-radius: 10rpx;

				&>view {
					font-weight: 600;
					letter-spacing: 1rpx;

					.money {
						color: #cf2c27;
					}

					text:first-child {
						font-size: 28rpx;
						font-weight: normal;
						letter-spacing: normal;
					}

					text:nth-child(2) {
						float: right;
						color: #cf2c27;
					}
				}
			}
		}
	}

	.btn1 {
		// font-size: 16px;
		// font-style: normal;
		// height: 60rpx;
		// line-height: 60rpx;
		// padding: 20rpx;
		// width: 150rpx;
		padding: 0 10rpx;
		height: 45rpx;
		line-height: 45rpx;
		background-color: #e93423;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #fff;
		margin: 10rpx 0 10rpx 20rpx;
		width: 150rpx;
		display: flex;
		justify-content: space-between;
	}
</style>
