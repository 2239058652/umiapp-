<template>
	<view class="consumptionbill">
		<uni-nav-bar fixed="false" statusBar="false" :title="title" left-icon="left" @clickLeft="jump(1)"></uni-nav-bar>
		<view>
			<view class="fixe">
				<view class="wvipcard">
					<view class="vcard" v-if="title=='卡金变动'">
						<view>{{nowcard}}</view>
						<text class="aj aj-iconhuaban1-06" @click="show=true"></text>
					</view>
				</view>
				<view class="leave_cont">
					<view class="ul">
						<view class="li">
							<text>开始时间:</text>
							<view class="flex1">
								<picker mode="date" :value="start_date" :end="other" @change="bindDateChange">
									<view class="date">{{other}}</view>
								</picker>
							</view>
						</view>
						<view class="li">
							<text>结束时间:</text>
							<view class="flex1">
								<picker mode="date" :value="start_date" :start="start_date" @change="bindDateChange2">
									<view class="date">{{end_date}}</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="show" :round="10" mode="bottom" @close="show=false">
			<view class="pop" v-for="(items,index) in cardNoList" @click="choosecard(items)" :key="index">
				{{items}}
			</view>
		</u-popup>
		<view :class="title=='积分变动'?'scroll1':'scroll'">
			<view v-if="dayslist.length!=0">
				<view class="billcontent" v-for="(ite,ind) in dayslist" :key="ind">
					<view class="conleft">
						{{ind+1}}
					</view>
					<view class="cont" v-if="title=='积分变动'">
						<view>门店名称：{{ite.shopName}}</view>
						<view class="zf">积分变动：{{ite.score}}</view>
						<text>{{ite.date}}</text>
					</view>
					<view class="cont" v-else>
						<view>门店名称：{{ite.shopName}}</view>
						<view class="zf">支付方式：{{ite.payType}}</view>
						<view class="zf">交易金额：{{ite.money}}</view>
						<text>{{ite.date}}</text>
					</view>
					<view class="">
						<text class="conrt">{{ite.type}}</text>
					</view>
				</view>
			</view>
			<u-loadmore v-if="dayslist.length!=0 && dayslist.length>10" fontSize="30" color="#000000"
				:loading-text="loadingText" height="35" line :status="status" />
			<view v-if="jlShow" style="margin-top: 20rpx;text-align: center;">暂无{{title}}记录</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				title: '',
				dayslist: [],
				nowcard: '',
				cardNoList: [],
				show: false,
				Height: 0,
				start_date: currentDate,
				end_date: currentDate,
				other: '请输入',
				page: 1,
				status: "loadmore", //加载更多提示文字
				loadingText: "努力加载中，先喝杯茶",
				jlShow: false,
			};
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			if (this.title == '积分变动') {
				this.jfbiandong(this.other, this.end_date, '1')
			} else {
				uni.showLoading()
				this.haveCard()
			}
		},
		onLoad(option) {
			let a = new Date()
			this.other = `${a.getFullYear()}-${a.getMonth()}-${a.getDate()}`
			this.title = option.title
			// this.Height = getApp().globalData.equipment.windowHeight - 64 - 38
		},
		onReachBottom() {
			this.page += 1
			if (this.title == '积分变动') {
				this.jfbiandong(this.other, this.end_date, this.page)
			} else {
				this.cardbiandong(this.other, this.end_date, this.nowcard, this.page)
			}
		},
		methods: {
			haveCard(){
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
					if (res.cards.length == 0) {
						uni.hideLoading()
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
							uni.hideLoading()
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
								}
							})
						}
						this.nowcard = this.cardNoList[0]
						this.cardbiandong(this.other, this.end_date, this.nowcard, '1')
					}
				});
			},
			jfbiandong(startDate, endDate, pageNumber) {
				this.$request.postGetJfChangeDetail({
					mobile: this.$store.state.userInfo.mobile,
					startDate: startDate,
					endDate: endDate,
					pageNumber: pageNumber,
					pageSize: 10
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.status = "loading"
						if (res.data.list.length != 0) {
							this.dayslist.push(...res.data.list)
						} else {
							this.jlShow = true
							this.status = "nomore"
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			cardbiandong(startDate, endDate, cardNo, pageNumber) {
				this.$request.postGetCardYeChangeDetail({
					cardNo: cardNo,
					startDate: startDate,
					endDate: endDate,
					pageNumber: pageNumber,
					pageSize: 10
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.status = "loading"
						if (res.data.list.length != 0) {
							this.dayslist.push(...res.data.list)
						} else {
							this.status = "nomore"
							this.jlShow = true
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			choosecard(ite) {
				this.show = false
				this.nowcard = ite
				this.dayslist = []
				uni.showLoading()
				this.cardbiandong(this.other, this.end_date, this.nowcard, '1')
			},
			// 没有绑卡
			jump(e) {
				e == 1 ? uni.navigateBack({
					delta: 1
				}) : uni.navigateTo({
					url: '/pages/pagesA/receive/receive'
				})
			},
			// 选择日期
			bindDateChange: function(e) {
				this.start_date = e.target.value
				this.other = this.start_date;
				this.dayslist = []
				uni.showLoading()
				if (this.title == '积分变动') {
					this.jfbiandong(this.other, this.end_date, '1')
				} else {
					this.cardbiandong(this.other, this.end_date, this.nowcard, '1')
				}
			},
			bindDateChange2: function(e) {
				this.end_date = e.target.value;
				this.dayslist = []
				uni.showLoading()
				if (this.title == '积分变动') {
					this.jfbiandong(this.other, this.end_date, '1')
				} else {
					this.cardbiandong(this.other, this.end_date, this.nowcard, '1')
				}
			},
			// 获取当前时间
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.consumptionbill {
		.active {
			color: #ef5858;
			font-weight: 600;
			border-bottom: 5rpx solid #ef5858;
		}

		.scroll1 {
			margin-top: 82rpx;
		}

		.scroll {
			margin-top: 164rpx;
		}

		.fixe {
			width: 100%;
			position: fixed;
			z-index: 999;
		}

		.swiper {
			margin-top: 165rpx;
		}

		.wvipcard {
			width: 100%;
			background-color: #fff;
			border-bottom: 1rpx solid #eaeaea;

			.vcard {
				width: 95%;
				display: flex;
				margin: 0 auto;

				.aj-xiangzuojiantou {
					margin-top: 20rpx;
				}

				.aj-iconhuaban1-06 {
					margin-top: 10rpx;
				}

				view {
					height: 80rpx;
					font-size: 34rpx;
					line-height: 80rpx;
					margin: 0 auto;
				}
			}
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

		.billcontent {
			margin: 0 auto;
			margin-top: 10rpx;
			display: flex;
			background-color: #fff;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			position: relative;

			.conleft {
				width: 20%;
				font-size: 60rpx;
				color: #ef5858;
				text-align: center;
				line-height: 175rpx;
			}

			.cont {
				width: 65%;

				view {
					font-size: 35rpx;
					font-weight: 600;
					@include hide($num:1, $max:85rpx);
					margin-bottom: 10rpx;
					color: #3d3d3d;
				}

				text {
					font-size: 25rpx;
					color: #070709;
				}

				.zf {
					font-size: 28rpx;
					color: #070709;
					font-weight: normal;
				}
			}

			.conrt {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				padding: 10rpx;
				background-color: #cbcbcb;
				border-radius: 10rpx;
			}
		}

		.pop {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0 auto;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.leave_cont .ul {
			display: flex;
			background-color: #fff;
		}

		.leave_cont .ul .li {
			width: 50%;
			display: flex;
			align-items: center;
			padding-left: 10rpx;
			border-bottom: 1px solid #efefef;
		}

		.leave_cont .ul .li text {
			padding: 20rpx 0;
		}

		.leave_cont .ul .li .flex1 {
			color: #999999;
			font-size: 32rpx;

			view {
				margin-left: 10rpx;
				align-content: normal;
				align-content: normal;
				border: 1rpx solid #a5a3a3;
				border-radius: 10rpx;
				padding: 5rpx 15rpx;
				text-align: center;
			}
		}

		.date {
			height: 42rpx;
		}
	}
</style>
