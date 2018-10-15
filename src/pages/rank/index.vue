<template>
  <div class="rank">
    <div class="inner">
      <section class="header">
        <p class="g-name">
          {{ groupName }}
        </p>
        <p class="what">
          电量排行榜
        </p>
      </section>
      <section class="me">
        <rankitem :rankItem="myRank.rankData" :index="myRank.index" v-if="myRank.rankData">
        </rankitem>
      </section>
      <section class="rank-list">
        <ul>
          <li v-for="(item, index) in rankData.rank" :key="item._id" v-if="item">
            <rankitem :rankItem="item" :index="index+1">
            </rankitem>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import rankitem from '@/components/rank_item'
/* eslint-disable-next-line */
const regeneratorRuntime = require('../../../static/regenerator-runtime/runtime.js')

export default {
  mounted () {
    const roomId = this.$root.$mp.query.id
    if (!wx.getStorageSync('openid')) {
      wx.reLaunch({url: `/pages/login/main?id=${roomId}`})
    }
    // this.getGroupInfo()
    this.getBatteryInfo()
  },
  onShareAppMessage (share) {
    const roomId = 1539523607141376027
    return {
      title: '来和我比拼一下电量吧单独！',
      path: `/pages/rank/main?id=${roomId}`,
      success: res => {
        // this.generateRoom(roomId)
      },
      fail: error => {
        if (error) {
          console.log('失败')
        }
      }
    }
  },
  data () {
    return {
      groupName: '毛线球科技',
      batteryInfo: {
        level: 100,
        isCharging: false
      },
      rankData: {
        me: {
          index: 0
        },
        rank: []
      }
    }
  },
  components: {
    rankitem
  },
  computed: {
    myRank () {
      let myIndex = this.rankData.me.index
      const rankData = this.rankData.rank[myIndex]
      const myRank = {
        index: myIndex += 1,
        rankData
      }
      return myRank
    },
    gID () {
      console.log(this.$store.state.gID, '呀哈哈')
      return this.$store.state.gID
    }
  },
  methods: {
    getGroupInfo () {
      const groupTempData = this.$store.state.groupTempData
      if (groupTempData) {
        wx.getShareInfo({
          shareTicket: groupTempData,
          success: res => {
            this.getGroupData(res)
          }
        })
      }
      // if (groupTempData) {
      //   this.getGroupData(this.$store.state.groupTempData)
      // }
    },
    getBatteryInfo () {
      wx.getBatteryInfo({
        success: res => {
          this.batteryInfo.level = res.level
          this.batteryInfo.isCharging = res.isCharging
          this.getRank(this.batteryInfo)
        }
      })
    },
    getRank (batteryInfo) {
      const roomId = this.$root.$mp.query.id
      wx.cloud.callFunction({
        name: 'newMember',
        data: {
          roomId,
          batteryInfo
        }
      }).then(
        res => {
          this.rankData = res.result
        }
      )
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
    checkSession () {
      return new Promise((resolve, reject) => {
        wx.checkSession({
          success: res => {
            console.log(res)
            if (res.errMsg === 'checkSession:ok') {
              /* eslint-disable-next-line */
              resolve(true)
            } else {
              /* eslint-disable-next-line */
              reject(false)
            }
          },
          fail: error => {
            if (error) {
              /* eslint-disable-next-line */
              reject(false)
            }
          }
        })
      })
    },
    async getGroupData (data) {
      try {
        this.checkSession()
        const sessionKey = wx.getStorageSync('sessionkey')
        const isSessionValid = await this.checkSession()
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
          console.log(error)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rank{
  padding: 30px;
  .inner{
    text-align: center;
    .header{
      .g-name{
        font-size: 10px;
        opacity: 0.5;
      }
      .what{
        font-size: 20px;
        margin-top: 4px;
      }
      text-align: center;
    }
    .me{
      margin: 30px 0;
    }
    .rank-list{
      ul{
        li{
          position: relative;
          &:not(:last-child){
            &::before{
              content: "";
              position: absolute;
              left: 20px;
              right: 20px;
              height: 1px;
              background-color: #707070;
              opacity: 0.1;
              bottom: 0;
              transform: scaleY(0.5);
            }
          }
        }
      }
    }
  }
}
</style>
