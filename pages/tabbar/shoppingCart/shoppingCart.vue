<template>
	<view class="shoppingCart u-skeleton">
		<!-- 页头 -->
		<view class="pageHeader"><page-header :isShow="true" :isText="isText" @header="changeI"></page-header></view>
		<!-- 骨架屏 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<view class="body u-skeleton-fillet" v-show="judge" :style="{ paddingTop: topHeight + 'px' }">
			<!-- 轮播 -->
			<u-swiper
				:list="list1"
				:indicator="true"
				indicatorMode="dot"
				indicatorActiveColor="#ff227a"
				indicatorInactiveColor="#fff"
				height="315.4" 
				radius="7px 7px 7px 7px"
				interva="5000"
				circular="true"
				@click="click1" 
			></u-swiper>

			<!-- 商品 -->
			<uni-swipe-action>
				<view class="StoreGoods" v-for="(allitem, index) in list" :key="index">
					<view class="storeName">
						<view :class="allitem.isShop ? 'active circle' : 'circle'" @click="chooseShopSelect(index)">
							<u-icon name="checkbox-mark" color="#fff" size="40"></u-icon>
						</view>
						<view class="zgdj" v-if="allitem.cartItems[0].isZg == true">专柜</view>
						<view  @click="gozgStore(allitem.cartItems[0].shopId, allitem.cartItems[0].isZg)">{{ allitem.shopName  || allitem.zgName }} <text v-if="allitem.cartItems[0].isZg == true" class="aj aj-jinrujiantou"></text>	</view>
					</view>
					<uni-swipe-action-item :right-options="options1" v-for="(item, gindex) in allitem.cartItems" :key="gindex" @click="del(item.id)" autoClose="true">
						<view class="commoditys">
							<view :class="item.selected ? 'active goodscircle' : 'goodscircle'" @click="chooseGoodsSelect(index, gindex)">
								<u-icon name="checkbox-mark" color="#fff" size="40"></u-icon>
							</view>
							<image mode="scaleToFill" lazy-load :src="item.pic" @click="goDetails(allitem.cartItems[0].isZg, item.goodsId, allitem.cartItems[0].shopId)" />
							<!-- 商品简介 -->
							<view class="navTab">
								<view>{{ item.barcode }}</view>
								<view>{{ item.name }}</view>
								<view v-show="false">
									商品规格:{{ item.goodsSpecificationDetailList[0].name }}
									<text class="aj aj-a-9youjiankuohao"></text>
									换促销
									<text class="aj aj-a-9youjiankuohao"></text>
								</view>
								<view>
									<text>
										￥{{ item.yprice }}
										<text class="miaosha" v-if="item.type == 1">秒杀</text>
									</text>
									<u-number-box
										ref="numberBox"
										v-model="item.quantity"
										integer="false"
										disabledInput="true"
										@overlimit="overlimit"
										:disablePlus="disablePlus"
										@blur="blur(item)"
									>
										<view slot="minus" class="minus" @click="minus(item)"><u-icon name="minus" size="40"></u-icon></view>
										<view slot="plus" class="plus" @click="plus(item,allitem)"><u-icon name="plus" size="40"></u-icon></view>
									</u-number-box>
								</view>
							</view>
							<!-- 规格弹出层 -->
							<u-popup :show="show" @close="close" @open="open"></u-popup>
						</view>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		<!-- 当用户没有登录  -->
		<template v-if="!judge">
			<u-empty text="登录后同步查看订单信息" mode="car" marginTop="45% 0 0 0" textSize="30" iconSize="160" iconColor="#bcbcbc"></u-empty>
			<u-button type="success" size="40" @click="jump('/pages/pagesA/denglu/denglu')">登录</u-button>
		</template>
		<!-- <view class="low u-skeleton-fillet" style="" v-else> -->
		<!-- 用三目判断屏幕大小然后根据屏幕大小设置padding -->
		<view :class="['u-skeleton-fillet', pm_num == 0 ? 'low' : 'low1']" style="" v-else>
			<view :class="isCheckAll ? 'active circle' : 'circle'" @click="chooseCheckAll"><u-icon name="checkbox-mark" color="#fff" size="40"></u-icon></view>
			全选
			<!-- 使用v-show失效 -->
			<view class="view" v-if="isText">
				<text>合计</text>
				<text>￥</text>
				<text>{{ totalPrice.toFixed(2) }}</text>
				<text @click="button">去结算({{ num }})</text>
			</view>
			<view class="view" v-else><text @click="button('detele')">删除</text></view>
		</view>
		<view class="kong" v-show="judge && listLength == 0">
			<u-empty mode="car" text="你还没有添加宝贝!" iconColor="#bcbcbc" marginTop="30% 0 0 0" textSize="30" iconSize="160"></u-empty>
			<view @click="jump('/pages/tabbar/index/index')">去逛逛</view>
		</view>
		<!--  专柜和普通不能一起结算-->
		<u-popup :show="settlementShow" @close="settlementShow = false" round="30" closeIconPos="top-right" closeable="false">
			<view class="settlement">
				<view>请分开结算以下商品</view>
				<view>暂不支持超市、专柜商品一起结算</view>
				<view>
					<view>{{ storeName }}</view>
					<scroll-view scroll-x="true" @click="scroll"><image v-for="(img, ind) in mdpop[0].imglist" :key="ind" :src="img" mode=""></image></scroll-view>
					<view class="view">
						<text>合计</text>
						<text>￥</text>
						<text>{{ mdpop[0].total }}</text>
						<text @click="btnSettlement(1)">去结算({{ mdpop[0].num }})</text>
					</view>
				</view>
				<view>
					<view>专柜到家</view>
					<scroll-view scroll-x="true" @click="scroll"><image v-for="(img, ind) in zgpop[0].imglist" :key="ind" :src="img" mode=""></image></scroll-view>
					<view class="view">
						<text>合计</text>
						<text>￥</text>
						<text>{{ zgpop[0].total }}</text>
						<text @click="btnSettlement(0)">去结算({{ zgpop[0].num }})</text>
					</view>
				</view>
			</view>
		</u-popup>
		<tabbar></tabbar>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item';
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			// pm的大小宽度 存在本地
			pm_num: uni.getStorageSync('pm_num'),
			judge: null, //判断是否登录
			list1: null, //轮播
			list: null, //商品:null,
			isCheckAll: false, // 购物车全选/反选默认false
			num: 0, // 购买数量
			totalPrice: 0, //总价
			isText: true, //默认显示页头“编辑”
			listLength: 0,
			loading: true, //骨架屏是否显示
			options1: [
				{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}
			],
			disablePlus: false, //是否禁用增加按钮
			topHeight: 0,
			shopId: getApp().globalData.shopNo,
			settlementShow: false,
			zgpop: [],
			mdpop: [],
			lists:[],
			GWCnum:0
			// 屏幕的适配 如果是0的话代表小屏幕 如果不是0的话代表大屏幕
		};
	},
	computed: {
		...mapState(['storeName'])
	},
	onLoad() {
		this.id = []; //被选中的商品id 字符串
		this.time = null;
		this.zgGoodsList = [];
		this.mdGoodsList = [];
		uni.$on('selectCartItem', this.selectCartItem);
		let that = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.pageHeader'); // 获取某个元素
				info.boundingClientRect(function(data) {
					//data - 各种参数
					that.topHeight = data.height;
				}).exec();
			}
		});
	},
	watch: {
		storeName() {
			this.selectCartItem(0);
		} //门店发生变化 重新发送请求,启用下拉刷新
	},
	onUnload() {
		uni.$off('selectCartItem', this.selectCartItem);
	},
	onShow() {
		this.isText = true;
		this.settlementShow = false;
		this.judge = Boolean(uni.getStorageSync('token'));
		if (!this.judge) {
			this.loading = false;
		}
		if (!this.judge || getApp().globalData.increment == 1) return;
		getApp().globalData.increment = 1;
		this.selectCartItem(0);
	},
	async onPullDownRefresh() {
		await this.selectCartItem(0);
		uni.stopPullDownRefresh(); //停止刷新
	},
	methods: {
		click1(id){
			// console.log(id)
			// console.log(this.lists)
			let data = this.lists.carouselAdvertisingVOList[id]
			uni.navigateTo({
				url:data.link
			})
		},
		selectCartItem(data) {
			return new Promise(resolve => {
				this.$request
					.getSelectCartItem({
						openId: uni.getStorageSync('openid'),
						mobile: this.$store.state.userInfo.mobile,
						// shopId: getApp().globalData.shopNo
						shopId:''
					})
					.then(res => {
						this.lists = res
						this.list1 = res.carouselAdvertisingVOList.map(item => item.pic); //轮播图
						this.list = [];
						this.totalPrice = 0;
						this.num = 0;
						this.id = [];
						this.isCheckAll = false; // 购物车全选/反选默认false
						let ptlist = res.cartItemList;
						ptlist.forEach(item => {
							item['selected'] = false;
						});
						// if (ptlist.length != 0) {
						// 	this.list.push({
						// 		name: uni.getStorageSync('storeName'),
						// 		cartItems: ptlist,
						// 		isShop: false,
						// 		isZg: false
						// 	});
						// }
						let sp_list =res.wpCart
						// sp_list.forEach(item => {
						// 	item['isShop'] = false;
						// 	item['isZg'] = true;
						// 	item.cartItems['selected'] = false;
						// });
						if(sp_list){
							this.list.push(...sp_list);
						}
						let zglist = res.zgCart;
						zglist.forEach(item => {
							item['isShop'] = false;
							item['isZg'] = true;
							item.cartItems['selected'] = false;
						});
						this.list.push(...zglist);
						this.listLength = this.list.length; //商品数量
						this.loading = false;
						this.list.forEach(item => {
							let test = item.cartItems.some(items => {
								return items.type == 1;
							});
							test ? (getApp().globalData.increment = 0) : (getApp().globalData.increment = 1);
						});
						resolve();
					});
			});
		},
		goDetails(isZg, id, shopId) {
			this.jump(`/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${shopId}`);
		},
		gozgStore(e, isZg) {
			if (isZg) {
				uni.navigateTo({
					url: `/pages/pagesC/advertisement2/advertisement2?shopNo=${e}`
				});
			} else {
				// uni.switchTab({
				// 	url: '/pages/tabbar/supermarket/supermarket'
				// });
			}
		},
		// 结算
		btnSettlement(e) {
			if (e == 0) {
				// 专柜
				this.jump(`/pages/pagesA/order/order?parameter=${JSON.stringify({ ids: this.zgpop[0].id, totalPrice: this.zgpop[0].total ,})}&msprice=undefined`);
			} else {
				// 超市
				this.jump(`/pages/pagesA/order/order?parameter=${JSON.stringify({ ids: this.mdpop[0].id, totalPrice: this.mdpop[0].total })}&msprice=undefined`);
			}
		},
		button(res) {
			if (this.id.length == 0) {
				uni.showToast({
					title: '您还没有选择宝贝哦！',
					icon: 'none'
				});
				return;
			} else {
				if (res == 'detele') {
					uni.showModal({
						content: `确定要删除${this.num}个宝贝吗？`,
						cancelText: '我再想想',
						confirmText: '忍心删除',
						confirmColor: '#ff0000',
						success: res => {
							res.confirm &&
								(uni.showLoading({
									title: '删除中..'
								}),
								this.$request
									.getDeleteCartIds({
										ids: this.id.join(',')
									})
									.then(async data => {
										data.code == 200 && (await this.selectCartItem(0));
										uni.hideLoading();
										this.id = [];
										this.increment = 0;
										this.totalPrice = 0;
										this.num = 0;
									}));
						}
					});
				} else {
					if ((this.zgpop[0].imglist.length != 0 && this.mdpop[0].imglist.length != 0) || this.chooseZg.length > 1) {
						// this.settlementShow = true
						uni.showToast({
							title: '暂不支持超市、专柜商品一起结算',
							mask: true,
							icon: 'none'
						});
						return;
					}
					// 判断是否选择了多个门店
					let arr =[]
						let xuanzhong_list = []
						let _shop = ''
					let list=	this.list.map((item)=>{
						arr.push(...item.cartItems)
						})
						arr.filter((item)=>{
							this.id.filter((itm1)=>{
							// return	item.id==item1
							if(item.id==itm1){
								_shop = item.shopId
								xuanzhong_list.push(item.storeName)
							}
							})
						})
						// set去重
						 let b = new Set(xuanzhong_list); //数组a为可迭代对象,b此时为Set结构
						  b = Array.from(b); //Set为可迭代对象,b此时为数组结构
						if(b.length>1){
							uni.showToast({
								title: '暂不支持多个门店同时结算',
								mask: true,
								icon: 'none'
							});
						}else{
								this.jump(`/pages/pagesA/order/order?parameter=${JSON.stringify({ ids: this.id, totalPrice: this.totalPrice.toFixed(2),shopId:_shop })}&msprice=undefined`);
						}
				
				}
			}
		},
		// 店铺选中反选
		alltotalPrice() {
			let zgtotal = 0;
			let mdtotal = 0;
			let num1 = 0;
			let num2 = 0;
			let imglist1 = [];
			let imglist2 = [];
			let id1 = [];
			let id2 = [];
			this.num = 0;
			this.id = [];
			this.zgGoodsList = [];
			this.mdGoodsList = [];
			this.zgpop = [];
			this.chooseZg = [];
			this.mdpop = [];
			this.list.forEach(item => {
				if (item.isZg) {
					this.zgGoodsList.push(item);
				} else {
					this.mdGoodsList.push(item);
				}
			});
			console.log('我是所有购物车商品',this.list);
			// 专柜价格
			for (let i = 0; i < this.zgGoodsList.length; i++) {
				for (let j = 0; j < this.zgGoodsList[i].cartItems.length; j++) {
					if (this.zgGoodsList[i].cartItems[j].selected) {
						zgtotal += this.zgGoodsList[i].cartItems[j].yprice * this.zgGoodsList[i].cartItems[j].quantity;
						num1 += this.zgGoodsList[i].cartItems[j].quantity;
						imglist1.push(this.zgGoodsList[i].cartItems[j].pic);
						id1.push(this.zgGoodsList[i].cartItems[j].id);

						let havezg = this.chooseZg.some(item => {
							return this.zgGoodsList[i].zgName == item.zgName;
						});
						if (!havezg) {
							this.chooseZg.push(this.zgGoodsList[i]);
						}
					}
				}
			}
			// 门店价格
			for (let i = 0; i < this.mdGoodsList.length; i++) {
				for (let j = 0; j < this.mdGoodsList[i].cartItems.length; j++) {
					if (this.mdGoodsList[i].cartItems[j].selected) {
						mdtotal += this.mdGoodsList[i].cartItems[j].yprice * this.mdGoodsList[i].cartItems[j].quantity;
						num2 += this.mdGoodsList[i].cartItems[j].quantity;
						this.GWCnum += this.mdGoodsList[i].cartItems[j].quantity;
						imglist2.push(this.mdGoodsList[i].cartItems[j].pic);
						id2.push(this.mdGoodsList[i].cartItems[j].id);
					}
				}
			}
		
			this.mdGoodsList[0].cartItems.forEach((item,index)=>{
				setTimeout(()=>{
					console.log('每一项',item.quantity);
				},10)
				// shuliang+=item.quantity
				// console.log('开始累计计算'.item.quantity);
			})
			this.zgpop.push({
				imglist: imglist1,
				total: zgtotal.toFixed(2),
				num: num1,
				id: id1
			});
			this.mdpop.push({
				imglist: imglist2,
				total: mdtotal.toFixed(2),
				num: num2,
				id: id2
			});
			this.num = num1 + num2;
			this.id = [...id1, ...id2];
			this.totalPrice = zgtotal + mdtotal;
		},
		chooseShopSelect(index) {
			let cartList = this.list;
			cartList[index].isShop = !cartList[index].isShop;
			for (let i = 0; i < cartList[index].cartItems.length; i++) {
				cartList[index].cartItems[i].selected = cartList[index].isShop;
			}
			this.checkAllCondition();
			this.alltotalPrice();
		},
		// 商品选中反选
		chooseGoodsSelect(index, gindex) {
			let cartList = this.list;
			let count = 0;
			let goodsList = cartList[index].cartItems; // 当前店铺下商品列表
			let goods = goodsList[gindex]; // 当前商品数组

			if (goods.selected) {
				cartList[index].cartItems[gindex].selected = false; // 改变当前商品状态
				cartList[index].isShop = false; // 改变店铺状态
			} else {
				cartList[index].cartItems[gindex].selected = true;
				// 当店铺选中商品数量与店铺总数相等时, 改变店铺状态
				let shopGoodsNum = cartList[index].cartItems.length; // 店铺总个数
				let goodsArray = cartList[index].cartItems;
				let selectedNum = 0;
				for (var i in goodsArray) {
					if (goodsArray[i].selected) {
						selectedNum++;
					}
				}
				if (selectedNum == goodsArray.length) {
					cartList[index].isShop = true;
				} else {
					cartList[index].isShop = false;
				}
			}
			this.checkAllCondition();
			this.alltotalPrice();
		},
		// 全选条件 店铺全选  反之
		checkAllCondition() {
			let isCheckAll = this.isCheckAll;
			let cartList = this.list; // 购物车列表数据
			let isCheckAllNum = 0;
			for (let i = 0; i < cartList.length; i++) {
				if (cartList[i].isShop == true) {
					isCheckAllNum++;
				}
			}
			if (isCheckAllNum == cartList.length) {
				this.isCheckAll = true;
			} else {
				this.isCheckAll = false;
			}
			this.alltotalPrice();
		},
		// 点击全选
		chooseCheckAll() {
			let cartList = this.list;
			let isCheckAll = this.isCheckAll;
			if (isCheckAll) {
				this.isCheckAll = false;
			} else {
				this.isCheckAll = true;
			}
			for (let i = 0; i < cartList.length; i++) {
				cartList[i].isShop = this.isCheckAll;
				for (let j = 0; j < cartList[i].cartItems.length; j++) {
					cartList[i].cartItems[j].selected = this.isCheckAll;
				}
			}
			this.alltotalPrice();
		},
		// 更改数量
		updateNum(id, quantity, item,flag) {
			if (quantity <= 0) {
				this.isShowToast('商品数量不能小于0');
				item.quantity = 1;
				quantity = 1;
			}
			if(flag=='jia'){
				quantity= quantity+1
				console.log('购物车数量1',quantity);
			}else{
				quantity= quantity-1
			}
			this.$request
				.getUpdateCart({
					id: id,
					quantity: quantity,
					shopNo:uni.getStorageSync('storeSn'),
					memberId: this.$store.state.userInfo.mobile
				})
				.then(res => {
					console.log('添加数量',res);
					if(res.code&&res.code==400){
						console.log('超限了');
						uni.showToast({
							title: '超出限购了',
							duration: 2000,
							icon:'none'
						});
					}else{
						console.log('okla');
						if(flag=='jia'){
							item.quantity += 1;
						}else{
							item.quantity -= 1;
						}
					}
					this.alltotalPrice();
				});
		},

		// 减少按钮
		minus(item) {
			if (this.time) {
				return;
			}
			if (item.quantity > 1) {
				this.$store.dispatch('judge', [item.quantity - 1, item.sn + '_' + item.shopId, item.shopId]).then(res => {
					if (res[0] == false) {
						this.isShowToast(`宝贝只剩最后${item.quantity}个了！`);
					} else {
						let flag = 'jian'
						this.updateNum(item.id, item.quantity, item,flag);
						this.alltotalPrice();
					}
				});
			}
			this.time = setTimeout(() => {
				this.time = null;
			}, 500);
		},
		// 增加按钮
		plus(item,allitem) {
			console.log('增加按钮',allitem);
			if (this.time) return;
			this.$store.dispatch('judge', [item.quantity, item.sn + '_' + item.shopId, item.shopId]).then(res => {
				if (res[0] == false) {
					this.disablePlus = true;
					this.isShowToast(`宝贝只剩最后${item.quantity}个了！`);
				} else {
					this.disablePlus = false;
					// item.quantity += 1;
					let flag = 'jia'
					this.updateNum(item.id, item.quantity, item,flag);
					this.alltotalPrice();
				}
			});
			this.time = setTimeout(() => {
				this.time = null;
			}, 500);
		},
		// 失焦
		// blur(item){
		// 	if(this.time)return
		// 	console.log(item.quantity)
		// 	let Difference=item.quantity-this.num,judge=this.id.includes(item.id)
		// 	this.$store.dispatch('judge',[item.quantity,item.sn+"_"+item.shopId,item.shopId]).then(res=>{
		// 		if(res[0]==false){
		// 		  item.quantity= item.quantity + res[1];this.isShowToast(`宝贝只剩最后${item.quantity}个了！`)
		// 		  Difference=item.quantity-this.num
		// 	  }
		// 		judge && (this.num+=Difference,this.totalPrice+=item.yprice*Difference)
		// 		})
		// 	this.time=setTimeout(()=>{this.time = null},500)
		// },
		isShowToast(title) {
			uni.showToast({
				title: title,
				icon: 'none',
				duration: 2000
			});
		},
		overlimit(e) {
			e == 'minus' && this.isShowToast('该宝贝不能再减少了~');
		},
		// 滑动删除商品
		del(id) {
			uni.showModal({
				content: `确定要删除这个宝贝吗？`,
				cancelText: '我再想想',
				confirmText: '忍心删除',
				confirmColor: '#ff0000',
				success: res => {
					res.confirm &&
						(uni.showLoading({
							title: '删除中..'
						}),
						this.$request
							.getDeleteCartIds({
								ids: id
							})
							.then(async data => {
								data.code == 200 && (await this.selectCartItem(0));
								uni.hideLoading();
								this.totalPrice = 0;
								this.num = 0;
							}));
				}
			});
		},
		changeI() {
			this.isText = !this.isText;
		},
		jump(url) {
			/tabbar/.test(url)
				? uni.switchTab({
						url
				  })
				: uni.navigateTo({
						url
				  });
		}
	}
};
</script>
<style lang="scss">
@import '@/static/style/uni.scss';

.shoppingCart {
	padding-bottom: 120rpx;

	/deep/ .u-tabbar-item__icon {
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.miaosha {
		color: #fff !important;
		background-color: red;
		font-size: 23rpx;
		padding: 5rpx;
		border-radius: 5rpx;
		margin-left: 9rpx;
	}

	.settlement {
		width: 90%;
		margin: 0 auto;
		padding: 58rpx 0 20rpx 0;

		& > view:first-child {
			font-size: 35rpx;
			font-weight: 600;
			text-align: center;
			margin-bottom: 10rpx;
		}

		& > view:nth-child(2) {
			font-size: 28rpx;
			text-align: center;
			color: #808080;
		}

		& > view:nth-child(3),
		& > view:nth-child(4) {
			background-color: #fff;
			margin-top: 15rpx;

			& > view:first-child {
				font-size: 33rpx;
				font-weight: 600;
				margin-bottom: 15rpx;
			}

			scroll-view {
				white-space: nowrap;
				width: 100%;
			}

			image {
				width: 130rpx;
				height: 130rpx;
				border-radius: 10rpx;
				margin-right: 5rpx;
			}

			.view {
				text-align: end;

				& > text:nth-child(2) {
					color: red;
				}

				& > text:nth-child(3) {
					color: red;
					font-size: 40rpx;
				}

				& > text:last-child {
					color: white;
					background: red;
					display: inline-block;
					width: 185rpx;
					height: 100%;
					border-radius: 50rpx;
					text-align: center;
					line-height: 200%;
					margin-left: 10rpx;
				}
			}
		}
	}

	.active {
		background-color: red !important;
		border: 1rpx solid red !important;
	}

	.circle {
		width: 40rpx;
		height: 40rpx;
		margin: 0 10rpx;
		border-radius: 50%;
		border: 1rpx solid #969595;
		position: relative;

		> view {
			font-weight: normal;
			color: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.goodscircle {
		width: 40rpx;
		height: 40rpx;
		margin: 30rpx 10rpx 0 10rpx;
		border-radius: 50%;
		border: 1rpx solid #969595;
		position: relative;

		> view {
			font-weight: normal;
			color: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.minus,
	.plus {
		width: 46rpx;
		height: 46rpx;
		background-color: #ebecee;
		display: flex;
		justify-content: center;
	}

	.pageHeader {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.u-button {
		width: 40% !important;
	}

	.body {
		@include chamfer .collectOrders {
			margin: 15rpx 0;
			position: relative;
			font-weight: 900;

			& > text:nth-child(1) {
				font-weight: normal;
				display: inline-block;
				color: #fff;
				background-color: #e32838;
				border-radius: 10rpx;
				text-align: center;
				font-size: 23rpx;
				width: 60rpx;
			}

			.u-icon {
				position: absolute;
				top: 3px;
				left: 290px;
			}
		}

		.u-checkbox-group {
			margin-bottom: 80rpx;
		}

		.uni-swipe-action-item {
			margin: 20rpx 0 20rpx 0;
		}

		.StoreGoods {
			background-color: #fff;
			padding-top: 10rpx;

			.storeName {
				font-size: 35rpx;
				font-weight: 600;
				display: flex;

				.zgdj {
					width: 70rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					color: #fff;
					font-size: 25rpx;
					background-color: red;
					border-radius: 4rpx;
					margin-right: 10rpx;
				}
			}
		}

		.commoditys {
			position: relative;
			margin: 20rpx 0 20rpx 0;
			border-radius: 20rpx;
			background: #fff;
			padding: 20rpx 0;
			display: flex;

			image {
				@include image(150rpx, 150rpx, 10rpx) vertical-align: middle;
			}

			.navTab {
				margin-left: 20rpx;
				width: 60%;

				& > view:nth-child(2) {
					@include hide(1, 40rpx) width: 100%;
				}

				& > view:nth-child(3) {
					color: #afafaf;
					font-size: 25rpx;
					margin-top: 20rpx;

					.aj-a-9youjiankuohao:after {
						font-size: 25rpx;
					}
				}

				& > view:nth-child(4) {
					display: flex;
					--color: #e32838;
					color: var(--color);
					font-size: 40rpx;
					margin: 35rpx 0 15rpx 0rpx;
					width: 100%;
					position: relative;

					& > text:nth-child(1) {
						font-size: 35rpx;
						color: var(--color);
					}

					> view {
						position: absolute;
						right: 2%;
					}

					> view:nth-child(3) {
						@include absolute(56%, 75%) .num {
							display: inline-block;
							background: #9fa7aa;
							margin: 0 20rpx;
							width: 70rpx;
							text-align: center;
						}
					}
				}
			}
		}
	}

	.low {
		display: flex;
		position: fixed;
		bottom: 50px;
		z-index: 10;
		width: 100%;
		background: #fff;
		padding-top: 20rpx;
		padding-bottom: 84rpx;
		// padding-bottom: 10rpx;
		.view {
			display: inline-block;
			width: 75%;
			text-align: end;

			& > text:nth-child(2) {
				color: red;
			}

			& > text:nth-child(3) {
				color: red;
				font-size: 40rpx;
			}

			& > text:last-child {
				color: white;
				background: red;
				display: inline-block;
				width: 185rpx;
				height: 100%;
				border-radius: 50rpx;
				text-align: center;
				line-height: 200%;
				margin-left: 10rpx;
			}
		}
	}
	.low1 {
		display: flex;
		position: fixed;
		bottom: 50px;
		z-index: 10;
		width: 100%;
		background: #fff;
		padding-top: 20rpx;
		// padding-bottom: 84rpx;
		padding-bottom: 10rpx;
		.view {
			display: inline-block;
			width: 75%;
			text-align: end;

			& > text:nth-child(2) {
				color: red;
			}

			& > text:nth-child(3) {
				color: red;
				font-size: 40rpx;
			}

			& > text:last-child {
				color: white;
				background: red;
				display: inline-block;
				width: 185rpx;
				height: 100%;
				border-radius: 50rpx;
				text-align: center;
				line-height: 200%;
				margin-left: 10rpx;
			}
		}
	}

	.kong {
		> view:last-child {
			width: 20%;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			background: red;
			color: white;
			border-radius: 100rpx;
			margin: 20rpx 0 0 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
 