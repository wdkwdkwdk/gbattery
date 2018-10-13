<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
    this.checkLogin()
  },
  onShow (obj) {
    console.log(obj)
    if (obj.sene === '1044') {
      wx.getShareInfo({
        shareTicket: obj.shareTicket,
        success: res => {
          console.log(res)
          this.getGroupData(res)
        }
      })
    }
  },
  methods: {
    checkLogin () {
      this.checkSession()
      const openid = wx.getStorageSync('openid')
      const sessionKey = wx.getStorageSync('sessionkey')
      if (openid && sessionKey) {
        this.checkSession()
      } else {
        this.login()
      }
    },
    checkSession () {
      wx.checkSession({
        success: res => {
          console.log(res)
        }
      })
    },
    login (callback, val) {
      wx.login({
        timeout: 4000,
        success: res => {
          wx.cloud.callFunction({
            name: 'getSession',
            data: {
              JSCODE: res.code
            }
          }).then(
            res => {
              const result = JSON.parse(res.result)
              const sessionKey = result.session_key
              const openid = result.openid
              wx.setStorageSync('sessionkey', sessionKey)
              wx.setStorageSync('openid', openid)
              if (callback) {
                callback(val)
              }
            },
            error => {
              if (error) {
                console.log(error)
              }
            }
          )
        }
      })
    },
    getGroupData (data) {
      const sessionKey = wx.getStorageSync('sessionkey')
      if (sessionKey) {
        wx.cloud.callFunction({
          name: 'getDecryptData',
          data: {
            sessionKey,
            encryptedData: data.encryptedData,
            iv: data.iv
          }
        }).then(
          res => {
            // console.log(res.result.openGId, '??????????????')
            const gID = res.result.openGId
            this.$store.commit('setGID', gID)
          }
        )
      } else {
        // this.login
        this.login(this.getGroupData, data)
      }
    }
  }
}
</script>

<style>
page{
  height: 100%;
}
.container {
  height: 100%;
  color: #4a4a4a;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
