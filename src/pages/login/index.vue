<template>
  <div class="login">
    <div class="inner">
      <p>
        为获得更好的使用体验，我们需要获取您的头像、昵称等公开信息。
      </p>
      <footer>
        <button class="primary" size="mini" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" :loading="isLogining" :disabled="isLogining">
          授权登录
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable-next-line */
const regeneratorRuntime = require('../../../static/regenerator-runtime/runtime.js')
export default {
  mounted () {
    this.init()
  },
  data () {
    return {
      isLogining: false
    }
  },
  methods: {
    async init () {
      try {
        this.isLogining = true
        const loginInfo = await this.login()
        const isSessionValid = await this.checkSession()
        console.log(isSessionValid, '[[[[')
        wx.setStorageSync('sessionkey', loginInfo.sessionKey)
        wx.setStorageSync('openid', loginInfo.openid)
        this.$store.commit('setOpenid', loginInfo.openid)
      } catch (error) {
        console.log(error.message)
      }
      this.isLogining = false
    },
    checkSession () {
      return new Promise((resolve, reject) => {
        wx.checkSession({
          success: res => {
            console.log(res, '?????')
            if (res.errMsg !== 'checkSession:ok') {
              resolve(true)
            } else {
              reject(new Error('invalid checksession 1'))
            }
          },
          fail: error => {
            if (error) {
              reject(new Error('invalid checksession 2'))
            }
          }
        })
      })
    },
    login () {
      return new Promise((resolve, reject) => {
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
                if (sessionKey && openid) {
                  resolve(result)
                } else {
                  reject(new Error('login error1'))
                }
              },
              error => {
                if (error) {
                  reject(new Error('login error2'))
                }
              }
            )
          }
        })
      })
    },
    bindGetUserInfo (e) {
      console.log(e.target.userInfo)
      const user = e.target.userInfo
      if (user) {
        this.$store.commit('setUserInfo', user)
        this.saveUser(user)
        wx.reLaunch({url: '/pages/index/main'})
      } else {
        console.log('授权失败')
      }
    },
    saveUser (user) {
      const db = wx.cloud.database({env: 'dev-952bab'})
      db.collection('users').add({
        data: user
      }).then(res => {
        console.log(res)
      }).catch(console.error)
    }
  }
}
</script>
<style lang="scss" scoped>
.login{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  box-sizing: border-box;
  .inner{
    p{
      margin-bottom: 70px;
      line-height: 1.8;
    }
    footer{
      text-align: center;
    }
  }
}
</style>
