<template>
	<view class="rotation" v-show="rightAdvert.length != 0">
		<u-swiper
			:list="list1"
			:indicator="true"
			indicatorMode="dot"
			indicatorActiveColor="#ff227a"
			indicatorInactiveColor="#fff"
			height="510rpx"
			width="50%"
			radius="7px 0px 0px 7px"
			interva="5000"
			circular="true"
			keyName="pic"
			@click="gotheme"
		></u-swiper>
		<view>
			<view class="right" v-for="(item, index) in rightAdvert" :key="index" @click="gotheme1(index)">
				<image :src="item.pic" mode="aspectFill"></image>
				<text>{{ item.title }}</text>
				<text>{{ item.remark }}</text>
			</view>
		</view>
	</view>
</template>
<script>
import { log } from 'util';
export default {
	name: 'rotation',
	props: {
		list1: {
			//全额消费红包等轮播
			type: Array,
			default() {
				return [];
			}
		},
		rightAdvert: {
			//主页大牌洗护等三个数据
			type: Array,
			default() {
				return [];
			}
		}
	},

	methods: {
		gotheme(id) {
			console.log(id);
			// console.log(this.rightAdvert);
			// console.log(id, this.list1, this.list1[id], this.list1[id].id);
			uni.navigateTo({ url: `/pages/pagesA/theme/theme?id=${this.list1[id].id}` });
		},

		gotheme1(id) {
			uni.navigateTo({ url: `/pages/pagesA/theme/theme?id=${this.rightAdvert[id].id}` });
		}
	}
};
</script>

<style lang="scss">
.rotation {
	display: flex;
	margin: 20rpx auto;
	& > view:nth-child(2) {
		display: flex;
		flex-direction: column;
		width: 50%;
		height: 510rpx;
		background: #fff;
		border: {
			top-right-radius: 14rpx;
			bottom-right-radius: 14rpx;
		}
	}
	.right {
		position: relative;
		margin: 10rpx;
		height: 167rpx;
		image {
			width: 150rpx;
			height: 150rpx;
			vertical-align: top;
			border-radius: 20rpx;
			margin-right: 10rpx;
		}
		& > text:nth-child(2) {
			font-size: 35rpx;
		}
		& > text:nth-child(3) {
			position: absolute;
			top: 50rpx;
			left: 160rpx;
			font-size: 22rpx;
			color: grey;
			font-family: '宋体';
		}
	}
}
</style>
