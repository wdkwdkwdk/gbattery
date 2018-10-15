<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    this.getUserInfo()
    this.checkLogin()
    const db = wx.cloud.database({env: 'dev-952bab'})
    // const todosCollection = db.collection('users').doc('W8GOEQ6qgQy38i34')
    // console.log(todosCollection)
    // db.collection('users').where({
    //   _openid: wx.getStorageSync('openid') // 填入当前用户 openid
    // }).get().then(res => {
    //   console.log(res)
    // })
    // db.collection('users').add({
    //   data: {
    //     name: 'les'
    //   }
    // }).then(res => {
    //   console.log(res)
    // }).catch(console.error)
    // db.collection('users').doc('W8Grrd2AWotkdVOa').update({
    //   data: {
    //     name: 'zeefix'
    //   }
    // }).then(
    //   res => {
    //     console.log('删除成功')
    //   }
    // )
    db.collection('users').where({
      // _openid: 'os4CW5B_j-0uLk4rh_FtciMyb89Y'
      name: 'les'
    }).get().then(
      res => {
        console.log(res, '...')
      }
    )
  },
  onShow (obj) {
    if (obj.scene === 1044) {
      this.$store.commit('setGroupTempData', obj.shareTicket)
      // wx.getShareInfo({
      //   shareTicket: obj.shareTicket,
      //   success: res => {
      //     this.getGroupData(res)
      //   }
      // })
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
              }
            })
          }
        }
      })
    },
    checkLogin () {
      const openid = wx.getStorageSync('openid')
      const sessionKey = wx.getStorageSync('sessionkey')
      if (openid && sessionKey) {
        // this.checkSession()
      } else {
        this.login()
      }
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
      console.log(data, '////')
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
              console.log(res.result, '....')
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
          console.log(error)
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
  color: #4a4a4a;
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
