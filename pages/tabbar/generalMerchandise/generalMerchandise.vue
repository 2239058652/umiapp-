<template>
	<view class="generalMerchandise">
		<!-- 导航栏 -->
		<view class="pageHeader">
			<view>
				<!-- <view class="status_bar"></view> -->
				<view class="pageHeader">
					<page-header-clone ishide=ishide></page-header-clone>
				</view> 
				<!-- <view :style="{marginTop:distance}">
					<text style="font-size: 32rpx;">百货</text>
				</view> -->
				<!-- 搜索 -->
				<u-search  margin="12px 20rpx 0px 20rpx" height="70" searchIconSize=60 placeholder="搜索商品" v-model="keyword"
					:showAction="false" :disabled="true" @click="jump">
				</u-search>
			</view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<view :class="['u-skeleton-fillet', pm_num == 0 ? 'giftZone1' : 'giftZone']" :style="{marginTop:offsetTop}">
			<!-- 加载动画 -->
			<loading></loading>
			<!-- 轮播 -->
			<u-swiper  :list="list1" :indicator="true" indicatorMode="dot" indicatorInactiveColor="#fff" height="315.4"
				radius="7px 7px 7px 7px" interva="5000" circular="true" autoplay='true' @click="go_xq">
			</u-swiper>
			<!-- 分类 -->
			<view class="fenlei u-skeleton-fillet">
				<more-options :list="fllist"  :flag='"baihuo"'></more-options>
			<!-- 	<u-grid :border="false" col="5">
					<u-grid-item v-for="(listItem,listIndex) in fllist" :key="listIndex" @click="choosefl">
						<image :src="listItem.pic"></image>
						<text class="grid-text">{{listItem.title}}</text>
					</u-grid-item>
					<u-grid-item>
						<view class="more" @click="gofenlei">
							<text class="aj aj-fenlei2"></text>
						</view>
						<text class="grid-text">更多分类</text>
					</u-grid-item>
				</u-grid> -->
			</view>
			<!-- 店铺活动 -->
			<!-- <view class="storeActive">
				<view>王牌店铺<text>发现宝藏好店</text></view>
				<four-options :lists="fourList" :hieght="370" :title="title"></four-options>
			</view>
			<view class="storeActive">
				<view>王牌店铺<text>发现宝藏好店</text></view>
				<four-options :lists="twoList" :hieght="370" :title="title"></four-options>
			</view> -->
			<!-- 商品卡片 -->
			<slide @goodsNum="goodsNum" :image="image" v-for="(i,index) in theme" :key="index" :list="i" :judge="true"></slide>
			<!-- 悬浮购物车 -->
			<view v-if="value != 0" class="aj aj-gouwuche shop" @click="goshopcart">
				<view class="badge">{{value}}</view>
			</view>
			<!-- 返回顶部 -->
			<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	// import mixin from '@/mixins/mixin.js'
import { log } from 'util';
	export default {
		// mixins: [mixin],
		data() {
			return {
				list1: [], //轮播
				item: null, //商品
				theme: null, //主题
				value: 0, //购物车徽标
				offsetTop: 0,
				title:'title',
				fourList: [], 
				image:'',
				fllist: [],
				distance:getApp().globalData.menuButtonInfo,
				loading:true,
				shopNo: uni.getStorageSync('bh_num'),
				lists:[],
				pm_num:uni.getStorageSync('pm_num')
				// bh_list_mendian:getApp().globalData.bh_list_mendian
			};
		},
		onShareAppMessage(res) {
		  return {
		    title: `欢乐爱家`,
		    path: `pages/tabbar/generalMerchandise/generalMerchandise`
		  };
		},
		onShow() {
			this.$request.getBhHome({
				shopNo: uni.getStorageSync('bh_num'),
				// shopNo:uni.getStorageSync('storeSn')
			}).then(res=>{
				this.lists = res.cargoList
				this.loading = false
				this.list1 = res.cargoList.map(item => item.pic)  //轮播
				this.fllist = res.carGoIndex
				this.fllist.push({
					id: "",
					link: "",
					pic: "",
					remark: "",
					shopNo: "",
					shoppe: "",
					title: "展开更多"
				})
				this.theme = res.hotZgs
				if(res.cargoList&&res.cargoList.length>0){
					this.image = res.cargoList[0].pic
				}
			})
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('userInfo').mobile == undefined) {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.shopNo =uni.getStorageSync('storeSn')
			// 购物车数量
			this.$request.postCartnumber({
				mobile: this.$store.state.userInfo.mobile,
				// shopNo: this.shopNo
				shopNo: ''
			}, {
				'Content-type': 'application/x-www-form-urlencoded',
			}).then(res => {
				this.value = res
			})
		},
		onLoad() {
			let that = this
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					let info = uni.createSelectorQuery().select(".pageHeader"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.offsetTop =data.height+'px'
					}).exec()
				}
			})
			if (uni.getStorageSync('token') == '' || uni.getStorageSync('userInfo').mobile == undefined) {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.shopNo =uni.getStorageSync('storeSn')
			// 购物车数量
			// this.$request.postCartnumber({
			// 	mobile: this.$store.state.userInfo.mobile,
			// 	shopNo: this.shopNo
			// }, {
			// 	'Content-type': 'application/x-www-form-urlencoded',
			// }).then(res => {
			// 	this.value = res
			// })
			// this.$request.getBhHome({
			// 	shopNo: this.shopNo
			// }).then(res=>{
			// 	this.loading = false
			// 	this.list1 = res.cargoList.map(item => item.pic)  //轮播
			// 	this.image = res.cargoList[0].pic
			// 	this.fllist = res.carGoIndex
			// 	this.theme = res.hotZgs
			// })
		},
		methods: {
			go_xq(id){
				// console.log(id)
				let url = this.lists[id].link
				let shopNo = this.lists[id].shopNo
				if(url=='/pages/pagesC/advertisement2/advertisement2'){
					uni.navigateTo({
						url:`${url}?shopNo=${shopNo}`
					})
				}else{
					uni.navigateTo({
						url:`${url}`
					})
				}
				
				
			},
			// 更多分类
			gofenlei() {
				uni.navigateTo({
					url: '/pages/pagesB/classification/classification'
				})
			},
			// 悬浮购物车
			goshopcart() {
				uni.navigateTo({
					url: "/pages/pagesB/shopcart/shopcart"
				})
			},
			// 购物车数量
			goodsNum(e) {
				this.value += e
			},
			jump() {
				uni.navigateTo({
					url: '/pages/pagesA/search/search',
				})
			},
			choosefl(e){
				console.log('点击跳转',e);
				let shopNo1 = uni.getStorageSync('bh_num')
				if(this.fllist[e-1].title == '专柜到家'){
					uni.navigateTo({
						url:'/pages/pagesC/advertisement1/advertisement1'
					})
				}else{
					// uni.navigateTo({url:`/pages/pagesA/theme2/theme2?id=${this.fllist[e-1].id}`})
					// uni.navigateTo(
					// {url:`/pages/pagesA/theme2/theme2?shopNo1=${shopNo1}&id=${this.fllist[e-1].id}`}
					// )
					uni.navigateTo({
						url:`/pages/pagesA/theme2/theme2?id=${this.fllist[e-1].id}`
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
	.pageHeader {
		width: 100%;
		position: relative;
		top: 0;
		z-index: 9;
	}
	.generalMerchandise {
		background-color: #fff;
		overflow: hidden;
		/deep/ .u-tabbar-item__icon{
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		&>image {
			@include image (100%, 400rpx, 30rpx)
		}

		/deep/ .slider {
			margin: 20rpx 0;
		}

		.fenlei {
			padding-top: 10rpx;

			image {
				@include image(100rpx, 100rpx, 50%);
			}

			.grid-text {
				font-size: 14px;
				color: #404040;
				padding: 10rpx 0 20rpx 0rpx;
			}

			.more {
				width: 100rpx;
				height: 100rpx;
				background-color: #f7f7f7;
				border-radius: 50%;
				position: relative;

				>text {
					font-size: 57rpx;
					color: #787878;
					position: absolute;
					top: 50%;
					right: 50%;
					transform: translate(50%, -50%);
				}
			}
		}

		.storeActive {
			&>view:first-child {
				font-size: 33rpx;
				font-weight: 600;

				>text {
					font-size: 26rpx;
					color: #888686;
					font-weight: normal;
					margin-left: 20rpx;
				}
			}
		}

		.pageHeader {
			// width: 92%;
			background-color: #fff;
			// padding: 10rpx 4%;
			position: fixed;
			top:0;
			z-index: 10;
			.status_bar {
				height: var(--status-bar-height);
				width: 100%;
				
			}
		}

		.giftZone {
			
			margin-top: 230rpx !important;
			@include chamfer(25rpx)
		}
		
		.giftZone1 {
			
			margin-top: 300rpx !important;
			@include chamfer(25rpx)
		}

		.shop {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			position: fixed;
			bottom: 15%;
			right: 2%;
			z-index: 999;
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
	}
</style>
