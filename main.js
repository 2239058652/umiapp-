import Vue from 'vue'
import App from './App'

//权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;

// vuex
import store from '@/store'
Vue.prototype.$store = store;
	
// 引入uview
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'

import share from '@/mixins/share.js'
Vue.mixin(share)

// 接口请求
import request from'@/config/request.js';
Vue.prototype.$request = request;

import my from '@/common/my.js'
Vue.prototype.$env=0;//0代表开发环境 1代表正式打包环境 2代表正式环境但是需要打印和弹窗

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
// 拦截器
import '@/config/Interceptor.js';

// #ifndef H5
    app.$mount(); 
// #endif
// #ifdef H5
    RouterMount(app,router,'#app')
// #endif
