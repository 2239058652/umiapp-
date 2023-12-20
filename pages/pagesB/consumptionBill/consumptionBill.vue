<template>
	<view class="consumptionbill">
		<uni-nav-bar fixed="false" statusBar="false" title="消费账单" left-icon="left" @clickLeft="jump(1)"></uni-nav-bar>
		<view>
			<view class="fixe">
				<!-- <view class="qbzd"> -->
				<view class="aj aj-jiangxu" @click="show=true">{{title}}</view>
				<view class="aj aj-jiangxu" @click="isShow = true">{{time}}</view>
				<view @click="change" v-if="time!='选择日期'">全部日期</view>
				<!-- </view> -->
			</view>
			<u-popup :show="show" :round="10" mode="bottom" @close="show=false" closeable='true'
				closeIconPos='top-left'>
				<view :class="pops">
					<view :class="title == item ? 'tabs active':'tabs'" v-for="(item,index) in tabs" :key="index"
						@click="choose(index,item)">{{item}}</view>
				</view>
			</u-popup>
			<u-picker v-model="isShow" mode="time" @confirm="timeConfirm"></u-picker>
			<scroll-view class="swiper" scroll-y="true" :style="{Height:Height+'px'}">
				<view v-if="list.length!=0" class="billcontent" v-for="(item,index) in list" :key="index">
					<view>订单编号：<text>{{item.orderSn}}</text><text>{{item.isPay}}</text></view>
					<view v-if="title=='卡支付'">会员卡号：<text>{{item.cardNo}}</text></view>
					<view v-if="title=='积分兑换'">积分金额：<text>{{item.consumeJfNum}}</text></view>
					<view v-if="title=='电子券支付'">电子券编号：<text>{{item.elecCode}}</text></view>
					<view v-if="title=='电子券支付'">抵用金额：<text class="money">￥{{item.payMoney}}</text></view>
					<view v-if="title!='电子券支付'">支付金额：<text class="money">￥{{item.payMoney}}</text></view>
					<view v-if="title=='卡支付'">交易前余额：<text class="money">￥{{item.beforeCardYe}}</text></view>
					<view v-if="title=='卡支付'">交易后余额：<text class="money">￥{{item.cardYe}}</text></view>
					<view v-if="title=='积分兑换'">交易前积分：<text class="money">￥{{item.beforeJf}}</text></view>
					<view v-if="title=='积分兑换'">交易后积分：<text class="money">￥{{item.afterJf}}</text></view>
					<view>创建时间：<text>{{item.createDate}}</text></view>
				</view>
				<view v-if="list.length==0" class="none">
					暂无{{title}}消费记录
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['微信支付', '积分兑换', '卡支付', '电子券支付','卡金变动','积分变动'],
				Height: 0,
				show: false,
				isShow: false,
				title: '微信支付',
				// time: new Date().toISOString().slice(0, 10),//当前日期
				time: '选择日期',
				pops: 'pop', //账单选择样式
				list: [],
				jfList: [],
				cardList: [],
				wxList: [],
				dzqList: [],
			};
		},
		onShow() {
			let page = getCurrentPages()
			if (page[page.length - 1].route == 'pages/pagesB/consumptionBill/consumptionBill') {
				this.title = '微信支付'
			}
			this.Height = getApp().globalData.equipment.windowHeight - 64
			this.timelist = [] //选择日期对应的账单列表
			this.alllist = []
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.list = []
			this.wxList = []
			this.jfList = []
			this.cardList = []
			this.dzqList = []
			this.$request.postQueryOrderPyMethodByMobile({
				mobile: uni.getStorageSync('userInfo').mobile
			}).then(res => {
				res.forEach((ite, index) => {
					if (ite.payType == 'cardPay') {
						this.cardList.push(ite)
					} else if (ite.payType == 'elecPay') {
						this.dzqList.push(ite)
					} else if (ite.payType == 'wxPay') {
						this.wxList.push(ite)
					} else { //jfPay
						this.jfList.push(ite)
					}
				})
			})
			this.list = this.wxList
			this.alllist = this.list
		},
		methods: {
			change() {
				this.time = '选择日期'
				this.list = []
				if (this.title == '微信支付') {
					this.list = this.wxList
				} else if (this.title == '积分兑换') {
					this.list = this.jfList
				} else if (this.title == '卡支付') {
					this.list = this.cardList
				} else if (this.title == '电子券支付') {
					this.list = this.dzqList
				}
			},
			choose(index, item) {
				this.title = item
				this.list = []
				this.show = false
				this.time = '选择日期'
				if (this.title == '微信支付') {
					this.list = this.wxList
				} else if (this.title == '积分兑换') {
					this.list = this.jfList
				} else if (this.title == '卡支付') {
					this.list = this.cardList
				} else if (this.title == '电子券支付') {
					this.list = this.dzqList
				} else {
					uni.navigateTo({
						url: `/pages/pagesB/IntegralChange/IntegralChange?title=${this.title}`
					})
				}
				this.alllist = this.list
				console.log(this.alllist,'2')
			},
			timeConfirm(e) {
				this.time = e.year + '-' + e.month + '-' + e.day
				this.isShow = false
				let lists = this.alllist
				this.timelist = []
				lists.forEach(val => {
					if (val.createDate.slice(0, 10) == this.time) {
						this.timelist.push(val)
					}
				})
				this.list = this.timelist
			},
			jump(e) {
				e == 1 ? uni.navigateBack({
					delta: 1
				}) : uni.navigateTo({
					url: '/pages/pagesB/searchBill/searchBill'
				})
			}
		},
	}
</script>

<style lang="scss">
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
</style>
