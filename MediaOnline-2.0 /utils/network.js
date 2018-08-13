// const baseUrl = "https://xcx.shbaoyuantech.com" //Normal server
const baseUrl = "https://xcx.test.shbaoyuantech.com:30000" //Testserver
// const baseUrl = "http://192.168.1.136:32100"//胜林本地地址
var base64 = require("./base64.js")
var isrefresh = false
var requestHandler = {
  params: {},
  success: function(res) {
    // success
  },
  fail: function(error) {
    // fail
  },
}

function POSTjson(url, requestHandler) {
  request('POST', url, requestHandler, "application/json")
}
//GET请求
function GET(url, requestHandler) {
  request('GET', url, requestHandler)
}
//POST请求
function POST(url, requestHandler) {
  request('POST', url, requestHandler)
}

function request(method, url, requestHandler, contenttype = "application/x-www-form-urlencoded") {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  wx.request({
    url: baseUrl + url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "content-type": contenttype,
      "Authorization": getApp().data.token
    }, // 设置请求的 header
    success: function(res) {
      //注意：可以对参数解密等处理
      if (res.data.code == 1001) {
        login(method, url, requestHandler, contenttype)
      }
      if (res.data.code == 1002) {
        refreshToken(method, url, requestHandler, contenttype)
      }
      if (res.data.code == 1003) {
        wx.navigateTo({
          url: '/pages/home/authorise',
        })
      }
      if (res.data.code == 0) {
        requestHandler.success(res)
      }
      if (res.data.code == -1) {
        requestHandler.fail(res.data.error)
      }
      if (1201 === res.data.code) {
        requestHandler.fail("您还未购买该专栏")
      }
    },
    fail: function(error) {
      requestHandler.fail(error)
    },
    complete: function() {
      // complete
      if (requestHandler.complete) requestHandler.complete()
    }
  })
}

function isLogin() {
  try {
    if (getLoginInfo()) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

function login(method, url, requestHandler, contenttype) {
  if (isLogin()) {
    var value = getLoginInfo()
    if (value) {
      var base64Token = "Bearer " + base64.CusBASE64.encoder(value.data.accessToken)
      getApp().data.token = base64Token
    }
    return
  } else {
    var that = this
    wx.login({
      success: (res) => {
        if (res.code) {
          var params = new Object()
          params.code = res.code
          params.systemCode = 1101
          POST("/auth/wechat/login", {
            params: params,
            success(res) {
              var base64Token = "Bearer " + base64.CusBASE64.encoder(res.data.data.accessToken);
              getApp().data.token = base64Token
              wx.setStorageSync(baseUrl + "login", res.data)
              wx.setStorageSync("userId", res.data.data.userId)
              request(method, url, requestHandler, contenttype)
            },
            fail(error) {
              console.log(error)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
}

function refreshToken(method, url, requestHandler, contenttype) {
  var params = new Object()
  var value = getLoginInfo()
  wx.request({
    url: baseUrl + '/auth/wechat/refreshToken',
    data: {
      "accessToken": value.data.accessToken,
      "refreshToken": value.data.refreshToken
    },
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    }, // 设置请求的 header
    success: function(res) {
      var base64Token = "Bearer " + base64.CusBASE64.encoder(res.data.data.accessToken);
      getApp().data.token = base64Token
      // console.log(getApp().data.token)
      wx.setStorageSync(baseUrl + "login", res.data)
      request(method, url, requestHandler, contenttype)
    },
    fail: function(error) {
      // fail
    },
  })
}
//获取登录信息
function getLoginInfo() {
  return wx.getStorageSync(baseUrl + "login")
}
//获取登录信息
function getUserInfo() { 
  return new Promise((resolve, reject) => {
    let userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      resolve(userInfo)
    } else {
      hasNetwork({
        success:()=>{
          _canGetUserInfo({
            success: () => {
              wx.getUserInfo({
                success: res => {
                  POSTjson("/user/updateUserInfo", {
                    params: res.rawData,
                    success: res => {
                      userInfo = { data: res.data.data }
                      wx.setStorageSync("userInfo", userInfo)
                      resolve(userInfo)
                    },
                    fail: error => reject("更新用户信息失败")
                  })
                },
                fail: () => reject("获取用户信息失败")
              })
            },
            fail: () => reject("您还未允许获取用户信息")
          })
        },fail:msg=>reject(msg)
      })
    }
  })
}
//获取用户ID
function getUserId() {
  return new Promise((resolve, reject) => {
    let userId = wx.setStorageSync("userId")
    if (userId) {
      resolve(userId)
    } else {
      hasNetwork({
        success: () => {
          wx.login({
            success: res => {
              if (res.code) {
                var params = { code: res.code, systemCode: 1101 }
                POST("/auth/wechat/login", {
                  params: params,
                  success: res => {
                    var base64Token = "Bearer " + base64.CusBASE64.encoder(res.data.data.accessToken);
                    getApp().data.token = base64Token
                    wx.setStorageSync(baseUrl + "login", res.data)
                    wx.setStorageSync("userId", res.data.data.userId)
                    resolve(res.data.data.userId)
                  },
                  fail: error => reject("登录失败" + error)
                })
              } else {
                reject("登录失败")
              }
            }
          })
        }, fail: msg => reject(msg)
      })
    }
  })
}
//
function _canGetUserInfo(checkResult) {
  wx.getSetting({
    success(res) {
      if (res.authSetting["scope.userInfo"]) {
        checkResult.success()
      } else {
        checkResult.fail()
      }
    },
    fail: () => checkResult.fail()
  })
}
//网络处理
function hasNetwork(networkCallback) {
  wx.getNetworkType({
    success: res => {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      if (networkType == "none")
        networkCallback.fail( "网络连接断开，请连接网络！")
      else networkCallback.success()
    },
    fail: () => networkCallback.success()
  })
}
module.exports = {
  isLogin: isLogin,
  login: login,
  refreshToken: refreshToken,
  GET: GET,
  POST: POST,
  POSTjson: POSTjson,
  getLoginInfo: getLoginInfo,
  getUserId : getUserId,
  getUserInfo: getUserInfo,
  hasNetwork: hasNetwork
}