<template>
	<view class="order-detail-wrap u-skeleton">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" :title="title"></uni-nav-bar>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<view class="body">
			<view class="time-wrap u-skeleton-fillet" v-if="timeShow==0">
				<view class="time" v-if="isShow == 0">
					订单剩余支付时间
					<view>
						<u-count-down ref="countDown" :time="countDown" format="mm:ss" @finish="finish"></u-count-down>
					</view>
				</view>
				<text v-if="isShow == 0">10分钟内未支付，订单将自动取消</text>
				<!-- 如果订单超时未支付，显示 -->
				<view class="timebutton" v-if="isShow ==0">
					<view class="cancel" @click="cancleOrder">
						取消订单
					</view>
					<view class="pay" @click="Pay">
						付款
					</view>
				</view>
				<view class="canceled" v-if="isShow ==1">
					订单已取消
					<!-- {{orderDetail.orderStatus}} -->
				</view>
			</view>
			<view class="address-wrap u-skeleton-fillet">
				<view class="address-username" v-if="orderDetail.deliveryMethodName == '配送上门'">
					<text>收货人：</text> {{ orderDetail.shipName }}
				</view>
				<view class="address-phone" v-if="orderDetail.deliveryMethodName == '配送上门'">
					<text>联系方式：</text> {{ orderDetail.shipMobile }}
				</view>
				<view class="address-detail" v-if="orderDetail.deliveryMethodName != '上门自提'">
					<text> 收货地址：</text>{{address}}
				</view>
				<view class="address-detail" v-else>
					<text> 提货地点：</text>{{orderDetail.selfgetAreaName}}
					<!-- 二维码 -->
					<view class="qr-box" v-if="orderDetail.orderStatus == '等待收货'">
						<text>自提核销码：</text>
						<canvas v-if="qrshow" canvas-id="qrcode"
							:style="{ width:'150px', height:'150px',margin:'0 auto'}" />
						<image v-else :src="imgurl"
							:style="{ width:'150px', height:'150px',display:'block',margin:'0 auto'}"></image>
					</view>
				</view>
			</view>
			<view class="detail-goods u-skeleton-fillet">
				<view class="order-list" v-for="order in orderDetail.item" :key="order.id" @click="go(order)">
					<view class="image">
						<image style="width: 150rpx; height: 150rpx;border-radius: 15rpx;" :src="order.pic"
							mode="aspectFill"></image>
					</view>
					<view class="text">
						<view style="color: #999; font-weight: normal;font-size: 28rpx;">
							条码：<text style="color: #000;">{{order.barcode}}</text>
						</view>
						<view class="name">
							<view>
								<text>商品名称：</text>
								<text>{{order.name}}</text>
							</view>
						</view>
						<view class="title">
							<view>
								<text style="color: #999;">价格：</text>
								<text v-if="isWeipuShop==1 && order.price>0"><text>{{order.cost}}</text>+{{order.price}}红包</text>
								<text style="color: red;" v-else>￥{{order.goodPrice}}</text>
							</view>
							<view>
								<text style="color: #999;">数量：</text>
								<text>*{{ order.quantity }}</text>
							</view>
						</view>
						<view v-if="order.tagSign!=''">
							<text style="color: red;">{{order.tagSign}}</text>
						</view>
					</view>
				</view>
				<view class="deliveryMethodName">
					<text>配送方式：</text>
					<text>{{orderDetail.deliveryMethodName}}</text>
				</view>
				<view class="deliveryMethodName">
					<text>订单状态：</text>
					<text>{{orderDetail.orderStatus}}</text>
				</view>
				<view class="tuihuo" v-if="showth">
					<text @click="afterSales">申请退货</text>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="notice-box u-skeleton-fillet">
				<view class="notice-box__content ">
					<view class="notice-item--center">
						<text class="title">订单编号：</text>
						<text class="detail">{{ orderDetail.orderSn || 0 }}</text>
						<button class="copy-btn" @tap="onCopy( orderDetail.orderSn )">复制</button>
					</view>
					<view class="notice-item ">
						<text class="title">下单时间：</text>
						<text class="detail ">{{ orderDetail.createDate || 0 }}</text>
					</view>
					<view class="notice-item ">
						<text class="title">支付方式：</text>
						<text class="detail">{{ orderDetail.paymentMethodName || 0}}</text>
					</view>
				</view>
			</view>
			<!--  价格信息 -->
			<view class="price u-skeleton-fillet">
				<view v-if="orderDetail.jfPrice == 0" class="notice-item">
					<text class="title">商品总额</text>
					<text class="detail rt">￥{{orderDetail.goodsTotalPrice || 0}}</text>
				</view>
				<view v-else class="notice-item">
					<text class="title">商品总额</text>
					<text class="detail rt">{{orderDetail.jfPrice}}积分<text
							v-show="orderDetail.syMoney!= 0">+￥{{orderDetail.syMoney}}现金</text></text>
				</view>
				<view class="notice-item">
					<text class="title">运费</text>
					<text class="detail rt">￥{{ orderDetail.deliveryFee|| 0 }}</text>
				</view>
				<view class="notice-item">
					<text class="title">优惠金额</text>
					<text class="detail rt">-￥{{ orderDetail.reduceMoney || 0 }}</text>
				</view>
				<view class="notice-item">
					<text class="title">需付款</text>
					<text class="detail rt" v-if="orderDetail.jfPrice == 0">￥{{allmoney || 0}}</text>
					<text class="detail rt" v-else>{{orderDetail.jfPrice}}积分<text
							v-show="jftotalAmount!=0">+￥{{jftotalAmount || 0}}</text></text>
				</view>
				<view class="notice-item">
					<text class="title">共{{ list || 0 }}件商品 合计:</text>
					<text class="detail rt" v-if="orderDetail.jfPrice == 0">￥{{allmoney || 0}}</text>
					<text class="detail rt" v-else>{{orderDetail.jfPrice}}积分<text
							v-show="jftotalAmount!=0">+￥{{jftotalAmount || 0}}</text></text>
				</view>
			</view>
		</view>
		<pay :pay="pay" :isShow.sync="show" :cardNoList="cardNoList" :choice="choice" :cardlength='cardlength'></pay>
	</view>
</template>
<script>
	import uQRCode from "@/components/uQRCode/uQRCode.js"
	export default {
		data() {
			return {
				orderDetail: {},
				list: null, //商品数量
				pay: null, //控制弹出层
				text: "微信支付",
				loading: true, //控制骨架屏是否显示
				address: null, //地址
				totalAmount: 0, //合计
				a: '', //判断跳的页面
				isShow: 0, //待支付：0，未支付超时：1，支付完成：2
				times: 0, //下单时间
				countDown: 0, //倒计时
				title: "",
				timeShow: 1,
				show: false, //支付弹出
				jftotalAmount: 0, //积分商品
				allmoney: 0,
				choice: [ //支付方式
					['微信支付', "aj aj-weixinzhifu", "weixinPay"],
					['卡支付', 'aj aj-huiyuan', "cardPay"]
				],
				cardNoList: [],
				showth: false,
				cardlength: 0,
				imgurl: '',
				qrshow: true,
				isWeipuShop:uni.getStorageSync('isWeipuShop')// isWeipuShop == 1展示红包
			}
		},
		onHide() {
			this.show = false
			if(this.countDown != 0){
				this.$refs.countDown.start()
			}
		},
		onShow() {
			this.title = ""
			this.id = "" //删除订单传参
			this.thlist = []
			this.flag = true
			this.$request.getView({
				isZero: false,
				mobile: uni.getStorageSync('userInfo').mobile,
				openId: uni.getStorageSync('openid'),
				orderId: this.orderSn
			}).then(res => {
				if (res.code != 200) {
					uni.showToast({
						title: res.msg,
						icon: "none",
						mask: true
					})
					return
				}
				this.allmoney = res.data.yfMoney.toFixed(2)
				this.orderDetail = res.data.order
				this.orderDetail.item = res.data.goodsList
				this.orderDetail.item.forEach((val, index1) => {
					if (val.refundNum == '0') {
						this.thlist.push(val.refundNum)
					}
					res.data.orderItemList.forEach((item, index2) => {
						if (val.id == item.goodsId) {
							this.orderDetail.item[index1]['quantity'] = res.data.orderItemList[
								index2].quantity
							this.orderDetail.item[index1]['goodPrice'] = res.data.orderItemList[
								index2].price
						}
					})
				})
				if (this.thlist.length != this.orderDetail.item.length && this.orderDetail.orderStatus == '交易完成' &&
					this.orderDetail.jfPrice == 0) {
					this.showth = true
				}
				if (this.orderDetail.deliveryMethodName == '上门自提' && this.orderDetail.orderStatus == '等待收货') {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: res.data.code,
						size: 150,
						margin: 0,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						errorCorrectLevel: uQRCode.errorCorrectLevel.H,
						success: res => {
							this.imgurl = res
							this.qrshow = false
						}
					})
				}
				this.id = this.orderDetail.id
				this.list = this.orderDetail.item.length
				// 运费
				if (this.orderDetail.deliveryMethodName != "上门自提") {
					this.address = this.orderDetail.areaPathName + this.orderDetail.address
					// this.orderDetail.goodsTotalPrice=Number(this.orderDetail.goodsTotalPrice)
					this.jftotalAmount = Number(this.orderDetail.syMoney)
				}
				this.totalAmount = Math.floor(this.orderDetail.totalAmount * 100) / 100 //考虑精确度问题
				// this.orderDetail.goodsTotalPrice=Math.floor(this.orderDetail.goodsTotalPrice*100)/100
				this.jftotalAmount = Number(this.orderDetail.syMoney) + Number(this.orderDetail.deliveryFee)
				if (this.orderDetail.orderStatus == "等待付款") {
					this.title = "等待买家付款"
					this.timeShow = 0
					// 下单时间
					this.times = this.orderDetail.createDate
					// let time = Date.parse(this.times);
					//转换时间戳兼容Android和ios
					let time = new Date(this.times.replace(/-/g, '/')).getTime();
					// 现在时间
					let nowtime = Date.now();
					// 十分钟
					let time1 = time + 600000
					time1 - nowtime > 0 ? this.countDown = time1 - nowtime : this.countDown = 0
				} else {
					this.title = "订单"
					this.timeShow = 1
				}
				setTimeout(() => {
					this.loading = false
				}, 1200);
			})
		},
		onLoad(option) {
			this.a = option.a
			this.orderSn = option.orderSn
		},
		methods: {
			// 点击跳转详情
			go(e){
				if(e.sshopId==9999){
					uni.redirectTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e.id}_${e.sshopId}`
					})
				}else{
					if (e.jfPrice == 0) {
						if (e.type == 1) {
							uni.navigateTo({
								url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.id}_${e.sshopId}&msprice=${e.price}&spickId=${e.spikeId}`
							})
						} else {
							uni.navigateTo({
								url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.id}_${e.sshopId}`
							})
						}
					
					} else {
						uni.navigateTo({
							url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.id}_${e.sshopId}`
						})
					
					}
				}
			},
			finish() {
				// 时间到删除订单
				if(this.flag == false)return
				this.flag = false
				this.$request.cancelOrder({
					mobile: this.mobile,
					orderId: this.id
				}).then(res => {
					uni.showToast({
						title: "订单已取消",
						icon: "none",
						duration: 2000
					})
					this.title = "交易结束"
					this.isShow = 1
				})
			},
			// 申请售后
			afterSales() {
			// 数据太大 带不过去 只能存在本地 然后再去下个页面获取  然后再删除
				uni.setStorageSync('orderDetail',JSON.stringify(this.orderDetail))
				uni.navigateTo({
					url: `/pages/pagesA/afterSales/afterSales?money=${this.allmoney}`
				})
			},
			// 取消订单
			cancleOrder() {
				uni.showModal({
					title: '是否取消订单',
					success: res => {
						if (res.confirm) {
							this.$request.cancelOrder({
								mobile: this.mobile,
								orderId: this.id
							}).then(res => {
								uni.showToast({
									title: "订单已取消",
									icon: "none",
									duration: 2000
								})
								this.title = "交易关闭"
								this.isShow = 1
							})
						}
					}
				})
			},
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
			back() {
				let id = this.orderDetail.storeId || this.orderDetail.item[0].sshopId
				if(this.list == 1 && this.a != '1'){
					uni.navigateTo({
						url: `/pages/pagesA/goodsDetails/goodsDetails?id=${this.orderDetail.item[0].id}_${id}`
					})
				}else{
					uni.navigateTo({
						url: '/pages/pagesA/myOrder/myOrder?e=0'
					})
				}
			},
			Pay() {
				this.$refs.countDown.pause();
				this.show = true
				let goodsList = null
				if (this.orderDetail.jfPrice != 0) {
					goodsList = String(this.jftotalAmount)
				} else {
					if (this.list == 1) {
						goodsList = String(this.allmoney)
					} else {
						goodsList = String(this.allmoney)
					}
				}
				if (goodsList == 0 && this.orderDetail.jfPrice != 0) {
					this.choice = [
						['卡支付', 'aj aj-huiyuan', "cardPay"]
					]
				}
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
					let cards = []
					res.cards.forEach(item => {
						if (item.isBind == 1) {
							cards.push(item.cardNo)
						}
					})
					this.cardlength = cards.length
					this.cardNoList = []
					cards.forEach((item) => {
						this.$request.postGetCardsByYe({
							cardNo: item
						}).then(res => {
							let cardYe = res.dye
							if (this.orderDetail.jfPrice == 0) {
								if (Number(cardYe) >= Number(goodsList)) {
									this.cardNoList.push({
										card: item,
										cardye: cardYe
									})
								}
							} else {
								this.cardNoList.push({
									card: item,
									cardye: cardYe
								})
							}
						});
					})
				});
				this.pay = [true, this.orderSn, goodsList, "noe", this.orderDetail.item[0].id + "_" + this.orderDetail
					.item[0].sshopId, this.list
				]
			},
		}
	};
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.u-count-down__text {
		color: #c03e67 !important;
	}

	.tuihuo {
		padding: 20rpx 0;

		text {
			margin-left: 77%;
			padding: 7px;
			background-color: #F0F0F0;
			border-radius: 5px;
			font-size: 26rpx;
		}
	}

	.body {
		width: 95%;
		margin: 0 auto;
	}

	.order-detail-wrap {
		.rt {
			float: right;
		}

		.time-wrap {
			margin: 20rpx 0;
			border-radius: 15rpx;
			padding: 20rpx;
			background-color: #fff;
			line-height: 50rpx;

			.time {
				display: flex;

				view {
					width: 130rpx;
					text-align: center;
					color: #c03e67;
					font-weight: 600;
				}
			}

			&>text {
				color: #707070;
				font-size: 28rpx;
			}

			.timebutton {
				display: flex;
				margin-top: 10rpx;

				.cancel,
				.pay {
					width: 150rpx;
					height: 60rpx;
					color: #707070;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
					border: 1rpx solid #c3c3c3;
					border-radius: 30rpx;
				}

				.pay {
					color: #c03e67;
					border: 1rpx solid #c03e67;
					margin-left: 30rpx;
				}
			}

			.canceled {
				padding: 10rpx 0;
				// text-align: center;
				font-size: 35rpx;
			}

		}

		/* 收货地址 */
		.address-wrap {
			border-radius: 15rpx;
			padding: 20rpx;
			background-color: #fff;
			line-height: 50rpx;

			view {
				color: #333;
				font-size: 26rpx;

				text {
					color: #999;
					font: 28rpx;
				}
			}
		}

		.detail-goods {
			margin: 20rpx 0;

			background-color: #fff;
			border-radius: 15rpx;
			padding: 5rpx;

			.deliveryMethodName {
				line-height: 70rpx;
				border-radius: 10rpx;
				padding-left: 20rpx;
				font-size: 26rpx;

				& text:nth-child(1) {
					color: #8f8f8f;
				}

				& text:nth-child(2) {
					color: #707070;
				}
			}

			.order-list {
				// margin-bottom: 20rpx;
				background-color: #fff;
				padding: 20rpx;
				display: flex;
				line-height: 50rpx;
				border-radius: 15rpx;

				.text {
					width: 100%;
					margin-left: 20rpx;

					.name {
						view {
							& text:nth-child(1) {
								font-size: 28rpx;
								color: #999;
							}

							& text:nth-child(2) {
								font-size: 26rpx;
								color: #333;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								text-overflow: ellipsis;
								overflow: hidden;
							}
						}
					}

					.title {
						display: flex;
						justify-content: space-between;
						align-items: center;

						text {
							font-size: 28rpx;
						}
					}
				}
			}
		}

		// 收货信息、订单信息。
		.notice-box {
			background: #fff;
			margin-bottom: 20rpx;
			margin-bottom: 20rpx;

			background-color: #fff;
			border-radius: 15rpx;

			.notice-box__head {
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 80rpx;
				border-bottom: 1rpx solid #dfdfdf;
				padding: 0 25rpx;
			}

			.notice-box__content {
				padding: 25rpx;
			}

			.notice-item--center {
				margin-bottom: 10rpx;
			}

			.notice-item,
			.notice-item--center {
				height: 50rpx;
				align-items: flex-start;

				.title {
					font-size: 28rpx;
					color: #999;
					text-align: justify;
					text-align-last: justify;
					text-justify: distribute-all-lines;
					width: 140rpx;
				}

				.detail {
					font-size: 28rpx;
					color: #333;
					flex: 1;
				}

				.copy-btn {
					width: 100rpx;
					line-height: 50rpx;
					border-radius: 25rpx;
					background: rgba(238, 238, 238, 1);
					font-size: 22rpx;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					position: absolute;
					right: 0;
					top: 0;
				}
			}

			.notice-item--center {
				align-items: center;
				position: relative;
			}
		}

		// 订单价格信息
		.price {
			background-color: #fff;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 15rpx;
			padding-top: 20rpx;
			padding-bottom: 20rpx;

			.notice-item {
				height: 50rpx;
				width: 95%;
				margin: 0 auto;

				.title {
					font-size: 28rpx;
					color: #999;
				}

				.detail {
					font-size: 28rpx;
					color: #333;
				}
			}
		}



		// .foot_box {
		// 	width: 100%;
		// 	min-height: 100rpx;
		// 	background: rgba(255, 255, 255, 1);
		// 	display: flex;
		// 	flex-direction: column;
		// 	align-items: flex-end;
		// 	position: fixed;
		// 	bottom: 0;
		// 	.money-box {
		// 		height: 60rpx;
		// 		padding: 0 20rpx;
		// 		.money-title {
		// 			font-size: 26rpx;
		// 			color: #999999;
		// 		}

		// 		.all-price {
		// 			color: #333;
		// 			font-size: 26rpx;
		// 		}
		// 	}
		// 	.btn{
		// 		    width: 188rpx;
		// 		    height: 65rpx;
		// 		    background-color: #ff5500;
		// 		    color: #ffffff;
		// 		    font-size: 31rpx;
		// 		    line-height: 65rpx;
		// 		    border-radius: 10rpx;
		// 			margin-right: 57rpx;
		// 	}
		// }


	}
</style>
