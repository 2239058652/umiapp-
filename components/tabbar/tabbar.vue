<template>
	<view class="tab-bar">
		<u-tabbar :value="value"
	@change="changeTabs" :border="false" :fixed="true" :placeholder="true"
			:safeAreaInsetBottom="true" activeColor="#f04b38" inactiveColor="#000">
			<u-tabbar-item :text="item.text" v-for="(item,index) in tabBars" :key="index" @click="chooseTab(item)">
				<image class="u-page__item__slot-icon" slot="active-icon" :src="item.selectedIconPath"></image>
				<image class="u-page__item__slot-icon" slot="inactive-icon" :src="item.iconPath"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import {wxUrl,corpId} from '@/config/baseUrl.js'
export default {
	props: {
		// 当前页面路径
		routePath: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			tabBars:uni.getStorageSync('tabbar'),
			value:null,
		};
	},
	mounted() {
		let pages = getCurrentPages()
		if(pages[pages.length-1].route == 'pages/tabbar/supermarket/supermarket'){
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='超市'){getApp().globalData.tabIndex= index}
			})
		}else if(pages[pages.length-1].route == 'pages/tabbar/classificats/classificats'){
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='分类'){getApp().globalData.tabIndex= index}
			})
		}else if(pages[pages.length-1].route == 'pages/tabbar/index/index'){
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='首页'){getApp().globalData.tabIndex= index}
			})
		}else if(pages[pages.length-1].route == 'pages/tabbar/my/my'){
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='我的'){getApp().globalData.tabIndex= index}
			})
		}else if(pages[pages.length-1].route == 'pages/tabbar/shoppingCart/shoppingCart'){
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='购物车'){getApp().globalData.tabIndex= index}
			})
		}else{
			uni.getStorageSync('tabbar').forEach((item,index) => {
				if(item.text=='客服'){getApp().globalData.tabIndex= index}
			})
		}
		this.value = getApp().globalData.tabIndex
	},
	methods: {
		chooseTab(item){
			if(item.pagePath.slice(7,13) == 'tabbar' && item.pagePath!="/pages/tabbar/classificats/classificats"){
				uni.switchTab({
					url: item.pagePath,
					fail(res){
						// console.log(res)
					}
				});
			}else{
				if(item.text=='客服'){
					uni.openCustomerServiceChat({
						extInfo: {
							url: wxUrl
						},
						corpId: corpId,
						success(res) {},
						fail(err) {
							console.error(err)
							uni.showToast({
								title: JSON.stringify(err),
								icon: 'none',
								duration: 2000
							});
							return
						}
					})
					return
				}
				uni.navigateTo({
					url: item.pagePath,
					fail(res){
					}
				})
			}
		},
		changeTabs(e){
			getApp().globalData.tabIndex = e
		}
	}
};
</script>

<style lang="scss">
.tab-bar {
	
}
</style>

