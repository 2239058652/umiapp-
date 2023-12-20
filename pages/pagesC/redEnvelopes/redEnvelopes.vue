<template>
	<view class="redEncelopes">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" title="我的红包"></uni-nav-bar>
		<u-sticky :offset-top="offsetTop">
			<view class="tabs">
				<view :class="[current == index ? 'active' : '' ]" v-for="(item,index) in tabs" :key="index"
					@click="changetab(index)">
					{{item}}
				</view>
			</view>
		</u-sticky>
		<swiper class="swiper" :current="swiperCurrent" :style="{Height:Height+'px'}" @change="transition">
			<swiper-item style="height: 100%;">
				<scroll-view scroll-y style="height: 100%;width: 95%;margin: 0 auto;">
					<view class="redEnvelopeList" v-for="(item,index) of hongbao" :key="index">
						<view>
							<view>
								<view class="redmoney">
									{{item.reduceMoney}}元红包券
								</view>
								<text class="zhuan">可转赠</text>
							</view>
							<view @click="details(item)">
								<text class="zmore">详情</text>
							</view>
						</view>
						<view>
							<view>有效期至：{{item.endDate}}</view>
							<view>所属业态:通用</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item style="height: 100%;">
				<scroll-view scroll-y style="height: 100%;width: 95%;margin: 0 auto;">
					<view class="store">
						<view>
							<image src="../../../static/img/fail.png" mode="scaleToFill" lazy-load="false"></image>
							<text>名字</text>
						</view>
						<u-icon name="map" stop="flase" label="到店" size="50rpx" labelPos="bottom" top="5"
							@click.stop="openmap()">
						</u-icon>
						<view>
							<view>
								距您0km
								<text v-if="index == 0">距您最近</text>
							</view>
							<view>联系电话：111111111</view>
							<view>门店地址：111111111</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view v-show="dayslist.length > 5">
			<u-loadmore fontSize="30" color="#818181" :loading-text="loadingText" :nomore-text="nomoreText" height="35"
				line :status="status" />
		</view>
		<u-popup :show="popShow":round="30" bgColor="#f5f5f5" mode="bottom" @close="popShow=false">
			<view class="details">
				<!-- <view class="zkah">{{elecList.no}}</view> -->
				<view class="zmain">
					<view class="zcenter-row  zfirst">
						<view>使用须知</view>
						<view class="">只能在小程序中使用</view>
					</view>
					<view class="zcenter-row">
						<view>卡券名称</view>
						<view class="">{{elecList.title}}</view>
					</view>
					<view class="zcenter-row">
						<view>卡券副标题</view>
						<view class="">{{elecList.subtitle}}</view>
					</view>
					<view class="zcenter-row">
						<view>卡券编号</view>
						<view class="">{{elecList.no}}</view>
					</view>
					<view class="zcenter-row">
						<view>减免金额</view>
						<view class="">{{elecList.reduceMoney}}</view>
					</view>
					<view class="zcenter-row">
						<view>有效期限</view>
						<text>{{elecList.startDate}}-{{elecList.endDate}}</text>
					</view>
				
				</view>
				<button class="btn2" data-name="shareBtn" open-type="share">转增分享</button>
				<button class="btn1" @click="popShow=false">返回</button>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['红包清单', '合作商家'],
				swiperCurrent: 0,
				current: 0,
				cardNoList: [],
				dayslist: [],
				Height: 0,
				status: 'loading',
				loadingText: '努力加载中',
				nomoreText: '实在没有了',
				offsetTop: 0,
				popShow: false,
				valueName:'',
				hongbao:null,
				elecList: {
					"no": "",
					"title": "",
					"receiveTime": "",
					"startDate": "",
					"endDate": "",
					"timeLimit": "",
					"consume": "0.00",
					"title": "",
					"subtitle": "",
					"reduceMoney": ""
				},
				form: { //表单信息
					mobile: '',
					email: '',
				},
				rules: {
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								if(value==uni.getStorageSync('userInfo').mobile.replace(uni.getStorageSync('userInfo').mobile.slice(3, 7), "****")){
									this.form.mobile = uni.getStorageSync('userInfo').mobile
									return true
								}else{
									return uni.$u.test.mobile(value);
								}
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
					}]
				},
			};
		},
		onLoad() {
			let that = this
			uni.getSystemInfo({ //获取系统信息
				success: res => {
					let top = res.statusBarHeight + 44
					that.offsetTop = top / (uni.upx2px(top) / top)
					let info = uni.createSelectorQuery().select(".tabs"); // 获取某个元素
					info.boundingClientRect(function(data) { //data - 各种参数
						that.Height = getApp().globalData.equipment.windowHeight - data.height - res
							.statusBarHeight * 2 - 24
					}).exec()
				}
			})
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.userInfo = uni.getStorageSync('userInfo')
			this.form.mobile = this.userInfo.mobile.replace(this.userInfo.mobile.slice(3, 7), "****")
			this.redDetails()
		},
		onReachBottom() {
			this.dayslist.length != 0 ? this.status = "loading" : this.status = "nomore";
		},
		watch: {
			current() {
				this.swiperCurrent = this.current;
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			changetab(index) {
				this.current = index
			},
			transition(e) {
				this.current = e.detail.current;
			},
			redDetails() {
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
					if (res.cards.length == 0) {
						uni.showModal({
							content: "您还没有卡，是否去申请卡",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/pagesA/receive/receive'
									})
								} else {
									uni.navigateBack({
										delta: 1
									})
								}
							}
						})
					} else {
						let bindTrue = res.cards.some(item => {
							return item.isBind == 1
						})
						if (bindTrue == false) {
							uni.showModal({
								content: "您还没有绑卡，是否去绑卡",
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/pagesA/bindcard/bindcard'
										})
									} else {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						} else {
							this.cardNoList = []
							res.cards.forEach(item => {
								if (item.isBind == 1) {
									this.cardNoList.push(item.cardNo)
									this.nowcard = this.cardNoList[0]
								}
							})
						}
						
							this.$request.postGetRedElec({
								mobile: this.$store.state.userInfo.mobile,
								isRedElec: 1
							}, {
								'Content-type': 'application/x-www-form-urlencoded'
							}).then(res => {
								this.hongbao=res
							})
						
					}
				});
			},
			btnsub() {
				this.popShow = false
				this.$refs.uForm.validate().then(valid => {
					if(this.valueName == ''){
						this.valueName = '个人'
					}
				})
			},
			click(e) {
				this.form.mobile = ''
			},
			details(item){
				this.popShow = true
				this.elecList = item
			}
		},
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.invoice {
		width: 95%;
		margin: 0 auto;
		margin-top: 70rpx;
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
		&>view:first-child {
			display: flex;
			justify-content: space-between;

			text:first-child {
				font-size: 35rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
			}

			text:nth-child(2) {
				font-size: 28rpx;
				color: #a8a8a8;
			}
		}

		.fptype,
		.fptt,
		.permessage {
			margin-bottom: 40rpx;

			>view:first-child {
				font-size: 30rpx;
				font-weight: 600;
				margin-top: 10rpx;
				margin-bottom: 15rpx;
			}

			/deep/ .u-form-item {
				height: 85rpx;
			}

			/deep/ .u-form-item__body {
				padding: 0;
			}
		}
		.fpcontent{
			>view:first-child{
				margin-bottom: 15rpx;
				>text:first-child{
					font-size: 30rpx;
					font-weight: 600;
					margin-right: 10rpx;
				}
				>text:nth-child(2){
					font-size: 26rpx;
					color: #a8a8a8;
				}
			}
			>view:nth-child(3){
				font-size: 26rpx;
				color: #a8a8a8;
				margin-top: 10rpx;
			}
		}

		.fptt {
			.name {
				&>view {
					line-height: 70rpx;
				}

				display: flex;
			}
		}
		.btn{
			color: #fff;
			background-color: #d2331e;
			font-size: 28rpx;
			border-radius: 40rpx;
			margin: 50rpx 0 10rpx 0;
		}
	}

	.redEncelopes {
		/deep/ .u-icon__label{
			font-size: 30rpx !important;
			width: 70rpx;
		}
		.active {
			color: #ef5858;
			font-weight: 600;
			border-bottom: 5rpx solid #ef5858;
		}
		.details{
			.zkah{
				text-align: center;
				color:#4399d3;
				line-height: 90rpx;
				background:#fff;
			}	
			.zmain{
				background:#fff;
				margin-top:20rpx;
				.zcenter-row{
					line-height:80rpx;
					border-bottom:1rpx solid #eee;
					padding:0 20rpx;
					display:flex;
					justify-content: space-between;
				}
				.zfirst{
					height: 120rpx;
				}
				.zcenter-row>view:nth-child(1){
					font-weight: bold;
				}
			}
			.btn2 {
				color: #fff;
				font-size: 30rpx;
				margin-bottom: 10rpx;
				margin-top: 10rpx;
				background-color: #27b048;
			}
			
			.btn1 {
				color: #fff;
				font-size: 30rpx;
				background-color: #f5383c;
			}
		}
		.fixe {
			width: 100%;
			position: fixed;
			z-index: 999;
		}

		.tabs {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			display: flex;
			background-color: #fff;

			view {
				width: 50%;
			}
		}

		.redEnvelopeList {
			background-color: #ffffff;
			padding: 20rpx 10rpx;
			border-radius: 10rpx;

			&>view:first-child {
				display: flex;

				&>view:first-child {
					width: 85%;

					.redmoney {
						margin-bottom: 15rpx;
						font-size: 32rpx;
						font-weight: 600;
					}

					.zhuan {
						padding: 3rpx 10rpx;
						border-radius: 10rpx;
						border: 1rpx solid #ef5858;
						color: #ef5858;
						font-size: 25rpx;
					}
				}

				&>view:nth-child(2) {
					width: 15%;
					padding-top: 20rpx;

					.zmore {
						background-color: #009f12;
						color: #fff;
						padding: 7rpx 12rpx;
						font-size: 28rpx;
						border-radius: 15rpx;
					}
				}
			}

			&>view:nth-child(2) {
				font-size: 27rpx;
				display: flex;
				margin-top: 15rpx;

				&>view:first-child {
					width: 60%;
				}

				&>view:nth-child(2) {
					width: 40%;
					text-align: end;
				}
			}
		}

		.store {
			--size: 10rpx;
			position: relative;
			margin: var(--size) auto;
			border-radius: 20rpx;
			border: 1px solid #b0a0ff;
			width: 95%;

			image {
				width: 15%;
				height: 53px;
				vertical-align: middle;
				margin: var(--size);
			}

			.u-icon {
				@include absolute (10rpx, 600rpx)
			}

			&>view:nth-child(4) {
				text {
					color: red;
				}
			}

			view {
				margin: var(--size);
			}
		}
	}
</style>
