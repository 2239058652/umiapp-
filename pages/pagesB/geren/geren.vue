<template>
	<view class="box">
		<view class="list1" @click="geren">
			<view>修改个人信息</view>
			<view class="aj aj-jinrujiantou"></view>
		</view>
		<view class="box" @click="tuichu()">
			<view class="list1">
				<view>退出登录</view>
				<view class="aj aj-jinrujiantou"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			geren() {
				uni.navigateTo({
					url: '/pages/pagesC/wxshuru/wxshuru'
				});
			},
			tuichu() {


				// uni.clearStorage();
				// uni.showToast({
				// 	title: '退出登录成功',
				// 	duration: 2000
				// });

				// setTimeout(()=>{
				// 	getApp().globalData.tabIndex= 0
				// 	uni.switchTab({
				// 		url: '/pages/tabbar/index/index'
				// 	});
				// },1000)


				uni.showModal({
					content: "确认退出吗",
					success: function(res) {
						console.log('你好', res)
						if (res.confirm) {

							uni.clearStorage();
							uni.showToast({
								title: '退出登录成功',
								duration: 2000
							});
							setTimeout(() => {
								getApp().globalData.tabIndex = 0
								uni.switchTab({
									url: '/pages/tabbar/index/index'
								});
							}, 1000)

							// that.$request.postUnbindcard({
							// 	cardNo: that.data.cardNo,
							// }).then(res => {
							// 	if (res.code == 200) {
							// 		that.isShowToast(res.msg)
							// 		that.isBind = 0
							// 		that.type = "success"
							// 		that.button = "确认绑卡"
							// 	} else {
							// 		uni.showToast({
							// 			title: res.msg,
							// 			icon: 'none'
							// 		})
							// 	}
							// })
						}
					}
				})
			}
		}
	}
</script>

<style>
	.box {
		height: 60rpx;

	}

	.list1 {
		display: flex;
		justify-content: space-between;
		padding: 0 30rpx 0 30rpx;
		margin: 20rpx;
		/* background-color: #e4e5ec; */
		border: 1px solid #e4e5ec;
		line-height: 90rpx;
		border-radius: 7px;
		border-radius: 7px;
	}
</style>
