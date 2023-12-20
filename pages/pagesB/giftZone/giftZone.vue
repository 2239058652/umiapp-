<template>
	<view>
		<!-- 导航栏 -->
		<uni-nav-bar @clickLeft="back"  fixed="false" statusBar="false" title="送礼专区" left-icon="back"></uni-nav-bar>
		<view class="giftZone" v-show="isshow">
			<!-- 加载动画 -->
			<loading></loading>
			<image :src="list1[0].pic" mode="" @click="goPath(list1[0].id)"></image>
			<!-- 轮播 -->
			<rotation v-if="list1.length!=0" :list1="list1" :rightAdvert="rightAdvert"></rotation>
			<!-- 商品卡片 -->
			<commodityCard title="本期必买榜" :item="item"></commodityCard>
			<slide @goodsNum="goodsNum" v-for="(i,index) in theme" :key="index" :list="i"></slide>
			<!-- 分类  商品列表 -->
			<commodity ref="commodity" :classification="classification" isshow="true"></commodity>
			<!-- 悬浮购物车 -->
			<view class="aj aj-gouwuche shop" @click="goshopcart"><view class="badge" v-if="value != 0">{{value}}</view></view>
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
				list1:[],//轮播
				rightAdvert:[], //右边
				item:null ,//商品
				theme:null, //主题
				classification:getApp().globalData.classification,//商品分类
				isshow:false ,//控制是否显示页面内容 
				value:0,//购物车徽标
			};
		},
		created() {
			this.page = 1, //页码
			this.shopNo = getApp().globalData.shopNo
		},
		onReachBottom(){
			this.page+=1
			this.$refs.commodity.getHotGoods({
				cate:this.$refs.commodity.$refs.roll.cate,
				page:this.page,
				shopNo:this.shopNo
			},"more")
		},
		onLoad() {
			this.$request.postQueryGiveGift({shopNo:this.shopNo}).then((res)=>{
				this.list1 = res.advertList
				this.item = res.listGoods
				this.theme = res.giftList
				this.isshow=true
			})
			this.$refs.commodity.getHotGoods({
			  cate:this.classification[0].id,
			  page:1,
			  shopNo:this.shopNo
			})
			this.$refs.commodity.$refs.roll.cate = this.classification[0].id
			// 购物车数量
			this.$request.postCartnumber({
				mobile:this.$store.state.userInfo.mobile,
				shopNo:getApp().globalData.shopNo
			},{
				'Content-type': 'application/x-www-form-urlencoded',
			}).then(res=>{
				this.value = res
			})
		},
		methods:{
			goPath(id) {
				uni.navigateTo({url:`/pages/pagesA/theme/theme?id=${id}`})
			},
			// 购物车
			goshopcart(){
				uni.navigateTo({
					url:"/pages/pagesB/shopcart/shopcart"
				})
			},
			goodsNum(e){
				console.log(e,'---')
				this.value +=e
			}
		},
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
 .giftZone{
	 @include chamfer(25rpx)
   &>image{
    @include image (100%,400rpx,30rpx)
   }
   .shop{
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		position: fixed;
		bottom: 15%;
		right: 2%;
		z-index: 999;
		background-image: linear-gradient(to right, #f18c27, #f13527);
   	.badge{
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
   		right:-10rpx
   	}
   }
 }
</style>
