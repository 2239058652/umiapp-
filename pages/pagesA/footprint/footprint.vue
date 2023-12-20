<template>
	<view class="footprint">
		<!-- 导航栏 -->
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" :title="title" left-icon="back"></uni-nav-bar>
		<view class="foot">
			<view class="goods" v-for="(item,index) in footprint" :key="index" @click="jump(item.id)">
				<lazy-load :image="item.image" layoutType="pointLayout1"></lazy-load>
				<view>
					<view>{{item.name}}</view>
					<view>价格：<text>￥{{item.price}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				footprint:[],
				title:'',
				isWeipuShop:uni.getStorageSync('isWeipuShop')
			}
		},
		onLoad() {
			this.footprint = [];
			this.$request.postHistoryList({
				mobile:uni.getStorageSync('userInfo').mobile,
				shopNo:getApp().globalData.shopNo,
			}).then(res=>{
				let list = res
				this.footprint = list.reverse()
				this.title = `我的足迹(${this.footprint.length})`
			})
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			jump(id){
				if(this.isWeipuShop==1){
					uni.navigateTo({
						url:`/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${id}_${getApp().globalData.shopNo}`
					})
				}else{
				uni.navigateTo({
					url:`/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${getApp().globalData.shopNo}`
				})	
				}
				
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
	.footprint{
		.foot{
			margin-top: 10rpx;
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		.goods:nth-child(2n){
			margin-right: 3%;
		}
		.goods:nth-child(2n+1){
			margin-left: 3%;
		}
		.goods{
			width: 45%;
			background-color: #fff;
			border-radius:10%;
			padding-bottom: 10rpx;
			margin-bottom: 20rpx;
			view{
				&>view:first-child{
					margin: 5rpx 0;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				&>view:nth-child(2){
					text{
						color: #e60f00;
					}
				}
			}
		}
	}
</style>
