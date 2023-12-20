<template>
	<view class="address">
		<uni-nav-bar @clickLeft="back" fixed="false" statusBar="false" title="地址" left-icon="back"></uni-nav-bar>
		<view>
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="options1" v-for="(item, index) in list" :key="index"
					@click="del(item.id)">
					<view @click.stop="choose(item)" class="body">
						<view> 
							<text>{{ item.name }}</text>
							<text>{{ item.mobile }}</text>
							<text v-show="item.isDefault==1">默认地址</text>
							<text class="aj aj-xiugaioryijian" @click.stop="jump(item)"></text> 
						</view>
						<view>{{item.areaPathName}}{{item.address}}</view>
					</view> 
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<!-- 地址为空 -->
		<u-empty mode="address" v-if="list.length == 0" text="点击添加地址" @jump="jump(0)" textSize="30" iconSize="220"
			marginTop="80% 0"></u-empty>
		<view v-else><button size="default" type="primary" @click="jump(0)">添加收货地址</button></view>
	</view>
</template>
<style lang="scss">
	@import "@/static/style/uni.scss";
	.address {
		$bj: #fff;
		>view:nth-child(2) {
			margin-bottom: 130rpx;
			.body {
				padding: 20rpx;
				background-color: $bj;
				position: relative;

				.aj-xiugaioryijian::after {
					@include absolute(45rpx, 90%)
				}

				view {
					>text:nth-child(1) {
						font: {
							size: 35rpx;
							weight: 900
						}
					}

					>text:nth-child(2) {
						margin: 0 20rpx;
						font-size: 23rpx;
						color: #999;
					}

					>text:nth-child(3) {
						color: red;
						border: 2rpx solid red;
						border-radius: 10rpx;
						font-size: 25rpx;
						padding: 5rpx;
					}
				}

				>view:nth-child(2) {
					width: 90%;
					margin-top: 15rpx;
					font-size: 28rpx;
					@include hide
				}
			}

		}

		>view:last-child {
			position: fixed;
			bottom: 0;
			z-index: 10;
			box-sizing: border-box;
			width: 100%;
			background: $bj;
			padding: 10rpx 15rpx 20rpx 15rpx;
		}
	}
</style>
<script>
	import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action"
	import uniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item"
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		onLoad(e) {
			if(e.id!=''){
				uni.showToast({
					title: e.id,
					duration: 2000
				});
			}
		},
		data() {
			return {
				list: null,
				isClose: null,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: "red"
					}
				}]
			};
		},
		onShow() {
			if (uni.getStorageSync('token') == '' || this.$store.state.userInfo.mobile == undefined) {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.postList2()
		},
		methods: {
			postList2() {
				this.$request.postList2({
					mobile: this.$store.state.userInfo.mobile
				}, {
					'content-type': 'application/x-www-form-urlencoded'
				}, ).then(res => {
					if (res.code == 200) {
						this.list = res.data
						if (res.data.length != 0) {
							let {
								name,
								mobile,
								id,
								areaPathName,
								address,
								isDefault
							} = res.data[0]
							this.dizhi = [id, false, name, mobile, areaPathName, address, isDefault]
						}
					} else {
						this.list = []
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}

				})
			},
			back() {
				uni.$emit("changePeisong", {
					data: this.list.length == 0 ? [0, true] : this.dizhi
				})
				uni.navigateBack({
					delta: 1
				})
			},
			choose(data) {
				let eventChannel = this.getOpenerEventChannel()
				eventChannel.emit("changeaddress", data);
				uni.navigateBack({
					delta: 1
				})
			},
			jump(data) {
				let _this = this
				uni.navigateTo({
					url: `/pages/pagesA/newAddress/newAddress?data=${JSON.stringify(data)}`,
					events: {
						postList2: _this.postList2
					}
				})
			},
			showToast(data) {
				uni.showToast({
					title: data,
					icon: "none",
					duration: 2000
				})
			},
			del(res) {
				this.$request.postDelete2({
					receiverId: res
				}, {
					'content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					res.code == 200 ? (this.showToast('删除成功'), this.postList2()) : this.showToast('删除失败')
				})
			}
		}
	}
</script>
