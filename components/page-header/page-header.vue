<template>
	<view class="pageheader" :style="bj">
		<view v-if="ishide">
			<view class="status_bar"></view>
			<view :style="{marginTop:distance}">
				<text class="store" @click="location">{{storeName}}</text>
				<text  @click="location" class="aj aj-daosanjiao" style="font-size: 40rpx;" v-if="storeName!=''"></text>
				<text class="text" v-show="isShow" @click="change">{{isText ?'编辑':'完成'}}</text>
			</view>
			<!-- 搜索 -->
			<u-search  margin="12px 20rpx 0px 20rpx" height="70" searchIconSize=60 placeholder="搜索商品" v-model="keyword"
				:showAction="false" :disabled="true" @click="jump">
			</u-search>
		</view>
		<!-- 自定义导航栏 -->
		<!-- <u-navbar v-else  fixed="false" bgColor="background:linear-gradient(180deg, #2797ff 70%, #b1f6ca 90%)">
		</u-navbar> -->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		name:"pageHeader",
		computed: {
			...mapState(['storeName',"bj"])
		},
		props:{
			ishide:{
				type:Boolean,
				default(){
					return true
				}
			},
			isShow:{
				type:Boolean,
				default: false
			},
			isText:{
				type:Boolean
			}
		},
		created() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route // 获
			// console.log('当前页面路由信息',curRoute)''
		},
		data() {
			return {
				distance:getApp().globalData.menuButtonInfo,
			};
		},
		
		methods:{
			location(){
				uni.navigateTo({
					url: '/pages/pagesA/location/location',
				});
			},
			change(){
				this.$emit("header")
			},
			jump(){
				uni.navigateTo({
					url: '/pages/pagesA/search/search',
				})
			}
		}
	}
</script>

<style lang="scss">
	.pageheader {
			padding:0 0 15rpx 0;
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}
		
	 .aj-daosanjiao {
	 	color: #e1eae9;
	 }
	 .store {
		 display: inline-block;
		margin-left: 4%;
		font-size: 38rpx;
	 	font: normal 900 38rpx "微软雅黑";
	 	color: #e1eae9;
		// width: 380rpx !important;
		max-width: 380rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		
	 }
	 view{
		&>view:nth-child(2){
			position: relative;
		}
	 }
	 .text{
		 position: absolute;
		 right:32%;
		 top:50%;
		 transform: translateY(-50%);
		 color: #fff;
	 }
	}
</style>