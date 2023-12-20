<template>
	<view class="onlineRecharge">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="在线充值" left-icon="back"></uni-nav-bar>
		<view>
			<view>充值金额：</view>
			<u-input v-model="value" clearable="true" type="number" shape="circle" border="surround" placeholder="请输入金额"
				@clear="value='',index=null" />
			<view v-show="amount">请输入数字</view>
		</view>
		<view>
			<view v-for="(item,Indexes) in list" :key="Indexes" @click="index = Indexes,value=item"
				:style="index == Indexes ? 'background:#00dc00;color:#fff' : ''">
				{{ item }}
			</view>
		</view>
		<u-button throttleTime="5000" size="large" type="warning" shape="circle" @click="payMoney">确定充值</u-button>
	</view>
</template>

<script>
	import {
		AppID,
		tenantId
	} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				cardNo: 0,
				value: '',
				amount: false,
				list: [88, 188, 288, 388, 488, 588, 688, 988],
				index: null, //默认不选中
				no: 0 //充值方案号
			}
		},
		onLoad(e) {
			this.cardNo = e.cardNo
			this.no = e.no
			this.time = Math.round(new Date() / 1000)
		},
		// watch:{
		// 	value(){
		// 		// console.log(this.value);
		// 	}
		// },
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 官方微信 tenantId ==37903   notifyUrl: NOTIFY_URL,
			wxPay() {
				this.$request.postCreateOrder({
					body: "创建订单",
					outTradeNo: String(tenantId + this.time),
					totalFee: this.value,
					spbillCreateIp: "127.0.0.1",
					notifyUrl: '',
					tradeType: "JSAPI",
					openid: uni.getStorageSync('openid'),
					faNo: this.no, //充值方案号
				}, {
					"Content-Type": "application/json"
				}).then(res => {
					if (res.code == 200) {
						let datares = res.data
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: datares.timeStamp,
							nonceStr: datares.nonceStr,
							package: datares.packageValue,
							signType: datares.signType,
							paySign: datares.paySign,
							success: function(res) {
								uni.redirectTo({
									url: '/pages/pagesA/paySuccess/paySuccess'
								})
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
			},
			//建行 tenantId == 37121
			jhPay() {
				this.$request.postJhPay({
					tenantId,
					orderSn: String(tenantId + this.time),
					payMoney: this.value,
					busNo: String(tenantId + this.time),
					type: 'recharge',
					elecCode: '',
					tradeType: "MINIPRO",
					subAppId: AppID,
					subOpenId: uni.getStorageSync('openid'), //openid
					remark1: "recharge" +"/"+this.no,
					remark2: this.cardNo,
					faNo: this.no, //充值方案号
				}, {
					"Content-Type": "application/json"
				}).then(dataRes => {
					let ress = JSON.parse(JSON.stringify(dataRes));
					if (ress.code == 200) {
						let data = ress.data
						uni.requestPayment({
							"timeStamp": data.timeStamp,
							"nonceStr": data.nonceStr,
							"package": data.package,
							"signType": data.signType,
							"paySign": data.paySign,
							"success": function(res) {
								uni.redirectTo({
									url: '/pages/pagesA/paySuccess/paySuccess'
								})
							},
							"fail": function(res) {
								console.log(res)
							},
							"complete": function(res) {}
						})
					}
				})
			},
			payMoney() {
				if (this.value == '') {
					uni.showToast({
						title: "请输入金额",
						icon: "none",
						duration: 2000
					});
				} else {
					if (tenantId == '37121') {
						// 建行
						this.jhPay()
					} else if (tenantId == '37903') {
						// 官方微信
						this.wxPay()
					} else {
						// 第三方微信
						uni.$u.http.post('/card-littlemall/orderManage/placePay', {
							subOpenId: uni.getStorageSync('openid'),
							orderSn: 'recharge' + String(tenantId + this.time), //商户子订单号,自行生成
							goodsList: [],
							totalAmount: this.value,
							cardNo: this.cardNo, //卡号
							faNo: this.no, //充值方案号
						}).then(res => {
							let {
								timeStamp,
								nonceStr,
								packages,
								signType,
								paySign
							} = res.data
							if (timeStamp && nonceStr && packages && signType && paySign) {
								uni.getSetting({
									withSubscriptions: true,
									success: (res) => {
										uni.requestPayment({
											timeStamp,
											nonceStr,
											signType,
											paySign,
											provider: 'wxpay',
											package: packages,
											success() {
												uni.showToast({
													title: '充值成功',
													icon: "none",
													duration: 2000,
													success() {
														uni.switchTab({
															url: '/pages/tabbar/index/index'
														})
													}
												})
											},
											fail: () => {
												this.value = ''
												uni.showToast({
													title: '充值失败',
													icon: "none",
													duration: 2000
												})
											}
										})
									}
								})
							}
						})
					}
					
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.onlineRecharge {
		&>view:nth-child(2) {
			width: 95%;
			margin: 50rpx auto;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 15rpx;

			&>view:first-child {
				margin-bottom: 20rpx;
				font-size: 32rpx;
			}

			&>view:last-child {
				margin: 10rpx 0 0 20rpx;
				font-size: 24rpx;
				color: red;
			}
		}

		&>view:nth-child(3) {
			@include flex(row wrap);
			width: 95%;
			margin: 0 auto;

			view {
				margin: 20rpx 10rpx 0 13rpx;
				border: 2rpx solid gray;
				width: 21%;
				font-size: 24rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 15rpx;
			}
		}

		button {
			margin-top: 18%;
		}
	}
</style>
