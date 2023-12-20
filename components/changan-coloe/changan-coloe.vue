
<template>
	<view class="" @touchstart="gtouchstart()" @touchmove="gtouchmove()" @touchend="gtouchend()">
		<view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	var timeOutEvent = 0; //定时器   
	export default {
		name: '',
		props: ['title','top'],
		data() {
			return {

			}
		},
		methods: {
			//开始按   
			gtouchstart() {
				timeOutEvent = setTimeout(this.longPress, 500); //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适   
				// return false;
			},//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件   
			gtouchend() {
				clearTimeout(timeOutEvent); //清除定时器   
				if (timeOutEvent != 0) {
					//这里写要执行的内容（尤如onclick事件）   
					// alert("你这是点击，不是长按");
					this.$emit('clickTap','点击');
				}
				return false;
			},
			//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按   
			gtouchmove() {
				clearTimeout(timeOutEvent); //清除定时器   
				timeOutEvent = 0;
			},
			//真正长按后应该执行的内容   
			longPress() {
				timeOutEvent = 0;
				//执行长按要执行的内容，如弹出菜单   
				// alert("长按事件触发发");
				// this.$emit('longtouch',this.title);
				this.longtouch(this.title,this.top)
				// console.log('提示是',this.top)
				
			},
			longtouch(e,top) {
				uni.setClipboardData({
					data: e,
					success: function () {
						uni.showToast({
									title:top||'复制成功',
									duration: 2000,
									icon: 'none'
								});
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>

</style>

