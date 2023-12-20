<template>
	<view class="da">
		<view class="title" @click='data2()'>
			可选自提点列表
		</view>
		<view class="" v-if='items.length>0'>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
				<view style="height:1100rpx;">  
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd box" v-for="(item, index) in items"
							:key="item.value">
							<view class="tou">
								<image :src="img[index]" mode=""></image>
							</view>
							<view class="right">
								<view class="name">{{item.name}}</view>
								<view>{{item.address}}</view>
								<view class="xuan">
									<radio :value="item.name" :checked="index === current" />
								</view>
							</view>

						</label>
					</radio-group>
				</view>
			</scroll-view>
			<view class="btn" @click="queding()">选择当前提货点</view>
		</view>
		<view v-else class="kong">当前门店下暂无自提点~</view>
	</view>
	<!-- </view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import mixin from '@/mixins/mixin.js'
	export default {
		data() {
			return {
				items: [],
				current: 0,
				xuanzhong: '',
				img: ['https://img0.baidu.com/it/u=1512209291,3870177345&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681491600&t=a830b9eacfe6daedc4313df5c820ab5a',
					'https://img0.baidu.com/it/u=1010435361,998243973&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681491600&t=13d867c7887c5214dd2f2efb66078be6',
					'https://img1.baidu.com/it/u=3745805108,2263820576&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681491600&t=27efe9514b8b3e9469aad0cbd2850eaf'
				],
				shopId:''
			}
		},
		onLoad(e) {
			console.log(e)
			this.xuanzhong = e.name
			this.shopId = e.shopId
			console.log('onload', this.xuanzhong)
			this.data2()
		},
		methods: {
			radioChange: function(evt) {
				console.log(evt)
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].name === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			},
			data2() {
				this.$request.gettihuodian({
					shopId: this.shopId
				}).then(res => {
					this.items = res.records
					let xuan = res.records.findIndex((item) => {
						return item.address == this.xuanzhong
					})
					this.current = xuan

				})
			},
			queding() {
				console.log(this.$store.state.locateInformation)
				var store = this.$store.state.locateInformation.storeList.findIndex(item => { //获取对应门店编号定位信息
					return item.storeSn == uni.getStorageSync('storeSn')
				})
				console.log(this.$store.state.locateInformation.storeList[store])
				let list = this.$store.state.locateInformation
				list.storeList[store].address = this.items[this.current].address
				this.$store.commit("setLocateInformation", list)
				uni.navigateBack({
					delta: 1,
				})
			}
		},
	}
</script>

<style>
	.da {
		padding: 20rpx;
	}

	.tou image {
		height: 100rpx;
		width: 100rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
	}

	.box {
		padding: 20rpx;
		margin: 20rpx 0 20rpx 0;
		display: flex;
		border: 1px solid red;
		border-radius: 20rpx;
		height: 120rpx;
		position: relative;
		height: 80%;
	}

	.name {
		font-size: 35rpx;
		font-weight: 700;
	}

	.xuan {
		position: absolute;
		right: 10rpx;
		top: 12rpx;
	}

	.btn {
		position: fixed;
		bottom: 100rpx;
		height: 80rpx;
		width: 700rpx;
		background-color: red;
		line-height: 80rpx;
		text-align: center;
		border-radius: 25px;
		color: #fff;
		font-weight: 600;
	}

	.title {
		width: 700rpx;
		padding: 25rpx;
		color: #48484c;
		border-radius: 10rpx;
		font-weight: 600;
		font-size: 30rpx;
	}

	.kong {
		width: 750rpx;
		text-align: center;
		margin-top: 30rpx;
		font-size: 40rpx;
	}
</style>
