<template>
	<view>
		<view class="top">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco" style="color: #fff;">推广名片</view>
			</view>
		</view>
		<view class="body">
			<view class="deng">
				分享好友
				<text class="aj deng1 aj-denglong"></text>
				<text class="aj deng2 aj-dahongdenglong"></text>
			</view>
			<view class="dody_2">
				<view class="cen">
					<view class="fang">


						<image class="" :src="iamges" mode=""></image>
						<view class="nodenglu">{{deng}}</view>
						<text class="aj zhiwen aj-saoyisao"></text>
					</view>
				</view>
			</view>
			<view class="tishi">
				<view class="ts_top">分享规则</view>
				<view class="nr">步骤1：好友打开手机微信扫一扫，扫描成功即可自动绑定</view>
				<view class="nr">步骤2：好友打开欢乐爱家小程序下单即可</view>
				<!-- 	<view class="ts_top">提醒好友领取福利</view>
				<view class="nr">福利1：可以在首页上部进行抽奖（赠送10次）</view>
				<view class="nr">福利2：可以在首页进行领取红包（每小时可领一张）</view> -->
			</view>
			<view class="footrer">
				<view>
					<text class="aj aj-huaduo hua"></text>
					<text class="aj aj-huaduo hua1"></text>
					<text class="aj aj-huaduo hua2"></text>
					<text class="aj aj-huaduo hua1_2"></text>
					<text class="aj aj-huaduo hua3"></text>
					<text class="aj aj-huaduo hua1_3"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseUrl,
		AppID,
		tenantId
	} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				iamges: "",
				moblie: uni.getStorageSync('userInfo').mobile,
				isShow: false,
				path: "pages/tabbar/index/index",
				fenxiang_moblie: '',
				isdenglu: uni.getStorageSync('token'),
				deng: ""
			}
		},
		onLoad(res) {
			// uni.showToast({
			// 	title: res.moblies,
			// 	duration: 2000
			// });
			this.fenxiang_moblie = res.mobile
			uni.setStorageSync('fenxiang_moblie', this.fenxiang_moblie)
		},
		onLaunch(res) {

		},
		onShow() {
			// this.post_partner()
			this.denglu()
			this.geterweima()
			if (uni.getStorageSync('fenxiang_moblie')) {
				this.post_partner()
			}
		},
		// 分享给朋友
		onShareAppMessage(res) {
			return {
				title: '推广名片',
				path: `pages/tabbar/index/index?moblie=${this.moblie}`
			}
		},
		// 分享到朋友圈
		// onShareTimeline() {
		// 	return {
		// 		title: '推广名片',
		// 		query: `moblie=${this.moblie}`
		// 	};
		// },
		methods: {
			go(){
				uni.navigateBack({
					delta:1
				})
			},
			// 获取二维码
			geterweima() {
				this.$request.postqrcode({
					mobile: this.moblie,
					appId: AppID,
					url: "pages/tabbar/index/index",
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}, ).then(res => {
					this.iamges = res
				})
			},
			// 判断是否登录
			denglu() {
				if (this.isdenglu == '') {
					this.deng = '您还未登录哦~'
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.nr {
		font-size: 30rpx;
		color: #fff;
		line-height: 55rpx;
		padding: 10rpx;
	}

	.tishi {
		margin-top: 20rpx;
		width: 600rpx;
		height: 20vh;
		margin: 0 auto;
		border-radius: 20rpx;
		border: 2px dashed #e89f41;

	}

	.ts_top {
		margin-top: 20rpx;
		width: 600rpx;
		text-align: center;
		font-size: 40rpx;
		color: #fff;
	}

	page {
		background-color: #f5f5f5;
	}

	.head {
		/* width: 100rpx; */
		height: 80rpx;
		background-color: #e93423;
		line-height: 80rpx;
		color: #fff;
		padding-left: 20rpx;
	}

	.top {
		// width: 750rpx;
		// height: 560rpx;
		background-color: #e93423;
	}

	.status_bar {
		// height: var(--status-bar-height);
		// height: 50rpx;
		height: 75rpx;
		width: 100%;
	}

	.toubu {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.body {
		height: 100vh;
		background-color: #e93423;
		width: 750rpx;
		overflow: hidden;

	}

	.dody_2 {
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.cen {
		width: 610rpx;
		background-color: #f79975;
		margin: 0 auto;
		height: 610rpx;
		border-radius: 50%;
		position: relative;
		border: 3px solid #fff;

		// overflow: hidden;
		margin-top: -50rpx;
		border-bottom: 1px solid transparent;
	}

	.zhiwen {
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 60rpx;
		color: #000000;

	}

	.fang {

		width: 525rpx;
		height: 601rpx;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 0 0 50% 50%;
		box-shadow: 0 0 13px #000000;
	}

	.fang image {
		position: absolute;
		top: 150rpx;
		width: 50%;
		height: 50%;
		left: 50%;
		transform: translateX(-50%);
	}

	.deng {
		height: 200rpx;
		width: 750rpx;
		background-color: #e93423;
		text-align: center;
		font-size: 45rpx;
		color: #fff;
		line-height: 200rpx;
		position: relative;

	}

	.deng1 {
		position: absolute;
		font-size: 70rpx;
		left: 30rpx;
		top: -20rpx;
	}

	.deng2 {
		position: absolute;
		font-size: 100rpx;
		right: 45rpx;
		top: 33rpx;

	}

	.hua {
		position: absolute;
		font-size: 60rpx;
		bottom: 0;
		color: #fff;
		left: 50%;
	}

	.hua1 {
		position: absolute;
		font-size: 60rpx;
		bottom: 0;
		color: #fff;
		right: 50%;
	}

	.hua2 {
		position: absolute;
		font-size: 60rpx;
		bottom: 50rpx;
		color: rgba(255, 245, 244, .5);
		right: 20%;
	}

	.hua1_2 {
		position: absolute;
		font-size: 60rpx;
		bottom: 50rpx;
		color: rgba(255, 245, 244, .5);
		left: 20%;
	}

	.hua3 {
		position: absolute;
		font-size: 60rpx;
		bottom: 90rpx;
		color: #ffe342;
		left: 5%;
	}

	.hua1_3 {
		position: absolute;
		font-size: 60rpx;
		bottom: 90rpx;
		color: #ffe342;
		right: 5%;
	}

	.daohang {
		width: 80rpx;
		height: 80rpx;
		background-color: #fff;
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
		background-color: #fff;
		border-radius: 25px;
		position: fixed;
		right: 117rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: space-around;
	}

	.kong {
		margin-top: 30rpx;
	}

	.nodenglu {
		position: absolute;
		bottom: 50%;
		left: 50%;
		transform: translateX(-50%);
		font-size: 40rpx;

	}
</style>
