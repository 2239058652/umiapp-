###说明
  tenantId为"39602"
	
### 项目结构
```
├── components                             	// 组件
├── config                                  
│   ├── baseUrl.js                        	// 基础配置(域名、系统信息等)
│   ├── Interceptor.js                      // 请求，响应拦截
│   ├── request.js                          // 项目所有接口
│   ├── pay.js                              // 支付js(未使用)
│   └── login.js                        	  // 登录(未使用)
├── pages  									                // 项目页面
│   ├── goods                        	 	// 商品列表
│   ├── index                         		// 首页
│   ├── my                        	    	// 个人中心
│   └── user                                // 登录页等
├── pagesDome                              	// 项目分包
│   ├── canvas                            	// 绘图demo
│   ├── cartAnimation                       // 加入购物车demo
│   ├── getLocation                         // 获取定位
│   ├── http                              	// 接口使用demo
│   ├── login                             	// 登录使用demo
│   ├── mescroll                            // mescroll分页demo
│   ├── navbar                            	// 导航使用demo
│   ├── pay                               	// 支付使用demo
│   ├── showModal                         	// showModal使用demo
│   └── sticky                       	 	// 吸顶demo
├── pagesPackageA                           // 项目分包
│   └── address                            	// 地址
├── plugins                                 // 功能js
├── static                             		// 图片文件
├── store                          			// vuex
├── style
│   ├── common.scss                       	// 公共样式文件
│   └── iconfont.scss                     	// 图标样式
├── uni_modules                             
│   ├── fan-canvas                        	// 绘图通用方法
│   ├── mescroll-uni                        // mescroll分页
│   ├── uview-ui                          	// uview2.0
│   └── zhouWei-APPUpdate                   // app更新升级(wgt)
├── unpackage                              	// 项目编译后的文件
├── App.vue                                	// 项目基础文件
├── main.js                                	// 项目基础文件
├── manifest.json                          	// 项目基础文件
├── uni.scss                                // 项目基础文件
├── pages.json                             	// 项目基础文件json
├── README.md                              	// 项目介绍md
└── template.h5.html                       	// h5自定义模板
```


