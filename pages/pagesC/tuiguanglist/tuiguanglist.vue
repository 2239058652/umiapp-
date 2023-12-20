<template>
	<view>
		<view class="head">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			
			</view>
			<view @click="go()" class="toubu">
				<u-icon name="arrow-left" color="#fff" size="40"></u-icon>
				<view class="inco" style="color: #fff;">推广人数列表</view>
			</view>
			<view class="tui">
				<view class="shu">
					<view>推广人数</view>
					<view>{{userList1.length+userList2.length}}人</view>
				</view>
				<view>
		<text class="aj aj-navicon-rqfz rens"> </text>
				</view>
				
			</view>
		</view>  
	<!--	<view class="jibie" style="margin-bottom: 40rpx;">
		<view  v-for="(item,index)  in list">
			<view @click="addClass(index)" v-bind:class="{ active:index==current}">{{item}}</view>
			 <view>二级（0）</view> 
		</view>
		</view>-->
		<view class="jibie">
			<view @click="jibie1" :class="{active:yiji_flag}">一级({{userList1.length}})</view>
			<view @click="jibie2" :class="{active:erji_flag}">二级({{userList2.length}})</view>
		
		</view>
		<view>

	  <u--input
	    placeholder="请输入内容"
	    border="surround"
	    clearable
		shape="circle"
		prefixIcon="search"
		prefixIconStyle="font-size: 22px;color: #909399"
	  ></u--input>

		</view>
		<view class="paixu" >
			<view class="" v-for="(list,index) in paixu" @click="xu(index)"  v-bind:class="{ active1:index==current1}">
				{{list}}
				<u-icon name="arrow-upward" color="black" size="20"></u-icon>
				<u-icon name="arrow-downward" color="black" size="20"></u-icon>
			</view>

		</view>
		<view class="shen">
			<view v-if="userList.length>0" v-for="item in userList">
				<view class="dan"  >
					<view  class="dan-left">
						<image class="tou" src="@/static/imags/er.png"></image>
						<view class="hao">
							<view>{{item.name}}</view>
							<view>加入时间{{item.tiem}}</view>
						</view>
					</view>
					<view>
						<view><text style="color: red;">{{item.ren}}</text>人</view>
						<view>{{item.dan}}单</view>
						<view>{{item.yuan}}元</view>
					</view>
				</view>
			</view>
			<view class="wu" v-else>
				您还没邀请好友哦~
			</view>
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
</template>

<script>
	export default {
		data() {
			return {
				flag:false,
				list:['一级','二级'],
				// 默认显示一级
				current: 0,
				// 默认显示团队排序
				current1:0,
				// 一级推广人数数组
				userList:[],
				userList1:[{name:"张三",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				{name:"张三",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				{name:"张三",tiem:'2022-10-20',ren:10,dan:0,yuan:0}, 
				],
				userList2:[{name:"张三1",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				{name:"张三2",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				{name:"张三2",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				{name:"张三2",tiem:'2022-10-20',ren:10,dan:0,yuan:0},
				 
				],
				paixu:['团队排序','金额排序','订单排序'],
				yiji_flag:true,
				erji_flag:false,
			}
		},
		onShow() {
			this.getuserList()
			this.userList=this.userList1
		},
		methods: {
			// 点击切换flag
			qiehuan_flag(){ 
				setTimeout(()=>{
					this.flag=!this.flag
				},200)
			},
			// 点击添加下划线
			 addClass: function (index) {
			 this.current = index;
				if(index==1){
					this.userList = this.userList1
				}else if(index==2){
					this.userList=this.userList2
				}		
			  },
			  xu(index){
				  this.current1 = index;
				  if(index==0){
					  this.userList=[{
						  name:"我是第一",
						tiem:'2022-10-20',ren:10,dan:0,yuan:0
					  }]
				  }else if(index==1){
					 this.userList=[{
					 						  name:"我是第二",
					 						tiem:'2022-10-20',ren:10,dan:0,yuan:0
					 }] 
				  }else if(index==2){
					  this.userList=[{
					  						  name:"我是第三",
					  						tiem:'2022-10-20',ren:10,dan:0,yuan:0
					  }]
				  }
			  },
			go_home(){
				uni.switchTab({
					url: '../../../pages/tabbar/index/index'
				});
			},
			go_cart(){
				uni.switchTab({  
					url: '../../../pages/tabbar/shoppingCart/shoppingCart'
				});
			},
			go_mine(){ 
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
			getuserList(){
				this.$request.postUserList({
								mobile:uni.getStorageSync('userInfo').mobile
								
							}, {
								'Content-type':'application/x-www-form-urlencoded',
							}).then(res => {
								console.log(123,res)
								})
			},
			// 点击一级发送请求
			jibie1(){
				this.erji_flag=false
				this.yiji_flag=true
				this.userList=this.userList1
			
			},
			// 点击二级发送请求
			jibie2(){
				this.erji_flag=true
				this.yiji_flag=false
				this.userList=this.userList2
				
			},
			// 搜索功能
			sousuo(){
				// this.value 代表输入框的值
				return this.list.filter(item=>item.includes(this.value))
			},
		}
	}
</script>
<style scoped>
.head{
	height: 30vh;
	width: 750rpx;
	background-color: #e93423;
}
.tu{
	height: 200rpx;
	width: 	200rpx;
}
.tui{
	margin-top: 20rpx;
	display: flex;
	justify-content: space-between;
	padding: 30rpx;
}
.shu view:nth-child(1){
	color: #fff;
	font-size: 50rpx;}
.shu view:nth-child(2){
	
	color: #fff;
	font-size: 50rpx;
}
.jibie{
	display: flex;
	justify-content: space-around;
	
}
.jibie view{
	/* display: flex; */
	margin-top: 30rpx; 
	height: 70rpx;
}
.active{
	border-bottom: 2rpx solid red;
	color:#e93423 ;
}
.active1{
	/* border-bottom: 2rpx solid red; */
	color:#e93423 ;
}

.paixu{
	margin-top: 10rpx;
	display: flex;
	justify-content: space-around;
}
.paixu view{
	display: flex;
	justify-content: center;
	align-items: center;
}
.sosuo{
	width: 80vw;
	height: 60rpx;
	background-color: #f1f1f1;
	margin: 20rpx auto;
}
.tou{
	height: 80rpx;
	width: 80rpx;
	border-radius: 50%;
}
.shen{
	padding: 20rpx;
}
.dan{
	display: flex;
	justify-content: space-between;
}
.dan-left{
	
	display: flex;
	align-items: center;
} 
.hao{
	margin-left:20rpx ;
}
.daohang{
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
	
	.hutuis{
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
		height: var(--status-bar-height);
		width: 100%;
	}
	
	.toubu { 
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	} 
	
	.inco {
		margin: 0 20rpx 0 20rpx;
	}
	.wu{
		text-align: center;
		line-height: 30rpx;
		font-size: 30rpx;
	}
	/* 最上边的三个人 */
	.rens{
		font-size: 150rpx;
		color: #fff;
	}
</style>

