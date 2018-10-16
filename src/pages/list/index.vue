<template>
  <scroll-view scroll-y class="container list">
    <div class="inner">
      <ul v-if="recordList.length">
        <li v-for="item in recordList" :key="item._id" @click.stop="checkDetail(item)">
          <section class="info">
            <p class="name">
              <span v-if="item.gId">
                <open-data type="groupName" :open-gid="item.gId"></open-data>     
              </span>
              <span v-else>
                好友
              </span>
            </p>
            <p class="count">
              {{ item.count }}人已参与
            </p>
          </section>
          <section class="time">
             最近更新于
            <formattime :time="item.updateTime">
            </formattime>
          </section>
        </li>
      </ul>
      <section class="empty" v-if="!recordList.length && !isLoading">
        <section>
          <img src="../../images/empty.svg" alt="空记录">
          <p>
            暂无参与或分享记录
          </p>
        </section>
      </section>
      <loading v-if="isLoading">
      </loading>
    </div>
  </scroll-view>
</template>
<script>
  import formattime from '@/components/format_time'
  import loading from '@/components/loading'
  export default {
    mounted () {
      this.getList()
    },
    data () {
      return {
        recordList: [],
        isLoading: false
      }
    },
    components: {
      formattime,
      loading
    },
    methods: {
      getList () {
        this.isLoading = true
        wx.cloud.callFunction({
          name: 'getRooms'
        }).then(
          res => {
            this.isLoading = false
            this.recordList = res.result
          }
        ).catch(
          error => {
            if (error) {
              this.isLoading = false
            }
          }
        )
      },
      checkDetail (item) {
        wx.navigateTo({url: `/pages/rank/main?id=${item.roomId}&gid=${item.gId}`})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .list{
    .inner{
      margin: 0 30px;
      .empty{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        section{
          img{
            width: 120px;
            height: 101px;
          }
          p{
            font-size: 12px;
            margin-top: 20px;
            opacity: 0.5;
            text-align: center;
          }
        }
      }
      ul{
        li{
          background-color: #fff;
          padding: 20px;
          &:not(:last-child){
            margin-bottom: 20px;
          }
          .info{
            display: flex;
            align-items: center;
            p{
              flex: 1;
              &.name{
                font-size: 20px;
              }
              &.count{
                text-align: right;
                font-size: 12px;
              }
            }
          }
          .time{
            font-size: 12px;
            opacity: 0.5;
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>
