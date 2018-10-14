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

export default {
  mounted () {
    this.getBatteryInfo()
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
    }
  },
  methods: {
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
          console.log(res, '???')
        }
      )
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
