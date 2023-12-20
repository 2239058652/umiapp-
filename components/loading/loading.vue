<template>
	<view class="u_loading" v-if="loadingShow" @touchmove.stop.prevent="preventTouchMove">
		<!-- 加载动画开始 -->
		<view class="loader">
			<view></view>
			<view></view>
			<view></view>
			<view></view>
			<view></view>
		</view>
		<!-- 加载动画结束 -->
		<view class="title">努力加载中,请先休息一会</view>
	</view>
</template>

<script scoped="true">
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['loadingShow'])
		},
		methods: {
			preventTouchMove() {
				console.log('stop user scroll it!');
				return;
			}
		}
	};
</script>

<style lang="scss">
	.u_loading {
		position: fixed;
		z-index: 99999;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		background: rgba(255, 255, 255, 0.4);

		.title {
			color: #666;
			font-size: 30rpx;
			margin-top: 40rpx;
		}

		.loader {
			width: 45px;
			position: relative;

			view {
				display: block;
				position: absolute;
				bottom: 0px;
				width: 7px;
				height: 5px;
				background: coral;
				animation: loader 1.5s infinite ease-in-out;
			}

			& view:nth-child(2) {
				left: 11px;
				animation-delay: 0.2s;
			}

			& view:nth-child(3) {
				left: 22px;
				animation-delay: 0.4s;
			}

			& view:nth-child(4) {
				left: 33px;
				animation-delay: 0.6s;
			}

			& view:nth-child(5) {
				left: 44px;
				animation-delay: 0.8s;
			}

			@keyframes loader {
				0% {
					height: 5px;
					transform: translateY(0px);
					background: coral;
				}

				25% {
					height: 30px;
					transform: translateY(15px);
					background: cornflowerblue;
				}

				50% {
					height: 5px;
					transform: translateY(0px);
					background: cornflowerblue;
				}

				100% {
					height: 5px;
					transform: translateY(0px);
					background: coral;
				}
			}
		}
	}
</style>
