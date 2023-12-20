<template>
	<view class="youhuiquan">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="优惠券" @clickLeft="back"></uni-nav-bar>
		<view class="mobile">{{userInfo.mobile}}</view>
		<view class="text">{{text}}</view>
		<view class="crad" v-for="(item,index) in lists" :key="index" :style="'background-color:'+item.color"
			@click="receive(item.isKl,item.cardid)">
			<view>
				<text class="a">￥</text>
				<text class="money">{{item.reduceMoney}}</text>
				<text>{{item.title}}</text><br />
				<text>订单满{{item.consume == '' ? '无限制' : item.consume}}元使用(不含邮费)每人限领{{item.receiveLimit}}张</text><br />
				<text>{{item.useTime}}</text>
			</view>
			<view>{{item.isKl == "N" ? '活动未开始' : '立即领取'}}</view>
		</view>
		<view v-if="lists.length==0" class="kong">
			当前没有可领取的券
		</view>
	</view>
</template>
<style lang="scss">
	@import "@/static/style/uni.scss";
	.youhuiquan {

		.mobile,
		.text {
			padding: 15rpx;
			text-align: center;
		}

		.text {
			color: #007cc8;
			border-bottom: 3rpx solid #007cc8;
		}

		.crad {
			@include flex (row nowrap, space-between) width: 85%;
			color: white;
			padding: 25rpx;
			margin: 20rpx auto;
			font-size: 25rpx;
			border-radius: 5rpx;
			// background: linear-gradient(90deg, #ff8f4d 25%, #ff6950 90%);

			>view:nth-child(1) {
				>br:nth-child(4) {
					margin-bottom: 15rpx;
				}

				.a {
					font-size: 35rpx;
				}

				.money {
					margin: 0 10rpx;
					font-size: 50rpx;
				}
			}

			>view:nth-child(2) {
				width: 7%;
				writing-mode: vertical-lr;
				letter-spacing: 3px;
				text-align: center;
				border-left: 5rpx dashed #fff;
				padding-left: 5%;
				// clip-path:polyon()
			}
		}
	}
	.kong{
		height: 200rpx;
		line-height: 200rpx;
		text-align: center;
		font-size: 35rpx;
		
	}
</style>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				lists: null,
				nowcard: '',
				text:'可领取卡券'
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.cardNoList = []
			this.nowcard = ''
			this.time = null
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
		},
		onShow() {
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
				}

			});
			this.$request.getnewPeople({
				mobile: this.$store.state.userInfo.mobile
			}).then(res => {
				if(res.isNewMemberGoods==0){
					this.getlist(-1)
				}else{
					this.getlist(1)
				}
			})

		},
		methods: {
			getlist(flag){
				this.$request.postCollectElecCenter({
					source: "weixin",
					sfzzlq: "1",   // 是否自助领取 1 代表自助领取 
					sfzczs: flag  //原来是-1 代表不注册赠送
				}).then(res => {
					console.log('is新人',res);
					this.lists = res
		
						
					if(flag=='1'){
					
						this.$request.postCollectElecCenter({
							source: "weixin",
							sfzzlq: "1",   // 是否自助领取 1 代表自助领取 
							sfzczs:'-1'  //原来是-1 代表不注册赠送
						}).then(res => {
							console.log('old',res);
							this.lists.push(...res)
							console.log('现在的list的',this.lists);
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			receive(isKl, cardids) {
				if (this.time) {
					return
				}
				let title = this.nowcard == undefined && "请先获取会员卡！" || isKl == "N" && "暂不能领取！"
				if (title != false) {
					(title => {
						uni.showToast({
							title,
							icon: "none"
						})
						this.nowcard == undefined && setTimeout(() => {
							uni.navigateTo({
								url: "/pages/pagesA/receive/receive"
							})
						}, 1500)
					})(title)
					return
				}
				this.$request.postCollectElecInfo({
					cardids,
					cardNo: this.nowcard,
					limits: "1",
					source: "weixin"
				}).then(res => { //SUCCESS成功 FAIL失败
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					let status = res.data.status == "SUCCESS"
					uni.showToast({
						title: status ? "领取成功" : "领取已达上线",
						icon: status ? "success" : "error"
					});
				})
				this.time = setTimeout(() => {
					this.time = null
				}, 2000)
			}

		}
	}
</script>
