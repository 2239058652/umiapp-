<template>
	<view class="container">
		<uni-nav-bar title="个人信息" statusBar fixed leftIcon="arrowleft" @clickLeft="clickBack"></uni-nav-bar>
		<view class="content_view">
			<!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"> -->
			<button class="avatar-wrapper" @click="onChooseAvatar">
				<image class="avatar" :src="avatarUrl"></image>
			</button>
			<input type="nickname" class="weui-input" placeholder="请输入昵称" maxlength="6" :value="nickName"
				@change="getNickname" />
		</view>
		<view class="bottom_view">
			<view class="report_view" @click="submit">
				<text class="report_text">确认修改</text>
			</view>
		</view>
		<image src="http://tmp/FS6NSpOY9D7Yb1d90f2bb6053e4f3e300d791272676f.jpeg"></image>
	</view>
</template>
<script>
	import {
		baseUrl,
		AppID
	} from '@/config/baseUrl.js'
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				avatarUrl: '',
				nickName: "",
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.nickName = this.userInfo.nickName
			this.avatarUrl = this.userInfo.avatarUrl
		},
		mounted() {

		},
		methods: {
			clickBack() {
				uni.switchTab({
					url: '/pages/tabbar/my/my'
				});
			},
			getNickname(e) {
				this.nickName = e.detail.value
				this.checkNickName()
			},
			checkNickName() {
				if (!this.nickName) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					})
					return false
				}
				let str = this.nickName.trim();
				if (str.length == 0) {
					uni.showToast({
						title: '请输入正确的昵称',
						icon: 'none'
					})
					return false
				}
				this.nickName = str

				// 名字正则判断
				if ((/[^/a-zA-Z0-9\u4E00-\u9FA5]/g).test(str)) {
					uni.showToast({
						title: '请输入中英文和数字',
						icon: 'none'
					})
					return false
				}
				return true
			},
			onChooseAvatar(e) {
				uni.showLoading({
					title: '加载中'
				});
				uni.chooseImage({

					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: baseUrl + '/card-littlemall/wxWeixinMembers/uploadOssFile',
							// url: 'http://192.168.1.106:8107/card-littlemall/wxWeixinMembers/uploadOssFile',
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'Accept-Encoding': '*/*',
								'Content-type': 'multipart/form-data',
								'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
								'Card-Auth': uni.getStorageSync('token')
							},
							formData: {
								// 'user': 'test'、

							},
							success: (uploadFileRes) => {
								uni.hideLoading();
								let a = uploadFileRes.data
								this.avatarUrl = JSON.parse(a).data

							}
						});
					}
				});
				// // console.log("onChooseAvatar===", e)
				// // this.avatarUrl = e.detail.avatarUrl
				// // //   bindchooseavatar(e) {
				// //     const avatarUrl = e.detail.avatarUrl
				// //     console.log("avatarUrl", avatarUrl)
				// //     wx.uploadFile({
				// //       url: 'https://www.hlxuan.top/upload', // 仅为示例，非真实的接口地址
				// //       filePath: avatarUrl,
				// //       name: 'file', // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
				// //       formData: {
				// //         'user': 'test'
				// //       }, // HTTP 请求中其他额外的 form data
				// //       success (res){
				// //         const data = JSON.parse(res.data)
				// //         // do something
				// //       }
				// //     })
				//   // }



			},
			// 点击保存修改个人数据 
			submit() {
				// console.log('有无',this.nickName,this.avatarUrl);
				// let data = uni.getStorageSync('userInfo')
				// data.nickName = this.nickName
				// data.avatarUrl = this.avatarUrl
				// uni.setStorageSync('userInfo', data)
				// console.log(data)
				// this.$store.state.userInfo = data


				this.$request.postxinxi({
					weixinNickName: this.nickName,
					weixinHeadImgurl: this.avatarUrl,
					mobile: uni.getStorageSync('userInfo').mobile,
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					uni.showToast({
						title: '修改成功',
						duration: 2000
					});
					this.getuser()
					setTimeout(() => {
						getApp().globalData.tabIndex = 0
						this.clickBack()
					}, 1000)
				})
			},
			// 获取个人信息
			getuser() {
				this.$request.getMember({
					mobile: uni.getStorageSync('userInfo').mobile
				}).then(res => {
					let user = uni.getStorageSync('userInfo')
					user.avatarUrl = res.weixinHeadImgurl
					user.nickName = res.weixinNickName

					uni.setStorageSync('userInfo', user)

				})
			}
		}
	}
</script>
<style lang='scss'>
	.container {
		display: flex;
		flex-direction: column;
	}

	/* 边框样式 */
	button::after {
		border: 0;
	}

	.content_view {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top: 68px;
		position: relative;
		/* background-color: #F6F6FC; */
	}

	.avatar-wrapper {
		width: 100px;
		height: 100px;
		padding: 0 !important;
		margin: 0 !important;
		border-radius: 100px;
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 100px;
		border-style: solid;
		border-width: 1px;
		border-color: #d6d6d5;
	}

	.weui-input {
		margin-top: 40px;
		width: 300px;
		height: 40px;
		background: #e4e4e4;
		line-height: 40px;
		text-align: center;
		border-radius: 25px;
	}

	.bottom_view {
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		background-color: white;
		z-index: 20;
		padding-top: 10px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.report_view {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 706rpx;
		height: 76rpx;
		background-color: #e60012;
		border-radius: 19px;
		margin-bottom: 10px;
	}

	.report_text {
		color: #fff;
		font-size: 15px;
	}
</style>
