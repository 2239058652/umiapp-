<template>
	<view class="drawbill">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" title="开发票"></uni-nav-bar>
		<view class="invoice">
			<view class="permessage">
				<u-form :model="form" ref="uForm" label-width="190">
					<u-form-item label="订单编号" prop="ordersn">
						<u-input v-model="form.ordersn" placeholder="请填写订单编号,可选填" border="bottom" clearable />
					</u-form-item>
					<u-form-item label="单位名称" prop="companyName" required="true">
						<u-input v-model="form.companyName" placeholder="请填写单位名称" border="bottom" clearable />
					</u-form-item>
					<u-form-item label="纳税人识别号" prop="taxpayerNumber" required="true">
						<u-input v-model="form.taxpayerNumber" placeholder="请填写纳税人识别号" border="bottom" clearable />
					</u-form-item>
					<u-form-item label="收票人手机号" prop="mobile" required="true" @click='click'>
						<u-input v-model="form.mobile" placeholder="请填写手机号" maxlength="11" border="bottom" clearable />
					</u-form-item>
					<u-form-item label="收票人邮箱" prop="email">
						<u-input v-model="form.email" placeholder="用来接收电子发票邮件,可选填" border="bottom" clearable />
					</u-form-item>
				</u-form>
			</view>
			<button v-if="!saveShow" class="btn" style="background-color: #068E0F;margin: 50rpx 0 10rpx 0;"
				@click="btnmodify">修改</button>
			<button v-else class="btn" @click="btnsub">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: { //表单信息
					ordersn: '',
					companyName: '',
					taxpayerNumber: '',
					mobile: '',
					email: '',
				},
				saveShow: null,
				rules: {
					ordersn: {
						type: 'string',
						message: '请填写订单号',
						trigger: ['blur', 'change']
					},
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur'],
						}
					],
					email: [{
						validator: (rule, value, callback) => {
							if (value == "") {
								return true
							} else {
								return uni.$u.test.email(value);
							}
						},
						message: '邮箱不正确',
					}],
					companyName: [{
						type: 'string',
						required: true,
						message: '请填写单位名称',
						trigger: ['blur', 'change'],
					}],
					taxpayerNumber: [{
						type: 'string',
						required: true,
						message: '请填写纳税人识别号',
						trigger: ['blur', 'change']
					}, {
						validator: (rule, value, callback) => {
							let reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
							if (!reg.test(value)) {
								return false
							} else {
								return true
							}
						},
						message: '纳税人识别号不正确',
					}],
				},
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules); //设置规则
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.userInfo = uni.getStorageSync('userInfo')
			uni.$u.http.get("https://newc.wp99.cn/card-littlemall/orderInvoice/detail", {
				params: {
					createUser: this.userInfo.mobile,
				}
			}).then(res => {
				if (res.code == 200) {
					if (res.msg == '暂无承载数据') {
						this.saveShow = true
					} else {
						this.form.ordersn = res.data.orderSn
						this.form.companyName = res.data.companyName
						this.form.taxpayerNumber = res.data.taxpayerIdentifier
						this.form.mobile = res.data.createUser
						this.form.email = res.data.mail
						this.saveShow = false
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}

			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			btnsub() {
				this.$refs.uForm.validate().then(valid => {
					if (valid) {
						uni.$u.http.post("https://newc.wp99.cn/card-littlemall/orderInvoice/save", {
							orderSn: this.form.ordersn,
							companyName: this.form.companyName,
							taxpayerIdentifier: this.form.taxpayerNumber,
							phone: this.form.mobile,
							mail: this.form.email,
							createUser: this.form.mobile,
						}).then(res => {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						})
					} else {
						uni.showToast({
							title: '请填写正确的发票信息',
							icon: 'none'
						})
					}
				})
			},
			btnmodify() {
				this.$refs.uForm.validate().then(valid => {
					if (valid) {
						uni.$u.http.post("https://newc.wp99.cn/card-littlemall/orderInvoice/edit", {
							orderSn: this.form.ordersn,
							companyName: this.form.companyName,
							taxpayerIdentifier: this.form.taxpayerNumber,
							phone: this.form.mobile,
							mail: this.form.email,
							createUser: this.form.mobile,
						}).then(res => {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						})
					} else {
						uni.showToast({
							title: '请填写正确的发票信息',
							icon: 'none'
						})
					}
				})
			},
			click(e) {
				this.form.mobile = ''
			},
		}
	}
</script>

<style lang="scss">
	.drawbill {
		background-color: #fff;

		.invoice {
			width: 95%;
			margin: 20rpx auto;

			.fptext {
				padding: 2rpx 30rpx;
				font-size: 28rpx;
				font-weight: 600;
				border-radius: 30rpx;
				border: 1rpx solid #d2331e;
				background-color: #fcedea;
				color: #d2331e;
				margin-bottom: 10rpx;
			}

			.permessage {
				margin-bottom: 40rpx;

				/deep/ .u-form-item {
					height: 100rpx;
				}

				/deep/ .u-form-item__body {
					padding: 0;
				}

				/deep/ .u-form-item__body__left__content__label {
					font-size: 30rpx;
					font-weight: 600;
				}

				/deep/ .u-input__content__field-wrapper__field {
					font-size: 28rpx;
				}
			}

			.btn {
				color: #fff;
				background-color: #d2331e;
				font-size: 28rpx;
				border-radius: 40rpx;
			}
		}
	}
</style>
