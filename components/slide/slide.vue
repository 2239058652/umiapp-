<template>
	<view class="slider">
		<view v-show="judge" @click="goSpecialarea(list.storeSn)">
			<image v-if='list.bgImage!=""' :src="list.bgImage" mode=""></image>
			<view v-else>{{ list.name }}</view>
			
			<text class="fenlei">
				<!-- {{ list.detailed }}
				 -->
				 进入店铺
				<text class="aj aj-jinrujiantou" style="font-size: 25rpx;"></text>
			</text>
			<!-- <view>立即购买</view> -->
		</view>
		<view v-show="judge1"><image :src="image" mode=""></image></view>
		<scroll-view scroll-x="true" @click="scroll" >
			<view class="view" v-for="(item, index) of list.goodList" :key="index">
				<image :src="item.image == '' ? jia_image : item.image" mode="" @click="godetail(`${item.goodsId}_${item.shopNo}`)"></image>
				<!-- <image :src="jia_image" mode="" @click="godetail(`${item.goodsId}_${item.shopNo}`)"></image> -->
				<view class="shop_name">{{ item.name }}</view>
				<view>
					<text>￥{{ item.price }}</text>
					<text class="aj aj-jiahao" @click="addshop(item.goodsId, item.id, item.price, item.shopNo)"></text>
				</view>
			</view>
			<view class="view" @click="goSpecialarea(list.storeSn)">
				<!-- 	<view>查看更多<text class="aj aj-jinrujiantou" style="font-size: 34rpx;"></text></view> -->
				<view></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'slider',
	props: {
		list: {
			type: Object
		},
		judge: {
			//判断是否显示大图，默认显示
			type: Boolean,
			default: true
		},
		judge1: {
			type: Boolean,
			default: false
		},
		image: {
			type: String
		}
	},
	data() {
		return {
			shopNo: getApp().globalData.shopNo,
			count: 0,
			jia_image: 'https://newb.wp99.cn/group1/M00/01/CD/rBJVXGPzPHyAfdkUAAGTgKmYMBs469.jpg'
		};
	},
	methods: {
		goSpecialarea(shopNo) {
			let zg = true;
			uni.navigateTo({
				url: `/pages/pagesC/advertisement2/advertisement2?shopNo=${shopNo}&zg=${zg}`
			});
		},
		godetail(id) {
			uni.navigateTo({
				url: `/pages/pagesA/goodsDetails/goodsDetails?id=${id}`
			});
		},
		// 添加购物车
		addshop(goodsId, ids, prics, shopNo) {
			// console.log(goodsId);
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: '/pages/pagesA/denglu/denglu'
				});
				return;
			}
			this.count = 1;
			this.$request
				.getAddCartItem({
					goodsId: goodsId,
					quantity: this.count,
					shopId: shopNo,
					mobile: this.$store.state.userInfo.mobile,
					price: prics
				})
				.then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: '售空了！等等再来看看~',
							icon: 'none',
							duration: 2000
						});
					} else {
						getApp().globalData.increment = 2;
						this.$emit('goodsNum', this.count);
						uni.showToast({
							title: '添加购物车成功',
							icon: 'none',
							duration: 2000
						});
					}
				});
		},
		scroll() {}
	}
};
</script>

<style lang="scss">
@import '@/static/style/uni.scss';

.slider {
	padding-bottom: 10rpx;

	> view:first-child {
		margin-bottom: 20rpx;
		position: relative;
		background: linear-gradient(90deg, #3bc3d3 40%, #d5eff0 100%);
		border-radius: 75rpx 75rpx 0 0;
		width: 100%;
		height: 150rpx;
		text-align: center;
		overflow: auto;
		margin-bottom: 20rpx;

		image {
			width: 100%;
			height: 150rpx;
			left: 0;
			position: absolute;
			z-index: 0;
		}

		& > view {
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.fenlei {
			@include absolute(35%, 75%) color: #fff;
			background: #464241;
			border-radius: 50rpx;
			padding: 10rpx 15rpx;
			font-size: 25rpx;
		}
	}

	> view:nth-child(2) {
		margin-bottom: 20rpx;
		border-radius: 30rpx;

		image {
			width: 100%;
			margin: 0 auto;
			display: block;
			border-radius: 30rpx;
		}
	}

	scroll-view {
		white-space: nowrap;
		width: 100%;

		.view:last-child {
			margin-right: 0;

			> view:first-child {
				width: 100%;
				height: 302rpx;
				line-height: 302rpx;
				text-align: center;
			}
		}

		.view {
			display: inline-block;
			margin-right: 10rpx;
			width: 30%;

			& > view:nth-child(2) {
				@include hide;
			}

			& > view:nth-child(3) {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
				color: #f7463b;
			}
		}

		image {
			@include image(100%, 212rpx, 15rpx);
		}
	}
}
.slider scroll-view .view > view:nth-child(2) {
	display: block;
}
// .shop_name{
// 	width: 200rpx;
// 	background-color: pink;
// 	white-space: nowrap;
// 	overflow: hidden;
// 	text-overflow: ellipsis;

// }
</style>
