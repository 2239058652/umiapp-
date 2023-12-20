<template>
	<view class="da">
		<view>
			      <u-notice-bar :text="text1" fontSize='28' speed="100" bgColor="#ededed" color="#e93423" ></u-notice-bar>
			    </view>
		<view class="top">
			<view>编号/时间</view>
			<view class="top2">
				<view>金额</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="gun">
			<view class="" v-if="list.length>0">
				<view class="box" v-for="(itme,index) in list" :key="index">
					<view class="left">
						<view><text class="biaoji left1">编号:</text>{{itme.prementNo}}</view>
						<view><text class="biaoji left1">时间:</text>{{itme.createDate}}</view>
						<view class="flag ">{{itme.changeMemo}}</view>
					</view>
					<view :class="[itme.changeType=='reduce'?'zeng':'jian','biaoji']">
						<view> <text v-if="itme.changeType=='reduce'">-</text> <text v-else>+</text>{{itme.changeMoney}}
						</view>
					</view>
				</view>
			</view>
			<view v-else style="font-size: 40rpx;text-align:center;margin-top: 200rpx;">暂无数据</view>
		</scroll-view>
		<navigation-ball></navigation-ball>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				text1: '此数据包含冻结、待提现、已提现金额等',
			}
		},
		created() {
			this.getdata()
		},

		onReachBottom() {
			// if(this.pagenum*this.pagesize>=this.total) return uni.$showMsg('数据加载完毕!')
			// this.pagenum+=1
			// this.getGoodsList()//调用函数
		},

		methods: {
			getdata() {
				this.$request.posttixian_list({
					mobile: this.$store.state.userInfo.mobile
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					console.log('记录',res);
					this.list = res.reverse()

				})
			}


		}
	}
</script>

<style>
	.u-icon__icon{
			font-size: 40rpx !important;
		}
	.yhk {
		color: red;
		font-size: 40rpx;
	}

	.gun {
		height: 90vh;
	}

	page {
		background-color: #ededed;
	}

	.box {
		display: flex;
		height: 151rpx;
		justify-content: space-between;
		padding: 20rpx 30rpx 20rpx 30rpx;
		border-bottom: 1px dashed #ccc;
		border-top: 1px dashed #ccc;
		align-items: center;
	}


	.top {
		padding: 40rpx 30rpx 40rpx 30rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px dashed #ccc;
		font-size: 30rpx;
		font-weight: 600;
	}

	.top2 {
		width: 100rpx;
		display: flex;
		justify-content: space-around;

	}

	.da {
		width: 700rpx;
		margin: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.flag {
		width: 545rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.left>view {
		height: 60rpx;
		line-height: 60rpx;
	}

	.biaoji {
		font-weight: 700;

	}

	.zeng {
		color: red;
		/* font-size: 35rpx; */
	}

	.jian {
		color: green;
		/* font-size: 35rpx; */
	}
</style>
