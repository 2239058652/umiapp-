<template>
	<view class="newAddress">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="修改地址" left-icon="back"></uni-nav-bar>
		<u-form :model="form" ref="uForm" label-width="200" label-align="center">
			<!-- 联系人 -->
			<u-form-item label="联系人" prop="name">
				<u-input v-model="form.name" placeholder="请输入联系人的姓名"></u-input>
			</u-form-item>
			<!-- 手机号 -->
			<u-form-item label="手机号" prop="mobile">
				<u-input v-model="form.mobile" placeholder="请输入联系人手机号"></u-input>
			</u-form-item>
			<!-- 所在城市 -->
			<u-form-item label="所在地区" @click="openmap">
				<!-- <u-input v-model="form.areaPathName" disabled disabledColor="#f6f6f6" placeholder="请选择您的地址">
					<template slot="suffix" style="display: flex;">
						<u-icon name="map" color="red"></u-icon>
						<u--text text="定位" size="28" color='red'></u--text>
					</template> 
				</u-input> -->
				<u--textarea v-model="form.areaPathName" placeholder="省市区县、乡镇等" disabled></u--textarea>
				<view class="textarea" style="display: flex;">
					<u-icon name="map" color="red"></u-icon>
					<u--text text="定位" size="28" color='red'></u--text>
				</view>
			</u-form-item>
			<!-- 详细地址 -->
			<u-form-item label="详细地址" prop="address">
				<u-input v-model="form.address" placeholder="小区楼栋、门牌号"
					:value="[form.address=='小区楼栋、门牌号'?'':form.address]">
				</u-input>
			</u-form-item>
			<!-- 设置默认地址 -->
			<u-form-item label="设置默认地址">
				<u-switch slot="right" size="40" v-model="form.isDefault"></u-switch>
			</u-form-item>
		</u-form>
		<button @click="preservation" size="default" type="primary">保存地址</button>
	</view>
</template>
<script>
	import city from '@/uni_modules/uview-ui/libs/util/city.js';
	import province from '@/uni_modules/uview-ui/libs/util/province.js';
	export default {
		data() {
			return {
				show: false, //是否打开选着地区
				form: {
					id: 0,
					name: '',
					mobile: this.$store.state.userInfo.mobile,
					areaPathName: "",
					address: '',
					isDefault: false,
				},
				rules: { // 验证手机号
					mobile: [{
						required: true,
						message: "请输入手机号",
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						trigger: ['change', 'blur'],
					}],
				},
				qqmapsdk: null
			}
		},
		onLoad(data) {
			this.lat = 0
			this.lng = 0
			let res = JSON.parse(data.data)
			res == 0 ? this.require = 'postSave2' : (this.form = res, this.form.isDefault = Boolean(res.isDefault))
		},
		onReady() {
			// 验证是否有自定义的rules
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			openmap() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						this.form.areaPathName = res.address + res.name
						this.lat = res.latitude
						this.lng = res.longitude
					},
					fail(res) {
						console.log(res)
					}
				});
			},
			preservation() { //可以进行优化 防止没有修改时禁止触发请求
				if (this.form.areaPathName == '请选择您的地址' || this.form.address == '' || this.form.name == '' || this.form
					.mobile == '') {
					uni.showToast({
						title: '请完善地址信息',
						icon: 'error',
						duration: 2000
					})
				} else {
					// 对整个表单进行语法效验
					this.$refs.uForm.validate().then(async valid => {
						if (valid) {
							let {
								name,
								mobile,
								areaPathName,
								address,
								id,
								isDefault
							} = this.form,
								parameter = {
									name,
									mobile,
									address,
									areaPathName,
									isDefault: Number(isDefault),
									userMobile: this.$store.state.userInfo.mobile,
									lat: this.lat,
									lng: this.lng,
								},
								api = this.require == 'postSave2', res, header = {
									'content-type': 'application/x-www-form-urlencoded'
								}
							if (api) {
								res = await this.$request.postSave2(parameter, header)
							} else {
								parameter.id = id
								res = await this.$request.postUpdate2(parameter, header)
							}
							if (res.code == 200) {
								uni.showToast({
									title: api ? "保存成功" : "修改成功",
									icon: "none",
									duration: 1000,
									success: () => {
										let eventChannel = this
											.getOpenerEventChannel(),
											page = getCurrentPages(),
											re = res.data
										page[page.length - 2].route ==
											"pages/pagesA/order/order" ?
											uni.$emit("changePeisong", {
												data: [re.id, false, name,
													mobile,
													areaPathName,
													address, re
													.isDefault
												]
											}) : eventChannel.emit('postList2')
									}
								})
								setTimeout(() => {
									this.back()
								}, 1000)
							}
						}
					})
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style lang="scss">
	.newAddress {
		/deep/.u-textarea {
			width: 75%;
		}

		>button:nth-child(3) {
			width: 95%;
			margin-top: 20rpx;
		}

		.textarea {
			display: flex;
			position: absolute;
			top: 50%;
			right: 1%;
			transform: translateY(-50%);
		}
	}
</style>
