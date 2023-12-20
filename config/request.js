import {
	baseUrl,
	AppID
} from '@/config/baseUrl.js'
let http = uni.$u.http
export default {
	// 首页信息
	getIndex: "/card-littlemall/home/mainIndex",
	// 商品分类
	getHotGoods: "/card-littlemall/home/getHotGoods",
	// 搜索页面 搜索接口
	getSearch(params, header) {
		return http.get("/card-littlemall/search/all", {
			params,
			header
		});
	},
	// 选择门店
	getSelectShop(params, header) {
		return http.get("/card-littlemall/wpDeliveryStore/selectShop", {
			params,
			header
		});
	},

	// tabbar页面
	//超市十二个标题
	postQueryMarketMenu(params) {
		return http.post("/card-littlemall/home/queryMarketMenu", params);
	},
	// 超市分类
	postGoodsCategory(params) {
		return http.post("/card-littlemall/new/goodsCategory", params);
	},
	//百货
	getCargoPage(params, header) {
		return http.get("/card-littlemall/home/cargoPage", {
			params,
			header
		});
	},
	// 百货首页
	getBhHome(params) {
		return http.get('/card-littlemall/home/bhHome', {
			params
		});
	},
	// 登录页面3个接口
	// 登录
	getLogin(params) { //没有code状态码
		return http.get(`/card-wxminiapp/user/wx/login`, {
			params
		})
	},
	// 手机号
	getPhone(params) { //没有code状态码
		return http.get(`/card-wxminiapp/user/wx/phone`, {
			params
		});
	},
	// 手机号
	getNewPhone(params) { //没有code状态码
		return http.get(`/card-wxminiapp/user/wx/newPhone`, {
			params
		});
	},
	// post登录
	postLogin(parameters, header) { //有code状态码
		return http.post("/card-auth/login", parameters, {
			header
		});
	},

	// 商品详情页3个接口
	// 商品信息
	getGoodsDetail(params) {
		return http.get("/card-littlemall/goods/getGoodsDetail", {
			params
		});
	},
	// 判断是否有库存
	postQueryGoodsStockCount(parameters, header) {
		return http.post("/card-littlemall/wpCartItem/queryGoodsStockCount", parameters, {
			header
		});
	},
	//加入购物车 
	async getAddCartItem(params) {
		let res = await http.get("/card-littlemall/wpCartItem/addCartItem", {
			params
		})
		// console.log('添加购物车数据是',res)
		// if(res.code!=200){
		// console.log() 
		// }
		uni.showToast({
			title: res.msg,
			icon: "none",
			duration: 2000
		})
		return res
	},

	// 修改购物车
	getUpdateCart(params) {
		return http.get('/card-littlemall/wpCartItem/updateCart', {
			params
		});
	},


	// theme页面
	// 获取页面数据 点击轮播组件进入theme
	postQuerySecondMenuList(parameters, header) {
		return http.post("/card-littlemall/home/querySecondMenuList", parameters, {
			header
		});
	},

	// 秒杀页面
	// 秒杀
	postAjaxSeckill: "/card-littlemall/wpSpikeInfo/ajaxSeckill",
	//时间段
	postQuerySpikeStartTimer(parameters, header) {
		return http.post("/card-littlemall/wpSpikeInfo/querySpikeStartTimer", parameters, {
			header
		});
	},
	// 收货地址页面
	// 查询所有地址
	postList2(parameters, header) {
		return http.post("/card-littlemall/wpReceiver/list2", parameters, {
			header
		});
	},
	// 删除地址
	postDelete2(parameters, header) {
		return http.post("/card-littlemall/wpReceiver/delete2", parameters, {
			header
		});
	},

	// 新增或修改页面
	// 新增地址
	postSave2(parameters, header) {
		return http.post("/card-littlemall/wpReceiver/save2", parameters, {
			header
		});
	},
	// 修改地址
	postUpdate2(parameters, header) {
		return http.post("/card-littlemall/wpReceiver/update2", parameters, {
			header
		});
	},

	// 下订单4个接口
	// 详情页面进入时
	async postBuynow(parameters, header) {
		return await http.post("/card-littlemall/member/buynow", parameters, {
			header
		});
	},
	// 购物车页面进入 查询商品
	getOrdercheck(params) {
		return http.get('/card-littlemall/member/ordercheck', {
			params
		});
	},
	// 详情页面进入 提交订单
	postSubmitorder(parameters, header) {
		return http.post("/card-littlemall/member/submitorder", parameters, {
			header
		});
	},
	// 提交订单  /card-littlemall/order/submitZg
	postSubmitZg(parameters, header) {
		return http.post("/card-littlemall/order/submit", parameters, {
			header
		});
	},
	// 查询购物车数量
	postCartnumber(parameters, header) {
		return http.post("/card-littlemall/wpCartItem/number", parameters, {
			header
		});
	},

	// 我的订单页面
	//  查询订单
	getMy(params) {
		return http.get('/card-littlemall/order/my', {
			params
		});
	},
	// 徽标
	getMemberIndex(params) {
		return http.get('/card-littlemall/member/index', {
			params
		});
		// toBeConfirmedOrderNum: 待确认
		// toBeEvaluatedOrderNum: 待评价
		// toBePaidOrderNum: 待支付 
		// toBeReceivedOrderNum: 待收货
		// toBeShippedOrderNum: 待配送
	},
	// 修改个人信息
	postxinxi(parameters, header) {
		return http.post("/card-littlemall/wxWeixinMembers/updateByMember", parameters, {
			header
		})
	},
	// 查询个人信息 （头像昵称）
	getMember(params) {
		return http.get('/card-littlemall/wxWeixinMembers/getMember', {
			params
		});
	},
	// 查询订单详情
	getView(params) {
		return http.get('/card-littlemall/order/view', {
			params
		})
	},
	//更换图标
	postMySetMenuList(parameters, header) {
		return http.post('/card-littlemall/home/getMySetMenuList', parameters, {
			header
		})
	},


	// 购物车
	// 查询商品
	getSelectCartItem(params) {
		return http.get('/card-littlemall/wpCartItem/selectCartItem2', {
			params
		});
	},
	//删除商品
	getDeleteCartIds(params) {
		return http.get('/card-littlemall/wpCartItem/deleteCartIds', {
			params
		});
	},

	// 我的订单页面
	// 取消订单
	cancelOrder(params) {
		return http.get('/card-littlemall/order/cancel', {
			params
		});
	},

	// 取消订单退款
	cancelUnconfirm(params) {
		return http.get('/card-littlemall/order/cancelUnconfirm', {
			params
		});
	},
	// 确认收货
	confirmGoods(params) {
		return http.get('/card-littlemall/order/confirmGoods', {
			params
		});
	},

	// 卡充值
	// 根据卡号获取充值方案
	postGetAppListByCardNo(parameters, header) {
		return http.post("/card-littlemall/cardRechargeScheme/getAppListByCardNo", parameters, {
			header
		});
	},

	// 根据手机号获取相关卡信息
	postGetCardsByMobile(parameters, header) {
		return http.post("/card-littlemall/cardbase/getCardsByMobile", parameters, {
			header
		});
	},
	// 根据卡号获取卡的基本信息 
	postGetCardsByYe(parameters, header) {
		return http.post("/card-littlemall/cardbase/getBaseInfoByCardNo", parameters, {
			header
		});
	},
	//付款码
	// 获取刷新付款码
	postPayMentCode(parameters, header) {
		return http.post("/card-littlemall/home/payMentCode", parameters, {
			header
		});
	},

	//领券中心
	// 查询电子券
	postCollectElecCenter(parameters, header) {
		return http.post("/card-littlemall/elecCoupon/collectElecCenter", parameters, {
			header
		});
	},
	// 领取电子券
	postCollectElecInfo(parameters, header) {
		return http.post("/card-littlemall/elecCoupon/collectElecInfo", parameters, {
			header
		});
	},
	// 查询领取领取的电子券
	// 领卡
	getCardsByMobile(params) {
		return http.get('/card-basebusi/cardbase/getCardsByMobile', {
			params
		});
	},

	// 卡号绑定
	postBindcard(parameters, header) {
		return http.post("/card-littlemall/weixinMemberCard/bindcard", parameters, {
			header
		});
	},

	// 卡号解绑
	postUnbindcard(parameters, header) {
		return http.post("/card-littlemall/weixinMemberCard/unbindcard", parameters, {
			header
		});
	},

	//立即申请会员卡
	getApply(params) {
		return http.get('/card-littlemall/membercard/apply', {
			params
		});
	},

	// 查询已领取电子券
	postQueryCollectElecList(parameters, header) {
		return uni.$u.http.post('/card-littlemall/elecCoupon/queryCollectElecList', parameters, {
			header
		});
	},

	//注册卡号
	// postModifyMemberInfo1(parameters,header) {
	//   return http.post("/card-littlemall/cardFMemberInfo/modifyMemberInfo1",parameters,{header});
	// },
	//
	postV1(parameters, header) {
		return http.post("/card-littlemall/openapi/v1", parameters, {
			header
		});
	},

	// 消费历史  
	postGetListByCardNoAndDays(parameters, header) {
		return http.post("/card-basebusi/CardSaleMx/getListByCardNoAndDays", parameters, {
			header
		});
	},

	// 积分商城首页
	getPointGoodsList(params) {
		return http.get('/card-littlemall/home/pointGoodsList', {
			params
		});
	},

	// 积分商城页面
	getPointMall(params) {
		return http.get('/card-littlemall/home/pointMall', {
			params
		});
	},

	// 查询积分
	postGetCardJf(parameters, header) {
		return http.post("/card-littlemall/member/getCardJf", parameters, {
			header
		});
	},

	// 获取运费
	postGetFreight(parameters, header) {
		return http.post("/card-littlemall/member/getFreight", parameters, {
			header
		});
	},

	//礼品专区
	postQueryGiveGift(parameters, header) {
		return http.post("/card-littlemall/new/queryGiveGift", parameters, {
			header
		});
	},

	// 历史记录
	postHistoryList(parameters, header) {
		return http.post("/card-littlemall/wpHistory/list", parameters, {
			header
		});
	},

	// 在线支付
	orderPayment(params) {
		return http.get('/card-littlemall/orderpay/payment', {
			params
		});
	},

	// 建行支付
	postJhPay(parameters, header) {
		return http.post("/card-littlemall/orderpay/jhPay", parameters, {
			header
		});
	},

	// 官方微信
	postCreateOrder(parameters, header) {
		return http.post("/card-wxminiapp/pay/createOrder", parameters, {
			header
		});
	},

	// 积分抽奖
	getMyPrize(params) {
		return http.get('/card-littlemall/wxActivity/getMyPrize', {
			params
		});
	},
	getInitActivity(params) {
		return http.get('/card-littlemall/wxActivity/initActivity', {
			params
		});
	},
	getLotteryDraw(params) {
		return http.get('/card-littlemall/wxActivity/lotteryDraw', {
			params
		});
	},

	// 商品详情优惠券
	postCheckCollectElecByGoodsId(parameters, header) {
		return http.post("/card-littlemall/elecCoupon/checkCollectElecByGoodsId", parameters, {
			header
		});
	},

	// 积分
	postUpdateJfByApi(parameters, header) {
		return http.post("/card-littlemall/wxActivity/updateJfByApi", parameters, {
			header
		});
	},

	// 查询支付记录
	postQueryOrderPyMethodByMobile(params) {
		return http.get("/card-littlemall/mallOrderPayMethod/queryOrderPyMethodByMobile", {
			params
		});
	},

	// 我的页面 查询余额、卡等
	postGetAccountInformation(parameters, header) {
		return http.post("/card-littlemall/member/getAccountInformation", parameters, {
			header
		});
	},

	// 积分变动
	postGetJfChangeDetail(parameters, header) {
		return http.post("/card-littlemall/member/getJfChangeDetail", parameters, {
			header
		});
	},

	// 卡金变动
	postGetCardYeChangeDetail(parameters, header) {
		return http.post("/card-littlemall/member/getCardYeChangeDetail", parameters, {
			header
		});
	},

	// 申请退货
	postThsave(parameters, header) {
		return http.post("/card-littlemall/wpOrderRefund/save", parameters, {
			header
		});
	},

	// 领取券
	getReceiveEle(params) {
		return http.get('/card-littlemall/elecCoupon/receiveEle', {
			params
		});
	},

	// 分享券
	getShareEle(params) {
		return http.get('/card-littlemall/elecCoupon/shareEle', {
			params
		});
	},

	// 判断秒杀活动是否结束
	postCheckSpikeActivity(parameters, header) {
		return http.post("/card-littlemall/member/checkSpikeActivity", parameters, {
			header
		});
	},

	// 再来一单
	// getOrderToCart(params) {
	//    return http.get('/card-littlemall/wpCartItem/orderToCart', {params});
	// },

	// 全部专柜分类
	getZgIndex(params) {
		return http.get('/card-littlemall/home/zgIndex', {
			params
		});
	},

	// 筛选专柜
	postZgList(parameters, header) {
		return http.post("/card-littlemall/home/zg/list", parameters, {
			header
		});
	},

	// 店铺详情
	postZgDetail(parameters, header) {
		return http.post("/card-littlemall/home/zgDetail", parameters, {
			header
		});
	},

	// 搜索店铺商品
	getZgpage(params) {
		return http.get('/card-littlemall/search/all', {
			params
		});
	},

	// 关注
	postGuanzhu(parameters, header) {
		return http.post("/card-littlemall/home/guanzhu", parameters, {
			header
		});
	},

	// 订单校验
	getOrdercheckZg(params) {
		return http.get('/card-littlemall/member/ordercheckZg', {
			params
		});
	},

	// 验证卡密码
	postValidPassword(parameters, header) {
		return http.post("/card-littlemall/cardInfo/validPassword", parameters, {
			header
		});
	},

	// 我的红包
	postGetRedElec(parameters, header) {
		return http.post("/card-littlemall/Electronic/getRedElec", parameters, {
			header
		});
	},

	// 专柜店铺二级分类
	getPageWithGoodCategory(params) {
		return http.get('/card-littlemall/search/pageWithGoodCategory', {
			params
		});
	},

	// 百货更多分类
	postMoreCate(parameters, header) {
		return http.post("/card-littlemall/home/moreCate", parameters, {
			header
		});
	},
	// 推广列表接口
	postUserList(parameters, header) {
		return http.post("/card-littlemall/tiansenRakeBackChg/hhrInfoNew", parameters, {
			header
		});
	},
	// 获取分享二维码
	postgetErweima(parameters, header) {
		return http.post("/card-littlemall/member/spreader/qrcode", parameters, {
			header
		})
	},
	// 获取拉新二维码 
	postqrcode(parameters, header) {
		return http.post("/card-littlemall/wpLxRecord/qrcode", parameters, {
			header
		})
	},
	// 绑定合伙人
	postpartner(parameters, header) {
		return http.post("/card-littlemall/member/spreader/bindMember", parameters, {
			header
		})
	},
	// 推广列表接口
	postUserList(parameters, header) {
		return http.post("/card-littlemall/tiansenRakeBackChg/hhrInfoNew", parameters, {
			header
		});
	},
	// 获取分享二维码
	postgetErweima(parameters, header) {
		return http.post("/card-littlemall/member/spreader/qrcode", parameters, {
			header
		})
	},
	// 合伙人接口
	// 生成红包/领取 type0是生成 type1 是领取 type2 是验证是否已经领取  source 是红包来源
	posthblist(parameters, header) {
		return http.post("/card-littlemall/Electronic/submit", parameters, {
			header
		})
	},
	// 生成红包id 
	posthbId(parameters, header) {
		return http.post("/card-littlemall/Electronic/elecId", parameters, {
			header
		})
	},
	// 获取红包领取列表
	posthbxqlist(parameters, header) {
		return http.post("/card-littlemall/Electronic/getElecInfo", parameters, {
			header
		})
	},
	// 在领取红包的时候  查看发红包领取详情
	posthbdata(parameters, header) {
		return http.post("/card-littlemall/Electronic/getElec", parameters, {
			header
		})
	},
	// 从合伙人页面进入查看红包领取详情 
	redxq(parameters, header) {
		return http.post("/card-littlemall/Electronic/list", parameters, {
			header
		})
	},
	// 合伙人模块 佣金排行
	postHHRyongjin(parameters, header) {
		return http.post("/card-littlemall/tiansenRakeBackYe/getRanking", parameters, {
			header
		})
	},
	// 合伙人模块邀请列表排行
	postHHRpaihang(parameters, header) {
		return http.post("/card-littlemall/wxMemberSpreader/getSpreaderRanking", parameters, {
			header
		})
	},
	// 合伙人模块 查看收益
	// postHHRshouyi(parameters, header) {
	// 	return http.post("/card-littlemall/tiansenRakeBackYe/list", parameters, {
	// 		header
	// 	})
	// },
	// 合伙人模块 查看收益
	getHHRshouyi(params) {
		return http.get('/card-littlemall/wpReturngoldInfo/returngoldInfo', {
			params
		});
	},
	// 合伙人提现
	posttixian(parameters, header) {
		return http.post("/card-littlemall/wpReturngoldInfo/rakeYeTx", parameters, {
			header
		})
	},
	// 合伙人提现记录   / jsStatus:'0' 是佣金详情列表   2 代表提现记录
	posttixian_list(parameters, header) {
		return http.post("/card-littlemall/tiansenRakeBackChg/list", parameters, {
			header
		})
	},
	// 删除我的订单中无用订单
	getisDelete(params) {
		return http.get('/card-littlemall/order/isDelete', {
			params
		});
	},
	// 合伙人商品推广列表
	getcommission(params){
		return http.get('/card-littlemall/tiansenRakeBackYj/commission', {
			params
		});
	},
	// 合伙人商品推广搜索   tiansenRakeBackYj/searchGoods?shopId=04006&tenantId=39602&name=苏菲
	getsearchGoods(params){
		return http.get('/card-littlemall/tiansenRakeBackYj/searchGoods', {
			params
		});
	},
	// 新人专享
	// /wpGoods/newMemberGoods?tenantId=39602&page=1
	getnewMemberGoods(params){
		return http.get('/card-littlemall/wpGoods/newMemberGoods', {
			params
		});
	},
	// 控制首页的新人是否现实
	getIsNewMemberGoods(params){
		return http.get('/card-littlemall/home/isNewMemberGoods', {
			params
		});
	},
	// 添加车牌
	postsave(parameters, header) {
		return http.post("/card-littlemall/WpCarInfo/save", parameters, {
			header
		})
	},
	// 查询已经绑定的车辆  
	getphone(params){ 
		return http.get('/card-littlemall/WpCarInfo/detail/phone',{
			params
		});
	},
	// 修改车牌号  /WpCarInfo/edit
	postedit(parameters, header) {
		return http.post("/card-littlemall/WpCarInfo/edit", parameters, {
			header
		})
	},
	
	// 删除车牌号
	postremove(parameters, header) {
		return http.post("/card-littlemall/WpCarInfo/remove", parameters, {
			header
		})
	},
	// 停车场开启、关闭授权
	postauthorization(parameters, header) {
		return http.post("/card-littlemall/WpCarInfo/authorization", parameters, {
			header
		})
	},
	//是否是新人 是否可以领取优惠券
	
	getnewPeople(params){ 
		return http.get('/card-littlemall/home/newPeople',{
			params
		});
	},
	// 商品推广的一级列表
	postqueryMenu(parameters,header){
		return http.post('/card-littlemall/home/queryMenu',parameters,{
			header
		})
	},
	// 商品推广的二级分类
	postgoodsCategory(parameters,header){
		return http.post('/card-littlemall/home/goodsCategory',parameters,{
			header
		})
	},
	
	// 卡消费存储密码
	postsave3(parameters,header){
		return http.post('/card-littlemall/wxCardPay/save',parameters,{
			header
		})
	},
	// 首页的固定提示
	getList(params){
		return http.get('/card-littlemall/wpArticles/list',{
			params
		})
	},
	// 购买优惠券列表
	postGetElecList(parameters,header){
		return http.post('/card-littlemall/rechargeElecCoupon/getElecList',parameters,{
			header
		})
	},
	
	postGetSpreaderRank(parameters,header){
		return http.post('/card-littlemall/wxMemberSpreader/getSpreaderRank',parameters,{
			header
		})
	},
	// 购买电子券生成订单
	postbuyELecOrder(parameters,header){
		return http.post('/card-littlemall/rechargeElecCoupon/buyELecOrder',parameters,{
			header
		})
	},
	// 获取websocked发送人信息
	getsend(params) {
		return http.get('/card-littlemall/order/send', {
			params
		});
	},
	// 获取实时配送地图
	postdistribution_H5(parameters,header){
		return http.post('/card-littlemall/member/distribution_H5',parameters,{
			header
		})
	},	// 查询提货点
	gettihuodian(params) {
		return http.get('/card-littlemall/sharedSelfgetArea/list', {
			params
		});
	},
}
