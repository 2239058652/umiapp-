<template>
	<view class="location">
		<uni-nav-bar fixed="true" leftIcon="back" size="30" statusBar="false" :backgroundColor="bgStyle"
			@clickLeft="black" title="选择门店">
		</uni-nav-bar>
		<map v-show="storeList!=null" id="map" class="map" :latitude="latitude" :longitude="longitude" :show-location="true" show-compass="false"
			enable-rotate="false" enable-overlooking="false">
		</map>
		<view  class="store" v-for="(item,index) in storeList" :key="index" >
			<view @click="storeSn(item.storeSn,item.name,item.distance,item.isWeipuShop)">
				<image :src="item.image" mode="scaleToFill" lazy-load="false"></image>
				<text>{{item.name}}</text>
			</view>
			<u-icon width="20px" name="map" stop="flase" label="到店" size="60" labelPos="bottom" top="5"
				@click.stop="openmap(item.name,item.address,item.latitude,item.longitude)">
			</u-icon>
			<view @click="storeSn(item.storeSn,item.name)">
				<view>
					距您{{item.distance.toFixed(2)}}km
					<text v-if="index == 0">距您最近</text>
				</view>
				<view>联系电话：{{item.storeMobile}}</view>
				<view>门店地址：{{item.address}}</view>
			</view>
		</view>
		<view v-show="show">
		
			<u-empty mode="permission"  iconSize="195px" width="135px" height="135px" textSize="15px"  text="请开启位置信息,便于为您提供更好的服务哦!"></u-empty>
			<button type="warn" size="mini" open-type="openSetting">去开启</button>
			<view>
				<button type="warn" size="mini" @click="shuaxin()">刷新门店</button>
			</view>
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
				show:false,
				// 百货页面的所有店铺
				bh_list_mendian:getApp().globalData.bh_list_mendian,
				cs_list_mendian:getApp().globalData.cs_list_mendian,
				
			}
		},
		onShow(){
			 var pages = getCurrentPages(); // 当前页面
			 var beforePage = pages[pages.length - 2]; // 前一个页面
			uni.getSetting({
			   success:(res)=>{
			     res.authSetting["scope.userLocation"] ? this.$store.dispatch("location",0) : this.show=true
			   }
			})
			this.mapContext = uni.createMapContext("map", this);
			uni.$on("Render",this.Render)
		},
		onLoad(option) {
			this.counter = option.counter
		},
		onUnload(){uni.$off("Render",this.Render)},
		onPullDownRefresh(){this.$store.dispatch("location",0)},
		methods: {
			shuaxin(){
				this.$store.dispatch("location",0)
			},
			Render(){
					// console.log('门店信息展示',this.$store.state.locateInformation)
				this.storeList= this.$store.state.locateInformation.storeList
				this.latitude=this.storeList[0].latitude
				this.longitude=this.storeList[0].longitude
				this.map()
				uni.stopPullDownRefresh()
			},
			map(){
				this.mapContext.getCenterLocation({
					success(res) {
					}
				})
				this.mapContext.moveToLocation({
					success(res) {
					}
				})
			},
			// 更改门店号，门店名称
			storeSn(toreSnId, name,distance,isWeipuShop) {
				// console.log(toreSnId, name,distance,isWeipuShop)
				// console.log('百货的门店有',this.bh_list_mendian)
				// console.log('超市的门店有',this.cs_list_mendian)
				// 判断是从哪个页面过来的
				 var pages = getCurrentPages(); // 当前页面
				 var beforePage = pages[pages.length - 2]; // 前一个页面
				 
				 // 判断是否从百货页面跳转来的
				 if(beforePage.route=='pages/tabbar/generalMerchandise/generalMerchandise'){
				// console.log('我是从百货来的')
				uni.setStorageSync('bh_name', name);
				uni.setStorageSync('bh_num', toreSnId);
				this.$store.commit("setStorebh_name", name)
				 }
				 // 判断是否从超市跳转过来的
				if(beforePage.route=='pages/tabbar/supermarket/supermarket'){
					// console.log('我是从超市来的')
				uni.setStorageSync('cs_name', name);
				uni.setStorageSync('cs_num', toreSnId);
				this.$store.commit("setStorecs_name", name)
				 }
				
				// 在首页选择门店的时候判断白货页面是否有同样的门店
			this.bh_list_mendian.forEach((item)=>{
					 if(item.storeSn==toreSnId){
						uni.setStorageSync('bh_name', item.name);
						uni.setStorageSync('bh_num', item.storeSn);
						this.$store.commit("setStorebh_name", item.name)
					}else{
						// console.log('百货没有符合的')
					}
				})
				//在首页选择门店的时候 判断超市是否有
			this.cs_list_mendian.forEach((item)=>{
						 if(item.storeSn==toreSnId){
							console.log('超市有一样的',item)
							uni.setStorageSync('cs_name', item.name);
							uni.setStorageSync('cs_num', item.storeSn);
							this.$store.commit("setStorecs_name", item.name)
						}
					})
				// 只要切换门店了这个就会执行
				if(getApp().globalData.shopNo != toreSnId){
					getApp().globalData.shopNo = toreSnId,
					uni.setStorageSync('storeName',name)
					uni.setStorageSync('storeSn',toreSnId)
					uni.setStorageSync('distance',distance)
					uni.setStorageSync('isWeipuShop',isWeipuShop)
					this.$store.commit("setStoreSnName", name)
					
					getApp().globalData.tabIndex = 0 
				}
				this.black()
				if(this.counter != '1'){
					uni.$emit("history")
				}
			},
			// 打开地图
			openmap(...data) {
				if(data[2]==0&&data[3]==0){
					data[3] =116.38,
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
				if(this.counter == '1'){
					uni.navigateBack({
						delta:1
					})
				}else{
					 var pages = getCurrentPages(); // 当前页面
					      var beforePage = pages[pages.length - 2]; // 前一个页面
					uni.switchTab({
						// url:"/pages/tabbar/index/index"
						url:`/${beforePage.route}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.ruguo{
	color: #c0c4cc !important;
	}
		@import "@/static/style/uni.scss";
	.location {
		>view:last-child{
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
				@include  absolute (10rpx,600rpx)
			}
			&>view:nth-child(4){
				text{
					color: red;
				}
			}
			view {
				margin: var(--size);
			}
		}
	}
</style>
