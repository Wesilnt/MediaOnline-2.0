// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    knowledge:[{
      title:"文学|为什么抱元科技没有食堂？",
      id:""
    },
    {
      title: "艺术|名画为什么这么值钱？",
      id: ""
    }],
    vision:[{
      cover:"",
      title:"中华五千年（上）",
      des:"听历史故事，涨人生见识",
      author:"伍智·国学教师",
      price:"99.00",
      count:"100",
      fit:"4-6岁",
    },
    {
      cover: "",
      title: "中华五千年（上）",
      des: "听历史故事，涨人生见识",
      author: "伍智·国学教师",
      price: "99.00",
      count: "100",
      fit: "4-6岁",
    },
    {
      cover: "",
      title: "中华五千年（上）",
      des: "听历史故事，涨人生见识",
      author: "伍智·国学教师",
      price: "99.00",
      count: "100",
      fit: "4-6岁儿童",
    }],
    books:[
    {
      cover:"",
      title:"小麦的故事",
      price:"4.99",
      isNew:true
    },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
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
  
  }
})