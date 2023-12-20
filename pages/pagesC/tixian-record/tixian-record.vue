<template>
	<view class="da">


		<view class="top">
			<view>时间</view>
			<view class="top2">
				<view>金额</view>
				<view>状态</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="gun">
			<view class="" v-if="list.length>0">
				<view class="box" v-for="(itme,index) in list" :key="index">
					<view class="aj aj-yinhangka yhk" v-if='itme.payType==1'></view>
					<view class="aj aj-yuebao yhk" v-else></view>
					<view>{{itme.createDate}}</view>
					<view class="box2">
						<view class="" style="color: red; ">
							￥{{itme.changeMoney}}
						</view>
						<view class="">
							<changan-coloe :title='itme.flag' @longtouch="longtouch()" @clickTap="">
								<view class=" text-content ">{{itme.message}}</view>
							</changan-coloe>
						</view>
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
				list: []
			}
		},
		created() {
			this.getdata()
		},
		methods: {
			getdata() {
				this.$request.posttixian_list({
					mobile: this.$store.state.userInfo.mobile,
					jsStatus: '2'
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					// createDate  时间  changeMoney 金额   status 状态
					// let f = res.records.reverse()
					this.list = res.reverse()
				})
			}

		}
	}
</script>

<style>
	.yhk {
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
		height: 72rpx;
		justify-content: space-between;
		padding: 20rpx 30rpx 20rpx 30rpx;
		border-bottom: 1px dashed #ccc;
		border-top: 1px dashed #ccc;
		align-items: center;
	}

	.box2 {
		width: 300rpx;
		display: flex;
		justify-content: space-around;

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
		width: 300rpx;
		display: flex;
		justify-content: space-around;

	}

	.da {
		width: 700rpx;
		margin: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}
</style>
