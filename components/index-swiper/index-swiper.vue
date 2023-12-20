<template>
	<view>
		<u-swiper :list="list1" @change="change" @click="click" height='240' radius='10' indicatorMode='dot'
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
			change(e) {
				this.index = e.current
			},
			click(e) {
				this.index = e
				let id = this.list1[e].id
				let link = this.list1[e].link
				uni.navigateTo({
					url: `/${link}?id=${id}`
				})
			}
		}
	}
</script>

<style>

</style>
