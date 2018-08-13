var app = getApp()
const network = require('network.js')
const util = require('utils.js')
//支付管理者
class PayManager {

   groupResult = null //我要拼团
   joinGroupResult = null //参与拼团
   originPayResult = null //原价购买
  /*
  构造函数
  */ 
  constructor() {
    
  }

  /*
  普通方法
  */
  //获取我要开团结果
  getGroupResult() {
    return this.groupResult
  }
  //获取参与拼团结果
  getJoinGroupResult() {
    return this.joinGroupResult
  }
  //获取原价购买结果
  getOriginPayResult() {
    return this.originPayResult
  }

  //原价购买,解锁课程
  originPricePrchase(courseId,callBack) {
    var that = this;
    var isIOS = util.isIOSPlatform(app.data)
    if (isIOS == true) {
      //组装sessionFrom
      if (courseId) {
        var object = {};
        object.courseId = courseId;
        object.isGroupBuy = "0";
        object.groupBuyId = "";
        var argument = JSON.stringify(object);
      } else {
        console.log("courseId为空")
      }
      callBack.iosCallback(argument)

    } else {
      //1.解锁课程
      var courseID = courseId;
      network.POST("/user/unlockCourse", {
        params: { courseId: courseID },
        success: function (res) {
          // success
          console.log("拼团失败,我要原价购买课程")
          console.log(res);
          var result = res.data.data;
          that.originPayResult = result;
          var timestamp = result.timestamp;
          var nonceStr = result.nonceStr;
          var pack = result.package;
          var paysign = result.paySign;
          //2.调起微信支付
          util.requestWXPayment(timestamp, nonceStr, pack, paysign, function (res) {
            // console.log("拼团调起微信支付成功");
            callBack.androidCallback({ code: 0, data: res })
          }, function (res) {
            callBack.androidCallback({ code: -2, data : res})
            // console.log("拼团调起微信支付失败")
          })
        },
        fail: function (error) {
          // fail
          callBack.androidCallback({code:-1,data:error})
        },
      })
    }
  }

  //拼团购买
  groupBuyPayment(courseId, callBack) {
    var that = this
    //获取当前用户手机类型
    var isIOS = util.isIOSPlatform(app.data)
    if (isIOS == true) {
      //组装sessionFrom,带到客服会话列表里面
      if (courseId) {
        var object = {};
        object.courseId = courseId;
        object.isGroupBuy = "1";//1是拼团购买 0是原价购买
        object.groupBuyId = "";//groupBuyId如果有值就是参与拼团 没有值是发起拼团
        var argument = JSON.stringify(object);
      } else {
        console.log("courseId为空")
      }
      callBack.iosCallback(argument)

    } else {
      //安卓支付
      var courseID = courseId;
      //1.发起拼团,获取支付的前置信息获取
      network.POST("/groupBuy/startGroupBuy", {
        params: { courseId: courseID },
        success: function (result) {
          // success
          var r = result.data.data;
          that.groupResult = r
          var groupId = r.groupBuyId;
          var timestamp = r.timestamp;
          var nonceStr = r.nonceStr;
          var pack = r.package;
          var paysign = r.paySign;
          //2.调起微信支付
          util.requestWXPayment(timestamp, nonceStr, pack, paysign, function (res) {
            callBack.androidCallback({ code: 0, data: res })
          }, function (res) {
            callBack.androidCallback({ code: -2, data: res })
          })
        },
        fail: function (error) {
          console.log("error:")
          console.log(error)
          callBack.androidCallback({ code: -1, data: error })
        }
      })
    }
  }

  //参与拼团
  joinGroupBuy(groupBuyId, callBack) {
    var that = this;
    var isIOS = util.isIOSPlatform(app.data)
    var groupBuyId = groupBuyId;
    if (isIOS == true) {
      //组装sessionFrom
      if (groupBuyId) {
        var object = {};
        object.courseId = "";
        object.isGroupBuy = "1";
        object.groupBuyId = groupBuyId;
        var argument = JSON.stringify(object);
      } else {
        console.log("groupBuyId为空")
      }
      callBack.iosCallback(argument)

    } else {
      console.log("参与拼团");
      network.POST("/groupBuy/joinGroupBuy", {
        params: { groupBuyId: groupBuyId },
        success: function (res) {
          // success
          console.log("参与拼团成功");
          console.log(res);
          var result = res.data.data;
          that.joinGroupResult = result;
          var timestamp = result.timestamp;
          var nonceStr = result.nonceStr;
          var pack = result.package;
          var paysign = result.paySign;
          util.requestWXPayment(timestamp, nonceStr, pack, paysign, function (res) {
            console.log("拼团调起微信支付成功");
            callBack.androidCallback({ code: 0, data: res })
          }, function (res) {
            callBack.androidCallback({ code: -2, data: res })
            console.log("拼团调起微信支付失败")
          })
        },
        fail: function (error) {
          // fail
          callBack.androidCallback({ code: -1, data: error })
        },
      })
    }
  }

}


export { PayManager } 