// pages/components/loadingTip/loadingTip.js
let _compData = {
  '_loadingTip_.isHide': true,
  // '_loadingTip_.image':'',
  // '_loadingTip_.content':''
}
let loadingTip = {
  // toast显示的方法
  show: function () {
    let self = this;
    this.setData({'_loadingTip_.isHide': true});
    // setTimeout(function () {
    //   self.setData({'_loadingTip_.isHide': false })
    // }, 3000)
  },
  hide: function(){
    this.setData({'_loadingTip_.isHide': false })
  }
}
function LoadingTip() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  // 小程序最新版把原型链干掉了。。。换种写法
  Object.assign(curPage, loadingTip);
  // 附加到page上，方便访问
  curPage.loadingTip = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_compData);
  return this;
}
module.exports = {
  LoadingTip
}