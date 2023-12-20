import Vue from 'vue'

//通用打印
Vue.prototype.$log = (tip, content) => {
	if (Vue.prototype.$env === 1) {
		return;
	}
	let ttype = typeof tip; //获取tip类型
	let ctype = typeof content; //获取content类型
	let platform = uni.getSystemInfoSync().platform;
	console.log(platform);
	if (content == undefined || content == null) {
		if (platform === 'devtools') {
			//devtools代表开发者工具 不需要解析为JSON字符串
			console.log(tip);
		} else {
			console.log(ttype === 'string' ? tip : JSON.stringify(tip));
		}
	} else {
		if (platform === 'devtools') {
			console.log(tip, content);
		} else {
			console.log((ttype === 'string' ? tip : JSON.stringify(tip)) + "->", ctype === 'string' ? content : JSON
				.stringify(content));
		}

	}
}
//通用弹窗
Vue.prototype.$pop = (tip, content) => {
	return new Promise((resolve, reject) => {
		if (Vue.prototype.$env === 1) {
			resolve();
			return;
		}
		let ttype = typeof tip; //获取tip类型
		if (!content) {
			content = ttype === 'string' ? tip : JSON.stringify(tip);
			tip = "提示信息"
		}
		ttype = typeof tip; //再获取tip类型
		let ctype = typeof content;
		uni.showModal({
			title: ttype === 'string' ? tip : JSON.stringify(tip),
			content: ctype === 'string' ? content : JSON.stringify(content), //必须是字符串
			showCancel: false,
			success: res => {
				if (res.confirm) {
					resolve();
				}
			}
		});
	})
}
