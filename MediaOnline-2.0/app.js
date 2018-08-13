import { AudioManager } from "utils/AudioManager.js";       //音频播放管理对象
import { LoadingTip } from '/components/loadingTip/loadingTip.js'
let util = require("utils/utils.js")
let network = require("utils/network.js")
let base64 = require("utils/base64.js")

App({
  LoadingTip,
  data: {
    token: "",
    playIcon: "/images/ic_play.png",
    pauseIcon: "/images/ic_pause.png",
    platform: "",
    system: "",
  },
  currentName: null,   //专栏名称
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var value = network.getLoginInfo()
    if (value) {
      var base64Token = "Bearer " + base64.CusBASE64.encoder(value.data.accessToken)
      this.data.token = base64Token
    }

    //获取当前手机系统版本
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.data.platform = res.platform;
        that.data.system = res.system;
      }
    })


  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    wx.setStorageSync("tip", true)
    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log("新版本信息：",res.hasUpdate)
    })
    // AudioManager.getInstance().syncState(true)
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    wx.setStorageSync("tip", false)
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  //px转rpx
  px2rpx: function (px) {
    return 375 / wx.getSystemInfoSync().windowWidth * 2 * px
  },
  //rpx转px
  rpx2px: function (rpx) {
    return (rpx * wx.getSystemInfoSync().windowWidth) / (2 * 375)
  },

})
