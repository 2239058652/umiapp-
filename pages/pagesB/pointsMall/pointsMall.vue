<template>
	<view class="pointsMall u-skeleton">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="积分商城" @clickLeft="back"></uni-nav-bar>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<view>
			<!-- 轮播 -->
			<view class="u-skeleton-fillet">
				<u-swiper :list="list1" :indicator="true" indicatorMode="dot" indicatorActiveColor="#ff227a"
					indicatorInactiveColor="#fff" height="315.4" radius="7px 7px 7px 7px" interva="5000" circular="true"
					@click="clickSwiper">
				</u-swiper>
			</view>
			<view class="point u-skeleton-fillet">
				<view class="aj aj-jifen1"><text>{{totalPoints}}</text>积分</view>
				<view @click="choose1" :class="pointitle!='全部积分'?'active aj aj-jiangxu':'aj aj-jiangxu'">{{pointitle}}</view>
				<!-- <view class="aj aj-jilu">兑换记录</view> -->
				<view class="screen"  v-if="show1">
					<view :class="qbshow || pointitle=='全部积分'?'active':''" @click="chooseqb">全部积分</view>
					<view class="choose" v-for="(ite,ind) in jflist" :key="ind">
						<view :class="isClick==ind?'active':''" @click="choosejf(ite,ind)">{{ite.start}}-{{ite.end}}<u-icon name="checkbox-mark" :color="isClick==ind?'red':'#fff'" size="40"></u-icon></view>
					</view>
				</view>
			</view>
			<view class="option u-skeleton-fillet">
				<roll ref="roll" :points='points' :list="cate" @getMessage='getMessage' right="10rpx" left="10rpx" both="0 10rpx"></roll>
			</view>
			<view class="poinb u-skeleton-fillet">
				<view class="pointLayout2 ">
					<view class="poinbcen1" v-for="(item,index) in pointlist" :key="index"
						@click="pointdetails(item.goodsId)">
						<lazy-load :image="item.pic" layoutType="pointLayout2"></lazy-load>
						<view class="title">
							<view>{{item.name}}</view>
							<view>
								<view>{{item.jfprice}}积分<text v-show="item.syMoney != 0">+{{item.syMoney}}现金</text>
								</view>
								<view>兑换</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-empty :show="judge" iconSize="195px" width="135px" height="135px" textSize="22px" textColor="transparent"
				icon="/static/SVG/kong.svg" text="哎呀,商品空空如也"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list1: null,
				cate: [], //选项
				status: "loadmore", //加载更多提示文字
				loadingText: "努力加载中",
				pointlist: [],
				judge: false, //商品为空显示
				totalPoints: 0, //总积分
				loading: true,
				swiperlist: [],
				jflist:[
					{start:'1',end:'999'},
					{start:'1000',end:'2999'},
					{start:'3000',end:'4999'},
					{start:'5000',end:'9999'},
					{start:'10000',end:'19999'},
				],
				show1:false,
				isClick:null,
				pointitle:'全部积分',
				points:'points',
				qbshow:false,
			};
		},
		onLoad() {
			this.jfStart = '1'
			this.jfEnd = '999'
			this.cate = getApp().globalData.classification
			if(this.cate.length>0){
			if(this.cate[0].name != '全部商品'){
				this.cate.unshift({
					name:'全部商品',
					description:'',
					id:null,
				})
			}
			}
			// 积分
			this.$request.postGetCardJf({
				mobile: uni.getStorageSync('userInfo').mobile,
			}, {
				'Content-type': 'application/x-www-form-urlencoded',
			}).then(res => {
				console.log('code',res)
				if (res.code == 200) {
					this.totalPoints = res.data
				}
			})

			// 轮播图
			this.$request.getPointMall({
				shopNo: getApp().globalData.shopNo,
				mobile: this.$store.state.userInfo.mobile,
				page: 1
			}).then(res => {
				this.swiperlist = res.singleCargo
				this.list1 = res.singleCargo.map(item => {
					return item.pic
				})
			})
			this.pointList(null)
		},
		methods: {
			getMessage(msg){
				if(typeof msg == "object"){
					this.pointitle == '全部积分'?this.pointList(msg.id):this.pointList(msg.id,this.jfStart,this.jfEnd)
				}else{
					this.pointitle == '全部积分'?this.pointList(msg):this.pointList(msg,this.jfStart,this.jfEnd)
				}
			},
			pointList(categoryId,startJf,endJf){
				// 商品
				this.$request.getPointGoodsList({
					shopNo: getApp().globalData.shopNo,
					categoryId:categoryId,
					startJf:startJf,
					endJf:endJf,
				}).then(res => {
					this.loading = false
					this.pointlist = res
					this.judge = this.pointlist.length == 0
				})
			},
			back() {
				console.log('点击了返回')
			uni.navigateBack({
				delta: 1
			});
			},
			pointdetails(e) {
				uni.navigateTo({
					url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${e}_${getApp().globalData.shopNo}`
				})
			},
			choose1(){
				this.show1 = !this.show1
			},
			chooseqb(){
				this.pointitle = '全部积分'
				this.isClick = -1
				this.show1 = false
				console.log(this.$refs.roll.cate,typeof this.$refs.roll.cate == "object")
				if(typeof this.$refs.roll.cate == "object"){
					this.pointList(this.$refs.roll.cate.id)
				}else{
					this.pointList(this.$refs.roll.cate)
				}
			},
			choosejf(e,ind){
				this.qbshow = false
				this.jfStart = e.start
				this.jfEnd = e.end
				this.pointitle = e.start+'-'+e.end
				this.isClick = ind
				this.show1 = false
				if(typeof this.$refs.roll.cate == "object"){
					this.pointList(this.$refs.roll.cate.id,this.jfStart,this.jfEnd)
				}else{
					this.pointList(this.$refs.roll.cate,this.jfStart,this.jfEnd)
				}
			},
			clickSwiper(e) {
				uni.navigateTo({
					url: this.swiperlist[e].link,
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.pointsMall {
	.active{
		color: red;
	}
		.screen {
			width: 100%;
			background-color: #fff;
		    z-index: 9;
			position: absolute;
			right:0 ;
			top: 100rpx;
			&>view:first-child{
				padding-left: 20rpx;
			}
			.choose{
				>view{
					padding: 12rpx 20rpx;
					position: relative;
					view{
					    position: absolute;
					    right: 2%;
					    top: 0;
					}
				}
			}

		}

		// background-color: #f7f7f7;
		.aj-jilu:before {
			margin-right: 20rpx;
			color: #0e9544;
			font-size: 40rpx;
		}

		.aj-jifen1:before {
			margin-right: 20rpx;
			color: #0e9544;
			font-size: 40rpx;
		}

		@mixin gong {
			--width: 100%;
			display: flex;
			width: var(--width);
		}

		.option {
			background-color: #ffffff;
			margin-top: 20rpx;
			padding: 10rpx 0;
		}

		&>view {
			width: 95%;
			margin: 0 auto;
			padding-top: 20rpx;

			.point {
				display: flex;
				background-color: #fff;
				margin-top: 20rpx;
				position: relative;
				justify-content: space-around;
				&>view:nth-child(1) {
					height: 100rpx;
					line-height: 100rpx;
					width: 40%;
					font-size: 30rpx;
					border-right: 1rpx solid #eee;
					overflow: hidden;
					text {
						color: #e4615d;
						font-size: 28rpx;
						margin-right: 10rpx;
					}
				}
				&>view:nth-child(2){
					height: 100rpx;
					line-height: 100rpx;
					width: 32%;
					font-size: 29rpx;
					text-align: center;
				}
				// &>view:nth-child(3) {
				// 	height: 100rpx;
				// 	line-height: 100rpx;
				// 	font-size: 30rpx;
				// 	width: 28%;
				// 	// padding-left: 30rpx;
				// }
			}

			.poinb {
				background-color: #fff;
				padding-right: 10rpx 20rpx;
				margin-top: 5rpx;
			}
		}

		.pointLayout1 {
			.poinbcen1 {
				@include gong;
				margin-bottom: 40rpx;

				.title {
					margin-left: 10rpx;

					&>view:nth-child(1) {
						margin-top: 15rpx;
						margin-bottom: 20rpx;
						@include hide();
					}

					&>view:nth-child(2) {
						display: flex;
						flex-wrap: wrap;
						color: #e4615d;
						font-weight: 600;

						view:nth-child(1) {
							margin-right: 10rpx;

							text {
								font-size: 26rpx;
								font-weight: normal;
								margin-bottom: 10rpx;
							}
						}

						view:nth-child(2) {
							width: 70rpx;
							font-size: 20rpx;
							border: 1rpx solid #e4615d;
							border-radius: 35rpx;
							font-weight: normal;
							padding: 5rpx;
							text-align: center;
						}
					}
				}

			}
		}

		.pointLayout2 {
			justify-content: space-between;
			flex-wrap: wrap;
			@include gong;

			.poinbcen1 {
				width: 48%;
				margin-bottom: 40rpx;

				.title {
					&>view:nth-child(1) {
						margin-top: 15rpx;
						margin-bottom: 10rpx;
						@include hide(1)
					}

					&>view:nth-child(2) {
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						color: #e4615d;
						font-weight: 600;

						view:nth-child(1) {
							text {
								font-size: 26rpx;
								font-weight: normal;
							}
						}

						view:nth-child(2) {
							width: 70rpx;
							font-size: 20rpx;
							border: 1rpx solid #e4615d;
							border-radius: 35rpx;
							font-weight: normal;
							padding: 5rpx;
							text-align: center;
						}
					}
				}

			}
		}

		.pointLayout3 {
			@include gong;
			flex-wrap: wrap;

			&>view:nth-child(1),
			&>view:nth-child(2) {
				margin-right: 2%;
			}

			.poinbcen1 {
				width: 32%;
				margin-bottom: 40rpx;

				.title {
					&>view:nth-child(1) {
						margin-top: 15rpx;
						margin-bottom: 10rpx;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					&>view:nth-child(2) {
						color: #e4615d;
						font-weight: 600;

						view:nth-child(1) {
							text {
								font-size: 26rpx;
								font-weight: normal;
							}
						}

						view:nth-child(2) {
							width: 70rpx;
							font-size: 20rpx;
							border: 1rpx solid #e4615d;
							border-radius: 35rpx;
							font-weight: normal;
							padding: 5rpx;
							text-align: center;
						}
					}
				}

			}
		}
	}
</style>
