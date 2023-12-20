import {
	baseUrl,
	AppID,
	tenantId
} from '@/config/baseUrl.js'
import store from '@/store';
uni.$u.http.setConfig((config) => {
	config.baseURL = baseUrl;
	config.header = {
		'Content-type': 'application/json;charset=UTF-8',
		'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
	}
	config.custom = {
		isFactory: true, //true:返回的数据成功只返回data  false:返回response应该是没用
		catch: true, //默认数据返回不成功进入catch返回  应该是没用
	}
	return config
})

uni.$u.http.interceptors.request.use(
	async config => {
			let url = config.url,
				time = uni.getStorageSync('time')
			if (["/card-littlemall/member/index",
					"/card-littlemall/elecCoupon/collectElecCenter",
					"/card-littlemall/wpCartItem/queryGoodsStockCount",
				].includes(url) && uni.getStorageSync('token') == "") {
				return
			} //如果有需要判断的接口且token为空 取消本次请求
			if (url == "/card-auth/login") {} else if (time && time <= new Date().valueOf()) { //判断token是否过期 应该可以简化
				let res = await uni.$u.http.post("/card-auth/login", {
					grantType: 'refresh_token',
					refreshToken: uni.getStorageSync('refreshToken'), //没有考虑refreshToken失效的问题
					// mobile: store.state.userInfo.mobile || uni.getStorageSync('mobile')
					mobile: uni.getStorageSync('mobile') || uni.getStorageSync('userInfo').mobile
				}, {
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					}
				})
				if (res.code == 200) {
					let re = res.data
					uni.setStorageSync('refreshToken', re.refreshToken),
						uni.setStorageSync('time', new Date().valueOf() + re.expiresIn),
						uni.setStorageSync('token', `${re.tokenType} ${re.accessToken}`)
				} else {
					this.$store.dispatch("postLogin");
					uni.removeStorageSync('time');
					return
				}
			}
			config.header["Card-Auth"] = uni.getStorageSync('token')
			url != "/card-littlemall/home/getHotGoods" && store.commit("setLoadingShow", true);
			config.method == "GET" ? config.params.tenantId = tenantId : config.data.tenantId = tenantId
			return config
		},
		config => {
			uni.showToast({
				title: `请求超时`,
				duration: 2000
			})
			return Promise.reject(config)
		})

uni.$u.http.interceptors.response.use(
	response => { //statusCode为200时执行
		store.commit("setLoadingShow", false);
		let data = response.data,
			url = response.config.url;
		console.log(url, response);
		if (data.code == 200) {
			if ([
					"/card-littlemall/wpReceiver/delete2",
					"/card-littlemall/wpReceiver/save2",
					"/card-littlemall/wpReceiver/update2",
					"/card-littlemall/member/submitorder",
					"/card-littlemall/wpCartItem/addCartItem",
					"/card-littlemall/wpCartItem/queryGoodsStockCount",
					'/card-littlemall/order/submit',
					'/card-littlemall/wpCartItem/deleteCartIds',
					"/card-auth/login",
					"/card-littlemall/member/getFreight",
					"/card-littlemall/weixinMemberCard/bindcard",
					"/card-littlemall/weixinMemberCard/unbindcard",
					"/card-littlemall/member/getCardJf",
					'/card-littlemall/orderpay/benjinPay',
					'/card-littlemall/orderManage/placePay',
					"/card-littlemall/wxActivity/lotteryDraw",
					'/card-littlemall/wpSpikeInfo/ajaxSeckill',
					'/card-littlemall/order/cancel',
					'/card-littlemall/order/cancelUnconfirm',
					"/card-littlemall/order/confirmGoods",
					"/card-littlemall/elecCoupon/checkCollectElecByGoodsId",
					"/card-littlemall/wxActivity/updateJfByApi",
					"/card-littlemall/member/getJfChangeDetail",
					"/card-littlemall/member/getCardYeChangeDetail",
					"/card-littlemall/wpOrderRefund/save",
					"/card-littlemall/wpDeliveryStore/selectShop",
					"/card-littlemall/elecCoupon/receiveEle",
					"/card-littlemall/elecCoupon/shareEle",
					"/card-littlemall/order/view",
					"/card-littlemall/new/goodsCategory",
					"/card-littlemall/member/checkSpikeActivity",
					"/card-littlemall/member/getAccountInformation",
					"/card-littlemall/wpCartItem/orderToCart",
					"/card-littlemall/goods/getGoodsDetail",
					"/card-littlemall/member/buynow",
					"/card-littlemall/member/ordercheck",
					"/card-littlemall/home/guanzhu",
					"/card-littlemall/home/zg/list",
					"/card-littlemall/home/payMentCode",
					"/card-littlemall/search/page",
					"/card-littlemall/home/zgDetail",
					"/card-littlemall/home/zgIndex",
					"/card-littlemall/cardInfo/validPassword",
					"/card-littlemall/member/ordercheckZg",
					"/card-littlemall/order/submitZg",
					"/card-littlemall/elecCoupon/collectElecInfo",
					"/card-littlemall/wpReceiver/list2",
					"/card-littlemall/orderpay/jhPay",
					"/card-wxminiapp/pay/createOrder",
					"/card-littlemall/search/pageWithGoodCategory",
					"https://newc.wp99.cn/card-littlemall/orderInvoice/edit",
					"https://newc.wp99.cn/card-littlemall/orderInvoice/save",
					"https://newc.wp99.cn/card-littlemall/orderInvoice/detail",
					"/card-littlemall/order/isDelete",
					"/card-littlemall/WpCarInfo/edit",
					"/card-littlemall/wpReturngoldInfo/rakeYeTx"
				].includes(url) || data.code == undefined) {
				return data
			} else {
				return data.data
			}
		} else {
			return data
		}
	},
	response => { //statusCode不为200时执行
		// store.commit("setLoadingShow", false)
		// console.log("错误" + response.config.url, response)
	})
