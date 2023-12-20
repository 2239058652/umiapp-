<template>
	<view class="da">
		<view class="yi">
			<!-- <navigation-ball></navigation-ball> -->
			<view class="bao1_title">
				等额红包
			</view>
			<view class="bao1 box">
				<view class="bao1_left">
					<u-icon color="#f44938" size="60" name="red-packet"></u-icon>
					<text>红包个数</text>
				</view>
				<view class="bao1_right">
					<input type="number" @input="onKeyInput1" class="tex" placeholder="填写个数">
					<view style="margin-right: 20rpx;">个</view>
				</view>

			</view>
		</view>
		<view class="bao1_title" @click="qihuan()">
			{{fang}}
		</view>
		<view class="yi" v-if="flag">

			<view class="bao1 box">
				<view class="bao1_left">
					<u-icon color="#f44938" size="60" name="rmb-circle"></u-icon>
					<text>单个红包金额</text>
				</view>
				<view class="bao1_right">
					<input type="number" @input="onKeyInput" class="tex" placeholder="￥0.00">
					<view style="margin-right: 20rpx;">元</view>
				</view>
			</view>
		</view>

		<view class="er" v-else>
			<view class="bao1 box">
				<view class="bao1_left">
					<u-icon color="#f44938" size="60" name="coupon"></u-icon>
					<text>可选红包券</text>
				</view>
				<view class="bao1_right" @click="xuan()" style="padding: 20rpx;">
					<u-icon size="30" name="arrow-down"></u-icon>
				</view>
			</view>
		</view>
		<view class="box3 ">
			<input type="text" @input="onKeyInput2" placeholder="输入您的祝福语 (默认:大吉大利,恭喜发财!)">
		</view>
		<!-- <view>ps:每个用户分到的红包不可低于1元</view> -->
		<view class="qian"><text>￥{{zong}}</text></view>
		<button class="btn" v-if="xian" open-type="share">转发微信群</button>
		<button class="btn" @click="jia()" v-else>转发微信群</button>
		<!-- <button class="btn"  open-type="share">转发微信群1</button>
		<button class="btn" >转发微信群</button> -->


	</view>
</template>

<script>
	export default {
		data() {
			return {
				fang: '自定义金额',
				flag: true,
				zong: '0.00',
				shu: 0,
				// 定义初始变量
				// remainSize:剩余人数
				// remainMoney : 剩余的金钱
				leftMoneyPackage: {
					remainSize: 5, // 可自行修改
					remainMoney: 10, // 原价,可自行修改
				},
				hou: 0,
				is1: false,
				is2: false,
				xian: false,
				title: '大吉大利,恭喜发财！',
				no: '',
				// 红包的最大金额
				zuida:100,
				chao:false,
				zuidasl:100,
				chao2:false
			}
		},
		// onShareAppMessage(res) {
		// 	console.log('点击了')
		// 	// this.shares()
		// 	if (res.from == 'button') {
		// 		// return {
		// 		// 	title: '电子券',
		// 		// 	path: `pages/pagesC/sharequan/sharequan?elecList=${JSON.stringify(this.elecList)}&mobile=${this.mobile}`,
		// 		// }
		// 	}
		// },
		onLoad() {},
		onShow() {
			// 每次进入页面都会重新生成id
			this.getid()
		},
		onShareAppMessage(res) {
			if (Number(this.shu) > 0 && Number(this.zong) > 0) {
				if (res.from == 'button') {
					this.shengchenghongbao()
					// uni.redirectTo({
					// 	url: `/pages/pagesC/redEnvelopes/redEnvelopes?zong=${this.zong}&shu=${this.shu}&title=${this.title}&no=${this.no}`
					// })
					return {
						title: '领红包',
						imageUrl: "https://i-1.lanrentuku.com/2020/11/6/d4bdb10c-8b78-465e-ac04-7e67cf1e1172.png?imageView2/2/w/500",
						path: `/pages/pagesC/redEnvelopes/redEnvelopes?zong=${this.zong}&shu=${this.shu}&title=${this.title}&no=${this.no}`,
					}
				} else {
				}
			} else {
			}
		},
		methods: {
			// 红包分配机制
			// getRandomNum(shu, zong) {
			// 	console.log(shu, zong)
			// 	var money = zong;
			// 	var num = shu;
			// 	var sum = 0.01; //红包默认金额
			// 	var arr  =  []
			// 	for (var i = 0; i < num - 1; i++) {
			// 		  sum = (this.getRandom(0.01, money/2)).toFixed(2);
			// 		                //总金额减去这个红包金额
			// 		                money = money - sum;
			// 		this.hou =  money.toFixed(2)

			// 		arr.push(sum)
			//  }
			//  arr.push(this.hou)
			//  console.log(arr)

			// },
			// getRandom(a, b) {
			// 	return Math.random() * (b - a) + a;
			// },
			// 红包分配机制结束
			// 判断填写的数据是否正确
			// 获取红包id
			getid() {
				this.$request.posthbId({}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					this.no = res
				})
			},
			// 判断输入是否正确
			jia() {
				if (Number(this.zong) <= 0) {
					uni.showToast({
						title: '请填写金额',
						icon: "none",
						duration: 2000,

					})
				}
				if (Number(this.shu) <= 0) {
					uni.showToast({
						title: '请填写个数',
						icon: "none",
						duration: 2000
					})
				}
				// 判断红包金额
				if(this.chao==false){
					uni.showToast({
						title: `红包金额不能超过${this.zuida}元`,
						icon: "none",
						duration: 2000
					})
				}
				// 判断红包数量
				if(this.chao2==false){
					uni.showToast({
						title: `红包数量不能超过${this.zuidasl}个`,
						icon: "none",
						duration: 2000
					})
				}
			},
			// 生成红包
			shengchenghongbao() {
				this.$request.posthblist({
					mobile: this.$store.state.userInfo.mobile,
					// mobile:'15036827643',
					elecId: this.no,
					quantityNum: this.shu,
					money: this.zong,
					// type 1是领取 0 是生成红包
					type: '0'
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
				})
			},
			xuan() {
				console.log('选择红包')
			},
			qihuan() {
				// if (this.flag) {
				// 	this.fang = '自定义金额'
				// 	this.flag = false
				// } else {
				// 	this.fang = '发红包券'
				// 	this.flag = true
				// }
			},
			// 文本框输入
			// 判断金额
			onKeyInput: function(event) {
				if (Number(event.target.value) > 0.0001) {
					this.is1 = true
					this.zong = event.target.value
					if(Number(event.target.value)>this.zuida){
						this.chao = false
					}else{
						this.chao = true
					}
					if (Number(this.shu) != 0 && Number(this.zong) != 0) {
						if(this.chao!=false&&this.chao2!=false){
							this.xian = this.is1 && this.is2
						}else{
							this.xian=false
						}
					}
				} else if (event.target.value == '' || event.target.value == 0) {
					this.is1 = false
					this.zong = '0.00'
					this.xian = this.is1 && this.is2
				}
			},
		// 判断个数
			onKeyInput1: function(event) {
				if (event.target.value > 0) {
					this.is2 = true
					this.shu = event.target.value
					if(Number(event.target.value)<=this.zuidasl){
						this.chao2=true
					}else{
						this.chao2=false
					}
					if (Number(this.shu) != 0 && Number(this.zong) != 0) {
						if(this.chao!=false&&this.chao2!=false){
							this.xian = this.is1 && this.is2
						}else{
							this.xian=false
						}
					}
				} else {
					this.is2 = false
					this.xian = this.is1 && this.is2
					this.shu = 0
				}
			},
			onKeyInput2(event) {
				if (event.target.value != '') {
					this.title = event.target.value
				} else {
					this.title = '大吉大利,恭喜发财！'
				}
			},
		},
	}
</script>

<style lang="scss">
	.btn {
		margin-top: 30rpx;
		font-size: 30rpx;
		width: 300rpx;
		height: 70rpx;
		color: #fff;
		border-radius: 10px;
		background-color: #fb5353;
	}

	page {
		background-color: #ededed;
	}

	.bao1_title {
		margin: 30rpx;
		color: #caa372;
	}

	.da .yi {
		margin-bottom: 30rpx;
	}

	.da .er {
		margin-bottom: 30rpx;
	}

	.bao1 {
		height: 100rpx;
		width: 700rpx;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 10px;
		justify-content: space-between;
	}

	.box {
		display: flex;
	}

	.bao1_left {
		display: flex;
		align-items: center;
	}

	.bao1_right {
		display: flex;
		align-items: center;
	}

	.tex {
		height: 20rpx;
		text-align: right;
		max-width: 200rpx;
		// background-color: #ededed;
	}

	.box3 {
		height: 130rpx;
		width: 700rpx;
		margin: 0 auto;
		border-radius: 10px;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box
	}

	.box3 text {
		padding-left: 40rpx;

		height: 130rpx;
		line-height: 130rpx;
	}

	.box3 input {
		width: 700rpx;
	}

	.qian text {
		font-size: 50rpx;
		font-weight: 600;
		text-align: center;


	}

	.qian {
		margin-top: 200rpx;
		width: 750rpx;
		text-align: center;
	}
</style>
