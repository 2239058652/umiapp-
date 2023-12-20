<template>
	<view class="pageheader" :style="bj">
		<view v-if="ishide">
			<view class="status_bar"></view>
			<view :style="{marginTop:distance}">
				<text class="store" @click="location">{{cs_name}}</text>
				<text class="aj aj-daosanjiao" style="font-size: 40rpx;" v-if="storeName!=''"></text>
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
			...mapState(['cs_name',"bj"]),
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
			// console.log('我进入了2')
			// 如果没有在百货页面选择门店的话 默认暂时距离最近的(第一个)bh
			if(!uni.getStorageSync('cs_name')&&!uni.getStorageSync('cs_num')){
			uni.setStorageSync('cs_name',this.cs_list_mendian[0].name)
			uni.setStorageSync('cs_num',this.cs_list_mendian[0].storeSn)
			this.$store.commit("setStorecs_name", this.cs_list_mendian[0].name)
			}else{	
				// console.log('超市页面已经选择了')
			}
		},
		data() {
			return {
				distance:getApp().globalData.menuButtonInfo,
				// 所有的门店列表
				cs_list_mendian:getApp().globalData.cs_list_mendian,
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
		margin-left: 4%;
	 	font: normal 900 38rpx "微软雅黑";
	 	color: #e1eae9;
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
	 }
	}
</style>