<template>
	<view class="goodsDetails u-skeleton">
		<uni-nav-bar @clickLeft="back()" fixed="false" statusBar="false" title="商品详情" left-icon="back">
		</uni-nav-bar>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<!-- 轮播图 -->
		<swiper class="u-skeleton-fillet" @click="see(index)" indicator-active-color="#ff42b4" :indicator-dots="true"
			:circular="true" :autoplay="true" interval="5000">
			<swiper-item v-for="(itemi,index) in item.goodsImagesList" :key="index">
				<image :src="itemi.pic"></image>
			</swiper-item>
		</swiper>
		<view class="details">
			<view class="u-skeleton-fillet points">
				<view>价格： <text
						v-text="item.goods.isSpecials == 0 ? '￥'+item.goods.sprice : '￥'+item.goods.specPrice"></text>
				</view>
				<text v-if="item.jfPrice.jfPrice!=undefined ">积分： <text>{{item.jfPrice.jfPrice}}</text></text>
				<text v-if="item.jfPrice.jfPrice!=undefined ">现金： <text>￥{{item.jfPrice.syMoney}}</text></text>
			</view>
			<!-- 商品名称 -->
			<view class="commodityName u-skeleton-fillet">
				<text>条码：</text>
				<text v-text=" item.goods.barcode "></text>
			</view>
			<view class="commodityName u-skeleton-fillet">
				<text>名称：</text>
				<text v-text=" item.goods.name "></text>
			</view>
			<!-- 客户说暂不需要 领取卡券 -->
		<!-- 	<view class="commodityName u-skeleton-fillet" @click="openpop">
				<text>领券</text>
				<text class="quan" v-for="(item,index) in couponList.slice(0,2)" :key="index">
					满{{item.consume}}减{{item.reduceMoney}}元
				</text>
				<text class="aj aj-jinrujiantou"></text>
			</view> -->
			<!-- 商品信息 -->
			<view class="title u-skeleton-fillet">
				<view>
					<text>数量：</text>
					<u-number-box ref="numberBox" v-model="count" integer="false" longPress="false"
						@overlimit="overlimit" :disablePlus="disablePlus" @blur="blur">
						<view slot="minus" class="minus" @click="minus(item)">
							<u-icon name="minus" size="36"></u-icon>
						</view>
						<view slot="plus" class="plus" @click="plus(item)">
							<u-icon name="plus" size="36"></u-icon>
						</view>
					</u-number-box>
				</view>
				<view>
					<text> 商品详情：</text>
					<rich-text :nodes="content"></rich-text>
				</view>
			</view>
			<!-- 更多商品 -->
			<view class="tuijian" v-show="content!=''">为您推荐
				<commodity ref="commodity"></commodity>
			</view>
			<!-- 底部购物车 -->
			<view class="duihuan" @click="buttonClick">{{btnText}}</view>
		</view>
		<u-popup :show="popShow" :round="30" bgColor="#f5f5f5" mode="bottom" closeable="true" @close="popShow=false">
			<view class="coupon" v-for="(item,index) in couponList" :key="index"
				@click="getcoupon(item.isKl,item.cardid)" :style="'background-color:'+item.color">
				<view class="left">
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
					</view>
					<view class="right_btn">{{item.isKl == "N" ? '活动未开始' : '立即领取'}}</view>
				</view>
			</view>
			<view class="leng" v-if="code!=200 || leng==0">暂无可用优惠券</view>
		</u-popup>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>
<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				count: 1, //点击数量
				item: {},
				/* 商品数据 */
				content: '', //富文本
				loading: true, //骨架屏
				rowsWidth: ["100%", "50%", "60%", "70%", "80%"],
				rowsHeight: ["300rpx", "30rpx", "30rpx", "30rpx", '30rpx'],
				goodsId: '',
				disablePlus: false, //是否禁用增加按钮
				isShow: false,
				popShow: false,
				couponList: [], //优惠券列表
				leng: 0,
				code: 0,
				btnText: '立即购买',
				isweipu:uni.getStorageSync('isWeipuShop'),
				isbtnText:'立即购买',
				
			};
		},
		// 分享
		onShareAppMessage(res) {
			return {
				title: `${this.money}积分 ${this.item.goods.name}`,
				path: `pages/tabbar/index/index?id=${this.goodsId}&jfpage=1`,
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: `${this.money}积分 ${this.item.goods.name}`,
				path: `pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${this.goodsId}_${getApp().globalData.shopNo}`,
			};
		},
		onShow() {
			console.log('是否是维普',this.isweipu)
			this.token = uni.getStorageSync('token') == '',
				this.mobile = this.$store.state.userInfo.mobile //电话
			uni.$emit("history")
		},
		onLoad(data) {
		// 如果等于1的话就是we 
			if(this.isweipu==1){
				this.btnText='立即购买'
				this.isbtnText='立即购买'
			}else{
				this.btnText='立即兑换'
				this.isbtnText='立即兑换'
			}
			this.jup = data.jup
			this.totalPoints = 0, //总积分
				// this.header={'Content-type': 'application/x-www-form-urlencoded'}, //请求头
				this.page = 0 //上拉加载页码
			this.goodsId = data.id //商品id
			// this.prohibit=true  //库存判断
			this.$request.getGoodsDetail({
				goodsId: this.goodsId,
				mobile: this.$store.state.userInfo.mobile,
				ifElec: 1
			}).then(res => {
				if (res.code == 200) {
					this.item = res.data
					console.log('数据是',res.data)
					this.shopNo = this.item.shopCode
					this.content = this.formatRichText(res.data.goods.introduction); //富文本使用
					this.loading = false
					this.money = this.item.jfPrice.jfPrice
					if (this.item.jfPrice.jfPrice != undefined) {
						this.$request.postGetCardJf({
							mobile: uni.getStorageSync('userInfo').mobile,
						}, {
							'Content-type': 'application/x-www-form-urlencoded',
						}).then(res => {
							this.totalPoints = res.data
						})
					}
					this.$store.dispatch('judge', [1, this.goodsId,this.shopNo]).then(res => {
						res[1] == 0 ? this.btnText = "售罄" : this.btnText = this.isbtnText
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			});
			this.$request.postCheckCollectElecByGoodsId({
				source: "weixin",
				sfzzlq: "1",
				sfzczs: "-1",
				goodsId: this.goodsId
			}).then(res => {
				this.code = res.code
				if (res.code != 200) return
				this.couponList = res.data
				this.leng = this.couponList.length
			})
			

		},
		onReachBottom() {
			if (this.content != '') {
				this.page += 1
				this.$refs.commodity.getHotGoods({
					cate: getApp().globalData.classification[0].id,
					page: this.page,
					shopNo: getApp().globalData.shopNo
				}, "more")
			}
		},
		methods: {
			// canspoint() {
			// 	this.isShow = true
			// 	uni.$emit('createsShareImage')
			// },
			// 减少按钮
			back() {
				// 如果是分享的页面，点击返回首页
				if (this.jup == "1") {
					uni.switchTab({
						url: '/pages/tabbar/index/index',
						success() {
							uni.getStorageSync('tabbar').forEach(item => {
								uni.setTabBarItem(item)
							})
							uni.showTabBar({
								animation: true
							})
						}
					});
					return
				}
				let page = getCurrentPages()
				if (page[page.length - 2]&&page[page.length - 2].route == "pages/pagesA/cancleOrder/cancleOrder"||page.length==1) {
					uni.switchTab({
						url: '/pages/tabbar/index/index',
					});
					return
				}
				console.log('我是page',page);
				uni.navigateBack({
					delta: 1
				})
			},
			minus() {
				if (this.time) {
					return
				}
				if (this.count > 1) {
					this.$store.dispatch('judge', [this.count - 1, this.goodsId,this.shopNo]).then(res => {
						if (res[0] == true) {
							this.count -= 1;
						}
					})
				}
				this.time = setTimeout(() => {
					this.time = null
				}, 500)
			},
			// 增加按钮
			plus() {
				if (this.token) {
					this.jump('/pages/pagesA/denglu/denglu')
					return
				}
				if (this.time) {
					return
				}
				this.$store.dispatch('judge', [this.count, this.goodsId,this.shopNo,this.shopNo]).then(res => {
					if (res[0] == false) {
						this.disablePlus = true;
						this.isShowToast(`宝贝只剩最后${this.count}个了！`);
					} else {
						this.disablePlus = false;
						this.count += 1;
					}
				})
				this.time = setTimeout(() => {
					this.time = null
				}, 500)
			},
			// 失焦
			blur() {
				if (this.time) {
					return
				}
				this.$store.dispatch('judge', [this.count, this.goodsId,this.shopNo]).then(res => {
					if (res[0] == false) {
						this.count = this.count + res[1];
						this.isShowToast(`宝贝只剩最后${this.count}个了！`);
					}
				})
				this.time = setTimeout(() => {
					this.time = null
				}, 500)
			},
			overlimit(e) {
				e == "minus" && this.isShowToast("该宝贝不能再减少了~")
			},
			isShowToast(title) {
				uni.showToast({
					title: title,
					icon: "none",
					duration: 2000
				})
			},
			buttonClick(e) {
				if (this.token) {
					this.jump('/pages/pagesA/denglu/denglu')
					return
				} else {
					if (this.btnText == "售罄") {
						uni.showToast({
							title: '商品已售罄',
							icon: 'none'
						})
						return
					}
					let {
						specPrice,
						sshopId,
						id,
						name,
						pic
					} = this.item.goods,
						parameter = {
							goodsId: id,
							quantity: this.count,
							price: specPrice,
							shopId: sshopId,
							mobile: this.mobile,
							type: this.item.type,
						}
					let {
						goods: {
							names,
							pics,
							sshopId: shopId
						}
					} = this.item
					/* 跳转到订单页面购买 */
					Object.assign(parameter, {
						names,
						pics
					})

					if (this.item.jfPrice.jfPrice == undefined || this.item.jfPrice.jfPrice <= Number(this
							.totalPoints)) {
						this.jump(
							`/pages/pagesA/order/order?parameter=${JSON.stringify(parameter)}`
						)
					} else {
						this.isShowToast('积分不足')
					}
				}
			},
			/* 查看大图 */
			see(index) {
				uni.previewImage({
					current: index,
					urls: this.item.goodsImagesList.map(val => val.pic)
				})
			},
			//解析富文本方法
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/<div>/gi, '');
				newContent = newContent.replace(/<[^>]*\/div>/gi, '');
				newContent = newContent.replace(/<figure class=\"image\">/gi, '');
				newContent = newContent.replace(/<[^>]*\/figure>/gi, '');
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
				return newContent;
			},
			openpop() {
				this.popShow = true
			},
			getcoupon(isKl, cardids) {
				if (this.time) {
					return
				}
				if (uni.getStorageSync('token') == '') {
					uni.navigateTo({
						url: "/pages/pagesA/denglu/denglu"
					})
					return
				}
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
					if (res.cards.length == 0) {
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
							let cardNoList = []
							let nowcard = ''
							res.cards.forEach(item => {
								if (item.isBind == 1) {
									cardNoList.push(item.cardNo)
									nowcard = cardNoList[0]
								}
							})
						}
					}
					let title = nowcard == undefined && "请先获取会员卡！" || isKl == "N" && "暂不能领取！"
					if (title != false) {
						(title => {
							uni.showToast({
								title,
								icon: "none"
							})
							nowcard == undefined && setTimeout(() => {
								uni.navigateTo({
									url: "/pages/pagesA/receive/receive"
								})
							}, 1500)
						})(title)
						return
					}
					this.$request.postCollectElecInfo({
						cardids,
						cardNo: nowcard,
						limits: "1",
						source: "weixin"
					}).then(res => { //SUCCESS成功 FAIL失败
						if (res.code != 200) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							return
						}
						let status = res.data.status == "SUCCESS"
						uni.showToast({
							title: status ? "领取成功" : "领取已达上线",
							icon: status ? "success" : "error"
						});
					})
				});
				this.time = setTimeout(() => {
					this.time = null
				}, 2000)

			}
		}
	}
</script>
<style lang="scss">
	@import "@/static/style/uni.scss";

	.goodsDetails {
		swiper {
			$height: 750rpx;
			height: $height;

			.swiper-item {
				height: 100%;
			}

			image {
				width: 100%;
				height: $height;
			}
		}

		.coupon:first-child {
			margin-top: 90rpx;
		}

		.leng {
			width: 95%;
			margin: 90rpx auto;
			text-align: center;
		}

		.quan {
			margin-left: 4%;
			color: red !important;
			border: 1rpx solid red;
			font-size: 25rpx !important;
			padding: 3rpx 15rpx;
			border-radius: 10rpx;
		}

		.coupon {
			width: 95%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			display: flex;

			.left {
				width: 30%;
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
				width: 65%;
				margin-left: 20rpx;
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

		.minus,
		.plus {
			width: 46rpx;
			height: 46rpx;
			background-color: #ebecee;
			display: flex;
			justify-content: center;
		}

		.details {
			margin-bottom: 140rpx;

			.aj-jinrujiantou {
				float: right;
				font-size: 50rpx;
			}

			&>view:first-child {
				@include gong;

				&>text:first-child,
				&>text:nth-child(4) {
					font-size: 28rpx;
					color: #999;
				}

				&>text:nth-child(2) {
					color: red;

					font: {
						size: 28rpx;
						weight: 900;
					}
				}

				&>text:nth-child(3) {
					margin-right: 20rpx;
					color: red;

					font: {
						size: 40rpx;
						weight: 900;
						style: italic
					}
				}

				&>text:nth-child(4) {
					text-decoration: line-through;
				}
			}

			.spike {
				color: #999;

				text {
					color: red;

					font: {
						size: 40rpx;
						weight: 900;
					}
				}
			}

			.points {
				$color: #999 !important;

				&>view {
					color: $color;

					text {
						font-size: 40rpx;
						color: red;
						font-weight: 600;
					}
				}

				&>text:nth-child(2) {
					margin-right: 30rpx;
					color: $color;
					font-weight: normal !important;

					text {
						font-size: 35rpx;
						color: red;
						font-weight: 600;
					}
				}

				&>text:nth-child(3) {
					font-size: 28rpx !important;
					font-style: normal !important;
					font-weight: normal !important;
					color: $color;

					text {
						font-size: 35rpx;
						color: red;
						font-weight: 600;
					}
				}
			}

			.commodityName {
				@include gong;

				>text:nth-child(1) {
					font-size: 28rpx;
					color: #999
				}

				>text:nth-child(2) {
					color: #000000;
				}
			}

			.title {
				@include gong;

				&>view:first-child {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					text:nth-child(1) {
						color: #999;
					}
				}

				&>view:last-child {
					text:nth-child(1) {
						color: #999;
					}
				}
			}
		}

		.uni-goods-nav {
			position: fixed;
			bottom: 0;
			width: 100%;
		}

		.tuijian {
			font-size: 35rpx;
			text-align: center;
			font-weight: 900;
			margin: 30rpx 0;
		}

		.duihuan {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #fff;
			background-color: #f5322b;
			position: fixed;
			bottom: 0;
		}
	}
</style>
