<template>
	<view class="search">
		<uni-nav-bar fixed="false" statusBar="false" left-icon="left"  title="搜索" @clickLeft="back"></uni-nav-bar>
		<!-- 搜索框 -->
		<u-search bgColor="#e7e8e8" searchIconSize=60 placeholder="请输入关键字" :focus="true" margin="10rpx 0 0 0"
			@custom="custom" @search="custom" @clickIcon="custom(keyword)" v-model="keyword">
		</u-search>
		<view class="denglu" v-show="isDl" @click="godenglu">您还未登陆，<text>点击登录</text></view>
		<!-- 搜索历史 -->
		<view class="searchHistory" v-if="hislist.length!=0">
			<view class="title" style="display: flex;">
				<view>历史搜索</view>
				<view style="float: right; margin-left: 30rpx;"  @click="deleHistory">
				<!-- <text class="aj aj-shanchu" @click="deleHistory"></text> -->
				<uni-icons type="trash" size="25" color='#979797'></uni-icons>
				</view>
				
			</view>
			<view class="list">
				<text v-for="(item,index) in hislist" :key="index" @click="searchlist(item)">{{item}}</text>
			</view>
		</view>
		<commodity ref="commodity"></commodity>
		<!-- 加载更多 -->
		<u-loadmore v-if="flowList.length != 0 " :status="status" :load-text='loadText' />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: "", //输入框的值
				flowList: [],
				index: 1,
				isIndex: 0,
				errImg: '/static/image/fail.png',
				scrollTop: 0,
				status: 'loadmore',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '玩命加载中',
					nomore: '实在没有了'
				},
				isDl: false,
				hislist: [], // 历史列表
			}
		},
		onShow() {
			if (uni.getStorageSync('token') == '') {
				this.isDl = true
			} else {
				this.isDl = false
			}
			if (uni.getStorageSync('historySearch') != '') {
				this.hislist = uni.getStorageSync('historySearch')
			}
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			godenglu() {
				uni.navigateTo({
					url: "/pages/pagesA/denglu/denglu"
				})
			},
			searchlist(item){
				if (uni.getStorageSync('token') != '') { 
					this.keyword = item
					this.$refs.commodity.getHotGoods(item)
				}
			},
			// 获取输入框 keyword 的实时值
			async custom(value) {
				// console.log('点击率')
				if (value == "") {
					uni.showToast({
						title: '请输入商品名称',
						icon: 'none',
						duration: 1000
					});
					return
				}

				this.index = 1 //没有做分页处理
				if (uni.getStorageSync('token') != '') {
					this.$refs.commodity.getHotGoods(this.keyword)
					this.addHistory(this.keyword)
				}
			},
			// click(item) {
			// 	this.$Router.push(`/pages/home/detailed/detailed?id=${item.id}_${item.shopNo}`)
			// },
			// 添加
			addHistory(e) {
				try {
					let flag1 = this.hislist.findIndex(item => item === e) //判断数组里面有没有重复查询过的内容
					if (flag1 != -1) { //有重复内容
						if (flag1 != 0) { //如果删除0会出错
							this.hislist.splice(flag1, 1) //删除重复重新添加一个
							this.hislist.unshift(e) //添加一个内容
						}
					} else {
						if (this.hislist.length >= 10) {
							this.hislist.splice(9, 1) //删除最后一个新添加一个
							this.hislist.unshift(e) //添加一个内容
						} else {
							this.hislist.unshift(e) //添加一个内容
						}
					}
					uni.setStorageSync('historySearch', this.hislist); //保存用户搜索历史
					this.hislist = uni.getStorageSync('historySearch') //存放历史记录的数组
				} catch (e) {
					this.hislist.push(e) //添加一个内容
				}
			},
			// 删除历史记录
			deleHistory() {
				uni.showModal({
					title: '确定删除历史记录',
					success: res => {
						if (res.confirm) {
							uni.removeStorageSync('historySearch')
							this.hislist = uni.getStorageSync('historySearch')
						}
					}
				})
			},
		},
		watch: {}
	}
</script>

<style lang="scss">
	.search {
		.denglu {
			text-align: center;
			margin: 20%;

			&>text {
				color: #0055ff;
			}
		}

		.searchHistory {
			width: 95%;
			margin: 20rpx auto;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
			}

			.aj-shanchu {
				float: right;
				color: #5d5d5d;
			}

			.list {
				display: flex;
				flex-wrap: wrap;

				&>text {
					border-radius: 20rpx;
					font-size: 28rpx;
					padding: 10rpx 20rpx;
					background-color: #e7e8e8;
					margin-right: 15rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}
</style>
