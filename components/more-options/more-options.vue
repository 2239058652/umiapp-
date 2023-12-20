<template>
	  <u-scroll-list class="u-scroll-list" :indicator="judge" indicatorActiveColor="#000000"  indicatorColor="#ffa2f8"
		 indicatorWidth=100 indicatorBarWidth=50>
			<view class="outside" v-if="list.length>=8">
				<view class="within" v-for="(items,index) in lists" :key="index">
					<view class="individual" :style="{width}" v-for="(item,i) in items" :key="i">
					 	<image  @click.stop="jump(item.url,item.id,item.index,item.name||item.title)" v-if="item.imgPath || item.pic" :src="item.imgPath || item.pic" mode="aspectFit"></image>
						<view  @click.stop="jump(item.url,item.id,item.index,item.name||item.title)"  v-if="item.imgPath || item.pic">{{item.name||item.title}}</view>
						<view v-else   class="more" @click="gofenlei">
								<text class="aj aj-fenlei2"></text>
						</view>
						<view v-if="item.id==''" @click="gofenlei">加载更多</view>
					</view>
				</view>
			</view>
			<view class="outside" v-else>
				<view class="within">
					<view class="individual" :style="{width}" v-for="(item,i) in lists" :key="i" @click="jump(item.url,item.id,item.index,item.name||item.title)">
					 	<image :src="item.imgPath || item.pic" mode="aspectFit"></image>
						<view>{{item.name||item.title}}</view>
					</view>
				</view>
			</view>
	  </u-scroll-list>
</template>
<script>
	import {wxUrl,corpId} from '@/config/baseUrl.js'
	export default {
		props:{
		  list:{
		    type: Array 
		  },
		  jf:{
			  type:Number
		  },
		  flag:{ //公用组件 在超市
			  type:String
		  }
		},
		data() {
			return {
				lists:[], //数据
				judge:null, //判断是否可以滑动
				width:null  ,//计算每个选项的宽
				
			}
		},
		watch:{
			list(){
				this.lists.splice(0) //防止数据缓存叠加
				let listLength=this.list.length,num;
				this.judge=listLength > 10 ? true : false
				listLength == 8 ? num=0.25 : num = 0.2
				this.width=getApp().globalData.equipment.windowWidth*0.95*num+'px'
				this.list.forEach((item, index) => {
					item['index'] = index
				})
				this.lists.push(this.list.slice(0,Math.ceil(listLength/2)))
				this.lists.push(this.list.slice(Math.ceil(listLength/2)))
				if(this.list.length<8){
					this.lists=[]
					this.lists=this.list
				}
			}
		},
		methods: {
			// 跳转到微铺官方旗舰店
			go_qijiandian(){
						// this.mendian_list = JSON.parse(JSON.stringify(this.$store.state.locateInformation.storeList))
						this.mendian_list =getApp().globalData.mendian_list 
						// console.log('门店列表、',this.mendian_list)
						
					let qijian=	this.mendian_list.find((item,index,arr)=>{
						return	item.storeSn==9999
						})
						console.log('qijian',this.$store.state.locateInformation.storeList)
						getApp().globalData.shopNo = qijian.storeSn,
						uni.setStorageSync('storeName',qijian.name)
						uni.setStorageSync('storeSn',qijian.storeSn)
						uni.setStorageSync('distance',qijian.distance)
						uni.setStorageSync('isWeipuShop',qijian.isWeipuShop)
						this.$store.commit("setStoreSnName",qijian.name)
								getApp().globalData.tabIndex = 0
						// this.getIndex()
					uni.redirectTo({
						url:"/pages/tabbar/index/index"
					})
			},
			gofenlei(){
				uni.navigateTo({
					url: '/pages/pagesB/classification/classification'
				})
			},
			jump(url,id,index,name){
				if(this.flag=='baihuo'){
					let shop = uni.getStorageSync('bh_num')
						uni.navigateTo({url:`/pages/pagesA/theme2/theme2?id=${id}&shopNo=${shop}`})
					return
				}
				console.log(url,id,index,name)
				// 如果名字是否包含优选二字如果是的话就跳转到微铺
				if(name.includes('优选')){
					this.go_qijiandian()
				}else if(["/pages/pagesB/liveBroadcast/liveBroadcast",
				"/pages/tabbar/generalMerchandise/generalMerchandise"
				].includes(url)){
					uni.showToast({
						title: "急速开发中",
						icon:"none",
						duration: 1000
					});
					return
				}else if(["/pages/pagesB/customerService/customerService"].includes(url)){
					uni.openCustomerServiceChat({
						extInfo: {
							url: wxUrl
						},
						corpId: corpId,
						success(res) {},
						fail(err) {
							// console.error(err)
							uni.showToast({
								title: JSON.stringify(err),
								icon: 'none',
								duration: 2000
							});
							return
						}
					})
				}else{
					/tabbar/.test(url) ? uni.switchTab({url}) : uni.navigateTo({url:id.length<=2?url:`/pages/pagesB/classification/classification?id=${id}&jf=${this.jf}&index=${index}`})
				}
			}
		}
	}
</script>
<style lang="scss">
		.outside{
			display: flex;	
			flex-direction: column;
			.within:first-of-type{
				margin-bottom: 20rpx;
			}
			.within{
				display: flex;
				flex-direction:row;
				.individual {
					text-align: center;
					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50rpx;
					}
					view {
						// width: 100%;
						text-align: center;
						font-size: 25rpx;
					}
				}
			}
		}
	.more {
				width: 80rpx ;
				height: 88rpx !important;
				background-color: #f7f7f7 !important;
				border-radius: 50%;
				position: relative;
				margin-left: 16rpx;
			}
</style>
