<template>
		<view class="four" style="$u.addStyle(style, 'object')">
			<view class="fourzi" v-for="(item,index) of lists" :key="index" 
			  @click="gopath(index)" :style="{backgroundImage:`url(${item.pic})`}">
				<view v-show="item.title != ''">
          {{item.title}}
					<view>{{item.remark}}</view>
				</view>
				<view v-show="item.title != ''" class="aj aj-jinrujiantou">GO</view>
			</view>
		</view>
</template>

<script>
	export default {
		props:{
		  lists:{
		      type:Array
		  },
			height:{
			    type: Number
			}
		},
		created() {
		},
		data() {
			return {
			}
		},
		methods: {
			gopath(id) {
				uni.navigateTo({url:`/pages/pagesA/theme/theme?id=${this.lists[id].id}`})
			},
		}
	}
</script>

<style lang="scss">
	.four {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		margin: 20rpx auto;
		.fourzi {
			 width: 49%;
			 height: 160rpx;
			 margin-bottom: 15rpx;
			 border-radius: 15rpx;
			 background:{
			 	repeat:no-repeat;
			 	size: 100%;
			 	attachment: scroll;
			 }
			 &>view:nth-child(1) {
			 	margin: 6% 0 0 10rpx;
			 	font-size: 33rpx;
				view {
					font-size: 20rpx;
				}
			 }
			 &>view:nth-child(2) {
			 	background-color: #313332;
			 	border-radius: 50rpx;
			 	width: 75rpx;
			 	color: #FFFFFF;
			 	font-size: 24rpx;
			 	text-align: center;
			 	margin: 20rpx 0 0 10rpx;
			 }
		}
	}
</style>
