<template>
	<view class="my">
		<u-navbar leftIconColor="white" leftfont="40" left-text="我的" leftIcon=" " bgColor="#fe6850" ></u-navbar>
		<!-- 页头背景色 -->
		<view class="bj" @click="ceshi()"></view>
		<!-- 页面主体内容 -->
		<view class="body">
			<!-- 头像等信息 -->
			<view>
				<!-- <view class="left" @click="godl"> -->
				<view class="left" @click="xiugai">
					<u-avatar size="120" shape="circle" :src="src"></u-avatar>
					<view>
						<text>{{ name ||'默认用户'}}</text>
						<br />
						<view>{{mobile}}</view>
						<!-- <text v-if="name != '点击登录'"></text> -->
					</view>
				</view>
				<view class="right" @click="jump(30)">
					<text class="aj aj-erweima"></text>
					<text>会员码</text>
				</view>
				<view class="lower">
					<view>
						<view>{{ amountYe }}</view>
						<view>总余额</view>
					</view>
					<view>
						<view>{{ amountJf }}</view>
						<view>总积分</view>
					</view>
					<view>
						<view>{{ cardNum }}</view>
						<view>共{{ cardNum }}张卡</view>
					</view>
					<view>
						<view>{{ elecCodeNum }}</view>
						<view>共{{ elecCodeNum }}张券</view>
					</view>
				</view>
			</view>
			<!-- <button @click="dianji()">点击</button> -->
			<gongGe title="我的订单" :list="iconList1" :number="number"></gongGe>
			<gongGe title="我的服务" :list="iconList"></gongGe>
			<gongGe title="我的足迹" :list="footprint" @jump="jump"></gongGe>

		</view>
		<tabbar></tabbar>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				src: '', //头像路径
				name: '', //名称
				number: 1, //徽标数
				iconList: [], //图标
				iconList1: [],
				footprint: [], //我的足迹
				amountJf: 0, //总积分
				amountYe: 0, //余额
				cardNum: 0, //卡数量
				elecCodeNum: 0 ,//电子券数量
				mobile:''
			};
		},
		onShow() {
			let phoneNum =  uni.getStorageSync('userInfo').mobile;
			let way1 = phoneNum.toString().slice(0, 3)+ '****'+ phoneNum.toString().slice(-4);
			this.mobile = way1
			this.$request.getMember({
				mobile: uni.getStorageSync('userInfo').mobile
			}).then(res => {
				let user = uni.getStorageSync('userInfo')
				this.src = res.weixinHeadImgurl
				this.name = res.weixinNickName
				user.avatarUrl = res.weixinHeadImgurl
				user.nickName = res.weixinNickName

				uni.setStorageSync('userInfo', user)
				this.history();
			})
			// 每次进入都会刷新我的页面的历史记录
			// this.history()
			// 每次进来都会获取图标 为的是解决登录之后订单/服务等模块不展示的问题
			this.$store.state.userInfo == '' ? (this.name = '点击登录') : ((this.name = this.$store.state.userInfo.nickName), (
				this.src = this.$store.state.userInfo.avatarUrl));
			uni.$emit('orderNum');
			this.$request
				.postGetAccountInformation({
					mobile: uni.getStorageSync('userInfo').mobile
				}, {
					'Content-type': 'application/x-www-form-urlencoded'
				})
				.then(res => {
					if (res.code == 200) {
						this.amountJf = res.data.amountJf == 0 ? res.data.amountJf : res.data.amountJf.toFixed(2);
						this.amountYe = res.data.amountYe == 0 ? res.data.amountYe : res.data.amountYe.toFixed(2);
						this.cardNum = res.data.cardNum;
						this.elecCodeNum = res.data.elecCodeNum;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			// 图标 （我的服务）
			this.$request
				.postMySetMenuList({
					type: '5'
				})
				.then(res => {
					this.iconList = []
					res.forEach((item, index) => {
						this.iconList.push({
							name: item.name,
							img: item.imgPath,
							url: item.url
						});

					});
				});

			// 图标 （我的订单）
			this.$request
				.postMySetMenuList({
					type: '4'
				})
				.then(res => {
					this.iconList1 = []
					res.forEach((item, index) => {
						this.iconList1.push({
							name: item.name,
							img: item.imgPath
						});
					});
				});
		},
		onLoad() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: '/pages/pagesA/denglu/denglu'
				});
				return;
			}
			this.iconList = [];
			this.iconList1 = [];
			uni.$on('history', this.history);
		},

		onUnload() {
			uni.$off('history', this.history);
		},
		methods: {
			ceshi(){
			uni.navigateTo({
				url: "/pages/pagesA/paySuccess/paySuccess?order=3103153580604802"
			})
			},
			xiugai() {
				uni.navigateTo({
					url: '/pages/pagesB/geren/geren'
				});
			},
			dianji() {
				uni.navigateTo({
					url: '/pages/pagesC/tuiguangyongjin/tuiguangyongjin'
				});

			},
			godl() {
				if (uni.getStorageSync('token') == '' || uni.getStorageSync('userInfo').mobile == undefined) {
					uni.navigateTo({
						url: '/pages/pagesA/denglu/denglu'
					});
				}
			},
			jump(id) {
				if (id == 30) {
					uni.navigateTo({
						url: '/pages/pagesB/payment/payment'
					});
				}
			},
			history() {
				// 历史
				if (uni.getStorageSync('token') != '') {
					this.footprint = [];
					this.$request
						.postHistoryList({
							mobile: uni.getStorageSync('userInfo').mobile,
							shopNo: getApp().globalData.shopNo
						})
						.then(res => {
							let list = res.slice(-4);
							let list1 = list.reverse();
							list1.forEach((item, index) => {
								this.footprint.push({
									name: item.name,
									img: item.image,
									id: item.id
								});
							});
						});
				}
			},

			// 点击跳转
			go(a) {
				if(a==1){
					uni.navigateTo({
					url:'/pages/pagesD/ditu/ditu'
					});
				}else{
					uni.navigateTo({
					url:'/pages/pagesD/web2/web2'
					});
				}
				
			}
		}
	};
</script>
<style lang="scss">
	@import '@/static/style/uni.scss';

	.my {
		@mixin size($weight: 0, $size: 0, $color: #000000) {
			font-weight: $weight;
			font-size: $size;
			color: $color;
		}

		/deep/ .u-tabbar-item__icon {
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		position: relative;

		.bj {
			background: #fe6850;
			width: 100%;
			height: 390rpx;
			clip-path: ellipse(85% 50% at 50% 40%);
		}

		.body {
			margin-bottom: 180rpx;

			@mixin my-position($top) {
				position: absolute;
				top: $top;
				left: 50%;
				transform: translateX(-50%);
			}

			@include my-position(45%) width: 95%;

			&>view:first-child {
				@include flex(row wrap, space-between);
				width: 100%;
				background: #fff;
				border-radius: 30rpx;
				padding: 25rpx 0 40rpx 0;
				box-sizing: border-box;

				@mixin text {
					display: inline-block;
					width: 210rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					border-radius: 50rpx;
					color: white;
				}

				.u-avatar--circle {
					display: inline-block;
				}

				.left {
					width: 55%;
					display: flex;
					align-items: center;
					margin-left: 5%;

					&>view:nth-child(2) {
						display: inline-block;
						margin-left: 10rpx;

						&>text:nth-child(1) {
							display: inline-block;
							width: 100%;
							@include hide(1, 53rpx);
							font-size: 40rpx;
						}
					}

					.aj-huiyuan1 {
						@include size(0, 30rpx, white);
					}

					.aj-jinrujiantou {
						@include size(900, 30rpx, #fff);
					}
				}

				.right {
					display: flex;
					justify-content: space-around;
					text-align: center;
					font-size: 40rpx;
					width: 23%;
					margin-right: 2%;

					.aj-erweima {
						@include size(900, 85rpx, black);
					}

					text {
						font-size: 30rpx;
						writing-mode: vertical-rl;
					}
				}

				.lower {
					width: 100%;
					display: flex;
					margin-top: 10rpx;

					&>view {
						width: 25%;

						view {
							text-align: center;
							overflow: hidden;
						}
					}
				}

				.lowerLeft,
				.lowerRight {
					width: 35%;
					margin-top: 30rpx;
					@include flex(row wrap, space-between, center);

					// display: flex;
					// align-items: center;
					// justify-content: space-between;
					view {
						&>text:nth-child(1) {
							font-weight: 900;
						}

						&>text:nth-child(3) {
							color: red;
							font: normal 100 27rpx normal;
						}
					}

					.aj-jinrujiantou {
						@include size(900, 30rpx, #000);
					}

					.aj-erweima,
					.aj-fapiao {
						@include size(900, 60rpx, black);
					}
				}
			}
		}
	}
</style>
