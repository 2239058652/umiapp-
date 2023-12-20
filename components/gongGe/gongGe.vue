<template>
	<view class="order" @click="jump">
		<view class="order-top">
			<view class="order-list1">{{title}}</view>
			<view class="order-list2">
				<text @click="change(0)" v-if="title!='我的服务'">查看全部<text class="aj aj-jinrujiantou"
						style="font-size: 30rpx"></text></text>
			</view>
		</view>
		<view :class="['date',title=='我的足迹'?'maxbottom':'']" >
			<view v-for="(item,index) in list" :key="index" @click="change(index+1,item.id,item.name,item.url)"
				:style="{width:$u.addUnit(parseInt(100/lists),'%')}">
				<u-badge absolute="true" :value="nums[index+1]" type="error" :offset="[15,28]"></u-badge>
				<text v-if="/aj/.test(item.img)" :class="item.img" style="font-size: 60rpx; color:red;"></text>
				<image v-else :src="item.img" mode="aspectFit"></image>
				<view class="date-text">{{item.name}}</view>
			</view> 
		</view>
	</view>
</template>
<script>
	import {
		wxUrl,
		corpId
	} from '@/config/baseUrl.js'
	export default {
		name: "gongGe",
		props: {
			list: {
				type: Array
			},
			title: {
				type: String
			},
			number: {
				type: Number
			},
		},
		data() {
			return {
				num: [],
				nums: [],
				isHhr: ''
				// weipushop:uni.getStorageSync('isWeipuShop')
			}
		},
		computed: {
			lists() {
				if (Object.keys(this.list).length == 3) {
					return 3
				} else {
					return 4
				}
			}

		},
		mounted() {
			this.orderNum();
			uni.$on("orderNum", this.orderNum)
		},
		methods: {
			jump() { //子组件调用父组件的方法
				this.$emit("jump")
			},
			change(e, id, name, url) {
				if (this.title == "我的订单") {
					uni.navigateTo({
						url: `/pages/pagesA/myOrder/myOrder?e=${e}`
					})
				} else if (this.title == "我的足迹") {
					if (e == 0) {
						uni.navigateTo({
							url: "/pages/pagesA/footprint/footprint"
						})
					} else {
						if (uni.getStorageSync('isWeipuShop') == 1) {

							uni.navigateTo({
								url: `/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${id}_${getApp().globalData.shopNo}`
							})
						} else {
							uni.navigateTo({
								url: `/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${getApp().globalData.shopNo}`
							})
						}
					}

					// e==0 ? uni.navigateTo({url:"/pages/pagesA/footprint/footprint"}):this.weipushop==1?uni.navigateTo({url:`/pages/pagesA/jfgoodsDetails/jfgoodsDetails?id=${id}_${getApp().globalData.shopNo}`}):uni.navigateTo({url:`/pages/pagesA/goodsDetails/goodsDetails?id=${id}_${getApp().globalData.shopNo}`})


				} else if (this.title == "我的服务") {
					if (name == "在线客服") {
						uni.openCustomerServiceChat({
							extInfo: {
								url: wxUrl
							},
							corpId: corpId,
							success(res) {},
							fail(err) {
								console.error(err)
								uni.showToast({
									title: JSON.stringify(err),
									icon: 'none',
									duration: 2000
								});
								return
							}
						})
					}
					if (url == '/pages/pagesC/tuiguangyongjin/tuiguangyongjin') {
						// if(uni.getStorageSync('isHhr')==1){
						// 0或1
						if (uni.getStorageSync('isHhr') == 1) {
							uni.navigateTo({
								url: url
							})
						} else {
							uni.showToast({
								title: '您还没开通合伙人权限，请联系客服提交申请。',
								icon: 'none',
								duration: 2000
							});
						}
					} else {
						uni.navigateTo({
							url: url
						})
					}
				}
			},
			orderNum() {
				if (this.number == 1 && uni.getStorageSync('token') != '') {
					this.num = []
					let sn = uni.getStorageSync('storeSn')
					this.$request.getMemberIndex({ //每次进入都触发请求 不合理
						mobile: uni.getStorageSync('userInfo').mobile,
						shopNo: getApp().globalData.shopNo || sn
					}).then(res => {
						this.isHhr = res.member.isHhr
						// console.log('是不是',this.isHhr,res.member.isHhr)
						uni.setStorageSync('isHhr', res.member.isHhr)
						this.num[0] = 0
						this.num[1] = res.toBePaidOrderNum //待付款
						this.num[2] = res.toBeConfirmedOrderNum // 待确认
						this.num[3] = res.toBeShippedOrderNum //待配送
						this.num[4] = res.toBeReceivedOrderNum //待收货
						this.num[5] = res.toBeEvaluatedOrderNum //待评价
						this.nums = this.num
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	.maxbottom{
		margin-bottom: 100rpx !important;
	}
	.order {
		width: 96%;
		padding: 0 2%;
		background-color: #fff;
		border-radius: 30rpx;
		margin: 20rpx auto;

		.order-top {
			@mixin size ($a:38rpx) {
				display: inline-block;
				width: 50%;
				font-size: $a;
			}

			padding: 20rpx 0 0 10rpx;

			.order-list1 {
				@include size(35rpx) font-weight: 900;
			}

			.order-list2 {
				@include size(28rpx) text-align: right;
				color: #c8c8c8;
			}
		}

		.date {
			display: flex;
			flex-flow: row wrap;
			width: 100%;
			padding-bottom: 40rpx;

			&>view {
				position: relative;
				padding-top: 20rpx;
				width: 25%;
				text-align: center;
			}

			&-text {
				margin-top: 10rpx;
				// font-weight: 900;
			}

			image {
				height: 100rpx;
				width: 100%;
				border-radius: 20rpx;
			}

			.date-text {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 28rpx;
			}
		}
	}
</style>
