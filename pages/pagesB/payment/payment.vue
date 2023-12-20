<template>
	<view class="payment" :style="{height:height}">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left" title="付款码" @clickLeft="jump(1)"></uni-nav-bar>
		<uni-icons type="back" size="30" @click="jump(1)"></uni-icons>
		<u-empty text="点击登录查看您的信息" mode="data" marginTop="65% 0 0 0" textSize="30" iconSize="160" iconColor="#bcbcbc"
			@click.native="jump" v-if="show"></u-empty>
		<view v-if="!show && nowcode != ''" class="body">
			<view>
				<u-avatar size="120" shape="circle" :src="userInfo.avatarUrl"></u-avatar>
				<text>{{mobile}}</text>
				<text class="aj aj-iconhuaban1-06" @click="changecard"></text>
			</view>
			<image class="bg" :src="image" mode="widthFix"></image>
			<view :class="bgcontents">
				<view v-show="fukuanma||dier">
					<image class="image" :src="nowcode" mode="widthFix"></image>
				</view>
			<!-- 	<view v-else  class="passwordFlase">
						请刷新输入密码后查看
				</view> -->
				<!-- <view v-show="fukuanma">
					<image class="image" :src="nowcode" mode="widthFix"></image>
				</view> -->
				<view><text>No.{{nowcard}}</text><text @click="refresh">刷新付款码</text></view>
			</view>
		</view>
	<view class="" v-if="!dier"> 
			<u-popup :show="passWordshow" mode="center" @close="closeCode" round="30" closeIconPos="top-right" closeable="false">
					<view class="input">
						请输入密码
						<u-code-input v-model="value"  dot :focus="focus" size="70" @finish="finish">
						</u-code-input>
					</view>
					
				</u-popup>
	</view>
		<u-empty text="您还没有会员卡" mode="data" marginTop="30% 0 0 0" textSize="30" iconSize="160" iconColor="#bcbcbc"
			v-if="empShow"></u-empty>
		<u-popup :show="isShow" :round="10" mode="bottom" @close="close">
			<view class="pop" v-for="(item,index) in cards" :key="index" @click="choosecard(item,index)">
				{{item}}
			</view>
		</u-popup>
	</view>
</template>
<script>
	import {
		tenantId
	} from '@/config/baseUrl.js'
	export default {
		data() {
			return {
				cards: [],
				userInfo: '',
				passWordshow:false,
				value:'',
				height: getApp().globalData.equipment.screenHeight + "px",
				show: true,
				mobile: '',
				nowcard: "",
				nowcode: '',
				codeList: [],
				isShow: false, //选卡弹出层
				empShow: false,
				image: '',
				bgcontents:'',
				fukuanma:false,
				dier:true
			}
		},
		onPullDownRefresh() { //下拉刷新
			this.postPayMentCode(1)
		},
		onShow() {
			tenantId == '37121' ? (this.image = '../../../static/img/card-bg.png',this.bgcontents='bgcontent1') : (this.image = '../../../static/img/aijia.jpg',this.bgcontents='bgcontent')
			this.show = uni.getStorageSync('token') == ''
			this.userInfo = this.$store.state.userInfo
			if (!this.show) {
				this.mobile = this.userInfo.mobile.replace(this.userInfo.mobile.slice(3, 7), "****")
				this.postPayMentCode()
			}
		},
		methods: {
			finish(e){
				this.$request.postValidPassword({
					dcard: this.nowcard,
					password: e
				}).then(res1=>{
					console.log('我是验证卡',res1);
					if(res1.code==200&&res1.data){
						this.fukuanma =true
						this.passWordshow =false
						this.value=''
						this.cuncumima(e,this.nowcard)
					}else if(res1.data==false){
						this.value=''
						console.log('密码错误');
						uni.showToast({
							title: '密码错误',
							duration: 2000,
							icon:'error'
						});
					}
				})
			},
			yanzhengPassWord(card){
				this.$request.postValidPassword({
					dcard: card,
					password: this.value
				}).then(res1=>{
					console.log('我是验证卡',res1);
					if(res1.code==200&&res1.data){
						this.fukuanma =true
						this.passWordshow =false
						this.value=''
						this.cuncumima(this.value,card)
					}else if(res1.data==false){
						console.log('密码错误');
						this.value=''
						uni.showToast({
							title: '密码错误',
							duration: 2000,
							icon:'error'
						});
					}
				})
			},
			cuncumima(pass,cardNo){
				this.$request.postsave({
					passwd:pass,
					dtel:uni.getStorageSync('userInfo').mobile,
					cardNo:cardNo,
				},{
					'Content-type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA=='
				}).then(res=>{
					console.log('保存密码',res);
				})
			},
			closeCode(){
				this.passWordshow = false
			},
			refresh() {
				this.passWordshow=true
				this.postPayMentCode()
			},
			postPayMentCode(e) {
				this.value=''
				this.$request.postPayMentCode({
					mobile: this.userInfo.mobile,
				}).then(res => {
					console.log('我的爱',res.data[0].randomCodePwd);
					if (res.code == 200) {
						
						if(res.data[0].randomCodePwd==1){
							this.dier = false
							console.log('启用',this.dier);
						}else{
							this.passWordshow=false
							this.dier = true
						}
						this.passWordshow=true
						this.fukuanma=false
						this.cards = res.data.map((val) => val.cardNo);
						if (this.cards.length == 0) {
							this.empShow = true
						}
						this.codeList = res.data.map((ite) => ite.randomBarcode)
						this.nowcard = this.cards[0]
						this.nowcode = this.codeList[0]
						e == 1 & uni.stopPullDownRefresh() //停止刷新
						
						
						
						
						
						
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}

				})
			},
			jump(e) {
				e == 1 ? uni.navigateBack({
					delta: 1
				}) : uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
			},
			changecard() {
				this.isShow = true
			},
			close() {
				this.isShow = false
			},
			choosecard(ite, index) {
				console.log('切换卡号',ite);
				this.value=''
				this.fukuanma =false
				this.isShow = false
				this.nowcard = ite
				this.nowcode = this.codeList[index]
				this.passWordshow=true
			},
		}
	}
</script>

<style lang="scss">
	.passwordFlase{
		background:none !important;
		width: 100% !important;
		text-align: center !important;
		    height: 200rpx;
		    line-height: 195rpx;
			font-size: 33rpx;
	}
	.input {
		width: 95%;
		text-align: center;
		margin: 0 auto;
		margin-top: 66rpx;
		margin-bottom: 66rpx;
	}
	.payment {
		background: linear-gradient(190deg, #ff8262 25%, #ff435b 90%);

		.uni-icons {
			position: fixed;
			top: 4.5%;
			left: 1%;
		}

		.uniui-back:before {
			font-weight: 900;
			font-size: 50rpx;
		}

		.bg {
			width: 97%;
			display: block;
			margin: 0 auto;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
		}

		.bgcontent1 {
			width: 97%;
			position: absolute;
			top: 45%;
			left: 11rpx;
			font-size: 27rpx;

			view:first-child {
				width: 86%;
				margin: 0 auto;
				background-color: #fff;
				padding-top: 24rpx;

				.image {
					width: 100%;
					display: block;
					margin: 0 auto;
				}
			}

			view:nth-child(2) {
				display: flex;
				justify-content: space-between;
				margin: 4% 0;
				padding: 0 10rpx;
			}
		}

		.bgcontent {
			width: 97%;
			position: absolute;
			bottom: 20rpx;
			left: 11rpx;
			color: #fff;
			font-size: 27rpx;
			background: #e70012;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 10rpx;

			view:first-child {
				width: 86%;
				margin: 0 auto;
				background-color: #ffffff;
				padding-top: 24rpx;

				.image {
					width: 100%;
					display: block;
					margin: 0 auto;
				}
			}

			view:nth-child(2) {
				display: flex;
				justify-content: space-between;
				margin: 1% 0;
				padding: 0 10rpx;
			}
		}

		.body {
			margin-left: 2.5%;
			border-radius: 30rpx;
			width: 95%;
			background: white;
			position: relative;
			padding-bottom: 50rpx;

			.u-avatar {
				display: inline-block;
				vertical-align: middle;
			}

			.aj-iconhuaban1-06 {
				position: absolute;
				right: 5%;
				top: 9%;
			}

			>view:nth-child(1) {
				padding: 30rpx;
				margin-top: 30%;

				>text:nth-child(2) {
					margin-left: 3%;
				}

				>view:nth-child(4) {
					color: #f2f2ef;
					font-size: 35rpx;
					padding: 20rpx;
					margin: 30rpx 0 0 0.5%;
					background: #d0d0c4;
					border-radius: 0 0 15rpx 15rpx;

					div {
						margin-top: 20rpx;
					}
				}
			}

		}

		.pop {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0 auto;
			border-bottom: 1rpx solid #f0f0f0;
		}
	}
</style>
