// pages/home/home.js
let inter = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 底部导航数据-》》》
    currentIndex: 0,
    played: false,
    percent: 0,
    // 底部导航数据-《《《
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    messageCount: 0,
    knowledge: [{
        title: "文学|为什么抱元科技没有食堂？",
        id: 1
      },
      {
        title: "艺术|名画为什么这么值钱？",
        id: 2
      }
    ],
    vision: [{
        cover: "",
        title: "中华五千年（上）",
        des: "听历史故事，涨人生见识",
        author: "伍智·国学教师",
        price: "99.00",
        count: "100",
        fit: "4-6岁",
        id: 1
      },
      {
        cover: "",
        title: "中华五千年（上）",
        des: "听历史故事，涨人生见识",
        author: "伍智·国学教师",
        price: "99.00",
        count: "100",
        fit: "4-6岁",
        id: 2
      },
      {
        cover: "",
        title: "中华五千年（上）",
        des: "听历史故事，涨人生见识",
        author: "伍智·国学教师",
        price: "99.00",
        count: "100",
        fit: "4-6岁儿童",
        id: 3
      }
    ],
    classroom: [{
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
    ],
    books: [{
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true,
        id: 1
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true,
        id: 2
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true,
        id: 3
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true,
        id: 4
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: true,
        id: 5
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false,
        id: 6
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false,
        id: 7
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false,
        id: 8
      },
      {
        cover: "",
        title: "小麦的故事",
        price: "4.99",
        isNew: false,
        id: 9
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  enterKnowledgeList: function(e) {
    wx.navigateTo({
      url: '../knowledge/knowledgeList',
    })
  },
  enterKnowledgeDetail: function(e) {
    let knowledgeId = this.data.knowledge[e.currentTarget.id].id
    wx.navigateTo({
      url: '../knowledge/knowledge?id=' + knowledgeId,
    })
  },
  enterVisionList: function(e) {
    wx.navigateTo({
      url: '../vision/visionList',
    })
  },

  enterVisionDetail: function(e) {
    wx.navigateTo({
      url: '../vision/vision?id=' + e.currentTarget.dataset.visionid,
    })
  },
  enterClassroomList: function(e) {
    wx.navigateTo({
      url: '../classroom/classroomList',
    })
  },
  enterClassroomDetail: function(e) {
    console.log(e.currentTarget.id)
    let classroomId = this.data.knowledge[e.currentTarget.id].id
    wx.navigateTo({
      url: '../classroom/classroom?id=' + classroomId,
    })
  },
  enterBookList: function(e) {
    wx.navigateTo({
      url: '../books/bookList',
    })
  },
  enterBookDetail: function(e) {
    let bookId = this.data.books[e.currentTarget.id].id
    wx.navigateTo({
      url: '../books/book?id=' + bookId,
    })
  },
  // 底部导航事件
  toggleBar: function(even) {
    const {
      currentIndex
    } = this.data;
    const {
      index
    } = even.detail;
    this.setData({
      currentIndex: index
    })
  },
  handlePlay: function() {
    const {
      played
    } = this.data;
    this.setData({
      played: !played
    }, () => {
      clearInterval(inter)
      if (!played) {
        inter = setInterval(() => {
          const {
            percent
          } = this.data;
          if (percent < 100) {
            this.setData({
              percent: percent + 1
            });
          } else {
            this.setData({
              percent: 0,
              played: false
            });
            return clearInterval(inter);
          }
        }, 1000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})