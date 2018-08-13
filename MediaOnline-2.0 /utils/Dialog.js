let _util = require("utils.js")
class Dialog {
  //
  static showLoading(msg) {
    if (!wx.getStorageSync("loading")) {
      wx.showLoading({ title: msg ? msg : "加载中..." })
      wx.setStorageSync("loading", true)
    }
  }

  //
  static hideLoading() {
    if (wx.getStorageSync("loading")) {
      wx.hideLoading()
      wx.setStorageSync("loading", false)
    }
  }
  //音频继续播放设置
  static shotProgress(time, callback) {
    var h = parseInt(time / 3600);
    var m = parseInt(time % 3600 / 60);
    var s = Math.round(time % 3600 % 60);
    var timeStr = (h <= 0 ? "" : h + "小时") + (m <= 0 ? "" : m + "分钟") + (s <= 0 ? "" : s + "秒")
    wx.showModal({
      title: '提示',
      content: '已播放' + timeStr + ",是否继续？",
      success: function (res) {
        if (res.confirm) {
          callback.comfirm()
        } else if (res.cancel) {
          callback.cancel()
        }
      }
    })
  }
  //音频播放完成
  static showPlayEnd(title, callback) {
    wx.showModal({
      title: '提示',
      content: "《" + title + "》已播放完，重新播放？",
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          callback.comfirm()
        } else if (res.cancel) {
          callback.cancel()
        }
      }
    })
  }

  //toast  2000ms
  static toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  }
}
export { Dialog }

