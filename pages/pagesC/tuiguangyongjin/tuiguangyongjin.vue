<template>
	<view>
		<view class="header">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco">我的推广</view>
			</view>
			<view class="head_body">
				<view class="yong">当前佣金</view>
				<!-- <view class="ti" @click="jilu()">提现记录 <u-icon name="arrow-right" color="#fff" class="you" size="30">
					</u-icon>
				</view> -->
			</view>
			<view class="jin">{{yu}}</view>
			<view class="shouyi">
				<view>
					<view>昨日收益</view>
					<view>{{zuo}}</view>
				</view>
				<view @click="dongjie1()">
					<view style="display: flex;align-items: center;">冻结金额<u-icon name="arrow-right" color="#fff"
							class="you" size="25"></u-icon>
					</view>
					<view>{{dongjie}}</view>
				</view>
				<view >
					<view style="display: flex;align-items: center;">邀请人数</u-icon>
					</view>
					<view>{{renshu}}</view>
				</view>
			</view>
			<view class="tixian" @click="go_tixian()">
				<!-- <view class="tixian" @click="kaifa()"> -->
				<view>立即提现</view>
			</view>
		</view>
		<view class="body">

			<view class="box" @click="goshart()">
				<u-icon name="scan" color="#f44938" size="100"></u-icon>
				<view>推广名片</view>
			</view>
			<view <view class="box" @click="go_list()">
				<u-icon name="plus-people-fill" color="#f44938" size="100"></u-icon>
				<view>邀请人统计</view>
			</view>
			<view class="box" @click="shouyi_list()">
				<u-icon name="rmb-circle" color="#f44938" size="100"></u-icon>
				<view>账单明细</view>
			</view>
			<view class="box" @click="jilu()">
				<u-icon name="coupon" color="#f44938" size="100"></u-icon>
				<view>提现记录</view>
			</view>

			<view class="box" @click="go_gongbao()">
				<u-icon name="red-packet-fill" color="#f44938" size="100"></u-icon>
				<view>商品推广</view>
			</view>
		<!-- 	<view class="box" @click="kaifa()">
				<u-icon name="red-packet-fill" color="#f44938" size="100"></u-icon>
				<view>商品推广</view>
			</view> -->
			<view class="box" @click="paihang()">
				<u-icon name="grid" color="#f44938" size="100"></u-icon>
				<view>邀请人排行</view>
			</view>
		</view>
		<view class="daohang" @click="qiehuan_flag()">
			<u-icon v-if="!flag" name="arrow-left" color="#fff" size="45"></u-icon>
			<u-icon v-else name="arrow-right" color="#fff" size="45"></u-icon>

		</view>
		<view class="hutuis" v-if="flag">
			<u-icon name="home" @click="go_home()" color="#fff" size="45"></u-icon>
			<u-icon name="shopping-cart" @click="go_cart()" color="#fff" size="45"></u-icon>
			<u-icon @click="go_mine()" name="man-add" color="#fff" size="45"></u-icon>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				flag: false,
				yu: 0,
				zuo: 0,
				lei: 0,
				dongjie: 0,
				renshu:0
			}
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.getdata()
			this.getuserList()
		},
		methods: {
			getuserList() {
				this.$request
					.postUserList({
						mobile: uni.getStorageSync('userInfo').mobile
					}, {
						'Content-type': 'application/x-www-form-urlencoded'
					})
					.then(res => {
						console.log('人数',res);
						if(res.length>0){
							this.renshu =res.length
						}else{
							this.renshu = 0
						}
					});
			},
			paihang() {
				uni.navigateTo({
					// url: '../tuiguanglist/tuiguanglist'
					url: '/pages/pagesC/yongjin-ranking/yongjin-ranking'
				})
			},
			jilu() {
				uni.navigateTo({
					// url: '../tuiguanglist/tuiguanglist'
					url: '/pages/pagesC/tixian-record/tixian-record'
				})
			},
			lingqu_mingxi() {
				uni.navigateTo({
					// url: '../tuiguanglist/tuiguanglist'
					url: '/pages/pagesC/red-detail/red-detail'
				})
			},
			// 点击切换flag
			qiehuan_flag() {
				setTimeout(() => {
					this.flag = !this.flag

				}, 200)
			},
			// 跳转到排行榜
			go_paihang() {
				uni.navigateTo({
					url: "/pages/pagesC/renshu/renshu"
				})
				// uni.showToast({
				// 	icon: 'error',
				// 	mask: true,
				// 	title: '火热开发中~',
				// });
			},
			kaifa() {
				uni.showToast({
					icon: 'error',
					mask: true,
					title: '火热开发中~',
				});
			},
			go_tixian() {
				uni.navigateTo({
					url: `../tixian/tixian?yu=${this.yu}&lei=${this.dongjie}`

				})
			},
			go_list() {
				uni.navigateTo({
					// url: '../tuiguanglist/tuiguanglist'
					url: '../new_PromotionNumber/new_PromotionNumber'
				})
			},
			huitui() {
				uni.switchTab({
					url: '../../tabbar/index/index'
				});
			},
			// 跳到主页
			go_home() {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				});
			},
			go_cart() {
				uni.switchTab({
					url: '/pages/tabbar/shoppingCart/shoppingCart'
				});
			},
			go_mine() {
				uni.switchTab({
					url: '/pages/tabbar/my/my'
				});
			},

			// 点击返回上一级
			go() {
				uni.switchTab({
					url: '/pages/tabbar/my/my'
				});
			},
			// 点击跳转到推广名片页面
			goshart() {
				uni.navigateTo({
					url: '/pages/pagesC/sharecart/sharecart'
				})
			},
			go_gongbao() {
				// uni.navigateTo({
				// 	url: '/pages/pagesC/hongbao-ticket/hongbao-ticket'
				// })
				uni.navigateTo({
					url: '/pages/pagesC/commodityPromotion/commodityPromotion'
				})
			},
			mingxi() {
				uni.navigateTo({
					url: `/pages/pagesC/yonjing-detail/yonjing-detail}`
				})

			},
			// 收益详情
			shouyi_list() {
				uni.navigateTo({
					url: '/pages/pagesC/shouyiList/shouyiList'
				})
			},
			getdata() {
				this.$request.getHHRshouyi({
					mobile: this.$store.state.userInfo.mobile,
					// mobile:'18438005006',
				}).then(res => {
					// if(res.records&&res.records.length>0){
					// this.yu=res.records[0].ye
					this.yu = res.available.toFixed(2) //当前佣金
					this.lei = res.accumulatedIncome.toFixed(2) //累计收益
					this.zuo = res.yesterdayMoney.toFixed(2) // 昨日收益
					this.dongjie = res.unavailable.toFixed(2) //冻结金额
					// }
				})
			},
			dongjie1() {
				uni.navigateTo({
					url: "/pages/pagesC/dongjie/dongjie"
				})
			},
		}

	}
</script>

<style lang="scss">
	.head_left {
		margin-left: 20rpx;
		color: #fff;
	}

	.header {
		height: 35vh;
		width: 750rpx;
		background-color: #e93423;
		color: #fff;
	}

	.head_body {
		margin-top: 20rpx;
		text-align: center;
		position: relative;

	}

	.ti {
		display: flex;
	}

	.ti {
		float: right;
		position: absolute;
		top: 70rpx;
		right: 0;
	}

	.jin {
		font-size: 60rpx;
		text-align: center;
	}

	.shouyi {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
	}

	.shouyi view {
		text-align: center;
	}

	.tixian {

		margin-bottom: -200rpx;

	}

	.tixian view {
		margin: 0 auto;
		width: 200rpx;
		background-color: #e93423;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 25px;
		text-align: center;
		margin-top: 60rpx;
		border: 10px solid #fff;
		border-bottom: 10px solid #f5f5f5;
	}

	.body {
		margin-top: 60rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;

	}

	.box {
		width: 300rpx;
		height: 250rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		justify-content: center;
	}

	page {
		background-color: #f5f5f5;
	}

	.daohang {
		width: 80rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 50%;
		position: fixed;
		right: 20rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hutuis {
		width: 242rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 25px;
		position: fixed;
		right: 117rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: space-around;
	}

	.status_bar {
		// height: var(--status-bar-height);
		height: 75rpx;
		width: 100%;
	}

	.toubu {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}

	.inco {
		margin: 0 20rpx 0 20rpx;
	}
</style>
