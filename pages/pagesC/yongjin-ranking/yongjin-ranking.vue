<template>
	<view class="box">

		<view class="box-top">

			<view class='box-top-b'>
				<view>
					<view class="title">
						排行榜
					</view>
					<view class="shu ">
						{{pm}}
					</view>
				</view>
				<view>
					<view class="aj paihang aj-paihangbang"></view>
				</view>
			</view>
			<view class="fen">
				<view :class="['dan',{'active':index==biao}]" v-for="(item,index) in gs" :key="index"
					@click="getlist(index)">
					{{item}}
				</view>
			</view>
		</view>
		<view class="" v-if="list.length!=0">

			<scroll-view scroll-y="true" class="box-bottom">
				<view class="item-top">
					<view>排名</view>
					<view>头像</view>
					<view>昵称</view>
					<view>手机号</view>
					<view>邀请人数</view>
				</view>
				<view class="one" v-for="(item,index) in list" v-if="!list.length==0" :key="index">
					<view class="one-item">
						<!-- <view class="item_left">
							<view class="" style="border-radius: 50%;">
								<view v-if="index==0" class="pm">
									<view class="aj yi aj-daochu1024-26"></view>
									<view class="ind">11111112</view>
								</view>
								<view v-if="index==1" class="pm">
									<view class="aj er aj-daochu1024-27"></view>
									<view >{{item.weixinNickName}}</view>
								</view>
								<view v-if="index==2" class="pm">
									<view class="aj san aj-daochu1024-28"></view>
									<view class="ind">{{item.weixinNickName}}</view>
								</view>

								<view v-if="index>2" class="wu">{{item.rank}}</view>
							</view>
							<view class="" style="margin-left: 10rpx;">
								<view class="item1">
									{{item.dtel.substr(0,3)+'****'+item.dtel.substr(7)}}
								</view>
							
							</view>
						</view>
						<view class="item_right">
							<view class="">
								<view class="item2">
									<text style="color: red;font-size: 34rpx;">{{item.number}}</text>
								</view>
							</view>
						</view> -->
					
						<view>{{index+1}}</view>
						<view class="pic">
							<image :src="item.weixinHeadImgurl" mode=""></image>
						</view>
						<view class="name">{{item.weixinNickName||'默认用户看看看看'}}</view>
						<view>{{item.dtel.substr(0,3)+'****'+item.dtel.substr(7)}}</view>
						<view>{{item.number}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="paiming" v-else>排行还是空的哦，快去邀请人吧！</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gs: ['门店排行', '总排行'],
				list: [],
				biao: 0,
				pm: '您的排名不能再低啦'
			}
		},
		onLoad() {
			this.getlist(0)
		},
		methods: {
			getlist(index) {
				uni.showLoading({
					title: '加载中'
				});
				let moblie = this.$store.state.userInfo.mobile
				// let moblie =15617721714
				let _index = index + 1
				this.biao = index
				this.$request.postGetSpreaderRank({
					mobile :moblie,
					timeType: `${_index}`,
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
						uni.hideLoading();
					console.log('排名res',res);
					this.list = res.wxSpreaderVOList.splice(0,4)
					console.log('排行',this.list);
					// let ind = this.list.findIndex((itme, index) => {
					// 	return itme.mobile == moblie
					// })
					if (res.wxSpreader[0].rank >= 0) {
						this.pm = `您是第${res.wxSpreader[0].rank}名`
					} else {
						this.pm = '您的排名不能再低啦'
					}
				})

			},
		}
	}
</script>

<style lang="scss">
	.name{
		width: 125rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.wu {
		width: 70rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;

	}
	.item-top{
		margin:10rpx 0 0 10rpx ;
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 60rpx;
		border-bottom: 1rpx solid #ebebeb;
		color:#b3b3b3;
	}
	.paiming {
		width: 750rpx;
		height: 200rpx;
		font-size: 40rpx;
		color: #8c8c8c;
		text-align: center;
		margin-top: 40rpx;
	}
	.pic>image{
		height: 80rpx;
		width: 80rpx;
		border-radius: 50%;
	}
	.pm {
		position: relative;
	}

	.ind {
		// position: absolute;
		// left: 50%;
		// top: 50%;
	}
	
	.dan {
		height: 60rpx;
		width: 200rpx;
		// background-color:#fff;
		color: #fff;
		margin: 20rpx;
		border: 2px solid #fff;
		margin: 20rpx;
		border-radius: 25px;
		line-height: 60rpx;
	}

	.active {
		color: #e93423;
		background-color: #fff;
	}

	.fen {
		text-align: center;
		display: flex;
		align-items: center;
		width: 750rpx;
		justify-content: center;

	}

	.yi {
		font-size: 70rpx;
		color: #e7c91f;

	}

	.er {
		font-size: 70rpx;
		color: #e9e2c5;
	}

	.san {
		font-size: 70rpx;
		color: #8ae9e3;
	}

	.paihang {
		font-size: 250rpx;
		color: #f0f0f0;
	}

	.quan {
		width: 200rpx;
		height: 70rpx;
		position: absolute;
		background-color: #e93423;
		right: 0;
		color: #fff;
		z-index: 999;
		line-height: 70rpx;
	}

	page {
		background-color: #e8e8e8;
	}

	.item1 {
		height: 50rpx;
	}

	.item2 {
		height: 50rpx;
		width: 200rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.rq {
		position: relative;
		width: 750rpx;
		height: 70rpx;
	}

	.btn {
		height: 100rpx;
		width: 200rpx;
		margin-left: 0rpx;
		border: none;
		position: absolute;
		left: 0;

	}

	.box-top {
		width: 750prx;
		height: 30vh;
		background-color: #e93423;
	}

	.box-top-b {
		width: 600rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}

	.title {
		color: #fff;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.shu {
		font-size: 50rpx;
		color: #fff;
	}

	.box-bottom {
		width: 700rpx;
		margin: 0 auto;
		background-color: #fff;
		height: 82vh;
		// height: 400rpx;

		margin-top: -2vh;
		border-radius: 20px;

	}

	// .scroll{
	// 		width: 700rpx;
	// 		height: 700rpx;
	// }
	.one {
		height: 90rpx;
		margin: 26rpx;
		border-bottom: 1px solid #ccc;

	}

	.one-item {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.item_right,
	.item_left {
		display: flex;
		align-items: center;
	}

	.jiantou {
		margin-left: 20rpx;
	}
</style>
