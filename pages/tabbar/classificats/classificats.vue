<template>
	<view class="supermarket">
		<!-- 导航栏 -->
		<uni-nav-bar fixed="false" statusBar="false"  @clickLeft="back" leftWidth="50rpx">
			<view class="sear">
				<u-search height="50" searchIconSize=40 placeholder="搜索商品" v-model="keyword" :showAction="false"
					:disabled="true" @click="jump('/pages/pagesA/search/search')"></u-search>
				<text class="aj aj-quan"
					@click="jump('/pages/pagesB/couponCollectionCenter/couponCollectionCenter')"></text>
			</view>
		</uni-nav-bar>
		<view class="superCenter">
			<view class="superrt"  :style="{Height:Height+fixHeight+'px'}">
				<scroll-view scroll-y="true" style="height:100%" :scroll-top="leftscrollTop"
					:scroll-with-animation="true">
					<view :class="[isIndex == item.id ? 'superlist actived' : 'superlist']" v-for="(item,index) in list"
						:key="index" @click="change($event,item.id)">
						{{item.name}}<text class="i" v-show="isIndex == item.id"></text>
					</view>
				</scroll-view>
			</view>
			<view class="superlf">
				<view class="classtop" style="width:75%;position: fixed;z-index:99999;background-color: #fff;">
					<view>
						<view class="allchoos1">
							<view>
								<u-tabs :list="categoryList" lineWidth="0" lineHeight="0"
									:activeStyle="{color:'#fe6850',fontWeight:'bold'}" @click="changeSec"
									:current="current"></u-tabs>
							</view>
							<view @click="chooShow= true,showoverlay=true"><text v-show="seclistShow"
									class="aj aj-xiangxiajiantou"></text></view>
						</view>
						<view v-if="chooShow" class="allchoos">
							<view>
								<view :class="index==indexs?'active':''" v-for="(item,index) in categoryList"
									@click="chooseSec(item.id,index)">{{item.name}}</view>
							</view>
							<view @click="chooShow= false,showoverlay=false">点击收起</view>
						</view>
					</view>
					<view class="pri">
						<view @click="saleLift">
							销量
							<text class="aj aj-shengxu" :class="[sallift == 2 ? 'acicon': '']"></text>
							<text class="aj aj-jiangxu" :class="[sallift == 1 ? 'acicon': '']"></text>
						</view>
						<view @click="priLift">
							价格
							<text class="aj aj-shengxu" :class="[lift == 2 ? 'acicon': '']"></text>
							<text class="aj aj-jiangxu" :class="[lift == 1 ? 'acicon': '']"></text>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollTop"
					:style="{Height:Height+'px',marginTop:fixHeight+'px'}" @scrolltolower="lower" @scroll="scroll">
					<u-overlay :show="showoverlay"></u-overlay>
					<view class="goodslist" v-for="(items,idx) in goodsList" :key="idx">
						<image :src="items.image" @click="godetails(items.id)" lazy-load></image>
						<view class="text" @click="godetails(items.id)">
							<text>{{items.id}}</text>
							<view class="name">{{items.name}}</view>
							<text class="quan"
								v-if="items.collectElecList.length!=0">满{{items.collectElecList[0].consume}}减{{items.collectElecList[0].reduceMoney}}</text>
							<view class="mony">￥{{items.marketPrice}}<text
									class="smltext">月售{{items.salesVolume}}</text></view>
							<text class="aj aj-tianjia" @click.stop="addshop(items.id,items.marketPrice)"></text>
							<text v-show="items.isSpecials == 2"
								style="margin-left: 2%;color: #fff;font-size: 29rpx;background-color: red;;border-radius: 4rpx;padding: 0 5rpx;">8.8折</text>
						</view>
					</view>
					<u-empty :show="judge" iconSize="195px" width="135px" height="135px" textSize="22px" marginTop="20%"
						textColor="transparent" icon="/static/SVG/kong.svg" text="哎呀,商品空空如也"></u-empty>
					<u-loadmore v-if="isShow && !judge" fontSize="30" color="#818181" :loading-text="loadingText"
						:nomore-text="nomoreText" height="35" line :status="status" />
				</scroll-view>
				<!-- 悬浮购物车 -->
				<view class="aj aj-gouwuche shop" @click="goshopcart">
					<view class="badge" v-if="value != 0">{{value}}</view>
				</view>
			</view>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				Height: 0,
				isIndex: -1, //超市进入分类默认
				allgoodsList: [],
				goodsList: [],
				status: 'loading',
				loadingText: '努力加载中',
				nomoreText: '到底了',
				lift: 0, //价格
				sallift: 0, //销量
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				isShow: true,
				jf: "", //积分商品
				judge: false, //商品为空显示
				value: 0, //购物车图标
				chooShow: false,
				showoverlay: false,
				categoryList: [], //二级分类
				current: 0,
				indexs: 0,
				fixHeight: 0,
				seclistShow: false,
				leftscrollTop: 0,
				isweipushop:uni.getStorageSync('isWeipuShop')
			}
		},
		onLoad(option) {
			// 购物车数量
			this.$request.postCartnumber({
				mobile: this.$store.state.userInfo.mobile,
				shopNo: getApp().globalData.shopNo
			}, {
				'Content-type': 'application/x-www-form-urlencoded',
			}).then(res => {
				this.value = res
			})
			this.page = 1
			this.pri = '' //价格排序默认
			this.sales = '' //销量排序默认
			this.isShow = false
			this.bottom = true
			uni.showLoading()
			let that = this
			uni.getSystemInfo({
				success: function(res) { // res - 各种参数
					let info = uni.createSelectorQuery().select(".classtop"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.fixHeight = data.height * 2+5
						that.Height = getApp().globalData.equipment.windowHeight - that.fixHeight - 17 - 50;
					}).exec()
				},
			})
			// 金刚区
			this.$request.postQueryMarketMenu({
				shopNo: uni.getStorageSync('storeSn')
			}).then(res => {
				this.list = res.listMenu
				this.isIndex = this.list[0].id
				this.nowid = this.isIndex
				// 刚进入超市分类，滚动到点击的分类
				uni.createSelectorQuery(
				).select(".superrt").boundingClientRect(data => { //目标节点、也可以是最外层的父级节点
					uni.createSelectorQuery().select(".actived").boundingClientRect((res) => { //最外层盒子节点
						this.leftscrollTop = res.top + 100 - data.top - getApp().globalData
							.equipment.windowHeight / 2
					}).exec()
				}).exec();
				this.$request.postGoodsCategory({
					id:this.list[0].id,
					shopNo: getApp().globalData.shopNo,
					page: this.page,
					salesVolume: this.sales,
					price: this.pri,
					size: '10',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.categoryList = []
						this.goodsList = res.data.goodlist
						this.categoryList = res.data.categoryList
						this.categoryList.unshift({
							id: this.isIndex,
							name: '全部',
							index: 0
						})
						this.reslegh = res.data.goodlist.length
						this.judge = this.goodsList.length == 0
						this.seclistShow = true
					} else {
						this.judge = true
						this.seclistShow = false
					}
				
				});
			})
		},
		methods: {
			change(e, index) {
				this.goodsList = []
				this.page = 1
				this.isIndex = index
				this.nowid = index
				this.pri = ''
				this.lift = 0
				this.sales = ''
				this.sallift = ''
				this.current = 0
				this.indexs = 0
				this.scrollTop = this.old.scrollTop
				this.isShow = false
				this.leftscrollTop = e.target.offsetTop + 50 - getApp().globalData.equipment.windowHeight / 2
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showLoading()
				this.$request.postGoodsCategory({
					id: this.isIndex,
					shopNo: getApp().globalData.shopNo,
					page: this.page,
					salesVolume: this.sales,
					price: this.pri,
					size: '10',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.categoryList = []
						this.goodsList = res.data.goodlist
						this.categoryList = res.data.categoryList
						this.categoryList.unshift({
							id: this.isIndex,
							name: '全部',
							index: 0
						})
						this.reslegh = res.data.goodlist.length
						this.judge = this.goodsList.length == 0
					} else {
						this.judge = true
						this.seclistShow = false
					}

				});
			},
			jump(url) {
				uni.navigateTo({
					url
				})
			},
			// 二级分类列表
			chooseSec(id, index) {
				this.goodsList = []
				this.page = 1
				this.pri = ''
				this.lift = 0
				this.sales = ''
				this.sallift = ''
				this.indexs = index
				this.current = this.indexs
				this.scrollTop = this.old.scrollTop
				this.isShow = false
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				this.chooShow = false
				this.showoverlay = false
				this.nowid = id
				this.goslist(this.nowid)
			},
			// 二级分类
			changeSec(e) {
				this.goodsList = []
				this.page = 1
				this.pri = ''
				this.lift = 0
				this.sales = ''
				this.sallift = ''
				this.current = e.index
				this.indexs = this.current
				this.scrollTop = this.old.scrollTop
				this.isShow = false
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				this.nowid = e.id
				this.goslist(this.nowid)
			},
			goslist(data) {
				uni.showLoading()
				this.$request.postGoodsCategory({
					id: data,
					shopNo: getApp().globalData.shopNo,
					page: this.page,
					salesVolume: this.sales,
					price: this.pri,
					size: '10',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.goodsList = res.data.goodlist
						this.reslegh = res.data.goodlist.length
						this.judge = this.goodsList.length == 0
					} else {
						this.judge = true
						this.seclistShow = false
					}
				});
			},
			// 销量
			onsaleLift() {
				this.pri = ''
				this.lift = 0
				this.sallift++
				if (this.sallift >= 3) {
					this.sallift = 0
				}
				this.sallift == 0 ? this.sales = '' : this.sallift == 1 ? this.sales = 'desc' : this.sales = "asc"
				this.goslist(this.nowid)
			},
			saleLift() {
				if (this.reslegh != 0) {
					this.onsaleLift()
				} else {
					this.page = 1;
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
					this.onsaleLift()
				}

			},
			// 价格
			onpriLift() {
				this.sales = ''
				this.sallift = 0
				this.lift++
				if (this.lift >= 3) {
					this.lift = 0
				}
				this.lift == 0 ? this.pri = '' : this.lift == 1 ? this.pri = 'desc' : this.pri = "asc"
				this.goslist(this.nowid)
			},
			priLift() {
				if (this.reslegh != 0) {
					this.onpriLift()
				} else {
					this.page = 1;
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
					this.onpriLift()
				}

			},
			// 商品详情
			godetails(e) {
				if(this.isweipushop==1){
					uni.navigateTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e}_${getApp().globalData.shopNo}`
					})	
				}else{
				uni.navigateTo({
					url: `/pages/pagesA/goodsDetails/goodsDetails?id=${e}_${getApp().globalData.shopNo}`
				})	
				}
				
			},
			// 购物车
			goshopcart() {
				uni.navigateTo({
					url: "/pages/pagesB/shopcart/shopcart"
				})
			},
			// 添加购物车
			addshop(ids, prics) {
				if (uni.getStorageSync('token') == '') {
					uni.navigateTo({
						url: "/pages/pagesA/denglu/denglu"
					})
					return
				}
				this.count = 1
				let id = ids;
				this.$request.getAddCartItem({
					goodsId: id,
					quantity: this.count,
					shopId: getApp().globalData.shopNo,
					mobile: this.$store.state.userInfo.mobile,
					price: prics,
				}).then(res => {
					if (res.code == 200) {
						getApp().globalData.increment = 2
						this.value += 1
						uni.showToast({
							title: '添加购物车成功',
							icon: "none",
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						})
					}
				})
			},
			// scroll-view滚动到底部
			lower() {
				if (!this.bottom) {
					return
				}
				this.bottom = false
				if (this.reslegh != 0) {
					this.pri
					this.sales
					this.page++
					this.isShow = true
					this.$request.postGoodsCategory({
						id: this.nowid,
						shopNo: getApp().globalData.shopNo,
						page: this.page,
						salesVolume: this.sales,
						price: this.pri,
						size: '10',
					}).then(res => {
						if (res.code == 200) {
							this.bottom = true
							this.goodsList = [...this.goodsList, ...res.data.goodlist]
							this.reslegh = res.data.goodlist.length
						} else {
							this.judge = true
							this.seclistShow = false
						}

					});
					this.status = "loading"
				} else {
					this.status = "nomore"
					this.bottom = true
				}

			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},

		},

	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.supermarket {
		/deep/.u-transition {
			position: absolute !important;
		}
		/deep/ .u-tabbar-item__icon{
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		.active {
			color: #fe6850;
			font-weight: 600;
		}

		.shop {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			position: absolute;
			top: 75%;
			right: 10%;
			z-index: 999;
			// background-color: #f13527;
			background-image: linear-gradient(to right, #f18c27, #f13527);

			.badge {
				border: 1rpx solid #f13527;
				color: #f13527;
				background-color: #fff;
				width: 33rpx;
				height: 28rpx;
				border-radius: 40%;
				font-size: 20rpx;
				text-align: center;
				line-height: 30rpx;
				position: absolute;
				right: -10rpx
			}
		}

		.sear {
			width: 85%;
			display: flex;
		}

		.actived {
			color: #181818 !important;
			font-weight: 600;
			background-color: #fff !important;
		}

		.acicon {
			color: #181818;
		}

		.aj-quan {
			margin: 4% 0 0 2%;
		}

		.aj-tianjia {
			position: absolute;
			right: 0;
			bottom: 10rpx;
		}

		.aj-shengxu {
			position: absolute;
			top: -1rpx;
		}

		.aj-xiangxiajiantou {
			font-size: 40rpx;
		}

		.aj-jiangxu {
			position: absolute;
			bottom: 10rpx
		}

		.superCenter {
			display: flex;
			position: relative;
		}

		.superrt {
			width: 25%;
			height: 100%;
			position: fixed;
			z-index: 10;
			overflow: hidden;
			background-color: #f4f4f4;

			.superlist {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				position: relative;
				color: #686868;

				.i {
					width: 10rpx;
					height: 65rpx;
					background-color: #f7a10e;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					border-top-right-radius: 10rpx;
					border-bottom-right-radius: 10rpx;
				}

			}

		}

		.superlf {
			width: 75%;
			position: absolute;
			right: 0;
			background-color: #fbfafa;

			.allchoos1 {
				width: 100%;
				display: flex;

				/deep/ .u-tabs__wrapper__nav__item__text {
					font-size: 30rpx;
				}

				/deep/.u-tabs__wrapper__nav__item {
					height: 35px !important;
					padding: 0 15rpx;
				}

				>view:first-child {
					width: 90%;
				}

				>view:nth-child(2) {
					width: 10%;
					background-color: #fff;
					text-align: center;
					position: relative;

					text {
						position: absolute;
						top: 50%;
						right: 50%;
						transform: translate(50%, -50%);
					}
				}
			}

			.allchoos {
				font-size: 28rpx;
				width: 100%;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 99999;
				background-color: #fff;

				>view:first-child {
					display: flex;
					// justify-content: space-around;
					flex-wrap: wrap;
					padding-top: 10rpx;

					>view {
						width: 32%;
						padding: 9rpx 0;
						background-color: #f5f6f8;
						border-radius: 5rpx;
						margin-bottom: 15rpx;
						text-align: center;
						margin-right: 2%;
					}

					>view:nth-child(3n) {
						margin-right: 0;
					}
				}

				>view:nth-child(2) {
					text-align: center;
					margin: 10rpx 0;
				}
			}

			.pri {
				width: 100%;
				height: 60rpx;
				display: flex;
				color: #999999;
				background-color: #fff;

				view {
					width: 15%;
					position: relative;
					padding-left: 15rpx;
					padding-top: 10rpx;
					font-size: 28rpx;
				}
			}

			.goodslist {
				width: 95%;
				margin: 0 auto;
				margin-bottom: 20rpx;
				padding: 20rpx 0 20rpx 20rpx;
				background-color: #fff;
				display: flex;
				position: relative;

				image {
					@include image(180rpx, 180rpx, 20rpx) background-color: #ebebeb;
				}

				.quan {
					color: red !important;
					border: 1rpx solid red;
					font-size: 25rpx !important;
					padding: 2rpx 15rpx;
					border-radius: 10rpx;
				}

				.text {
					width: 57%;
					margin-left: 10rpx;
					position: relative;

					.name {
						@include hide() -webkit-line-clamp: 1;
					}

					view:nth-child(2) {
						font-weight: 600;
						margin-bottom: 10rpx;
					}

					.mony {
						color: #f54b4a;
						font-weight: 600;
						position: absolute;
						bottom: 0;

						.smltext {
							color: #999;
							font-weight: normal;
							font-size: 28rpx;
							margin-left: 10rpx;
						}
					}

					.jf {
						color: #f54b4a;
						font-weight: 600;
						position: absolute;
						bottom: 0;

						text {
							color: #f54b4a;
							font-weight: normal;
							font-size: 24rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}

	}
</style>
