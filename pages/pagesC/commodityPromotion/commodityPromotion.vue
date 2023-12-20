<template>
	<view class="box">
		<view class="top">
			<view class="top1" @click="location">
				<view class="" style="margin-left: 20rpx;">
					<u-icon name="map" color="#000000" size="40"></u-icon>
				</view>
				<view
					style="margin: 0 10rpx; max-width: 210rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{shopName}}</view>
				<u-icon name="arrow-right" color="#000000" size="30"> </u-icon>
			</view>
			<view style="display: flex;align-items: center;">
				<view style="width: 380rpx;">
					<u-tabs :list="fenlei2" keyName='name' lineWidth="0" lineHeight="0"
						:activeStyle="{color:'#fe6850',fontWeight:'bold'}" @click="changeSec" :current="current">
					</u-tabs>
				</view>
				<text class="aj aj-xiangxiajiantou" @click="chooShow= true,showoverlay=true"></text>
				<view v-if="chooShow" class="allchoos">
					<view>
						<view :class="index==indexs?'active':''" v-for="(item,index) in fenlei2"
							@click="chooseSec(index,item.id)" :key="index">{{item.name}}</view>
					</view>
					<view @click="chooShow= false,showoverlay=false">点击收起</view>
				</view>
			</view>
			<u-overlay :show="showoverlay"></u-overlay>
		</view>
		<view class="location" v-show="falg">
			<view v-for="(item,index) in  storeList" class="shopname" :key="index" @click="qiehuan(item)">
				<view style="display: flex;" class="shopitem"> <text style="width: 360rpx;">{{item.name}}</text>
					<u-icon name="arrow-right" color="#d0d0cf" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view>
			<view>
				<u-tabs :list="list1" @click="click" keyName='name' :current="current1" :activeStyle="{
			    color: '#fd5804',
			    fontWeight: 'bold',
			    transform: 'scale(1.05)'}" lineColor="#fd5804" lineWidth='50' lineHeight="6" :itemStyle="{
			    height: '100rpx',
			}" :inactiveStyle="{
			    color: '#000000',
			    transform: 'scale(1)'
				
			}"></u-tabs>
			</view>
			<view class="center-top">
				<view class="ssbox">
					<!-- <view class="tuiguang" @click="tuiguang"> -->
					<view class="tuiguang" @click="show = true">
						<view style="margin-right: 10rpx;font-size: 35rpx;">
							商品推广
						</view>
						<u-icon name="error-circle" color="#000000" size="40"></u-icon>
					</view>
					<view class="sous-box">
						<u--input placeholder="搜索商品" prefixIcon="search"
							prefixIconStyle="font-size: 22px;color: #909399" border="none"
							customStyle="background-color: #e7e7e8; " @confirm="sousuo" @change='shuru'></u--input>
					</view>
				</view>

			</view>

			<!-- <button
					open-type="share"
					:data-obj="item"
					class="operate-item"
				>
					<text>转发</text>
				</button> -->
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="lower"
				lower-threshold='250'>
				<view class="body" v-if="list.length>0">
					<view v-for="(item,index) in list" class="item" :key="index">
						<view class="" @click="xq(item)">
							<image :src="item.pic" mode="" class="img"></image>
						</view>
						<view class="sp_center" @click="xq(item)">
							<view class="name">
								<view>{{item.fullName}}</view>

							</view>
							<view class="">
								<view class="" style="color: #ec9464;font-size: 35rpx;">
									￥{{item.price}}
								</view>
								<view class="" style="color: #8a8a89;">
									{{item.commissionRate}}×商品实付金额
								</view>
							</view>

						</view>
						<view class="right">
							<view></view>
							<!-- <view class="fenxiang" @click="onShareAppMessage">
	<text style="font-size: 20rpx;">	预计赚</text>￥{{item.yugu}}
						</view> -->
							<button open-type="share" :data-obj="item" class="operate-item">
								<text> <text style="font-size: 17rpx;">赚</text>{{item.commission}}</text>
							</button>
						</view>
					</view>
				</view>
				<view class='kong' v-else>
					当前门店下暂无此类商品~
				</view>
				<u-loadmore v-if="list.length>0" loadmore="semicircle" :loadmoreText='tishiText' :status="status" fontSize='28'
					iconSize="34" />
			</scroll-view>
		</view>
		<view style="padding: 20rpx;box-sizing: border-box;">
			<u-popup :show="show" @close="close" @open="open">
				<view v-for="(item,index) in  guize" class="guize" :key="index">
					<view style="font-weight: 600;margin-right: 20rpx; width:120rpx ">规则{{index+1}}:</view>
					<view class="neirong">
						{{item.guize}}
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				current: 0,
				current1:0,
				indexs:0,
				FL1Id:'',
				FL2Id:'',
				chooShow: false,
				showoverlay: false,
				tishiText: '宝贝正在来的路上~~~',
				status: 'loadmore',
				list: [],
				data: [],

				value: '',
				falg: false,
				shopName: uni.getStorageSync('storeName'),
				shopNo: uni.getStorageSync('storeSn'),
				storeList: this.$store.state.locateInformation.storeList,
				// storeList: [],
				show: false,
				fenlei2: [],
				guize: [{
						guize: '点击分享按钮分享到群聊或者微信好友'
					},
					{
						guize: '好友下单之后，可以获得等比例佣金'
					},
					{
						guize: '获得的佣金可以在 我的>合伙人>冻结金额中查看'
					},
					{
						guize: '冻结时间为7天，到达时间之后可以提现（单次提现金额最低10元）'
					},
					{
						guize: '（注意）如好友申请退款，获得的佣金会自动扣除！！！'
					}
				],
				mobile: uni.getStorageSync('userInfo').mobile,
				index: 0,
				list1: []
			}
		},
		onShow() {
			
		},
		onLoad() {
			this.getFl()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: '自定义分享标题',
				path: '/pages/test/test?id=123'
			}
		},
		methods: {
			changeSec(e) {
				uni.showLoading({
					title: '加载中'
				});							
				console.log('二级',e);
				console.log(e.id);
				this.FL2Id=e.id
				this.current = e.index
				this.indexs = e.index
				if(e.id==''){
					console.log('查看全部',this.FL1Id);
					this.$request.postgoodsCategory({
						shopNo:this.shopNo,
						page: 1,
						id: this.FL1Id
					}, {
						// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
						'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
							uni.hideLoading();
						this.list = res.goodlist
						if (res.goodlist.length <= 9) {
							console.log('底线212');
							this.tishiText = '我也是有底线的~'
						}
					})
					return
				}
				this.$request.postgoodsCategory({
					shopNo: this.shopNo,
					page: 1,
					id: e.id||this.FL1Id
				}, {
					// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
						uni.hideLoading();
					this.list = res.goodlist
					if (res.goodlist.length <= 9) {
						console.log('底线229 二级',res.goodlist.length);
						this.tishiText = '我也是有底线的~'
					}
				})
			},
			chooseSec(index,id) {
				uni.showLoading({
					title: '加载中'
				});
				 this.index=1
				this.current = index
				this.indexs = index
				this.chooShow = false
				this.showoverlay = false
				if(id==''){
					console.log('查看全部',this.FL1Id);
					this.$request.postgoodsCategory({
						shopNo: this.shopNo,
						page: 1,
						id: this.FL1Id
					}, {
						// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
						'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
								uni.hideLoading();
						this.list = res.goodlist
						if (res.goodlist.length <= 9) {
							console.log('我也有256');
							this.tishiText = '我也是有底线的~'
						}
					})
					return
				}
				this.$request.postgoodsCategory({
					shopNo: this.shopNo,
					page: 1,
					id: id
				}, {
					// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
							uni.hideLoading();
					this.list = res.goodlist
					
					if (res.goodlist.length <= 9) {
						console.log('底线273',res);
						this.tishiText = '我也是有底线的~'
					}
				})
			},
			click(item) {
				this.current1=item.index
				this.index=1
				this.FL2Id=''
				this.FL1Id=item.id
				this.indexs=0
				console.log('item', item);
				this.getFl2(item.id,1)
				console.log('改变前的值',this.current);
				this.current=0
				console.log('改变后的值',this.current);
			},
			getFl2(id,flag) {
				uni.showLoading({
					title: '加载中'
				});
				this.$request.postgoodsCategory({
					shopNo: this.shopNo,
					page: 1,
					id: id
				}, {
					// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
							uni.hideLoading();
					this.fenlei2 = res.categoryList
					this.list = res.goodlist
					this.fenlei2.unshift({
						name: '全部',
						id: ''
					})
					console.log('底线305	前1第一次',res.goodlist);
					if (flag==0&&res.goodlist.length <= 9) {
						console.log('底线305	前 第一次',res);
						this.tishiText = '我也是有底线的~'
					}else{
						this.tishiText = '宝贝正在来的路上~~~'
					}
				})
			},
			lower() {
				this.index++
				if(this.FL2Id==''){
					this.$request.postgoodsCategory({
						shopNo: this.shopNo,
						page: this.index,
						id: this.FL1Id
					}, {
						// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
						'Content-type': 'application/x-www-form-urlencoded',
					}).then(res => {
						this.list.push(...res.goodlist)
						if (res.goodlist.length <= 9) {
							console.log('底线322');
							this.tishiText = '我也是有底线的~'
						}
					})
					return
				}
				this.$request.postgoodsCategory({ 
					shopNo: this.shopNo,
					page: this.index,
					id: this.FL2Id
				}, {
					// 'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					this.list.push(...res.goodlist)
					if (res.goodlist.length <= 9) {
						console.log('底线338');
						this.tishiText = '我也是有底线的~'
					}
				})
				
				// this.index++
				// this.$request.getcommission({
				// 	// shopId: this.shopNo,
				// 	shopId:'04001',
				// 	page:this.index
				// }).then(res => {
				// 	this.list.push(...res)
				// 	if(res.length<10){
				// 		this.tishiText ='我也是有底线的~'
				// 	}
				// })
			},
			close() {
				this.show = false
				// console.log('close');
			},
			location() {
				this.falg = !this.falg
			},
			onShareAppMessage(res) {
				// 这里的res对应上面给button传的自定义数据data-obj，可打印出来看看 
				const data = res.target.dataset.obj;
				return {
					title: data.fullName,
					path: `pages/pagesA/goodsDetails/goodsDetails?id=${data.goodsId}_${this.shopNo}&mobile=${this.mobile}`, // 被分享人点击进来的url，后面可接参数
					imageUrl: data.pic, // 自定义分享图片
					success: () => {
						console.log('分享成功');
					},
					fail: () => {
						console.log('分享失败');
					},
				};
			},
			// getlist() {
			// 	// uni.showLoading({
			// 	// 	title: '加载中'
			// 	// });
			// 	this.index = 1
			// 	// this.get('http://192.168.1.106:8107/tiansenRakeBackYj/commission?shopId=04006&tenantId=39602')
			// 	// this.$request.getcommission({
			// 	// 	// shopId: this.shopNo,
			// 	// 	shopId: '04001',
			// 	// 	page:1
			// 	// }).then(res => {
			// 	// 	uni.hideLoading();
			// 	// 	console.log('res', res);
			// 	// 	this.data = res
			// 	// 	this.list = res
			// 	// 	if(res.length<10){
			// 	// 		this.tishiText ='我也是有底线的~'
			// 	// 	}
			// 	// })
			// },
			getFl() {
				this.$request.postqueryMenu({
					shopNo: this.shopNo
				}, {
					'Authorization': 'Basic YmFveXVhbjpiYW95dWFuX3NlY3JldA==',
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					console.log('我是一级列表', res);
					this.list1 = res.listMenu
					console.log('商品数据', this.list);
					this.getFl2(res.listMenu[0].id,0)
					this.FL1Id=res.listMenu[0].id
				})
			},
			sousuo() {
				uni.showLoading({
					title: '努力搜索中~'
				});
				if (!this.value) {
					this.getFl()
					return
				}
				this.$request.getsearchGoods({
					name: this.value,
					shopId: this.shopNo
				}).then(res => {
					uni.hideLoading();
					this.list = res
				})
			},
			shuru(e) {
				console.log('输入', e);
				this.value = e
				if (e == '') {
					// this.list  = this.data
					this.getFl()
				}
			},
			qiehuan(item) {
				console.log(item);
				this.shopNo = item.storeSn
				this.shopName = item.name
				console.log(this.shopNo, this.shopName);
				this.falg = false
				this.getFl()
				this.current1=0
			},
			xq(item) {
				console.log('详情', item);
				let mobile = uni.getStorageSync('userInfo').mobile
				console.log('详情2', mobile);
				uni.navigateTo({
					url: `/pages/pagesA/goodsDetails/goodsDetails?id=${item.goodsId}_${this.shopNo}`
				})
			},
			tuiguang() {
				console.log('推广');
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/style/uni.scss";

		.active {
			color: #fe6850;
			font-weight: 600;
		}
	.fenlei2 {
		height: 210rpx;
	}

	.shopitem {
		padding: 10rpx 10rpx 10rpx 10rpx;
		border-bottom: 1rpx solid #d0d0cf;
		/* margin-bottom: 10rpx; */
	}

	.allchoos {
		font-size: 28rpx;
		width: 100%;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 99999;
		background-color: #fff;

		>view:first-child {
			display: flex;
			// justify-content: space-around;
			flex-wrap: wrap;
			padding-top: 10rpx;

			>view {
				width: 32%;
				padding: 9rpx 0;
				background-color: #f5f6f8;
				border-radius: 5rpx;
				margin-bottom: 15rpx;
				text-align: center;
				margin-right: 2%;
			}

			>view:nth-child(3n) {
				margin-right: 0;
			}
		}

		>view:nth-child(2) {
			text-align: center;
			margin: 10rpx 0;
		}
	}

	/* 	.shopitem:last-child{
		border-bottom: ;
	} */
	.shopname {
		line-height: 60rpx;
	}

	.location {
		width: 410rpx;
		/* height: 600rpx; */
		background-color: #f3f3f4;
		position: absolute;
		z-index: 999;
		left: 10rpx;
		top: 80rpx;
		border-radius: 10px;
	}

	.kong {
		height: 400rpx;
		width: 100%;
		text-align: center;
		font-size: 40rpx;
		line-height: 400rpx;
	}

	page {
		background-color: #fff;
	}

	.top {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1rpx solid #dcdcdc;
	}

	.top1 {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1rpx solid #dcdcdc;
	}


	.box {
		/* width: 700rpx; */
		margin: 0 auto;
	}

	.tuiguang {
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.inputcss {
		background-color: pink;
	}

	.scroll-Y {
		height: 1150rpx;
	}

	.ssbox {
		display: flex;
		align-items: center;
		justify-content: space-around;

	}

	.body {
		/* height: 700rpx; */
		border: 20rpx solid #ebebeb;
		border-radius: 20rpx;
	}

	.img {
		height: 170rpx;
		width: 170rpx;
		border-radius: 20rpx;
		margin-right: 10rpx;
	}

	.item {
		padding: 20rpx;
		height: 170rpx;
		display: flex;
		border-bottom: 20rpx solid #ebebeb;
	}

	.item:last-child {
		/* 在这里添加样式 */
		border-bottom: none;
	}

	.sp_center {
		margin-left: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.name {
		width: 295rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;

	}

	.right {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		width: 200rpx;
	}

	.fenxiang {
		width: 170rpx;
		height: 60rpx;
		background-color: #fd5804;
		border-radius: 25px;
		line-height: 60rpx;
		text-align: center;
		color: #fff;
	}

	.operate-item {
		width: 205rpx;
		height: 60rpx;
		background-color: #fd5804;
		border-radius: 25px;
		line-height: 60rpx;
		text-align: center;
		color: #fff;
	}

	.guize {
		display: flex;
		margin-top: 30rpx;
		margin-left: 10rpx;
		border-bottom: 1rpx solid #dadada;
		padding-right: 10rpx;
		box-sizing: border-box;
	}

	.neirong {
		color: #544e4e;
	}

	.allchoos1 {
		width: 100%;
		display: flex;

		/deep/ .u-tabs__wrapper__nav__item__text {
			font-size: 30rpx;
		}

		/deep/.u-tabs__wrapper__nav__item {
			height: 35px !important;
			padding: 0 15rpx;
		}

		>view:first-child {
			width: 90%;
		}

		>view:nth-child(2) {
			width: 10%;
			background-color: #fff;
			text-align: center;
			position: relative;

			text {
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translate(50%, -50%);
			}
		}
	}
</style>
