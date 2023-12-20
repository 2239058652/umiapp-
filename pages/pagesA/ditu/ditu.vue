<template>
	<view class="ditu">
		<!-- <web-view :webview-styles="webviewStyles" src="https://shopic.sf-express.com/clover?order=KtAztzffWLnS9my8jUAgR-nfclIameGBt6q_vbW3URY"></web-view> -->
		<web-view :webview-styles="webviewStyles" :src='luj'></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				luj:'',
				// show:false
			}
		},
		onLoad(e){
			console.log('e',e);
			this.luj = `${e.sn}?order=${e.order}`
			console.log('luj',this.luj);
			// this.show =true
		}
	}
</script>

<style>
</style>
