<template>
  <div class="container" @click="clickHandle('test click', $event)">
    <div class="wrapper">
      <open-data type="groupName" :open-gid="gID"></open-data>
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
          <section class="battery-process" :class="lowBattery ? 'low-battery' : runoutBattery ? 'runout-battery' : ''" :style="batteryLifeStyle">
          </section>
          <img :src="chargeImg" alt="充电" class="charge" v-if="batteryInfo.isCharging">
        </section>
      </section>
      <footer>
        <button size="mini" open-type="share">
          与好友比拼电量
        </button>
      </footer>
    </div>
  </div>  
</template>

<script>
import batteryImg from '@/images/battery.png'
import chargeImg from '@/images/charge.svg'

export default {
  mounted () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getBatteryInfo()
    wx.cloud.callFunction({name: 'getOpenId'}).then(res => {
      console.log(res.result.openId, 'origin')
    })
  },
  onShow () {
    this.getBatteryInfo()
  },
  onShareAppMessage (share) {
    return {
      title: '来和我比拼一下电量吧！',
      path: '/pages/index/main'
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
      chargeImg
    }
  },
  computed: {
    batteryLifeStyle () {
      const rate = (this.batteryInfo.level / 100).toFixed(2)
      return `transform: scaleY(${rate})`
    },
    lowBattery () {
      return this.batteryInfo.level >= 10 && this.batteryInfo.level < 80
    },
    runoutBattery () {
      return this.batteryInfo.level < 10
    },
    gID () {
      return this.$store.state.gID
    }
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getBatteryInfo () {
      wx.getBatteryInfo({
        success: res => {
          this.batteryInfo.level = res.level
          this.batteryInfo.isCharging = res.isCharging
        }
      })
    },

    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  }
}
</script>

<style lang="scss" scoped>
$main: #4E4C4C;
$enough: #23ac38;
$low: #ffab00;
$runout: #ed684a;

.container{
  display: flex;
  align-items: center;
  justify-content: center;
  .battery{
    .title{
      text-align: center;
      font-size: 14px;
      opacity: 0.5;
      margin-bottom: 5px;
    }
    .value{
      text-align: center;
      margin-bottom: 40px;
      font-size: 50px;
      .level{
        font-size: 50px;
        font-weight: bold;
      }
    }
    .img-zone{
      position: relative;
      width: 101px;
      font-size: 0;
      margin: 0 auto;
      .battery{
        position: relative;
        width: 101px;
        height: 202px;
        z-index: 2;
      }
      .battery-process{
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        transform: scaleY(0);
        bottom: 0;
        left: 0;
        transform-origin: center bottom;
        background-color: $enough;
        transition: all 1s ease-out;
        &.low-battery{
          background-color: $low;
        }
        &.runout-battery{
          background-color: $runout
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
    margin-top: 40px;
    button{
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      padding: 0 20px;
      background-color: $main;
      color: #fff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      &:active{
        background-color: darken($main, 5%);
      }
      &::after{
        border: none;
      }
    }
  }
}

</style>
