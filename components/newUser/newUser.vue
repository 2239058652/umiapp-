<template>
	<view class="da" v-if="false">
		<view class="xinxi">
			<view>恭喜获得</view>
			<view>新人专享福利</view>
		</view>
		<view class="box">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
							@scrolltolower="lower" @scroll="scroll">
						<view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
							<view>1111</view>
						</view>
								</scroll-view>
		</view>
	</view>
</template>
<script>
	export default {
		props: [],
		data() {
			return {
				list:[
					{
						name:'10元红包券',
						guize:'满20使用'
					},
					{
						name:'10元红包券',
						guize:'满20使用'
					},
					{
						name:'10元红包券',
						guize:'满20使用'
					},
					{
						name:'10元红包券',
						guize:'满20使用'
					},
					
				]
			};
		}, 
		mounted() {
		},
		methods: {
		},

	}
</script>

<style lang="scss">
	// 点击按钮旋转

	.xinxi {
		position: absolute;
		left: 50%;
		top: 19%;
		color: #edcc99;
		font-size: 30rpx;
		transform: translateX(-50%);
		z-index: 100;
		margin-top: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-weight: 700;
		font-size: 40rpx;
	}

	.xinxi view {
margin-top: 15rpx;
	}

	.bottom {
		position: absolute;
		bottom: 20rpx;
		width: 500rpx;
		color: #b6b6b6;
		text-align: center;
	}

	.da {
	    height: 100vh;
	    width: 750rpx;
	    position: absolute;
	    z-index: 9999;
	    top: 0;
	    left: 0;
	    background-color: rgba(0, 0, 0, 0.4);
	}

	.shang {
		height: 500rpx;
		width: 700rpx;
		background-color: black;
		/* margin-top: 200rpx; */
		border-radius: 0 0 50% 50%;
		margin-left: -100rpx;
		background-color: #f45e4d;
		box-shadow: 00px 0px 5px #000000
	}

	.box {
		overflow: hidden;
		width: 500rpx;
		height: 700rpx;
		background-color: #f25542;
		position: absolute;
		z-index: 10;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 15px;
	}

	.x {
		position: absolute;
		font-size: 57rpx;
		right: 11px;
		top: 3px;
	}
	.scroll-Y{
		height: 200rpx;
	}
</style>
