<template>
	<view class="mycoupon">
		<uni-nav-bar fixed="false" statusBar="false" title="电子券" left-icon="left" @clickLeft="jump(1)"></uni-nav-bar>
		<u-empty text="您还没有会员卡" mode="data" marginTop="65% 0 0 0" textSize="30" iconSize="160" iconColor="#bcbcbc" v-if="isShow"></u-empty>
		<view v-else>
			<view class="fixe">
				<view class="wvipcard">
					<view class="vcard">
						<!-- <text class="aj aj-xiangzuojiantou" @click="back"></text> -->
						<view>{{mobile}}</view>
					</view>
				</view>
				<view class="tabs">
					<view :class="[current == index ? 'active' : '' ]" v-for="(item,index) in tabs" :key="index"
						@click="changetab(index)">
						{{item}}
					</view>
				</view>
			</view>
			<swiper class="swiper" :current="swiperCurrent" :style="{Height:Height+'px'}" @change="transition">
				<swiper-item style="height: 100%;">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="butt">
							<!-- <view v-for="(item,index) in btns" :key="index">
								{{item}}
							</view> -->
						</view>
						<view class="coupon" v-for="(item,index) in coplist" :key="index">
							<view class="left" :style="'background-color:'+item.color">
								￥<text>{{item.reduceMoney}}</text>
							</view>
							<view class="right">
								<view>
									<view>
										{{item.title}}
									</view>
									<view class="manjian">
										满{{item.consume}}减{{item.reduceMoney}}元
									</view>
									<view style="font-size: 25rpx;">
										{{item.startDate}}-{{item.endDate}}
									</view>
									<view class="right_btn" @click="pop(item)">
										详情
									</view>
								</view>

							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item style="height: 100%;">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<!-- <view class="old">
							<view class="">标题</view>
							<view>核销门店：<text>门店</text></view>
							<view>核销时间：<text>......</text></view>
							<view>失效时间：<text>......</text></view>
							<view class="">卡券描述：<text>这就是卡券描述......</text></view>
						</view>
						<view class="old">
							<view class="">标题</view>
							<view>有效时间：<text>......</text></view>
							<view class="">卡券描述：<text>这就是卡券描述......</text></view>
						</view>
						<view class="old">
							<view class="">标题</view>
							<view>过期时间：<text>......</text></view>
							<view class="">卡券描述：<text>这就是卡券描述......</text></view>
						</view> -->
					</scroll-view>
				</swiper-item>
			</swiper>
			<u-popup :show="show" mode="bottom" @close="close">
				<view class="xqpop">
					<!-- 二维码、条形码 -->
					<view class="top">
						条形码/二维码图片
						<view class="erweima">
							<canvas canvas-id="qrcode" style="{ width:'150px', height:'150px'}" />
						</view>
					</view>
					<!-- 详情 -->
					<view style="background-color:#fff;">
						<view class="xz">
							<text>使用须知：</text>通用电子券和品类券每单限用一张,商品券可用多张,商品券使用后通用券和品类券不可叠加使用,可自行选择拆分结算使用
						</view>
						<view class="bot">
							<view>
								<text>卡券名称</text>
								<text>{{elecList.title}}</text>
							</view>
							<view>
								<text>卡券副标题</text>
								<text>{{elecList.subtitle}}</text>
							</view>
							<view>
								<text>卡券编号</text>
								<text>{{elecList.no}}</text>
							</view>
							<view>
								<text>减免金额</text>
								<text>{{elecList.reduceMoney}}元</text>
							</view>
							<view>
								<text>使用条件</text>
								<text>满{{elecList.consume}}元可用</text>
							</view>
							<view>
								<text>有效时间</text>
								<text>{{elecList.startDate}} - {{elecList.endDate}}</text>
							</view>
						</view>
					</view>
					<button v-if="elecList.giveFriend==1" class="btn2" open-type="share">分享</button>
					<button class="btn1" @click="close">返回</button>
				</view>
			</u-popup>
		</view>
	</view>

</template>

<script>
	import uQRCode from "@/components/uQRCode/uQRCode.js"
	export default {
		data() {
			return {
				tabs: ['可用卡券', '卡券历史'],
				btns: ['全部', '服装', '百货', '超市'],
				swiperCurrent: 0, // 轮播
				current: 0,
				show: false, // 弹出层
				mobile: 0,
				coplist: [],
				Height: 0,
				cardNoList: [],
				wid: '',
				cardParams: {},
				elecList: {
					"no": "",
					"title": "",
					"receiveTime": "",
					"startDate": "",
					"endDate": "",
					"timeLimit": "",
					"consume": "0.00",
					"title": "",
					"subtitle": "",
					"reduceMoney": ""
				},
				isShow: false,
			}
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.haveCard()
		},
		onShareAppMessage(res) {
			this.shares()
			if (res.from == 'button') {
				return {
					title: '电子券',
					path: `pages/pagesC/sharequan/sharequan?elecList=${JSON.stringify(this.elecList)}&mobile=${this.mobile}`,
				}
			}
		},
		onLoad() {
			this.Height = getApp().globalData.equipment.windowHeight - 91;
			this.mobile = this.$store.state.userInfo.mobile;
		},
		methods: {
			shares() {
				this.$request.getShareEle({
					eleId: this.elecList.no,
					phone: this.mobile
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res.msg
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			haveCard() {
				this.$request.postGetCardsByMobile({
					mobile: this.mobile
				}).then(res => {
					if (res.cards.length == 0) {
						this.isShow = true
						uni.showModal({
							content: "您还没有卡，是否去申请卡",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/pagesA/receive/receive'
									})
								} else {
									uni.navigateBack({
										delta: 1
									})
								}
							}
						})
					} else {
						let bindTrue = res.cards.some(item => {
							return item.isBind == 1
						})
						if (bindTrue == false) {
							uni.showModal({
								content: "您还没有绑卡，是否去绑卡",
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/pagesA/bindcard/bindcard'
										})
									} else {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						} else {
							this.cardNoList = []
							res.cards.forEach(item => {
								if (item.isBind == 1) {
									this.cardNoList.push(item.cardNo)
								}
							})
						}
						this.cardNoList.forEach((val) => {
							this.$request.postQueryCollectElecList({
								mobile: this.mobile,
								cardNo: val,
							}).then(res => {
								if (res.success == false) {
									this.coplist = []
								} else {
									this.coplist = res;
								}
							});
						})
					}
				});
			},
			// 没有绑卡
			jump() {
				uni.navigateBack({
					delta: 1
				}) 
			},
			changetab(index) {
				this.current = index
				this.swiperCurrent = this.current
			},
			transition(e) {
				this.swiperCurrent = e.detail.current;
				this.current = this.swiperCurrent
			},
			pop(item) {
				this.show = true;
				this.elecList = item
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: 'elec_' + item.no + '_' + item.id,
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			},
			close() {
				this.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.mycoupon {
		.swiper {
			margin-top: 165rpx;
		}

		.active {
			color: #ef5858;
			font-weight: 600;
			border-bottom: 5rpx solid #ef5858;
		}

		.wvipcard {
			width: 100%;
			background-color: #fff;
			border-bottom: 1rpx solid #eaeaea;

			.vcard {
				width: 95%;
				display: flex;
				margin: 0 auto;

				.aj-xiangzuojiantou {
					margin-top: 20rpx;
				}

				view {
					height: 80rpx;
					font-size: 34rpx;
					font-weight: 600;
					line-height: 80rpx;
					margin: 0 auto;
				}
			}
		}

		.tabs {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			display: flex;
			background-color: #fff;

			view {
				width: 50%;
			}
		}

		.swiper {
			margin-top: 10rpx;

			.butt {
				width: 100%;
				display: flex;

				view {
					padding: 10rpx;
					color: #fff;
					background-color: #ef5858;
					margin-right: 15rpx;
				}
			}

			.old {
				width: 95%;
				margin: 0 auto;
				background-color: #fff;
				margin-bottom: 20rpx;

				view {
					padding: 10rpx;
					font-weight: 600;

					text {
						font-weight: normal;
					}
				}
			}

			.coupon {
				width: 95%;
				margin: 0 auto;
				background-color: #fff;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				display: flex;
				padding-bottom: 10rpx;

				.date {
					font-size: 25rpx;
					color: #8c8c8c;
				}

				.left {
					width: 27%;
					color: #fff;
					text-align: center;
					line-height: 170rpx;
					font-size: 38rpx;
					border-top-left-radius: 10rpx;
					border-bottom-left-radius: 10rpx;
					// background: linear-gradient(90deg, #ff8f4d 25%, #ff6950 90%);
					border-right: 5rpx dashed #fff;

					text {
						font-size: 47rpx !important;
					}
				}

				.right {
					width: 67%;
					margin-left: 15rpx;
					padding-top: 20rpx;
					border-top-right-radius: 10rpx;
					border-bottom-right-radius: 10rpx;

					view {
						margin-top: 10rpx;

						text {
							font-size: 26rpx;
						}
					}

					.manjian {
						font-size: 28rpx;
						color: red;
					}

					.right_btn {
						background-color: #fe2231;
						text-align: center;
						color: #fff;
						height: 50rpx;
						line-height: 50rpx;
						min-width: 170rpx;
						padding: 2rpx 20rpx;
						border-radius: 25rpx;
						font-size: 26rpx;
						float: right;
					}
				}
			}

		}

		.xqpop {
			background-color: #efefef;

			.btn2 {
				color: #fff;
				font-size: 30rpx;
				margin-bottom: 10rpx;
				background-color: #27b048;
			}

			.btn1 {
				color: #fff;
				font-size: 30rpx;
				background-color: #f5383c;
			}

			.top {
				font-size: 28rpx;
				text-align: center;
				padding-top: 10rpx;
				padding-bottom: 10rpx;
				background-color: #fff;

				.erweima {
					width: 300rpx;
					height: 300rpx;
					border-radius: 10rpx;
					margin: 10rpx auto;
				}
			}

			.bot {
				width: 95%;
				margin: 0 auto;
				padding-top: 10rpx;
				padding-bottom: 10rpx;
				background-color: #fff;
				margin-top: 10rpx;
				margin-bottom: 20rpx;

				view {
					font-size: 28rpx;
					height: 70rpx;
					line-height: 70rpx;
					border-bottom: 1rpx solid #eaeaea;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				view:last-child {
					border: 0;
				}
			}

			.xz {
				width: 95%;
				margin: 0 auto;
				border-bottom: 1rpx solid #eaeaea;
				color: #696969;
				font-size: 27rpx;
				padding: 10rpx 0;

				text {
					color: #000 !important;
				}
			}

		}

	}
</style>
