
class TimeManager {

  timer = null 

  // 开始倒计时
  startCountDown (seconds, callBack) {
    var that = this
    var countTime = that.formatTime(seconds)
    //将倒计时初始时间回调出去
    callBack.updateTime(countTime)
    callBack.roller(countTime)
    this.timer = setInterval(()=>{
      if(seconds > 0) {
        seconds--
        var countTime = that.formatTime(seconds)
        callBack.updateTime(countTime)
      }else {
        var countTime = that.formatTime(seconds)
        callBack.updateTime(null)
        that.pauseCountDown()
      }
    },1000)
    this.roller = setInterval(()=>{
      var countTime = that.formatTime(seconds)
      callBack.roller(countTime)
    },6000)
  }

  //停止倒计时
  pauseCountDown () {
    console.log("销毁定时器")
    if (this.timer)clearInterval(this.timer)
    if (this.roller)clearInterval(this.roller)
  }

  //格式化时间
  formatTime(seconds) {
    // var days = parseInt(seconds / (60 * 60 * 24));
    // var hours = parseInt((seconds % (60 * 60 * 24)) / (60 * 60));
    var hours = parseInt(seconds / (60 * 60))
    var minutes = parseInt((seconds % (60 * 60)) / (60));
    var seconds = (seconds % 60);
    hours = parseInt(hours)
    minutes = parseInt(minutes)
    seconds = parseInt(seconds)
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hours + "时" + minutes + "分" + seconds+"秒"
  }
}

export { TimeManager }