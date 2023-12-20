import {
	mapMutations,
	mapGetters
} from 'vuex'
export default {
	data() {
		return {
			scrollTop: 0, //返回顶部
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		a() {
			console.log('俺');
		},
		back(judge) {
			judge ? uni.switchTab({
				url: '/pages/tabbar/index/index'
			}) : uni.navigateBack({
				delta: 1
			})
		},
		jump(url) {
			if (url == "#") {
				uni.showToast({
					title: "急速开发中",
					icon: "none",
					duration: 2000
				})
			} else {
				uni.navigateTo({
					url
				})
			}
		},
		get(url, data) {
			uni.request({
				url: url,
				// method: 'post',
				data: data,
				header: {
					'Accept-Encoding': '*/*',
					// "content-type": "application/x-www-form-urlencoded",
					'Content-type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Card-Auth': uni.getStorageSync('token')
				},
			}).then(res => {
				console.log('GET----------------minxin调用', res);
				if (this.mixin) {
					this.mixin = res[1].data.data
				}
			})
		},
		post(url, data) {
			uni.request({
				url: url,
				method: 'post',
				data: data,
				header: {
					'Accept-Encoding': '*/*',
					"content-type": "application/x-www-form-urlencoded",
					// 'Content-type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Card-Auth': uni.getStorageSync('token')
				},
			}).then(res => {
				console.log('post-------------minxin调用', res);
				if (this.mixin) {
					this.mixin = res[1].data.data
				}
			})
		},
	}
}