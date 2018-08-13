import { Dialog } from "Dialog.js";
import makeCancelable from "Cancelable.js";
const _network = require('network.js')
let _util = require("utils.js")
const AUDIO_URL = "/lesson/lessonDetail"
const UPLOAD_URL = "/lesson/lessonListenRs"
const errorList = {
  "10001": "系统错误",
  "10002": "网络错误",
  "10003": "文件错误",
  "10004": "格式错误",
  "-1": "未知错误"
}

class AudioManager {
  //音频管理对象
  _am = wx.getBackgroundAudioManager()
  //当前课节数组
  _audio = {}
  //开始播放时间
  _currTime = 0
  //当前是否正在播放 true：停止/暂停
  _isPaused = true
  //播放状态
  _state = "default"
  //播放模式
  _mode = "order"          //播放模式  order：顺序  random：随机  single:单个
  //时间进度监听数组
  _timeListeners = new Array()
  /**
   *  播放状态监听数组，播放状态回调函数参数值
   *  state = play:播放    
   *  state = wait:缓冲
   *  state = stop:停止
   *  state = pause:暂停
   *  state = end: 结束
   *  state = error: 音频数据错误
   *  state = loading: 加载音频网络数据
   *  state = success: 加载音频网络数据成功   value = 音频对象
   *  state = failure：加载音频网络数据失败  value = 失败信息
   */
  _stateListeners = new Array() 
  //获取单例对象
  static getInstance() {
    if (!this.instance) {
      this.instance = new AudioManager();
    }
    return this.instance;
  }

  constructor() {
    this._init()
    this._audios = [
    ]
    // this._audio = {
    //   "audioUrl": "http://file.djvdj.com/data/2018/02/09/1518149227.mp3",
    //   "authorId": 0,
    //   "courseId": 0,
    //   "createTime": "2018-03-22T02:01:05.504Z",
    //   "description": "string",
    //   "id": 0,
    //   "isFree": "string",
    //   "lastModifyTime": "2018-03-22T02:01:05.504Z",
    //   "nextLessonId": 0,
    //   "preLessonId": 0,
    //   "status": "string",
    //   "title": "逆流成河-金南玲",
    //   "totalTime": 0,
    //   "totalTimeStr": "string",
    //   "videoUrl": "string",
    //   "viewCount": 0,
    //   "weight": 0
    // }
  }

  //初始化
  _init() {
    //播放
    this._am.onPlay(() => {
      Dialog.hideLoading()
      this._setState("play")
    })
    //能播
    this._am.onCanplay(() => {
      Dialog.hideLoading()
      this._setState("play")
    })
    //暂停
    this._am.onPause(() => {
      this._setState("pause")
    })
    //停止
    this._am.onStop(() => {
      this._setState("stop")
      this._resetAudioData()
    })
    //完成
    this._am.onEnded(() => {
      this._setState("end")
      this._resetAudioData()
      this.next()
    })
    //出错
    this._am.onError((error) => {
      this._resetAudioData()
      let errCode = error.errCode;
      let errMsg = errorList[errCode.toString()]
      this._setState("error", { code: errCode, error: errMsg })
    })
    //缓冲
    this._am.onWaiting(() => {
      Dialog.showLoading('缓冲中...')
      this._setState("wait")
    })
    //上一
    this._am.onPrev(() => {
      this.previous()
    })
    //下一
    this._am.onNext(() => {
      this.next()
    })
    //进度
    this._am.onTimeUpdate(() => {
      if (this._am.paused) return
      // if ("play" != this._state && "wait" != this._state) {
      //   this._state = "play"
      //   this._stateListeners.map(_listener => { _listener(this._state) })
      //   Dialog.hideLoading()
      // }
      this._currTime = this._am.currentTime
      let playTime = this._am.currentTime
      let duration = this._am.duration
      let totalTime = null == duration ? this._audio.totalTime : duration
      this._timeListeners.map(_listener => { _listener(playTime, totalTime) })
    })
  }
  //设置音频播放列表
  setLessonId(lessonId) {
    this._currLessonId = lessonId
    this._play(lessonId)
  }
  //设置开始播放时间
  setCurrStartTime(time) {
    this._currTime = time
  }

  //播放状态监听
  addStateListener(_listener) {
    this._stateListeners.push(_listener) 
  }

  //添加时间进度监听
  addTimeListener(_listener) {
    this._timeListeners.push(_listener)
  }

  //播放状态监听
  removeStateListener(_listener) {
    this._stateListeners.splice(this._stateListeners.indexOf(_listener), 1) 
  }

  //移除进度监听
  removeTimeListener(_listener) {
    this._timeListeners.splice(this._timeListeners.indexOf(_listener), 1)
  }

  //强制播放
  forcePlay(audioId){
    if(!audioId) return
    //播放正在播放的音频
    if (audioId === this.getId() && this.isPlaying()){
      return
     }
    //播放暂停/停止的音频
    if (audioId === this.getId() && "pause" === this._state){
      this._setAudio(this._audio) 
      return
    }
    //切换音频
    this.change(audioId)
  }
  /**
   * 通过audioId播放音频
   */
  playByAudioId(audioId){
    if(!audioId && !this.getId()) return

    //1. 有新audioId
    if (audioId && audioId != this.getId()){
      this.change(audioId)
      return
    }

    //2. 当前播放音频地址未定义
    if (_util.isUndefined(this._audio.audioUrl)) {
      this._setState("error", { code: -1, error: "暂无播放内容" })
      return
    }

    //3.从分享直接进入播放页面，如果有在其他小程序播放音频，重新加载播放
    if (_util.isUndefined(this._am.src)) {
      this._play(this.getId())
      return
    }
    
    //4. 暂停
    if (!this.isPlaying()) {
      this.pause()
      return
    }
    //5. 播放
    this._setAudio(this._audio) 
  }
  //播放/暂停
  play(_callback) {
    //1. 切换新课节
    if (this._isNewLessonId(_callback)) {
      if (!this._am.paused) this._am.stop()   //停止正在播放音频
      this._play(_callback.lessonId)
      return
    }
    //2. 当前播放音频地址未定义
    let audioUrl = this._audio.audioUrl
    if (_util.isUndefined(audioUrl)) {
      this._setState("error", { code: -1, error: "暂无播放内容" })
      return
    }
    //3.从分享直接进入播放页面，如果有在其他小程序播放音频，重新加载播放
    let src = this._am.src
    if (_util.isUndefined(src)) {
      this._play(this.getId())
      return
    }
    // 4. 暂停
    if (!this._am.paused) {
      this._am.pause()
      return
    }
    // 5. 播放
    this._setAudio(this._audio)
  }
  //切换音频
  change(audioId) {
    // if (!this._am.paused) this._am.stop()   //停止正在播放音频
    if (this._hasLessonId(audioId)) {
      this._play(audioId)
    } else {
      _
    }
  }
  //上一首
  previous(_callback) {
    let audioId = this._audio.preLessonId
    if (!_util.isRealNum(audioId) || audioId < 0) {
      if (this._hasFailure(_callback)) {
        _callback.failure("已是第一个！")
      }
      return
    }
    this._setState("previous")
    if (this._hasSuccess(_callback)) _callback.success()
    this._play(audioId)
  }
  //下一首
  next(_callback) {
    let audioId = this._audio.nextLessonId
    if (!_util.isRealNum(audioId) || audioId < 0) {
      if (this._hasFailure(_callback)) _callback.failure("已是最后一个")
      return
    }
    this._setState("next")
    if (this._hasSuccess(_callback)) _callback.success()
    this._play(audioId)
  }
  //快进
  forward(_callback) {
    var time = this._hasSeekTime(_callback)
    if (this.isPlaying()) {
      let start = this.getProgress() + time
      start = start > this.getDuration() ? this.getDuration() : start
      this._am.seek(start)
    }
  }
  //快退
  fastback(_callback) {
    var time = this._hasSeekTime(_callback)
    if (this.isPlaying()) {
      let start = this.getProgress() - time
      start = start <= 0 ? 0 : start
      this._am.seek(start)
    }
  }
  //应用被回调onHide(home健)后，通知栏关闭播放或其他小程序播放操作，手动同步播放状态
  syncState(callback) {
    let that = this
    wx.getBackgroundAudioPlayerState({
      success: res => {
        let status = res.status
        let dataUrl = res.dataUrl
        //播放URL是未定义时，表示停止状态
        if (_util.isUndefined(that._audio.audioUrl)) that._state = "stop"
        //如果status=0表示 暂停或停止，  如果原先是停止状态就是停止状态，否则就是暂停状态
        if (0 == status) that._state = "stop" == that.getState() ? "stop" : "pause"
        that._isPaused = (0 == status)
        //回调状态,更新UI
        if (!_util.isUndefined(callback)) callback(that.getState())
        //清除进度定时器,并上传进度
        if (0 == status) that._updateProgress(that.getState())

      },
      fail: (msg) => {   //如果进入其他小程序播放音频后，会进入此方法
        that._state = "stop"
        that._isPaused = true
        //回调状态,更新UI
        if (!_util.isUndefined(callback)) callback(that.getState())
        //清除进度定时器
        that._clearInter()
      }
    })
  }
  //获取当前课节音频信息
  getLessonAudio() {
    return this._audio
  }
  //更新当前课节对象
  setLessonAudio(audio) {
    this._audio = audio
  }
  //更新课节音频数据
  updateAudio(audioId) {
    return this._loadData(audioId)
  }
  //获取当前课节Id
  getId() {
    return this._audio.id
  }
  //播放模式   order：顺序播放  random：随机播放  single:单个播放
  setPlayMode(mode) {
    this._mode = mode
  }
  //当前播放状态  默认:'default', 播放:'play', 暂停:'pause', 停止:'stop', 结束:'end', 加载:'loading'
  getState() {
    return this._state;
  }
  // 是否正在播放
  isPlaying() {
    return !this._isPaused
  }
  // 音频是否在播放
  isCurrentId(audioId){
    return  audioId && audioId ===  this.getId()
  }
  //获取暂停的时间
  getProgress() {
    return this._currTime
  }
  //获取当前音频时长
  getDuration() {
    return this._am.duration <= 0 ? this._audio.totalTime : this._am.duration
  }
  //播放拖动某位置
  seekTo(value) {
    this._am.seek(value)
  }
  //停止
  stop() {
    if(this.isPlaying()){ 
      this._am.stop()
    }else{ 
      this._setState("stop")
    }
  }
  //暂停
  pause() {
    if ("play"===this._state) {
      this._am.pause()
    } else {
      this._setState("pause")
    }
  }
  //清除进度上传定时器
  _clearInter() {
    if (_util.isUndefined(this._interval)) clearInterval(this.interval)
  }
  //定时上传播放进度
  _uploadProgress(self, data) {
    if (null == self._am.src) return
    //暂停，停止，播放结束 必须通过参数上传进度
    if (!_util.isUndefined(data)) {
      if (data.time <= 1) return
      self._postProgress(data)
      return
    }
    //上传正在播放的音频进度
    let time = parseInt(self._currTime)
    if (time <= 1) return
    let id = self.getId()
    self._postProgress({ lessonId: id, time: time })
  }
  //上传播放进度
  _postProgress(data) {
    _network.POST(UPLOAD_URL, {
      params: { lessonId: data.lessonId, listenTime: data.time },
      success: res => { console.log("time:" + data.time + " id:" + data.lessonId) },
      fail: msg => { console.log("上传播放时间失败:" + msg) }
    })
  }
  //通过课节ID从服务器获取音频相关数据
  _loadData(_lessonId) {
    // Dialog.showLoading('加载中...')
    // if (this._isPlayPage(_util.currPage()))
    this._setState("loading")
    return new Promise((resolve, reject) => {
      _network.GET(AUDIO_URL, {
        params: { lessonId: _lessonId },
        success: res => resolve(res),
        fail: msg => reject(msg),
        // complete: () => { if (!this._isPlayPage()) Dialog.hideLoading() }
      })
    }).then(res => {
      this._setState("success", res.data)
      this._audio = res.data.data
      return res.data.data
    }, msg => {
      let errCode = (msg === "您还未购买该专栏") ? 1201:-1
      this._setState("failure", { code: errCode, error: msg })
      this.pause()
    })
  }
  //加载音频数据
  _play(_lessonId) {
    this._loadData(_lessonId)
      .then(audio => {
        if (_util.isUndefined(audio)) return
        //暂停正在播放音频
        // if (!this._am.paused) this._am.stop()
        let learnTime = _util.isRealNum(audio.learnTime) ? parseInt(audio.learnTime) : 0
        let totalTime = _util.isRealNum(audio.totalTime) ? parseInt(audio.totalTime) : 0
        //判断当前所在的是不是播放页面
        // let isPlayPage = _util.currPageRoute() == "audio/pages/lesson_audio/lesson_audio"
        //上次已播放结束
        // if (isPlayPage && learnTime + 1 >= totalTime) {
        //   Dialog.showPlayEnd(audio.title,
        //     {
        //       comfirm: () => { this._setAudio(audio) },
        //       cancel: () => { this._audio = audio }
        //     })
        //   //如果上次播放时间大于1秒，则进行接着上次播放继续提示
        // } else if (isPlayPage && learnTime >= 2) {
        //   Dialog.shotProgress(learnTime,
        //     {
        //       comfirm: () => { this._currTime = learnTime; this._setAudio(audio) },
        //       cancel: () => this._audio = audio
        //     })
        // } else {
        //   this._setAudio(audio)
        // }
        this._currTime = learnTime >= totalTime - 1 ? 0 : learnTime
        //检查网络
        this._checkNetworkType({
          confirm: () => {this._setAudio(audio) },
          cancel: () => { }
        })
      })
  }
  //设置音频数据
  _setAudio(audio) {
    if (_util.isUndefined(audio) || _util.isUndefined(audio.audioUrl)) {
      this._setState("error", { code: -1, error: "暂无播放内容" })
      return
    }
    this._am.src = audio.audioUrl
    this._am.seek(this._currTime)
    this._am.startTime = this._currTime
    this._am.title = audio.title
    // this._am.epname = audio.title
    // this._am.singer = audio.title
    this._am.coverImgUrl = audio.coverPic
    this._audio = audio
  }
  //设置状态
  _setState(_state, res) {
    if (!_util.isUndefined(res)) {
      this._state = _state
      this._stateListeners.map(_listener => { _listener(this._state, res) })
    }
    //如果当前音频地址与正在播放的地址不一致(播放错乱或其他小程序正在播放)
    else {
      // if (null != this._am.src && this._am.src != this._audio.audioUrl) {
      //   _state = "stop"
      // }
      this._state = _state
      this._stateListeners.map(_listener => { _listener(this._state) })
    }
    this._isPaused = "play" != this._state && "wait" != this._state
    this._updateProgress(this._state)
  }
  //更新进度
  _updateProgress(state) {
    if (_util.isUndefined(this._interval)) clearInterval(this.interval)
    switch(state){
      case "stop":
      case "pause":
      case "end":
      case "next":
      case "previous":
        this._uploadProgress(this, { lessonId: this.getId(), time: parseInt(this._currTime) })
      break
      case "play":
        this.interval = setInterval(this._uploadProgress, 5000, this)
      break 
    }
  }
  //初始化网络监听和选择时播放状态
  _checkNetworkType(_callback) {
    //当前网络是否是移动网络
    wx.getNetworkType({
      success: res => {
        if (_util.mobileNetwork(res.networkType) && wx.getStorageSync("tip")) {
          _util.networkModal({
            confirm: () => _callback.confirm(),
            cancel: () => _callback.cancel()
          })
          wx.setStorageSync("tip", false)
        } else {
          _callback.confirm()
        }
      }
    })
    //网络状态改变监听
    wx.onNetworkStatusChange(res => { this._networkChange(res) })
  }
  //网络状态改变
  _networkChange(res) {
    if (!res.isConnected) util.toast("网络已断开")
    // let currNetworkType = res.networkType;
    // let lastNetworkType = wx.getStorageSync("networkType")
    // if (audioManager.isPlaying() && util.mobileNetwork(currNetworkType)) {
    //   if (lastNetworkType != currNetworkType) {
    //     util.networkModal({ cancel: () => { audioManager.play() } })
    //   }
    // }
    // wx.setStorageSync("networkType", currNetworkType)
  }
  //回调是否定义，且返回快进秒数
  _hasSeekTime(_callback) {
    return !_util.isUndefined(_callback)
      && !_util.isUndefined(_callback.time) ? _callback.time : 15
  }
  //回调是否定义，且回调有音频位置
  _isNewLessonId(_callback) {
    return !_util.isUndefined(_callback)
      && !_util.isUndefined(_callback.lessonId)
      && _callback.lessonId != this._audio.id
  }
  //回调是否定义，且回调有课节音频ID
  _hasLessonId(lessonId) {
    return !_util.isUndefined(lessonId)
  }
  //回调是否定义，且回调有success函数
  _hasSuccess(_callback) {
    return !_util.isUndefined(_callback) && !_util.isUndefined(_callback.success)
  }
  //回调是否定义，且回调有failure函数
  _hasFailure(_callback) {
    return !_util.isUndefined(_callback) && !_util.isUndefined(_callback.failure)
  }
  //当前页面是不是播放音频页面
  _isPlayPage(page) {
    return page.route == "audio/pages/lesson_audio/lesson_audio"
  }
  //重置音频数据
  _resetAudioData() {
    this._currTime = 0
  }
}
export { AudioManager } 