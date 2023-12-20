<template>
	<view class="advertisement2 ">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="全部商品" left-icon="back">
			<u-search v-if="flShow" height="50" searchIconSize=40 placeholder="搜索商品" v-model="keyword"
				:showAction="false" @custom="custom" @search="custom" @clickIcon="custom(keyword)"></u-search>
			<view style="width: 100%;text-align: center;font-size: 32rpx;line-height: 44px;" v-else>全部商品</view>
		</uni-nav-bar>
		<!-- 无专柜到家 -->
		<u-sticky :offset-top="offsetTop">
			<view class="contentBottom ">
				<view>
					<view class="zonghe" :style="chooseIndex == 0 ? 'color:red':'color:#000'" @click="salpri(0)">
						综合
						<text
							:class="chooseIndex != 0 ? 'aj aj-jiangxu':comprehensive == true ? 'aj aj-jiangxu acicon':'aj aj-shengxu acicon'"></text>
					</view>
					<view :style="chooseIndex == 1 ? 'color:red':'color:#000'" @click="salpri(1)">销量</view>
					<view class="price" :style="chooseIndex == 2 ? 'color:red':'color:#000'" @click="salpri(2)">
						价格
						<text class="aj aj-shengxu" :class="lift == 1 ? 'acicon': ''"></text>
						<text class="aj aj-jiangxu" :class="lift == 0 ? 'acicon': ''"></text>
					</view>
				</view>
				<view class="zh" v-show="zhShow" :style="{top:zhTop}">
					<view v-for="(item,ind) in zhlist" :key="ind" @click="chooseZh(item,ind)"
						:class="isClick==ind?'acicon':''">{{item.name}}
						<u-icon name="checkbox-mark" :color="isClick==ind?'red':'#fff'" size="40"></u-icon>
					</view>
				</view>
				<view :class="fenlei ? 'aj aj-fenlei' :'aj aj-fenlei1'" @click="changeFl"></view>
			</view>
		</u-sticky>
			<view class="loding" v-if='isloding'>
				<u-loading-icon size=40></u-loading-icon>
			</view>
		<view v-if="goodsList&&goodsList.length!=0">
		<view :class="goodsContent" v-if="goodsList.length!=0">
			<view class="goodlist" v-for="(item,index) in goodsList" :key="index"
				@click="goDetails(item.id,item.shopNo,item.dshopType)">
				<lazy-load :image="item.image" :layoutType="pointLayout"></lazy-load>
				<view class="title">
					<view>{{item.name}}</view>
					<view v-if="item.isSpecials==0">￥{{item.sprice}}</view>
					<view v-if="item.isSpecials!=0">￥{{item.specPrice}}<text
							style="font-size: 25rpx;color:#848282;text-decoration:line-through">￥{{item.sprice}}</text>
					</view>
					<text v-show="item.dshopType=='0003'">专柜到家</text>
				</view>
			</view>
			<u-loadmore v-if="loadShow" fontSize="30" color="#818181" :loading-text="loadingText"
				:nomore-text="nomoreText" height="35" line :status="status" />
		</view>
		</view>
		<view style="text-align: center;padding-top: 20%;" v-if='kong'>暂无商品!</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fenlei: true, //商品展示方式
				goodsContent: 'contentGoods', //商品样式
				pointLayout: 'pointLayout2',
				lift: -1, //价格升降 0-降序，1-升序
				zhlist: [{
					name: '综合排序'
				}, {
					name: '新品优先'
				}],
				status: 'loading',
				loadingText: '努力加载中',
				nomoreText: '到底了',
				chooseIndex: 0,
				comprehensive: true,
				zhShow: false,
				isClick: 0,
				goodsList: [], //商品列表
				zhTop: 0,
				loadShow: false,
				offsetTop: 0,
				keyword: '',
				flShow: false,
				isloding:true,
				// 控制暂无商品是否隐藏
				kong:false
			};
		},
		onShow() {
			this.click = 1 //第一次点击不显示弹窗
			this.sales = -1 //销量
			this.lift = -1
		},
		onReachBottom() {
			this.pageNum++
			this.loadShow = true
			if(this.flShow)return
			this.$request.getZgpage({
				keyword: this.keyword,
				mobile: this.$store.state.userInfo.mobile,
				shopNo: this.shopNo,
				orderBy: this.orderBy,
				sort: this.sort,
				pageNum: this.pageNum,
			}).then(res => {
				if (res.code == 200) {
					this.goodsList = [...this.goodsList, ...res.data.goods]
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			})
			if(!this.flag)return
			this.$request.getPageWithGoodCategory({
				goodCategoryId:this.id,
				mobile: this.$store.state.userInfo.mobile,
				//shopNo: this.shopNo,
				orderBy: this.orderBy,
				sort: this.sort,
				pageNum: this.pageNum,
			}).then(res => {
				if (res.code == 200) {
					this.goodsList = [...this.goodsList, ...res.data.goods]
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			})

		},
		onLoad(option) {
			this.pageNum = 1
			this.shopNo = option.shopNo
			this.keyword = option.value
			this.orderBy = ''
			this.sort = ''
			this.id = option.id
			this.flag = true
			let that = this
			let pages = getCurrentPages()
			pages[pages.length - 2].route == 'pages/pagesB/classification/classification' ? this.flShow = true : this
				.flShow = false
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					let top = res.statusBarHeight + 44
					that.offsetTop = top / (uni.upx2px(top) / top)
					let info = uni.createSelectorQuery().select(".contentBottom"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.zhTop = data.height + 'px'
					}).exec()
				}
			})
			if(this.flShow){
				this.getPageWithGoodCategory(this.id, this.orderBy, this.sort, '1')
			}else{
				this.getGoodsList(this.keyword, this.orderBy, this.sort, '1')
			}
		},
		methods: {
			getPageWithGoodCategory(id,orderBy,sort,pageNum){
				this.$request.getPageWithGoodCategory({
					goodCategoryId:id,
					mobile: this.$store.state.userInfo.mobile,
					//shopNo: this.shopNo,
					orderBy: orderBy,
					sort: sort,
					pageNum: pageNum,
				}).then(res => {
					if (res.code == 200) {
						this.isloding=false
						this.goodsList = []
						this.goodsList = res.data.goods
						if(res.data.goods.length==0){
							this.kong =true
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 更多分类的单家商品搜索
			getGoodsList(keyword, orderBy, sort, pageNum) {
				uni.showLoading()
				// 商品
				this.$request.getZgpage({
					keyword: keyword,
					mobile: this.$store.state.userInfo.mobile,
					shopNo: this.shopNo,
					orderBy: orderBy,
					sort: sort,
					pageNum: pageNum,
				}).then(res => {
					if(res.hotGoodsVO!=0){
						this.goodsList=res.hotGoodsVO
					}
					uni.hideLoading()
					if (res.code == 200) {
						// 这个判断没用
						// this.goodsList = []
						// this.goodsList = res.data.hotGoodsVO
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goDetails(id, shopNo, dshopType) {
				uni.navigateTo({
					url: `/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${shopNo}&dshopType=${dshopType}`
				})
			},
			changeFl() {
				this.fenlei = !this.fenlei
				this.fenlei ? (this.goodsContent = 'contentGoods', this.pointLayout = 'pointLayout2') : (this
					.goodsContent = 'contentGoods1', this.pointLayout = 'pointLayout1')
			},
			salpri(index) {
				this.pageNum = 1
				this.chooseIndex = index
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				if (index == 2) {
					// 价格
					this.orderBy = 'price'
					this.lift++
					this.zhShow = false
					if (this.lift >= 2) {
						this.lift = 0
					}
					this.click = 2
					let pricesj = ''
					this.lift == 1 ? this.sort = 'asc' : this.sort = 'desc'
					if(this.flShow){
						this.getPageWithGoodCategory(this.id, this.orderBy, this.sort, this.pageNum)
					}else{
						this.getGoodsList(this.keyword, this.orderBy, this.sort, this.pageNum)
					}
				} else if (index == 0) {
					// 综合
					this.lift = -1
					if (this.click == 2) {
						this.zhShow = false
						this.comprehensive = true
						this.click = 1
						// this.getGoodsList(this.keyword, '', '', this.pageNum)
						// 修复综合排列展示数据有误
						this.getPageWithGoodCategory(this.id, this.orderBy, this.sort, '1')
						return
					}
					this.comprehensive = !this.comprehensive
					this.comprehensive == false ? this.zhShow = true : this.zhShow = false
				} else {
					// 销量
					this.click = 2
					this.lift = -1
					this.zhShow = false
					this.sales++
					this.zhShow = false
					if (this.sales >= 2) {
						this.sales = 0
					}
					this.sales == 1 ? this.sort = 'asc' : this.sort = 'desc'
					this.orderBy = 'sales'
					if(this.flShow){
						this.getPageWithGoodCategory(this.id, this.orderBy, this.sort, this.pageNum)
					}else{
						this.getGoodsList(this.keyword, this.orderBy, this.sort, this.pageNum)
					}
				}
			},
			chooseZh(item, index) {
				this.isClick = index
				this.zhShow = false
				this.comprehensive = true
				index == 0 ? this.orderBy = '' : this.orderBy = 'createDate'
				if(this.flShow){
					this.getPageWithGoodCategory(this.id, this.orderBy, '', this.pageNum)
				}else{
					this.getGoodsList(this.keyword, this.orderBy, '', this.pageNum)
				}
			},
			custom(value) {
				this.pageNum = 1
				if (value == "") {
					uni.showToast({
						title: '请输入商品名称',
						icon: 'none',
						duration: 1000
					});
					return
				}
				if(this.flShow){
					this.flag = false
				}
				this.flShow = false
				this.getGoodsList(value, this.orderBy, '', this.pageNum)
			},
		}
	}
</script>

<style lang="scss">
	// 加载动画
	.loding{
		margin-top: 100rpx
	}
	@import "@/static/style/uni.scss";

	.advertisement2 {
		/deep/ .uni-navbar__header-container {
			padding: 0 50rpx 0 0rpx !important;
		}
		.acicon {
			color: red !important;
		}
		.contentBottom {
			background-color: #fff;
			padding: 20rpx 0;
			display: flex;
			position: relative;

			>view:first-child {
				width: 88%;
				border-right: 1rpx solid #dadada;
				display: flex;
				justify-content: space-around;
				position: relative;

				view {
					width: 30%;
					text-align: center;
				}

				.zonghe {
					.aj-shengxu {
						color: #717171;
						position: absolute;
					}

					.aj-jiangxu {
						color: #717171;
						position: absolute;
					}
				}

				.price {
					.aj-shengxu {
						color: #717171;
						position: absolute;
						top: -6rpx;
					}

					.aj-jiangxu {
						color: #717171;
						position: absolute;
						bottom: 2rpx
					}
				}
			}

			>view:nth-child(3) {
				width: 11%;
				font-size: 40rpx;
				margin-left: 20rpx;
				font-weight: 600;
				color: #9c9c9c;
			}

			.zh {
				position: absolute;
				width: 100%;
				background: #fff;
				z-index: 1;

				view {
					padding: 10rpx 30rpx;
					position: relative;

					view {
						position: absolute;
						right: 2%;
						top: 0;
					}
				}
			}
		}

		.contentGoods {
			padding: 15rpx 0;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 95%;
			margin: 0 auto;
			margin-bottom: 80rpx;

			.goodlist {
				width: 48%;
				margin-bottom: 40rpx;
				background-color: #fff;
				padding-bottom: 10rpx;
				border-top-left-radius: 50rpx;
				border-top-right-radius: 50rpx;
			}

			.title {
				padding: 0 10rpx;

				&>view:nth-child(1) {
					margin-top: 15rpx;
					margin-bottom: 10rpx;
					@include hide(1)
				}

				&>view:nth-child(2) {
					color: red;
				}

				&>text {
					color: #cf3a4e;
					border: 1rpx solid #cf3a4e;
					border-radius: 10rpx;
					padding: 4rpx 10rpx;
					font-size: 24rpx;
				}
			}
		}

		.contentGoods1 {
			width: 95%;
			margin: 0 auto;
			margin-bottom: 80rpx;

			.goodlist {
				display: flex;
				margin-bottom: 15rpx;
				background-color: #fff;
				border-top-left-radius: 50rpx;
				border-bottom-left-radius: 50rpx;
			}

			.title {
				margin-left: 15rpx;
				padding: 10rpx 0;

				&>view:nth-child(1) {
					margin-top: 15rpx;
					margin-bottom: 100rpx;
					@include hide
				}

				&>view:nth-child(2) {
					color: red;
				}

				&>text {
					color: #cf3a4e;
					border: 1rpx solid #cf3a4e;
					border-radius: 10rpx;
					padding: 4rpx 10rpx;
					font-size: 24rpx;
				}
			}
		}

		.daogoou {
			font-size: 28rpx;
			padding: 30rpx 0;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			width: 100%;
			text-align: center;
		}

	}
</style>
