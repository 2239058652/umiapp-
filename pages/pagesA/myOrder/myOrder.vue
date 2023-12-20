<template>
	<view class="myOrder">
		<!-- 导航栏 -->
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="我的订单" left-icon="back"></uni-nav-bar>
		<!-- 全屏选项卡 -->
		<u-tabs :list="tabs" lineColor="#fe6850" lineWidth="60" lineHeight="7"
			:activeStyle="{color:'#fe6850',fontWeight:'bold'}" @change="cangeIndexes" :current="current">
		</u-tabs>
		<!-- 滑块 -->
		<swiper easing-function="easenInOubic" :current="swiperCurrent" :style="{Height:Height+'px'}"
			@change="cangeIndexes">
			<swiper-item v-for="(t,i) in tabs" :key='i'>
				<scroll-view class="scroll" scroll-y @scrolltolower="scrollbottom">
					<!-- 数据为空 不能写在scroll-view外边-->
					<u-empty mode="order" :show="emptyShow" icon-size="250" font-size="35" margin-top="150"
						textSize="34" text="订单为空"></u-empty>

					<view class="page" v-for="(item,index) in list" :key='index'>
						<!-- 配送方式 订单编号 -->
						<view class="storeName">{{item.orderStoreName}}</view>
						<view class="item">
							<text
								:style="{backgroundColor:(item.deliveryMethodName=='配送上门'?'#fc9c06':'#41c655')}">收货方式：{{ item.deliveryMethodName }}</text>
							<text class="staname">{{item.orderStatus}}</text>
						</view>
						<!-- 商品图片 名称 价格 数量 -->
						<view class="page-box" v-for="item1 in item.list" :key="item1.goodsId">
							<image :src="item1.pic" mode="aspectFit" :lazy-load="true" @click="goOrderdetails(item1)">
							</image>
							<view class="box">
								<view class="name"> 订单编号：{{ item.orderSn }}</view>
								<view class="name" @click="goOrderdetails(item1)">名称：{{item1.goodsName }}</view>
								<view class="but" @click="goOrderdetails(item1)">
									<text class="price" v-if="item1.jfPrice == 0">价格:￥{{ item1.price }}<text
											class="miaosha" v-if="item1.type == 1">秒杀</text></text>
									<text class="price" v-else>价格:￥{{item1.goodsPrice}}</text>
									<text class="quantity">数量：*{{ item1.quantity }}</text>
								</view> 
								<text v-show="current==0&&item.deliveryMethodName=='配送上门'" class="zlall"
									@click="godetails(item1)">再买一次</text>
								<text v-show="current==0&&item.orderStatus=='等待收货'" class="zlal2" @click="ditu(item1)">查看配送</text>
								<!-- <text  class="zlal2" @click="ditu(item1)">查看配送</text> -->
							</view>
						</view>
						<view class="end">
							<view class="all">合计：
								<text v-if="item.list[0].jfPrice == 0">￥{{ item.allmaney }}</text>
								<text v-else>{{item.list[0].jfPrice}}积分<text
										v-show="item.jftotalAmount != 0">+￥{{item.jftotalAmount}}</text></text>
							</view>
							<!-- 按钮 -->
							<view class="button">
								<text class="right" @click="left(t.leftName,item.orderId)"
									v-show=" t.leftName == undefined? false : true ">{{ t.leftName }}</text>
								<text class="peisong" v-show="current==4&&item.deliveryMethodName=='配送上门'" @click="ditu(item)">查看配送</text>
								<text class="right" @click="right(t.rightName,item.orderId,item.orderSn)"
									v-show=" t.rightName == undefined? false : true ">{{t.rightName}}</text>
							</view>
							<!-- <text @click="delclick(index)" >。。。</text> -->
							<uni-icons v-if="item.isDelete ==1" @click="delclick(index,item)" type="trash-filled"
								size="25" color='#cc080c'></uni-icons>
							<!-- <view :class="[delnum==index?'aaa':'bbb','delcss']">删除订单</view> -->
						</view>
					</view>
					<u-loadmore v-if="isShow" fontSize="30" color="#818181" :loading-text="loadingText"
						:nomore-text="nomoreText" height="35" line :status="sta" />
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.peisong {
		background-color: #fff;
		padding: 7rpx 25rpx;
		font-size: 25rpx;
		border-radius: 20rpx;
		border: 1rpx solid red;
		color: red;
		margin-right: 20rpx;
	}

	.aaa {
		display: block;
	}

	.bbb {
		display: none;
	}

	.delcss {
		width: 129rpx;
		height: 56rpx;
		background: #42b983;
		position: absolute;
		right: 79px;
		margin-top: -3rpx;
		text-align: center;
		line-height: 56rpx;
		border-radius: 20rpx;
	}

	.myOrder {
		.miaosha {
			color: #fff !important;
			background-color: red;
			font-size: 23rpx;
			padding: 5rpx;
			border-radius: 5rpx;
			margin-left: 9rpx;
		}

		.storeName {
			margin-bottom: 10rpx;
			font-size: 35rpx;
			font-weight: 600;
		}

		.zlal2 {
			background-color: #fff;
			padding: 7rpx 25rpx;
			font-size: 25rpx;
			border-radius: 20rpx;
			border: 1rpx solid red;
			color: red;
			float: right;
			margin-top: 20rpx;
			margin-right: 20rpx;
		}

		.zlall {
			background-color: #fff;
			padding: 7rpx 25rpx;
			font-size: 25rpx;
			border-radius: 20rpx;
			border: 1rpx solid red;
			color: red;
			float: right;
			margin-top: 20rpx;
		}


		.scroll {
			height: 100%;
		}

		.page {
			width: 90%;
			margin: 15rpx auto;
			border-radius: 15rpx;
			background-color: #ffffff;
			padding: 20rpx;
			font-size: 25rpx;

			.item {
				@include flex(row nowrap, space-between, center)>text:first-child {
					padding: 5rpx;
					border-radius: 10rpx;
				}
			}

			.staname {
				color: red;
			}

			.page-box {
				display: flex;
				margin: 10rpx 0;

				image {
					@include image(150rpx, 150rpx) margin-right: 20rpx
				}

				.box {
					width: 75%;
					padding-top: 15rpx;

					.name {
						font-size: 28rpx;
					}

					.but {
						@include flex(row nowrap, space-between)>text:first-child {
							color: red;
							font-size: 28rpx;
						}
					}
				}
			}

			.end {
				@include flex(row nowrap, space-between) .all {
					text {
						color: red;
						font-size: 28rpx;
					}
				}

				.button {
					text {
						padding: 7rpx 25rpx;
						font-size: 25rpx;
						border-radius: 20rpx;
					}

					.left {
						margin-right: 20rpx;
						background-color: #f0f0f0;
						color: #333;
					}

					.right {
						color: #fff;
						background-color: #42b983;
					}
				}
			}
		}
	}
</style>

<script>
	import mixin from '@/mixins/mixin.js'
	import WebSocket from '@/mixins/WebSocket.js'
	import {
		AppID,
		tenantId,
		WebSocketurl
	} from '@/config/baseUrl.js'
	export default {
		mixins: [mixin, WebSocket],
		data() {
			return {
				list: [], //商品
				current: 0, //tabs索引 设置为null在onLoad的时候执行reorder
				swiperCurrent: 0, //swiper索引值
				emptyShow: false, //u-empty是否展示
				Height: getApp().globalData.equipment.windowHeight, //swiper高度值
				delflag: false, //控制删除按钮的控制与隐藏
				delnum: null, // 控制是否删除的 判断跟索引是否相同的
				num: 0, //控制双击隐藏删除按钮的 
				tabs: [{
						name: '全部订单',
					},
					{
						name: '待付款',
						leftName: "取消订单"
					},
					{
						name: '待确认',
						rightName: "取消订单",
					},
					{
						name: '待配送',
						rightName: "申请退款",
					},
					{
						name: '待收货',
						rightName: "确认收货",
					},
					{
						name: "评价",
						rightName: "评论"
					}
				],
				sta: 'loading',
				loadingText: '努力加载中',
				nomoreText: '到底了',
				isShow: false,
				isWeipuShop: uni.getStorageSync('isWeipuShop'),
				_mobile: uni.getStorageSync('userInfo').mobile,
				xuan_index: ''
			};
		},
		onShow() {

			// this.reorder()
			// if(this.xuan_index==''){
			this.reorder()
			// }
		},
		onLoad(option) {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			} else {
				this.index = 1 //加载页数
				this.orderId = 0 //订单
				this.listlength = 0, //商品数量 
					this.mobile = uni.getStorageSync('userInfo').mobile
				option.e == 0 && this.reorder(option.e)
				this.current = this.swiperCurrent = option.e
				// this.reorder()
			}
			let arr = ["", "wait_buyer_pay", "unconfirm", "wait_seller_send_goods",
				"wait_buyer_confirm_goods", "trade_finished"
			]

			let xuan = arr[option.e]
			this.xuan_index = xuan
		},
		methods: {
			ditu(ite) {
				console.log('地图', ite);
				this.$request.postdistribution_H5({
					orderSn:ite.orderSn
				}, {
					'Content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.url) {
						console.log('地图',res.url);
						let url33 = res.url
						var hhh = url33
						hhh = hhh.substr(hhh.indexOf('?') + 1);
						hhh = hhh.split('&');
						var vars = {};
						for (var i = 0; i < hhh.length; i++) vars[hhh[i].substr(0, hhh[i].indexOf('='))] =
							decodeURI(hhh[i].substr(hhh[i].indexOf('=') + 1));
						uni.navigateTo({
							// url: `/pages/pagesA/ditu/ditu?order=${vars.order}&sn=${url33}`
							url: `/pages/pagesA/ditu/ditu?order=${vars.order}&sn=${url33}`
						})
					}

				})

			},
			delclick(index, item) {
				this.delnum = index
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '删除后无法恢复哦~',
					success: function(res) {
						if (res.confirm) {

							console.log('用户点击确定', index, item);
							that.$request.getisDelete({
								orderSn: item.orderSn,
							}).then(res => {
								// console.log('');
								if (res.code == 200) {
									uni.showToast({
										title: res.message,
										duration: 2000,
										icon: 'none'
									});
									that.list.splice(index, 1)
								} else {
									uni.showToast({
										title: res.message,
										duration: 2000,
										icon: 'none'
									});
								}

							})
							that.list.splice(index, 1)

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				// this.num++
				// if(this.num%2==0){  //双击隐藏
				// 	this.delnum = null
				// }
			},
			cangeIndexes(e) {
				this.list = {}
				this.index = 1
				try {
					this.current = e.detail.current
					this.reorder(this.current)
				} catch (err) {
					this.swiperCurrent = e.index
				}
			},
			goOrderdetails(item) {
				uni.navigateTo({
					url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${item.orderSn}&a=1`
				})
			},
			back() {
				uni.switchTab({
					url: '/pages/tabbar/my/my'
				})
			},
			left(item, id) {
				if (item == "取消订单") {
					uni.showModal({
						title: '是否取消订单',
						success: res => {
							if (res.confirm) {
								this.$request.cancelOrder({
									mobile: this.mobile,
									orderId: id
								}).then(res => {
									if (res.code == 200) {
										let _this = this
										uni.showToast({
											title: '订单取消成功',
											icon: 'none',
										})
										setTimeout(() => {
											_this.list = []
											_this.reorder()
										}, 1500);
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none',
										})
									}
								})
							}
						}
					})
				}
			},
			right(item, orderId, orderSn) { //考虑其他按钮
				if (item == "取消订单" || item == "申请退款") {
					uni.showModal({
						title: '是否取消订单',
						success: res => {
							if (res.confirm) {
								this.$request.cancelUnconfirm({
									mobile: this.mobile,
									orderId: orderId
								}).then(res => {
									if (res.code == 200) {
										let thats = this
										uni.showToast({
											title: '订单取消成功',
											icon: 'none',
										})
										if (WebSocketurl) {
											this.getWEBdata(orderSn, 2)
										}
										setTimeout(() => {
											thats.list = []
											thats.reorder()
										}, 1500);
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none',
										})
									}
								})
							}
						}
					})
				} else if (item == '确认收货') {
					uni.showModal({
						title: '是否确认收货',
						success: res => {
							if (res.confirm) {
								this.$request.confirmGoods({
									mobile: this.mobile,
									orderId: orderId
								}).then(res => {
									if (res.code == 200) {
										uni.showToast({
											title: '已确认收货',
											icon: 'none',
										})
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none',
										})
									}
								})
							}
						}
					})
				} else {

				}
			},
			// 判断再来一单点击的商品 判断是否属于店铺9999(微铺) 不好 但是没太多时间整理
			// 跳转详情
			godetails(e) {
				if (e.shopId == 9999) {
					uni.navigateTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e.goodsId}_${e.shopId}`
					})
				} else {
					if (e.jfPrice == 0) {
						if (e.type == 1) {
							uni.navigateTo({
								url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.goodsId}_${e.shopId}&msprice=${e.price}&spickId=${e.spikeId}`
							})
						} else {
							uni.navigateTo({
								url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.goodsId}_${e.shopId}`
							})
						}

					} else {
						uni.navigateTo({
							url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e.goodsId}_${e.shopId}`
						})

					}
				}
			},
			scrollbottom() { //到底加载
				if (this.listlength != 0 && this.listlength >= 10) {
					this.index += 1
					this.reorder()
					this.isShow = true
				} else {
					this.isShow = false
				}
				this.listlength != 0 ? this.sta = "loading" : this.sta = "nomore"
			},
			reorder(res) {
				res != undefined && (this.status = ["", "wait_buyer_pay", "unconfirm", "wait_seller_send_goods",
					"wait_buyer_confirm_goods", "trade_finished"
				].slice(res, res + 1).toString(), this.list = [], this.emptyShow = false, uni.showLoading({
					title: "加载中...",
					mask: true
				}))
				// this.get('http://192.168.1.106:8107/order/my',{
				// 	mobile:uni.getStorageSync('userInfo').mobile,
				// 	//订单数据
				// 	// shopNo: getApp().globalData.shopNo,
				// 	shopNo:'',
				// 	status:this.xuan_index||this.status,
				// 	pageNum: this.index,
				// 	_ss:'000',
				// 	tenantId: 39602
				// })
				this.$request.getMy({
					mobile: uni.getStorageSync('userInfo').mobile,
					// mobile:'15224946767',
					//订单数据
					// shopNo: getApp().globalData.shopNo,
					shopNo: '',
					status: this.xuan_index || this.status,
					pageNum: this.index,

				}).then(res => {
					// 如果请求的页数是1的话 就清除以前的 避免数据重复渲染（解决小程序审核的时候展示白屏问题）
					if (this.index == 1) {
						this.list = []
					}
					// console.log('res.orderItemList是'，res.orderItemList)
					this.listlength = Object.keys(res.orderItemList).length
					let item = [],
						orderSn, orderId;
					uni.hideLoading()
					orderSn = res.orderList.map(val => val.orderSn),
						orderId = res.orderList.map(val => val.id);
					for (let i in res.orderItemList) {
						item.push({
							[i]: res.orderItemList[i]
						})
					}
					item.map((val, idx) => {
						let keys = Object.keys(val)
						for (let i in orderSn) {
							if (keys[0] == res.orderList[i].orderSn) {
								this.list.push({
									type: res.orderList[i].type,
									list: val[res.orderList[i].orderSn],
									orderId: res.orderList[i].id,
									orderSn: res.orderList[i].orderSn,
									deliveryMethodName: res.orderList[i].deliveryMethodName,
									deliveryFee: res.orderList[i].deliveryFee,
									orderStatus: res.orderList[i].orderStatus,
									totalAmount: res.orderList[i].totalAmount,
									orderStoreName: res.orderList[i].storeName,
									orderStoreId: res.orderList[i].storeId,
									isDelete: res.orderList[i].isDelete,

								})
								this.orderId = res.orderList[i].id
							}
						}
					})
					this.list.map((val, idx) => {
						this.list[idx].allmaney = this.list[idx].totalAmount.toFixed(2)
						this.list[idx].jftotalAmount = this.list[idx].deliveryFee + val.list.map(re => re
							.syMoney)[0]
					})
					this.list.length == 0 ? this.emptyShow = true : this.emptyShow = false
				})
				this.xuan_index = ''
			}
		}

	};
</script>
