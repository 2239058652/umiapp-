<template>
	<view class="cardRecharge">
		<uni-nav-bar fixed="false" statusBar="false" title="查积分" left-icon="back" @clickLeft="jump(1)"></uni-nav-bar>
		
		<view class="ye-list">
			<view class="detail">
				<view class="detail-row">
					<view>手机号</view>
					<view>{{dtel}}</view>
				</view>
				<view class="detail-row">
					<view>积分类型</view>
					<view>新会员</view>
				</view>
				<view class="detail-row">
					<view>总积分</view>
					<view>{{totalPoints}}</view>
				</view>
			</view>
		</view>
		<view>
			<view style="padding:10rpx;text-align:center;background-color: #fff;">积分变动记录<text class="aj aj-jinrujiantou" style="float: right;font-size: 28rpx;" @click="gojf">更多</text></view>
			<view v-if="dayslist.length!=0">
					<view class="billcontent" v-for="(ite,ind) in dayslist" :key="ind">
						<view class="conleft">
							{{ind+1}}
						</view>
						<view class="cont">
							<view>门店名称：{{ite.shopName}}</view>
							<view class="zf">积分变动：{{ite.score}}</view>
							<text>{{ite.date}}</text>
						</view>
						<view class="">
							<text class="conrt">{{ite.type}}</text>
						</view>
					</view>
				</view>
				<u-loadmore v-if="dayslist.length!=0" fontSize="30" color="#000000"
					:loading-text="loadingText" height="35" line :status="status" />
				<view v-if="jfShow" style="margin-top: 20rpx;text-align: center;">暂无积分变动记录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				cardNoList:[],  //卡号
				nowcard:'', //当前绑定卡
				totalPoints:0,  //总积分
				dtel:0,
				page:1,
				dayslist:[],
				status: "loadmore", //加载更多提示文字
				loadingText: "努力加载中，先喝杯茶",
				jfShow:false
			}
		},
		onShow() {
			if(uni.getStorageSync('token') == ''){
				uni.navigateTo({url:"/pages/pagesA/denglu/denglu"})
				return
			}		
		},	
		onLoad() {
			this.start = ''
			this.end = ''
			uni.showLoading()
			// 积分
			this.$request.postGetCardJf({
				mobile:uni.getStorageSync('userInfo').mobile,
			},{
				'Content-type': 'application/x-www-form-urlencoded',
			}).then(res=>{
				if(res.code == 200){
					this.totalPoints = res.data
					this.dtel=uni.getStorageSync('userInfo').mobile
					let a = new Date()
					this.start = `${a.getFullYear()}-${a.getMonth()}-${a.getDate()}`
					this.end = `${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`
					this.jfbiandong(this.start, this.end,'1')
				}
			})
		},
		onReachBottom(){
			this.page+=1
			this.jfbiandong(this.start, this.end,this.page)
		},
		methods: {
			// 没有绑卡
			jump(e){
				uni.navigateBack({delta: 1})
			},
			jfbiandong(startDate, endDate,pageNumber) {
				this.$request.postGetJfChangeDetail({
					mobile: this.$store.state.userInfo.mobile,
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
							this.jfShow = true
						}
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			gojf(){
				uni.navigateTo({
					url: '/pages/pagesB/IntegralChange/IntegralChange?title=积分变动'
				})
			},
		}
		
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
	.cardRecharge{
		
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
		
		
	}
	
</style>
