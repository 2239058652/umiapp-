	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import {WebSocketurl} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				share: {
					title: '欢乐爱家',
					path: '/pages/tabbar/index/index', // 全局分享的路径
				},
				ss:'1111111'
			}
		},
		methods:{
			getWEBdata(order,flag){
				this.$request.getsend({
					mobile:uni.getStorageSync('userInfo').mobile,
					orderSn:order
				}).then(res=>{
					console.log('发送信息',res);
					console.log('订单编号',order);
					this.kaishi(res.userList,res.reg,order,flag)
				})
			},
			kaishi(userlist,reg,ordersn,flag){
				// this.$store.dispatch('WEBSOCKET_INIT',`ws://192.168.1.14:28031`)
				// console.log('地址为',ws://192.168.1.14:28031`);
				this.$store.dispatch('WEBSOCKET_INIT',`wss://${WebSocketurl}`)
				setTimeout(()=>{
					this.fasong1(userlist,reg,ordersn,flag)
				},500)
			},
			fasong1(userlist,reg,ordersn,flag){
				let list = userlist
				let arr = list.split(',');
				this.$store.dispatch('WEBSOCKET_SEND', reg)
				for(var i = 0 ; i<arr.length ;i++){
					if(flag==1){
						this.$store.dispatch('WEBSOCKET_SEND', `customer|order|${arr[i]}_admin|您有一个订单顾客申请退款，请您及时处理！orderSn=${ordersn}`)
					}else if(flag==2){
						this.$store.dispatch('WEBSOCKET_SEND', `customer|order|${arr[i]}_admin|小伙伴！你有订单被取消了，敬请注意处理！orderSn=${ordersn}`)
					}
					else{
						this.$store.dispatch('WEBSOCKET_SEND', `customer|order|${arr[i]}_admin|小伙伴！你有新的订单需要处理orderSn=${ordersn}`)
					}
					
				}
				this.guanbi()
			},
			guanbi(){
				setTimeout(()=>{
					this.$store.dispatch('CLOSE_SOCKET')
				},5000)
			}
			
		},
		
	
	}
	