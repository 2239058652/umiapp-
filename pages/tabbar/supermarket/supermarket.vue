<template>
	<view>
		<!-- 页头 -->
		<view class="pageHeader">
			<page-header-clone2></page-header-clone2>
		</view>
		<view class="supermarket" :style="{paddingTop:topHeight+'px'}">
			<!-- 选项 -->
			<more-options :list="list"></more-options>
			<!-- 选项卡 -->
			<cs-swiper :list1="lists"></cs-swiper>
			<!-- <four-options :lists="lists"></four-options> -->
			<!-- 商品卡片 -->
			<!-- <commodityCard :item="item"></commodityCard>-->
			<!-- 删除了一部分 三排的那个 -->
			<commodityCard></commodityCard>
			<!-- 分类  商品列表 -->
			<commodity ref="commodity" :classification="datas.hotCate"></commodity>
		</view>
		<tabbar></tabbar>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				lod: true,
				list: [],
				item: getApp().globalData.hotGoods,
				classification: null, //分类
				commodityColumn: [],
				lists: null,
				topHeight: 0,
				_shopNo: '',
				datas: {
					// // listMenu:"",//功能分类
					// adslides:"", //轮播图
					// hotCate:"",//分类
					// belowAdvert:[], //轮播图下面
					// rightAdvert:[] //轮播右侧
				},
			};
		},
		computed: {
			...mapState(['storeName'])
		},
		watch: {
			storeName() {
				this.flag = true
			}
		},
		onReachBottom() {
			this.$refs.commodity.stop && (
				this.page += 1,
				this.$refs.commodity.getHotGoods({
					cate: this.$children[4].$refs.roll.cate,
					page: this.page,
					// shopNo: getApp().globalData.shopNo
					shopNo: this._shopNo,
				}, "more"))
		},
		onShow() {
			var pages = getCurrentPages();
			if (pages[0].route == 'pages/tabbar/supermarket/supermarket') {
				this._shopNo = uni.getStorageSync('cs_num')
			} else {
				this._shopNo = getApp().globalData.shopNo
			}
			if (!this.flag) return
			this.flag = false
			this.page = 1
			this.item = getApp().globalData.hotGoods
			this.classification = this.datas.hotCate
			this.lists = getApp().globalData.superMarket
			this.$refs.commodity.getHotGoods({
				cate: this.classification[0].id,
				page: this.page,
				// shopNo: getApp().globalData.shopNo
				shopNo: this._shopNo,
			})
			this.$request.postQueryMarketMenu({
				// shopNo: uni.getStorageSync('storeSn')
			}).then(res => {
				console.log('list',res);
				this.list = res.listMenu
				// this.list.push({
					
				// })
			})
		},
		onLoad() {
			this.getIndex()
			var pages = getCurrentPages();
			if (pages[0].route == 'pages/tabbar/supermarket/supermarket') {
				this._shopNo = uni.getStorageSync('cs_num')
			} else {
				this._shopNo = getApp().globalData.shopNo
			}
			this.page = 1
			this.flag = false
			this.classification = getApp().globalData.classification
			// this.classification = this.datas.[]
			this.lists = getApp().globalData.superMarket
			this.$refs.commodity.getHotGoods({
				page: this.page,
				// shopNo: getApp().globalData.shopNo
				shopNo: this._shopNo,
			})
			this.$request.postQueryMarketMenu({
				// shopNo: uni.getStorageSync('storeSn')
				shopNo: this._shopNo
			}).then(res => {
				this.list = res.listMenu
			})
			let that = this
			uni.getSystemInfo({
				success: function(res) { // res - 各种参数
					let info = uni.createSelectorQuery().select(".pageHeader"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.topHeight = data.height
					}).exec()
				},
			})
		},
		methods: {
			// 获取的是超市页面的分类信息
			getIndex() {
				setTimeout(() => {
						this.lod = false
					}, 2000),
					uni.$u.http.get(this.$request.getIndex, {
						params: {
							shopNo: uni.getStorageSync('cs_num'),
							mobile: this.$store.state.userInfo.mobile,
							page: 1,
						}
					}).then(res => {
						this.datas = res
						// 超市的分类
						getApp().globalData.cs_classification = this.datas.hotCate //分类缓存
						// console.log('分类缓存',this.datas.hotCate);
						this.$refs.commodity.getHotGoods({
							cate: res.hotCate[0].id,
							page: this.page,
							// shopNo: getApp().globalData.shopNo
							shopNo: this._shopNo,
						})
					})
			},
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.u-skeleton-slot {
		@include flex;
		align-items: flex-start;

		&__image {
			width: 40px;
			height: 40px;
			border-radius: 100px;
		}

		&__content {
			margin-left: 10px;
			flex: 1;
		}
	}

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

	.supermarket {
		@include chamfer(25rpx)
	}
</style>
