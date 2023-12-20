<template>
	<view class="denglu">
		<u-avatar size="120" shape="circle" :src="avatarUrl"></u-avatar>
		<view v-if="isShow" class="true">
			<view class="title">该小程序将获取以下授权：</view>
			<view class="text">获取您的公开信息（昵称，头像等）</view>
			<view class="true-but">
				<button class="err" :plain="true" type="default" @click="gomy">拒绝</button>
				<button class="res" type="primary" @click="getUserInfo">允许</button>
			</view>
		</view>
		<view v-else class="false">
			<view class="title">我们将申请使用：</view>
			<view class="text">您的微信绑定手机号注册登录该小程序</view>
			<view class="false-but">
				<button class="res" type="primary" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">立即登录</button>
				<button class="err" :plain="true" type="default" @click="gomy">暂不登录</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		AppID
	} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				isShow: true, //true为获取信息，false为获取手机号
				avatarUrl: "", // 头像
			}
		},
		created() {
			this.openid = null
		},
		onLoad(options) {
			//解码 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			// this.scene = decodeURIComponent(options.scene)
			// console.log(this.scene);
		},
		onShow() {
			let userInfo = this.$store.state.userInfo
			userInfo == '' ? this.isShow = true : this.isShow = true
		},
		methods: {
			// #ifndef H5
			async getUserInfo() {
				/* 获取用户信息 */
				let provider, userInfo = {},
					islogin = false,
					code, _this
				uni.getProvider({ // 获取服务供应商
					service: "oauth", // 服务类型：授权登录
					success: (res) => {
						provider = res.provider[0] // 服务供应商
					}
				})
				uni.login({
					provider, // 登录服务提供商
					success: (res) => {
						code = res.code //用户登录凭证
					}
				})
				uni.getUserProfile({ // 获取用户信息
					desc: "用于完善用户信息",
					success: res => {
						uni.showLoading({
							title: '申请中...'
						});
						islogin = true
						userInfo = res.userInfo // 用户信息对象 
						this.$request.getLogin({
							code,
							appId: AppID
						}).then((resd) => {
							uni.setStorageSync('openid', resd.openid)
							this.$store.commit("setUserInfo", userInfo)
							this.avatarUrl = userInfo.avatarUrl
							uni.hideLoading()
							_this = this
							uni.showToast({
								title: "申请成功",
								icon: "success",
								duration: 1000,
								success() {
									uni.$u.sleep(1000).then(() => {
										_this.isShow = false
									})
								}
							})
						})
					},
					fail(err) {
						console.debug("获取信息失败"+ JSON.stringify(err))
						uni.hideLoading()
						uni.showToast({
							title: "获取信息失败",
							icon: "error"
						})
					}
				})
			},
			// #endif
			/* 获取手机号 */
			getPhoneNumber(e) {
				uni.showLoading({
					title: '加载中...'
				});
				let mobile, param, _this
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					param = {
						appId: AppID,
						code: e.detail.code
					}
					this.$request.getNewPhone(param).then(res => {
						mobile = res.phoneNumber;
						uni.hideLoading()
						this.$store.commit("setMobile", {
							mobile
						})
						if (mobile == undefined || mobile == '') {
							uni.showToast({
								title: res.errmsg,
								icon: "error"
							})
							return
						}
						this.$request.postLogin({
							mobile,
							imgUrl: this.avatarUrl,
							openId: uni.getStorageSync('openid'),
							unionId: null, // null  这个参数是什么
							scene: null, // undefined
						}, {
							'Content-type': 'application/x-www-form-urlencoded',
							"Authorization": "Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==",
							'User-Type': 'app'
						}).then(res => {
							uni.hideLoading()
							if (res.code == 200) {
								let re = res.data
								uni.setStorageSync('refreshToken', re.refreshToken)
								uni.setStorageSync('token',
									`${re.tokenType} ${re.accessToken}`) /* token令牌 */
								uni.setStorageSync('time', new Date().valueOf() + re.expiresIn)

								uni.showToast({
									title: "登录成功",
									duration: 1500,
									icon: "success",
									success: () => {
										uni.$u.sleep(1500).then(() => {
											this.gomy()
										})
										uni.$emit("history")
									}
								})
							}
						})
					})
				} else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					uni.showToast({
						title: "手机号获取失败",
						icon: "error"
					})
					uni.hideLoading()
				}
			},
			gomy() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.denglu {
		margin-top: 20%;
		text-align: center;

		.u-avatar {
			margin: 0 auto;
		}

		.true,
		.false {
			width: 90%;
			margin: 0 auto;

			&>view:nth-child(3) {
				margin-top: 60rpx;
			}

			.title {
				font-size: 32rpx;
			}

			.text {
				font-size: 28rpx;
				margin-top: 20rpx;
				color: #8a8a8a;
				margin-left: 10rpx;
			}

			.err {
				border: 1rpx solid #09BB07;
				background-color: #fff;
			}
		}

		.true-but {
			display: flex;
			flex-direction: row;
			justify-content: space-around;

			button {
				font-size: 28rpx;
				width: 47%;
				border-radius: 30rpx;
			}
		}

		.false-but {
			button {
				height: 80rpx;
				font-size: 30rpx;
				width: 100%;
				margin-top: 30rpx;
				border-radius: 30rpx;
			}
		}
	}
</style>
