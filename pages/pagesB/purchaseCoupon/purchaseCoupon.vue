<template>
	<view class="box">
		<view class="top">
			<view @click="jilu()">
				<veiw class='jilu'>兑换记录</veiw>
			</view>
			<view class="top-box">
				<view class="title">
					我的余额：{{amountYe}}
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="">
				<view class="b-title"> <text class="aj aj-yinxingqia"></text>购买优惠券</view>
				<view class="b-box1">
					<view :class="['dan',a2==index?'active1':''] " v-for="(item,index) in list2" :key="index"
						@click.stop="xuanzedzq(index,item.payMoney,item.cardid,item)">
						<view class="" style="font-size: 30rpx;font-weight: 600; ">
							满{{item.consume||'0'}}-{{item.reduceMoney||'0'}}
						</view>
						<view class="" style="color:#f37b2a ;">
							{{item.payMoney||0}}¥
						</view>
						<view class="xqbtn" @click.stop="chakanxq(item)">详情</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 500rpx;">
			<u-popup :show="show" @close="close" @open="open" customStyle="height:800rpx;flex:none;" closeable='true' round='30'>
			            <view class="KY">
			                <view>
								优惠券类型: <text style="font-size: 35rpx;font-weight: 600;">{{keyong.busiName}}</text>
							</view>
							<view class="">
								限购：<text style="font-size: 35rpx;font-weight: 600;color: red;">{{keyong.receiveLimit}}</text>
							</view>
							<view>可用门店：</view>
							<view v-if="keyong.shops.length>0" style="display: flex;flex-wrap: wrap; " >
								<view class="" v-for="(itme,index) in  keyong.shops" style="width: 45%;font-size: 35rpx;font-weight: 600;" :key="index">
									{{itme.shopName}}
								</view>
							</view>
							<view v-else style="font-size: 35rpx;font-weight: 600;">
								所有门店可用
							</view>
			            </view>
					</u-popup>
		</view>
		<pay2 pay='pay' :isShow.sync="isShow" :price='suoxu' :choice="choice"  :cardNoList="cardNoList" :cardlength='cardlength' ></pay2>
		<view class="btn">
			<view style="font-size: 30rpx;font-weight: 600;margin-left: 30rpx;">所需金额：<text
					class="suoxu">{{suoxu}}</text></view>
			<view class="jiajian">
				<view @click="jian()" class="jian">-</view>
				<view>{{value}}</view>
				<view @click="jia()" class="jia">+</view>
			</view>
			<view class="btn1" @click="duihuan">立即兑换</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 兑换的数量
				yue: '1',
				a:'你好',
				value: 1,
				list2: [],
				a2: null, //选中卡券
				suoxu: 0,
				suoxu2: 0,
				isShow:false,
				  show: false,
				choice: [ //支付方式
					['微信支付', "aj aj-weixinzhifu", "weixinPay"],
					['卡支付', 'aj aj-huiyuan', "cardPay"]
				],
				cardlength:'0',
				cardNoList:[],
				pay:[],
				keyong:'',
				shops:[],
				amountYe:''
			};
		},
		onShow() {
			this.getlist()
			this.getKA()
			this.getyue()
		},
		methods: {
			// 兑换的数量
			jian() {
				if (this.value <= 1) return
				this.value--
				this.suoxu = this.suoxu2 * this.value
			},
			jia() {
				this.value++
				this.suoxu = this.suoxu2 * this.value
			},
			// 跳转到查看记录
			jilu() {
				uni.navigateTo({
					url: `/pages/pagesB/integral-conversion/integral-conversion`
				});
			},
			// 选择卡券
			xuanzedzq(index, price, id,item) {
				console.log('选择的',item);
				this.keyong = item
				this.a2 = index
				this.a1 = null
				this.suoxu = price * this.value
				this.suoxu2 = price //单个商品佣金
			},
			// 点击兑换
			duihuan() {
				this.$request.postbuyELecOrder({
				amount:this.suoxu,
				cardNo:'9966213960200001023',
				num:this.value,
				mobile:uni.getStorageSync('userInfo').mobile,
				elecCouponId:this.keyong.id
				},{
					'Content-type': 'application/x-www-form-urlencoded'
				}).then(res=>{
					console.log('res',res);
					if(res.code&&res.code!=200){
						uni.showToast({
							// title: res.msg,
							title: '兑换失败',
							duration: 2000,
							icon:"error"
						});
					}
				})
				// 	if (this.a2 != null) { //兑换红包  先不写
				// 		let that = this
				// 		uni.showModal({
				// 			title: '温馨小提示',
				// 			content: '兑换后不支持撤销哦~',
				// 			success: function(res) {
				// 				if (res.confirm) {
				// 					that.pay = [true,'']
				// 					console.log('成功',that.suoxu);
				// 					that.isShow = true
				// 				} else if (res.cancel) {
				// 					console.log('失败 ');
				// 				}
				// 			}
				// 		});
				// 	}
				//  else {
				// 	console.log('先选择');
				// }
			},
			getKA(){
				this.$request.postGetElecList({
					shopNo:uni.getStorageSync('storeSn'),
					 busiCode:''
				},{
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res=>{
					console.log('res',res);
					this.list2 = res
				})
			},
			chakanxq(item){
				this.keyong =  item
				this.show = true
			},
			  open() {
			          // console.log('open');
			        },
			        close() {
			          this.show = false
			          // console.log('close');
			        },
			getlist(){
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
					console.log('我有几张卡',res);
					let cards = []
					res.cards.forEach(item => {
						if (item.isBind == 1) {  //判断是否绑卡
							cards.push(item.cardNo)
						}else{
							
						}
					})
					this.cardlength = cards.length
					this.cardNoList = []
					cards.forEach((item) => {
						this.$request.postGetCardsByYe({
							cardNo: item
						}).then(res => {
							let cardYe = res.dye
							if (this.jfPrice == 0) {
								// if (Number(cardYe) >= Number(this.yfall.toFixed(2))) {
									this.cardNoList.push({
										card: item,
										cardye: cardYe
									})
								// }
							} else {
								this.cardNoList.push({
									card: item,
									cardye: cardYe
								})
							}
							console.log('我有几张卡',this.cardNoList);
						});
					})
				});
			},
			getyue(){
				this.$request
					.postGetAccountInformation({
						mobile: uni.getStorageSync('userInfo').mobile
					}, {
						'Content-type': 'application/x-www-form-urlencoded'
					})
					.then(res => {
						if (res.code == 200) {
							this.amountYe = res.data.amountYe == 0 ? res.data.amountYe : res.data.amountYe.toFixed(2);
						
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}
	.jiajian {
		display: flex;
	}
	.KY>view{
		height: 60rpx;
		line-height: 60rpx;
		font-size: 35rpx;
	}
	.xqbtn{
		width: 100%;
		height: 50rpx;
		background-color: red;
		border-radius: 25px;
		line-height: 50rpx;
		color: #fff;
	}
	.quanbu{
		margin: 5rpx 0  0 15rpx;
	}
	.jiajian>view {
		height: 60rpx;
		width: 60rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 40rpx;
	}

	.jia {
		border: 1px solid #ccc;
		border-radius: 50%;
	}

	.jian {
		border: 1px solid #ccc;
		border-radius: 50%;
	}

	.jilu {
		color: #fff;
		width: 120rpx;
		height: 50rpx;
		position: absolute;
		top: 30rpx;
		right: 40rpx;
		background-color: #fff;
		border-radius: 5px;
		color: black;
		line-height: 50rpx;
		text-align: center;
		font-size: 25rpx;
	}
	.kong {
		margin-top: 200rpx;
		width: 750rpx;
		text-align: center;
		font-size: 40rpx;

	}
	.top {
		position: relative;
		height: 15vh;
		width: 100vw;
		background: linear-gradient(to bottom, #e62c57, #f8071f);
		border: 1px solid transparent;
		box-shadow: 0px 5px 3px #595959;
		border-radius: 0 0 16px 10px;

	}

	.top-box {
		    height: 160rpx;
		    width: 70vw;
		    background-color: #fff;
		    border-radius: 20rpx;
		    margin: 0 auto;
		    margin-top: 85rpx;
		    box-shadow: 2px 5px 3px #595959;
	}

	.bottom {
		width: 94vw;
		height: 87vh;
		padding-top: 50rpx;
		margin: 0 auto;
	}

	.title {
		text-align: center;
		height: 150rpx;
		line-height: 150rpx;
		font-weight: 600;
		font-size: 40rpx;

	}

	.b-title {
		font-size: 33rpx;
		font-weight: 600;
		margin-top: 20rpx;
	}

	.b-title text {
		margin-right: 20rpx;
		font-size: 40rpx;

	}

	.aj-hongbao {
		color: red;
	}

	.aj-yinxingqia {
		color: #f8071f;
	}

	.b-box {
		display: flex;
		flex-wrap: wrap;
	}

	.b-box1 {
		display: flex;
		flex-wrap: wrap;
	}

	.dan {
		margin-top: 30rpx;
		    width: 318rpx;
		    height: 167rpx;
		background-color: #fff;
		text-align: center;
		border-radius: 5px;
		border: 1px solid #c3c3c3;
		display: flex;
		flex-direction: column;
		align-items: center;
		// justify-content: space-around;
		margin: 15rpx;
	}
	.dan>view{
		margin-top: 20rpx;
	}

	.active1 {
		border: 1px solid #f8071f;
	}

	.btn {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: -2px;
		width: 750rpx;
		height: 122rpx;
		align-items: center;
		color: black;
		background-color: #fff;
		padding-bottom: 20rpx;
	}

	.btn1 {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		width: 200rpx;
		background-color: #f8071f;
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}

	.suoxu {
		margin: 0 20rpx 0 20rpx;
		color: #f37b2a;
		    width: 75rpx;
		    display: inline-block;
		}
</style>
