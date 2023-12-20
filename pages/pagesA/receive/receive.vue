<template>
	<view class="receive">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="个人信息登记" @clickLeft="back"></uni-nav-bar>
		<view class="form">
			<u-form :model="form" ref="uForm" label-width="150" label-align="center">
				<u-form-item label="姓名" prop="name">
					<u-input v-model="form.name" placeholder="请输入姓名" />
				</u-form-item>
				<u-form-item label="通行证号" prop="card">
					<u-input v-model="form.card" placeholder="请输入通行证号" />
				</u-form-item>
				<u-form-item label="性别">
					<u-radio-group v-model="radio" @change="radioGroupChange" shape="circle" size="50" iconSize="40">
						<u-radio v-for="(item, index) in form.radioList" :key="index" labelSize="30" :name="item.name"
							:label="item.name">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="手机号" prop="mobile">
					<u-input v-model="form.mobile" placeholder="请输入手机号" />
				</u-form-item>
				<u-form-item label="支付密码" prop="payPassword">
					<u-input v-model="form.payPassword" placeholder="请输入支付密码" :password="showPassword" />
					<u-icon
						customStyle="position: absolute;right: 4%;top: 50%;transform: translateY(-125%);z-index:9999;"
						:name="iconName" color="#565055" size="42" @click="look"></u-icon>
				</u-form-item>
			</u-form>
		</view>
		<view class="Tips">
			<view>申请须知:</view>
			<view> 1、姓名、身份证号码确保正确，否则影响正常办理业务;</view>
			<view> 2、支付密码为6为数字，注意保密;</view>
			<view> 3、发卡方不允许同一会员办理多张会员卡;</view>
		</view>
		<u-button type="success" @click="submit">提交</u-button>
		<u-button type="error" @click="jump">返回</u-button>
		<u-modal v-model="modalShow" :content="'您申请的卡号：'+content" :show-cancel-button="true" @confirm="confirm"
			@cancel="cancel" :title="title">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				wid: '',
				cardParams: {},
				modalShow: false,
				radio: '男',
				certificatesCode: '',
				showPassword: true,
				iconName: 'eye-fill',
				submitBtn: true,
				form: { //表单信息
					name: '',
					mobile: '',
					card: '',
					payPassword: '',
					radioList: [{
						name: "男"
					}, {
						name: "女"
					}]
				},
				rules: {
					name: [{
						required: true,
						min: 1,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}],
					card: [{
						required: true,
						message: '请输入身份证',
						trigger: ['blur', 'change'],
					}, {
						// 自定义验证函数
						validator: (rule, value, callback) => {
							// 返回true表示校验通过，返回false表示不通过
							return this.$u.test.idCard(value)
						},
						message: '身份证不正确',
						// 触发器可以同时用blur和change
						trigger: ['blur', 'change'],
					}],
					mobile: [{
						required: true,
						len: 11,
						message: "请输入手机号",
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						trigger: ['change', 'blur'],
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
				}
			};
		},
		onLoad() {
			this.$request.getApply().then(res => {
				this.wid = res.wid
				this.cardParams = JSON.parse(res.cardParams)
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules); //设置规则
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			look() {
				this.showPassword = !this.showPassword
				this.showPassword ? this.iconName = 'eye-fill' : this.iconName = 'eye'
			},
			submit() {
				if (this.submitBtn == false) {
					return
				}
				this.submitBtn = false
				console.log(this.form)
				this.$refs.uForm.validate().then(valid => {
					let data = {
						action: 'CARD_APPLY',
						ignores: ["password", "idType", "idNo", "name", "sex"],
						params: {
							tenantId: this.cardParams.tenantId,
							method: 'card.account.create',
							cardTypeNo: this.cardParams.cardTypeNo,
							cardLevelNo: this.cardParams.cardLevelNo,
							memberTypeNo: this.cardParams.memberTypeNo,
							shopNo: this.cardParams.shopNo,
							workNo: this.cardParams.workerNo,
							name: this.form.name,
							mobile: this.form.mobile,
							password: this.form.payPassword,
							idType: '身份证',
							idNo: this.form.card,
							sex: '保密'
						},
						additional: {
							"wid": `${this.wid}`
						},
						wid: this.wid
					}
					this.$request.postV1({
						action: data.action,
						ignores: data.ignores,
						params: JSON.stringify(data.params),
						additional: JSON.stringify(data.additional),
						wid: data.wid
					}, {
						'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
						if (res.status == "error") {
							uni.showToast({
								title: res.message,
								icon: 'none',
								mask: true,
								duration: 2000,
							})
							return
						}
						this.modalShow = true
						this.title = res.message
						this.content = res.cardNo
						uni.showToast({
							title: '申请成功',
							success() {
								setTimeout(() => {
									uni.navigateTo({
										url:'/pages/pagesA/bindcard/bindcard'
									})
								}, 1000);
							},
						})
					})
				}).catch(err => {
					uni.showToast({
						title: '请完善个人信息',
						icon: "none"
					})
					this.submitBtn = true
				})
			},
			confirm() {
				this.jump()
			},
			cancel() {

			},
			radioGroupChange(e) {
				this.radio = e
			},
			jump() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style lang="scss">
	.receive {
		background-color: #fff;

		.title {
			width: 95%;
			margin: 30rpx auto;
			color: #999;
		}

		.Tips {
			width: 90%;
			margin: 20rpx auto;
			color: #999;
			line-height: 40rpx;
		}

		.form {
			width: 95%;
			margin: 0 auto;

			&>view {
				view:last-child {
					position: relative;
				}
			}
		}

		button {
			width: 90% !important;
			margin: 30rpx auto;
		}
	}
</style>
