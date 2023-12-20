<template>
	<view class="box">
		<view class="top">
			<view class="top-box1">
				<view class="xs">限时秒杀</view>
				<view class="date"><view class="date1">14点场</view><view class="sj">
					00:42:41
				</view></view>
			</view>
			<view class="">
				更多 <uni-icons type="forward" size="15"></uni-icons>
			</view>
		</view>
		<view class="bottom list">
			<view class="" v-for="(item,index) in list">
				<view >
					<view class="miao">
						<image :src="item.img" mode=""></image>
						<view class="zhe">￥{{item.zhe}}</view>
						<view class="del">￥{{item.pic}}</view>
					</view>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"index2-miaosha",
		data() {
			return {
				list:[{
					img:'https://p1.ssl.qhimgs1.com/sdr/400__/t019fd46afcd592635b.png',
					name:"苹果",
					pic:"9.00",
					zhe:'8.67'
				},
				{
					img:'https://so.360tres.com/dmsmty/120_100_100/t01589b2f11b04f6213.jpg?size=150x150',
					name:"苹果",
					pic:"10.00",
					zhe:'7.98'
				},
				{
					img:'https://p5.ssl.qhimgs1.com/t01559c66120e4f50d5.jpg',
					name:"苹果",
					pic:"11.00",
					zhe:'9.97'
				},
				{
					img:'https://p5.ssl.qhimgs1.com/sdr/400__/t01cc6a8b99073b5535.jpg',
					name:"苹果",
					pic:"8.00",
					zhe:'6.67'
				},
				]
			};
		}
	}
</script>

<style lang="scss">
	.zhe{
		color: #ef4343;
		font-weight: 700;
	}
	.del{
		text-decoration: line-through;
		color: #bebdc2;
	}
	.list{
		display: flex;
		justify-content: space-around;
		align-self: center;
		text-align: center;
	}
	.miao image{
		height: 85rpx;
		width: 85rpx;
		border-radius: 50%;
	}
	.xs{
		font-size: 35rpx;
		font-weight: 600;
	}
.box{
	height: 250rpx;
	width: 700rpx;
	margin: 20rpx auto;
	border-radius: 7px;
	background-color: #fff;
	
}
.date1{
	background: linear-gradient(to right,#f7533c,#f3b242);
	border-radius: 20px;
	width: 130rpx;
	text-align: center;
	color: #fff;
	font-size:30rpx ;
}
.top{
	height: 70rpx;
	border-radius: 7px 7px 0 0;
	// background: linear-gradient(to bottom,#ff7570,#fff)
	background: linear-gradient(to bottom,#f8d9d3,#fff);
	display: flex;
	padding: 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
}
.top-box1{
	display: flex;
	width: 65%;
	justify-content: space-between;
	align-items: center;
}
.date{
	background-color: #fff;
	width: 276rpx;
	display: flex;
	justify-content: space-between;
	border-radius: 10rpx;
}
.sj{
	margin-right: 10rpx;
	color:#e78655 ;
}
.bottom{
	height: 179rpx;
	width: 700rpx;
}
</style>