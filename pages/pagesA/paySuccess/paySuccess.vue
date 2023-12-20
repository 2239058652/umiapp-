<template>
	<view class="paySuccess">
		<uni-nav-bar fixed="false" statusBar="false"  @clickLeft="jump('/pages/tabbar/index/index')" ></uni-nav-bar>
		<view class="heady">
			<view class="aj aj-chenggong1">支付成功</view>
			<view>订单支付成功，看看其它的吧！</view>
			<text size="mini" :plain="true" @click="jump('/pages/tabbar/index/index')">返回首页</text>
			<text size="mini" :plain="true" @click="jump('/pages/pagesA/myOrder/myOrder?e=0')">查看订单</text>
		</view>
		<view class="aj aj-xingxing">
			同类热销商品推荐
		</view>
		<!-- 分类  商品列表 -->
		<commodity ref="commodity"></commodity>
	</view>
</template>

<script>
	let shopNo=getApp().globalData.shopNo
	import WebSocket  from '@/mixins/WebSocket.js'
	export default {
		mixins:[WebSocket],
		data() {
			return {
				item:null
			}
		},
		onReachBottom(){
			this.page+=1
			this.$refs.commodity.getHotGoods({
				cate:getApp().globalData.classification[0].id,
				page:this.page,
				shopNo
			},"more")
		},
		onLoad(e) {
			console.log('支付ok',e);
			if(e.order){
				console.log('发送了');
			this.getWEBdata(e.order)
			}else{
				console.log('不发送');
			}
			this.page=1
			this.$refs.commodity.getHotGoods({
			  cate:getApp().globalData.classification[0].id,
			  page:this.page,
			  shopNo
			})
		},
		methods: {
			jump(url){
				/tabbar/.test(url) ? uni.switchTab({url}) : uni.navigateTo({url})
			}
		},
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
 .paySuccess{
	 margin: 0 auto;
	 .heady{
		 padding: 0 15rpx;
		 @include flex(row wrap,space-evenly)
		 @mixin font ($size:50rpx){
			 font-size: $size;
			 font-weight: 900;
		 }
		 >view:first-child{
		 	 @include font
		 }
		 >view:nth-child(2){
	     @include font(26rpx);
			 width: 100%;
			 text-align: center;
			 margin: 15rpx 0 40rpx 0;
		 }
		 text{
			 --height:55rpx;
		 	 display: inline-block;
		 	 width: 25%;
			 border-radius: 30rpx;
			 border: 2rpx black solid;
			 text-align: center;
			 height: var(--height);
			 line-height: var(--height);
		 }
	 }
	 .heady+view{
		 margin:40rpx 0 15rpx 0;
	 }
 }
</style>
