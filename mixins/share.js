import {
	mapMutations,
	mapGetters
} from 'vuex'
export default {
	data() {
		return {
			share: {
				title: '欢乐爱家',
				path: '/pages/tabbar/index/index', // 全局分享的路径
			},
		}
	},
	// 分享
	onShareAppMessage(res) {
		if (res.from === 'menu') {
			return {
				title: this.share.title,
				path: this.share.path
			}
		}
	},

	// 分享到朋友圈
	// onShareTimeline() {
	// 	return {
	// 		title: this.share.title,
	// 		path: this.share.path,
	// 	};
	// },
}
