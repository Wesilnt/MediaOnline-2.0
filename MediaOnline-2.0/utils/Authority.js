let permissionResults = {}
class Authority {
  //权限授权检查，掉此方法必须在之前调用requestPermission声请权限
  static checkPermission(checkResult) {
    let permission = checkResult.permission
    if (!permission in permissionResults) {
      console.error("权限检查出错: 必须先调用requestPermission申请" + permission + "权限,否则无法检查此权限。")
      return
    }
    if (permission && !permissionResults[permission]) {
      checkResult.fail() //授权被拒绝
      return
    }
    checkResult.success() //用户已授权
  }
  //检查用户是否已授权
  static checkGetUserInfo(checkResult) {
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
  //onShow方法进行权限列表申请
  static requestPermission(permissionList) {
    let that = this
    wx.getSetting({
      success(res) {
        permissionList.map(permission => {
          if (!res.authSetting[permission]) {
            if (permission == "scope.userInfo")
              permissionResults[permission] = false
            else
              wx.authorize({
                scope: permission,
                success: () => permissionResults[permission] = true,
                fail: () => permissionResults[permission] = false
              })
          } else {
            permissionResults[permission] = true
          }
        })
      },
      fail: () => {
        permissionList.map(permission => {
          permissionResults[permission] = false
        })
      }
    })
  }
}
export {
  Authority
}