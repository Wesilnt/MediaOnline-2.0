// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reply:1,
    sysMessage:99,
    functions: [
      {
        "id": 1,
        "name": "已购清单",
        "pic_url": '../../images/my_purchase.png'
      },
      {
        "id": 2,
        "name": "播放记录",
        "pic_url": '../../images/my_record.png'
      },
      {
        "id": 3,
        "name": "我喜欢的",
        "pic_url": '../../images/my_like.png'
      },
      {
        "id": 4,
        "name": "我的拼团",
        "pic_url": '../../images/my_puzzle.png'
      },
      {
        "id": 5,
        "name": "回应我的",
        "pic_url": '../../images/my_reply.png'
      },
      {
        "id": 6,
        "name": "我的集赞",
        "pic_url": '../../images/my_praise.png'
      },
      {
        "id": 7,
        "name": "书币钱包",
        "pic_url": '../../images/my_wallet.png'
      },
      {
        "id": 8,
        "name": "系统消息",
        "pic_url": '../../images/my_sys_message.png'
      },
      {
        "id": 9,
        "name": "帮助中心",
        "pic_url": '../../images/my_help.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  clickUserinfo: function() {
    console.log("to edit user info")
  },
  clickMyFunction: function (e) {
    //console.log(e)
    switch (e.currentTarget.id) {
      case "1":
        console.log("1")
        break;
      case "2":
        console.log("2")
        break;
      case "3":
        console.log("3")
        break;
      case "4":
        console.log("4")
        break;
      case "5":
        console.log("5")
        break;
      case "6":
        console.log("6")
        break;
      case "7":
        console.log("7")
        break;
      case "8":
        console.log("8")
        break;
      case "9":
        console.log("9")
        break;
      case "10":
        console.log("10")
        break;
      case "11":
        console.log("11")
        break;
      case "12":
        console.log("12")
        break;
      case "13":
        console.log("13")
        break;
      case "14":
        console.log("14")
        break;
      default:
        console.log(e);
    }
  }
})