<template>
	<view class="box">

		<view class="haopaibox" style="justify-content: space-between;" @click="zhonglei()">
			<view>车辆种类 {{type}}</view>
			<view>
				<uni-icons type="forward" size="20"></uni-icons>
			</view>

		</view>
		<view class="haopaibox" style="justify-content: space-between;" @click="xiugai()">
			<view>修改车牌 <text style="color: red;margin-left: 20rpx;">*添加车牌号不用选择</text></view>
			<view>
				<uni-icons type="forward" size="20"></uni-icons>
			</view>

		</view>
		<view v-if='zhognleiflag' class="zhongleiflag">
			<view style="font-weight: 600;text-align: center;margin: 20rpx;">车辆种类</view>
			<scroll-view scroll-y="true" class="scroll-Y">
				<view v-for="(item,index) in zhognlei " :key="index" class="zlitem" @click="typefuzhi(item)">
					{{item.type}}
				</view>
			</scroll-view>
		</view>
		<view class="haopaibox">
			<view>号码号牌 </view> <input @click="shuru()" v-model="chepaihao" disabled="true" type="text" maxlength="8"
				class="input" placeholder="请输入爱车号码号牌">
		</view>
		<view class="haopaibox">
			<view>车辆颜色</view> <input v-model="color" type="text" class="input" placeholder="请输入爱车颜色">
		</view>

		<u-keyboard ref="uKeyboard" @change="valChange" disabled-keyboard='true' @backspace="backspace"
			autoChange='true' mode="car" :show="show" @confirm='confirm' @cancel="cancel"></u-keyboard>
		<view class="btns" v-if="BtnFlag">
			<u-button color="linear-gradient(to right, rgb(7, 93, 249), rgb(36, 224, 144))" text="添加为固定车辆"
				@click="bangding(1)"></u-button>
			<u-button color="linear-gradient(to right,  rgb(7, 93, 249), rgb(36, 224, 144))" text="添加为临时车辆"
				@click="bangding(0)"></u-button>
		</view>
		<view class="btns"  v-else>
			<u-button color="linear-gradient(to right, rgb(7, 93, 249), rgb(36, 224, 144))" text="保存"
				@click="xiugaiCPH()"></u-button>
		</view>
		<view @click="bangdinglists()" class="bangdingList">
			查看绑定信息
		</view>

	</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				value: '',
				value2: '',
				chepaihao: '',
				color: '',
				zhognlei: [{
						type: '小型燃油汽车'
					},
					{
						type: '大型燃油汽车'
					},
					{
						type: '大型新能源汽车'
					},
					{
						type: '小型新能源汽车'
					},
					{
						type: '教练汽车'
					},
					{
						type: '摩托车'
					},
					{
						type: '临时行驶车'
					},

				],
				zhognleiflag: false,
				type: '',
				zhuangtai: '',
				BtnFlag: true,
				xiugaiID: '',
				isxiugai:0
			}
		},
		onShow() {
			this.type = this.zhognlei[0].type
			let that = this
			uni.$once('chepaixiugai', function(data) {

				console.log('监听到事件来自 update ，携带参数 msg 为：' + data.chepaihao);
				that.chepaihao = data.chepaihao
				that.color = data.color
				that.type = data.type
				that.zhuangtai = data.zhuangtai
				that.xiugaiID = data.id
				that.BtnFlag = false
			})
		},
		methods: {
			confirm() {
				console.log('点击完成', this.chepaihao);
				console.log('点击完成', this.color);
				this.show = false
			},
			cancel() {
				console.log('点击关闭');
				this.show = false
			},
			shuru() {
				this.show = true
			},
			valChange(val) {
				console.log('输入',val);
				if(this.chepaihao.length>7){
					return
				}
				// 将每次按键的值拼接到value变量中，注意+=写法
				this.chepaihao += val;
				console.log(this.chepaihao);
			},
			backspace() {
				// 删除value的最后一个字符
				if (this.chepaihao.length) this.chepaihao = this.chepaihao.substr(0, this.chepaihao.length - 1);
				console.log(this.chepaihao);
			},
			change(e) {
				console.log('内容改变，当前值为：' + e);
			},
			finish(e) {
				console.log('输入结束，当前值为：' + e);
			},
			zhonglei() {
				this.zhognleiflag = true
			},
			typefuzhi(item) {
				console.log(item);
				this.type = item.type
				this.zhognleiflag = false
			},
			bangdinglists() {
				uni.navigateTo({
					url: '/pages/pagesC/chepailist/chepailist'
				})
			},
			xiugai() {
				console.log('修改');
				uni.navigateTo({
					url: '/pages/pagesC/chepailist/chepailist?xiugai=1'
				})
			},
			bangding(flag) {
				if( this.type==''||this.chepaihao==''||this.color==''){
					uni.showToast({
						title: '请完善车辆信息！',
						duration: 2000,
						icon:"error"
					});
					return
				}
				this.$request.postsave({
					statusCarNo: flag,
					carType: this.type,
					carNo: this.chepaihao,
					carColour: this.color,
					sociusId: '', //新会员id
					enabled: 1,
					description: '',
					dtel: uni.getStorageSync('userInfo').mobile
				}, {
					// 'Content-type': 'application/x-www-form-urlencoded',
					'Content-type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
				}).then(res => {
					console.log('res', res);
					if(res.code&&res.code==400){
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon:"error"
						});
					}else{
					let obj = res
						if(JSON.stringify(obj) === "{}"){
							this.chepaihao = ''
							console.log('保存成功');
							uni.showToast({
								title: '保存成功',
								duration: 2000,
								icon:"success"
							});
							uni.navigateTo({
								url:'/pages/pagesC/chepailist/chepailist'
							})
						}else{
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon:"none"
							});
						}
					}
					
				})
			},
			xiugaiCPH() {
				if( this.type==''||this.chepaihao==''||this.color==''){
					uni.showToast({
						title: '请完善车辆信息！',
						duration: 2000,
						icon:"error"
					});
					return
				}
				this.$request.postedit({
					statusCarNo: this.zhuangtai,
					carType: this.type,
					carNo: this.chepaihao,
					carColour: this.color,
					sociusId: '', //新会员id
					enabled: 1,
					description: '',
					dtel: uni.getStorageSync('userInfo').mobile,
					id: this.xiugaiID
				}, {
					'Content-type': 'application/json;charset=UTF-8',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
				}).then(res => {
					console.log('修改', res);
					if(res.code==200){
						uni.showToast({
							title: '修改成功',
							duration: 2000,
							icon:"success"
						});
					}
				})
			}

		}
	}
</script>

<style>
	.btns {
		margin-top: 20rpx;
	}

	.btns>button {
		margin-bottom: 20rpx;
	}

	.box {
		width: 700rpx;
		margin: 0 auto;

	}

	.haopaibox {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #e3e3e3;
		border-top: 1rpx solid #e3e3e3;
		height: 80rpx;
	}

	.input {
		height: 80rpx;
		line-height: 80rpx;
		width: 500rpx;
		padding-left: 20rpx;
	}

	.zhongleiflag {
		width: 500rpx;
		height: 700rpx;
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

	.zlitem {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		border-top: 1rpx solid #d6d6d6;
		margin-left: 20rpx;
	}

	.scroll-Y {
		height: 600rpx;
	}

	.bangdingList {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background: linear-gradient(to right, rgb(7, 93, 249), rgb(36, 224, 144));
		border-radius: 10rpx;
		color: #fff;
	}
</style>
