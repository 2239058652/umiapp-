<template>
	<view class="cardRecharge">
		<uni-nav-bar fixed="false" statusBar="false" title="微会员卡" left-icon="back" @clickLeft="jump(1)"></uni-nav-bar>
		<u-empty text="您还没有会员卡" mode="data" marginTop="65% 0 0 0" textSize="30" iconSize="160"
			iconColor="#bcbcbc" v-if="isShow"></u-empty>
		<view class="wvipcard" v-else>
			<view class="vcard">
				<!-- <text class="aj aj-xiangzuojiantou" @click="jump(1)"></text> -->
				<view>{{nowcard}}</view>
				<text class="aj aj-iconhuaban1-06" @click="changecard"></text>
			</view>
		</view>
		<view class="wvip" v-for="(item,index) in list" :key="index">
			<view class="wvip_dou">
				<view>{{item.name}}</view>
				<text>赠送积分</text>
			</view>
			<view class="imme">
				<button class="immrech" @click="onlinerecharge(nowcard,item.no)">立即充值</button>
			</view>
		</view>
		<u-popup :show="show" :round="10" mode="bottom" @close="close">
			<view class="pop" v-for="(item,index) in cardAndyelist" :key="index" @click="choosecard(item)">
				{{item.card}}<text>（余额:{{item.cardYe}}）</text>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				cardNoList:[],  //卡号
				nowcard:'', //当前绑定卡
				list:[],  //当前卡号列表
				cardYe:0, //余额
				isShow:false,
				cardAndyelist:[]
			}
		}, 
		onShow() {
			if(uni.getStorageSync('token') == ''){
				uni.navigateTo({url:"/pages/pagesA/denglu/denglu"})
				return
			}
			this.cardAndyelist = []
			this.haveCard()
		},	
		methods: {
			haveCard(){
				this.$request.postGetCardsByMobile({
					mobile:this.$store.state.userInfo.mobile
				}).then(res=>{
					if (res.cards.length == 0) {
						this.isShow = true
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
						this.$request.postGetAppListByCardNo({
							cardNo:this.nowcard
						}).then(res => {
							this.list = res
						});
						this.cardNoList.forEach((item,index)=>{
							this.$request.postGetCardsByYe({
								cardNo:item
							}).then(res => {
								this.cardAndyelist.push({
									"card":item,
									"cardYe":res.dye
								})
							});
						})
					}
				});
			},
			onlinerecharge(cardNo,no){
				uni.navigateTo({
					url:`/pages/pagesB/onlineRecharge/onlineRecharge?cardNo=${cardNo}&no=${no}`
				})
			},
			changecard(){
				this.show = true
			},
			close(){
				this.show = false
			},
			choosecard(ite){
				this.show = false
				this.nowcard = ite.card
				this.$request.postGetAppListByCardNo({
					cardNo:this.nowcard
				}).then(res => {
					this.list = res
				});
			},
			// 没有绑卡
			jump(){
				uni.navigateBack({delta: 1})
			}
			
		}
	}
</script>

<style lang="scss">
	.cardRecharge{
		.wvipcard{
				width: 100%;
				background-color: #fff;
				.vcard{
					width: 95%;
					display: flex;
					margin: 0 auto;
					.aj-xiangzuojiantou{
						margin-top: 20rpx;
					}
					.aj-iconhuaban1-06{
						margin-top: 10rpx;
					}
					view{
						height: 80rpx;
						font-size: 34rpx;
						font-weight:600 ;
						line-height: 80rpx;
						margin: 0 auto;
					}
				}
			}
		.wvip{
			width: 95%;
			height: 150rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			background-color: #fff;
			display: flex;
		}
		.wvip_dou{
			width: 70%;
			view{
				margin-left: 40rpx;
				font-weight: 600;
				font-size: 32rpx;
				margin-top:15rpx ;
				margin-bottom: 10rpx;
			}
			text{
				font-size:24rpx;
				color: #1983b1;
				border: 1rpx solid #1983b1;
				margin-left: 40rpx;
			}
		}
		.imme{
			width:30% ;
			position: relative;
			.immrech{
				font-size: 30rpx;
				background-color: #f76020;
				width: 180rpx;
				color: #fff;
				position: absolute;
				top:50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.pop{
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			margin: 0 auto;
			border-bottom: 1rpx solid #f0f0f0;
			text{
				margin-left: 5rpx;
				font-weight: 600;
			}
		}
		
	}
	
</style>
