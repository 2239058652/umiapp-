<template>
	<view class="da">
		<view class="top">
			<view>冻结/解冻时间</view>
			<view class="top2">
				<view>金额</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="gun">
			<view class="" v-if="list.length>0">
				<view class="box" v-for="(itme,index) in list" :key="index">
					<view class="left">
						<view ><text class="biaoji left1" style="color: red;margin-right: 20rpx;">冻结时间:</text>{{itme.createDate}}</view>
						<view><text class="biaoji left1" style="color: green;margin-right: 20rpx;">解冻时间:</text>{{itme.endDate}}</view>
					</view>
					<view :class="['zeng']">
					<view> {{itme.changeMoney}}</view>
					</view>
				</view>
			</view>
			<view v-else style="font-size: 40rpx;text-align:center;margin-top: 200rpx;">暂无数据</view>

		</scroll-view>
<navigation-ball></navigation-ball>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		created() {
			this.getdata()
		},
		methods: { 
			getdata(){
				this.$request.posttixian_list({
					mobile: this.$store.state.userInfo.mobile,
					jsStatus:0
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
				this.list=res.reverse()
					
				})
			}
			
			
		}
	}
</script>

<style>
	.yhk{
		color: red;
		font-size: 40rpx;
	}
	.gun {
		height: 90vh;
	}

	page {
		background-color: #ededed;
	}

	.box {
		    display: flex;
		    height: 151rpx;
		    justify-content: space-between;
		    padding: 20rpx 30rpx 20rpx 30rpx;
		    border-bottom: 1px dashed #ccc;
		    border-top: 1px dashed #ccc;
		    align-items: center;
	}


	.top {
		padding: 40rpx 30rpx 40rpx 30rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px dashed #ccc;
		font-size: 30rpx;
		font-weight: 600;
	}

	.top2 {
		width: 60rpx;
		display: flex;
		justify-content: space-around;

	}

	.da {
		width: 700rpx;
		margin: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
	.flag{
		width: 545rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}
	.left>view{
		height: 60rpx;
		line-height: 60rpx;
	}
	.biaoji{
		font-weight: 700;
		
	}
	.zeng{
		color: red;
		/* font-size: 35rpx;
		 */
		font-weight: 600;
	}
	.jian{
		color: green;
		/* font-size: 35rpx; */
	}
</style>
