<script>
export default {
	globalData: {
		equipment: uni.getSystemInfoSync(), //全局设备高度
		// #ifndef H5
		menuButtonInfo: uni.getMenuButtonBoundingClientRect().top - 22 + 'px', //胶囊信息
		// #endif
		shopNo: '', //门店号
		// 超市的百货分类
		cs_classification:[],
		classification: null, //商品分类
		increment: 0, //增量，点击加入购物车时增加，用于判断是否触发购物车请求
		superMarket: null, //超市广告位
		hotGoods: null, //热门商品 以后删除
		overfolerWidht: null,
		selectInd: null,
		tabIndex: 0,
		mendian_list:[],
		// 百货的所有门店
		bh_list_mendian:[],
		cs_list_mendian:[],
		classification_cs: null, //商品分类
	},
	onLaunch() {
		// 获取屏幕的大小宽度
		uni.getSystemInfo({
			success: function(res) {
				// console.log('系统信息为', res.screenHeight, res);
				if (res.screenHeight < 812) {
					// 如果小于812则认为是小机型
					uni.setStorageSync('pm_num', 1);
				} else if (res.screenHeight == 812) {
					// 如果等于812则认为是大机型
					uni.setStorageSync('pm_num', 0);
				} else {
					// 如果大于812则认为是大机型
					uni.setStorageSync('pm_num', 0);
				}
			}
		});
		
		// this.$store.dispatch('WEBSOCKET_INIT', 'wss://microapp.aijiamart.cn/socket')
		// this.$store.dispatch('WEBSOCKET_INIT', 'ws://124.222.224.186:8800')
		// this.$store.dispatch('CLOSE_SOCKET')
		// 小程序版本更新
		// #ifdef MP
		this.updateManager();
		// #endif
		uni.hideTabBar({ animation: true });
		// Boolean(uni.getStorageSync('tabbar')) || uni.setStorageSync('tabbar',[
		// 	{
		// 		index:0,
		// 		text: "首页",
		// 		iconPath:"static/tabbar/home.png",
		// 		selectedIconPath:"static/tabbar/homeSelect.png"
		// 	},
		// 	{
		// 		index:1,
		// 		text: "超市",
		// 		iconPath:"static/tabbar/supermarket.png",
		// 		selectedIconPath:"static/tabbar/supermarketSelect.png"
		// 	},
		// 	{
		// 		index:2,
		// 		text: "百货",
		// 		iconPath:"static/tabbar/class.png",
		// 		selectedIconPath:"static/tabbar/classSelect.png"
		// 	},
		// 	{
		// 		index:3,
		// 		text: "购物车",
		// 		iconPath:"static/tabbar/shopping.png",
		// 		selectedIconPath:"static/tabbar/shoppingSelect.png"
		// 	},
		// 	{
		// 		index:4,
		// 		text: "我的",
		// 		iconPath:"static/tabbar/my.png",
		// 		selectedIconPath:"static/tabbar/mySelect.png"
		// 	}
		// ])
	},
	methods: {
		// #ifdef MP
		// 小程序版本更新
		updateManager() {
			const updateManager = uni.getUpdateManager();
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						} else if (res.cancel) {
							uni.showModal({
								title: '提示',
								content: '本次版本有新的功能添加，请及时更新',
								showCancel: false, //隐藏取消按钮
								confirmText: '更新', //只保留确定更新按钮
								success: function(res) {
									if (res.confirm) {
										//下载新版本，并重新应用
										updateManager.applyUpdate();
									}
								}
							});
						}
					}
				});
			});
			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
				});
			});
		}
		// #endif
	}
};
</script>

<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';
@import '@/static/iconfont/iconfont.css';

page {
	background-color: #f6f6f6;
	font-size: 30rpx;
}
// 隐藏滚动条
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: red;
}
</style>
