<template>
	<view class="conbox">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="积分抽奖" @clickLeft="back"></uni-nav-bar>
		<view class="container">
			<!-- 背景 -->
			<image src="../../../static/img/bg.png" class="cont"></image>
			<image src="../../../static/img/caidai.png" class="caidai" mode="widthFix"></image>
			<view class="header">
				<view class="header-title">
					<view class="left">
						积分： <text style="color: #E4431A;">{{totalPoints}}</text>
					</view>
					<view class="right" @click="getmyPrize">
						我的奖品 >
					</view>
				</view>
			</view>
			<view class="main">
				<view class="canvas-container">
					<view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
						<view class="canvas-line">
							<view class="canvas-litem" v-for="(item,index1) in awardsList" :key="index1"
								:style="[{transform:'rotate('+item.lineTurn+')'}]"></view>
						</view>

						<view class="canvas-list">
							<view class="canvas-item" :style="[{zIndex:index2}]" v-for="(iteml,index2) in awardsList"
								:key="index2">
								<view class="canvas-item-text" :style="[{transform:'rotate('+iteml.turn+')'}]">
									<text>{{iteml.award}}</text>
									<image class="canvas-item-text-img" src="../../../static/img/xiaolian.png"
										v-if="iteml.type == 'XXCY'"></image>
									<image class="canvas-item-text-img" src="../../../static/img/youhuiquan.png"
										v-if="iteml.type == 'DZQ'"></image>
									<image class="canvas-item-text-img" src="../../../static/img/xiaolian.png"
										v-if="iteml.type == 'YE'"></image>
									<image class="canvas-item-text-img" src="../../../static/img/jifenimg.png"
										v-if="iteml.type == 'LPK'"></image>
								</view>
							</view>
						</view>
					</view>
					<view @tap="playReward" class="canvas-btn" :class="btnDisabled">开始</view>
					<view class="mask" v-show="isShow"></view>
				</view>
			</view>
			<!-- 规则 -->
			<view class="guize">
				<view class="title">
					规则说明
				</view>
				<view class="g_item" v-for="(item,index) in description" :key="index">
					{{item}}
				</view>

			</view>
			<!-- 我的奖品 -->
			<view class="shadowbox" v-if="flag" @click="closeshadow">
				<view class="myrewards" @click.stop="openshadow">
					<view class="title">
						我的奖品
					</view>
					<view class="itembox">
						<view class="item" v-for="(items,i) in myPrizelist" :key="i">
							<text class="left">{{items.description}}</text>
							<text class="right">{{items.drawTime}}</text>
						</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				awardsList: {}, //奖项
				animationData: {}, //动画
				btnDisabled: '',
				flag: 0, //控制我的奖品显示隐藏
				myPrizelist: [], //奖品列表
				contentList: [],
				activityId: '',
				totalPoints: 0,
				description: [],
				isShow: false
			}
		},
		onShow() {
			this.jpName = ''
			this.cardNoList = []
			this.nowcard = ''
			if (uni.getStorageSync('token') == '') {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
				return
			}
			this.$request.postGetCardsByMobile({
				mobile: this.$store.state.userInfo.mobile
			}).then(res => {
				if (res.cards.length == 0) {
					uni.showModal({
						content: "您还没有卡，是否去申请卡",
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/pagesA/receive/receive'
								})
							} else {
								uni.navigateBack({
									delta: 1
								})
							}
						}
					})
				} else {
					let bindTrue = res.cards.some(item => {
						return item.isBind == 1
					})
					if (bindTrue == false) {
						uni.showModal({
							content: "您还没有绑卡，是否去绑卡",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/pagesA/bindcard/bindcard'
									})
								} else {
									uni.navigateBack({
										delta: 1
									})
								}
							}
						})
					} else {
						this.cardNoList = []
						res.cards.forEach(item => {
							if (item.isBind == 1) {
								this.cardNoList.push(item.cardNo)
								this.nowcard = this.cardNoList[0]
							}
						})
					}
				}
			});
		},
		onLoad(){
			// 获取奖品列表
			this.initdata(this)
		},
		onUnload() {
			// 页面卸载的时候，清除动画数据
			this.animationData = {};
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			openshadow() {
				this.flag = 1
			},
			closeshadow() {
				this.flag = 0
			},
			// 初始化抽奖数据
			initdata(that) {
				that.$request.getInitActivity({
					mobile: uni.getStorageSync('userInfo').mobile,
				}).then(res => {
					// that.chishu = res.num;
					// 获取奖品的个数
					// var awarrlength = res.contentList.length
					that.totalPoints = res.cardShopPoint
					that.contentList = res.contentList
					that.activityId = res.activity.id

					let plist = [];
					let des = res.activity.memo.indexOf(';')
					that.description.push(res.activity.memo.substring(0, des))
					plist.push(des)
					while (des != -1) {
						des = res.activity.memo.indexOf(';', des + 1);
						if (des != -1) {
							plist.push(des)
						}
					}
					plist.forEach((ite, index) => {
						that.description.push(res.activity.memo.substring(plist[index] + 1, plist[index +
							1]))
					})
					// 为每一项追加index属性
					that.contentList.forEach(function(element, index) {
						element.index = index
					})
					// 画转盘
					that.drawAwardRoundel();
				})
			},
			//画抽奖圆盘
			drawAwardRoundel() {
				// 拿到奖品列表
				var awardsList = [];
				// 每份奖品所占角度
				var turnNum = 1 / this.contentList.length * 360; // 文字旋转 turn 值  
				// 奖项列表  
				for (var i = 0; i < this.contentList.length; i++) {
					awardsList.push({
						turn: i * turnNum + 'deg', //每个奖品块旋转的角度
						lineTurn: i * turnNum + turnNum / 2 + 'deg', //奖品分割线的旋转角度
						award: this.contentList[i].awardName, //奖品的名字,
						type: this.contentList[i].awardType,
						id: this.contentList[i].prizeId
					});
				}
				// this.btnDisabled = this.chishu ? '' : 'disabled';
				this.awardsList = awardsList;
			},
			// 查看奖品
			getmyPrize() {
				this.flag = 1
				this.$request.getMyPrize({
					activityId: this.activityId,
					mobile: uni.getStorageSync('userInfo').mobile,
				}).then(res => {
					// data.lists.forEach(function(element,index){
					// 	element.createtime=this.dateformat(element.createtime)
					// })
					this.myPrizelist = res
				})
			},

			//发起抽奖  
			playReward() {
				var that = this
				if (that.totalPoints == 0) {
					uni.showToast({
						title: '积分不够，无法抽奖',
						icon: 'none'
					})
					return
				}
				if (that.isShow) {
					uni.showToast({
						title: '请耐心等待抽奖结果,切勿重复点击否则大奖将会流失',
						icon: 'none',
						mask: true
					})
					return
				}
				that.isShow = true
				that.btnDisabled = 'disabled';
				//抽奖方法比较慢先转几圈
				var animationRun = uni.createAnimation({
					duration: 2500,
					timingFunction: 'linear'
				})
				animationRun.rotate(360 * 2).step();
				that.animationData = animationRun.export();
				// that.runDeg = 60*Math.random()
				// 获取奖品
				that.$request.getLotteryDraw({
					activityId: that.activityId,
					mobile: uni.getStorageSync('userInfo').mobile,
				}).then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true,
							duration: 2000,
						})
						that.btnDisabled = that.totalPoints ? '' : 'disabled';
						return
					}
					that.jpName = res.data.name
					that.totalPoints = res.data.cardShopPoint
					var awardIndex = res.data.index
					// that.chishu = res.freeNum
					that.awardsList.forEach(function(element, index) {
						if (element.award == res.data.name) {
							awardIndex = index
						}
					})
					uni.createSelectorQuery().select('#zhuanpano').boundingClientRect(function(data) {
						data.style = ''
					}).exec()


					//中奖index  
					var awardsNum = that.contentList;
					// let awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数  
					var runNum = 4; //旋转8周  
					var duration = 4000; //时长  

					// 旋转角度  
					that.runDeg = 0;
					var preDeg = that.runDeg
					that.runDeg = that.runDeg + (360 - that.runDeg % 360) + (360 * runNum - awardIndex * (360 /
						awardsNum.length)) + 1
					//创建动画  
					if (process.env.VUE_APP_PLATFORM == 'h5') {
						console.log('zheshi H5');
						// document.styleSheets[0]
						document.getElementById('zhuanpano').style =
							'animation:rotate_before 4s 0ms ease forwards;'
						if (document.styleSheets[0].cssRules.length > 0) {
							Array.from(document.styleSheets[0].cssRules).forEach(function(element, index) {
								if (element.name == 'rotate_before') {
									// 删除上次插入的动画
									document.styleSheets[0].deleteRule(index)
								}
							})
						}

						// console.log(document.styleSheets[0].cssRules)
						// console.log("@keyframes rotate_before{from{ transform: rotate("+preDeg+"deg); }to{ transform: rotate("+that.runDeg+"deg);}}")
						// 插入定义的动画
						document.styleSheets[0].insertRule(
							"@keyframes rotate_before{from{ transform: rotate(" + preDeg +
							"deg); }to{ transform: rotate(" + that.runDeg + "deg);}}", 8);

					} else {
						var animationRun = uni.createAnimation({
							duration: duration,
							timingFunction: 'linear'
						})
						animationRun.rotate(that.runDeg).step();
						that.animationData = animationRun.export();
					}
					// 					// #ifndef H5
					// 					console.log(document.styleSheets)
					// 					document.getElementById('zhuanpano')
					// 					// #endif
					that.$request.postUpdateJfByApi({
						activityId: that.activityId,
						mobile: uni.getStorageSync('userInfo').mobile,
					}, {
						'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
						if (res.code == 200) {
							// 中奖提示
							var awardsConfig = that.contentList;
							var awardType = that.contentList[awardIndex].awardType;
							if (awardType != "XXCY") {
								setTimeout(function() {
									that.isShow = false
									uni.showModal({
										title: '恭喜',
										content: '获得' + (that.jpName),
										showCancel: false,
										success: function() {
											// 置空style  否则动画不生效
											setTimeout(function() {
												uni.createSelectorQuery()
													.select(
														'#zhuanpano')
													.boundingClientRect(
														function(data) {
															data.style = ''
														}).exec()
											}, 1000)
											var animationRun = uni.createAnimation({
												duration: 0,
												timingFunction: 'step-start',
											})
											animationRun.rotate(0).step();
											that.animationData = animationRun.export();
										}
									});
									that.btnDisabled = '';
								}.bind(that), duration);
							} else {
								setTimeout(function() {
									that.isShow = false
									uni.showModal({
										title: '很遗憾',
										content: '没中奖,谢谢参与',
										showCancel: false,
										success: function() {
											// 置空style  否则动画不生效
											setTimeout(function() {
												uni.createSelectorQuery()
													.select(
														'#zhuanpano')
													.boundingClientRect(
														function(data) {
															data.style = ''
														}).exec()
											}, 1000)
											var animationRun = uni.createAnimation({
												duration: 0,
												timingFunction: 'step-start'
											})
											animationRun.rotate(0).step();
											that.animationData = animationRun.export();
										}
									});
									that.btnDisabled = '';
								}.bind(that), duration);
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				})

			},

		}

	}
</script>
<style lang="scss">
	.conbox {
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.mask {
		width: 100rpx;
		height: 107rpx;
		position: absolute;
		left: 41%;
		top: 41%;
		z-index: 99999;
	}

	.container,
	image.cont {
		width: 100%;
		min-height: 100vh;
		height: auto;
		position: relative;
	}

	image.cont {
		height: 100%;
		position: absolute;
		z-index: 0;
	}

	image.caidai {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.header {
		padding-bottom: 40rpx;
		position: relative;
		z-index: 99;
	}

	.header-title {
		width: 100%;
		display: flex;

		.left {
			line-height: 50rpx;
			margin: 20rpx 40rpx 0 40rpx;
			padding: 8rpx 16rpx;
			border: 1px solid #d89720;
			color: #d89720;
			font-size: 28rpx;
			border-radius: 26rpx;
		}

		.right {
			width: 20%;
			height: 50rpx;
			line-height: 50rpx;
			margin: 20rpx 40rpx 0 40rpx;
			padding: 8rpx 16rpx;
			border: 1px solid #d89720;
			color: #d89720;
			font-size: 28rpx;
			border-radius: 26rpx;
		}
	}

	/* 转盘 */
	.canvas-container {
		margin: 0 auto;
		position: relative;
		width: 600rpx;
		height: 600rpx;
		background: url(../../../static/img/circle.png) no-repeat;
		background-size: cover;
		border-radius: 50%;
		margin-bottom: 25rpx;
	}

	.canvas {
		width: 100%;
		height: 100%;
		display: block !important;
		border-radius: 50%;
	}

	.canvas-content {
		// position: absolute;
		// left: 0;
		// top: 0;
		// z-index: 1;
		display: block;
		width: 600rpx;
		height: 600rpx;
		border-radius: inherit;
		/* background-clip: padding-box; */
		/* background-color: #ffcb3f; */
	}

	.canvas-element {
		position: relative;
		z-index: 1;
		width: inherit;
		height: inherit;
		border-radius: 50%;
	}

	.canvas-list {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 9999;
	}

	.canvas-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		color: #e4370e;
		/* text-shadow: 0 1rpx 1rpx rgba(255, 255, 255, 0.6); */
	}

	.canvas-item-text {
		position: relative;
		display: block;
		padding-top: 46rpx;
		margin: 0 auto;
		text-align: center;
		-webkit-transform-origin: 50% 300rpx;
		transform-origin: 50% 300rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FB778B;
	}

	.canvas-item-text text {
		font-size: 30rpx;
	}

	.canvas-item-text-img {
		width: 50rpx;
		height: 50rpx;
		padding-top: 30rpx;
	}

	/* 分隔线 */
	.canvas-line {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 99;
	}

	.canvas-litem {
		position: absolute;
		left: 300rpx;
		top: 0;
		width: 3rpx;
		height: 300rpx;
		background-color: rgba(228, 55, 14, 0.4);
		overflow: hidden;
		-webkit-transform-origin: 50% 300rpx;
		transform-origin: 50% 300rpx;
	}

	/**  
* 抽奖按钮  
*/
	.canvas-btn {
		position: absolute;
		left: 260rpx;
		top: 260rpx;
		z-index: 9999;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		color: #f4e9cc;
		background-color: #e44025;
		line-height: 80rpx;
		text-align: center;
		font-size: 26rpx;
		text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
		box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
		text-decoration: none;
	}

	.canvas-btn::after {
		position: absolute;
		display: block;
		content: ' ';
		left: 12rpx;
		top: -44rpx;
		width: 0;
		height: 0;
		overflow: hidden;
		border-width: 30rpx;
		border-style: solid;
		border-color: transparent;
		border-bottom-color: #e44025;
	}

	.canvas-btn.disabled {
		pointer-events: none;
		background: #b07a7b;
		color: #ccc;
	}

	.canvas-btn.disabled::after {
		border-bottom-color: #b07a7b;
	}

	.canvas-btn-table {
		color: #A83FDB;
		width: 120rpx;
		text-align: center;
		position: absolute;
		left: 240rpx;
		top: 360rpx;
		font-size: 26rpx;
		background-color: #FFFFFF;
		opacity: 0.9;
	}

	.typecheckbox {
		position: relative;
		z-index: 6;
		top: -60rpx;
		color: #fff;
		font-size: 28rpx;
		float: right;
		margin-bottom: 20rpx;
	}

	.typecheckbox view {
		border: 1px solid #FF3637;
		background: transparent;
		color: #FF3637;
		height: 60rpx;
		width: 140rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 60rpx;
		margin-left: 20rpx;
		margin-top: 10rpx;
	}

	.typecheckbox view.active {
		background: #FF3637;
		color: #fff;
	}

	.guize {
		width: 502rpx;
		min-height: 300rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 3;
		background-image: linear-gradient(-180deg, #F48549 0%, #F2642E 100%);
		border: 18rpx solid #E4431A;
		border-radius: 16px;
		margin: 0 auto;
		padding: 48rpx;
		/* box-sizing: border-box; */
		color: #fff;
	}

	.guize .title {
		text-align: center;
		margin-bottom: 28rpx;
	}

	.guize .g_item {
		font-family: PingFang-SC-Medium;
		font-size: 24rpx;
		color: #FFFFFF;
		letter-spacing: 1rpx;
		text-align: justify;
		margin-bottom: 2rpx;
	}

	.shadowbox {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.myrewards {
		width: 90%;
		margin: 0 auto;
		min-height: 80rpx;
		background: #FFEEDF;
		border: 10rpx solid #F2692F;
		color: #333;
		font-size: 24rpx;
		font-family: PingFang-SC-Medium;
		border-radius: 40rpx;
		padding-bottom: 20rpx;
	}

	.myrewards .title {
		font-family: PingFang-SC-Bold;
		font-size: 32rpx;
		color: #E4431A;
		letter-spacing: 1rpx;
		display: flex;
		padding-top: 36rpx;
		justify-content: center;
	}

	.myrewards .itembox {
		max-height: 320rpx;
		overflow-y: auto;
	}

	.myrewards .item {
		width: 100%;
		height: 66rpx;
		padding: 0 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
