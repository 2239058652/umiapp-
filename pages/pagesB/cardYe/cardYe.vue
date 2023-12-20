<template>
	<view class="cardRecharge">
		<uni-nav-bar fixed="false" statusBar="false" title="查余额" left-icon="back" @clickLeft="jump(1)"></uni-nav-bar>
		<u-empty text="您还没有会员卡" mode="data" marginTop="65% 0 0 0" textSize="30" iconSize="160"
			iconColor="#bcbcbc"  v-if="isShow"></u-empty>
		<view class="wvipcard" v-else>
			<view class="vcard">
				<view>{{nowcard}}</view>
				<text class="aj aj-iconhuaban1-06" @click="changecard"></text>
			</view>
		</view>
		<view class="ye-list" v-if="cardNoList != ''">
			<view class="detail">
				<view class="detail-row">
					<view>会员姓名</view> 
					<view>{{balanceInfo.realName}}</view>
				</view>
				<view class="detail-row">
					<view>卡号</view>
					<view>{{balanceInfo.cardNo}}</view>
				</view>
				<view class="detail-row">
					<view>卡类型</view>
					<view>{{balanceInfo.dklxname}}</view>
				</view>
				<view class="detail-row">
					<view>卡等级</view>
					<view>{{balanceInfo.dkdjname}}</view>
				</view>
				<view class="detail-row">
					<view>总余额</view>
					<view>{{balanceInfo.dye}}元</view>
				</view>
				<view class="detail-row">
					<view>保底金额</view>
					<view>{{balanceInfo.dmin}}元</view>
				</view>
				
			</view>
		</view>
		<view v-if="cardNoList != ''">
			<view style="padding:10rpx;text-align:center;background-color: #fff;">卡金变动记录<text class="aj aj-jinrujiantou" style="float: right;font-size: 28rpx;" @click="gocard">更多</text></view>
			<view v-if="dayslist.length!=0" >
					<view class="billcontent" v-for="(ite,ind) in dayslist" :key="ind">
						<view class="conleft">
							{{ind+1}}
						</view>
						<view class="cont">
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
				<view v-if="cardShow" style="margin-top: 20rpx;text-align: center;">暂无卡金变动记录</view>
		</view>
		<u-popup :show="show" :round="10" mode="bottom" @close="close">
			<view class="pop" v-for="(item,index) in cardNoList" :key="index" @click="choosecard(item)">
				{{item}}
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
				dayslist:[],
				balanceInfo:{
				   "realName": "姓名",
				   "cardNo": "9966",
				   "dklxname": "会员卡",
				   "dkdjname": "普卡",
				   "dye": 0,
				   "djf": 0,
				   "dmin": 0,
				   "dmaxconsumemoney": 100000000,
				   "balance": 0
				},
				page:1,
				status: "loadmore", //加载更多提示文字
				loadingText: "努力加载中，先喝杯茶",
				cardShow:false,
				isShow:false
			}
		},
		onShow() {
			if(uni.getStorageSync('token') == ''){
				uni.navigateTo({url:"/pages/pagesA/denglu/denglu"})
				return
			}
			uni.showLoading()
			this.dayslist = []
			this.haveCard()
			
		},	
		onReachBottom(){
			this.page+=1
			this.cardbiandong(this.start, this.end,this.nowcard,this.page)
		},
		methods: {
			cardbiandong(startDate, endDate,cardNo,pageNumber) {
				this.$request.postGetCardYeChangeDetail({
					cardNo:cardNo,
					startDate: startDate,
					endDate: endDate,
					pageNumber:pageNumber,
					pageSize:10
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					uni.hideLoading()
					if(res.code == 200){
						if(res.data.list.length != 0){
							this.dayslist.push(...res.data.list)
						}else{
							this.status = "nomore"
							this.cardShow = true
						}
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			gocard(){
				uni.navigateTo({
					url: '/pages/pagesB/IntegralChange/IntegralChange?title=卡金变动'
				})
			},
			haveCard(){
				this.$request.postGetCardsByMobile({
					mobile:this.$store.state.userInfo.mobile
				}).then(res=>{
					if (res.cards.length == 0) {
						uni.hideLoading()
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
									this.nowcard = this.cardNoList[0]
								}
							})
							this.$request.postGetCardsByYe({
								cardNo:this.nowcard
							}).then(res => {
								this.balanceInfo = res
								let a = new Date()
								a.setTime(a.getTime()-24*3600*1000)
								this.start =a.getFullYear()+"-" + (a.getMonth()+1) + "-" + a.getDate()
								this.end = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
								this.cardbiandong(this.start,this.end,res.cardNo,'1')
							});
						}

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
				this.nowcard = ite
				this.dayslist = []
				uni.showLoading()
				this.$request.postGetCardsByYe({
					cardNo:this.nowcard
				}).then(res => {
					uni.hideLoading()
					this.balanceInfo = res
					this.cardbiandong(this.start,this.end,res.cardNo,'1')
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
	@import "@/static/style/uni.scss";
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
			display: flex;
			justify-content: space-between;
			border-bottom: 1upx solid #e2e2e3;
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
		
		.pop{
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0 auto;
			border-bottom: 1rpx solid #f0f0f0;
		}
		.ye-list {
			width: 100%;
			.detail {
				.detail-row {
					display: flex;
					justify-content: space-between;
					border-bottom: 1upx solid #e2e2e3;
				}
				.detail-row>view {
					padding: 20upx;
				}
			}
		}
		
	}
	
</style>
