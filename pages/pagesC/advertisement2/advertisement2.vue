<template>
	<view class="advertisement2 u-skeleton">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" :title="storeDetails.name" left-icon="back"></uni-nav-bar>
		<!-- 无专柜到家 -->
		<u-skeleton :loading="skeletonLoading" :animation="true" bgColor="#FFF"></u-skeleton>
		<view class="nulContent u-skeleton-fillet" v-if="nulContent == 'false'">
			<view class="nulTop">
				<image :src="storeDetails.image" mode=""></image>
				<view class="nulName">00{{ storeDetails.name }}</view>
				<view class="nulAddress">{{ storeDetails.address }}</view>
			</view>
			<view class="nulcont aj aj-jinrujiantou" @click="goPhone">
				电话：
				<text>{{ storeDetails.storeMobile }}</text>
			</view>
			<view class="nulcont aj aj-jinrujiantou" @click="openmap(storeDetails.name, storeDetails.address, storeDetails.latitude, storeDetails.longitude)">
				地址：
				<text>{{ storeDetails.address }}</text>
			</view>
		</view>

		<view class="content u-skeleton-fillet">
			<view v-if="nulContent != 'false'" class="contentTop u-skeleton-fillet">
				<!-- 搜索 -->
				<u-search
					margin="20rpx 20rpx"
					bgColor="rgba(0, 0, 0, 0.1)"
					height="70"
					searchIconSize="60"
					placeholder="搜索店铺内商品"
					@custom="custom"
					@search="custom"
					@clickIcon="custom(keyword)"
					v-model="keyword"
				></u-search>
				<view class="storeContent">
					<view class="topleft">
						<view @click="goStore">
							<text class="aj aj-jinrujiantou">{{ storeDetails.name }}</text>
						</view>
						<!-- <text>000人关注</text> -->
					</view>
					<view class="topright">
						<view @click="guanzhu">
							<view :class="isGuanzhu ? 'aj aj-guanzhu' : 'aj aj-a-tianjiaguanzhuguanzhu'"></view>
							<view v-if="!isGuanzhu">关注</view>
							<view v-else="isGuanzhu">已关注</view>
						</view>
						<view>
							<view class="aj aj-fenxiang"></view>
							<view>分享</view>
							<button open-type="share" class="btnshare"></button>
						</view>
					</view>
				</view>
				<view>品牌专柜地址</view>
				<view class="distance">
					<view>
						<text class="aj aj-31dingwei"></text>
						{{ storeDetails.address }}
					</view>
					<view>{{ distance.toFixed(2) }}km</view>
				</view>
				<view class="timebutton">
					<text class="lianxi aj aj-iconlianxi" @click="goZs(storeMobile)">联系导购</text>
					<text class="daohang aj aj-daohang" @click="openmap(storeDetails.name, storeDetails.address, storeDetails.latitude, storeDetails.longitude)">路线导航</text>
				</view>
			</view>
			<view v-if="nulContent != 'false'" class="contentCenter u-skeleton-fillet">
				<text class="lianxi " v-for="(item, index) in centerList" :key="index">
					<text :class="item.icon"></text>
					{{ item.name }}
				</text>
			</view>
			<u-sticky :offset-top="offsetTop">
				<view v-if="nulContent != 'false'" class="contentBottom u-skeleton-fillet">
					<view>
						<view class="zonghe" :style="chooseIndex == 0 ? 'color:red' : 'color:#000'" @click="salpri(0)">
							综合
							<text :class="chooseIndex != 0 ? 'aj aj-jiangxu' : comprehensive == true ? 'aj aj-jiangxu acicon' : 'aj aj-shengxu acicon'"></text>
						</view>
						<view :style="chooseIndex == 1 ? 'color:red' : 'color:#000'" @click="salpri(1)">销量</view>
						<view class="price" :style="chooseIndex == 2 ? 'color:red' : 'color:#000'" @click="salpri(2)">
							价格
							<text class="aj aj-shengxu" :class="lift == 1 ? 'acicon' : ''"></text>
							<text class="aj aj-jiangxu" :class="lift == 0 ? 'acicon' : ''"></text>
						</view>
					</view>
					<view class="zh" v-show="zhShow" :style="{ top: zhTop }">
						<view v-for="(item, ind) in zhlist" :key="ind" @click="chooseZh(item, ind)" :class="isClick == ind ? 'acicon' : ''">
							{{ item.name }}
							<u-icon name="checkbox-mark" :color="isClick == ind ? 'red' : '#fff'" size="40"></u-icon>
						</view>
					</view>
					<view :class="fenlei ? 'aj aj-fenlei' : 'aj aj-fenlei1'" @click="changeFl"></view>
				</view>
				<view v-if="nulContent != 'false'" style="width: 100%;background-color: #fff;">
					<u-tabs :list="categoryList" lineWidth="0" lineHeight="0" :activeStyle="{ color: 'red', fontWeight: 'bold' }" @click="changeSec" :current="current"></u-tabs>
				</view>
			</u-sticky>
			<view :class="goodsContent" v-if="goodsList.length != 0 && nulContent != 'false'">
				<view class="goodlist u-skeleton-fillet" v-for="(item, index) in goodsList" :key="index" @click="goDetails(item.id, item.shopNo, item.dshopType)">
					<lazy-load :image="item.image" :layoutType="pointLayout"></lazy-load>
					<view class="title">
						<view>{{ item.name }}</view>
						<view v-if="item.isSpecials == 0">￥{{ item.sprice }}</view>
						<view v-if="item.isSpecials != 0">
							￥{{ item.specPrice }}
							<text style="font-size: 25rpx;color:#848282;text-decoration:line-through">￥{{ item.sprice }}</text>
						</view>
						<text v-show="item.dshopType == '0003'">专柜到家</text>
					</view>
				</view>
			</view>
			<u-loadmore v-if="loadShow" fontSize="30" color="#818181" :loading-text="loadingText" :nomore-text="nomoreText" height="35" line :status="status" />
			<!-- <view v-show="!skeletonLoading && nulContent!='false'" class="daogoou aj aj-daipingjia u-skeleton-fillet"
				@click="goZs">联系专属导购</view> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			fenlei: true, //商品展示方式
			goodsContent: 'contentGoods', //商品样式
			pointLayout: 'pointLayout2',
			lift: -1, //价格升降 0-降序，1-升序
			centerList: [
				{
					name: '正品保证',
					icon: 'aj aj-anquanbaozhang-xianxing'
				},
				{
					name: '退换无忧',
					icon: 'aj aj-tuihuotuikuan'
				},
				{
					name: '敢比价贵',
					icon: 'aj aj-shouhou'
				}
			],
			zhlist: [
				{
					name: '综合排序'
				},
				{
					name: '新品优先'
				}
			],
			status: 'loading',
			loadingText: '努力加载中',
			nomoreText: '到底了',
			chooseIndex: 0,
			comprehensive: true,
			zhShow: false,
			isClick: 0,
			goodsList: [], //商品列表
			storeDetails: {
				name: '',
				address: '',
				latitude: '',
				longitude: '',
				manager: '',
				storeMobile: '',
				mobilePhone: '',
				image: ''
			},
			offsetTop: 0,
			zhTop: 0,
			loadShow: false,
			skeletonLoading: true,
			isGuanzhu: null,
			distance: uni.getStorageSync('distance') || 0,
			nulContent: '', //有无专柜
			categoryList: [], //二级分类
			current: 0,
			storeMobile: ''
		};
	},
	onShow() {
		this.keyword = '';
		this.click = 1; //第一次点击不显示弹窗
		this.pageNum = 1;
		this.nogood = false;
		this.nowid = '';
		this.firstid = '';
		if (uni.getStorageSync('token') == '') {
			uni.navigateTo({
				url: '/pages/pagesA/denglu/denglu'
			});
			return;
		}
		uni.getSetting({
			success: res => {
				if (!res.authSetting['scope.userLocation']) {
					uni.showToast({
						title: '您还没有开启位置信息',
						icon: 'none'
					});
					return;
				}
			}
		});
		if (this.nulContent != 'false') {
			let that = this;
			uni.getSystemInfo({
				//获取系统信息
				success: res => {
					let top = res.statusBarHeight + 44;
					that.offsetTop = top / (uni.upx2px(top) / top);
					let info = uni.createSelectorQuery().select('.contentBottom'); // 获取某个元素
					info.boundingClientRect(function(data) {
						//data - 各种参数
						that.zhTop = data.height + 'px';
					}).exec();
				}
			});
		}

		this.$request
			.postZgDetail(
				{
					shopNo: this.shopNo,
					mobile: this.$store.state.userInfo.mobile
				},
				{
					'Content-type': 'application/x-www-form-urlencoded'
				}
			)
			.then(res => {
				// 店铺信息
				if (res.code == 200) {
					this.storeMobile = res.data.wpDeliveryStore.storeMobile;
					// console.log('信息是', this.storeMobile);
					this.firstid = res.data.goodCategory;
					this.nowid = this.firstid;
					this.storeDetails = res.data.wpDeliveryStore;
					this.phone = res.data.wpDeliveryStore.storeMobile;
					this.isGuanzhu = res.data.guanzhu;
					if (this.nulContent != 'false') {
						this.$request
							.getPageWithGoodCategory({
								goodCategoryId: this.nowid,
								mobile: this.$store.state.userInfo.mobile,
								shopNo: this.shopNo,
								orderBy: this.orderBy,
								sort: this.sort,
								pageNum: this.pageNum
							})
							.then(res => {
								this.skeletonLoading = false;
								if (res.code == 200) {
									this.categoryList = res.data.cate;
									this.categoryList.unshift({
										id: this.firstid,
										name: '全部',
										index: 0
									});
									this.goodsList = [];
									this.goodsList = res.data.goods;
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									});
								}
							});
					} else {
						this.skeletonLoading = false;
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
	},
	onReachBottom() {
		this.pageNum++;
		this.loadShow = true;
		if (this.nogood) return;
		this.$request
			.getPageWithGoodCategory({
				goodCategoryId: this.nowid,
				mobile: this.$store.state.userInfo.mobile,
				shopNo: this.shopNo,
				orderBy: this.orderBy,
				sort: this.sort,
				pageNum: this.pageNum
			})
			.then(res => {
				if (res.code == 200) {
					if (res.data.goods == 0) {
						this.status = 'nomore';
						this.nogood = true;
						return;
					}
					this.nogood = false;
					this.goodsList = [...this.goodsList, ...res.data.goods];
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
	},
	onLoad(option) {
		console.log('二级页面携带参数',option);
		this.nulContent = option.zg;
		this.shopNo = option.shopNo;
		this.phone = '';
		this.orderBy = '';
		this.sort = '';
		this.sales = -1; //销量
		this.lift = -1;
	},
	methods: {
		getGoodsList(goodCategoryId, orderBy, sort, pageNum) {
			uni.showLoading();
			// 商品
			this.$request
				.getPageWithGoodCategory({
					goodCategoryId: goodCategoryId,
					mobile: this.$store.state.userInfo.mobile,
					shopNo: this.shopNo,
					orderBy: orderBy,
					sort: sort,
					pageNum: pageNum
				})
				.then(res => {
					uni.hideLoading();
					this.skeletonLoading = false;
					if (res.code == 200) {
						this.goodsList = [];
						this.goodsList = res.data.goods;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
		},
		guanzhu() {
			this.$request
				.postGuanzhu(
					{
						shopNo: this.shopNo,
						mobile: this.$store.state.userInfo.mobile
					},
					{
						'Content-type': 'application/x-www-form-urlencoded'
					}
				)
				.then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: !this.isGuanzhu ? '关注成功' : '已取消关注',
							icon: 'none'
						});
						this.isGuanzhu = !this.isGuanzhu;
					} else {
						unis.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		goStore() {
			uni.navigateTo({
				url: `/pages/pagesC/advertisement4/advertisement4?shopNo=${this.shopNo}&image=${this.storeDetails.image}&name=${this.storeDetails.name}`
			});
		},
		// 点击拨打电话
		goZs(phone) {
			const res = uni.getSystemInfoSync();

			// ios系统默认有个模态框
			if (res.platform == 'ios') {
				uni.makePhoneCall({
					phoneNumber: phone,

					success() {
						console.log('拨打成功了');
					},
					fail() {
						console.log('拨打失败了');
					}
				});
			} else {
				//安卓手机手动设置一个showActionSheet
				uni.showActionSheet({
					itemList: [phone, '呼叫'],
					success: function(res) {
						console.log(res);
						if (res.tapIndex == 1) {
							uni.makePhoneCall({
								phoneNumber: phone
							});
						}
					}
				});
			}
			// uni.navigateTo({
			// 	url: `/pages/pagesC/advertisement3/advertisement3?name=${this.storeDetails.manager}&phone=${this.storeDetails.mobilePhone}&image=${this.storeDetails.image}`
			// })
		},
		goDetails(id, shopNo, dshopType) {
			uni.navigateTo({
				url: `/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${shopNo}&dshopType=${dshopType}`
			});
		},
		goPhone() {
			uni.makePhoneCall({
				phoneNumber: this.phone, // 这里就是自己要拨打的电话号码
				success: res => {
					console.log('调用成功!', res);
				},
				fail: res => {
					console.log('调用失败!', res);
				}
			});
		},
		openmap(...data) {
			uni.openLocation({
				latitude: data[2],
				longitude: data[3],
				name: data[0],
				address: data[1]
			});
		},
		changeFl() {
			this.fenlei = !this.fenlei;
			this.fenlei
				? ((this.goodsContent = 'contentGoods'), (this.pointLayout = 'pointLayout2'))
				: ((this.goodsContent = 'contentGoods1'), (this.pointLayout = 'pointLayout1'));
		},
		salpri(index) {
			this.pageNum = 1;
			this.chooseIndex = index;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
			if (index == 2) {
				// 价格
				this.orderBy = 'price';
				this.lift++;
				this.zhShow = false;
				if (this.lift >= 2) {
					this.lift = 0;
				}
				this.click = 2;
				let pricesj = '';
				this.lift == 1 ? (this.sort = 'asc') : (this.sort = 'desc');
				this.getGoodsList(this.nowid, this.orderBy, this.sort, this.pageNum);
			} else if (index == 0) {
				// 综合
				this.lift = -1;
				if (this.click == 2) {
					this.zhShow = false;
					this.comprehensive = true;
					this.click = 1;
					this.getGoodsList(this.nowid, '', '', this.pageNum);
					return;
				}
				this.comprehensive = !this.comprehensive;
				this.comprehensive == false ? (this.zhShow = true) : (this.zhShow = false);
			} else {
				// 销量
				this.click = 2;
				this.lift = -1;
				this.zhShow = false;
				this.sales++;
				this.zhShow = false;
				if (this.sales >= 2) {
					this.sales = 0;
				}
				this.sales == 1 ? (this.sort = 'asc') : (this.sort = 'desc');
				this.orderBy = 'sales';
				this.getGoodsList(this.nowid, this.orderBy, this.sort, this.pageNum);
			}
		},
		chooseZh(item, index) {
			this.isClick = index;
			this.zhShow = false;
			this.comprehensive = true;
			index == 0 ? (this.orderBy = '') : (this.orderBy = 'createDate');
			this.getGoodsList(this.nowid, this.orderBy, '', this.pageNum);
		},
		// 获取输入框 keyword 的实时值
		async custom(value) {
			if (value == '') {
				uni.showToast({
					title: '请输入商品名称',
					icon: 'none',
					duration: 1000
				});
				return;
			}
			uni.navigateTo({
				url: `/pages/pagesC/storeSearch/storeSearch?value=${value}&shopNo=${this.shopNo}`
			});
		},
		changeSec(e) {
			this.current = e.index;
			this.nowid = e.id;
			this.pageNum = 1;
			this.getGoodsList(this.nowid, this.orderBy, this.sort, this.pageNum);
		}
	}
};
</script>

<style lang="scss">
@import '@/static/style/uni.scss';

.advertisement2 {
	.acicon {
		color: red !important;
	}

	.nulContent {
		letter-spacing: 2rpx;

		.nulTop {
			padding: 30rpx 0;
			background-color: #fff;

			image {
				display: block;
				@include image(120rpx, 120rpx, 50%) background-color: #ebebeb;
				margin: 0 auto;
			}

			.nulName {
				font-weight: 600;
				font-size: 32rpx;
				text-align: center;
				margin-top: 30rpx;
			}

			.nulAddress {
				font-weight: normal;
				font-size: 32rpx;
				color: #b0b0b0;
				text-align: center;
				margin-top: 30rpx;
			}
		}

		.nulcont {
			padding: 20rpx;
			background-color: #fff;
			margin-top: 20rpx;
			color: #b0b0b0;

			text {
				color: #000;
			}
		}

		.aj-jinrujiantou:after {
			font-size: 50rpx;
			font-weight: 900;
			float: right;
		}
	}

	.content {
		padding-bottom: 100rpx;

		.contentTop {
			padding: 20rpx;
			background-color: #fff;

			.storeContent {
				display: flex;
				margin-bottom: 25rpx;

				.topleft {
					width: 75%;
					overflow: hidden;

					> view {
						margin-bottom: 15rpx;

						> text {
							font-weight: 600;
							font-size: 40rpx;
						}

						.aj-jinrujiantou:after {
							font-size: 40rpx;
							font-weight: 900;
						}
					}

					> text {
						font-size: 25rpx;
						padding: 5rpx 10rpx;
						background-color: #fd483d;
						color: #fff;
						border-radius: 10rpx;
					}
				}

				.topright {
					width: 25%;
					display: flex;
					justify-content: space-between;

					> view {
						position: relative;

						.aj-guanzhu {
							font-size: 40rpx;
							position: absolute;
							right: 50%;
							transform: translateX(50%);
							color: red;
						}

						.aj-a-tianjiaguanzhuguanzhu {
							font-size: 40rpx;
							position: absolute;
							right: 50%;
							transform: translateX(50%);
						}

						.aj-fenxiang {
							font-size: 40rpx;
							position: absolute;
							right: 50%;
							transform: translateX(50%);
						}

						.btnshare {
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							opacity: 0;
						}

						> view:nth-child(2) {
							margin-top: 45rpx;
						}
					}
				}
			}

			.distance {
				display: flex;

				& > view:first-child {
					width: 75%;
					@include hide(1);
				}

				& > view:nth-child(2) {
					width: 25%;
				}
			}

			.timebutton {
				display: flex;
				margin: 20rpx 0 15rpx 0;
				justify-content: space-around;

				.aj-iconlianxi:before {
					color: #f74c39;
				}

				.lianxi,
				.daohang {
					font-size: 28rpx;
					padding: 10rpx 25rpx;
					border: 1rpx solid #c3c3c3;
					border-radius: 30rpx;
				}
			}
		}

		.contentCenter {
			background-color: #fff;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-around;
			margin: 15rpx 0;
			font-size: 28rpx;
		}

		.contentBottom {
			background-color: #fff;
			padding: 20rpx 0;
			display: flex;
			position: relative;

			> view:first-child {
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
						bottom: 2rpx;
					}
				}
			}

			> view:nth-child(3) {
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

				& > view:nth-child(1) {
					margin-top: 15rpx;
					margin-bottom: 10rpx;
					@include hide(1);
				}

				& > view:nth-child(2) {
					color: red;
				}

				& > text {
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

				& > view:nth-child(1) {
					margin-top: 15rpx;
					margin-bottom: 100rpx;
					@include hide;
				}

				& > view:nth-child(2) {
					color: red;
				}

				& > text {
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
}
</style>
