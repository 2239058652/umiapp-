<template>
	<view class="goodsDetails u-skeleton">
		<uni-nav-bar @clickLeft="back()" fixed="false" statusBar="false" title="商品详情" left-icon="back"></uni-nav-bar>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<!-- 轮播图 -->
		<swiper class="u-skeleton-fillet" indicator-active-color="#ff42b4" :indicator-dots="true" :circular="true"
			:autoplay="true" interval="5000">
			<swiper-item v-for="(itemi, index) in item.goodsImagesList" @click="see(index)" :key="index">
				<image :src="itemi.pic || itemi.url"></image>
			</swiper-item>
		</swiper>
		<view class="details">
			<!-- 价格 收藏  是否是特价商品 -->
			<view v-if="msprice == undefined" class="u-skeleton-fillet">
				<text v-if="item.goods.isSpecials != 0">现价：</text>
				<text v-else>价格：</text> 
				<text>￥</text> 
				<text v-if="isxinren!='newMember'" v-text="item.goods.isSpecials == 0 ? item.goods.sprice : item.goods.specPrice"></text>
				<text v-else v-text="item.goods.newMemberPrice"></text>
				<text v-show="item.goods.isSpecials != 0">
					原价：￥
					<text v-text="item.goods.sprice"></text>
				</text>
				<text v-show="item.goods.isSpecials == 2" class="zhekou">8.8折</text>
				<text style="margin-left: 4%;color: #909090;font-size: 29rpx">
					销量：
					<text style="color: red;">{{ item.goods.salesVolume }}</text>
				</text>
			
				<!-- <text class="aj aj-fenxiang" style="float: right;" @click="canspoint"></text> -->
				<view v-if="item.dshopType == '0003'"><text class="zgdj">专柜到家</text></view>
			</view>
			<!-- 秒杀商品 -->
			<view v-if="msprice != undefined" class="u-skeleton-fillet spike">
				<view>
					秒杀价：
					<text style="margin-right: 10rpx;">￥{{ msprice }}</text>
					原价：
					<text
						style="font-size: 28rpx;color:#999;text-decoration: line-through;font-weight: normal;">￥{{ item.goods.sprice }}</text>
				</view>
			</view>
<!-- 			<view class="taocan u-skeleton-fillet">
				<view class="[taocan-item]" >
					<text style="font-size: 28rpx;
    color: #999;">规格：</text>	<view v-for="(item,index) in taocan" :key="index" :class="[taocanindex==index?'taocan-active':'']" @click="taocanxuanzhong(index)">
						<view>{{item.num}}{{item.danwei}}</view>
						<view>{{item.price}}/{{item.danwei}}</view>
					</view>
				</view>
			</view> -->
			<!-- 商品名称 -->
			<view class="commodityName u-skeleton-fillet">
				<text>条码：</text>
				<text v-text="item.goods.barcode"></text>
			</view>
			<view class="commodityName u-skeleton-fillet">
				<text>名称：</text>
				<changan-coloe style='display: inline-block;' :top='top' :title='item.goods.name'
					@longtouch="longtouch()">
					<text v-text="item.goods.name"></text>
				</changan-coloe>
			</view>
			<view class="commodityName u-skeleton-fillet" v-if="xiangounum&&xiangounum>0">
				<text>限购：</text>
				<text v-text=""></text>
				<text>最高限购<text style="font-size: 35rpx;">{{xiangounum||0}}</text>,最低限购<text
						style="font-size: 35rpx;">{{xiangounum2||0}}</text></text>
			</view>
			<!-- 	<view class="yanse_box" v-if="color_list.length>0">
        <view class="yanse_title">颜色</view>
        <view class="yanse" >
          <view v-for="(item,index) in color_list" @click="xuanze_yanse(index)" v-bind:class="{ active:index==current1}">{{item}}</view>

        </view>
      </view>
      <view class="yanse_box" v-if="size_list.length>0">
        <view class="yanse_title">尺码</view>
        <view class="yanse" >
          <view v-for="(item,index) in size_list" @click="size_yanse(index)" v-bind:class="{ active:index==current2}">{{item}}</view>

        </view>
      </view> -->
	  <!-- 客户说暂不需要 领取卡券 -->
			<!-- <view class="commodityName u-skeleton-fillet" @click="openpop" v-if="item.type != 223">
				<text>领券</text>
				<text class="quan" v-for="(item, index) in couponList.slice(0, 2)"
					:key="index">满{{ item.consume }}减{{ item.reduceMoney }}元</text>
				<text class="aj aj-jinrujiantou"></text>
			</view> -->
			<!-- <view class="hongbao u-skeleton-fillet" v-if="item.type == 223">
        <text>
          <text class="aj aj-hongbao"></text>
          可使用红包：
          <text style="font-size: 38rpx;color: red;font-weight: 600;">{{ item.goods.price }}</text>
        </text>
        <text>
          +现金：
          <text>{{ item.elecMoney }}</text>
        </text>
      </view> -->
			<!-- 商品信息 -->
			<view class="title u-skeleton-fillet">
				<view>
					<text>数量：</text>
					<u-number-box ref="numberBox" v-model="count" integer="false" longPress="false"
						@overlimit="overlimit" :disablePlus="disablePlus" @blur="blur" disabledInput="false">
						<view slot="minus" class="minus" @click="minus(item)">
							<u-icon name="minus" size="36"></u-icon>
						</view>
						<view slot="plus" class="plus" @click="plus(item)">
							<u-icon name="plus" size="36"></u-icon>
						</view>
					</u-number-box>
				</view>

				<view>
					<text>详情：</text>
					<rich-text :nodes="content"></rich-text>
				</view>
			</view>
			<!-- 更多商品 -->
			<view class="tuijian">
				为您推荐
				<commodity ref="commodity"></commodity>
			</view>
			<!-- 底部购物车 -->
			<uni-goods-nav v-if="!shareMobile" :fill="true" :options="options" :button-group="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
				
				<view class="duihuan" v-else @click="buttonClick">{{btnText}}</view>
		</view>
		<u-popup :show="popShow" :round="30" bgColor="#f5f5f5" mode="bottom" closeable="true" @close="popShow = false">
			<view class="coupon" v-for="(item, index) in couponList" :key="index"
				@click="getcoupon(item.isKl, item.cardid)">
				<view class="left" :style="'background-color:' + item.color">
					￥
					<text>{{ item.reduceMoney }}</text>
				</view>
				<view class="right">
					<view>
						<view>{{ item.title }}</view>
						<view class="manjian">满{{ item.consume }}减{{ item.reduceMoney }}元</view>
					</view>
					<view class="right_btn">{{ item.isKl == 'N' ? '活动未开始' : '立即领取' }}</view>
				</view>
			</view>
			<view class="leng" v-if="code != 200 || leng == 0">暂无可用优惠券</view>
		</u-popup>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-popup :round="30" :show="show" mode="bottom" @close="close" @open="open">
			<view class="tan">
				<view class="donghua">
					<u-loading-icon color="red" size=60 :show="donghua_flag"></u-loading-icon>
				</view>
				<view class="tan_center">
					<view class="tan_top">
						<uni-icons type="closeempty" @click="guanbi"
							style="position: absolute; top: 15rpx;right: 15rpx; " size="30"></uni-icons>

						<image class="tan_img" @click="see1(index)" :src="item.goods.pic" mode=""></image>
						<view class="top-right">
							<view>￥{{ item.goods.sprice }}</view>
							<view class="kucun">库存{{item.goods.sstock }}件</view>
							<view>{{ xuanze }}</view>
						</view>
					</view>
					<scroll-view scroll-y="true">
						<view class="zhuti" style="height: 600rpx;">
							<view id="app">
								<view v-for="(item, index) in specList" :key="index">
									<view class="title">{{ item.title }}</view>
									<view class="spec">
										<view class="spec-item" v-for="(its, ins) in item.list" :key="its.name">

											<text @click="changeSpec(item.title, its.name, its.able, index)"
												:class="[selectSpec[item.title] === its.name ? 'active' : '', its.able ? '' : 'disabled']">
												{{ its.name }}
											</text>
										</view>
									</view>
								</view>
							</view>

							<view class="size_top">数量</view>
							<u-number-box style="margin-left: 20rpx;" ref="numberBox" v-model="count" integer="false"
								longPress="false" @overlimit="overlimit" :disablePlus="disablePlus" @blur="blur">
								<view slot="minus" class="minus" @click="minus(item)">
									<u-icon name="minus" size="36"></u-icon>
								</view>
								<view slot="plus" class="plus" @click="plus(item)">
									<u-icon name="plus" size="36"></u-icon>
								</view>
							</u-number-box>
						</view>
					</scroll-view>
					<button class="queding" @click="queding()">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import mixin from '@/mixins/mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				taocan:[
					{
						num:'1',
						danwei:'袋',
						price:'10.45'
					},
					{
					num:'10',
					danwei:'袋',
					price:'10'
				},
				{
					num:'15',
					danwei:'袋',
					price:'9.8'
				}],
				taocanindex:0,
				top: '商品标题已复制',
				xuanze: '请选择规格',
				// 弹出框的状态
				show: false,
				count: 1, //点击数量
				item: {},
				/* 商品数据 */
				content: '', //富文本
				loading: true, //骨架屏
				rowsWidth: ['100%', '50%', '60%', '70%', '80%'],
				rowsHeight: ['300rpx', '30rpx', '30rpx', '30rpx', '30rpx'],
				options: [{
						icon: 'chat',
						text: '客服'
					},
					{
						icon: 'cart',
						text: '购物车',
						infoBackgroundColor: '#ff0000',
						infoColor: '#fff',
						info: 0
					}
				],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #ffcb1e, #ff8a18)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #fe5e35, #ef1324)',
						color: '#fff'
					}
				],
				goodsId: '',
				disablePlus: false, //是否禁用增加按钮
				isShow: false,
				msprice: undefined, //秒杀价格
				msyg: '', //秒杀预购
				popShow: false,
				couponList: [], //优惠券列表
				leng: 0,
				code: 0,
				spickId: '', //秒杀id
				shopNo: '',
				isWeipuShop: uni.getStorageSync('isWeipuShop'), // isWeipuShop == 1展示红包
				// 是事件对象 是在点击确定的时候调用以前的方法 所有要把e复制一份
				_e: {},
				// 选中的第一个规格
				xuan0: '',
				// 选中的第二个规格
				xuan1: '',
				// 选中的第三个规格
				xuan2: '',
				// 过滤出所规格选中的id
				xuaunzhong_id: '',
				// 请求的数据
				specList: [],
				specList1: [],
				skuList: [],
				skuList1: [],
				// 选中的规格(没什么用)
				selectSpec: {},
				donghua_flag: false,
				ind: 0,
				fenleilist: [],
				// 当前商品属于那个超市
				cs: [],
				// 或者属于那个百货
				hb: [],
				xiangounum: 0, //限购数量
				xiangounum2: 0, //最低限购数量
				btnText: '立即购买',
				shareMobile:'',
				// shareMobile:'13213005762',
				isNewMemberGoods:'' ,//是否是新人专享
				isxinren:''
			};
		},
		onUnload(){
			uni.removeStorageSync('shareMobile')
		},
		// 分享
		onShareAppMessage(res) {
			return {
				title: `${this.money} ${this.item.goods.name}`,
				path: `pages/tabbar/index/index?id=${this.goodsId}&dshopType=${this.dshopType}`
			};
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: `${this.money} ${this.item.goods.name}`,
				path: `pages/pagesA/goodsDetails/goodsDetails?id=${this.goodsId}_${this.shopNo}&dshopType=${this.dshopType}`
			};
		},
		onShow() {
			this.getcart_unm(),
				(this.token = uni.getStorageSync('token') == ''), (this.mobile = this.$store.state.userInfo.mobile); //电话
			uni.$emit('history');

			// 处理数据
			this.skuList = this.skuList1;
			// 初始化选择数据的对象

			if (this.specList1 && this.specList1.length > 0) {
				this.specList1.forEach(item => {
					this.$set(this.selectSpec, item.title, '');
				});
			}

			// 将规格数据处理成我们视图所需要的数据类型
			if (this.specList && this.specList.length > 0) {
				this.specList = this.specList1.map(item => {
					return {
						title: item.title,
						list: item.list.map(its => {
							return {
								name: its,
								// 判断是否可以选择
								able: this.isAble(item.title, its) // 注释的调试看逻辑代码 false
							};
						})
					};
				});
			}
			// console.log(JSON.stringify(this.selectSpec));
			// 注释的调试看逻辑代码
			// this.selectSpec = {
			//   颜色: "",
			//   套餐: "套餐一",
			//   内存: "64G"
			// };
			// this.isAble("颜色", "红色");
		},
		onLoad(data) {
			this.isxinren = data.isxinren
			// var mobile = '18436299533'
			if(data.mobile){
				this.shareMobile = data.mobile 
				// this.shareMobile = mobile
				// uni.setStorageSync('shareMobile',this.shareMobile)
			}
			// if(uni.getStorageSync('shareMobile')){
			// 	this.shareMobile = uni.getStorageSync('shareMobile')
			// }
			this.xiangounum = data.xiangou
			this.xiangounum2 = data.xiangou2
			this.spickId = data.spickId;
			this.msyg = data.ygms;
			this.msprice = data.msprice;
			this.jup = data.jup;
			(this.dshopType = ''), //专柜
			(this.sn = '');
			(this.totalPoints = 0), //总积分
			// this.header={'Content-type': 'application/x-www-form-urlencoded'}, //请求头
			(this.page = 0); //上拉加载页码
			this.goodsId = data.id; //商品id
			this.$request
				.getGoodsDetail({
					goodsId: this.goodsId,
					mobile: this.$store.state.userInfo.mobile||uni.getStorageSync('userInfo').mobile,
					ifElec: 1,
				})
				.then(res => {
					// 判断当前商品是属于百货还是属于超市
					if (res.code == 200) {
						this.isNewMemberGoods = res.data.isNewMemberGoods
						this.qufen(res.data.goods.sshopId)
						var pages = getCurrentPages();
						// 根据选择的门店判断使用哪个分类数据
						// 获取属于那个分类 根据当前分类加载
						this.item = res.data;
						let join = res.data.goods.categoryPath
						let arr = join.split(',')
						if(!this.shareMobile&&this.fenleilist&&this.fenleilist.length>0){
							this.ind = this.fenleilist.findIndex((item, index) => {
								return item.id == arr[0]
							})
						}else{
						}
						
						this.getcart_unm()
						this.dshopType = this.item.dshopType;
						// this.shopNo = this.item.goods.sshopId
						this.shopNo = this.item.shopCode;
						this.sn = this.item.goods.sn;
						this.content = this.formatRichText(res.data.goods.introduction); //富文本使用
						this.loading = false;
						this.money = this.item.goods.isSpecials == 0 ? '￥' + this.item.goods.sprice : '￥' + this.item
							.goods.specPrice;
						this.$store.dispatch('judge', [1, this.sn, this.shopNo]).then(res => {
							// 有无库存
							res[1] == 0 ?
								((this.buttonGroup[0].text = ''), (this.buttonGroup[1].text = '售罄')) :
								this.msyg == undefined ?
								(this.buttonGroup[1].text = '立即购买') :
								this.msyg != '抢购中' ?
								(this.buttonGroup[1].text = this.msyg) :
								(this.buttonGroup[1].text = '立即抢购');
						});
						
						// 规格数据
						this.specList1 = res.data.speItemInfos;
						this.skuList1 = res.data.wpGoodsSpecDetailVOGroup;
						this.skuList = this.skuList1;
						this.specList = this.specList1;
						this.clone();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			this.$request
				.postCheckCollectElecByGoodsId({
					source: 'weixin',
					sfzzlq: '1',
					sfzczs: '-1',
					goodsId: this.goodsId
				})
				.then(res => {
					this.code = res.code;
					if (res.code != 200) return;
					this.couponList = res.data;
					this.leng = this.couponList.length;
				});
		},

		onReachBottom() {
			// if (this.content != '') {
			this.page += 1;
			// 获取推荐商品
			if (this.fenleilist[this.ind]) {

				this.$refs.commodity.getHotGoods({
						cate: this.fenleilist[this.ind].id,
						page: this.page,
						shopNo: this.item.shopCode,
					},
					'more'
				);
			}
		},
		methods: {
			
			taocanxuanzhong(index){
				this.taocanindex  = index
			},
			// 根据门店号判断当前门店属于超市还是百货
			qufen(shopid) {
				let cslist = getApp().globalData.cs_list_mendian
				let bhlist = getApp().globalData.bh_list_mendian
				this.cs = cslist.filter((item, index) => {
					if (item.storeSn == shopid) {
						return item
					}
				})
				this.bh = bhlist.filter((item, index) => {
					if (item.storeSn == shopid) {
						return item
					}
				})
				// 根据门店属于超市还是百货来进行对分类的赋值
				if (this.cs.length > 0) {
					if (getApp().globalData.cs_classification.length == 0) {
						this.fenleilist = getApp().globalData.classification
					} else {
						this.fenleilist = getApp().globalData.cs_classification
					}
				} else {
					this.fenleilist = getApp().globalData.classification
				}

			},
			// 获取购物车的数量
			getcart_unm() {
				// 购物车数量
				this.$request.postCartnumber({
					mobile: this.$store.state.userInfo.mobile,
					// shopNo: this.shopNo
					shopNo: ''
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					this.options[1].info = res
					// this.value = res
				})
			},
			// 清空所有数据
			clone() {
				this.xuan0 = '';
				this.xuan1 = '';
				this.xuan2 = '';
				this.count = 1;
				this.xuanze = '请选择规格';
				this.skuList = this.skuList1;
				// 初始化选择数据的对象
				if (this.specList1 && this.specList1.length > 0) {
					this.specList1.forEach(item => {
						this.$set(this.selectSpec, item.title, '');
					});
				}

				// 将规格数据处理成我们视图所需要的数据类型
				if (this.specList && this.specList.length > 0) {
					this.specList = this.specList1.map(item => {
						return {
							title: item.title,
							list: item.list.map(its => {
								return {
									name: its,
									// 判断是否可以选择
									able: this.isAble(item.title, its) // 注释的调试看逻辑代码 false
								};
							})
						};
					});
				}
			},
			// 判断规格是否可以被选择  核心函数 key当前的规格的title   value规格值
			isAble(key, value) {
				// 深拷贝 避免被影响
				var copySelectSpec = JSON.parse(JSON.stringify(this.selectSpec));
				// 用对象的好处就在这了 直接赋值当前验证项
				copySelectSpec[key] = value;
				// 用数组的 some 方法 效率高 符合条件直接退出循环
				let flag = this.skuList.some(item => {
					// 条件判断 核心逻辑判断

					var i = 0;
					// 这个for in 循环的逻辑比较复杂 原理就是循环已经选中的 和 正在当前对比的数据 和 所有的sku对比 只有当前验证的所有项满足sku中的规格或者其他规格为空时 即满足条件 稍微有点复杂 把注释的调试代码打开就调试下就可以看懂了
					for (let k in copySelectSpec) {
						//  console.log(copySelectSpec[k])  // 注释的调试看逻辑代码
						if (copySelectSpec[k] != '' && item.specs.includes(copySelectSpec[k])) {
							i++;
						} else if (copySelectSpec[k] == '') {
							i++;
						}
					}
					// 符合下面条件就退出了 不符合会一直循环知道循环结束没有符合的条件就 return false 了
					// console.log(i) // 注释的调试看逻辑代码
					return i == this.specList1.length;
				});

				return flag;
			},
			// 当规格选择完毕之后 重新请求详情数据
			new_guige() {
				this.$request /*  */
					.getGoodsDetail({
						goodsId: `${this.xuaunzhong_id}_${this.item.shopCode}`,
						mobile: this.$store.state.userInfo.mobile,
						ifElec: 1
					})
					.then(res => {
						if (res.code == 200) {
							this.donghua_flag = false
							this.item = res.data;
							this.getcart_unm()
							// this.options[1].info = this.item.cartItemNumber;
							this.dshopType = this.item.dshopType;
							// this.shopNo = this.item.goods.sshopId
							this.shopNo = this.item.shopCode;
							this.sn = this.item.goods.sn;
							this.content = this.formatRichText(res.data.goods.introduction); //富文本使用
							this.loading = false;
							this.money = this.item.goods.isSpecials == 0 ? '￥' + this.item.goods.sprice : '￥' + this
								.item.goods.specPrice;
							this.$store.dispatch('judge', [1, this.sn, this.shopNo]).then(res => {
								// 有无库存
								res[1] == 0 ?
									((this.buttonGroup[0].text = ''), (this.buttonGroup[1].text = '售罄')) :
									this.msyg == undefined ?
									(this.buttonGroup[1].text = '立即购买') :
									this.msyg != '抢购中' ?
									(this.buttonGroup[1].text = this.msyg) :
									(this.buttonGroup[1].text = '立即抢购');
							});
						} else {
							this.donghua_flag = false
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
			},
			// 点击事件
			changeSpec(key, value, able, index) {
				if (able) {
					if (index == 0) {
						this.xuan0 = value;
						this.xuanze = `已选择 ${this.xuan0} ${this.xuan1} ${this.xuan2} `;
					} else if (index == 1) {
						this.xuan1 = value;
						this.xuanze = `已选择 ${this.xuan0} ${this.xuan1} ${this.xuan2} `;
					} else if (index == 2) {
						this.xuan2 = value;
						this.xuanze = `已选择 ${this.xuan0} ${this.xuan1} ${this.xuan2} `;
					}
					// 点击根据已有信息展示数据
					// this.xuanze = `已选择${this.xuan0}+${this.xuan1}+${this.xuan2}`
					// if(this.xuan0==''){

					// }

					if (!able) return;
					if (this.selectSpec[key] === value) {
						this.selectSpec[key] = '';
						let ss = index;
						if (index == 0) {
							this.xuan0 = '';
							this.xuanze = `已选择 ${this.xuan0} ${this.xuan1}  ${this.xuan2}`;
						} else if (index == 1) {
							this.xuan1 = '';
							this.xuanze = `已选择 ${this.xuan0} ${this.xuan1}  ${this.xuan2}`;
						} else if (index == 2) {
							this.xuan2 = '';
							this.xuanze = `已选择 ${this.xuan0} ${this.xuan1}  ${this.xuan2}`;
						}
					} else {
						this.selectSpec[key] = value;
					}
					// forEach循环改变原数组
					this.specList.forEach(item => {
						item.list.forEach(its => {
							its.able = this.isAble(item.title, its.name);
						});
					});
					if (this.specList1.length == 3) {
						if (this.xuan0 != '' && this.xuan1 != '' && this.xuan2 != '') {
							// console.log("有三个数据都选中吧");
							let xuans1 = this.skuList1.filter(item => {
								// console.log(item.specs);
								// console.log(item.specs.includes(this.xuan0));
								return item.specs.includes(this.xuan0);
								// return item.specs.find(item1 => {
								//   console.log(item1);
								// });
							});
							// console.log(this.xuan0);
							// console.log(xuans1);
							let xuans2 = xuans1.filter(item => {
								// console.log(item.specs);
								return item.specs.includes(this.xuan1);
								// return item.specs.find(item1 => {
								//   console.log(item1);
								// });
							});
							let xuans3 = xuans2.filter(item => {
								// console.log(item.specs);
								return item.specs.includes(this.xuan2);
							});

							this.xuaunzhong_id = xuans3[0].goodsId;
							this.donghua_flag = true
							this.new_guige();

							// console.log(this.xuaunzhong_id);
						}
					} else if (this.specList1.length == 2) {
						if (this.xuan0 != '' && this.xuan1 != '') {
							// console.log("有两个数据都选中吧");
							let xuans1 = this.skuList1.filter(item => {
								// console.log(item.specs);
								return item.specs.includes(this.xuan0);
							});
							// console.log(xuans1);
							let xuans2 = xuans1.filter(item => {
								return item.specs.includes(this.xuan1);
							});
							this.xuaunzhong_id = xuans2[0].goodsId;
							this.donghua_flag = true
							this.new_guige();
							// this.buttonClick(this._e);
							// this.show=false
							// this.clone()
							// 让选中的数量为1
							// this.count =1
							console.log(this.xuaunzhong_id);
						}
					} else if (this.specList1.length == 1) {
						if (this.xuan0 != '') {
							// console.log("有一个数据都选中吧");
							let xuans1 = this.skuList1.filter(item => {
								// console.log(item.specs);
								return item.specs.includes(this.xuan0);
								// return item.specs.find(item1 => {
								//   console.log(item1);
								// });
							});
							this.xuaunzhong_id = xuans1[0].goodsId;
							this.donghua_flag = true
							this.new_guige();

							this.count = 1;
						} else {
							if (this.xuan0 == '') {}
						}
					}
				} else {
					// return
					this.isShowToast('该规格已售空~');
				}
			},

			guanbi() {
				this.show = false;
				this.count = 1;
				this.xuan0 = '';
				this.xuan1 = '';
				this.xuan2 = '';
				this.skuList = this.skuList1;
				// 初始化选择数据的对象
				if (this.specList1 && this.specList1.length > 0) {
					this.specList1.forEach(item => {
						this.$set(this.selectSpec, item.title, '');
					});
				}

				// 将规格数据处理成我们视图所需要的数据类型
				if (this.specList && this.specList.length > 0) {


					this.specList = this.specList1.map(item => {
						return {
							title: item.title,
							list: item.list.map(its => {
								return {
									name: its,
									// 判断是否可以选择
									able: this.isAble(item.title, its) // 注释的调试看逻辑代码 false
								};
							})
						};
					});
				}
				// console.log(JSON.stringify(this.selectSpec));
				this.xuanze = '请选择规格';
			},
			// 打开弹出层
			open() {
			},
			// 关闭弹出层
			close() {
				// 让选中的数量为1
				this.count = 1;
				this.show = false;
				this.xuan0 = '';
				this.xuan1 = '';
				this.xuan2 = '';
				this.xuanze = '请选择规格';
				this.skuList = this.skuList1;
				// 初始化选择数据的对象
				if (this.specList1 && this.specList1.length > 0) {
					this.specList1.forEach(item => {
						this.$set(this.selectSpec, item.title, '');
					});
				}

				// 将规格数据处理成我们视图所需要的数据类型
				if (this.specList && this.specList.length > 0) {


					this.specList = this.specList1.map(item => {
						return {
							title: item.title,
							list: item.list.map(its => {
								return {
									name: its,
									// 判断是否可以选择
									able: this.isAble(item.title, its) // 注释的调试看逻辑代码 false
								};
							})
						};
					});
				}
				// console.log(JSON.stringify(this.selectSpec));
			},
			// 点击弹出层的确定按钮
			queding() {
				// this.donghua_flag = true
				if (this.specList1.length == 3) {
					if (this.xuan0 != '' && this.xuan1 != '' && this.xuan2 != '') {
						// console.log("有三个数据都选中吧");
						let xuans1 = this.skuList1.filter(item => {
							// console.log(item.specs);
							// console.log(item.specs.includes(this.xuan0));
							return item.specs.includes(this.xuan0);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						// console.log(this.xuan0);
						// console.log(xuans1);
						let xuans2 = xuans1.filter(item => {
							// console.log(item.specs);
							return item.specs.includes(this.xuan1);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						let xuans3 = xuans2.filter(item => {
							// console.log(item.specs);
							return item.specs.includes(this.xuan2);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						// console.log(xuans3);
						// console.log(xuans3[0].id);
						this.xuaunzhong_id = xuans3[0].goodsId;
						this.buttonClick(this._e);
						this.show = false;
						this.clone();
						// 让选中的数量为1
						this.count = 1;

						console.log(this.xuaunzhong_id);
					} else {
						// console.log('三个不都没选中');
						if (this.xuan0 == '') {
							this.isShowToast(`请选择${this.specList1[0].title}`);
							// console.log("请选择", this.specList1[0].title);
							// console.log("请选择第一个");
							// console.log(`${你好}`);
						} else if (this.xuan1 == '') {
							// console.log("第二个没选中");
							// console.log("请选择", this.specList1[1].title);
							this.isShowToast(`请选择${this.specList1[1].title}`);
						} else if (this.xuan2 == '') {
							// console.log("第三个没选中");
							// console.log("请选择", this.specList1[2].title);
							this.isShowToast(`请选择${this.specList1[2].title}`);
						}
					}
				} else if (this.specList1.length == 2) {
					if (this.xuan0 != '' && this.xuan1 != '') {
						// console.log("有两个数据都选中吧");
						let xuans1 = this.skuList1.filter(item => {
							// console.log(item.specs);
							return item.specs.includes(this.xuan0);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						// console.log(xuans1);
						let xuans2 = xuans1.filter(item => {
							// console.log(item.specs);
							return item.specs.includes(this.xuan1);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						this.xuaunzhong_id = xuans2[0].goodsId;
						this.buttonClick(this._e);
						this.show = false;
						this.clone();
						// 让选中的数量为1
						this.count = 1;
						console.log(this.xuaunzhong_id);
					} else {
						// console.log("两个不都没选中");
						if (this.xuan0 == '') {
							// console.log("请选择", this.specList1[0].title);
							this.isShowToast(`请选择${this.specList1[0].title}`);
							// console.log("请选择第一个");
							// console.log(`${你好}`);
						} else if (this.xuan1 == '') {
							// console.log("第二个没选中");
							// console.log("请选择", this.specList1[1].title);
							this.isShowToast(`请选择${this.specList1[1].title}`);
						}
					}
				} else if (this.specList1.length == 1) {
					if (this.xuan0 != '') {
						// console.log("有一个数据都选中吧");
						let xuans1 = this.skuList1.filter(item => {
							// console.log(item.specs);
							return item.specs.includes(this.xuan0);
							// return item.specs.find(item1 => {
							//   console.log(item1);
							// });
						});
						this.xuaunzhong_id = xuans1[0].goodsId;
						console.log(this.xuaunzhong_id);
						this.buttonClick(this._e);
						this.show = false;
						this.clone();
						// 让选中的数量为1
						this.count = 1;
					} else {
						if (this.xuan0 == '') {
							// console.log("请选择", this.specList1[0].title);
							this.isShowToast(`请选择${this.specList1[0].title}`);
							// console.log("请选择第一个");
							// console.log(`${你好}`);
						}
					}
				}
			},
			
			back() {
				uni.removeStorageSync('shareMobile')
				
				// 如果是分享的页面，点击返回首页
				if (this.jup == '1') {
					uni.switchTab({
						url: '/pages/tabbar/index/index',
						success() {
							uni.getStorageSync('tabbar').forEach(item => {
								uni.setTabBarItem(item);
							});
							uni.showTabBar({
								animation: true
							});
						}
					});
					return;
				}
				let page = getCurrentPages();
				if (page[page.length - 2].route == 'pages/pagesA/cancleOrder/cancleOrder'||page.length==1) {
					console.log('触发了',page);
					uni.switchTab({
						url: '/pages/tabbar/index/index'
					});
					getApp().globalData.tabInde=0
					return;
				}
				uni.navigateBack({
					delta: 1
				});
			},
			minus() {
				if (this.time) {
					return;
				}
				if (this.count > 1) {
					this.$store.dispatch('judge', [this.count - 1, this.sn, this.shopNo]).then(res => {
						if (res[0] == true) {
							this.count -= 1;
						}
					});
				}
				this.time = setTimeout(() => {
					this.time = null;
				}, 500);
			},
			// 增加按钮
			plus() {
				if(this.xiangounum&&this.xiangounum!=0){
					if(this.count+1>this.xiangounum){
						console.log('超出限购了');
						uni.showToast({
							title: '超出限购了',
							duration: 2000,
							icon:'none'
						});
						return
					}
				}
			
				if (this.token) {
					this.jump('/pages/pagesA/denglu/denglu');
					return;
				}
				if (this.time) {
					return;
				}
				this.$store.dispatch('judge', [this.count, this.sn, this.shopNo]).then(res => {
					if (res[0] == false) {
						this.disablePlus = true;
						this.isShowToast(`宝贝只剩最后${this.count}个了！`);
					} else {
						this.disablePlus = false;
						this.count += 1;
					}
				});
				this.time = setTimeout(() => {
					this.time = null;
				}, 500);
			},
			// 失焦
			blur() {
				if (this.time) {
					return;
				}
				this.$store.dispatch('judge', [this.count, this.sn, this.shopNo]).then(res => {
					if (res[0] == false) {
						// this.count = res[1];
						if (res[1] == 0) {
							this.count = 1
						} else {
							this.count = res[1];
						}
						// res[1] == 0 ? this.count = 1 :this.count = res[1];
						this.isShowToast(`宝贝只剩最后${res[1]}个了！`);
					}
				});
				this.time = setTimeout(() => {
					this.time = null;
				}, 500);
			},
			overlimit(e) {
				e == 'minus' && this.isShowToast('该宝贝不能再减少了~');
			},
			onClick(e) {
				if (e.index == 0) {
					// this.jump('#')
				} else {
					let _this = this;
					uni.switchTab({
						url: '/pages/tabbar/shoppingCart/shoppingCart',
						success() {
							if (_this.jup == '1') {
								uni.$emit('selectCartItem');
								uni.getStorageSync('tabbar').forEach(item => {
									uni.setTabBarItem(item);
								});
								uni.showTabBar({
									animation: true
								});
							} else {
								uni.getStorageSync('tabbar').forEach((item, index) => {
									uni.setTabBarItem(item);
									if (item.text == '购物车') {
										getApp().globalData.tabIndex = index;
									}
								});
							}
						}
					});
				}
			},
			isShowToast(title) {
				uni.showToast({
					title: title,
					icon: 'none',
					duration: 2000
				});
			},
			buttonClick(e) {
				if (uni.getStorageSync('token') == '') {
					uni.navigateTo({
						url: '/pages/pagesA/denglu/denglu'
					});
					return;
				}
				this._e = e;
				if (e == undefined) {
					e = this._e;
				}
				if (this.token) {
					this.jump('/pages/pagesA/denglu/denglu');
					return;
				} else {
					if (this.buttonGroup[1].text == '售罄') {
						uni.showToast({
							title: '商品已售罄',
							icon: 'none'
						});
						return;
					}
					let {
						specPrice,
						sprice,
						sshopId,
						id,
						name,
						pic
					} = this.item.goods,
						// 添加购物车数据
						parameter = {
							goodsId: id,
							quantity: this.count,
							price: specPrice || sprice,
							// 这个门店编号是商品详情返回的
							shopId: sshopId,
							mobile: this.mobile,
							type: this.msprice == undefined ? this.item.type : '1',
							spikeId: this.spickId,
							shareMobile:this.shareMobile,
							isNewMemberGoods:this.isNewMemberGoods,
							newMember : this.isxinren //新人专享商品才有值 普通商品为空
						};
						console.log('添加过父亲',parameter);
					if (e.index == 0) {
						// 添加购物车
						// console.log('添加了购物车');
						if (this.specList1 && this.specList1.length > 0 || this.specList1 && this.skuList1.length > 0) {
							this.show = true;
							if (this.xuan0 != '' || this.xuan1 != '' || this.xuan2 != '') {
								if (this.msyg != undefined && this.msyg != '抢购中') {
									uni.showToast({
										title: this.msyg,
										icon: 'none'
									});
									return;
								}
								this.$request.getAddCartItem(parameter).then(res => {
									uni.removeStorageSync('shareMobile')
									// this.options[1].info = res.data.cartItemNumber;
									this.getcart_unm()
									getApp().globalData.increment = 2;
								});
							}
						} else {
							if (this.msyg != undefined && this.msyg != '抢购中') {
								uni.showToast({
									title: this.msyg,
									icon: 'none'
								});
								return;
							}
							this.$request.getAddCartItem(parameter).then(res => {
								// this.options[1].info = res.data.cartItemNumber;
								this.getcart_unm()
								getApp().globalData.increment = 2;
							});
						}
					} else {
						if (this.msyg != undefined && this.msyg != '抢购中') {
							uni.showToast({
								title: this.msyg,
								icon: 'none'
							});
							return;
						}
						let {
							goods: {
								name,
								pic,
								sshopId: shopId
							}
						} = this.item;
						/* 跳转到订单页面购买 */
						// console.log('去购买');
						// 新逻辑开始
						if (this.specList1 && this.specList1.length > 0 || this.skuList1 && this.skuList1.length > 0) {
							this.show = true;
							if (this.xuan0 != '' || this.xuan1 != '' || this.xuan2 != '') {
								Object.assign(parameter, {
									name,
									pic
								});
								if (this.msprice != undefined) {
									this.$request
										.postCheckSpikeActivity({
											spikeId: this.spickId,
											mobile: this.mobile,
											goodsId: id,
											count: this.count
										}, {
											'Content-type': 'application/x-www-form-urlencoded'
										})
										.then(res => {
											if (res.code != 200) {
												this.isShowToast(res.msg);
												return;
											} else {

												this.jump(
													`/pages/pagesA/order/order?parameter=${JSON.stringify(parameter)}&msprice=${this.msprice}&spickId=${this.spickId}&isNewMemberGoods=${this.isNewMemberGoods}`
												);
											}
										});
								} else {

									this.jump(
										`/pages/pagesA/order/order?parameter=${JSON.stringify(parameter)}&msprice=${this.msprice}&spickId=${this.spickId}&isNewMemberGoods=${this.isNewMemberGoods}`
									);
								}
							}
						} else {
							Object.assign(parameter, {
								name,
								pic
							});
							if (this.msprice != undefined) {
								this.$request
									.postCheckSpikeActivity({
										spikeId: this.spickId,
										mobile: this.mobile,
										goodsId: id,
										count: this.count
									}, {
										'Content-type': 'application/x-www-form-urlencoded'
									})
									.then(res => {
										if (res.code != 200) {
											this.isShowToast(res.msg);
											return;
										} else {
											// console.log('传递过去的数据是1',parameter)
											this.jump(
												`/pages/pagesA/order/order?parameter=${JSON.stringify(parameter)}&msprice=${this.msprice}&spickId=${this.spickId}&isNewMemberGoods=${this.isNewMemberGoods}`
											);
										}
									});
							} else {
								// console.log('传递过去的数据是2',parameter)
								this.jump(
									`/pages/pagesA/order/order?parameter=${JSON.stringify(parameter)}&msprice=${this.msprice}&spickId=${this.spickId}&isNewMemberGoods=${this.isNewMemberGoods}`
								);
							}
						}
					}
				}
			},
			/* 查看大图 */
			see(index) {
				// console.log(index, urls);
				uni.previewImage({
					current: index,
					urls: this.item.goodsImagesList.map(val => val.pic || val.url)
				});
			},
			// 弹出框查看大图
			see1(index) {
				// console.log(index,urls)
				uni.previewImage({
					current: index,
					urls: [`${this.item.goods.pic}`]
				});
			},
			//解析富文本方法
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/<div>/gi, '');
				newContent = newContent.replace(/<[^>]*\/div>/gi, '');
				newContent = newContent.replace(/<figure class=\"image\">/gi, '');
				newContent = newContent.replace(/<[^>]*\/figure>/gi, '');
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
				return newContent;
			},
			openpop() {
				this.popShow = true;
			},
			getcoupon(isKl, cardids) {
				this.nowcard = '';
				if (this.time) {
					return;
				}
				if (uni.getStorageSync('token') == '') {
					uni.navigateTo({
						url: '/pages/pagesA/denglu/denglu'
					});
					return;
				}
				this.$request
					.postGetCardsByMobile({
						mobile: this.$store.state.userInfo.mobile
					})
					.then(res => {
						if (res.cards.length == 0) {
							uni.showModal({
								content: '您还没有卡，是否去申请卡',
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/pagesA/receive/receive'
										});
									} else {
										uni.navigateBack({
											delta: 1
										});
									}
								}
							});
						} else {
							let bindTrue = res.cards.some(item => {
								return item.isBind == 1;
							});
							if (bindTrue == false) {
								uni.showModal({
									content: '您还没有绑卡，是否去绑卡',
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: '/pages/pagesA/bindcard/bindcard'
											});
										} else {
											uni.navigateBack({
												delta: 1
											});
										}
									}
								});
							} else {
								let cardNoList = [];
								this.nowcard = '';
								res.cards.forEach(item => {
									if (item.isBind == 1) {
										cardNoList.push(item.cardNo);
										this.nowcard = cardNoList[0];
									}
								});
							}
						}
						let title = (this.nowcard == undefined && '请先获取会员卡！') || (isKl == 'N' && '暂不能领取！');
						if (title != false) {
							(title => {
								uni.showToast({
									title,
									icon: 'none'
								});
								this.nowcard == undefined &&
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/pagesA/receive/receive'
										});
									}, 1500);
							})(title);
							return;
						}
						this.$request
							.postCollectElecInfo({
								cardids,
								cardNo: this.nowcard,
								limits: '1',
								source: 'weixin'
							})
							.then(res => {
								//SUCCESS成功 FAIL失败
								if (res.code != 200) {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									});
									return;
								}
								let status = res.data.status == 'SUCCESS';
								uni.showToast({
									title: status ? '领取成功' : '领取已达上线',
									icon: status ? 'success' : 'error'
								});
							});
					});
				this.time = setTimeout(() => {
					this.time = null;
				}, 2000);
			}
		}
	};
</script>
<style lang="scss">
	@import '@/static/style/uni.scss';
	.taocan{
		background-color: #fff;
	}
	.taocan-item{
		display:flex;
		align-items: center;
		    width: 95%;
		    margin: 20rpx auto;
	}
	.taocan-active{
		background-color:rgba(255, 0, 4, 0.3) !important;
		color: rgb(255, 0, 4) !important;
		border: 1rpx solid rgb(255, 0, 4) !important;
	}
	.taocan-item>view{
		height: 80rpx;
		width: 130rpx;
		border: 1rpx solid #e0e0e0;
		margin-right: 20rpx;
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-radius: 20rpx;
	}
	.tan {
		height: 1000rpx;
		border-radius: 30rpx;
		position: relative;
	}

	.donghua {
		position: absolute;
		left: 45%;
		top: 45%;
		// top: 50%;
		// top: 50%;
		// left: 50%;
		transform: translateX(-50%);
		transform: translateY(-50%);

	}

	.tan_center {
		width: 700rpx;
		height: 100%;
		// background-color: pink;
		margin: 40rpx auto;
	}

	.tan_top {
		display: flex;
		align-items: center;
	}

	.color_top,
	.size_top {
		margin: 20rpx 0 20rpx 0;
	}

	.top-right {
		padding-left: 20rpx;
	}

	.top-right view {
		margin-top: 10rpx;
	}

	.tan_img {
		height: 200rpx;
		width: 200rpx;
		border-radius: 20rpx;
	}

	.color_top {
		margin-top: 30rpx;
	}

	.queding {
		border-radius: 20px;
		width: 700rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10rpx;
		background-color: red;
		color: #fff;
	}

	.kucun {
		color: #999999;
	}

	.goodsDetails {
		swiper {
			$height: 750rpx;
			height: $height;

			.swiper-item {
				height: 100%;
			}

			image {
				width: 100%;
				height: $height;
			}
		}

		.zgdj {
			color: #fff;
			font-size: 25rpx;
			background-color: red;
			border-radius: 4rpx;
			padding: 0 8rpx;
		}

		.zhekou {
			margin-left: 2%;
			color: #fff;
			font-size: 29rpx;
			background-color: red;
			border-radius: 4rpx;
			padding: 0 5rpx;
		}

		.coupon:first-child {
			margin-top: 90rpx;
		}

		.leng {
			width: 95%;
			margin: 90rpx auto;
			text-align: center;
		}

		.quan {
			margin-left: 4%;
			color: red !important;
			border: 1rpx solid red;
			font-size: 25rpx !important;
			padding: 3rpx 15rpx;
			border-radius: 10rpx;
		}

		.coupon {
			width: 95%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			display: flex;

			.left {
				width: 30%;
				color: #fff;
				text-align: center;
				line-height: 170rpx;
				font-size: 38rpx;
				border-top-left-radius: 10rpx;
				border-bottom-left-radius: 10rpx;
				// background: linear-gradient(90deg, #ff8f4d 25%, #ff6950 90%);
				border-right: 5rpx dashed #fff;

				text {
					font-size: 47rpx !important;
				}
			}

			.right {
				width: 65%;
				margin-left: 20rpx;
				padding-top: 20rpx;
				border-top-right-radius: 10rpx;
				border-bottom-right-radius: 10rpx;

				view {
					margin-top: 10rpx;

					text {
						font-size: 26rpx;
					}
				}

				.manjian {
					font-size: 28rpx;
					color: red;
				}

				.right_btn {
					background-color: #fe2231;
					text-align: center;
					color: #fff;
					height: 50rpx;
					line-height: 50rpx;
					min-width: 170rpx;
					padding: 2rpx 20rpx;
					border-radius: 25rpx;
					font-size: 26rpx;
					float: right;
				}
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

		.details {
			margin-bottom: 140rpx;

			.aj-jinrujiantou {
				float: right;
				font-size: 50rpx;
			}

			&>view:first-child {
				@include gong;

				&>text:first-child,
				&>text:nth-child(4) {
					font-size: 28rpx;
					color: #999;
				}

				&>text:nth-child(2) {
					color: red;

					font: {
						size: 28rpx;
						weight: 900;
					}
				}

				&>text:nth-child(3) {
					margin-right: 20rpx;
					color: red;

					font: {
						size: 40rpx;
						weight: 900;
						style: italic;
					}
				}

				&>text:nth-child(4) {
					text-decoration: line-through;
				}
			}

			.spike {
				color: #999;

				text {
					color: red;

					font: {
						size: 40rpx;
						weight: 900;
					}
				}
			}

			.points {
				$color: #999 !important;

				&>view {
					color: $color;

					text {
						font-size: 40rpx;
						color: red;
						font-weight: 600;
					}
				}

				&>text:nth-child(2) {
					margin-right: 30rpx;
					color: $color;
					font-weight: normal !important;

					text {
						font-size: 35rpx;
						color: red;
						font-weight: 600;
					}
				}

				&>text:nth-child(3) {
					font-size: 28rpx !important;
					font-style: normal !important;
					font-weight: normal !important;
					color: $color;

					text {
						font-size: 35rpx;
						color: red;
						font-weight: 600;
					}
				}
			}

			.commodityName {
				@include gong;

				>text:nth-child(1) {
					font-size: 28rpx;
					color: #999;
				}

				>text:nth-child(2) {
					color: #000000;
				}
			}

			.hongbao {
				@include gong;
				font-size: 28rpx;

				>text:nth-child(1) {

					// font-size: 28rpx;
					// color: #999;
					.aj-hongbao {
						color: #d41313;
						font-size: 50rpx;
					}
				}

				>text:nth-child(2) {
					color: #000000;
				}
			}

			.title {
				@include gong;

				&>view:first-child {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					text:nth-child(1) {
						color: #999;
					}
				}

				&>view:last-child {
					text:nth-child(1) {
						color: #999;
					}
				}
			}
		}

		.uni-goods-nav {
			position: fixed;
			bottom: 0;
			width: 100%;
		}

		.tuijian {
			font-size: 35rpx;
			text-align: center;
			font-weight: 900;
			margin: 30rpx 0;
		}

		.duihuan {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #fff;
			background-color: #f5322b;
			position: fixed;
			bottom: 0;
		}
	}

	.yanse {
		display: flex;
		box-sizing: content-box;
		// justify-content: space-around;
		flex-wrap: wrap;
		// justify-content: space-around;
		// background-color: #fff;
	}

	.yanse view {
		height: 50rpx;
		padding: 0 30rpx 0 30rpx;
		background: #fafafa;
		margin: 10rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 25px;
		box-sizing: border-box;
		border: 1px solid transparent;
	}

	.yanse_title {
		margin: 20rpx;
		font-size: 28rpx;
		color: #999;
		background-color: #fff;
		margin-bottom: 0;
	}

	.yanse .active {
		color: red;
		border: 1px solid red;
		background-color: rgba(255, 0, 0, 0.1);
		box-sizing: border-box;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}

	.title {
		line-height: 40px;
	}

	.spec-item {
		display: inline-block;
		margin-right: 10px;
	}

	.spec-item text {
		border: 1px solid #eee;
		cursor: pointer;
		padding: 5px 10px;
		display: inline-block;
		margin: 10rpx;
		border-radius: 25px;
	}

	.spec-item .active {
		border: 1px solid red;
		background-color: #feeaec;
		color: red;
	}

	.spec-item .disabled {
		color: #c0c4cc;
		cursor: not-allowed;
		background-image: none;
		background-color: #fff;
		border-color: #ebeef5;
	}
	
</style>
