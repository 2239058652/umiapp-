export const state = {
    //用户数据
    userInfo: uni.getStorageSync('userInfo'),
};
export const mutations = {
    //储存用户信息
    setUserInfo(state,data) {
      // #ifdef H5
      window.sessionStorage.setItem('userInfo', JSON.stringify(data));
      // #endif
      // #ifndef H5
			uni.setStorageSync('userInfo', data)
			state.userInfo=uni.getStorageSync('userInfo');
      // #endif
    },
		// 添加手机号
		setMobile(state,data){
			uni.setStorageSync('userInfo', data)
			let a=Object.assign(state.userInfo,uni.getStorageSync('userInfo'));
			uni.setStorageSync('userInfo', a)
		},
    // 退出
    emptyUserInfo(state) {
        state.userInfo = {};
        // #ifdef H5
        window.sessionStorage.removeItem("userInfo");
        // #endif
        // #ifndef H5
        uni.removeStorageSync("userInfo");
        // #endif
    },
};
export const actions = {};
