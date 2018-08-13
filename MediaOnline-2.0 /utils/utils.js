const network = require('network.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const waitTime = (mss) => {
  var hours = String(parseInt(mss / (1000 * 60 * 60)));
  var minutes = String(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
  var seconds = String(parseInt((mss % (1000 * 60)) / 1000));
  var _hours = hours < 10 ? ['0', hours] : [hours.substring(0, 1), hours.substring(1, 2)]
  var _minutes = minutes < 10 ? ['0', minutes] : [minutes.substring(0, 1), minutes.substring(1, 2)]
  var _seconds = seconds < 10 ? ['0', seconds] : [seconds.substring(0, 1), seconds.substring(1, 2)]
  return (_hours.concat(_minutes)).concat(_seconds)
}
//时间格式化成 mm:ss
function formatDuring(mss) {
  mss = Math.round(mss)
  var days = parseInt(mss / (60 * 60 * 24));
  var hours = parseInt((mss % (60 * 60 * 24)) / (60 * 60));
  var minutes = parseInt((mss % (60 * 60)) / (60));
  var seconds = (mss % 60);
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}

//评论时间转换
function formatTimeStr(createTime) {
  var currDate = new Date()  //获取系统当前时间
  var creaDate = new Date(createTime)
  var offset = (currDate.getTime() - createTime) / 1000
  if (offset < 24 * 3600) {
    let h = parseInt(offset / 3600)
    let m = parseInt(offset % 3600 / 60)
    let s = parseInt(offset % 3600 / 60)
    if (h > 0)
      return h + "小时前"
    else if (m > 0)
      return m + "分钟前"
    else
      return s < 30 ? "刚刚" : (s + "秒前")
  } else if (offset < 10 * 24 * 3600) {
    return parseInt(offset / (24 * 3600)) + "天前"
  } else {
    var y = creaDate.getFullYear();
    var m = creaDate.getMonth() + 1;
    var d = creaDate.getDate();
    var yStr = currDate.getFullYear() == y ? "" : (y + "年")
    return yStr + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + "日"
  }
}

//toast  2000ms
function toast(msg) {
  if (isUndefined(msg)) return
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function IsInArray(arr,value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}
//为定义对象判断
function isUndefined(o) {
  return typeof (o) == "undefined" || "undefined" == o || null == o || "null" == o
}
function isRealNum(val) {
  if (isUndefined(val)) return false;
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
  if (val === "") {
    return false;
  }
  if (!isNaN(val)) {
    return true;
  } else {
    return false;
  }
}
//判断一个Json对象是否是null,{},"","undefined"
function isEmptyObject(e) {
  if (isUndefined(e)) return !0
  var t;
  for (t in e)
    return !1;
  return !0
}

//判断网络类型是否是移动网络
function mobileNetwork(networkType) {
  switch (networkType) {
    case "2g":
    case "3g":
    case "4g":
      return true
  }
  return false
}
//是不是重复点击
var lastClickTime = 0
function isReClick() {
  let currTime = new Date().getTime()
  if (currTime - lastClickTime <= 1000) {
    return true
  }
  lastClickTime = currTime
  return false
}
//移动网络操作选择框
function networkModal(callback) {
  if (isUndefined(callback)) return
  wx.showModal({
    title: '提示',
    content: '当前处于移动网络，是否继续播放？',
    success: function (res) {
      if (res.confirm) {
        if (!isUndefined(callback.confirm)) callback.confirm()
      } else if (res.cancel) {
        if (!isUndefined(callback.cancel)) callback.cancel()
      }
    }
  })
}
//获取栈顶页面
function currPageRoute() {
  let pages = getCurrentPages()
  return pages[pages.length - 1].route
}
//获取栈顶页面
function currPage() {
  let pages = getCurrentPages()
  return pages[pages.length - 1]
}

//打印对象属性和值
function log(obj) {
  let str = "Log: "
  for (var key in obj) {
    str += key + '=' + obj[key] + " &"
  }
  str = str.substring(0, str.length - 1)
  console.log(str)
}

 /**
  * 时间戳转化为年 月 日 时 分 秒
  * number: 传入时间戳
  * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
 function formatDate(number, format) {

   var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
   var returnArr = [];

   var date = new Date(number);
   returnArr.push(date.getFullYear());
   returnArr.push(formatNumber(date.getMonth() + 1));
   returnArr.push(formatNumber(date.getDate()));

   returnArr.push(formatNumber(date.getHours()));
   returnArr.push(formatNumber(date.getMinutes()));
   returnArr.push(formatNumber(date.getSeconds()));

   for (var i in returnArr) {
     format = format.replace(formateArr[i], returnArr[i]);
   }
   return format;
 }

 function requestWXPayment(timeStamp, nonceStr, pack, paySign, success, failure) {
   wx.requestPayment({
     'timeStamp': timeStamp,
      'nonceStr':  nonceStr,
       'package':      pack,
      'signType':       'MD5',
       'paySign':   paySign,
       'success':     success,
          'fail':function(error) {
              if(failure) {
                failure(error)              
              }
              console.log("调起微信支付失败")
              // wx.showToast({
              //   title: error.errMsg,
              // })
          },
      'complete':function(res) {
        console.log("支付结束")
        console.log(res.errMsg)       
      }
   })
 }

// 是否是iOS系统  参数为app.data
 function isIOSPlatform(data) {
   if (data.platform === "ios") {
     //  console.log("当前系统为iOS")
     return true
   } else if (data.platform === "android") {
     //  console.log("当前系统为安卓")
     return false 
   } else {
     //  console.log("当前系统为开发者工具")
     console.log(data.system)
     var currentSystem = data.system
     if (currentSystem.search("iOS") != -1) {
       //  console.log("当前系统为iOS")
       return true
     } else if (currentSystem.search("Android") != -1) {
       //  console.log("当前系统为安卓")
       return false
     }
   }
 }

 //验证是否弹出手机号的弹框
 function checkoutShowMessageCodeDialog(page,callBack) {
   //验证本地是否存储了用户的手机信息
   var that = this
   var telephone = wx.getStorageSync("telephone")
   if (telephone == "") {
     //本地没有存手机号,获取后台存储的用户手机号
     network.GET("/user/getUserByToken", {
       params: {},
       success(res) {
         var result = res.data.data
         var telephoneNum = result.mobileNo
         if (telephoneNum) {
           //拿到服务器存储的用户手机号,存储到本地并进入支付逻辑,弹框隐藏
           wx.setStorageSync("telephone", res.data.data.mobileNo)
           var telephone = wx.getStorageSync("telephone")
           console.log(telephone + "服务器存储了该手机号并成功存入本地")
           callBack(1)
         } else {
          //  //服务器也没有记录用户手机号,弹出收集用户手机号的弹框
          //  page.messageDialog.show()
          callBack(2)
         }
       },
       fail(res) {
         console.log("获取用户信息接口请求失败")
         callBack(-1)
       }
     })

   } else {
     //本地存有用户手机号,直接进入支付逻辑,弹框隐藏
      callBack(1)
   }
 }
 //购买专栏
 function purchaseCourse(){
   wx.showModal({
     title: '播放提示',
     content: '您还未购买该专栏，请先购买？',
     confirmText: "立即购买",
     cancelText: "稍后购买",
     success: res => {
       if (res.confirm) {
         let pages = getCurrentPages()
         let pageSize = pages.length
         if (pageSize > 4 && pages[pageSize - 3].route == "pages/home/detail") {        //音频列表 多次进入购买
           wx.navigateBack({ delta: 2 })
         } else if (pageSize > 2 && pages[pageSize - 2].route == "pages/home/detail"){  //音频播放页面 返回购买页面
           wx.navigateBack({ delta: 1 })
         }else {
           wx.navigateTo({ url: '/pages/home/detail?id=' + courseId })
         }
       }else{
        //  wx.navigateBack({ delta: 1 })
       }
     }
   })
 }

 //拼团人数转汉字
 function changePersonCount(count) {
   switch (count) {
     case 3: 
         return "三"
        break 

     case 6:
       return "六"
       break
   }
 }

module.exports = {
  formatTime: formatTime,
  waitTime: waitTime,
  formatDuring: formatDuring,
  toast: toast,
  isUndefined: isUndefined,
  mobileNetwork: mobileNetwork,
  networkModal: networkModal,
  isRealNum: isRealNum,
  isEmptyObject: isEmptyObject,
  formatTimeStr: formatTimeStr,
  isReClick: isReClick,
  currPageRoute, currPageRoute,
  currPage: currPage,
  log: log,
  formatDate: formatDate,
  requestWXPayment: requestWXPayment,
  isIOSPlatform: isIOSPlatform,
  checkoutShowMessageCodeDialog: checkoutShowMessageCodeDialog,
  purchaseCourse: purchaseCourse,
  IsInArray: IsInArray,
  changePersonCount:changePersonCount
  // test: test
}

