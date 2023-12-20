<template>
	<view class="commoditys u-skeleton-fillet">
		<roll ref="roll" :list="classification" @getHotGoods="getHotGoods" :stop.sync="stop" right="10rpx" left="10rpx"
			both="0 10rpx"></roll>
		<view v-if="!classification.length>0">
			<view>
				<view class="" v-if="yemianURL=='pages/tabbar/supermarket/supermarket'">
					<view class="roll"> </view>
					<view class="xia">
						<view>
							<view class="nei">
							</view>
						</view>
						<view></view>
					</view>
				</view>
			</view>
		</view>
		<view :class="[themeLayout || layoutType]">
		<!-- 	<view class="commodity1" v-for="(itemII, i) in search || commodityColumn" :key="i"
				@click="godetail(`${itemII.id}_${itemII.shopNo||itemII.sshopId}`)"> -->
				<view class="commodity1" v-for="(itemII, i) in search || commodityColumn" :key="i"
					@click="godetail(i)">
				<view>
					<lazy-load :image="itemII.image||itemII.pic" :layoutType="themeLayout || layoutType"></lazy-load>
				</view>
				<view class="title" v-if="show" :style="bjStyle">{{titleName}}</view>
				<view class="describe" v-if="itemII.description != ''">
					{{ itemII.description }}
					<view></view>
				</view>
				<!-- 这里是为了  yongchu  （0是专区 1是新人专享）  是为了处理新人专享 但是价格名字参数的不一致 为了复用页面 -->
				<view class="zi" :style="classification.length == 0 || 'top:42%;left:55%'" v-if="yongchu==0"> 
					<view>{{ itemII.name}}</view>
					<view>
<!-- 						<text class="quan" v-for="(ite, ind) in itemII.collectElectList.slice(0, 1)"
							:key="ind">满{{ ite.consume }}减{{ ite.reduceMoney }}</text> -->
					</view>
					<text>￥</text>
					<!-- 特价商品展示价格 -->
				<text v-if="itemII.isSpecials == 1">
					<text v-if="(itemII.isSpecials == 1 ) || (itemII.isSpecials == 2 )">{{ itemII.specPrice }}</text>
					<text class="jiage"
						v-if="(itemII.isSpecials == 1 ) || (itemII.isSpecials == 2)">￥{{ itemII.sprice }}</text>
					<text v-if="itemII.isSpecials == 0 ">{{ itemII.sprice }}</text>
					<text v-if="itemII.isSpecials == 2 "
						style="margin-left: 2%;color: #fff;font-size: 29rpx;background-color: red;;border-radius: 4rpx;padding: 0 5rpx;">
						8.8折
					</text>
				<!-- 	<text v-if="itemII.redMoney > 0" style="font-size: 32rpx;">
						<text>{{ itemII.sprice }}</text>
						+{{ itemII.redMoney }}{{ wptype }}
					</text> -->
				</text>
				<!-- 普通商品展示价格 -->
				<text v-else>
					<text v-if="(itemII.isSpecials == 1 && itemII.redMoney == 0) || (itemII.isSpecials == 2 && itemII.redMoney == 0)">{{ itemII.specPrice }}</text>
					<text class="jiage"
						v-if="(itemII.isSpecials == 1 && itemII.redMoney == 0) || (itemII.isSpecials == 2 && itemII.redMoney == 0)">￥{{ itemII.sprice }}</text>
					<text v-if="itemII.isSpecials == 0 && itemII.redMoney == 0">{{ itemII.sprice }}</text>
					<text v-if="itemII.isSpecials == 2 && itemII.redMoney == 0"
						style="margin-left: 2%;color: #fff;font-size: 29rpx;background-color: red;;border-radius: 4rpx;padding: 0 5rpx;">
						8.8折
					</text>
					<text v-if="itemII.redMoney > 0" style="font-size: 32rpx;">
						<text>{{ itemII.sprice }}</text>
						+{{ itemII.redMoney }}{{ wptype }}
					</text>
				</text>
				</view>
				<view class="zi" :style="classification.length == 0 || 'top:42%;left:55%'" v-else>
									<view>{{ itemII.name}}</view>
									<view>
				<!-- 						<text class="quan" v-for="(ite, ind) in itemII.collectElectList.slice(0, 1)"
											:key="ind">满{{ ite.consume }}减{{ ite.reduceMoney }}</text> -->
									</view>
									<text>￥</text>
								<text @click="chakan">{{ itemII.newMemberPrice}}</text>
								</view>
				<!-- <view class="buy" v-if="show" :style="bjStyle">立即购买</view> -->
			</view>
		</view>
		<!-- 动画设置 -->

		<!-- <u-loadmore v-if="classification != 0 && commodityColumn[0].length != 0" fontSize="30" color="#000000" :loading-text="loadingText" height="35" line :status="status" /> -->

		<u-loadmore v-if="classification != 0 && commodityColumn[0].length != 0" fontSize="30" color="#000000"
			:loading-text="loadingText" height="35" line :status="status" />
		<u-empty :show="judge" iconSize="195px" width="135px" height="135px" textSize="22px" textColor="transparent"
			icon="/static/SVG/kong.svg" text="哎呀,商品空空如也"></u-empty>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			classification: {
				//不传分类不展示
				type: Array
				// default:
			},
			shopList: {
				//主题商品
				type: Array,
				default: [
					[]
				]
			},
			bjStyle: {
				//背景色
				type: String,
				default: 'background:linear-gradient(90deg, rgb(255, 181, 0) 7%, rgb(255, 0, 0) 89%)'
			},
			detailed: {
				//标题描述
				type: String
			},
			titleName: {
				//标题名称
				type: String
			},
			yongchu1: {
				//标题名称
				type: Number
			},
			page: {
				type: Number,
				default: 1
			},
			themeLayout: {
				//主题商品布局 有值是渲染
				type: String,
				default: ''
			},
			search: '',
			isWeipuShop: uni.getStorageSync('isWeipuShop') // isWeipuShop 
		},
		data() {
			return {
				commodityColumn: [], //商品
				status: 'loadmore', //加载更多提示文字
				loadingText: '努力加载中，先喝杯茶',
				judge: false, //内容为空是否显示
				stop: true, //是否阻止上拉加载
				wptype: uni.getStorageSync('ishongbao'), //积分或红包
				_shopNo: '',
				yemianURL: '',
				yongchu:0 //为了区别专区跟新人专区的价格和名字做区分 （因为接口不一样返回的数据也不一样）
				// isWeipuShop1: uni.getStorageSync('isWeipuShop') // isWeipuShop == 1展示红包
			};
		},
		watch:{
			shopList(){
				console.log('数组变化了');
				this.show && this.breakdown(this.shopList, this.themeLayout.slice(-1));
			}
		},
		computed: {
			...mapState(['layoutType'])
		},
		mounted() {
			// 如果没进去就是再专区用 如果判断进去了就是再新人专区用
			if(this.yongchu1){
				this.yongchu = this.yongchu1
			}
			this.show && this.breakdown(this.shopList, this.themeLayout.slice(-1));
			uni.$once('getHotGoods', data => {
				this.getHotGoods(data);
				console.log('触发', data)
			});
			let pages = getCurrentPages();
			if (pages.length == 1) {
				this.yemianURL = pages[0].route
			} else {
				this.yemianURL = pages[1].route
			}
			// this.yemianURL = pages[0].route
		},
		methods: {
			chakan(){
				console.log('查看数据',this.shopList);
			},
			// 分类请求 搜索请求
			async getHotGoods(argument, ismore) {
				let res = await new Promise((resolve, fulfilled) => {
					if (getCurrentPages().length > 1) {
						var pages = getCurrentPages(); // 当前页面
						var beforePage = pages[pages.length - 2];
						if (beforePage.route == 'pages/tabbar/supermarket/supermarket') {
							// console.log('超市搜索')
							this._shopNo = uni.getStorageSync('cs_num')
							// console.log('超市',this._shopNo)
						} else if (beforePage.route == 'pages/tabbar/generalMerchandise/generalMerchandise') {
							// console.log('百货搜索')
							// console.log(uni.getStorageSync('bh_num'))
							this._shopNo = uni.getStorageSync('bh_num')
							// console.log('百货',this._shopNo)
						} else if (beforePage.route == 'pages/pagesC/storeSearch/storeSearch') {
							this._shopNo = uni.getStorageSync('bh_num')
						} else {
							this._shopNo = getApp().globalData.shopNo
						}
					}
					argument.constructor != Object ?
						this.$request
						.getSearch({
							keyword: argument,
							mobile: this.$store.state.userInfo.mobile,
							// shopNo: getApp().globalData.shopNo,
							shopNo: this._shopNo,
						}, {
							'Content-type': 'application/x-www-form-urlencoded'
						})
						.then(res => {
							if (res.hotGoodsVO.length == 0) {
								uni.showToast({
									title: "该门店下暂无此类商品~",
									icon: "none",
									duration: 1000
								});
							}
							resolve(res);
						}) :
						((this.status = 'loading'),
							uni.$u.http
							.get(this.$request.getHotGoods, {
								params: argument,
							})
							.then(res => {
								// 如果商品的条数小于12条 则说明数据加载完毕了
								if (res.hotGoods && res.hotGoods.length < 12) {
									this.status = 'nomore'
								}
								resolve(res);
							}));
				});
				// res.hotGoodsVO  搜索的商品列表
				res.hotGoodsVO ? (res.hotGoods = res.hotGoodsVO) : '';
				if (res.code == 200) {
					if (res.hotGoods.length == 0) {
						this.stop = false;
						this.status = 'nomore';
						if (argument.page == 1) {
							(this.judge = true), (this.commodityColumn = []);
						}
						return;
					}
				}

				this.wptype = res.type;
				this.breakdown(res, ismore);
			},
			breakdown(...res) {
				let list = this.classification.length != 0 ? res[0].hotGoods || res[0] : this.show ? [...res[0]] : res[0]
					.hotGoods;
				Boolean(res[1]) ? '' : (this.commodityColumn = []);
				if (list) {
					this.commodityColumn.push(...list);
				}
				// this.judge = false;
			},
			//商品详情
			godetail(index) {
				let  data = this.search || this.commodityColumn
				// ${itemII.id}_${itemII.shopNo||itemII.sshopId}`)
				let DATA = data[index]
				let id = `${DATA.id}_${DATA.shopNo||DATA.sshopId}`
				if (this.wptype == '积分') {
					uni.navigateTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${id}`
					});
				} else if (this.isWeipuShop == 1) {
					uni.navigateTo({
						url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${id}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/pagesA/goodsDetails/goodsDetails?id=${id}&xiangou=${DATA.newLimitNumber}&isxinren=${DATA.newMember}`
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '@/static/style/uni.scss';
	$marginBottom: 30rpx;

	@mixin gong {
		--width: 100%;
		display: flex;
		width: var(--width);
	}

	.roll {
		height: 100rpx;
		width: 700rpx;
		margin: 0 auto;
		// background-color: ;
		background: linear-gradient(to right, #f3f4f6, #e9eaeb);
		border-radius: 30px;
	}

	.xia {
		justify-content: space-between;
		flex-wrap: wrap;
		--width: 100%;
		display: flex;
		width: var(--width);
		margin-top: 20rpx;
		// overflow: hidden;
	}

	.xia>view {
		width: 49%;
		margin-bottom: 15rpx;
		padding-bottom: 15rpx;
		height: 348rpx !important;
		border-radius: 10px;
		overflow: hidden;
		background: linear-gradient(to bottom, #f3f4f6, #e9eaeb);
		// background-color:#e9eaeb;
	}

	// .nei{
	// 	height: 348rpx;
	// 	width:700rpx;
	// 	background: linear-gradient(to right,  #f6053e,#92eb0c );
	// 	// transition: all 2s;
	// 	transform: translateX(-300rpx);

	// 	}
	.commoditys {
		.commodity1 {
			position: relative;
			// background-color: #fff;
			border-radius: $marginBottom;

			.title {
				$height: 50rpx;
				height: $height;
				color: #fff;
				line-height: $height;
				text-align: center;
				border-radius: 30rpx 15rpx 50rpx 0;
			}

			.describe {
				color: #3e3699;
				@include hide(2, 110rpx);

				view {
					width: 100rpx;
					height: 30rpx;
					border-bottom: 2rpx solid #3e3699;
				}
			}

			.zi {
				text {
					font-size: 35rpx;
					color: red;
				}

				.quan {
					color: red !important;
					border: 1rpx solid red;
					font-size: 25rpx !important;
					padding: 0 15rpx;
					border-radius: 10rpx;
				}

				.quan:first-child {
					margin-right: 10rpx;
				}

				view {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.jiage {
					font-size: 25rpx;
					color: #bebdc2 !important;
					text-decoration: line-through;

					&>text:nth-child(3) {
						font-size: 40rpx;
					}
				}
			}

			.buy {
				$height: 50rpx;
				width: 44%;
				height: $height;
				line-height: $height;
				color: #fff;
				border-radius: 50rpx;
				text-align: center;
			}
		}

		.themes {
			position: relative;
			width: 100%;
			border-radius: 15rpx;
			margin-bottom: 20rpx;
			text-align: center;

			.frame {
				@include absolute(17%, 50%) @include image(40%, 75rpx) text {
					@include absolute(5%, 50%);
				}
			}

			image {
				@include image(100%, 100%);
			}

			&>view:nth-child(2) {
				background: #e6e7fb;
				height: 150rpx;

				padding: {
					top: 30rpx;
					left: 15rpx;
					right: 15rpx;
				}

				view {
					width: 100%;
					height: 100%;
					color: #fff;
					background: #7057e6;

					border: {
						top-left-radius: 20rpx;
						top-right-radius: 20rpx;
					}

					box-shadow: 1rpx 13rpx 15rpx 14rpx #a07bef inset;
				}
			}

			>text {
				position: absolute;
				top: 55%;
				transform: translateX(-50%);

				font: {
					size: 45rpx;
					weight: 900;
					family: cursive;
				}

				color: #fff;
				width: 100%;
			}

			&>view:nth-child(4) {
				@include absolute(80%, 50%) width: 80%;
				height: 4rpx;
				// background: #fff;
				margin: 10rpx auto;
			}
		}

		.elasticLayout1 {
			--size: 330rpx;
			border-radius: 15rpx;

			.commodity1 {
				margin-bottom: $marginBottom;

				view:first-child {
					width: 330rpx;
				}

				.title {
					@include absolute(0%, 0);
					width: 23%;
				}

				--left: 49%;

				.describe {
					@include absolute(3%, var(--left)) view {
						height: 22rpx;
					}
				}

				.zi {
					@include absolute(10%, var(--left)) view {
						@include hide(2, 80rpx);
					}
				}

				.buy {
					@include absolute(80%, var(--left));
				}
			}
		}

		.elasticLayout2 {
			justify-content: space-between;
			flex-wrap: wrap;
			@include gong;

			&>view:nth-child(1) {
				margin-right: 2%;
			}

			.commodity1 {
				width: 49%;
				margin-bottom: 15rpx;
				padding-bottom: 15rpx;

				.describe {
					view {
						height: 12rpx;
					}
				}

				.title {
					@include absolute(-0%, 0%);
					width: 55%;
				}

				.zi {
					max-height: 132rpx;
					width: var(--width);

					view:nth-child(2) {
						padding: 5rpx 0;
					}
				}

				.buy {
					@include absolute(88%, 55%);
				}
			}
		}

		.elasticLayout3 {
			@include gong;
			flex-wrap: wrap;

			&>view {
				margin-right: 2%;
			}

			&>view:nth-child(3n) {
				margin-right: 0;
			}

			.commodity1 {
				width: 32%;
				margin-bottom: 25rpx;

				.describe {
					view {
						height: 7rpx;
					}
				}

				.title {
					@include absolute(0%, 0%);
					width: 70%;
				}

				.zi {
					margin: 15rpx auto;

					view {
						@include hide(1, 80rpx);
					}
				}

				.buy {
					width: 100%;
				}
			}
		}
	}
</style>
