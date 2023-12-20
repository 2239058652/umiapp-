<template>
	<view>
    <uni-nav-bar @clickLeft="back" :title="LeftText"  fixed="false" statusBar="false"  left-icon="back"></uni-nav-bar>
	  <view class="title2">
	  	<u-swiper :list="adslides" indicator="true" indicatorMode="dot" indicatorActiveColor="#ffffff"
	  		indicatorInactiveColor="#fae9eb" height="400" width="100%" radius="7px" interva="5000" circular="true"
	  		 @click="jump('#')">
	  	</u-swiper>
			
			<view class="title">秒杀单品</view>
			<commodityCard  :item="hotGoods"></commodityCard>
			<view class="title">数码电器小类TOP榜</view>
			<commodityCard  :item="hotGoods1"></commodityCard>
			
			<view class="title">年中数码电器</view>
			<slide :list="hotGoods" :judge="false"></slide>
			<slide :list="hotGoods" :judge="false"></slide>
			<slide :list="hotGoods" :judge="false"></slide>
			<slide :list="hotGoods" :judge="false"></slide>
			<!-- 分类  商品列表 -->
			<commodity ref="commodity" :classification="classification"></commodity>
	  	<!-- 返回顶部 -->
	  	<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
	  </view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins:[mixin],
		data() {
			return {
				LeftText:"数码电器年中狂欢购", //导航栏标题
				adslides:[], //轮播
				classification:[], //分类
				hotGoods:[],//商品
				hotGoods1:[],//商品
				rightAdvert:null,//轮播右侧数据
			};
		},
		onLoad() {
			uni.$u.http.get(this.$request.getIndex, {params:{
					shopNo: getApp().globalData.shopNo,
					mobile: this.$store.state.userInfo.mobile,
					page: 1
				}}).then(res => {
					this.adslides=res.adslides.map(item => {
						return item.pic
					})
					this.classification=res.hotCate
					this.hotGoods=res.hotGoods.slice(0,6)
					this.hotGoods1=res.hotGoods.slice(0,9)
					this.rightAdvert=res.rightAdvert
				})
		},
		mounted() {
			this.page=0 //上拉加载页码
		},
		onReachBottom(){
			this.page+=1
			this.$refs.commodity.getHotGoods({
				cate:this.$refs.commodity.cate || this.classification[0].id,
				page:this.page,
				shopNo:getApp().globalData.shopNo
			},"more")
		},
	}
</script>
K
<style lang="scss">
@import "@/static/style/uni.scss";
.title2{
	@include chamfer;
	.title{
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-weight: 900;
	}
}
</style>
