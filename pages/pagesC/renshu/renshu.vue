<template>
	<view>
		<view class="top">
			<view class="status_bar">
				<!-- 这里是状态栏 -->

			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco" style="color: #fff;">推广人数排行</view>
			</view>
			<view class="dao">
				<view v-for="(item,index) in bang" :key="item.dtel" @click="addClass(index)"
					v-bind:class="{ active:index==current}">
					{{item}}
				</view>
				<!-- <view>月榜</view> -->
			</view>
			<view class="santu">
				<view class="huangguan">
					<view class="huang_1">
						<image class="yi huang" :src="hg2" alt="">
					</view>
					<view class="">
						<image class="yi huang" :src="hg1" alt="">
					</view>
					<view class="">
						<image class="yi huang" :src="hg3" alt="">
					</view>
				</view>
				<div class="da_box">
					<view class="er_box" v-for="list1 in list" :key="index">

						<image class="er" :src="list1.weixinHeadImgurl"></image>
						<view class="diyi" v-if="list1.number">{{list1.weixinNickName||moren_name}}</view>
						<view class="diyi" v-else>虚位以待</view>
						<view class="diyi" v-if="list1.number">{{list1.number}}人</view>
						<view class="diyi" v-else>暂无</view>
					</view>
				</div>
			</view>
		</view>
		<view class="box">
			<view class="dan" v-for="(item,index) in list2" :key="index">
				<view class="ke_left">
					<view>
						<view style="width: 30rpx;">
							{{item.rank}}
						</view>
						<image class="tx" :src="item.weixinHeadImgurl" mode=""></image>
					</view>
					<view class="">
						<view class="" style="">
							{{item.weixinNickName||moren_name}}
						</view>
					</view>
				</view>
				<view class="ke_right" style="color: #e93423;">
					{{item.number}}人
				</view>
			</view>

			<!-- <button @click="go()">点击</button> -->
		</view>
		<view class="daohang" @click="qiehuan_flag()">
			<u-icon v-if="!flag" name="arrow-left" color="#fff" size="45"></u-icon>
			<u-icon v-else name="arrow-right" color="#fff" size="45"></u-icon>

		</view>
		<view class="hutuis" v-if="flag">
			<u-icon name="home" @click="go_home()" color="#fff" size="45"></u-icon>
			<u-icon name="shopping-cart" @click="go_cart()" color="#fff" size="45"></u-icon>
			<u-icon @click="go_mine()" name="man-add" color="#fff" size="45"></u-icon>
		</view>
	</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				hg1: 'https://byoss.wp99.cn/mall/01/CD/rBJVXGPzO1OASuvZAAJp5StOTxQ213.png',
				hg2: 'https://byoss.wp99.cn/mall/01/CD/rBJVXGPzO7WAAm_RAAJlOCr6czs260.png',
				hg3: 'https://byoss.wp99.cn/mall/01/CD/rBJVXGPzPEiAcae5AAJv8W3u4g8292.png',
				flag: false,
				bang: ['月排行', '总排行'],
				current: 0,
				// 上数组1
				list1: [],
				// 上数组2
				list: [],
				// 主体box
				list2: [],
				// 全部
				arr: [],

				moren_name: '默认用户',
				_index: ''
			}
		},
		onLoad() {
			this.getlist(0)
		},
		methods: {
			// 点击切换flag
			qiehuan_flag() {
				setTimeout(() => {
					this.flag = !this.flag
				}, 200)
			},
			go_home() {
				uni.switchTab({
					url: '../../../pages/tabbar/index/index'
				});
			},
			go_cart() {
				uni.switchTab({
					url: '../../../pages/tabbar/shoppingCart/shoppingCart'
				});
			},
			go_mine() {
				uni.switchTab({
					url: '../../../pages/tabbar/my/my'
				});
			},
			// 点击返回上一级
			go() {
				uni.navigateBack({
					delta: 1

					// url: '../index/index'
				});
			},
			addClass: function(index) {
				this.current = index;
				// console.log(index);
				this.getlist(index)
			},
			getlist(index) {
				this.arr = []
				this.arr2 = []
				let moblie = this.$store.state.userInfo.mobile
				// let moblie =15617721714

				if (index == 0) {
					this._index = 2
				} else {
					this._index = ''
				}

				this.biao = index
				this.$request.postHHRpaihang({
					timeType: this._index,
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					// this.list = res

					// // 数组1
					// this.list1= res.slice(0,3)
					// this.list2= res.slice(3)
					// // 数组2
					// this.arr.push(this.list1[1])
					// this.arr.push(this.list1[0])
					// this.arr.push(this.list1[2])

					// this.list = this.arr
					this.arr = []
					this.list = []
					var a1 = []
					var a2 = []
					this.list1 = []
					this.list2 = []
					this.arr = []
					var a1 = res
					var a2 = res


					// 数组1
					this.list1 = a1.slice(0, 3)
					this.list2 = a2.slice(3)
					// 数组2
					if (this.list1.length == 1) {
						this.arr.push({
							cardNo: "",
							dtel: "",
							memberId: "",
							number: 0,
							rank: 0,
							regdate: "",
							spreaderId: "",
							weixinHeadImgurl: "",
							weixinNickName: "",
						})
						this.arr.push(this.list1[0])
						this.arr.push(this.list1[2])
					} else {
						this.arr.push(this.list1[1])
						this.arr.push(this.list1[0])
						this.arr.push(this.list1[2])
					}
					this.list = this.arr

				})

			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.huangguan {
		display: block;
	}

	.huangguan {
		display: flex;
		justify-content: space-around;

	}

	.tx {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-left: 30rpx;
	}

	.huangguan image {
		height: 120rpx;
		width: 120rpx;
		border-radius: 50%;
	}

	// .santu {
	// 	display: flex;
	// 	justify-content: space-around;
	// }

	// .santu view {
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;

	// }

	.head {
		/* width: 100rpx; */
		height: 80rpx;
		background-color: #e93423;
		line-height: 80rpx;
		color: #fff;
		padding-left: 20rpx;
	}

	.top {
		width: 750rpx;
		height: 620rpx;
		background-color: #e93423;
	}

	.dao {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		border-radius: 25%;
	}

	.dao view {
		padding: 15rpx;
		background-color: #e93423;
		color: #fff;
		border: 1px solid #fff;
		margin-bottom: rpx;

	}

	.dao view:nth-child(1) {
		border-radius: 25px 0 0 25px;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}

	.dao view:nth-child(2) {
		border-radius: 0px 25px 25px 0;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}

	// .santu image {
	// 	width: 120rpx;
	// 	height: 120rpx;
	// 	border-radius: 50%;
	// 	// position: relative;
	// }

	// .santu view {
	// 	// text-align: center;
	// 	margin: 0 auto;
	// 	// display: flex;
	// 	flex-direction: column;
	// 	// align-items: center;
	// 	color: #fff;
	// 	position: relative;
	// }


	.santu .tu2 {
		width: 150rpx;
		height: 150rpx;
		border: 6rpx solid #f6bc3a;

	}

	.diyi {
		margin-top: 4rpx;
		width: 120rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #fff;
		// text-align: left;
	}

	.san {
		border: 6rpx solid #fd7b01;

	}

	.er {
		border: 6rpx solid #989898;
	}

	.santu .yin {
		width: 100rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}

	.da_box {
		display: flex;
		justify-content: space-around;
	}

	.da_box view:nth-child(1) image {
		border: 3px solid #989898;
		// margin-top: 10rpx;
	}

	.da_box view:nth-child(2) image {
		border: 3px solid #f6bc3a;
		width: 150rpx;
		height: 150rpx;
		margin-top: -40rpx;
	}

	.da_box view:nth-child(3) image {
		border: 3px solid #fd7b01;
		// margin-top: 10rpx;
	}

	.huangguan view:nth-child(1) image {
		margin-top: 30rpx;
	}

	.huangguan view:nth-child(3) image {
		margin-top: 30rpx;
	}

	// .huangguan image:nth-child(1){
	// 	margin-top: 20rpx;
	// }
	.er_box {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.er_box image {
		border-radius: 50%;
		width: 130rpx;
		height: 130rpx;
		margin-top: -15rpx;
		margin-left: -3rpx;
	}

	// .yichu {
	// 	overflow: hidden;
	// 	white-space: nowrap;
	// 	text-overflow: ellipsis;
	// }

	.san_box {
		top: 30rpx;
	}

	.huang {
		// margin-left: -10rpx;
	}

	.box {
		// height: 400rpx;
		width: 700rpx;
		margin: 0 auto;
		background-color: #fff;
		margin-top: -20rpx;
		border-radius: 20rpx;
	}

	.tou {
		height: 70rpx;
		width: 70rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.dan {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.ke_left {
		display: flex;
		width: 400rpx;
		justify-content: space-between;
	}

	.ke_left view {
		display: flex;
		justify-content: space-between;
		align-items: center;

	}

	.daohang {
		width: 80rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 50%;
		position: fixed;
		right: 20rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hutuis {
		width: 242rpx;
		height: 80rpx;
		background-color: #e93423;
		border-radius: 25px;
		position: fixed;
		right: 117rpx;
		bottom: 150rpx;
		display: flex;
		justify-content: space-around;
	}

	.status_bar {
		height: 75rpx;
		width: 100%;
	}

	.toubu {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		margin-bottom: 10rpx;
	}

	.inco {
		margin: 0 20rpx 0 20rpx;
	}

	.dao .active {
		background-color: #fff;
		color: #e93423;

	}
</style>
