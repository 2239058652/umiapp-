<template>
	<view class="location">
		<uni-nav-bar fixed="true" leftIcon="back" size="30" statusBar="false" :backgroundColor="bgStyle"
			@clickLeft="black" title="选择门店">
		</uni-nav-bar>
		<view class="zhu" v-for="(item,index) in storeList" :key="index">
			<view class="dan" @click="storeSn(item.storeSn,item.name,item.distance,item.isWeipuShop)">
				<view class="shang">
					<!-- <image class="image" :src="item.image" mode=""></image> -->
					<image class="image" :src="item.image" mode=""></image>
					<view class="top">
						<view>{{item.name}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<text v-if="index==0" class="zuijin">据您最近</text>
				</view>
				<view class="body">
					<view class="left">
						<text class="name">{{item.address}}</text>

					</view>
					<view class="right">
						<view>
							<uni-icons type="paperplane-filled" color="#181615" size="30"
								@click.stop="openmap(item.name,item.address,item.latitude,item.longitude)"></uni-icons>
							<text>导航</text>
						</view>
						<view @click.stop="call(item.storeMobile)">
							<uni-icons type="phone-filled" color="#181615" size="30" />
							</uni-icons>
							<text>电话</text>
						</view>
					</view>

				</view>
				<view class="bottom">
					<!-- <text class="shoujihao" >手机号码:<text style="color: #040404; font-weight: 600;">{{item.storeMobile}}</text></text> -->

					据您<text style="font-size: 30rpx; font-weight: 600;">{{item.distance.toFixed(2)}}km</text>

				</view>
			</view>
		</view>

		<view v-show="show">
			<u-empty mode="permission" iconSize="195px" width="135px" height="135px" textSize="15px"
				text="请开启位置信息,便于为您提供更好的服务哦!"></u-empty>
			<button type="warn" size="mini" open-type="openSetting">去开启</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeList: null, //门店列表
				latitude: null, //经纬度
				longitude: null,
			}
		},
		onShow() {
			uni.getSetting({
				success: (res) => {
					res.authSetting["scope.userLocation"] ? this.$store.dispatch("location", 0) : this.show =
						true
				}
			})
			this.mapContext = uni.createMapContext("map", this);
			uni.$on("Render", this.Render)
		},
		onLoad(option) {
			this.counter = option.counter
		},
		onUnload() {
			uni.$off("Render", this.Render)
		},
		onPullDownRefresh() {
			this.$store.dispatch("location", 0)
		},
		methods: {
			Render() {
				this.storeList = this.$store.state.locateInformation.storeList
				this.latitude = this.storeList[0].latitude
				this.longitude = this.storeList[0].longitude
				this.map()
				uni.stopPullDownRefresh()
			},
			map() {
				this.mapContext.getCenterLocation({
					success(res) {}
				})
				this.mapContext.moveToLocation({
					success(res) {}
				})
			},
			// 更改门店号，门店名称
			storeSn(toreSnId, name, distance, isWeipuShop) {
				if (getApp().globalData.shopNo != toreSnId) {
					getApp().globalData.shopNo = toreSnId,
					uni.setStorageSync('storeName', name)
					console.log('shopnavigation91', name)
					uni.setStorageSync('storeSn', toreSnId)
					uni.setStorageSync('distance', distance)
					uni.setStorageSync('isWeipuShop', isWeipuShop)
					this.$store.commit("setStoreSnName", name)
					getApp().globalData.tabIndex = 0
				}
				this.black()
				if (this.counter != '1') {
					uni.$emit("history")
				}
			},
			// 打开地图
			openmap(...data) {
				if (data[2] == 0 && data[3] == 0) {
					data[3] = 116.38,
					data[2] = 39.90
				}
				uni.openLocation({
					latitude: data[2],
					longitude: data[3],
					name: data[0],
					address: data[1],
				});
			},
			black() {
				// if (this.counter == '1') {
					uni.navigateBack({
						delta: 1
					}) 
				// } else {
					// uni.switchTab({
					// 	url: "/pages/tabbar/index/index"
					// })
					// getApp().globalData.tabIndex = 0
				// }
			},
			// 点击拨打电话
			call(phone) {
				const res = uni.getSystemInfoSync();
				// ios系统默认有个模态框
				if (res.platform == 'ios') {
					uni.makePhoneCall({
						phoneNumber: phone,

						success() {
							console.log('拨打成功了');
						},
						fail() {
							console.log('拨打失败了');
						}
					})
				} else {
					//安卓手机手动设置一个showActionSheet
					uni.showActionSheet({
						itemList: [phone, '呼叫'],
						success: function(res) {
							console.log(res);
							if (res.tapIndex == 1) {
								uni.makePhoneCall({
									phoneNumber: phone,
								})
							}
						}
					})
				}
			}

		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.location {
		>view:last-child {
			margin-top: 30%;
			text-align: center;
		}

		.map {
			width: 100%;
			height: 350rpx;
		}

		.store {
			--size: 10rpx;
			position: relative;
			margin: var(--size) auto;
			border-radius: 20rpx;
			border: 1px solid #b0a0ff;
			width: 95%;

			image {
				width: 15%;
				height: 53px;
				vertical-align: middle;
				margin: var(--size);
			}

			.u-icon {
				@include absolute (10rpx, 600rpx)
			}

			&>view:nth-child(4) {
				text {
					color: red;
				}
			}

			view {
				margin: var(--size);
			}
		}
	}

	.shang {
		display: flex;
		align-items: center;
	}

	.dan {
		width: 700rpx;
		height: 285rpx;
		border: 1px solid #4a16cc;
		margin: 10rpx auto;
		border-radius: 10rpx;
	}

	.top {
		font-size: 30rpx;
		font-weight: 600;
		margin: 15rpx;
		// background: pink;
		width: 250rpx;
		height: 50rpx;
		line-height: 50rpx;
		display: flex;
		justify-content: space-between;

	}


	.top view {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.body {
		display: flex;
	}

	.left {
		width: 500rpx;
		height: 110rpx;
		// border: 1px solid #b0a0ff;
		padding: 20rpx 0 20rpx 20rpx;
		box-sizing: border-box;

	}

	.right {
		height: 110rpx;
		width: 200rpx;
		display: flex;
		justify-content: space-around;
		// flex-direction: column;

		// border: 1px solid red;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// flex-direction: column;
	}

	.right view {
		display: flex;
		// justify-content: center;
		// align-items: center;
		flex-direction: column;
	}

	.name {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; //代表行数
		overflow: hidden;

	}

	.bottom {
		box-sizing: border-box;
		height: 70rpx;
		width: 700rpx;
		padding: 20rpx;
		// border: 1px solid #4a16cc;
	}

	.bottom text {
		margin: 5rpx;
	}

	.bottom text:nth-child(2) {
		background-color: #e2e2e2;
		display: inline-block;

		text-align: center;

		border-radius: 10rpx;
		margin-left: 10rpx;
	}

	.zuijin {
		display: block;
		line-height: 40rpx;
		background-color: #e2e2e2;
		border-radius: 5rpx;
	}

	.shoujihao {
		margin-right: 20rpx;
	}

	.image {
		height: 100rpx;
		width: 100rpx;
		margin-left: 10rpx;
		// border-radius: 20rpx;
		margin-top: 10rpx;
	}
</style>
