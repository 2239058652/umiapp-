<template>
	<view class="theme u-skeleton">
		<uni-nav-bar @clickLeft="back" leftWidth="120px" fixed="false" statusBar="false" :leftText="themeStyle.name"
			left-icon="back"></uni-nav-bar>
		<!-- <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton> -->
		<view v-if="menuList[0].shopList.length">
			<image :src="themeStyle.pic" mode="widthFix" style="width: 100%;" class="u-skeleton-fillet theme-image"
				v-if="Object.keys(themeStyle).length != 0"></image>
			<!-- 商品列表 -->
			<view v-for="(item, i) in menuList" :key="i">
				<commodity :show="true" v-if="menuList.length != 0" :themeLayout="themeStyle.layoutType"
					:titleName="item.titleName" :detailed="item.detailed" :shopList="item.shopList"
					:ishongbao="this.ishongbao"></commodity>
			</view>
			<!-- <commodity ref="commodity" :classification="classification"></commodity> -->
		</view>
		<view class="kong" v-else>该门店下暂无此类商品~</view>
	<!-- 	<view class="kong" v-else><image src="https://newb.wp99.cn/group1/M00/01/CD/rBJVXGPzPHyAfdkUAAGTgKmYMBs469.jpg"></image></view> -->
		<!-- <view v-else>
			<u-empty mode="data" textSize="50" iconSize="400" width="200" height="200">
			</u-empty>
		</view> -->
	</view>
</template>
<script>
	import mixin from '@/mixins/mixin.js';
	import {
		log
	} from 'util';
	export default {
		mixins: [mixin],
		data() {
			return {
				classification: [], //商品分类
				menuList: [],
				themeStyle: {},
				a: null,
				loading: true, //控制骨架屏是否显示
				ishongbao: '',
				_shopNo: '',
				// classification:getApp().globalData.classification
			};
		},
		onLoad(data) {
			var pages = getCurrentPages()
			// if(pages[0].route == 'pages/tabbar/index/index'){
			// this.classification = getApp().globalData.classification
			this._shopNo = uni.getStorageSync('storeSn')
			// }else{
			// 	this.classification  = getApp().globalData.cs_classification
			// 	this._shopNo = uni.getStorageSync('cs_num')
			// }

			// this.classification  = getApp().globalData.classification
			// if()
			this.page = 1; //上拉加载页码
			this.$request
				.postQuerySecondMenuList({
					shopNo:data.shopNo,
					carouselId: data.id
				})
				.then(res => {
					// if(res.menuList&&res.menuList.length>0){


					// uni.setStorageSync('ishongbao', res.menuList[0].type);
					// this.ishongbao = res.menuList[0].type;
					this.menuList = res.menuList;
					this.themeStyle = res.themeStyle;
					// if (this.classification.length > 0) {

					// 	(this.menuList.length == 0 || this.menuList.reduce((all, item) => all + item.shopList.length,
					// 		0) <= 4) && this.getHotGoods(this.classification[0].id, this.page),
					// 		(this.$refs.commodity.$refs.roll.cate = this.classification[0].id);
					// }
					this.loading = false;
					// }else{
					// 	// console.l
					// }
				});
		},
		methods: {
			getHotGoods(cate, page) {
				this.$refs.commodity.getHotGoods({
						cate,
						page,
						// shopNo: getApp().globalData.shopNo
						shopNo: this._shopNo
					},
					'more'
				);
			}
		},
		onReachBottom() {
			this.getHotGoods(this.$refs.commodity.$refs.roll.cate, (this.page += 1));
		}
	};
</script>

<style lang="scss">
	@import '@/static/style/uni.scss';

	.theme {
		@include chamfer(0px) &>image {
			width: 100%;
			height: 316rpx;
			border-radius: 30rpx;
		}
	}

	.kong {
		margin-top: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #a2a2a2;
	}
</style>
