<template>
	<view class="popup">
		<u-popup :show="isShow" @close="close" round="30" closeIconPos="top-right" closeable="false">
			<view class="mode">请选择支付方式</view>
			<view :style="{height:height}">
				<view class="radio">
					<radio-group @change="radio">
						<view v-for="(item,index) in choice" :key="index">
							<text :class="item[1]">{{item[0]}}</text>
							<radio :checked="index==0" :value="item[0]" color="red" />
						</view>
					</radio-group>
				</view>
				<view class="cardList" v-show="showCard || choice.length==1">
					<text>选择卡：</text>
					<radio-group @change='chooseCard'>
						<view v-for="(ite,ind) in cardNoList" :key="ind">
							<view>{{ite.card}}(余额：{{ite.cardye}})</view>
							<radio :checked="ind==0" :value="ite.card" color="red" />
						</view>
					</radio-group>
				</view>
			</view>
			<view class="button" @click="payMoney" v-text="choice.length==1 ? '卡支付': text">
			</view>
		</u-popup>
		<!-- 键盘 -->
		<u-popup :show="show" mode="center" @close="closeCode" round="30" closeIconPos="top-right" closeable="false">
			<view class="input">
				请输入密码
				<u-code-input v-model="value" :maxlength="6" dot :focus="focus" size="70" @finish="finish">
				</u-code-input>
			</view>
	
		</u-popup>

	</view>
</template>
<script>
	import {
		AppID,
		tenantId,
		WebSocketurl
	} from '@/config/baseUrl.js'
	import WebSocket  from '@/mixins/WebSocket.js'
	export default {
		name: "pay",
		mixins:[WebSocket],
		props: {
			pay: null,
			choice: {
				type: Array
			},
			isShow: {
				type: Boolean
			},
			cardNoList: {
				type: Array
			},
			cardlength: {
				type: Number
			},
			userlist: {
				type: String
			},
			reg: {
				type: String
			},
			ordersn: {
				type: String
			},
		},
		created() {
			console.log('支付方式',this.choice);
		},
		data() {
			return {
				height: getApp().globalData.equipment.screenHeight / 2 + 'px',
				text: "微信支付",
				// choice: [ //支付方式
				// 	['微信支付', "aj aj-weixinzhifu"],
				// 	['卡支付', 'aj aj-huiyuan']
				// ],
				show: false,
				value: '',
				busNo: '',
				orderSn: '',
				checked: false,
				cardList: [],
				card: 0,
				showCard: false,
				focus:false
				
			}
		},
		methods: {
			dayin() {
				this.getWEBdata('3102554895883253')
			},
			finish(val) {
				if (val.length == 6) {
					this.value = val
					uni.showLoading({
						title: '支付中...'
					})
					this.cardPay()
					uni.hideKeyboard()
					this.show = false
					this.focus = false
				}
			},
			closeCode() {
				this.show = false
				this.focus = false
				uni.hideKeyboard()
				if (this.pay[3] == "noe") { //若为true 不在跳转cancleOrder 反之判断数量跳转详情或我的订单
					uni.navigateTo({
						url: this.pay[5] == 1 ? `/pages/pagesA/goodsDetails/goodsDetails?id=${this.pay[4]}` :
							`/pages/pagesA/myOrder/myOrder?e=1`
					})
				} else {
					uni.navigateTo({
						url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${this.pay[1]}&deliveryFee=${this.pay[3]}&dizhi=${this.pay[4]}`
					})
				}
			},
			// 官方微信 tenantId ==37903   notifyUrl: NOTIFY_URL,
			wxPay() {
				this.$request.postCreateOrder({
					body: "创建订单",
					outTradeNo: this.pay[1]||'',
					totalFee: this.pay[2],
					spbillCreateIp: "127.0.0.1",
					notifyUrl: '',
					tradeType: "JSAPI",
					openid: uni.getStorageSync('openid')
				}, {
					"Content-Type": "application/json"
				}).then(res => {
					if (res.code == 200) {
						let datares = res.data
						let thiss1 = this
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: datares.timeStamp,
							nonceStr: datares.nonceStr,
							package: datares.packageValue,
							signType: datares.signType,
							paySign: datares.paySign,
							success: function(res) {
								if(WebSocketurl){
									// this.kaishi(this.userlist,this.reg,this.ordersn)
									this.getWEBdata(this.ordersn||this.orderSn)
								}
								uni.redirectTo({
									url: '/pages/pagesA/paySuccess/paySuccess'
								})
							},
							fail: function(err) {
								uni.navigateTo({
									url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${thiss1.pay[1]}&deliveryFee=${thiss1.pay[3]}&dizhi=${thiss1.pay[4]}`
								})
							}
						});
					}
				})
			},
			//建行 tenantId == 37121
			jhPay() {
				this.$request.orderPayment({
					mobile: uni.getStorageSync('userInfo').mobile,
					orderSn: this.pay[1],
				}).then(res => {
					this.$request.postJhPay({
						tenantId,
						orderSn: this.pay[1],
						payMoney: this.pay[2],
						busNo: res.busNo,
						type: 'pay', 
						elecCode: '', 
						tradeType: "MINIPRO",
						subAppId: AppID,
						subOpenId: uni.getStorageSync('openid'), //openid
						remark1: "web_order_pay" + this.pay[1],
						remark2: res.busNo,
					}, {
						"Content-Type": "application/json"
					}).then(dataRes => {
						let ress = JSON.parse(JSON.stringify(dataRes));
						if (ress.code == 200) {
							let data = ress.data
							let thiss = this
							uni.requestPayment({
								"timeStamp": data.timeStamp,
								"nonceStr": data.nonceStr,
								"package": data.package,
								"signType": data.signType,
								"paySign": data.paySign,
								"success": function(res) {
									if(WebSocketurl){
										// this.kaishi(this.userlist,this.reg,this.ordersn)
										this.getWEBdata(this.ordersn||this.orderSn)
									}
									uni.redirectTo({
										url: '/pages/pagesA/paySuccess/paySuccess'
									})
								},
								"fail": function(res) {
									uni.navigateTo({
										url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${thiss.pay[1]}&deliveryFee=${thiss.pay[3]}&dizhi=${thiss.pay[4]}`
									})
								},
								"complete": function(res) {}
							})
						}
					})
				})

			},
			// 卡支付
			cardPay() {
				if (this.choice.length == 1) {
					this.card = this.cardNoList[0].card
				}
				this.$request.orderPayment({
					mobile: uni.getStorageSync('userInfo').mobile,
					orderSn: this.pay[1],
				}).then(res => {
					this.orderSn = res.orderSn
					this.busNo = res.busNo
					if (this.cardlength == 0) {
						uni.showToast({
							title: '您还没有卡',
							icon: 'none'
						})
						return
					}
					if (this.cardNoList.length == 0 && this.cardlength != 0) {
						uni.showToast({
							title: '卡余额不足，请立刻充值',
							icon: 'none',
							mask: true
						})
						return
					}
					uni.$u.http.post('/card-littlemall/orderpay/benjinPay', {
						orderSn: this.orderSn,
						payMoney: (this.pay[2]*1).toFixed(2)*1,
						busNo: this.busNo, //业务号
						cardYe: '0.00',
						elecCode: '',
						jfCard: this.card, //积分卡号
						payCardNo: this.card, //支付卡号
						payPwd: this.value, //支付密码
					}).then(res => {
						uni.hideLoading();
						if (res.status == "success") {
							if(WebSocketurl){
								// this.kaishi(this.userlist,this.reg,this.ordersn)
								this.getWEBdata(this.ordersn||this.orderSn)
							}
							uni.navigateTo({
								url: "/pages/pagesA/paySuccess/paySuccess"
							})
						} else {
							let _this = this
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000,
							})
							if(res.message.includes('没有足够的余额支付')){
								uni.showModal({
									title: '当前卡余额不足',
									content: '是否前去充值',
									success: function (res) {
										if (res.confirm) {
											uni.navigateTo({
												url:'/pages/pagesB/cardRecharge/cardRecharge'
											})
										} else if (res.cancel) {
											// setTimeout(() => {
												_this.value = ''
												uni.navigateTo({
													url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${_this.orderSn}&deliveryFee=${_this.pay[3]}&dizhi=${_this.pay[4]}`
												})
											// }, 1500);
										}
									}
								});
							}
							ateTo({url:`/pages/pagesA/cancleOrder/cancleOrder?orderSn=${this.orderSn}&deliveryFee=${this.pay[3]}&dizhi=${this.pay[4]}`})
						}
					})

				})
			},
			radio(e) {
				this.text = e.detail.value
				if (this.text == '卡支付') {
					if(this.cardNoList.length==0){
						
						uni.showModal({
							title: '提示',
							content: '您还没有卡或者未绑卡',
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}else{
						this.card = this.cardNoList[0].card
						this.showCard = true
					}
			
					
				} else {
					this.showCard = false
				}
			},
			chooseCard(e) {
				this.card = e.detail.value
			},
			payMoney() {
				if(this.choice.length==1&&this.choice[0][0]=='卡支付'&&this.cardNoList.length==0){
					uni.showModal({
						title: '提示',
						content: '您还没有卡或者未绑卡',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return
				}
				if(this.text == '卡支付'&&this.cardNoList.length==0){
					uni.showModal({
						title: '提示',
						content: '您还没有卡或者未绑卡',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return
				}
				this.$emit("update:isShow", false)
				// 获取用户的当前设置，判断是否点击了“总是保持以上，不在询问”
				let that = this
				uni.getSetting({
					withSubscriptions: true, //是否获取用户订阅消息的订阅状态，默认false不返回
					success(res) {
						if (res.authSetting['scope.subscribeMessage']) {
							uni.openSetting({
								// 打开设置页
								success(resSet) {
								}
							});
						} else {
							// 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
							uni.requestSubscribeMessage({
								tmplIds: ['WxMNVW4Ffm_W7FZOvgmlFipL6Z5pOanXDlO5K3xCJI8'], //你自己的模板id
								success(res) {
									if (res['WxMNVW4Ffm_W7FZOvgmlFipL6Z5pOanXDlO5K3xCJI8'] == 'accept') {
										console.log('成功')
									} else {
										console.log('失败')
									}
								},
								complete(res) {
									if (that.text == "微信支付" && that.choice.length != 1) {
										if (tenantId == '37121') {
											// 建行
											that.jhPay()
										} else if (tenantId == '37903') {
											// 官方微信
											that.wxPay()
										} else {
											// 第三方微信
											console.log('我用微信支付了啊',this.ordersn||this.orderSn);
											that.$store.dispatch('payMoney', [that.pay[1]||'', that.pay[2],
												that.pay[3], that.pay[4], that.pay[5]
											],this.orderSn)
										}
									} else { //卡支付
										that.show = true
										that.focus = true
										that.value = ''
									}
								}
							});
						}
					}
				});
			},
			close() {
				if (this.pay[3] == "noe") { //若为true 不在跳转cancleOrder 反之判断数量跳转详情或我的订单
					uni.navigateTo({
						url: this.pay[5] == 1 ? `/pages/pagesA/goodsDetails/goodsDetails?id=${this.pay[4]}` :
							`/pages/pagesA/myOrder/myOrder?e=1`
					})
				} else {
					if (this.pay[1] == 'daifukuan') {
						uni.navigateTo({
							url: `/pages/pagesA/myOrder/myOrder?e=1`
						})
						return
					}
					uni.navigateTo({
						url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${this.pay[1]}&deliveryFee=${this.pay[3]}&dizhi=${this.pay[4]}`
					})
				}
			},
			// WebSocketfasong(){
			// 	// this.$store.dispatch('WEBSOCKET_INIT', 'wss://microapp.aijiamart.cn/socket')
			// 	this.ordersn = '3102440750831523'
				
			// 	let list = this.userlist
			// 	let arr = list.split(',');
			// 	this.$store.dispatch('WEBSOCKET_SEND', this.reg)
			// 	for(var i = 0 ; i<arr.length ;i++){
			// 		console.log(arr[i])
			// 		console.log(this.ordersn)
			// 		this.$store.dispatch('WEBSOCKET_SEND', `customer|order|${arr[i]}_admin|小伙伴！你有新的订单需要处理orderSn=${this.ordersn}`)
			// 	}
			// 	// this.$store.dispatch('CLOSE_SOCKET')
			// }
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.cardList {
		width: 95%;
		border: 1rpx solid #dcd7d7;
		margin: 0 auto;
		border-radius: 10rpx;

		view {
			width: 90%;
			margin: 0 auto;
			padding: 5rpx 0;
			display: flex;
			justify-content: space-between;

			view {
				height: 50rpx;
				line-height: 50rpx;
			}
		}
	}

	.popup {
		.mode {
			margin: 66rpx auto;
			font-size: 35rpx;
			font-weight: 900
		}

		.radio {
			@include radio;
		}

		.button {
			--height: 75rpx;
			width: 100%;
			height: var(--height);
			line-height: var(--height);
			font-size: 37rpx;
			text-align: center;
			color: #fff;
			background: linear-gradient(90deg, #fe9458 15%, #fd2434 100%);
			border-radius: 50rpx;
			margin-bottom: 10rpx;
		}

		.input {
			width: 95%;
			text-align: center;
			margin: 0 auto;
			margin-top: 66rpx;
			margin-bottom: 66rpx;
		}
	}
</style>
