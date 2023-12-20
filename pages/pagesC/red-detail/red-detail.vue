<template>
	<view class="box">
		<button class="quan" @click="quan">查看全部</button>
		<!-- <u-button customStyle="color:#fff;	 position: absolute; right: -20rpx; width:350rpx" type="default"  @click="getlist">查看全部</u-button> -->
		<view class="box-top">
			<u-picker v-model="show" mode="time" @confirm="timeConfirm"></u-picker>
			<view class="rq">
				<u-button customStyle="color:#fff;	 position: absolute; left: -20rpx; width:350rpx" type="default"
					@click="show = true">{{xuanze}}
					<uni-icons type="bottom" size="20" color="#fff"></uni-icons>
				</u-button>
			</view>
			<view class='box-top-b'>
				<view>
					<view class="title">
						{{title1||''}}
					</view>
					<view class="shu">
						{{shu}} <text>个</text>
					</view>
				</view>
				<view>
					<view class="title">
						{{title2}}
					</view>
					<view class="shu">
						{{sum_money}} <text>元</text>
					</view>
				</view>
			</view>
		</view>
		<view class="">
			<scroll-view @scrolltolower='chudi' scroll-y="true" class="box-bottom" show-scrollbar="true">
				<view class="one" v-for="(item,index) in list" :key="index" @click="item_xq(item.id)">
					<view class="one-item">
						<view class="item_left">
							<view class="" style="border-radius: 50%;">
								<u-icon name="rmb-circle" color="#f65646" size="70"></u-icon>
							</view>
							<view class="" style="margin-left: 10rpx;">
								<view class="item1">
									{{item.title||''}}
								</view>
								<view class="item1">
									{{item.createDate||''}}
								</view>
							</view>
						</view>
						<view class="item_right">
							<view class="">
								<view class="item2">
									金额:<text style="color: red;font-size: 34rpx;">{{item.reduceMoney}}</text>
								</view>
								<view class="item2">
									数量:{{item.quantity}}
								</view>

							</view>
							<view class="jiantou">
								<uni-icons type="forward" size="20"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore fontSize="30rpx" iconSize="30rpx" loadingText="努力加载中..." type="forward" :status="status" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loading',
				show: false,
				value1: Number(new Date()),
				xuanze: '请选择日期',
				title: '',
				shu: 0,
				zong: 0,
				list: [],
				sum_money: 0,
				title1: '共发出红包',
				title2: '合计金额',
				zong_list: [],
				num: 0,
				zs: 0
			}
		},
		onLoad() {
			this.getlist()
		},
		// 自带触底事件
		// onReachBottom(){
		//       // if(this.pagenum*this.pagesize>=this.total) return uni.$showMsg('数据加载完毕!')
		//       // this.pagenum+=1
		//       // this.getGoodsList()//调用函数
		// 	  console.log('触底了');
		//     },
		mounted() {
			var date = new Date() // 获取时间
			var year = date.getFullYear() // 获取年
			var month = date.getMonth() + 1 // 获取月
			var strDate = date.getDate() // 获取日

		},
		methods: {
			quan() {
				// this.xuanze = '请选择日期'
				// console.log('查看全部',)
				// this.list = this.zong_list
				// this.shu = this.zong_list.length
				// this.sum_money = 0
				// this.zong_list.forEach((item) => {
				// this.sum_money += item.reduceMoney * item.quantity
				// })

				this.xuanze = '请选择日期'
				this.zong_list = []
				this.list = []
				this.num = 0
				this.getlist()

			},
			// 组件触底事件
			chudi() {
				if (this.xuanze == '请选择日期') {
					// console.log('查看全部')
					var sheng = this.zs - 9
					this.zs = sheng
					if (this.list.length == this.zong_list.length) {
						this.status = 'nomore'
					} else {
						this.num++
						this.list.push(...this.zong_list.slice(this.num * 10, (this.num + 1) * 10))
						// console.log(this.num,this.list)
					}
				} else {
					// console.log('查询的是某一天')
				}

			},
			getlist() {
				this.sum_money = 0
				this.$request.redxq({
					descs: 'createDate',
					typeSign: 'dehbq',
					createUser: this.$store.state.userInfo.mobile,
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					this.status = 'nomore'
					this.zong_list = res.records.reverse()
					this.list = this.zong_list.slice(0, 10)
					this.zs = res.records.length
					this.shu = res.records.length
					res.records.forEach((item) => {
						this.sum_money += item.reduceMoney * item.quantity
					})
				})
				this.xuanze = '请选择日期'
			},
			timeConfirm(e) {
				this.xuanze = `${e.year}年-${e.month}月-${e.day}日`

				this.$request.redxq({
					createDate: `${e.year}-${e.month}-${e.day}`,
					typeSign: 'dehbq',
					createUser: this.$store.state.userInfo.mobile
				}, {
					'Content-type': 'application/x-www-form-urlencoded',
				}).then(res => {
					this.sum_money = 0
					// this.list = res.records.reverse()
					// if (res.records.length == 0) {
					this.status = 'nomore'
					// }
					this.list = res.records.reverse()
					this.shu = res.records.length
					// this.zong()
					var s = 0
					this.list.forEach((item) => {
						s = 0
						s = item.reduceMoney * item.quantity
						this.sum_money += s
					})
				})

			},
			item_xq(index) {
				uni.navigateTo({
					url: `/pages/pagesC/red-xq/red-xq?id=${index}`
				})
			}
		}
	}
</script>
<style lang="scss">
	.quan {
		width: 250rpx;
		height: 70rpx;
		position: absolute;
		background-color: #e93423;
		right: 30px;
		font-size: 30rpx;
		color: #fff;
		z-index: 999;
		line-height: 70rpx;
	}

	page {
		background-color: #e8e8e8;
	}

	.item1 {
		height: 50rpx;
	}

	.item2 {
		height: 50rpx;
		width: 125rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.rq {
		position: relative;
		width: 750rpx;
		height: 70rpx;
	}

	.btn {
		height: 100rpx;
		width: 200rpx;
		margin-left: 0rpx;
		border: none;
		position: absolute;
		left: 0;

	}

	.box-top {
		width: 750prx;
		height: 20vh;
		background-color: #e93423;
	}

	.box-top-b {
		width: 600rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}

	.title {
		color: #fff;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.shu {
		font-size: 50rpx;
		color: #fff;
	}

	.box-bottom {
		width: 700rpx;
		margin: 0 auto;
		background-color: #fff;
		height: 82vh;
		// height: 400rpx;

		margin-top: -2vh;
		border-radius: 20px;

	}

	// .scroll{
	// 		width: 700rpx;
	// 		height: 700rpx;
	// }
	.one {
		height: 126rpx;
		margin: 26rpx;
		border-bottom: 1px solid #ccc;

	}

	.one-item {
		display: flex;
		justify-content: space-between;
	}

	.item_right,
	.item_left {
		display: flex;
		align-items: center;
	}

	.jiantou {
		margin-left: 20rpx;
	}
</style>
