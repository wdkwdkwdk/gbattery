<script>
export default {
  created () {
    this.checkLogin()
    this.getUserInfo()
  },
  onShow (obj) {
    if (obj.scene - 0 === 1044) {
      this.$store.commit('setGroupTempData', obj.shareTicket)
    }
  },
  methods: {
    getUserInfo () {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.$store.commit('setUserInfo', res.userInfo)
              },
              fail: error => {
                if (error) {
                  // wx.reLaunch({url: '/pages/login/main'})
                }
              }
            })
          } else {
            // wx.reLaunch({url: '/pages/login/main'})
          }
        },
        fail: error => {
          if (error) {
            // wx.reLaunch({url: '/pages/login/main'})
          }
        }
      })
    },
    checkLogin () {
      this.login()
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
                // todo
              }
            }
          )
        }
      })
    },
    getGroupData (data) {
      try {
        const sessionKey = wx.getStorageSync('sessionkey')
        const isSessionValid = true
        if (sessionKey && isSessionValid) {
          wx.cloud.callFunction({
            name: 'getDecryptData',
            data: {
              sessionKey,
              encryptedData: data.encryptedData,
              iv: data.iv
            }
          }).then(
            res => {
              const gID = res.result.openGId
              this.$store.commit('setGID', gID)
            }
          )
        } else {
          // this.login
          this.login(this.getGroupData, data)
        }
      } catch (error) {
        if (error) {
          // todo
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/modules.scss';
page{
  height: 100%;
  background-color: #f5f5f6;
}
.container {
  height: 100%;
  padding: 30px 0;
  color: #4a4a4a;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
