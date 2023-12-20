export const state = {
	PrimaryColor: '#fe461d', //主题色 框架自带 先不动
	// bj:"background:linear-gradient(180deg, #2797ff 70%, #b1f6ca 90%)",
	bj: "",
	loginPopupShow: false, //控制是否打开登录弹窗
	loadingShow: false, //加载动画
	locateInformation: null, //定位信息
	layoutType: "elasticLayout2", //商品排版
	storeName: uni.getStorageSync('storeName'),
	bh_name: uni.getStorageSync('bh_name'),
	cs_name: uni.getStorageSync('cs_name')
};
export const mutations = {
	setPrimaryColor(state, data) {
		state.PrimaryColor = data;
		// #ifdef H5
		window.sessionStorage.setItem('PrimaryColor', JSON.stringify(state.PrimaryColor));
		// #endif
		// #ifndef H5
		uni.setStorageSync('PrimaryColor', state.PrimaryColor);
		// #endif
	},
	setBj(state, data) {
		state.bj = data
	},
	setLayoutType(state, data) {
		state.layoutType = data
	},
	setLoginPopupShow(state, data) {
		state.loginPopupShow = data
	},
	setLoadingShow(state, data) {
		state.loadingShow = data
	},
	setLocateInformation(state, data) {
		state.locateInformation = data
	},
	setStoreSnName(state, data) {
		state.storeName = data
	},
	// 修改百货页面的店铺
	setStorebh_name(state, data) {
		state.bh_name = data
	},
	// 修改超市页面的店铺
	setStorecs_name(state, data) {
		state.cs_name = data
	},
};
export const actions = {
	location(context, mack) {
		new Promise((resolve, fulfilled) => {
			uni.getLocation({
				type: 'gcj02',
				altitude: true,
				cacheTimeout: 10,
				accuracy: "best",
				isHighAccuracy: true,
				success(res) {
					resolve(res)
				},
				fail(res) {
					resolve(res)
				}
			})
		}).then(res => {
			var routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			var curRoute = routes[routes.length - 1].route;
			// 新逻辑开始
			if (routes.length == 1) {
				uni.hideLoading()
				uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
					params: {
						latitude: res.latitude || 0,
						longitude: res.longitude || 0,
					}
				}).then(res => {
					if (res.code == 200) {
						console.log('我是进入就发生的所有列表数据',res.data.storeList)
						getApp().globalData.mendian_list = res.data.storeList
						context.commit("setLocateInformation", res.data)
						let {
							name,
							storeSn,
							distance,
							isWeipuShop
						} = res.data.storeList[0]
						let obj = uni.getStorageSync('storeName');
						let obj1 = uni.getStorageSync('storeSn');
						if (Object.keys(obj).length > 0) {
							mack == 0 || ( //刷新页面时不进行更改
								context.commit("setStoreSnName", obj),
								getApp().globalData.shopNo = obj1
							)
						} else {
							uni.setStorageSync('storeName', name),
								uni.setStorageSync('storeSn', storeSn),
								uni.setStorageSync('isWeipuShop', isWeipuShop)
							uni.setStorageSync('distance', distance)
							mack == 0 || ( //刷新页面时不进行更改
								context.commit("setStoreSnName", name),
								getApp().globalData.shopNo = storeSn
							)
						}
						uni.$emit("getIndex")
						uni.$emit("Render")
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
				// 在这获取的是百货的所有门店信息
				uni.hideLoading()
				uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
					params: {
						latitude: res.latitude || 0,
						longitude: res.longitude || 0,
						isBh: 1
					}
				}).then(res => {
					if (res.code == 200) {
						// console.log('进入就发生的百货列表',res.data.storeList)
						getApp().globalData.bh_list_mendian = res.data.storeList
					} else {

						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})

				// 在这获取的是超市的所有门店信息
				uni.hideLoading()
				uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
					params: {
						latitude: res.latitude || 0,
						longitude: res.longitude || 0,
						isBh: 0
					}
				}).then(res => {
					if (res.code == 200) {
						console.log('进入就发生的超市列表',res.data.storeList)
						getApp().globalData.cs_list_mendian = res.data.storeList
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})


			} else {
				// 如果不等于1就说明不是进入页面加载查询所有的门店列表的
				// 获取当前打开过的页面路由数组
				var curRoute = routes[routes.length - 2].route; // 获
				// console.log('我是两个页面的',curRoute)
				// 判断是否从百货页面跳转来的
				// 从百货页面进入的
				if (curRoute == 'pages/tabbar/generalMerchandise/generalMerchandise') {
					uni.hideLoading()
					uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
						params: {
							latitude: res.latitude || 0,
							longitude: res.longitude || 0,
							//如果是1的话  代表返回的百货的门店列表 如果是0的话 代表的是超市的门店列表
							// 如果不传isBh的话就是请求的所有店铺列表
							isBh: 1

						}
					}).then(res => {
						if (res.code == 200) {
							// console.log('我是门店列表数据-百货',res)
							context.commit("setLocateInformation", res.data)
							let {
								name,
								storeSn,
								distance,
								isWeipuShop
							} = res.data.storeList[0]
							let obj = uni.getStorageSync('storeName');
							let obj1 = uni.getStorageSync('storeSn');
							if (Object.keys(obj).length > 0) {
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", obj),
									getApp().globalData.shopNo = obj1
								)
							} else {
								uni.setStorageSync('storeName', name),
									uni.setStorageSync('storeSn', storeSn),
									uni.setStorageSync('isWeipuShop', isWeipuShop)
								uni.setStorageSync('distance', distance)
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", name),
									getApp().globalData.shopNo = storeSn
								)
							}
							uni.$emit("getIndex")
							uni.$emit("Render")
						} else {

							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
					// 从超市页面进入的
				} else if (curRoute == 'pages/tabbar/supermarket/supermarket') {
					uni.hideLoading()
					uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
						params: {
							latitude: res.latitude || 0,
							longitude: res.longitude || 0,
							//如果是1的话  代表返回的百货的门店列表 如果是0的话 代表的是超市的门店列表
							// 如果不传isBh的话就是请求的所有店铺列表
							isBh: 0
						}
					}).then(res => {
						
						if (res.code == 200) {
							context.commit("setLocateInformation", res.data)
							let {
								name,
								storeSn,
								distance,
								isWeipuShop
							} = res.data.storeList[0]
							let obj = uni.getStorageSync('storeName');
							let obj1 = uni.getStorageSync('storeSn');
							if (Object.keys(obj).length > 0) {
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", obj),
									getApp().globalData.shopNo = obj1
								)
							} else {
								uni.setStorageSync('storeName', name),
								uni.setStorageSync('storeSn', storeSn),
								uni.setStorageSync('isWeipuShop', isWeipuShop)
								uni.setStorageSync('distance', distance)
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", name),
									getApp().globalData.shopNo = storeSn
								)
							}
							uni.$emit("getIndex")
							uni.$emit("Render")
						} else {

							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})

				} else {
					// 如果长度不等于1 又不是从百货页面来的话 那么就走正常流程
					// console.log('我不是首页又不是百货又不是超市')
					uni.hideLoading()
					uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
						params: {
							latitude: res.latitude || 0,
							longitude: res.longitude || 0,
						}
					}).then(res => {
						if (res.code == 200) {
							// console.log('我什么都不是的门店列表',res)
							context.commit("setLocateInformation", res.data)
							let {
								name,
								storeSn,
								distance,
								isWeipuShop
							} = res.data.storeList[0]
							let obj = uni.getStorageSync('storeName');
							let obj1 = uni.getStorageSync('storeSn');
							if (Object.keys(obj).length > 0) {
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", obj),
									getApp().globalData.shopNo = obj1
								)
							} else {
								uni.setStorageSync('storeName', name),
									uni.setStorageSync('storeSn', storeSn),
									uni.setStorageSync('isWeipuShop', isWeipuShop)
								uni.setStorageSync('distance', distance)
								mack == 0 || ( //刷新页面时不进行更改
									context.commit("setStoreSnName", name),
									getApp().globalData.shopNo = storeSn
								)
							}
							uni.$emit("getIndex")
							uni.$emit("Render")
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}

			}
		})
	},
	judge(e, data) { //判断商品数量
		let [buyCount, goodsId, shopNo] = data
		return new Promise((resolve, reject) => { //Promise封装接收返回值
			uni.$u.http.post("/card-littlemall/wpCartItem/queryGoodsStockCount", {

				buyCount: buyCount,
				goodsId,
				shopId: shopNo,
			}).then(res => {
				uni.hideLoading()
				if (res.data.goodsStockNumber <= 0) {
					resolve([false, res.data.goodsStockNumber])
				} else {
					resolve([true, res.data.goodsStockNumber])
				}
			})
		})
	},
	payMoney(a, e) { //支付
	console.log('微信支付开始',e[0]);
		uni.showLoading({
			title: '支付中...'
		})
		uni.$u.http.post('/card-littlemall/cardbase/getCardsByMobile', {
			mobile: uni.getStorageSync('userInfo').mobile,
		}).then(res => {
			let cardList = res.cards.map((val) => val.cardNo);
			uni.$u.http.post('/card-littlemall/orderManage/placePay', {
				subOpenId: uni.getStorageSync('openid'),
				orderSn: e[0], //订单编号
				totalAmount: e[1],
				goodsList: [],
				dcard: cardList[0],
			}).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					if (e[1] == '0' || e[1] == '0.00') {
						console.log('我是微信支付1',e[0]);
					this.getWEBdata(e[0])
						uni.navigateTo({
							url: `/pages/pagesA/paySuccess/paySuccess?goodids=${e[1].id}&web='true'`
						})
					} else {
						let {
							timeStamp,
							nonceStr,
							packages,
							signType,
							paySign
						} = res.data
						if (timeStamp && nonceStr && packages && signType && paySign) {
							uni.getSetting({
								withSubscriptions: true,
								success: (res) => {
									// res.subscriptionsSetting.mainSwitch && uni.requestSubscribeMessage({
									// 	tmplIds: ["-B9BhChq1uH8VOpg6dI4KjnCKYPtdg9IdayLZHPxD2M"],
									// success() {
									uni.requestPayment({
										timeStamp,
										nonceStr,
										signType,
										paySign,
										provider: 'wxpay',
										package: packages,
										success() {
											console.log('我是微信支付222',e[0]);
											// this.getWEBdata(e[0])
											uni.navigateTo({
												url: `/pages/pagesA/paySuccess/paySuccess?goodids=${e[1].id}&web=true&order=${e[0]}`
											})
										},
										fail: () => {
											e[2] == "noe" ?
												uni.navigateTo({
													url: e[4] == 1 ?
														`/pages/pagesA/goodsDetails/goodsDetails?id=${e[3]}` :
														`/pages/pagesA/myOrder/myOrder?e=1`
												}) :
												uni.navigateTo({
													url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${e[0]}&deliveryFee=${e[2]}&dizhi=${e[3]}`
												})
										}
									})
									// },
									// fail() {
									// 	console.log(123);
									// },
									// complete() {
									// 	console.log(456);
									// }
									// })
								}
							})
						}
					}
				} else {
					uni.showToast({
						title: '支付失败',
						icon: "none",
						duration: 2000
					})
				}
			})
		})

	},

};
