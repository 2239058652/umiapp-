let baseUrl = "",
		AppID = "",
		tenantId = "",
		wxUrl = "",
		corpId = "", 
		WebSocketurl='',
		environment = 'development' //开发环境
		// environment='production' 		//生产环境 
		// environment='testing' 	 	//测试环境 
		tenantId = "39602"
if (environment === 'development') {
	//开发环境
	if (tenantId == '37121') {
		tenantId = '37121',
		baseUrl = 'https://newc.wp99.cn',
		AppID = 'wx916535daae8baa37',
		wxUrl = 'https://work.weixin.qq.com/kfid/kfc5815a2be537b8d84',
		corpId = 'wwda3acab9912e5c15'
	} else if (tenantId == '37903') {
		tenantId = '37903',
		baseUrl = 'https://newb.wp99.cn'
		AppID = 'wx1ffadbb99102113d',
		wxUrl = 'https://work.weixin.qq.com/kfid/kfc9daedbcd2ef437b3',
		corpId = 'ww59d19ed5673b8dea'
	} else if (tenantId == '39602') {
		tenantId = '39602', 
		baseUrl = 'https://newb.wp99.cn',
		//AppID = 'wxdc9ac7027ab63fc0', //宝源
		AppID = 'wx146cbade020c4608', //微铺
		wxUrl = '',
		corpId = ''
		// WebSocketurl='127.0.0.1:28031'
	}else if (tenantId == '37199') {
			tenantId = '37199',
			baseUrl = 'https://newb.wp99.cn',
			AppID = 'wx146cbade020c4608',
			wxUrl = '',
			corpId = ''
	}
} else if (environment === 'production') {
		//生产环境
		tenantId = '39602',
		baseUrl = 'https://microapp.aijiamart.cn',
		AppID = 'wx3bf823c58fc72f07',
		wxUrl = 'https://work.weixin.qq.com/kfid/kfc7b08704ec448633b',
		corpId = 'ww6b32ff1f6ce36595'
		WebSocketurl='microapp.aijiamart.cn/socket'
} else {
		// 测试环境
		tenantId = '39602',
		// baseUrl = 'http://192.168.1.100'
		baseUrl = 'http://192.168.1.8:80'
		AppID = 'wx146cbade020c4608',
		wxUrl = '',
		corpId = ''
}
export {
	baseUrl,
	AppID,
	tenantId,
	wxUrl,
	corpId,
	WebSocketurl
}
