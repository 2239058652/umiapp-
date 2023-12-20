<template>
    <view class="container">
       <view class="bigTitle">分享签到</view>
       <view class="bigTitleTwo">坚持打卡学习，和我一起吧！</view>
        
      <view class="shareBox">
        <view class="topTime">
            <view class="topItem">{{todayTime}}</view>
            <view class="topItem">{{today}}</view>
        </view>
        <!-- <u--image mode="widthFix" :showLoading="true" :src="mainPic" width="400rpx" height="400rpx"></u--image> -->
        <image :src="mainPic" mode="widthFix" class='bgImg'></image>
        <view class="shareText">
         <view class='text'>
             <rich-text :nodes="todaySaying || '-'"></rich-text>
         </view>
          <!-- <text class='text text2'> ———— 周杰伦《晴天》</text> -->
        </view>
     
        <view class='imgBox'>
          <button open-type="share" class='zfbtn'>
            <image src="http://www.meitang.cn/static/img/images/share_weixin.png" class='img'></image>
             <text class='btntxt'>分享朋友</text>
          </button>
          <button class='zfbtn m_l' @click="formSubmit">
            <image src="http://www.meitang.cn/static/img/images/share_fuzhi.png" class='img'></image>
            <text class='btntxt'>生成海报</text>
          </button>
        </view>
      
        <!--生成海报后的图  -->
          <view class='imagePathBox' :hidden="maskHidden == false">
            <image :src="imagePath" class='shengcheng' show-menu-by-longpress="true"></image>
            <button class='baocun' @click="baocun">保存相册，分享到朋友圈</button>
          </view>
         <view :hidden="maskHidden == false" class="mask"></view> 
        <view class="canvas-box">
            <!-- style="width: 500rpx;height: 840rpx;position:fixed;" -->
            <canvas canvas-id="mycanvas" style="width: 750rpx;height: 1334rpx;position:fixed;" />
        </view>  
      </view>
    </view>
   
</template>


<script>
	export default {
		data() {
			return {
				          formatDate,
				               imgView:this.$api.viewFile,
				               canvasW:375,     // 设备宽
				               img: "1654073743713419267",
				               maskHidden: false,
				               name: "野生九五",
				               todaySaying:'好运永远不会眷顾傻瓜',
				               imagePath:'',    // 显示生成的图片
				               mainPic: this.$api.viewFile + '1654305599822200833',
				               erPic: this.$api.viewFile + '20230518001',
				               todayTime:'2023-03-18',
				               today:'星期一',
				               urlParams:{},   // 路由参数
		
			}
		},
		    onShow() {
		        // 获取屏幕的宽度为画布宽
		        let that = this
		        uni.getSystemInfo({
		            success(res) {
		                let { windowWidth } = res
		                that.canvasW = windowWidth
		            }
		        });
		         this.getShareImgInfo();   // 获取内容信息
		        
		    },

		methods: {
		            
		            /* 获取分享图片上的内容信息 */
		            async getShareImgInfo(){
		                let { indexContent } = this.urlParams
		                try{
		                    let res = await this.$api.getShareImgInfo()
		                    if(res.code === 200){
		                        let { content,img,localDate,week } = res.data
		                        this.mainPic = this.$api.viewFile + (img === null ? '1654305599822200833' : img )
		                        this.todayTime = localDate
		                        this.todaySaying = indexContent ? indexContent : content
		                        this.today = week
		                    }
		                }catch(e){
		                    
		                }
		            },
		                
		            
		            // 获取图片信息
		            getImageInfo(image) {
		                return new Promise((req, rej) => {
		                    uni.getImageInfo({
		                        src: image,
		                        success: function(res) {
		                            req(res)
		                        },
		                    });
		                })
		            },
		              /*  canvas文本换行 */
		                drawText (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
		                    let lineWidth = 0;
		                    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
		                    for (let i = 0; i < str.length; i++) {
		                        lineWidth += ctx.measureText(str[i]).width;
		                        if (lineWidth > canvasWidth) {
		                            ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
		                            initHeight += 22; //22为 文字大小20 + 2
		                            lineWidth = 0;
		                            lastSubStrIndex = i;
		                            titleHeight += 22;
		                        }
		                        if (i == str.length - 1) { //绘制剩余部分
		                            ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
		                        }
		                    }
		                    // 标题border-bottom 线距顶部距离
		                    titleHeight = titleHeight + 10;
		                    return titleHeight;
		                },
		
		                
		                 //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
		              async createNewImg() {
		                 let that = this;
		                 let { mainPic,erPic,name,todaySaying,todayTime,today,canvasW } = this
		                
		                 this.mainPic = await this.getImageInfo(mainPic)    // 处理图片
		                 this.erPic = await this.getImageInfo(erPic)        // 处理图片
		                  
		                 var context = uni.createCanvasContext('mycanvas');
		                 context.setFillStyle("#FFF")      // #F24077            // 背景颜色
		                 context.fillRect(0, 0, canvasW, 610)              //  667 绘制一个矩形作为背景矩形x坐标、y坐标、图片宽、高
		                 
		                 context.setFontSize(26);
		                 context.setFillStyle('#000');     // #FFF
		                 context.setTextAlign('left');
		                 context.fillText("分享签到", 37, 45);
		                 context.stroke();
		                 context.setFontSize(14);
		                 context.setFillStyle('#000');
		                 context.setTextAlign('left');
		                 context.fillText("坚持打卡学习，和我一起吧！", 37, 75);
		                 context.stroke();
		                 
		                 context.setFontSize(14);
		                 context.setFillStyle('#333');
		                 context.setTextAlign('left');
		                 context.fillText(todayTime, 37, 100);
		                 context.stroke();
		                 
		                 context.setFontSize(16);
		                 context.setFillStyle('#333');
		                 context.setTextAlign('right');
		                 context.fillText(today, (canvasW - 37), 100);
		                 context.stroke();
		                 
		                 
		                 context.drawImage(this.mainPic.path, (canvasW - 300)/2, 110, 300, 320);  // 262 349
		
		                 // context.drawImage(path2, 56, 400, 263, 121);  // 绘制图像到画布src、x坐标、y坐标、图片宽、高 
		                 
		                 // 今日上上签
		                 context.setFontSize(15);
		                 context.setFillStyle('#333');
		                 context.setTextAlign('left');
		                 // context.fillText(todaySaying, 37, 480);
		                 this.drawText(context, todaySaying, 37, 470, 30, 300);   // 调用行文本换行函数（300则换行）
		                 context.stroke();
		               
		                 //绘制左下角文字
		                 context.setFontSize(12);
		                 context.setFillStyle('#333');
		                 context.setTextAlign('left');
		                 context.fillText("长按识别小程序", 80, 560);
		                 context.stroke();
		                 context.setFontSize(12);
		                 context.setFillStyle('#333');
		                 context.setTextAlign('left');
		                 context.fillText("跟我一起来学习吧~~", 80, 580);
		                 context.stroke();
		                
		                 //绘制右下角小程序二维码
		                 context.drawImage(this.erPic.path, 230, 525,70,70);
		              
		                 context.draw();
		                 //将生成好的图片保存到本地
		                 setTimeout(function () {
		                   uni.canvasToTempFilePath({
		                     canvasId: 'mycanvas',
		                     success: function (res) {
		                       var tempFilePath = res.tempFilePath;
		                       that.imagePath = tempFilePath,
		                       that.canvasHidden = true
		                       
		                        console.log('将生成好的图片保存到本地',res,that.imagePath)
		                       
		                     },
		                     fail: function (res) {
		                       console.log(res);
		                     }
		                   });
		                 }, 200);
		               },
		               
		               //点击保存到相册
		                 baocun() {
		                   var that = this
		                   let { imagePath } = this 
		                   console.log('点击保存到相册',imagePath)
		                   uni.saveImageToPhotosAlbum({
		                     filePath: imagePath,
		                     success(res) {
		                       uni.showModal({
		                         content: '海报已保存到相册',
		                         showCancel: false,
		                         confirmText: '确定',
		                         confirmColor: '#333',
		                         success: function (res) {
		                           if (res.confirm) {
		                             console.log('用户点击确定');
		                             /* 该隐藏的隐藏 */
		                             that.maskHidden = false
		                           }
		                         }, fail: function (res) {
		                           console.log(11111)
		                         }
		                       })
		                     },
		                     fail() {
		                          uni.showModal({
		                            title: '提示',
		                            content: '需要您授权保存相册',
		                            showCancel: false,
		                            success() {
		                              uni.openSetting({
		                                success(settingdata) {
		                                  if (settingdata.authSetting['scope.writePhotosAlbum']) {       //是否授权保存到相册
		                                    wx.showModal({
		                                      title: '提示',
		                                      content: '获取权限成功,再次保存图片即可成功',
		                                      showCancel: false,
		                                    })
		                                  } else {
		                                    uni.showModal({
		                                      title: '提示',
		                                      content: '获取权限失败，无法保存到相册',
		                                      showCancel: false,
		                                    })
		                                  }
		                
		                                },
		                              })
		                            },
		                            fail() {
		                                uni.$u.toast('您已取消')
		                            },
		                          })
		                        },
		                     
		                   })
		                 },
		                 
		                  //点击生成
		                   formSubmit: function (e) {
		                     var that = this;
		                     this.maskHidden = false
		                     // this.setData({
		                     //   maskHidden: false
		                     // });
		                     uni.showToast({
		                       title: '海报生成中...',
		                       icon: 'loading',
		                       duration: 1000
		                     });
		                     setTimeout(function () {
		                       uni.hideToast()
		                       that.createNewImg();   // 绘图
		                       
		                       that.maskHidden = true
		                       // that.setData({
		                       //   maskHidden: true
		                       // });
		                     }, 1000)
		                   },
		                   
		        },
	}
</script>
<style lang="scss">

  
  
.container{
    height: 100vh;
    padding: 10%;
    // background-image: linear-gradient(to bottom right,#F2427B,#EE2847);
    background-color: #DAEDFB;
    
    .bigTitle{
        font-size: 42rpx;
        // color: #FFFFFF;
        padding-bottom: 25rpx;
    }
    .bigTitleTwo{
        font-size: 26rpx;
        // color: #FFFFFF;
        padding-bottom: 25rpx;
    }
    
    .shareBox{
       display: flex;
       flex-direction: column;
       background-color: #fff;
       
        .topTime{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40rpx;
            
            .topItem{
                font-size: 26rpx;
                color: #333;
            }
        }
        
        
        // canvas
        .canvas-box{
            position: fixed;
            opacity: 0;
            bottom: 9999999rpx;
            //  width: 600rpx;
            //  height: 860rpx;
            //  display: flex;
            //  flex-direction: column;
            //  align-items: center;
            
            //  top: 50rpx;
            //  left: calc(50% - 300rpx);
             
            // canvas{
            //     width: 100%;
            //     height: 100%;

            // }
        }
    }
}
    


.bgImg{
  width: 70%;
  height: 440rpx !important;
  margin: 0% 15%;
}
.shareText{
  color: #333;
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  padding: 50rpx 30rpx;
}
.shareText .text{
  // line-height: 60rpx;
  width: 100%;
  box-sizing: border-box;
  display: block;
  color: #333;
}
.shareText .text2{
  text-align: right;
}
.btntxt{
   color: #333;
     font-size: 26rpx;
}
.imgBox{
  text-align: center;
  width: 100%;
  margin-top:20rpx;
  display: flex;
}
.img{
  display: inline-block;
  width: 100%;
  height: 100%;
}
.m_l{
  margin-left: 180rpx;
}
.zfbtn{
  display:flex;
  flex-direction: column;
  font-size: 28rpx;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.zfbtn image{
  width: 70rpx;
  height: 70rpx;
}
button[class="zfbtn"]::after {
  border: 0;
} 
button[class="zfbtn m_l"]::after {
  border: 0;
} 
.imagePathBox{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
}
.shengcheng{
  width: 86%;
  height: 80%;
  position: fixed;
  top: 10%;
  left: 50%;
  margin-left: -43%;
  z-index: 999;
}
.baocun{
  display: block;
  width: 80%;
  height: 75rpx;
  padding: 0;
  line-height: 75rpx;
  text-align: center;
  position: fixed;
  bottom: 50rpx;
  left: 10%;
  color: #fff;
  font-size: 32rpx;
  border-radius: 50rpx;
  background: #fdd668;

}
button[class="baocun"]::after{
  border: 0;
}
</style>

