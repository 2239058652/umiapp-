<template>
	<view class="content">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="绑卡" @clickLeft="back"></uni-nav-bar>
		<u-empty text="您还没有会员卡" mode="data" marginTop="50% 0 0 0" textSize="30" iconSize="200" iconColor="#bcbcbc"
			v-if="isShow"></u-empty>
		<view v-else>
			<view class="choscard" @click="changecard">
				切换卡号
			</view>
			<u-popup :show="show" :round="10" mode="bottom" @close="close">
				<view style="padding: 15rpx 0;">
					<view :class="[data.cardNo == cardlist[index] ? 'pop active':'pop']"
						v-for="(items,index) in cardlist" @click="choosecard(index)" :key="index">
						{{items}}
					</view>
				</view>
			</u-popup>
			<view class="cardinfo">
				<view class="cardinfo-base">
					<view>持卡人信息</view>
					<view class="cardinfo-detail">
						<view>
							<view>姓名</view>
							<view>{{ data.name }}</view>
						</view>
						<view>
							<view>证件类型</view>
							<view>{{ data.didtype }}</view>
						</view>
						<view>
							<view>手机号</view>
							<view>{{ data.mobile }}</view>
						</view>
					</view>
				</view>
				<view class="cardinfo-valid">
					<view>卡信息校验</view>
					<view style="background-color: #fff;">
						<view class="cardinfo-detail" style="border-bottom:1rpx solid #e2e2e3 ;">
							<view>
								<view>会员卡号</view>
								<view>{{ data.cardNo }}</view>
							</view>
						</view>
						<view v-show="button!='解绑'">
							<u-form :model="form" ref="uForm" label-width="150" label-align="center">
								<u-form-item label="通行证号" prop="card">
									<u-input v-model="form.card" placeholder="请输入通行证号" :maxlength="data.didno.length" />
								</u-form-item>
								<u-form-item label="支付密码" prop="payPassword">
									<u-input v-model="form.payPassword" placeholder="请输入支付密码" password="true"
										maxlength="6" />
								</u-form-item>
								<u-form-item label="推荐工号" prop="tjcard">
									<u-input v-model="form.tjcard" placeholder="请输入推荐人的工号" />
								</u-form-item>
							</u-form>
						</view>
					</view>
				</view>
				<view class="submit">
					<u-button :type="type" @click="btnclick">{{button}}</u-button>
				</view>
			</view>
			<view class="explain">
				<view>绑卡须知</view>
				<view>1、手机号码匹配你办理的会员卡</view>
				<view>2、绑定需要验证预留的证件信息和支付密码</view>
				<view>3、允许同一会员办理多张会员卡</view>
				<view>4、每个手机号码24小时内仅限5条短信</view>
				<view>5、通行证号为身份证证件号</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				SFZnum:'', //绑卡的时候输入的身份证 
				data: {},
				isShow: false, //有卡就显示
				show: false, // 弹出层
				cardlist: [], //卡号列表
				list: [], // 所有卡号信息
				isBind: 2,
				type: "", //按钮
				button: "",
				form: { //表单信息
					card: '',
					payPassword: '',
					tjcard: '',
				},
				rules: {
					card: [{
						required: true,
						message: '请输入通行证号',
						trigger: ['blur', 'change'],
					}, {
						validator: (rule, value, callback) => value.toString().length == this.data.didno.length,
						message: '通行证号不正确',
						trigger: ['blur', 'change']
					}],
					payPassword: [{
							required: true,
							len: 6,
							message: '支付密码不能为空',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => value.toString().length == 6,
							message: '必须6位支付密码',
							trigger: ['blur', 'change']
						}
					]
				},
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules); //设置规则
		},
		onLoad() {
			this.submitBtn = true
			if (uni.getStorageSync('userInfo').mobile != '') {
				this.$request.postGetCardsByMobile({
					mobile: uni.getStorageSync('userInfo').mobile,
				}).then(res => {
					this.cardlist = res.cards.map(val => val.cardNo)
					this.list = res.cards
					this.data = this.list[0]
					this.isBind = this.data.isBind
					this.SFZnum = res.cards[0].didno
					if (this.isBind == 0) {
						this.type = "success"
						this.button = "确认绑卡"
					} else {
						this.type = "error";
						this.button = "解绑"
					}
				})
				this.cardlist == [] ? this.isShow = true : this.isShow = false
			} else {
				this.isShowToast("获取信息失败")
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			btnclick() {
				if (this.isBind == 0) {
					this.tapcard();
				} else {
					this.unbound()
				}
			},
			// 卡号绑定
			tapcard() {
				if (this.submitBtn == false) {
					return
				}
				if(!this.SFZnum||'123456'|| uni.getStorageSync('userInfo').mobile||this.SFZnum ==this.form.card){
				this.submitBtn = false
				this.$refs.uForm.validate().then(valid => {
					this.$request.postValidPassword({
						dcard: this.data.cardNo,
						password: this.form.payPassword
					}).then(res => {
						if (res.code != 200) {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							return
						}
						if (res.data == true) {
							this.$request.postBindcard({
								cardNo: this.data.cardNo,
								oldMemberId: this.data.oldMemberId
							}).then(res => {
								if (res.code == 200) {
									this.isShowToast(res.msg)
									this.isBind = 1
									this.type = "error";
									this.button = "解绑"
									uni.showToast({
										title: '绑定成功',
										icon: 'none',
										success() {
											setTimeout(() => {
												uni.navigateBack({
													delta: 1,
												})
											}, 800);
										}
									})
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							})
						} else {
							this.submitBtn = true
							uni.showToast({
								title: '密码错误',
								icon: 'error'
							})
						}
					})

				}).catch(err => {
					uni.showToast({
						title: '请完善个人信息',
						icon: "none"
					})
					this.submitBtn = true
				})
				}else{
					uni.showToast({
						title: '通行证号错误',
						icon: 'error'
					})
				}
			},
			// 解绑 
			unbound() {
				let that = this
				uni.showModal({
					content: "确认解绑吗",
					success: function(res) {
						if (res.confirm) {
							that.$request.postUnbindcard({
								cardNo: that.data.cardNo,
							}).then(res => {
								if (res.code == 200) {
									that.isShowToast(res.msg)
									that.isBind = 0
									that.type = "success"
									that.button = "确认绑卡"
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},

			changecard() {
				this.show = true
			},
			close() {
				this.show = false
			},
			// 选卡
			choosecard(index) {
				this.show = false
				this.data = this.list[index]
				this.isBind = this.data.isBind
				this.SFZnum = this.data.didno
				if (this.isBind == 0) {
					this.type = "success"
					this.button = "确认绑卡"
				} else {
					this.type = "error";
					this.button = "解绑"
				}
			},
			isShowToast(title) {
				uni.showToast({
					title,
					icon: "none",
					duration: 2000
				})
			},
		},
	}
</script>

<style lang="scss">
	.content {
		.choscard {
			background-color: #fff;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
			color: #0f3f9f;
			border-top: 1rpx solid #e2e2e3;
		}

		.pop {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0 auto;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.active {
			font-weight: 600;
		}

		.cardinfo {
			width: 95%;
			margin: 0 auto;
			margin-top: 20rpx;

			.cardinfo-base>view:nth-child(1) {
				font-size: 30rpx;
			}

			.cardinfo-detail {
				background-color: #fff;
				padding: 0 10rpx;
				border-radius: 15rpx;

				&>view {
					height: 60rpx;
					line-height: 60rpx;
				}
			}

			.cardinfo-detail>view {
				display: flex;
				justify-content: space-between;
				color: #59595a;
				border-bottom: 1rpx solid #e2e2e3;
			}

			.cardinfo-detail>view:last-child {
				border-bottom: none
			}

			.cardinfo-valid {
				margin-top: 30rpx;
				padding: 0 10rpx;
			}
		}

		.explain {
			width: 95%;
			margin: 0 auto;
			margin-top: 20rpx;
			font-size: 25rpx;

			view {
				height: 40rpx;
				line-height: 40rpx;
			}
		}

		.submit {
			margin-top: 20rpx;

			button {
				height: 65rpx;
				line-height: 65rpx;
			}
		}

	}
</style>
