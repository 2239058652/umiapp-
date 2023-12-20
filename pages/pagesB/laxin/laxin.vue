<template>
	<view>
		<view class="header">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco">我的推广</view>
			</view>
			<view class="head_body">
				<view class="yong">有效订单</view>
			</view>
			<view class="jin">{{dangqian}}</view>
			<view class="shouyi">
				<view>
					<view>目标订单</view>
					<view>{{mubiao}}</view>
				</view>
				<view @click="shouyi_list()">
					<view style="display: flex;align-items: center;">当前排名
					</view>
					<view>{{mubiao-dangqian}}</view>
				</view>
			</view>
		</view>
		<view class="body">

			<view class="box" @click="go('/pages/pagesB/xinRen-EWM/xinRen-EWM')">
				<u-icon name="scan" color="#f44938" size="100"></u-icon>
				<view>个人名片</view>
			</view>
			<view <view class="box" @click="go('/pages/pagesB/xinren-geren/xinren-geren')">
				<u-icon name="plus-people-fill" color="#f44938" size="100"></u-icon>
				<view>邀请单量统计</view>
			</view>
			<view class="box" @click="go('/pages/pagesB/xinren-paihang/xinren-paihang')">
				<u-icon name="rmb-circle" color="#f44938" size="100"></u-icon>
				<view>邀请单量排行</view>
			</view>
			<view class="box" style="background-color: #f5f5f5;">
		<!-- 		<u-icon name="coupon" color="#f44938" size="100"></u-icon>
				<view>红包明细</view> -->
			</view>

			
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				dangqian: 90,
				mubiao: 200,
				lei: 0,
				dongjie: 0
			}
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.getdata()
		},
		methods: {
			go(link) {
				console.log('我是link',link);
				uni.navigateTo({
					// url: '../tuiguanglist/tuiguanglist'
					url: link
				})
			},
			
			getdata() {
				this.$request.getHHRshouyi({
					mobile: this.$store.state.userInfo.mobile,
				}).then(res => {
					// if(res.records&&res.records.length>0){
					// this.yu=res.records[0].ye
					this.yu = res.available.toFixed(2) //当前佣金
					this.lei = res.accumulatedIncome.toFixed(2) //累计收益
					this.zuo = res.yesterdayMoney.toFixed(2) // 昨日收益
					this.dongjie = res.unavailable.toFixed(2) //冻结金额
					// }
				})
			},
			dongjie1() {
				uni.navigateTo({
					url: "/pages/pagesC/dongjie/dongjie"
				})
			},
		}

	}
</script>

<style lang="scss">
	.head_left {
		margin-left: 20rpx;
		color: #fff;
	}

	.header {
		height: 35vh;
		width: 750rpx;
		background-color: #e93423;
		color: #fff;
	}

	.head_body {
		margin-top: 20rpx;
		text-align: center;
		position: relative;

	}

	.ti {
		display: flex;
	}

	.ti {
		float: right;
		position: absolute;
		top: 70rpx;
		right: 0;
	}

	.jin {
		font-size: 60rpx;
		text-align: center;
	}

	.shouyi {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
	}

	.shouyi view {
		text-align: center;
	}

	.tixian {

		margin-bottom: -200rpx;

	}

	.tixian view {
		margin: 0 auto;
		width: 200rpx;
		background-color: #e93423;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 25px;
		text-align: center;
		margin-top: 60rpx;
		border: 10px solid #fff;
		border-bottom: 10px solid #f5f5f5;
	}

	.body {
		margin-top: 60rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;

	}

	.box {
		width: 300rpx;
		height: 250rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		justify-content: center;
	}

	page {
		background-color: #f5f5f5;
	}

	.daohang {
		width: 80rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 50%;
		position: fixed;
		right: 20rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hutuis {
		width: 242rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 25px;
		position: fixed;
		right: 117rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: space-around;
	}

	.status_bar {
		// height: var(--status-bar-height);
		height: 75rpx;
		width: 100%;
	}

	.toubu {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.inco {
		margin: 0 20rpx 0 20rpx;
	}
</style>
