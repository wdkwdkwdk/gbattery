<template>
  <div class="container">
    <div class="wrapper">
      <p class="group-name">
        <open-data type="groupName" :open-gid="gID"></open-data>
      </p>
      <section class="battery">
        <p class="title">
          当前电量(%)
        </p>
        <p class="value">
          <span class="level">
            {{ batteryInfo.level }}
          </span>
        </p>
        <section class="img-zone">
          <img :src="batteryImg" alt="电池" class="battery">
          <section class="battery-process" :class="lowBattery ? 'low-battery' : runoutBattery ? 'runout-battery' : fullBattery ? 'full-battery' : ''" :style="batteryLifeStyle">
          </section>
          <img :src="chargeImg" alt="充电" class="charge" v-if="batteryInfo.isCharging">
        </section>
      </section>
      <footer>
        <div>
          <button size="mini" class="primary" open-type="share">
            电量比拼
          </button>
        </div>
        <div>
          <button size="mini" class="plain" @click.stop="checkRecord">
            历史记录
          </button>
        </div>
      </footer>
    </div>
  </div>  
</template>

<script>
import batteryImg from '@/images/battery.png'
import chargeImg from '@/images/charge-dark.png'
export default {
  mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getBatteryInfo()
  },
  onShow () {
    this.getBatteryInfo()
    if (!this.sended && this.roomId) {
      this.generateRoom(this.roomId)
    }
  },
  onShareAppMessage (share) {
    this.roomId = this.generateRoomId()
    return {
      title: '来和我比拼一下电量吧！',
      path: `/pages/rank/main?id=${this.roomId}&share=1`,
      imageUrl: 'http://ojrbqzf6q.qnssl.com/Fl-OTVl85MWtKYBlc0GxRlDciBz1.png',
      success: res => {
        this.generateRoom(this.roomId)
        this.sended = true
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
      motto: 'Hello World',
      batteryInfo: {
        level: 100,
        isCharging: false
      },
      batteryImg,
      chargeImg,
      roomId: null,
      sended: false
    }
  },
  computed: {
    batteryLifeStyle () {
      const rate = (this.batteryInfo.level / 100).toFixed(2)
      return `transform: scaleX(${rate})`
    },
    fullBattery () {
      return this.batteryInfo.level >= 70
    },
    lowBattery () {
      return this.batteryInfo.level >= 20 && this.batteryInfo.level < 70
    },
    runoutBattery () {
      return this.batteryInfo.level < 20
    },
    gID () {
      return this.$store.state.gID
    },
    openid () {
      return this.$store.state.openid
    }
  },
  methods: {
    generateRoomId () {
      let roomId = ''
      for (let i = 0; i < 6; i++) {
        roomId += Math.floor(Math.random() * 10)
      }
      roomId = new Date().getTime() + roomId
      return roomId
    },
    getBatteryInfo () {
      wx.getBatteryInfo({
        success: res => {
          this.batteryInfo.level = res.level > 0 ? res.level : 1
          this.batteryInfo.isCharging = res.isCharging
        }
      })
    },
    generateRoom (roomId) {
      const batteryInfo = this.batteryInfo
      wx.cloud.callFunction({
        name: 'updateRoom',
        data: {
          roomId,
          batteryInfo
        }
      }).then(
        res => {
        }
      ).catch(
        error => {
          if (error) {
            // todo
          }
        }
      )
    },
    checkRecord () {
      wx.navigateTo({url: '/pages/list/main'})
    }
  }
}
</script>

<style lang="scss" scoped>
$main: #4E4C4C;
$enough: #00BEA5;
$low: #ffc700;
$runout: #ffc700;

.container{
  display: flex;
  align-items: center;
  justify-content: center;
  .group-name{
    text-align: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .battery{
    .title{
      text-align: center;
      font-size: 14px;
      opacity: 0.5;
      margin-bottom: 5px;
    }
    .value{
      text-align: center;
      margin-bottom: 30px;
      font-size: 50px;
      .level{
        font-size: 50px;
        font-weight: bold;
      }
    }
    .img-zone{
      position: relative;
      width: 250px;
      font-size: 0;
      margin: 0 auto;
      .battery{
        position: relative;
        width: 250px;
        height: 118px;
        z-index: 2;
      }
      .battery-process{
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        transform: scaleX(0);
        bottom: 0;
        left: 0;
        transform-origin: left center;
        background-color: $low;
        transition: all 1s ease-out;
        &.low-battery{
          background-color: $low;
        }
        &.runout-battery{
          background-color: $runout
        }
        &.full-battery{
          background-color: $enough;
        }
      }
    }
    .charge{
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 55%;
      width: 50px;
      height: 70px;
      transform: translate(-50%, -50%);
    }
  }
  footer{
    text-align: center;
    display: flex;
    align-items: center;
    margin-top: 90px;
    div:first-child{
      margin-right: 30px;
    }
  }
}

</style>
