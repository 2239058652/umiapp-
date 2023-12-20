<template>
	<view class="order u-skeleton">
		<uni-nav-bar @clickLeft="back" leftWidth="120px" fixed="false" statusBar="false" leftText="确认订单"
			left-icon="back"></uni-nav-bar>
		<view class="u-skeleton-fillet" v-if="option.length != 0">
			<!-- 选择方式 -->
	<view class="u-skeleton-fillet">
		<view :class="[sign == 'distribution' ? 'aj aj-jinrujiantou' : '']" 
			>
			<template v-if="sign=='distribution'">
				<view v-if="isDizhi" @click="sign=='distribution' ? jump(`/pages/pagesA/address/address`) : ''">请填写收货地址</view>
				<view v-for="(item,i) in peisong" :key="i" @click="sign=='distribution' ? jump(`/pages/pagesA/address/address`) : ''">
					{{i}}：<text>{{item}}</text>
				</view>
				<view v-for="(item,i) in ziqu" :key="item" :class="[i=='提货时间' ? 'aj aj-jinrujiantou':''] "
					v-if="isZt" @click="zitilist">
					{{i}}：<text>{{item}} </text>
				</view>
				 <text v-if="isZt" @click="zitilist"  class="aj aj-jinrujiantou zitijiantou"></text>
			</template>
		</view>
	</view>
			<!-- 商品信息 -->
			<view class="u-skeleton-fillet">
				<view class="store" v-for="(item1,index1) in commodity" :key="index1">
					<view class="shopName">{{item1.shopName}}</view>
					<view v-for="(item,index) in item1.cartItemList" :key="index">
						<view class="tu">
							<image :src="item.pic"></image>
							<view>
								<view>
									<view>{{item.barcode}}</view>
									<text>{{item.name}}</text>

								</view>
								<view v-if="isxinren!='newMember'">
									<text v-if="msprice == 'undefined'">￥{{item.yprice||spmoney}}</text>
									<text v-if="msprice != 'undefined'">￥{{msprice}}</text>
									<view><text>X</text> {{item.quantity}}</view>
								</view>
								<view class="" v-else>
									<text>￥{{item.sprice||spmoney}}</text>
								</view>
							</view>
						</view>
						<view class="hongbao u-skeleton-fillet" v-if="item.redPrice&&item.money">
							<text>
								<text class="aj aj-hongbao"></text>
								可使用红包：
								<text style="font-size: 38rpx;color: red;font-weight: 600;">{{item.redPrice}}</text>
							</text>
							<text>
								+现金：
								<text>{{item.money}}</text>
							</text>
						</view>
					</view>
					<!-- <view v-for="(item,index) in item1.cartItemList" :key="index">
						<view>红包：{{item.redPrice}}</view>
						<view>现金：{{item.money}}</view>
						
					</view> -->

					<view class="hongbao u-skeleton-fillet" v-if="isElec==1">
						<text>
							<text class="aj aj-hongbao"></text>
							可使用红包：
							<text style="font-size: 38rpx;color: red;font-weight: 600;">{{ _price }}</text>
						</text>
						<text>
							+现金：
							<text>{{ cost}}</text>
						</text>
					</view>
					<view class="psmethod">
						<view>
							<view class="youhui" @click="chooseps(index1)">
								<text>配送方式</text>
								<text>{{item1.psmethods}}<text class="aj aj-jinrujiantou"></text></text>
							</view>
							<view v-if="item1.pssign == 'selfGet'">
								<picker mode="multiSelector" :value="dateTime" @change="changeDateTime"
									@columnchange="changeDateTimeColumn" :range="dateTimeArray">
									<view class='otherCheck' style='display: flex;justify-content:space-between;'
										@click="chostime(index1)">
										<text>提货时间：</text>
										<view v-if="item1.ztTime==undefined" style="    color: red;
    position: relative;
    margin-right: 2%;
    padding-right: 20rpx;">请选择提货时间<text class="aj aj-jinrujiantou"></text></view>
										<view v-else>{{item1.ztTime}}</view>
									</view>
								</picker>
							</view>
						</view>
						<u-popup :show="show1" mode="center" :round="10" @close="show1=false">
							<view class="popps">
								<view>请选择配送方式</view>
								<view>
									<view v-for="(item,index) in option" :key="item.sign"
										@click="choosepsmethod(item,index)" :class="{'active' : index==xuan}"
										:style="deliveryMethodLeng==1?'width:100%':''">
										{{item.name}}
									</view>
								</view>
							</view>
						</u-popup>
						<view class="youhui" @click="usecoupon(item1)" v-if="isWeipuShop!=1">
							<text>优惠券</text>
							<text>{{item1.coupons}}<text class="aj aj-jinrujiantou"></text></text>
						</view>
						<view class="youhui" @click="useRedEnvelopes(item1)" v-if="isWeipuShop==1">
							<text>红包</text>
							<text>{{item1.redenvelopes}}<text class="aj aj-jinrujiantou"></text></text>
						</view>
						<view>
							<text>商品总额</text>
							<view v-if="jfPrice ==0">￥{{item1.totalPrice}}</view>
							<view v-if="jfPrice !=0">{{jfPrice}}积分<text v-show="syMoney!= 0">+￥{{syMoney}}现金</text>
							</view>
						</view>
						<view>
							<text>运费</text>
							<view>{{item1.pssign=='selfGet'?'免运费':isDizhi ?0:item1.zgdelievy}}</view>
						</view>
					</view>
				</view>
				<view class="storebottom">
					<view class="zongjia" v-if="jfPrice !=0">
						<text>商品总价</text>
						<text>{{jfPrice}}积分<text v-show="syMoney!= 0">+￥{{syMoney}}现金</text></text>
					</view>
					<view class="peisong">
						<text>总配送费</text>
						<text>{{alldelivery}}</text>
					</view>
					<view class="total">
						<text>订单总额</text>
						<text>
							<text v-show="jfPrice !=0">{{jfPrice}}积分</text>
							<text v-show="jfPrice != 0 && totalPrice != 0">+</text>
							<text v-show="totalPrice != 0">￥{{totalPrice.toFixed(2)}}</text>
						</text>
						<text v-show="totalPrice == 0 && jfPrice == 0">￥{{totalPrice.toFixed(2)}}</text>
					</view>
				</view>
			</view>
			<!-- 备注 -->
			<view class="u-skeleton-fillet">
				<text>备注信息：</text>
				<u--textarea v-model="remarks" @blur="blur" border="none" maxlength="30" fixed="true"
					placeholder="选填,订单备注(30字以内)" placeholder-style="color: #a5a5a5"></u--textarea>
			</view>
		</view>
		<!-- 下单 -->
		<view v-if="option.length != 0" class="u-skeleton-fillet">
			<text v-show="jfPrice == 0">共计{{ allNum }}件&nbsp;&nbsp;&nbsp;&nbsp;合计</text><text
				v-show="jfPrice == 0">￥{{totalPrice.toFixed(2)}}</text>
			<text v-show="jfPrice != 0">实际支付：<text class="jfzj">{{jfPrice}}积分<text
						v-show="totalPrice != 0">+￥{{totalPrice.toFixed(2)}}</text></text></text>
			<view class="button" @click.self="buttom">{{button}}</view>
		</view>
		<pay :userlist="userList" :reg = 'reg' :ordersn='ordersn'  :pay="pay" :isShow.sync="isShow" :choice="choice" :cardNoList="cardNoList" :cardlength='cardlength'></pay>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>
<style lang="scss">
	@import "@/static/style/uni.scss";

	.active {
		background-color: red !important;
	}

	.aj-hongbao {
		color: #d41313;
		font-size: 40rpx;
	}

	.guige {
		display: flex;
		color: #999;
	}

	.guige text {
		// display: inline-block !important;
		margin: 0 15rpx 0 15rpx;

	}
	.order {
		$bj: #ffffff;
		$font: #a5a5a5;

		.store {
			margin-bottom: 10rpx;
			background-color: #FFFFFF;
			padding: 20rpx;
			border-radius: 15rpx;
		}

		.shopName {
			padding: 10rpx 0 15rpx 0;
			font-size: 35rpx;
			font-weight: 600;
			border-bottom: 1rpx solid #e0dfdf;
			margin-bottom: 10rpx;

		}

		.popps {
			width: 90%;
			margin: 20rpx auto;

			&>view:first-child {
				text-align: center;
				padding: 20rpx 0;
				font-weight: 600;
				font-size: 35rpx;
			}

			&>view:nth-child(2) {
				display: flex;
				width: 90%;
				justify-content: space-between;
				margin: 20rpx auto;
				height: 70rpx;
				line-height: 70rpx;

				>view {
					width: 40%;
					text-align: center;
					background-color: #f7cbc8;
					color: #fff;
				}
			}
		}

		.psmethod {
			&>view {
				padding: 15rpx 0;
				border-bottom: 1rpx solid #eee;
			}

			&>view:first-child {
				&>view:first-child {
					display: flex;
					justify-content: space-between;
				}
			}

			.otherCheck {
				position: relative;
				padding: 10rpx 0;

				&>text:nth-child(2) {
					color: red;
					position: relative;
					margin-right: 2%;
					padding-right: 20rpx;
				}
			}

			&>view:nth-child(2),
			>view:last-child {
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				border-bottom: none;
			}

			>view:nth-child(3),
			>view:nth-child(4) {
				display: flex;
				justify-content: space-between;
				padding: 0;
			}

			>view:nth-child(4) {
				padding: 15rpx 0;
			}
		}

		@mixin gong($back:$bj) {
			padding: 20rpx;
			background: $back;
			border-radius: 15rpx;
		}

		.aj-jinrujiantou:after {
			font-size: 50rpx;
			font-weight: 900;
			color: black;
		}

		>view:nth-child(2) {
			padding-bottom: 80rpx;

			@include chamfer(0rpx) .aj-jinrujiantou:after {
				@include absolute(50%, 95%);
				transform: translateY(-50%);
			}

			>view:first-child {
				@include gong;
				margin-top: 10rpx;
				margin-bottom: 15rpx;

				>text {
					display: inline-block;
					width: 50%;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 35rpx;
					background: #f7f7f7;
					border-radius: 10rpx;
					text-align: center;
				}

				.onlytext {
					width: 100%;
					background: #f7cbc8;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 35rpx;
					border-radius: 10rpx;
					text-align: center;
					color: #fff;
				}

				.text {
					background: #f7cbc8;
					color: #fff;
				}

				>view {
					position: relative;
					width: 100%;

					.aj-jinrujiantou:after {
						@include absolute(90%, 95%);
					}

					&>view:last-child {
						margin-top: 20rpx !important;
					}

					>view {
						width: 94%;
						margin: 20rpx 0;
						color: $font;

						@include hide(1, 42rpx) text {
							color: black;
						}
					}
				}
			}

			>view:nth-child(2) {
				margin-bottom: 15rpx;

				.tu {
					@include flex(row nowrap, pace-between, "");
					margin-top: 20rpx;

					image {
						@include image(100rpx, 100rpx, 15rpx);
						margin-right: 10rpx;
					}

					>view {
						@include flex(row nowrap, space-between) width: 84%;

						view:first-child {
							text {
								@include hide(1)
							}
						}

						view:nth-child(2)>view {
							margin-left: 70%;
							font-size: 25rpx;

							text {
								font-size: 18rpx;
							}
						}
					}
				}

				.storebottom {
					background: #ffffff;
					border-radius: 15rpx;
					padding: 10rpx
				}

				.peisong,
				.total,
				.zongjia {
					@include flex(row nowrap, space-between) margin: 15rpx 0;

					>text:first-child {
						color: $font;
					}
				}

				.youhui {
					padding: 10rpx 0;

					&>text:nth-child(2) {
						color: red;
						position: relative;
						margin-right: 2%;
						padding-right: 20rpx;
					}
				}

				.total {
					margin-bottom: 0;
				}
			}

			>view:nth-child(3) {
				@include gong;
				margin-bottom: 130rpx;

				text {
					color: $font
				}

				textarea {
					width: 100%;
					height: 150rpx;
					margin-top: 15rpx;
				}
			}
		}

		>view:nth-child(3) {
			$color: #fd764b;
			padding: 20rpx 20rpx 40rpx 20rpx;
			position: fixed;
			bottom: 0;
			box-sizing: border-box;
			z-index: 10;
			width: 100%;
			background-color: #fff;

			>text:nth-child(2) {
				font-size: 38rpx;
				font-weight: 900;
				color: $color;
			}

			.jfzj {
				font-weight: 900;
				color: $color;
				font-size: 38rpx;
			}

			.button {
				width: 200rpx;
				height: 75rpx;
				float: right;
				background: $color;
				color: #fff;
				text-align: center;
				line-height: 75rpx;
				border-radius: 15rpx;
			}
		}
	}
</style>
<script>
	const {
		dateTimePicker,
		getMonthDay
	} = require('@/config/dateTimePicker.js')
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				xuan: 0,
				loading: true, //控制骨架屏
				option: [], //选项列表
				sign: 'distribution', //默认选中配送上门
				remarks: "", //备注
				deliveryFee: 0, //运费
				calendar: false, //控制日历的开关
				button: "提交订单", //控制提交按钮样式
				totalPrice: 0, //总价
				commodity: [], //商品信息
				peisong: {},
				ziqu: {},
				pay: null, //组件传参
				choice: [ //支付方式 
					['微信支付', "aj aj-weixinzhifu", "weixinPay"],
					['卡支付', 'aj aj-huiyuan', "cardPay"]
				],
				jfPrice: 0, //积分
				syMoney: 0, //现金
				isShow: false,
				isDizhi: false,
				msprice: 'undefined',
				favourable: 0,
				spmoney: 0,
				cardNoList: [],
				dateTime: null,
				dateTimeArray: null,
				startYear: 2000,
				timeStr: '选择提货时间',
				cardlength: 0,
				deliveryMethodLeng: null,
				allNum: 0, //商品总数量
				show1: false,
				alldelivery: 0, //总运费
				receiverId: null,
				isuse: null,
				isWeipuShop: uni.getStorageSync('isWeipuShop'), // isWeipuShop == 1展示红包
				isZt: null, //判断是否有自提订单
				goodsTotalPrice: 0, //商品总金额选中的颜色
				xuanzhong_color: '红色', //选中的颜色
				xuanzhong_size: "xl",
				isElec: '',
				cost: '',
				_price: '',
				datas: [],
				goodIds:''  ,//选中商品的id
				shareMobile:'' ,//从合伙人来的 分享商品的分享者的手机号
				isxinren:"",
				CSshopNo:uni.getStorageSync('bh_num'),
				shopid222:'' ,//当前商品的门店
				iskuaidi:[],
				isNewMemberGoods:'',//新人商品标识
				isgouwuquan:'',
				//websocked
				userList:'1',
				reg:'2',
				ordersn:'3',
				cs_shopNo:uni.getStorageSync('bh_num')
			}
		},
		watch: {
			// 更改地址重新计算运费
			receiverId: {
				handler(newsId, old) {
					this.alldelivery = 0
					this.totalPrice = 0
					this.spPrice = 0
					this.a = 0
					this.title = ''
	
					if(this.option.length>0){
						
					
					this.commodity.forEach((item, index) => {
						this.commodity[index]['psmethods'] = this.option[0].name
						this.commodity[index]['pssign'] = this.option[0].sign
						this.commodity[index]['ygprice'] = item.totalPrice
						// 积分商品算运费价格传0
						if (this.jfPrice != 0) {
							this.totalPrice += item.syMoney
							this.a += item.syMoney
							this.totalPrice -= item.couponMoney
							this.spPrice = this.totalPrice
							// 积分商品
							this.$request.postGetFreight({
								order_receiverId: newsId,
								shopCode: item.shopCode,
								goodsWeight: item.goodsWeight,
								freightType: item.freightType,
								totalPrice: 0,
								goodsIds:this.goodIds
							}).then(res => {
								if (res.code != 200) {
									this.alldelivery = 0
									
									this.commodity[index]['zgdelievy'] = 0
									this.title = res.msg
									if (this.commodity[index]['pssign'] == "selfGet") {
										this.returnMsg = ''
									} else {
										this.returnMsg = res.msg
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								} else {
									this.commodity[index]['zgdelievy'] = Number(res.data.need_paymoney)
									this.alldelivery += Number(res.data.need_paymoney)
								}
								this.totalPrice = this.spPrice + this.alldelivery
							})
							return
						}
						// 计算运费
						if (this.commodity[index]['pssign'] != 'express') {					
							this.totalPrice += item.totalPrice
							this.a += item.totalPrice
							this.totalPrice -= item.couponMoney
							this.spPrice = this.totalPrice
							let changeprice = 0
							item.couponMoney == 0 ? changeprice = item.ygprice : changeprice = this.totalPrice
							this.$request.postGetFreight({
								order_receiverId: newsId,
								shopCode: item.shopCode,
								goodsWeight: item.goodsWeight,
								freightType: item.freightType,
								totalPrice: changeprice,
								goodsIds:this.goodIds
							}).then(res => {									
								if (res.code != 200) {
									this.alldelivery = 0
									this.commodity[index]['zgdelievy'] = 0
									this.title = res.msg
									if (this.commodity[index]['pssign'] == "selfGet") {
										this.returnMsg = ''
									} else {
										this.returnMsg = res.msg
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								} else {
									this.returnMsg = ''
									this.commodity[index]['zgdelievy'] = Number(res.data.need_paymoney)
									this.alldelivery = Number(res.data.need_paymoney)
								}
								//配送方式如果只有一种（上门自提） 的话 运费会展示错误（会增加上运费 但结算无问题 只有展示问题）
								if (this.commodity[index]['pssign'] == "selfGet") {
									this.alldelivery = 0
								}
								this.totalPrice = this.spPrice + this.alldelivery


							})
						} else {
							this.totalPrice += item.totalPrice
							this.a += item.totalPrice
							this.totalPrice -= item.couponMoney
							this.spPrice = this.totalPrice
							this.commodity[index]['zgdelievy'] = 0
							this.alldelivery = this.commodity[index]['zgdelievy']
							this.totalPrice = this.spPrice + this.alldelivery
						}
					}
					
					)}else{
						uni.showToast({
							title: '该商品未设置配送方式',
								duration: 2000,
								icon:'error'
						})
					}

				}
			},
			// 更改优惠券
		isuse: {
						handler(newcopon, oldcopon) {
							// this.title = ''
							if (this.isuse == null) return
							this.spPrice = newcopon.totalPrice - newcopon.couponMoney
							this.$request.postGetFreight({
								order_receiverId: this.receiverId,
								shopCode: newcopon.shopCode,
								goodsWeight: newcopon.goodsWeight,
								freightType: newcopon.freightType,
								totalPrice: this.spPrice,
								goodsIds:this.goodIds
							}).then(res => {
								if (res.code != 200) {
									this.isisgouwuquan = false
									this.alldelivery = 0
									newcopon.zgdelievy = 0
									this.title = res.msg
									if (newcopon.pssign == "selfGet") {
										this.returnMsg = ''
									} else {
										this.returnMsg = res.msg
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								} else {
									this.isisgouwuquan = true
									this.returnMsg = ''
									if (newcopon.pssign == "selfGet") {
										this.alldelivery = 0
									} else {
										this.alldelivery = Number(res.data.need_paymoney)
									}
									newcopon.zgdelievy = Number(res.data.need_paymoney)
								}
								this.totalPrice = this.a - newcopon.totalPrice + this.spPrice + this.alldelivery
								this.isuse = null
							}
							
							)
						}
					}
				
		},

		onLoad(e) {
			// 路径
			//传入开始展示年份startYear 结束展示年份endYear
			//自定义开始显示时间
			this.msprice = e.msprice
			this.returnMsg = "" //判断距离提示信息
			this.goodsweight = 0
			this.freightType = ''
			// parameter
			this.spPrice = 0
			this.type = '' //订单类型
			this.orderType = '' //buynow返回的订单类型
			this.spickId = e.spickId //秒杀标识
			this.spick = '', //buynow返回
				this.test = Boolean
			// this.shoppingBag = "",
			this.shopNo = getApp().globalData.shopNo
			this.shopid222 = JSON.parse(e.parameter).shopId
			this.mobile = this.$store.state.userInfo.mobile
			this.storeStart = null
			this.storeEnd = null
			this.psindex = null
			this.deliveryMethodId = null
			this.selfaddress = ''
			this.addtest = null //配送上门且没地址
			this.title = '' //运费计算失败提示
			let isNewMemberGoods = e.isNewMemberGoods
			this.isNewMemberGoods =  e.isNewMemberGoods
			this.initTime()
			let page = getCurrentPages()
			this.page = page[page.length - 2].route == "pages/pagesA/goodsDetails/goodsDetails" || page[page.length - 2]
				.route == "pages/pagesA/jfgoodsDetails/jfgoodsDetails"
			let {
				goodsId,
				ids,
				quantity: count,
				price,
				totalPrice,
				shopId,
				isElec,
				cost,
				_price,
				shareMobile,
				newMember
			} = JSON.parse(e.parameter);
		
			this.shopNo= shopId
			this.shareMobile = shareMobile// 赋值手机号
			// 	store = this.$store.state.locateInformation.storeList.filter(item => { //获取对应门店编号定位信息
					 
			// 		if(item.storeSn == this.shopid222){
			// 			return item
			// 		}else if(item.storeSn==this.CSshopNo){
			// 				return item
			// 		}
			// 	})[0]	
			// 	this.isxinren = newMember
			// 	this.shopid222= shopId
			// this.isElec = isElec
			// this.cost = cost
			// this._price = _price
			// this.selfaddress = store.address
			// this.ziqu = {
			// 	"门店名称": store.name,
			// 	"提货地点": store.address,
			// 	"自提信息": `取货时间${store.startTime}~${store.endTime}`,
			// 	// "提货时间": "选择提货时间"
			// }
			// this.shareMobile = shareMobile// 赋值手机号
			// this.storeStart = store.startTime
			// this.storeEnd = store.endTime
			console.log('全部门店',	getApp().globalData.mendian_list);
			// if(this.$store.state.locateInformation&&this.$store.state.locateInformation.storeList.length>0){
			if(	getApp().globalData.mendian_list&&	getApp().globalData.mendian_list.length>0){
				var	store=''
					store = 	getApp().globalData.mendian_list.filter(item => { //获取对应门店编号定位信息
						if(item.storeSn == this.shopNo){
							console.log('一样的1',item); 
							return item
						}
						// if(item.storeSn==this.CSshopNo){
						// 	console.log('一样的2',item);
						// 		return item
						// }
					})[0]
					console.log('过滤0-00',store,this.shopid222);
					if(!store){
						store = getApp().globalData.mendian_list.filter(item => { //获取对应门店编号定位信息
								if(item.storeSn==this.cs_shopNo){
									console.log('一样的2',item);
										return item
								}
							})[0]
					}
					console.log('过滤1',store,this.shopid222);
					this.isElec = isElec
					this.cost = cost
					this._price = _price
					this.selfaddress = store.address
					this.ziqu = {
						"门店名称": store.name,
						"提货地点": store.address,
						"自提信息": `取货时间${store.startTime}~${store.endTime}`,
						// "提货时间": "选择提货时间"
					}
					this.storeStart = store.startTime
					this.storeEnd = store.endTime
				}else{
					uni.$u.http.get("/card-littlemall/wpDeliveryStore/selectShop", {
				params: {
					latitude: 0,
					longitude: 0,
				}
			}).then(res => {
				let {
					name,
					storeSn,
					distance,
					isWeipuShop
				} = res.data.storeList[0]
				uni.setStorageSync('storeName', name),
				uni.setStorageSync('storeSn', storeSn),
				uni.setStorageSync('isWeipuShop', isWeipuShop)
				uni.setStorageSync('distance', distance)
				uni.setStorageSync('mendian',res.data)
			var	store = getApp().globalData.mendian_list.filter(item => { //获取对应门店编号定位信息
					 
					if(item.storeSn == this.shopid222){
						return item
					}else if(item.storeSn==this.CSshopNo){
							return item
					}
				})[0]
				console.log('过滤2',store);
					this.isElec = isElec
					this.cost = cost
					this._price = _price
					this.selfaddress = store.address
					this.ziqu = {
						"门店名称": store.name,
						"提货地点": store.address,
						"自提信息": `取货时间${store.startTime}~${store.endTime}`,
						// "提货时间": "选择提货时间"
					}
			this.storeStart = store.startTime
			this.storeEnd = store.endTime
				})
				}
			
			
	
			getCurrentPages()[getCurrentPages().length - 2].route == "pages/pagesA/jfgoodsDetails/jfgoodsDetails" ? this
				.type = 'jfOrder' : this.spickId == 'undefined' ? this.type = 'priceOrder' : this.type = 'spike'
				if(getCurrentPages()[getCurrentPages().length - 2].route == "pages/pagesC/CoupleOnly/CoupleOnly"){
				}
			uni.showLoading()
			if(isNewMemberGoods!=1){
			isNewMemberGoods = 0
			}
			if (this.page) { //此处两个接口可以试用await优化代码
				this.$request.postBuynow({
					// 直接去购买传入的数据
					type: this.type,
					goodsId,
					count,
					price,
					shopCode: shopId,
					mobile: this.mobile,
					spikeId: this.spickId,
					isNewMemberGoods:isNewMemberGoods,
					newMember:newMember
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.iskuaidi = res.data.deliveryMethodList
						this.res(res.data, count)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			} else {
				// 从购物车进入订单详情的时候
				this.$request.getOrdercheckZg({
					mobile: this.mobile,
					cartIds: ids.join(","),
					// rd: '',
					// packageId: '',
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.res(res.data, totalPrice)
						this.datas = res.data
						let arr = []
						this.datas[0].cartItemList.forEach((item,index)=>{
							// arr.push(item.goodsId)
							arr.push({'id':item.goodsId,'quantity':item.quantity})
						})
						this.goodIds=JSON.stringify(arr)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
			uni.$on("changePeisong", this.modify)
		},
		onShow() {
			if(getApp().globalData.mendian_list&&getApp().globalData.mendian_list>0){
			var	store=''
				store =getApp().globalData.mendian_list.filter(item => { //获取对应门店编号定位信息
					if(item.storeSn == this.shopid222){
						console.log('一样的1',item); 
						return item
					}
				})[0]
				console.log('我是不是空',store);
				if(!store){
					store = getApp().globalData.mendian_list.filter(item => { //获取对应门店编号定位信息
							if(item.storeSn==this.cs_shopNo){
								console.log('一样的2',item);
									return item
							}
						})[0]
				}
					
					this.ziqu = {
						"门店名称": store.name,
						"提货地点": store.address,
						"自提信息": `取货时间${store.startTime}~${store.endTime}`,
						// "提货时间": "选择提货时间"
					}
					
				}else{
				}
		},
		onHide() {
			this.isShow = false
		},
		onUnload() {
			uni.$off("changePeisong", this.modify)
			getApp().globalData.selectInd = null
		},
		methods: {
			zitilist(){
				uni.navigateTo({
					url:`/pages/pagesC/zitidian/zitidian?name=${this.ziqu.提货地点}&shopId=${this.shopid222}`
				})
			},
			initTime() {
				let date = new Date();
				let endYear = date.getFullYear();
				// 获取完整的年月日 时分秒，以及默认显示的数组
				let obj = dateTimePicker(endYear, endYear);
				// 精确到分的处理，将数组的秒去掉
				// let lastArray = obj.dateTimeArray.pop();
				// let lastTime = obj.dateTime.pop();

				this.dateTimeArray = obj.dateTimeArray
				this.dateTime = obj.dateTime
			},
			generateTimeStr(dateTimeArray, dateTime) {
				const timeStr =
					dateTimeArray[0][dateTime[0]] +
					"-" +
					dateTimeArray[1][dateTime[1]] +
					"-" +
					dateTimeArray[2][dateTime[2]] +
					" " +
					dateTimeArray[3][dateTime[3]] +
					":" +
					dateTimeArray[4][dateTime[4]]
				return timeStr;
			},
			changeDateTime(e) {
				this.dateTime = e.detail.value;
				this.timeStr = this.generateTimeStr(this.dateTimeArray, this.dateTime);
				this.commodity[this.psindex]['ztTime'] = this.timeStr
				//ios时间不能用'-'解析成时间戳
			},
			/*年,月切换时重新更新计算*/
			changeDateTimeColumn(e) {
				//let {id} = e.target;
				let {
					column,
					value
				} = e.detail;
				if (column == 0 || column == 1) {
					//直接修改数组下标视图不更新,用深拷贝之后替换数组
					let dateTime = JSON.parse(JSON.stringify(this.dateTime));
					let dateTimeArray = JSON.parse(JSON.stringify(this.dateTimeArray));
					dateTime[column] = value;
					dateTimeArray[2] = getMonthDay(dateTimeArray[0][dateTime[0]], dateTimeArray[1][dateTime[1]]);
					this.dateTime = dateTime;
					this.dateTimeArray = dateTimeArray;
				}
				this.isShow1 = false
			},
			chostime(index) {
				this.psindex = index
			},
			chooseps(index) {
				this.show1 = true
				this.psindex = index
			},
			choosepsmethod(item, index) {
				this.xuan = index
				this.show1 = false
				if (this.commodity[this.psindex].psmethods == item.name) return
				if (item.sign == "selfGet") {
					this.alldelivery = 0
					this.totalPrice = Number(this.spPrice) + this.alldelivery
					this.isZt = true
				} else {
					if (this.title != '') {
						uni.showToast({
							title: this.title,
							icon: 'none'
						})
					}
					this.alldelivery = Number(this.commodity[this.psindex]['zgdelievy'])
					this.totalPrice = Number(this.spPrice) + this.alldelivery
					this.isZt = false
				}
				this.commodity[this.psindex].psmethods = item.name
				this.commodity[this.psindex].pssign = item.sign

			},
			res(res, count) { //不同接口 接收不同的值count
				this.commodity = []
				this.loading = false
				this.cartItemIds = ""
				//购物车、详情返回数据结构不一样
				if (!this.page) {
					// 购物车
					this.commodity = res

				} else {
					let arr = []
					let god = {
						...res.goods,
						...res
					}
					arr.push(god)
					this.commodity.push({
						...res,
						cartItemList: arr
					})
				}
				let {
					cartItemList,
					goods,
					receiver,
					receiverList,
					deliveryMethodList,
					totalPrice,
					deliveryFee,
					paymentMethod,
					return_code_msg,
					goods_weight,
					freightType,
					spikeId,
					orderType
				} = this.commodity[0] //赋值默认地址，商品，收货方式，总价，支付方式
				deliveryMethodList.splice(2, 1) //删除次日达 避免渲染页面
				this.goodsTotalPrice = res.totalPrice

				this.option = deliveryMethodList
				this.deliveryFee = deliveryFee //运费
				this.returnMsg = return_code_msg
				this.goodsWeight = goods_weight
				this.freightType = freightType
				this.orderType = orderType //buynow
				this.spick = spikeId
				getCurrentPages()[getCurrentPages().length - 2].route == "pages/pagesA/jfgoodsDetails/jfgoodsDetails" ? (
					this.jfPrice = res.jfPrice, this.syMoney = res.syMoney) : (this.jfPrice = 0, this.syMoney = 0)

				if (this.returnMsg != '') {
					uni.showToast({
						title: this.returnMsg,
						icon: 'none',
					})
				}
				// this.shoppingBag = res.shoppingBag 
				// 判断是否有地址
				this.isDizhi = receiverList.length === 0 && receiver.constructor === Object
				this.isDizhi ? (this.receiverId = 0) : (this.peisong = {
					"联系人": receiver.name,
					"联系方式": receiver.mobile,
					"收货地址": receiver.areaPathName + receiver.address
				}, this.receiverId = receiver.id)
				this.paymentMethodId = paymentMethod.id // 支付方式
				// 取货方式  微铺：物流   其他：上门自提，配送上门
				this.deliveryMethodLeng = deliveryMethodList.length
				if (this.deliveryMethodLeng != 1) {
					this.deliveryMethodId = deliveryMethodList.filter((item, index) => { // 默认取货方式
						return item.sign == "distribution"
					})[0].id
				}
				// 积分商品、秒杀商品不能用优惠券
				if (!this.page) {
					this.commodity.forEach((item, index) => {
						this.commodity[index]['couponNo'] = '' //优惠券id
						this.commodity[index]['couponMoney'] = 0 //优惠金额
						if (item.allElecList == 0||this.isNewMemberGoods==1) {  //isNewMemberGoods==1新人商品不能使用优惠券
							// 没券
							this.commodity[index]['coupons'] = '没有可用优惠券' //优惠券
						} else {
							// if(this.isNewMemberGoods==1){
							// 		this.commodity[index]['coupons'] = '没有可用优惠券'
							// 		return
							// }
							this.commodity[index]['coupons'] = '你有可抵用优惠券，敬请选择' //优惠券
						}
						// 红包redenvelopes
						if (item.allElecList == 0) {
							// 没券
							this.commodity[index]['redenvelopes'] = '没有可用红包' //优惠券
						} else {
							this.commodity[index]['redenvelopes'] = '你有可用红包，敬请选择' //优惠券
						}
						this.cartItemIds += item.cartIds + ','
						item.cartItemList.forEach(item => {
							this.allNum += item.quantity
						})
						// 判断秒杀商品
						this.test = item.cartItemList.some(item => {
							return item.type == 1
						})
					})
				} else {
					this.commodity.forEach((item, index) => {
						this.commodity[index]['couponNo'] = '' //优惠券id
						this.commodity[index]['couponMoney'] = 0 //优惠金额
						item.cartItemList[index].quantity = count
						item.cartItemList[index].isSpecials == 0 ? this.spmoney = item.cartItemList[index].sprice :
							this.spmoney = item.cartItemList[index].specPrice
						if (item.allElecList == 0||this.isNewMemberGoods==1) { //isNewMemberGoods==1新人商品不能使用优惠券
							// 没券
							this.commodity[index]['coupons'] = '没有可用优惠券'
						} else {
							this.commodity[index]['coupons'] = '你有可抵用优惠券，敬请选择'
						}
						if (item.allElecList == 0) {
							this.commodity[index]['redenvelopes'] = '没有可用红包'
						} else {
							this.commodity[index]['redenvelopes'] = '你有可用红包，敬请选择'
						}
						item.cartItemList.forEach(item => {
							this.allNum += item.quantity
						})
					})
					this.test = this.spickId != 'undefined'
					this.isZt = this.commodity.some(item => {
						return item.pssign == 'selfGet'
					})
				}

			},
			buttom() {
				// this.title='抱歉，当前收货地址未在服务范围内'
				// return
				this.addtest = this.isDizhi
				if (this.addtest) {
					uni.showToast({
						title: '请填写收货信息',
						icon: 'none'
					})
					uni.hideLoading()
					return
					this.title
				}
				let titletest = this.commodity.some(item => {
					return item.pssign != 'selfGet' && this.title != ""
				})
				if (titletest) {
					this.isShowToast(this.title);
					return
				}
				let {
					"提货地点": selfgetAreaName
				} = this.ziqu
				let timtest = this.commodity.some(item => {
					return item.pssign == 'selfGet' && item.ztTime == undefined
			
				if(this.iskuaidi.length==1&&this.iskuaidi[0].name=='物流快递'){ //说明只有一个方式 物流快递 不用看时间是否合适
			}else{
				if (timtest) {
					uni.showToast({
						title: '请选择提货时间',
						icon: 'none'
					})
					uni.hideLoading()
					return
				} else { 
					let timtest1 = this.commodity.some(item => {
						return item.pssign == 'distribution'
					}) 
					if (!timtest1) {
						let date1 = new Date(this.timeStr.replace(/-/g, '/')).getTime() //选择的时间戳
						let date2 = new Date().getTime() //当前时间戳
						let date3 = Number(this.timeStr.slice(11, 13)) < Number(this.storeStart.slice(0, 2)) || Number(
							this.timeStr.slice(11, 13)) > Number(this.storeEnd.slice(0, 2))
						let date4 = Number(this.timeStr.slice(11, 13)) == Number(this.storeStart.slice(0, 2))
						let date5 = Number(this.timeStr.slice(11, 13)) == Number(this.storeEnd.slice(0, 2))
						if (date1 < date2 || date3) {
							this.isShowToast("请选择正确的提货时间!");
							this.button = "提交订单"
							return
						}
						if (date4 && Number(this.timeStr.slice(14, 16)) < Number(this.storeStart.slice(3, 5)) ||
							date5 && Number(this.timeStr.slice(14, 16)) > Number(this.storeEnd.slice(3, 5))) {
							this.isShowToast("请选择正确的提货时间!");
							this.button = "提交订单"
							return
						}
					}
				
				}
			}
			})
			
				this.deliveryMethods = ''
				this.paymentMethods = '' //支付
				this.deliveryFees = '' //运费
				this.thtimer = '' //自提时间
				this.noyfall = '' //不带运费的总价
				this.yfall = '' //带运费的总价
				this.elecToGoodsStr = '' //电子券
				this.receiverIds = '' //地址id
				this.invoice = ''
				this.giftGoodsNum = ''
				this.price_token = '' //uu
				this.selfgetAreaName = ''
				this.nulreduce = '' //优惠金额
				this.no = '' //优惠券id
				this.count = 0
				this.commodity.forEach((item, index) => {
					this.count += item.cartItemList[index].quantity
					if (item.pssign == 'distribution') {
						this.commodity[index]['delievyid'] = item.deliveryMethodList.filter((item,
							index) => {
							return item.sign == 'distribution'
						})[0].id
					}
					if (item.pssign == 'crd') {
						this.commodity[index]['delievyid'] = item.deliveryMethodList.filter((item,
							index) => {
							return item.sign == 'crd'
						})[0].id
					}
					if (item.pssign == 'express') {
						this.commodity[index]['delievyid'] = item.deliveryMethodList.filter((item,
							index) => {
							return item.sign == 'express'
						})[0].id
					}
					if (item.pssign == 'selfGet') {
						if (item.ztTime != undefined) {
							this.thtimer = item.ztTime
						}
						this.commodity[index]['zgdelievy'] = 0 //运费
						this.commodity[index]['delievyid'] = item.deliveryMethodList.filter((item,
							index) => {
							return item.sign == 'selfGet'
						})[0].id
					}
					this.deliveryMethods = item.delievyid
					this.paymentMethods = item.paymentMethod.id
					this.deliveryFees = item.zgdelievy
					if (this.goodsTotalPrice > 0) {
						this.noyfall = this.goodsTotalPrice
					} else {
						this.noyfall = this.a
					}

					this.yfall = this.totalPrice
					this.elecToGoodsStr = item.elecToGoodsStr
					this.receiverIds = this.receiverId
					this.invoice = 0
					this.giftGoodsNum = '0'
					this.price_token = item.price_token //uu
					this.selfgetAreaName = this.selfaddress
					this.no = item.couponNo
					this.nulreduce = item.couponMoney //减免金额
					this.shopNo = item.shopCode
					if (this.page) {
						this.goodsId = item.goods.id

						// if (item.jfPrice != 0) {
						// 	// 积分商品
						// 	this.noyfall = item.syMoney
						// 	this.yfall = item.syMoney + item.zgdelievy
						// }
					}
				})
				// if (this.yfall == 0 && this.jfPrice != 0) {
					// 当积分不等于0的时候  说明是积分商品 积分商品不能用微信支付
				if (this.jfPrice != 0) {
					this.choice = [
						['卡支付', 'aj aj-huiyuan', "cardPay"]
					]
				}
				let parameter = {
					goodsId: this.page ? this.goodsId : '',
					cartItemIds: this.cartItemIds,
					description: this.description || "", //备注信息
					selfgetAreaName: this.selfgetAreaName, //自提地点
					count: this.count, //购买数量
					selfGetTime: this.thtimer, //自提时间
					receiverId: this.receiverIds, //配送地址id
					paymentMethodId: this.paymentMethods, //支付方式id
					deliveryMethodId: this.deliveryMethods, //取货方式id
					shopCode: this.shopNo,
					deliveryFee: this.deliveryFees, //运费
					invoice: this.invoice, //是否开发票
					giftGoodsNum: this.giftGoodsNum,
					total_money: this.yfall.toFixed(2), //订单总额
					mobile: this.mobile,
					price_token: this.price_token, // uu
					need_paymoney: this.deliveryFees,
					elecNo: this.no, //电子券编号
					reduceMoney: this.nulreduce, //优惠金额
					totalPrice: this.noyfall.toFixed(2), //不包括运费
					orderType: this.page ? this.orderType : '', //订单类型 jfOrder,priceOrder
					spikeId: this.page ? this.spick : '',
					elecToGoodsStr: this.elecToGoodsStr,
					fxOpenId:this.shareMobile
					// shoppingBag:this.shoppingBag,
				}
				uni.showLoading({
					title: '下单中...',
					mask: true,
					success: () => {
						this.button = "下单中.."
					}
				});
				if (this.page) {
					// 详情提交订单
					
					this.$request.postSubmitorder(parameter).then(res => {
						
						//this.page用于判断条用哪个接口
						if(res.code==200)
						res.code == 200 ? (this.pay = [true, res.data.orderSn, this.yfall, this.deliveryFees, this
								.dizhi
							], uni.hideLoading(),
							
							 this.isShow = true, getApp().globalData.increment = 2,this.userList =res.data.userList,
							    this.reg  = res.data.reg,
							    this.ordersn =res.data.orderSn) : uni
							.hideLoading(), this.isShowToast(res.msg, '提交订单')
					})
				} else {
					// 购物车提交订单
					this.$request.postSubmitZg({
						...parameter
					}).then(res => {
						if (res.code == 200) {
							// if (res.data.length == 1) {
							this.pay = [true, res.data.orderSn, this.yfall, this.deliveryFees, this
								.dizhi
							]
							this.userList =res.data.userList,
							   this.reg  = res.data.reg,
							   this.ordersn =res.data.orderSn
							// } else {
							// 	// 多个专柜提交订单...
							// 	this.pay = [true, 'daifukuan', this.yfall, this.deliveryFee, this.dizhi]
							// }
							uni.hideLoading();
							this.isShow = true
							getApp().globalData.increment = 2
						} else {
							uni.hideLoading()
							this.isShowToast(res.msg, '提交订单')
						}
					})
				}
				this.$request.postGetCardsByMobile({
					mobile: this.$store.state.userInfo.mobile
				}).then(res => {
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
						});
					})
				});
				uni.$off("changePeisong", this.modify)
			},
			blur() {
				this.description = this.remarks
			},
			isShowToast(title, button) {
				uni.showToast({
					title,
					icon: "none",
					success: () => {
						button ? this.button = button : ""
					}
				})
			},
			modify(res) { //两种方式改变peisong感觉写的不太好 没有太多时间斟酌
				let data = res.data
				this.peisong = data.length == 2 ? this.receiverId = 0 : {
						"联系人": data[2],
						"联系方式": data[3],
						"收货地址": data[4] + data[5]
					},
					this.receiverId = data[0]
				this.isDizhi = data[1]
			},
			jump(url) {
				uni.navigateTo({
					url: this.isDizhi ? "/pages/pagesA/newAddress/newAddress?data=0" : url,
					events: {
						changeaddress: (data) => {
							this.peisong = {
								"联系人": data.name,
								"联系方式": data.mobile,
								"收货地址": data.areaPathName + data.address,
							}
							this.receiverId = data.id
							this.isDizhi = false
						}
					}
				})
			},
			// 选择红包
			useRedEnvelopes(item) {
				if (this.jfPrice != 0 || this.msprice != 'undefined' || this.test) {
					this.isShowToast("活动商品不支持使用红包!");
					return
				}
				if (this.addtest) {
					this.isShowToast("请填写收货信息!");
					return
				}
				// 没有红包不跳转
				if (item.redenvelopes == '没有可用红包') {
					this.isShowToast("没有可用红包!");
					return
				}
				uni.navigateTo({
					url: `/pages/pagesA/useCoupon/useCoupon?title=红包&list=${JSON.stringify(item.allElecList)}&ind=${getApp().globalData.selectInd}&allmodity=${JSON.stringify(this.commodity)}`,
					events: {
						chooseCoupon: (data) => {
							if (data.length != 0) {
								item.couponNo = data[1] //优惠券id
								item.couponMoney = Number(data[0])
								item.redenvelopes = data[2]
							} else {
								item.redenvelopes = '你有可用红包，敬请选择'
								item.couponNo = ''
								item.couponMoney = 0
							}
							this.isuse = item
						}
					}
				})
			},
			// 选择优惠券
			usecoupon(item) {
				if (this.jfPrice != 0 || this.msprice != 'undefined' || this.test) {
					this.isShowToast("活动商品不支持使用优惠券!");
					return
				}
				if (this.addtest) {
					this.isShowToast("请填写收货信息!");
					return
				}
				// 没有优惠券不跳转
				if (item.coupons == '没有可用优惠券') {
					this.isShowToast("没有可用优惠券!");
					return
				}
				uni.navigateTo({
					url: `/pages/pagesA/useCoupon/useCoupon?title=优惠券&list=${JSON.stringify(item.allElecList)}&ind=${getApp().globalData.selectInd}`,
					events: {
						chooseCoupon: (data) => {
							if (data.length != 0) {
								item.couponNo = data[1] //优惠券id
								item.couponMoney = Number(data[0])
								item.coupons = data[2]
							} else {
								if(this.isNewMemberGoods==1){ //isNewMemberGoods==1新人商品不能使用优惠券
										this.commodity[index]['coupons'] = '没有可用优惠券'
										return
								}
								item.coupons = '你有可抵用优惠券，敬请选择'
								item.couponNo = ''
								item.couponMoney = 0
							}
							this.isuse = item
						}
					}
				})
			},
		}
	}
</script>
