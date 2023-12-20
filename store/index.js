import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let files=require.context("./modules", false, /\.js$/)
let store={
	state: {
		socketTask: null
	},
	mutations: {
	    WEBSOCKET_INIT (state, url) {
	        state.socketTask = uni.connectSocket({
	            url,  // url是websocket连接ip
	            success () {
	                console.log('websocket连接成功')
	            }
	        })
	        state.socketTask.onOpen((res) => {
	            console.log('WebSocket连接正常打开中...！')
	            // 注：只有连接正常打开中 ，才能正常收到消息
	            state.socketTask.onMessage(res => {
	                console.log('收到服务器内容：' + res.data)
	            });
	        })
	    },
	    WEBSOCKET_SEND (state, data) {
			console.log('发送消息',state, data);
	        state.socketTask.send({
	           data,
	           async success() {
	               console.log('消息发送成功')
	           },
	       })
	    },
	    CLOSE_SOCKET (state) {
	        if (!state.socketTask) return
	        state.socketTask.close({
	            success (res) {
	                console.log('关闭成功', res)
	            },
	            fail (err) {
	                console.log('关闭失败', err)
	            }
	        })
	    }
	},
	actions: {
	    WEBSOCKET_INIT({
	        commit
	                   }, url) {
	        commit('WEBSOCKET_INIT', url)
	    },
	    WEBSOCKET_SEND({
	        commit
	                   }, data) {
	        commit('WEBSOCKET_SEND', data)
	    },
	    CLOSE_SOCKET({
	        commit
	                 }) {
	        commit('CLOSE_SOCKET')
	    }
	}
}
files.keys().forEach((key) => {
  Object.assign(store.state, files(key)["state"]);
  Object.assign(store.mutations, files(key)["mutations"]);
  Object.assign(store.actions, files(key)["actions"]);
});
export default new Vuex.Store(store)

