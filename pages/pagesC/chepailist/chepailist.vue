<template>
<view>
	<view class="box">
		<view class="title">
			固定车牌
		</view>
		<view v-for="(item,index) in guding" class="list" :key="index" @click="xuanze(item)">
			<view>
				<view class="xinxi">
					车牌号：<text style="font-size: 35rpx;font-weight: 600;">{{item.carNo}}</text>
				</view>
				<view class="xinxi">
					车辆型号：{{item.carType}}
				</view>
				<view class="xinxi">
					车辆颜色：{{item.carColour}}
				</view>
			</view>
			<view class="caozuo" @click="del(item,index,0)">
				<view>
					删除
				</view>
			</view>
		</view>
		<view class="list" v-if="guding.length==0"
			style="display: flex;align-items: center;justify-content: space-around;">
			<view style="width: 100%;text-align: center;">还没添加固定车牌,快去添加吧</view>
		</view>
		<view>
			<view class="title">
				临时车牌
			</view>
			<view v-for="(item,index) in linshi" class="list" :key="index" @click="xuanze(item)">
				<view>
					<view class="xinxi">
						车牌号：<text style="font-size: 35rpx;font-weight: 600;">{{item.carNo}}</text>
					</view>
					<view class="xinxi">
						车辆型号：{{item.carType}}
					</view>
					<view class="xinxi">
						车辆颜色：{{item.carColour}}
					</view>
				</view>
				<view class="caozuo" @click="del(item,index,1)">
					<view>
						删除
					</view>
				</view>
			</view>
			<view class="list" v-if="linshi.length==0"
				style="display: flex;align-items: center;justify-content: space-around;">
				<view style="width: 100%;text-align: center;">还没添加临时车牌,快去添加吧</view>
			</view>
		</view>
		<view style="margin-left: 20rpx;">
			<view style="display: flex;">
				<u-switch v-model="value13" asyncChange @change="asyncChange" size='45' inactiveColor="rgb(7, 93, 249)"
					activeColor="rgb(36, 224, 144)"></u-switch>
				<view style="margin-left: 20rpx;">
					<u-icon name="question-circle" color="#2979ff" size="45" @click="show = !show"></u-icon>
				</view>
			</view>
			<view v-if="!value13">未授权</view>
			<view v-else>已授权</view>
		</view>
		
	</view>
<view class="tishi" v-show="show">
	<view>未授权：不提前扣积分、余额,出场时需要交停车费。</view>
	<view>授权：提前扣积分、扣余额、出场时会原路返还，并且赠送停车券</view>
</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				guding: [],
				linshi: [],
				isxiugai: '',
				value13: false,
				show: false,
				title: '温馨小提示',
				content: ''
			}
		},
		onLoad(e) {
			this.isxiugai = e.xiugai
			console.log('是佛修改', e);
			this.getlist()
		},
		methods: {
			queding(){
				this.show=false
			},
			asyncChange(e) {
				uni.showModal({
					content: e ? '确定要打开吗' : '确定要关闭吗',
					success: (res) => {
						if (res.confirm) {
							this.value13 = e
							console.log('是否开启',e);
							console.log('开',this.value13);
							if(e){
								this.isshouquan(1,e)
							}else{
								this.isshouquan(0,e)
							}
						}
					}
				})
			},
			del(item, index, falg) {
				this.$request.postremove({
					dtel: uni.getStorageSync('userInfo').mobile,
					carSns: item.carNo
				}, {
					// 'Content-type': 'application/json;charset=UTF-8',
					'Content-type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
				}).then(res => {
					console.log('删除', res);
					let obj = res
					if (JSON.stringify(obj) === "{}") {
						uni.showToast({
							title: '删除成功',
							duration: 2000,
							icon: "success"
						});
						if (falg == 0) {
							this.guding.splice(index, 1)
						} else {
							this.linshi.splice(index, 1)
						}
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1000)
					} else {
						uni.showToast({
							title: res,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			getlist() {
				this.$request.getphone({
					dtel: uni.getStorageSync('userInfo').mobile

				}).then(res => {
					console.log('列表', res);
					this.guding = res.temporaryCar
					this.linshi = res.immobilizationCar
				})
			},
			xuanze(item) {
				console.log('选择', item);
				let cph = item.carNo
				if (this.isxiugai == 1) {
					console.log('我是修改车牌');
					uni.$emit('chepaixiugai', {
						chepaihao: cph,
						zhuangtai: item.statusCarNo,
						type: item.carType,
						color: item.carColour,
						id: item.id
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 200)
				}

			},
			isshouquan(flag){
					
				this.$request.postauthorization({
					dtel: uni.getStorageSync('userInfo').mobile,
					status:flag
				},{
					'Content-type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
				}).then(res=>{
					if(JSON.stringify(res)=='{}' ){
						uni.showToast({
							title: '修改成功',
							duration: 2000
						});
						
					}else{
						uni.showToast({
							title: res.msg||'修改失败',
							duration: 2000,
							icon:'error'
						});
					}
				})
			}

		}
	}
</script>

<style>
	.tishi{
		width: 650rpx;
		padding:20rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		height: 200rpx;
		border: 2rpx solid #ccc;
		box-shadow: 7px 7px 9px #888888;
	}
	.list {
		height: 200rpx;
		width: 640rpx;
		background: linear-gradient(to right, rgb(7, 93, 249), rgb(36, 224, 144));
		margin: 0 auto;
		border-radius: 20rpx;
		margin: 20rpx;
		display: flex;
		color: #fff;
	}

	.box {
		width: 700rpx;
		margin: 0 auto;
	}

	.title {
		font-size: 35rpx;
		font-weight: 600;
		margin: 20rpx;
	}

	.xinxi {
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
		width: 363rpx;

	}

	.caozuo {
		margin-left: 140rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.caozuo>view {
		height: 80rpx;
		width: 120rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 20rpx;
		border: 1rpx solid #fff;
	}

	.xiugai {
		width: 500rpx;
		height: 400rpx;
		background-color: #fdfdfd;
		position: absolute;
		left: 50%;
		top: 40%;
		z-index: 999;
		transform: translate(-50%, -50%);
		padding: 20rpx;
		box-sizing: border-box;
		box-shadow: 7px 7px 9px #888888;
		border-radius: 10rpx;
	}
</style>
