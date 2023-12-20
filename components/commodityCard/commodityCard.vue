<template>
	<view class="card">
		<view class="heard" v-if="judge">
			本期必买榜<text>MUSTHAVE</text>
		</view>
	  <view class="list" >
	  	<view class="commodity1" v-for="(itemI,i) in item" :key="i" @click="goPath(`${itemI.id}_${shopNo}`)"
			  :style="judge ? 'width:30%;height:356rpx;padding:10rpx;background:#ebd8b8' : pages?'width:30%;height:356rpx;padding:10rpx;background:linear-gradient(180deg, #daf0f2 50%, #2797ff 90%)':'' ">
				<view class="aj aj-dianzan jd" v-show="judge">立体花型,小巧精致</view>
				<view class="jd TOP" v-show="pages && item.length==9">TOP{{i+1}}</view>
	  		<image :src="itemI.image"  :lazy-load="true"></image>
	  		<view :class="[judge ? 'text2' : pages ? 'text2' : 'text1']">
	  			<view>{{itemI.name}}</view>
					<view v-if="judge">
						<text>到手价￥</text><text class="er">{{itemI.price}}</text>
					</view>
					<view>
						<text class="er">￥{{itemI.sprice}}</text>
					</view>
	  			<text v-if="judge" class="aj aj-jinrujiantou">{{(pages || judge) && '立即购买' }}</text>
	  		</view>
	  	</view>
	  </view>
	</view>
</template>

<script>
	export default {
		name:"commodityCard",
		props:{
			item:Array,
			title:{
				type:String,
				default:""
			},
		},
		data() {
			return {
				judge:false, //通过是否传入title判断，没有传入判断为false
				pages:false, //在title2中通过路径判断
				shopNo:getApp().globalData.shopNo
			};
		},
		methods:{
			goPath(id){
				uni.navigateTo({
					url:`/pages/pagesA/goodsDetails/goodsDetails?id=${id}`
				})
			}
		},
		mounted() {
			this.judge=this.title != ""
			let yemian = getCurrentPages()
			yemian.length !=1 ? this.pages=yemian[yemian.length - 2].route == "pages/pagesC/title2/title2" :''
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";
	.card{
		.heard{
			@include chamfer;
			height: 60rpx;
			color: #c8a973;
			font-size: 40rpx;
			text{
				margin-left: 15rpx;
				font-size: 20rpx;
			}
		}
    .list{
      width: $width;
      margin: 20rpx auto;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .commodity1{
			position: relative;
			width: 32%;
			height: 320rpx;
			border-radius: 30rpx;
			margin-bottom: 10rpx;
			@mixin jd ($size,$width,$height,$color){
			 	font-size: $size;
			 	width: $width;
			 	height: $height;
			 	color: $color;
			 	line-height: $height;
			 }
			 .aj-jinrujiantou{
				 display: inline-block;
				 width: 135rpx;
				 font-size: 12px !important
			 }
			  .jd{
					@include absolute (2%, 5%)
			  	 background: #464240;
			  	 border-radius: 15rpx 0 15rpx 0;
					 @include jd(20rpx,200rpx,35rpx,#fff)
			   }
				 .TOP{
					 @include absolute (0, 0)
					 @include jd(25rpx,75rpx,40rpx,#84a3a4)
				 }
				 image {
				 	width: 100%;
				 	height:216rpx;
				 	border-radius: 15rpx;
				 }
     	 	.text1{ 
     			view:first-of-type{
						@include hide(1)
     			}
     			&>text:last-child{
     				margin-top: 5rpx;
     				height: 50rpx;
     				width:88%;
     				border:4rpx solid red;
     				color: red;
     				text-align: center;
     				line-height: 50rpx;
     				border-radius: 10rpx;
     			}
     	 	}
				.text2{
					text-align: center;
					&>view:first-child{
						@include hide(1);
					}
					&>view:nth-child(2){
						width: 100%;
						text-align: center;
						font-size: 19rpx;
						.er{
							font-size: 39rpx;
							margin-bottom: 5rpx;
						}
						&>text:nth-child(3){
							text-decoration: underline;
						}
					}
					// 立即购买
					&>text:last-child{ 
						margin-top: 10rpx;
						color: #fff;
						background: #464241;
						border-radius: 50rpx;
						text-align: center;
						height: 40rpx;
						width: 167rpx;
						line-height: 40rpx;
					}
				}
      }
    }
	}
</style>