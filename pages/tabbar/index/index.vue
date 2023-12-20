<template>
	<view style="overflow: hidden;">
		<!-- 页头 -->
		<view class="pageHeader">
			<page-header ishide=ishide></page-header>
		</view>
		<view class="index" :style="{marginTop:topHeight+'px'}" v-if="!bbb==0">
			<!-- 加载动画 -->
			<loading></loading>
			<!-- 选项 -->
			<view class="lunbo" v-if="isgonggao&&isgonggao2">
				<u-notice-bar :text="text1||text2" fontSize='40' bgColor='none'></u-notice-bar>
			</view>
			<newUser></newUser>
			<more-options :cards="datas.cards" :list="datas.listMenu"></more-options>

			<!-- 轮播 -->
			<!-- <button @click="ceshi">非开发勿点</button> -->
			<rotation :jump="jump" :list1="datas.adslides" :rightAdvert="datas.rightAdvert"></rotation>
			<!-- 卡片 -->
			<view class="xinren" @click="xinren()" v-if="isdonghua">
				<image class="element"
					src="http://appimage.aijiamart.cn/mall/img/978117aab4d04a398e1583c84ef81470BQZd3ib32Njc9bba63f0a9d50621cfcdfb801c8ccc4e.jpg"
					mode=""></image>
			</view>
			<!-- 四个块 -->
			<view v-if="datas.carouselAdvertisingList.length==0&&datas.belowAdvert.length!=0">
				<four-options @gopath="jump" :lists="datas.belowAdvert" :hieght="370"></four-options>
			</view>
			<view style="margin: 15rpx 0 15rpx 0;" v-if="datas.carouselAdvertisingList.length!=0">
				<index-swiper :list1="datas.carouselAdvertisingList"></index-swiper>
			</view>
			<!-- 		<view v-if="datas.carouselAdvertisingList.length!=0">
				<u-swiper :list="datas.carouselAdvertisingList" :indicator="true" indicatorMode="dot"
					indicatorActiveColor="#fff" indicatorInactiveColor="#d6d6d6" height="200rpx" width="100%"
					radius="7px" interva="5000" circular="true" keyName="pic" @click="swipergo">
				</u-swiper>
			</view> -->
			<!-- 分类  商品列表 -->
			<view v-if="datas.hotCate.length!=0">
				<commodity ref="commodity" :classification="datas.hotCate" :page.sync="page"></commodity>
			</view>
			<!-- 返回返回顶部 -->
			<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
			<u-tabbar :value="value" @change="changestab" :border="false" :fixed="true" :placeholder="true"
				:safeAreaInsetBottom="true" activeColor="#f04b38" inactiveColor="#000">
				<u-tabbar-item :text="item.text" v-for="(item,index) in tabBars" :key="index" @click="chooseTab(item)">
					<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
					<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
		<!-- 新版首页 -->
		<view v-else class="index" :style="{marginTop:topHeight+'px'}">
			<loading></loading>
			<more-options :list="list"></more-options>
			<view style="margin-top:20rpx;">
				<u-swiper :list="guanggao" :indicator="true" indicatorMode="dot" indicatorInactiveColor="#fff"
					height="200" radius="7px 7px 7px 7px" interva="5000" circular="true" autoplay='true' @click="go_xq">
				</u-swiper>
			</view>

			<index2-miaosha></index2-miaosha>
			<u-swiper :list="guanggao1" :indicator="true" indicatorMode="dot" indicatorInactiveColor="#fff" height="200"
				radius="7px 7px 7px 7px" interva="5000" circular="true" autoplay='true' @click="go_xq1">
			</u-swiper>
			<view v-if="datas.hotCate.length!=0">
				<commodity ref="commodity" :classification="datas.hotCate" :page.sync="page"></commodity>
			</view>
			<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
			<u-tabbar :value="value" @change="changestab" :border="false" :fixed="true" :placeholder="true"
				:safeAreaInsetBottom="true" activeColor="#f04b38" inactiveColor="#000">
				<u-tabbar-item :text="item.text" v-for="(item,index) in tabBars" :key="index" @click="chooseTab(item)">
					<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
					<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import mixin from '@/mixins/mixin.js'
	import {
		wxUrl,
		corpId
	} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				list1: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				// bbb:0,
				bbb: 1,
				loading: true,
				datas: {
					// // listMenu:"",//功能分类
					// adslides:"", //轮播图
					// hotCate:"",//分类
					// belowAdvert:[], //轮播图下面
					// rightAdvert:[] //轮播右侧
				},
				errImg: '/static/image/fail.png',
				ishide: true, //导航栏隐藏
				page: 1, //上拉加载页数
				topHeight: 0,
				tabBars: [],
				value: 0,
				// 分享过来的手机号
				fenxiang_moblie: '',
				mendian_list: [],

				// 首页2
				_shopNo: "",
				list: [],
				guanggao: [],
				guanggao1: [],
				isdonghua: false,
				text1: '',
				text2: '爱家商城技术升级中…若您在购物中遇到问题，请联系首页客服，提供截图或者视频，我们将给您奖励。',
				isgonggao: false,
				isgonggao2:0
			}
		},
		computed: {
			...mapState(['storeName'])
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			e.scrollTop > 10 ? this.ishide = false : this.ishide = true //控制页头动画
		},
		onPullDownRefresh() {
			uni.hideTabBar({
				animation: true
			})
			this.getIndex()
			if (this.datas.hotCate.length == 0) return
			this.$refs.commodity.$refs.roll.move({
				target: {
					offsetLeft: 0
				}
			}, undefined) //使分类回到第一个
		},
		onShareAppMessage() {
			if (res.from === 'menu') {
				return {
					title: '欢乐爱家',
					path: 'pages/tabbar/index/index'
				}
			}
		},
		onReachBottom() {
			if (this.datas.hotCate.length == 0) return
			this.$refs.commodity.stop && (
				this.page += 1,
				this.$refs.commodity.getHotGoods({
					cate: this.$refs.commodity.$refs.roll.cate || getApp().globalData.classification[0].id,
					page: this.page,
					shopNo: getApp().globalData.shopNo
				}, "more"))
		},
		onShow() {
			if (uni.getStorageSync('storeSn') == 9999) {
				uni.setStorageSync('isWeipuShop', 1)
			} else {
				uni.setStorageSync('isWeipuShop', 0)
			}
			this.value = getApp().globalData.tabIndex
			if (uni.getStorageSync('fenxiang_moblie')) {
				this.post_partner()
			}
			this.$request.getIsNewMemberGoods({
				mobile: uni.getStorageSync('userInfo').mobile,
				shopNo: uni.getStorageSync('storeSn')
			}).then(res => {
				uni.setStorageSync('isNewMemberGoods', res.isNewMemberGoods)
				if (res.isNewMemberGoods == 1) {
					this.isdonghua = true
				} else {
					this.isdonghua = false
				}
			})
		},
		onLoad(e) {
			this.getgonggao()
			// 首页2
			var pages = getCurrentPages();
			if (pages[0].route == 'pages/tabbar/supermarket/supermarket') {
				this._shopNo = uni.getStorageSync('cs_num')
			} else {
				this._shopNo = getApp().globalData.shopNo
			}
			if (this.bbb == 0) {

				this.get2()
			}
			// 接收从分享二维码传递来到手机号（分享者手机号）
			if (decodeURIComponent(e.scene) != 'undefined' || e.moblie) {
				this.fenxiang_moblie = e.moblie || decodeURIComponent(e.scene)
				uni.setStorageSync('fenxiang_moblie', this.fenxiang_moblie)
			}
			uni.showLoading({
				title: "加载中...",
				mask: true
			})
			uni.hideTabBar({
				animation: true
			})
			this.$store.dispatch("location");
			uni.$on("getIndex", this.getIndex)
			let that = this
			uni.getSystemInfo({
				success: function(res) { // res - 各种参数
					let info = uni.createSelectorQuery().select(".pageHeader"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.topHeight = data.height
					}).exec()
				},
			})
			if (e.miaosha == 'miaosha') {
				this.getIndex()
				uni.navigateTo({
					url: `/pages/pagesC/newGoodsSpike/newGoodsSpike`,
				})
			}
			if (e.id == undefined) {
				return
			} else if (/_/ig.test(e.id)) {
				if (e.jfpage == 1) {
					this.getIndex()
					uni.navigateTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e.id}&jup=1`,
					})
				} else {
					this.getIndex()
					uni.navigateTo({
						url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e.id}&jup=1&dshopType=${e.dshopType}`,
					})
				}
			}
		},
		watch: {
			storeName() {
				this.getIndex()
				this.$nextTick(() => {
					if (Object.keys(this.datas).length != 0 && this.datas.hotCate.length != 0) {
						this.$refs.commodity.stop = true
					}
				})
			} //门店发生变化 重新发送请求,启用下拉刷新
		},
		onUnload() {
			uni.$off("getIndex", this.getIndex)
		},
		methods: {
			getgonggao() {
				this.$request.getList({
					
				}).then(res=>{
					console.log('我是公共',res);
					if(res.records.length>0){
					let GG = res.records[0].title
					this.text1 = GG
					this.isgonggao2 = res.records[0].isPublication
					}
				})
			},
			ceshi() {
				uni.navigateTo({
					url: "/pages/pagesC/chepai/chepai?order='3103057384423611'"
				})
			},
			xinren() {
				uni.navigateTo({
					url: "/pages/pagesC/CoupleOnly/CoupleOnly"
				})
			},
			getIndex() {
				uni.$u.http.get(this.$request.getIndex, {
					params: {
						shopNo: getApp().globalData.shopNo,
						mobile: this.$store.state.userInfo.mobile,
						page: 1,
					}
				}).then(res => {
					this.$store.commit("setLayoutType", res.themeStyle.layoutType)
					this.$store.commit("setBj", res.themeStyle.bgStyle)
					this.datas = res
					this.guanggao = res.belowAdvert.map(item => item.pic);
					this.guanggao1 = res.superMarket.map(item => item.pic);
					this.changeTabbar(res.bottomList) //另写函数 可以使用组合函数优化
					this.tabBars = res.bottomList
					getApp().globalData.classification = this.datas.hotCate //分类缓存
					getApp().globalData.superMarket = res.superMarket //广告位
					getApp().globalData.hotGoods = res.hotGoods //广告位
					if (this.datas.hotCate.length != 0) {
						this.$nextTick(() => {
							this.$refs.commodity.$refs.roll.nodes()
							this.$refs.commodity.getHotGoods({
								cate: this.datas.hotCate[0].id,
								page: 1,
								shopNo: getApp().globalData.shopNo,
							})
						})
					}
					this.isgonggao = true
					uni.stopPullDownRefresh() //停止刷新
				})

			},
			changeTabbar(res) {
				let tabbar = uni.getStorageSync('tabbar')
				let judge = false
				if (tabbar.length != res.length) {
					judge = true
				} else {
					res.forEach((item, index) => {
						item.index = index
						if (item.text != tabbar[index].text || item.iconPath != tabbar[index].iconPath || item
							.selectedIconPath != tabbar[index].selectedIconPath || item.pagePath != tabbar[index]
							.pagePath) judge = true
					})
				}
				if (judge) uni.setStorageSync('tabbar', res)
				uni.getStorageSync('tabbar').forEach(item => {
					uni.setTabBarItem(item)
				})
			},
			chooseTab(item) {
				if (item.pagePath.slice(7, 13) == 'tabbar' && item.pagePath != "/pages/tabbar/classificats/classificats") {
					uni.switchTab({
						url: item.pagePath,
						fail(res) {}
					});
				} else {
					if (item.text == '客服') {
						uni.openCustomerServiceChat({
							extInfo: {
								url: wxUrl
							},
							corpId: corpId,
							success(res) {},
							fail(err) {
								console.error(err)
								uni.showToast({
									title: JSON.stringify(err),
									icon: 'none',
									duration: 2000
								});
								return
							}
						})
						return
					}
					uni.navigateTo({
						url: item.pagePath,
						fail(res) {}
					})
				}
			},
			changestab(e) {
				getApp().globalData.tabIndex = e
			},
			swipergo(index) {
				uni.navigateTo({
					url: this.datas.carouselAdvertisingList[index].link
				})
			},
			// 绑定推广人关系 只要已经登录并且从推广页是跳转到主页就绑定关系
			post_partner() {
				// 判断是否是跳转过来的 如果是跳转过来的但是未登录 直接跳转到登录页面
				if (this.fenxiang_moblie != undefined && uni.getStorageSync('token') == '') {
					uni.navigateTo({
						url: "/pages/pagesA/denglu/denglu"
					})
				}
				// 如果是跳转过来的并且登陆了 直接绑定
				if (uni.getStorageSync('fenxiang_moblie') && uni.getStorageSync('token')) {
					this.$request.postpartner({
						scene: uni.getStorageSync('fenxiang_moblie'),
						openId: uni.getStorageSync('openid')
					}, {
						// 'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 4000
						})
						console.log('绑定合伙人数据为', res)
						// 绑定之后清空传递来的手机号 避免下次进入页面还发送请求
						this.fenxiang_moblie = undefined

						this.flag = true
						uni.removeStorageSync('fenxiang_moblie');
					})
				} else {

				}
			},
			// 首页2轮播
			get2() {
				this.$request.postQueryMarketMenu({
					// shopNo: uni.getStorageSync('storeSn')
					shopNo: this._shopNo
				}).then(res => {
					console.log('分了3 ', res);
					this.list = res.listMenu
				})
			},
			go_xq(e) {
				let s = this.datas.belowAdvert[e]
				console.log(e, s)
			},
			go_xq1(e) {
				let s1 = this.datas.superMarket[e]
				console.log(e, s1)
			}
		}
	}
</script>
<style lang="scss">
	@import "@/static/style/uni.scss";

	.pageHeader {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 9;
	}

	/deep/ .u-tabbar-item__icon {
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.index {
		@include chamfer;
	}

	//新人专享的图标样式
	.xinren>image {
		position: fixed;
		z-index: 9999;
		width: 200rpx;
		height: 150rpx;
		right: 10px;
		top: 70%;
	}

	@keyframes shake {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(20px);
		}
	}

	/* 将动画应用到具体元素上 */
	.element {
		animation: shake .5s ease-in-out infinite alternate;
	}

	.u-icon__icon {
		font-size: 40rpx !important;
	}

	.lunbo {
		margin-bottom: 45rpx;
		width: 100%;
		height: 66rpx;
		margin: 16rpx 0 32rpx 0;
	}

	.u-notice-bar {
		border-radius: 30rpx;
	}
</style>
