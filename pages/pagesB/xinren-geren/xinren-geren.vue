<template>
	<view>
		<view class="head">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco" style="color: #fff;">推广单数列表</view>
			</view>
			<view class="tui">
				<view class="shu">
					<view>推广单数</view>
					<view>{{ userList.length > 0 ? userList.length : 0 }}人</view>
				</view>
				<view><text class="aj aj-navicon-rqfz rens"></text></view>
			</view>
		</view>
		<view></view>
		<scroll-view scroll-y="true" class="scroll">
			<view class="shen" v-if="userList.length > 0">
				<view class="dans" v-for="(item, index) in userList" :key="index">
					<view class="dan">
						<view class="dan-left">
							<view>
								<image class="tou" :src="item.weixinHeadImgurl"></image>
							</view>
							<view class="hao">
								<view>手机号码:{{item.dtel.substr(0,3)+'****'+item.dtel.substr(7)}}</view>
								<view>加入时间:{{ item.regdate }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="wu" v-else>您还没到邀请好友下单哦~</view>
		</scroll-view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userList: []
			};
		},
		onShow() {
			this.getuserList();
		},
		methods: {
			go() {
				uni.navigateBack({
					delta: 1
				});
				
			},
			getuserList() {
				this.$request
					.postUserList({
						mobile: uni.getStorageSync('userInfo').mobile
					}, {
						'Content-type': 'application/x-www-form-urlencoded'
					})
					.then(res => {
						this.userList = res;
					});
			}
		}
	};
</script>
<style scoped>
	.scroll {
		height: 70vh;
		margin-top: -30rpx;
		border-radius: 20rpx;
	}

	.head {
		height: 30vh;
		width: 750rpx;
		background-color: #e93423;
	}

	.tu {
		height: 200rpx;
		width: 200rpx;
	}

	.tui {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
	}

	.shu view:nth-child(1) {
		color: #fff;
		font-size: 50rpx;
	}

	.shu view:nth-child(2) {
		color: #fff;
		font-size: 50rpx;
	}

	page {
		background: #ccc;
	}

	.tou {
		height: 80rpx;
		width: 80rpx;
		border-radius: 50%;
	}

	.shen {
		padding: 20rpx;
		padding-bottom: 0;
		box-sizing: border-box;
		width: 700rpx;
		background-color: #fff;
		margin: 0 auto;
		/* margin-top: -30rpx; */
		border-radius: 20rpx;
	}

	.dan {
		border-radius: 20rpx;
		height: 100rpx;
		border-bottom: 1px solid #ccc;
	}

	.dans {
		border-radius: 20rpx;
	}

	.dans:last-child .dan {
		border-bottom: none;
	}

	/* {
	border-bottom: none;
} */
	.dan-left {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.hao {
		margin-left: 20rpx;
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
		height: var(--status-bar-height);
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

	.wu {
		text-align: center;
		line-height: 30rpx;
		font-size: 40rpx;
		margin-top: 40rpx;
		width: 700rpx;
		background-color: #fff;
		height: 100rpx;
		margin: 0 auto;
		line-height: 100rpx;
		border-radius: 20rpx;
	}

	/* 最上边的三个人icon */
	.rens {
		font-size: 150rpx;
		color: #fff;
	}
</style>
