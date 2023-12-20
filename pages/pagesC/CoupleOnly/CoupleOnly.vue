<template>
	<view class="theme u-skeleton">
		<uni-nav-bar @clickLeft="back" leftWidth="120px" fixed="false" statusBar="false" :leftText="themeStyle.name"
			left-icon="back"></uni-nav-bar>
		<!-- <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton> -->
<!-- 		<view v-if="classification.length">
			<image :src="themeStyle.pic" mode='widthFix' class="u-skeleton-fillet theme-image"
				v-if="Object.keys(themeStyle).length != 0"></image> -->
			<!-- 商品列表 -->
			<view v-for="(item, i) in menuList" :key="i">
				<commodity :show="true" v-if="menuList.length != 0" :themeLayout="themeStyle.layoutType"
					:titleName="item.titleName" :detailed="item.detailed" :shopList="item.shopList" :yongchu1="1"
					></commodity>
			</view>
			<!-- <commodity ref="commodity" :classification="classification"></commodity> -->
		</view>
	<!-- 	<view class="kong" v-else>该门店下暂无此类商品~</view>
		<view class="kong" v-else><image src="https://newb.wp99.cn/group1/M00/01/CD/rBJVXGPzPHyAfdkUAAGTgKmYMBs469.jpg"></image></view>
		<view v-else>
			<u-empty mode="data" textSize="50" iconSize="400" width="200" height="200">
			</u-empty>
		</view> -->
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
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
				xinrenlist:[]
			};
		},
		onLoad(data) {
			var pages = getCurrentPages()
			if (pages[0].route == 'pages/tabbar/index/index') {
				this.classification = getApp().globalData.classification
				this._shopNo = uni.getStorageSync('storeSn')
			} else {
				this.classification = getApp().globalData.cs_classification
				this._shopNo = uni.getStorageSync('cs_num')
			}
			this.page = 1; //上拉加载页码
				this.$request.getnewMemberGoods({
					page:this.page,
					shopNo: getApp().globalData.shopNo||uni.getStorageSync('storeSn'),
					tenantId: 39602
				}).then(res=>{
					let obj = {
						color: "#000000",
						detailed: "新人专享",
						image: "",
						shopList: res,
						titleName: "新人专享",
						type: "",
					}
					let obj2 = {
						bgStyle: "",
						layoutType: "",
						name: "",
						pic: "",
						yongchu:1
					}
					this.loading = false;
					this.menuList.push(obj)
					this.themeStyle = obj2
				})
		},
		methods: {
			getHotGoods(cate, page) {
				this.$refs.commodity.getHotGoods({
						cate,
						page,
						shopNo: this._shopNo
					},
					'more'
				);
			},
			getxirnen(page){
				this.$request.getnewMemberGoods({
					page:page,
				}).then(res=>{
				this.menuList[0].shopList.push(...res)
					if(res.length<12){
						uni.showToast({
							title: '都到底了，就下个单呗',
							duration: 800,
							icon:'none'
						});
					}
				})
			}
		},
		onReachBottom() {
			this.page+=1
			this.getxirnen(this.page)
			// this.getHotGoods(this.$refs.commodity.$refs.roll.cate, (this.page += 1));
			
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

	.theme-image {
		width: 100%;
	}
</style>
