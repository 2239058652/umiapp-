<template>
	<view style="margin-top: 20rpx;">
		<u-swiper :list="list1" @click="gopath" height='240' radius='10' indicatorMode='dot'
			indicator=true circular=true imgMode='widthFix' keyName="pic"></u-swiper>
	</view>
</template>

<script>
	export default {
		name: "index-swiper",
		props: {
			list1: {
				type: Array
			}
		},
		data() {
			return {
				index: 0
			};
		},
		methods: {
			gopath(index) {
				uni.navigateTo({url:`/pages/pagesA/theme/theme?id=${this.list1[index].id}`})
			},
		}
	}
</script>

<style>

</style>
