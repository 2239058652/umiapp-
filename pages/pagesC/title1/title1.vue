<template>
	<view>
		<uni-nav-bar @clickLeft="back" title="美妆专区" fixed="false" statusBar="false" left-icon="back"></uni-nav-bar>
		<view class="title1">
			<!-- 选择 -->
			<view class="option">
				<view :class="[num == index ? 'view' : '']" v-for="(item,index) in option" :key="index"
					@click="num = index">
					{{item}}
					<view></view>
				</view>
			</view>
			<u-swiper :list="adslides" indicator="true" indicatorMode="dot" indicatorActiveColor="#ffffff"
				indicatorInactiveColor="#fae9eb" height="400" width="100%" radius="7px" interva="5000" circular="true"
				@click="jump('#')">
			</u-swiper>
			<view class="three">
				<text><text class="aj aj-anquanbaozhang-xianxing"></text>正品保障</text>
				<text><text class="aj aj-yunshu"></text>支持购物卡</text>
				<text><text class="aj aj-iconhuaban1-06"></text>全国配送</text>
			</view>
			<!-- 选项 -->
			<more-options :list="hotCate"></more-options>
			<!-- 直播 -->
			<image src="../../../static/img/2.jpeg" mode=""></image>
			<view class="heard">
				王牌会场<text>ACE VENUE</text>
			</view>
			<!-- 轮播 -->
			<rotation @gopath="jump" v-if="list1.length!=0" :list1="adslides" :rightAdvert="rightAdvert"></rotation>
			<view class="buy">
				<text></text>
				<text>必买好物</text>
				<text></text>
			</view>
			<slide :list="hotGoods" :judge="false"></slide>
			<view class="heard">
				热门品牌<text>POPULAR BRANDS</text>
			</view>
			<view class="flex" :class="[flex==9 ? 'flexII' : 'flexI']">
				<image src="../../../static/img/1.png" mode="" v-for="(item,index) of flex" :key="index"></image>
			</view>
			<view class="heard">
				品牌精选<text>BRAND SELECTION</text>
			</view>
			<slide :list="hotGoods"></slide>
			<slide :list="hotGoods"></slide>
			<slide :list="hotGoods"></slide>
			<slide :list="hotGoods"></slide>
			<slide :list="hotGoods"></slide>
			<view class="buy">
				<text></text>
				<text class="aj aj-aixin  aj-aixinI">{{text}}</text>
				<text></text>
			</view>
			<!-- 商品列表 -->
			<commodity ref="commodity" :isshow="true"></commodity>
			<!-- 返回顶部 -->
			<u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				option: ["国际美妆", "大众美妆"], //选项列表
				num: 0, //默认选中1
				adslides: [], //轮播
				hotCate: [],
				hotGoods: [], //商品
				rightAdvert: null, //轮播右侧数据
				text: "  猜你喜欢  ", //不可删除多余空格
				flex: 15, //控制热品牌布局方式
			};
		},
		onLoad() {
			uni.$u.http.get(this.$request.getIndex, {
				params: {
					shopNo: getApp().globalData.shopNo,
					mobile: this.$store.state.userInfo.mobile,
					page: 1
				}
			}).then(res => {
				this.adslides = res.adslides.map(item => {
					return item.pic
				})
				this.hotCate = res.hotCate.splice(0, 8)
				this.hotGoods = res.hotGoods
				this.rightAdvert = res.rightAdvert
			})
		},
		created() {
			this.page = 0 //上拉加载页码
		},
		onReachBottom() {
			this.page += 1
			this.$refs.commodity.getHotGoods({
				cate: this.$refs.commodity.cate || this.hotCate[0].id,
				page: this.page,
				shopNo: getApp().globalData.shopNo
			}, "more")
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.title1 {
		@include chamfer(25rpx) .option {
			display: flex;
			flex-flow: row nowrap;
			font-size: 32rpx;

			view:first-of-type {
				margin-right: 75rpx;
			}

			view {
				text-align: center;
				color: #000000;
				background: #f5f5f5;

				view {
					background: #f5f5f5;
					margin: 20rpx 0 0 50rpx;
					height: 5rpx;
					width: 30%;
				}
			}

			.view {
				color: #fe473c;

				view {
					background: #fe473c;
				}
			}
		}

		>.u-swiper {
			margin: 20rpx 0 25rpx 0;
		}

		.three {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-around;
			margin: 20rpx 0 20rpx 0;
			color: #eedfcf;

			text {
				white-space: pre;
			}

			.aj {
				font-size: 42rpx;
			}

			.aj-iconhuaban1-06:before {
				font-size: 42rpx !important;
			}
		}
	
	>image {
			margin-top: 20rpx;
			width: 99%;
			height: 150rpx;
			border-radius: 100rpx;
		}

		.heard {
			@include chamfer;
			height: 60rpx;
			color: #000000;
			font-size: 50rpx;
			background: #fff;

			text {
				margin-left: 15rpx;
				font-size: 20rpx;
				color: #b5b5b5;
			}
		}

		.buy {
			$colour: #e4c998;
			@include chamfer;
			color: $colour;
			@include flex(row wrap, center) height: 80rpx;
			line-height: 80rpx;

			&>text:nth-child(1),
			&>text:nth-child(3) {
				display: inline-block;
				width: 60rpx;
				height: 5rpx;
				background: $colour;
				margin-top: 40rpx;
			}

			&>text:nth-child(2) {
				margin: 0 -44%;
				width: 238rpx;
				height: 50rpx;
				text-align: center;
				white-space: pre;
			}
		}

		.flex {
			@include flex(row wrap, space-between)
		}

		.flexI {
			height: 320rpx;

			image {
				@include image (17%, 23%, 0)
			}
		}

		.flexII {
			height: 650rpx;

			image {
				@include image (30%, 212rpx, 0)
			}
		}
	}
</style>
