<template>
	<view>
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="领券" @clickLeft="back"></uni-nav-bar>
		<view class="content">
			<view class="circle">
				<text>券</text>
			</view>
			<view class="xq">
				<text>{{elecList.title}}</text><br />
				<text>订单满{{elecList.consume}}元使用(不含邮费)</text>
			</view>
			<view class="dote"></view>
		</view>
		<view class="lq" @click="btn">
			点击领取
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				elecList: null,
			}
		},
		onLoad(option) {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.elecList = JSON.parse(option.elecList)
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				})
			},
			btn() {
				// 领取
				this.$request.getReceiveEle({
					eleId: this.elecList.no,
					phone: uni.getStorageSync('userInfo').mobile,
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res.msg
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/pagesB/mycoupon/mycoupon'
							})
						}, 1500);
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.lq {
		width: 90%;
		margin: 0 auto;
		color: #fff;
		border-radius: 10rpx;
		padding: 15rpx 0;
		text-align: center;
		background-color: #0176c3;
		margin-top: 50rpx;
	}

	.content {
		padding: 80rpx 0 120rpx 0;
		background-color: #0176c3;
		position: relative;
		.xq{
			text-align: center;
			color:#fff;
			margin-top: 30rpx;
		}
		.dote{
			border-top: 7px dotted #f6f6f6;
		    position: absolute;
		    bottom: -3px;
		    width: 100%;	
		}
		.circle {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			background-color: #fff;
			margin: 0 auto;
			color: red;
			position: relative;
			text {
				font-size: 60rpx;
				font-family: "Lucida Calligraphy", cursive, serif, sans-serif;
			    position: absolute;
			    top: 50%;
			    right: 50%;
			    transform: translate(50%, -50%);
			}
			
		}
	}
</style>
