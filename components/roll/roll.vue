<template>
	<view class="choice">
		<scroll-view class="overflow" scroll-x="true" :scroll-left="scroll" :scroll-with-animation="true">
			<view :class="[zhong==index ? 'optionII' : 'optionI']" v-for="(item,index) in list" :key="index"
			  :style="{'--right':right,'--left':left,'--both':both}"
				@click="zhong=index,move($event,item.id || item,index)">
				<view :class="{view:font}" >{{item.name || item.spikeStartTimer}}</view>
				<text>{{item.description || "猜你喜欢"}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState} from 'vuex';
	export default {
		name:"roll",
		props:{
			list:{
				type:Array,
				default:()=>[{id:0}]
			},
			font:{
				type:Boolean,
				default:false
			},
			stop:{
				type:Boolean,
				default:true
			},
			left:null,
			right:null,
			both:null,
			points:{
				type:String
			}
		},
		data() {
			return {
				zhong:0 ,//控制分类的选中
				scroll: 0, //控制分类的移动
				style1:null,
				_shopNo1:''
			}
		},
		computed: {
			...mapState(['storeName'])
		},
		created() {
			 
		},
		watch: { 
			storeName() {this.move({target:{offsetLeft:0}},undefined)},//门店改变 分类位置改变
		  list(){
				this.cate = this.list[0].id || this.list[0]
			}
		},
		methods:{
			xuan(index){
				console.log(index)
			},
			nodes(selector){
				uni.createSelectorQuery().in(this).select('.overflow').fields({
					size: true,
				}, res => {
					getApp().globalData.overfolerWidht= res.width 
				}).exec()
			},
			move(e, cate,index) {
				let pages = getCurrentPages();
				if(pages[0].route=='pages/tabbar/supermarket/supermarket'){
					
					this._shopNo1 = uni.getStorageSync('cs_num');
				}else{
					this._shopNo1 =  getApp().globalData.shopNo
				}
				if(cate!=undefined && this.cate != cate){
					this.cate = cate
					this.$emit('update:stop',true) //点击切换分类时 开启下拉刷新
					try{ //点击切换分类时 商品从第一页开始加载
						this.$parent.$parent.page=1 
					}catch(e){
						this.$parent.page=1 
					}
					if(this.points=='points'){
						this.$emit('getMessage',cate)
					}
					typeof cate == "object"? this.$emit("postAjaxSeckill",cate) : 
					this.$emit("getHotGoods",{
						cate,
						page: 1,
						// shopNo:getApp().globalData.shopNo
						// shopNo:'04050'
						shopNo:this._shopNo1
					})
				}else if(cate==undefined){
					this.zhong=0
				}
				this.scroll = e.target.offsetLeft - getApp().globalData.overfolerWidht/ 2 + 61 / 2
			}
		}
	}
</script>

<style lang="scss">
 .choice {
 	width: 100%;
 	margin-top: 10rpx;
 	.overflow {
 		white-space: nowrap;
 		width: 100%;
 		view:first-child{
			padding-right:var(--right)
 		};
 		view:last-child{
 			padding-left:var(--left)
 		};
 		.optionI,.optionII{
 			display: inline-block;
 			width: 123rpx;
 			height: 95rpx;
 			text-align: center;
 			padding:var(--both);
			.view{
				font-size: 40rpx;
				font-family: auto;
				font-weight: 900;
			}
 			text {
 				font-size: 24rpx;
 				color: #c5b5b5;
 				border-radius: 50rpx;
 				padding: 5rpx 8rpx;
 				display: inline-block;
 			}
 		}
 		.optionII{
 			view{
 				color:red;
				font-weight:900
 			}
 			text{
 				background-color: red;color:#fff
 			}
 		}
 	}
 }
</style>