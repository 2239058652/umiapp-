<template>
	<view class="specialCounter">
		<view class="pageheader" :style="bj">
			<view class="status_bar"></view>
			<view>
				<text class="aj aj-xiangzuojiantou" style="color: #fff;margin-left: 2%;" @click="back"></text>
				<text class="store" @click="location">{{storeName}}<text class="aj aj-daosanjiao" style="color: #fff"
						v-if="storeName!=''"></text></text>
			</view>
			<!-- 搜索 -->
			<u-search margin="12px 20rpx 0px 20rpx" height="70" searchIconSize=60 placeholder="搜索商品" v-model="keyword"
				:showAction="false" :disabled="true" @click="jumpsear">
			</u-search>
		</view>
		<view class="superCenter">
			<view class="superrt">
				<scroll-view scroll-y="true" :style="{Height:Height-10+'px'}" :scroll-top="leftscrollTop" :scroll-with-animation="true">
					<view :class="[isIndex == index? 'superlist actived' : 'superlist']"
						v-for="(item,index) in firstList" :key="index" @click="change($event,index,item.id)">
						{{item.zgCate}}<text class="i" v-show="isIndex == index"></text>
					</view>
				</scroll-view>
			</view>
			<view :class="isIndex == 0 ? 'superlfs superlf':'superlf'">
				<view :class="isIndex == 0 ? 'superlfs classtop':'classtop'"
					style="width:100%;position: absolute;z-index:99;background-color: #fff;">
					<view style="width: 100%;padding-left: 10rpx;">
						<u-tabs :list="secondList" lineWidth="0" lineHeight="0"
							:activeStyle="{color:'#f02834',fontWeight:'bold'}" @change="cangeIndexes"
							:current="current"></u-tabs>
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollTop"
					:style="{Height:Height1+'px',marginTop:fixTop+'px'}">
					<u-empty text="暂无品牌" textSize="30" iconSize="160" iconColor="#bcbcbc"
						v-if="isShow"></u-empty>
					<view v-else class="storeContent" v-for="(item,index) in storeList"
						:key="index"  @click="contentShop(item.storeSn,item.zg)">
						<view>
							<image :src="item.image" mode="" lazy-load></image>
						</view>
						<view class="contentRight">
							<view>
								<view>{{item.name}}</view>
								<view>{{item.flowInfo}}<text style="margin: 0 10rpx;">|</text>{{item.cateName}}</view>
							</view>
							<text v-show="item.zg">专柜到家</text>
						</view>
					</view>
					<u-loadmore v-if="moreShow" :line="true" status="nomore" nomoreText='到底了' fontSize="28rpx"></u-loadmore>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				firstList: [], //一级分类
				secondList: [], //二级分类
				storeList: [], //门店分类
				storeSn: '', //门店
				Height: 0,
				Height1: 0,
				fixTop: 0,
				isIndex: 0,
				current: 0,
				isShow: false,
				moreShow:false,
				leftscrollTop:0
			};
		},
		computed: {
			...mapState(['storeName', "bj"])
		},
		onLoad() {
			let that = this
			let top = 0
			uni.getSystemInfo({
				success: function(res) { // res - 各种参数
					let info = uni.createSelectorQuery().select(".pageheader"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						top = data.height / 2 + 5
						that.Height = getApp().globalData.equipment.windowHeight - data.height / 2 - 4;
					}).exec()
					that.$nextTick(() => {
						let infos = uni.createSelectorQuery().select(".classtop"); // 获取某个元素
						infos.boundingClientRect(function(data) { //data - 各种参数
							that.fixTop = data.height + 28
							that.Height1 = getApp().globalData.equipment.windowHeight - top -
								that.fixTop -
								5;
						}).exec()
					})
				},
			})
		},
		onShow() {
			this.storeSn = uni.getStorageSync('storeSn')
			this.floor = '' //楼层分类
			this.good = '' //商品分类
			this.isIndex = 0
			this.current = 0
			this.$request.getZgIndex({
				shopNo:this.storeSn
			}).then(res => {
				if(res.code == 200){
					this.firstList = res.data.zgCate
					this.secondList = res.data.flowInfo
					res.data.storeDetails.length==0 ?(this.storeList=[],this.moreShow=false):(this.storeList=res.data.storeDetails,this.moreShow=true,this.isShow=false)
					if (this.firstList.length != 0 && this.firstList[0].name != '全部分类') {
						this.firstList.unshift({
							zgCate: '全部分类',
							id: '',
						})
					}
					if (this.secondList.length != 0 && this.secondList[0].floorItem != '全部楼层') {
						this.secondList.unshift({
							name: '全部楼层',
							floorItem: ''
						})
					}
				}else{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.isShow = true
				}
			
			})
		},
		methods: {
			zgList(floorInfo, zgCateId) {
				this.$request.postZgList({
					shopNo:this.storeSn,
					floorInfo: floorInfo, //楼层
					zgCateId: zgCateId, //分类
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					if(res.code == 200){
						this.storeList = []
						this.isShow = false
						this.storeList = res.data
						this.moreShow=true
					}else{
						this.storeList = []
						this.isShow = true
						this.moreShow=false
					}
				})
			},
			back() {
				uni.navigateBack({
					delta:1
				})
			},
			// 搜索
			jumpsear() {
				uni.navigateTo({
					url: '/pages/pagesA/search/search',
				})
			},
			// 切换门店
			location() {
				uni.navigateTo({
					url: '/pages/pagesA/location/location?counter=1',
				});
			},
			// 一级分类
			change(e,index, id) {
				this.isIndex = index
				this.good = id //商品分类
				this.leftscrollTop = e.target.offsetTop+50 - getApp().globalData.equipment.windowHeight/ 2
				this.zgList(this.floor, this.good)
			},
			// 二级分类
			cangeIndexes(e) {
				this.current = e.index
				this.floor = e.floorItem
				this.zgList(this.floor, this.good)
			},
			// 店铺
			contentShop(e,zg) {
				uni.navigateTo({
					url:`/pages/pagesC/advertisement2/advertisement2?shopNo=${e}&zg=${zg}`
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.specialCounter {
		/deep/.u-line{
			border-color: #cccccc !important;
		}
		.superlfs {
			border-radius: 0 !important;
		}

		--size:20rpx;

		.actived {
			color: #181818 !important;
			font-weight: 600;
			background-color: #fff !important;
			border-top-left-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
		}

		.actived::before,
		.actived::after {
			content: "";
			display: block;
			height: 20rpx;
			width: 20rpx;
			position: absolute;
			bottom: 0;
			background: radial-gradient(20rpx at 20rpx 0px,
					transparent 20rpx,
					#fff 20rpx);
		}

		.actived::before {
			right: 0;
			bottom: calc(-1 * var(--size));
			transform: scale(-1);
		}

		.actived::after {
			right: 0;
			top: calc(-1 * var(--size));
			transform: scaleX(-1);
		}

		.pageheader {
			padding: 0 0 15rpx 0;
			width: 100%;

			.status_bar {
				height: var(--status-bar-height);
				width: 100%;
			}

			.store {
				font-size: 40rpx;
				color: #fff;
				font-weight: 600;
			}
		}

		.superCenter {
			display: flex;
			background-color: #f6f6f6;
			padding-top: 15rpx;
		}

		.superrt {
			width: 25%;
			height: 100%;
			overflow: hidden;

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
					background-color: #fd2333;
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
			background-color: #fff;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;

			.classtop {
				padding-top: 10rpx;
				padding-bottom: 20rpx;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
			}

			/deep/ .u-tabs__wrapper__nav__item__text {
				font-size: 30rpx;
			}

			/deep/.u-tabs__wrapper__nav__item {
				height: 0 !important;
				padding: 28rpx 20rpx;
				border-radius: 10rpx;
				// background-color: #f2f2f2;
				// margin-left: 15rpx;
				// margin-right: 10rpx;
			}

		}

		.storeContent {
			width: 95%;
			margin-left: 5%;
			display: flex;
			padding: 15rpx 0 20rpx 0;
			border-bottom: 1rpx solid #e9e9e9;

			>view:first-child {
				width: 25%;

				image {
					@include image(120rpx, 120rpx, 20rpx) background-color: #ebebeb;
				}
			}

			.contentRight {
				width: 75%;
				margin-left: 3%;

				>view:first-child {
					height: 120rpx;

					>view:first-child {
						margin: 5rpx 0 20rpx 0;
						font-size: 32rpx;
						font-weight: 600;
						@include hide(1)
					}

					>view:nth-child(2) {
						color: #9b9b9b;
						font-size: 28rpx;
					}
				}

				>text {
					color: #cf3a4e;
					background-color: #fdefef;
					border-radius: 10rpx;
					padding: 5rpx 10rpx;
					font-size: 28rpx;
				}
			}
		}

	}
</style>
