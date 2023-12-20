<template>
	<view class="afterSales">
		<uni-nav-bar left-icon="back" fixed="false" statusBar="false" @clickLeft="back" title="申请退货"></uni-nav-bar>
		<view class="choosegood">
			<text>请选择退货商品</text>
			<view class="goods" v-for="(ite,ind) in goodsList" :key="ind">
				<image :src="ite.image"></image>
				<view class="center">
					<view>{{ite.name}}</view>
					<view>
						<!-- <text style="margin-left: 70rpx;color: #000;font-size: 24rpx;}">*{{ite.quntity}}</text> -->
						<view>￥{{ite.price}}</view>
						<u-number-box ref="numberBox" v-model="ite.quntity" integer="false" disabledInput="true"
							@overlimit="overlimit">
							<view slot="minus" class="minus" @click="minus(ite,ind)">
								<u-icon name="minus" size="32"></u-icon>
							</view>
							<view slot="plus" class="plus" @click="plus(ite,ind)">
								<u-icon name="plus" size="32"></u-icon>
							</view>
						</u-number-box>
					</view>

				</view>
				<checkbox-group @change="select(ite)">
					<checkbox :class="checkid == ind ? 'checked' : 'circle'" :checked="ite.flag" color="red"
						:value="ind" :disabled="disabled" />
				</checkbox-group>
			</view>
			<view class="notice-item">
				<text class="title">运费<text style="color: #303133;font-size: 27rpx;">(部分退款暂不支持退运费)</text></text>
				<text class="detail rt">￥{{deliveryFee}}</text>
			</view>
			<view class="notice-item">
				<text class="title">优惠</text>
				<text class="detail rt">-￥{{reduceMoney}}</text>
			</view>
			<view class="qx">
				<checkbox-group @change="checkboxChange">
					<checkbox mack="all" :checked="isCheckedI" color="red" :disabled="disabled" />
				</checkbox-group>
				全选
			</view>
		</view>
		<view class="leixing" @click="show1=true">
			<text>申请类型</text>
			<view>{{title1}}<text class="aj aj-jinrujiantou"></text></view>
		</view>
		<view class="yuanyin" @click="show2=true">
			<text>申请原因</text>
			<view :class="title2=='点击选择申请原因'?'del':''">{{title2}}<text class="aj aj-jinrujiantou"></text></view>
		</view>
		<view class="money">
			<text>申请金额</text>
			<view>￥{{totalPrice}}</view>
		</view>
		<view class="yuanyin">
			<text>联系电话</text>
			<view class="">{{mobile}}</view>
		</view>
		<view class="explain">
			<view>申请说明</view>
			<u--textarea v-model="value" height="150px" placeholder="必填，请您详细填写申请说明" count border='none'></u--textarea>
		</view>
		<u-popup :show="show1" mode="center" :round="10" @close="show1 = false">
			<view class="title">请选择申请类型</view>
			<view class="pop" v-for="(item,index) in list1" :key="index" @click="chooselist1(item)">
				<view>{{item.name}}</view><text>{{item.text}}</text>
			</view>
		</u-popup>
		<u-popup :show="show2" mode="center" :round="10" @close="show2 = false">
			<view class="title">请选择申请原因</view>
			<view class="pop" v-for="(item,index) in list2" :key="index" @click="chooselist2(item)">
				<view>{{item}}</view>
			</view>
		</u-popup>
		<view class="button" @click="submit">
			<view>提交申请</view>
		</view>
	</view>
</template>

<script>
	import {
		AppID,
		tenantId,
		WebSocketurl
	} from '@/config/baseUrl.js'
	import WebSocket  from '@/mixins/WebSocket.js'
	export default {
		mixins:[WebSocket],
		data() {
			return {
				value: '',
				list1: [{
						name: '我要退款(无需退货)',
						text: '没收到货，或与卖家协商不用退货只退款',
						type: 'onlyTuiKuan',
					},
					{
						name: '我要退货退款',
						text: '已收到货，需要退还收到的货物',
						type: 'shouHoutuiHuoTuiKuan',
					},
					// {
					// 	name: '我要换货',
					// 	text: '已收到货，需要收到更换的货物'
					// },
				],
				list2: [
					'不想要了', '协商一致退款', '缺货', '未按承诺时间发货', '其他原因'
				],
				goodsList: [],
				show1: false,
				show2: false,
				title1: '我要退款(无需退货)',
				title2: '点击选择申请原因',
				checkid: null, //选中id
				isChecked: false,
				isCheckedI: false,
				mobile: uni.getStorageSync('userInfo').mobile,
				deliveryFee: 0, //运费
				reduceMoney: 0, //优惠
				disabled: false, //禁用
			}
		},
		onLoad(option) {
		
			let lists = JSON.parse(uni.getStorageSync('orderDetail'))
			uni.removeStorageSync('orderDetail')
			console.log("传递之后",lists);
			this.all = option.money //总价
			this.deliveryFee = lists.deliveryFee //运费
			this.reduceMoney = lists.reduceMoney //优惠
			this.idList = [] //所有goodsId
			this.orderSn = lists.orderSn //订单编号
			this.allqun = 0 //所有数量
			this.numList = []
			this.type = 'onlyTuiKuan'
			this.goodlength = 0
			this.ownQuantity = 0
			lists.item.forEach((item, index) => {
				this.goodlength += 1
				if (item.refundNum != '0') {
					this.numList.push(Number(item.refundNum))
					this.goodsList.push({
						name: item.name,
						image: item.pic,
						price: item.goodPrice,
						quntity: item.refundNum,
						goodsId: item.id,
						flag: false,
					})
					this.allqun += item.refundNum
				}
				this.ownQuantity += Number(item.quantity)
			});
			this.goodsList.forEach(val => {
				console.log('每一项是',val)
				this.idList.push(val.goodsId)
			})
		},
		computed: {
			totalPrice() {
				let price = 0
				let totalPrice = 0
				this.flagList = []
				this.goodIdlist = []
				this.quantityList = []
				let qun1 = []
				let iteQuantity = 0  //选中商品数量
				this.goodsList.map((item, ind) => {
					console.log('对也不对',item)
					item.flag ? (price += item.price * item.quntity, iteQuantity += Number(item.quntity), this
							.goodIdlist.push(item.goodsId),
							this.flagList.push(item.flag), this.quantityList.push(item.quntity)) : price +=
						0
					if (Number(item.quntity) == this.numList[ind]) {
						qun1.push(1)
					}
					if (qun1.length == this.goodsList.length && this.flagList.length == this.goodsList.length) {
						totalPrice = (Number(price) + Number(this.deliveryFee)).toFixed(2)
					} else {
						totalPrice = price.toFixed(2)
					}
				})
				// 使用优惠券全部退款
				if (this.reduceMoney != 0 && this.ownQuantity == iteQuantity) {
					totalPrice = (totalPrice - this.reduceMoney).toFixed(2)
				}

				return totalPrice
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			minus(item, ind) {
				if (item.quntity > 1) {
					item.quntity -= 1
				} else {
					uni.showToast({
						title: '不能再减了~',
						icon: 'none'
					})
				}
			},
			plus(item, ind) {
				if (this.numList[ind] <= Number(item.quntity)) {
					uni.showToast({
						title: '不能再加了~',
						icon: 'none'
					})
				} else {
					item.quntity += 1
				}
			},
			overlimit(e) {

			},
			chooselist1(item) {
				this.show1 = false
				this.title1 = item.name
				this.type = item.type
			},
			chooselist2(item) {
				this.show2 = false
				this.title2 = item
			},
			select(item) {
				item.flag = !item.flag
				if (item.flag) {
					let test = this.goodsList.every(item => {
						return item.flag === true
					})
					if (test) {
						this.isCheckedI = true
					} else {
						this.isCheckedI = false
					}
				} else {
					this.isCheckedI = false
				}
			},
			checkboxChange(e) {
				this.isCheckedI = !this.isCheckedI
				// 如果 allcheckked 为真  全选被选中时，那么设置每一项都被选中
				if (this.isCheckedI) {
					this.goodsList.map(item => {
						item.flag = true
					})
				} else {
					this.goodsList.map(item => {
						item.flag = false
					})
				}
				for (var i = 0; i < this.goodsList.length; i++) {
					if (this.isCheckedI) {
						this.goodsList[i].flag = true
					} else {
						this.goodsList[i].flag = false
					}
				}
			},
			submit() {
				console.log('退货id',this.goodIdlist.toString())
				if (this.title2 == '点击选择申请原因' || this.value == '' || this.goodIdlist.length == 0) {
					this.goodIdlist.length == 0 ? uni.showToast({
						title: '请选择退货商品',
						icon: 'none'
					}) : uni.showToast({
						title: '请完善退货信息',
						icon: 'none'
					})
					return
				}
				let allqunlis = 0
				this.quantityList.forEach(ite => {
					allqunlis += Number(ite)
				})
				if (this.flagList.length == this.goodlength && Number(this.allqun) == allqunlis) {
					this.goodIdlist = []
					this.quantityList = []
				}
				uni.showLoading({
					title: '提交中...',
					mask: true,
				})
				this.$request.postThsave({
					shopId: getApp().globalData.shopNo, //门店id
					goodsId: this.goodIdlist.toString(),
					reason: this.title2, //申请原因
					info: this.value, //申请说明
					amount: this.totalPrice, //退款金额
					orderSn: this.orderSn,
					type: this.title1, //申请类型
					quantity: this.quantityList.toString(),
					tui_kuan_type: this.type, //
				}).then(res => {
					if (res.code == 200) {  
						if(WebSocketurl){
							this.getWEBdata(this.orderSn,1)
						}
						uni.hideLoading()
						uni.showToast({
							title: '提交成功',
						})
						setTimeout(() => {
							uni.navigateTo({
								url: `/pages/pagesA/cancleOrder/cancleOrder?orderSn=${this.orderSn}&a=1`
							})
						}, 1500);

					} else {
						console.log('提交失败了')
						uni.hideLoading()
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg||'提交失败',
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

	.afterSales {
		.active {
			color: red;
		}

		.del {
			color: #959595;
		}

		.minus,
		.plus {
			width: 46rpx;
			height: 46rpx;
			background-color: #ebecee;
			display: flex;
			justify-content: center;
		}

		.notice-item {
			height: 50rpx;
			align-items: flex-start;
			width: 90%;
			margin: 0 auto;

			.title {
				font-size: 28rpx;
				text-align: justify;
				text-align-last: justify;
				text-justify: distribute-all-lines;
				width: 140rpx;
			}

			.rt {
				float: right;
			}

			.detail {
				font-size: 28rpx;
				color: #333;
				flex: 1;
			}
		}

		.choosegood {
			background-color: #fff;
			margin-bottom: 15rpx;
			padding-bottom: 15rpx;

			>text {
				margin-left: 10rpx;
			}

			.goods {
				width: 95%;
				margin: 0 auto;
				margin-top: 10rpx;
				display: flex;
				position: relative;

				image {
					@include image(130rpx, 130rpx, 15rpx);
				}

				.center {
					width: 67%;
					margin: 0px 3%;

					&>view:first-child {
						font-size: 30rpx;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					&>view:nth-child(2) {
						display: flex;
						justify-content: space-between;
						width: 80%;

						view:first-child {
							color: red
						}
					}
				}

				.checked,
				.circle {
					position: absolute;
					right: 2%;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.qx {
				display: flex;
				margin-left: 15rpx;
				padding-left: 77%;
				margin-top: 15rpx;
			}
		}

		.leixing,
		.yuanyin {
			display: flex;
			background-color: #fff;
			border-bottom: 1rpx solid #e4e1e1;
			padding: 15rpx;

			>text {
				font-size: 29rpx;
				color: #656363;
			}

			view {
				width: 76%;
				margin-left: 7%;

				.aj-jinrujiantou {
					font-size: 40rpx;
					float: right;
				}
			}
		}

		.yuanyin {
			border-bottom: none;
		}

		.money {
			margin: 15rpx 0;
			background-color: #fff;
			padding: 10rpx;

			text {
				font-size: 29rpx;
				color: #656363;
			}

			view {
				font-size: 40rpx;
				padding: 10rpx 0;
			}
		}

		.explain {
			// position: relative;
			margin-top: 15rpx;
			background-color: #fff;
			padding-bottom: 20rpx;

			&>view:first-child {
				padding: 10rpx;
			}

			&>view:nth-child(3) {
				width: 22%;
				border: 1rpx dashed #a6a5a5;
				padding: 10rpx 0;
				margin-left: 3%;

				// position: absolute;
				// left:3%;
				// bottom:13%;
				text {
					margin: 0 auto;
				}

				view {
					color: #5c5c5c;
					text-align: center;
				}
			}
		}

		.button {
			width: 100%;
			position: fixed;
			bottom: 0;
			padding-bottom: 15rpx;
			z-index: 999999;

			view {
				width: 95%;
				margin: 0 auto;
				color: #fff;
				background-color: #e02e24;
				border-radius: 10rpx;
				padding: 15rpx 0;
				text-align: center;
			}
		}

		.title {
			padding: 10rpx 0;
			text-align: center;
			margin-bottom: 10rpx;
		}

		.pop {
			padding: 10rpx;
			width: 90%;
			margin: 0 auto;
			margin-bottom: 15rpx;

			view {
				font-size: 30rpx;
			}

			text {
				font-size: 28rpx;
				color: #808080
			}
		}
	}
</style>
