Component({
  properties: {
    color: {
      type: String,
      value: "#bebdbe",
    },
    selectedColor: {
      type: String,
      value: "#F79500",
    },
    currentIndex: {
      type: Number,
      value: 0,
    },
    played: {
      type: Boolean,
      value: false,
    },
    percent: {
      type: Number,
      value: 0,
      observer: function(percent) {
        console.log(percent)
        this._progressing(percent);
      }
    },
    list: {
      type: Array,
      value: [{
        "selectedIconPath": "../../images/nav_home_highlight.png",
        "iconPath": "../../images/nav_home_normal.png",
        "pagePath": "pages/personal/index",
        "text": "主页",
        "index": 0
      }, {
        "selectedIconPath": "../../images/nav_info_highlight.png",
        "iconPath": "../../images/nav_info_normal.png",
        "pagePath": "pages/index/index",
        "text": "发现",
        "index": 1
      }, ],
    }
  },
  ready: function() {
    this.ctx = wx.createCanvasContext('progress', this);
    this.startDeg = -Math.PI / 2
   
  },
  methods: {
    _progressing: function(percent) {
      const progressDeg = percent / 100 * 2 * Math.PI+this.startDeg;
      this.ctx.beginPath()
      this.ctx.setLineWidth(6);
      this.ctx.setStrokeStyle('#FFA32F');
      this.ctx.arc(42, 42, 33, this.startDeg, progressDeg ,false)
      this.ctx.stroke()
      this.ctx.draw()
    },
    onToggle: function(e) {
      const {
        index
      } = e.currentTarget.dataset;
      this.triggerEvent('toggleBar', {
        index
      })
    },
    renderProgress: function(e) {
      this.triggerEvent('handlePlay');
    }
  }
})