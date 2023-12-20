<template>
	<view class="newgoodsSpike">
		<view class="pageheader">
			<uni-nav-bar fixed="false" statusBar="false" left-icon="back" @clickLeft="back" leftWidth="50rpx">
				<text class="store" @click="location">
					{{ storeNames }}
					<text class="aj aj-daosanjiao"></text>
				</text>
			</uni-nav-bar>
		</view>
		<view class="fixed" v-if="show">
			<view class="line"></view>
			<roll ref="roll" :list="times" :isshow="true" font="false" @postAjaxSeckill="postAjaxSeckill" right="0" left="0" both="0 20rpx"></roll>
			<view class="text">
				<text>{{ spikeText }}：</text>
				<u-count-down :time="countdown" format="HH:mm:ss" autoStart @change="Change" @finish="finish">
					<view class="time">
						<view class="time__custom" v-if="countDown(timeData.days) != 0">{{ countDown(timeData.days) }}</view>
						<text class="time__doc" v-if="countDown(timeData.days) != 0">天</text>
						<view class="time__custom">{{ countDown(timeData.hours) }}</view>
						<text class="time__doc">:</text>
						<view class="time__custom">{{ countDown(timeData.minutes) }}</view>
						<text class="time__doc">:</text>
						<view class="time__custom">{{ countDown(timeData.seconds) }}</view>
					</view>
				</u-count-down>
				<text>限时秒杀最后疯抢</text>
			</view>
		</view>
		<view class="lists" v-if="show">
			<view
				v-for="(item, index) in lists"
				:key="index"
				:style="item.goodsNum == 0 && ['pointer-events:none']"
				@click.stop="jump(`/pages/pagesA/goodsDetails/goodsDetails?id=${item.sn}_${shopNo}&msprice=${item.price}&ygms=${status.description}&spickId=${item.id}`)"
			>
				<lazy-load :image="item.pic" :layoutType="style"></lazy-load>
				<view class="describe">
					<view v-show="item.goodsNum == 0"><text>已抢光</text></view>
					<view>{{ item.theme }}</view>
					<view>每单限购{{ item.goodsLimited }}件</view>
					<view>
						秒杀价￥{{ item.price }}
						<text>￥{{ item.yprice }}</text>
					</view>
					<view class="you" v-if="item.vipPrice != ''">
						<view>
							优
							<text>+</text>
						</view>
						<view>
							<text>￥</text>
							{{ item.vipPrice }}
						</view>
					</view>
					<view class="now">{{ status.description == '抢购中' ? '立即抢购' : '查看详情' }}</view>
				</view>
			</view>
		</view>
		<view v-if="!show"><u-empty mode="data" icon-size="250" font-size="35" margin-top="150" textSize="34" text="暂无秒杀活动"></u-empty></view>
	</view>
</template>

<style lang="scss">
@import '@/static/style/uni.scss';
.newgoodsSpike {
	.pageheader {
		width: 100%;
		.store {
			font-size: 40rpx;
			font-weight: 600;
			padding-top: 16rpx;
		}
	}
	.fixed {
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		z-index: 10;
		background: #fff;
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: red;
		margin-top: 0.2%;
	}

	.text {
		padding: 20rpx 30rpx;

		> text {
			color: grey;
			font-size: 25rpx;
		}

		> text:last-child {
			float: right;
		}

		.time {
			@include flex(row nowrap, stretch, center);

			&__custom {
				width: 40rpx;
				height: 40rpx;
				background-color: black;
				color: #fff;
				font-size: 30rpx;
				text-align: center;
				line-height: 40rpx;
			}

			&__doc {
				color: grey;
				padding: 0px 4px;
			}
		}
	}

	.lists {
		width: 95%;
		margin: 26% auto 0 auto;

		> view {
			@include flex(row nowrap, flex-start) width: 100%;
			padding: 15rpx;
			margin: 15rpx auto;
			background: #fff;
			box-sizing: border-box;
			border-radius: 30rpx;

			.describe {
				width: 100%;
				position: relative;
				margin-left: 15rpx;

				> view:nth-child(1) {
					--border: 2rpx solid #fff;
					@include absolute(25%, -50%) width: 29%;
					z-index: 9;
					background: rgba(30, 30, 30, 0.5);
					color: #fff;
					text-align: center;
					line-height: 400%;
					border-radius: 100rpx;
					transform: rotate(-20deg);

					text {
						border-top: var(--border);
						border-bottom: var(--border);
					}
				}

				> view:nth-child(2) {
					margin: 10rpx 0;
					@include hide(1, 40rpx);
				}

				> view:nth-child(3) {
					font-size: 20rpx;
					color: grey;
					margin-top: 22%;
				}

				> view:nth-child(4) {
					font-size: 30rpx;
					color: red;
					font-weight: 900;

					text {
						font-size: 25rpx;
						font-weight: 100;
						color: grey;
						text-decoration: line-through;
					}
				}

				.you {
					font-size: 25rpx;
					display: flex;

					> view:first-child {
						background: #2f2526;
						color: #e9dec6;
					}

					> view:last-child {
						background: #f2dec3;
						font-weight: 900;
					}
				}

				.now {
					--height: 50rpx;
					@include absolute(67%, 70%);
					background: red;
					font-size: 25rpx;
					color: white;
					text-align: center;
					line-height: var(--height);
					height: var(--height);
					width: 30%;
					border-radius: 50rpx;
				}
			}
		}
	}
}
</style>

<script>
import { mapState, mapMutations } from 'vuex';
let nyrsfm = new Date();
export default {
	data() {
		return {
			times: [], //时间段
			lists: [], //商品
			status: null, //活动状态
			timeData: {
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			}, //倒计时剩余时间
			countdown: null, //倒计时
			style: 'elasticLayout4', //排布样式
			shopNo: uni.getStorageSync('storeSn'),
			spikeText: '',
			show: null, //是否有秒杀活动
			storeNames: '',
			num: 1 ,//秒杀的页数
			_shop:''
		};
	},
	computed: {
		...mapState(['storeName'])
	},
	onLoad() {
		this._shop =  this.shopNo
		if (this.shopNo == '') {
			this.$store.dispatch('location');
		}
		this.lists = [];
		if (this.shopNo == '') {
			this.show = false;
			this.storeNames = '选择门店';
			return;
		} else {
			this.storeNames = this.storeName;
		}
		this.flag1 = false; // 阻止倒计时结束多次刷新
		this.nyrsfmstamp = nyrsfm.valueOf(); //nyrsfm时间戳
		this.date = nyrsfm.toLocaleDateString(); //当前日期
		this.shopNo = uni.getStorageSync('storeSn');
		
		this.queryTimer();
	},
	onShow() {
		let mendian = uni.getStorageSync('storeSn')
		if(mendian==this._shop){
			console.log('没更换门店嘞');
			console.log('老1',this.shopNo,'新1',this._shop);
		}else{
			console.log('更换门店了');
			console.log('老2',this.shopNo,'新3',this._shop);
			this._shop =  this.shopNo
			if (this.shopNo == '') {
				this.$store.dispatch('location');
			}
			this.lists = [];
			if (this.shopNo == '') {
				this.show = false;
				this.storeNames = '选择门店';
				return;
			} else {
				this.storeNames = this.storeName;
			}
			this.flag1 = false; // 阻止倒计时结束多次刷新
			this.nyrsfmstamp = nyrsfm.valueOf(); //nyrsfm时间戳
			this.date = nyrsfm.toLocaleDateString(); //当前日期
			this.shopNo = uni.getStorageSync('storeSn');
			
			this.queryTimer();
			this._shop = mendian
		}
		
		// if (this.shopNo == '') {
		// 	this.$store.dispatch('location');
		// }
		// this.lists = [];
		// if (this.shopNo == '') {
		// 	this.show = false;
		// 	this.storeNames = '选择门店';
		// 	return;
		// } else {
		// 	this.storeNames = this.storeName;
		// }
		// this.flag1 = false; // 阻止倒计时结束多次刷新
		// this.nyrsfmstamp = nyrsfm.valueOf(); //nyrsfm时间戳
		// this.date = nyrsfm.toLocaleDateString(); //当前日期
		// this.shopNo = uni.getStorageSync('storeSn');

		// this.queryTimer();
	},
	// 分享
	onShareAppMessage(res) {
		return {
			title: '欢乐爱家限时秒杀',
			path: `pages/tabbar/index/index?miaosha=miaosha`
		};
	},
	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: '欢乐爱家限时秒杀',
			path: `pages/tabbar/index/index?miaosha=miaosha`
		};
	},
	onReachBottom() {
		this.num++
		// this.getdata(this.num)
		uni.$u.http.post(this.$request.postAjaxSeckill, {
			shopNo: this.shopNo,
			spikeTimer: this.status.startTimer,
			page: this.num,
			pageSize: '20'
		}).then(res => {
			if (res.code == 200) {
				this.lists.push(...res.data)
			} else {
				uni.showToast({
					title: '都到底了，就下个单呗！',
					icon: "none"
				})
			}
		})
	},
	methods: {
		// 切换门店
		location() {
			uni.navigateTo({
				url: '/pages/pagesA/location/location?counter=1'
			});
		},
		queryTimer() {
			this.$request.postQuerySpikeStartTimer({}).then(res => {
				res.todayTimer.forEach((item, index) => {
					this.Status(this.timeStamp(item.spikeEndTimer), this.timeStamp(item.spikeStartTimer), res.todayTimer, item);
				});
				res.tomorrowTimer.forEach((item, index) => {
					this.Status(this.timeStamp(item.spikeEndTimer), this.timeStamp(item.spikeStartTimer), res.tomorrowTimer, item, item.spikeStartTimer.slice(0, 10));
				});
				this.times = [].concat(res.todayTimer, res.tomorrowTimer);
				this.times.forEach(item => {
					item.startTimer = item.spikeStartTimer;
					item.spikeStartTimer = item.spikeStartTimer.slice(11, 16);
				});
				this.times.length == 0 &&
					uni.showToast({
						title: '活动已结束',
						icon: 'none',
						duration: 2000
					});
				if (this.times.length != 0) {
					this.$nextTick(() => {
						this.$refs.roll.zhong = 0;
						this.postAjaxSeckill(this.times[0]);
					});
				}
				this.times.length == 0 ? (this.show = false) : (this.show = true);
			});
		},
		timeStamp(sfm) {
			return new Date(sfm.length > 12 ? sfm : sfm + ' 00:00:00').valueOf();
		}, //转化时间戳函数
		countDown(time) {
			return time >= 10 ? time : '0' + time;
		},
		jump(url) {
			uni.navigateTo({
				url
			});
		},
		back() {
			let pages = getCurrentPages();
			if (pages.length == 1) {
				uni.switchTab({
					url: '/pages/tabbar/index/index'
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		Status(...res) {
			//注意嵌套判断的书写顺序
			if (res[4]) {
				if (this.timeStamp(res[4]) != this.timeStamp(this.date)) {
					res[3].description = '明日预告';
					return;
				}
			}
			res[3].description = res[1] <= new Date().valueOf() && new Date().valueOf() < res[0] ? '抢购中' : '即将开抢';
		},
		postAjaxSeckill(data) {
				this.status = data
				data.description == '抢购中' ? (this.countdown = this.timeStamp(data.spikeEndTimer) - new Date().valueOf(),
					this.spikeText = '距结束') : (this.countdown = this.timeStamp(data.startTimer) - new Date().valueOf(),
					this.spikeText = '距开始')
				// 请求接口数据
				// uni.$u.http.post(this.$request.postAjaxSeckill, {
				// 	shopNo: this.shopNo,
				// 	spikeTimer: this.status.startTimer,
				// 	 page:this.num,
				// 	pageSize:'10' 
				// }).then(res => {
				// 	if (res.code == 200) {
				// 		this.lists = res.data
				// 		this.flag1 = true
				// 	} else {
				// 		this.lists = []
				// 		uni.showToast({
				// 			title: res.msg,
				// 			icon: "none"
				// 		})
				// 	}
				// })
				// 每次切换秒杀时间都让从第一页开始加载
				this.num = 1
				this.getdata(this.num)
			},
			getdata(num) {
				uni.$u.http.post(this.$request.postAjaxSeckill, {
					shopNo: this.shopNo,
					spikeTimer: this.status.startTimer,
					page: num,
					pageSize: '20'
				}).then(res => {
					if (res.code == 200) {
						this.lists = res.data
						this.flag1 = true
					} else {
						this.lists = []
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				})
			},
		Change(e) {
			this.timeData = e;
			if (this.countdown != null && e.hours == 0 && e.minutes == 0 && e.seconds == 0) {
				this.times.forEach((item, index) => {
					if (item.spikeStartTimer == this.status.spikeStartTimer) {
						let now = new Date().valueOf(),
							StartTimer = item.spikeStartTimer,
							EndTimer = item.spikeEndTimer;
						this.timeStamp(StartTimer) <= now && now < this.timeStamp(EndTimer) && (item.description == '抢购中', (this.countdown = this.timeStamp(EndTimer) - now));
					}
				});
			}
		},
		finish() {
			if (this.flag1 == false) return;
			this.queryTimer();
		}
	}
};
</script>
