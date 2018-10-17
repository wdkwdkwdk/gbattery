<template>
  <scroll-view scroll-y class="container rank">
    <div class="inner" v-if="rankData.rank.length">
      <section class="header">
        <p class="g-name">
          <!-- {{ groupName }} -->
          <open-data type="groupName" :open-gid="gID"></open-data>
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
    <loading v-if="isLoading">
    </loading>
    <footer v-if="!isLoading && isByShare">
      <button class="primary" size="mini" @click.stop="backHome">
         回到首页
      </button>
    </footer>
  </scroll-view>
</template>
<script>
import loading from '@/components/loading'
import rankitem from '@/components/rank_item'
/* eslint-disable-next-line */
const regeneratorRuntime = require('../../../static/regenerator-runtime/runtime.js')

export default {
  mounted () {
    const query = this.$root.$mp.query
    this.roomId = query.id
    if (!this.isLogined()) {
      wx.reLaunch({url: `/pages/login/main?id=${this.roomId}`})
    } else {
      this.reset()
      this.isByShare = query.share
      this.gID = query.gid
      this.init()
    }
  },
  onShareAppMessage (share) {
    return {
      title: '来和我比拼一下电量吧',
      path: `/pages/rank/main?id=${this.roomId}&share=1`,
      success: res => {
        // this.generateRoom(roomId)
      },
      fail: error => {
        if (error) {
          // todo
        }
      }
    }
  },
  data () {
    return {
      roomId: '',
      isByShare: false,
      gID: '',
      isLoading: false,
      batteryInfo: {
        level: 100,
        isCharging: false
      },
      rankData: {
        me: {
          index: 0
        },
        rank: []
      },
      limit: 20,
      offset: 0,
      noMoreData: false
    }
  },
  components: {
    rankitem,
    loading
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
    openid () {
      return this.$store.state.openid
    },
    sessionKey () {
      return this.$store.state.sessionKey
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    reset () {
      this.rankData = {
        me: {
          index: 0
        },
        rank: []
      }
      this.offset = 0
      this.noMoreData = false
    },
    isLogined () {
      const openid = this.openid
      const hasInfo = wx.getStorageSync('userinfo')
      return openid && hasInfo
    },
    async init () {
      this.getGroupInfo()
      this.getBatteryInfo()
    },
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
    },
    getBatteryInfo () {
      if (this.noMoreData) {
        return
      }
      wx.getBatteryInfo({
        success: res => {
          this.batteryInfo.level = res.level
          this.batteryInfo.isCharging = res.isCharging
          this.getRank(this.batteryInfo)
        },
        fail: error => {
          if (error) {
            // todo
          }
        }
      })
    },
    getRank (batteryInfo) {
      const roomId = this.roomId
      if (!roomId) {
        return
      }
      this.isLoading = true
      wx.cloud.callFunction({
        name: 'updateRoom',
        data: {
          roomId,
          batteryInfo
        }
      }).then(
        res => {
          let result = res.result
          let arr = result.rank
          this.isLoading = false
          if (result.me && arr.length) {
            this.rankData.rank = arr
            this.offset += this.limit
            if (arr.length < this.limit) {
              this.noMoreData = true
            }
          }
        },
        error => {
          if (error) {
            // todo
            console.log(error)
            this.isLoading = false
          }
        }
      ).catch(
        error => {
          if (error) {
            this.isLoading = false
            // todo
          }
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
              if (callback) {
                callback(val)
              }
            },
            error => {
              if (error) {
                console.log(error)
                // todo
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
              let result = res.result
              const gID = result.openGId
              if (!this.gID) {
                this.gID = gID
              }
              this.savegId(gID)
            }
          )
        } else {
          this.login(this.getGroupData, data)
        }
      } catch (error) {
        if (error) {
          // todo
        }
      }
    },
    savegId (gId) {
      const roomId = this.roomId
      if (roomId) {
        wx.cloud.callFunction({
          name: 'savegId',
          data: {
            roomId,
            gId
          }
        })
      }
    },
    backHome () {
      wx.reLaunch({url: '/pages/index/main'})
    }
  }
}
</script>
<style lang="scss" scoped>
.rank{
  .inner{
    padding-bottom: 100px;
    text-align: center;
    margin: 0 30px;
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
  footer{
    position: fixed;
    bottom: 30px;
    left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
