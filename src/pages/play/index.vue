<template>
  <scroll-view scroll-y class="container play">
    <ul>
      <li>
        <div class="play-item">
          <navigator target="miniProgram" open-type="navigate" app-id="wx60b3a1e9f748925f" path="pages/viewmars/viewmars" hover-class="none">
            <section class="intro">
              <img src="https://report.niucodata.com/FucOJLLwQSop0EItiR5AuBJtBzWY.svg" alt="icon">
              
              <section class="about">
                <p class="name">
                  看看火星
                </p>
                <p class="brief">
                  获取最新的好奇号在火星的照片。
                </p>
              </section>
            </section>
            <section class="operate">
              <button class="primary" size="mini">
                 尝试
              </button>
            </section>
          </navigator>
        </div>
      </li>
      <li v-for="item in items" :key="item.nmae">
        <playitem :intro="item">
        </playitem>
      </li>
    </ul>
  </scroll-view>
</template>
<script>
import playitem from '@/components/play_item.vue'
export default {
  data () {
    return {
      items: [
        {
          icon: 'http://ojrbqzf6q.qnssl.com/FhfKQ8JIT1GJg0iHCroh8wwMhUHD.png',
          name: '决定决定机',
          brief: '一台帮你作决定的神秘机器。',
          appId: 'wx7cea2706dbd472a7'
        },
        {
          icon: 'http://ojrbqzf6q.qnssl.com/FqqczGP9y3Gvn0RO6C1-7KFZZaOc.png',
          name: '小见证',
          brief: '好友见证，生活中的承诺更当真。',
          appId: 'wxdff769880f712e72'
        },
        {
          icon: 'http://ojrbqzf6q.qnssl.com/FpcdfAtmWmqkukkGDmdwaOe7lo0v.png',
          name: '芥子专注',
          brief: '放下手机，专心做你想做的事情。',
          appId: 'wxbacc44917271c609'
        }
      ]
    }
  },
  components: {
    playitem
  }
}
</script>
<style lang="scss">
  .play{
    ul{
      margin: 0 30px;
      li{
        padding-bottom: 20px;
        margin-bottom: 20px;
        position: relative;
        &:not(:last-child){
          &::after{
            content: "";
            position: absolute;
            width: 100%;
            height: 1px;
            left: 0;
            bottom: 0;
            transform: scaleY(0.5);
            background-color: #9b9b9b;
            opacity: 0.1;
          }
        }
        .play-item{
          navigator{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .intro{
            display: flex;
            align-items: center;
            img{
              width: 60px;
              height: 60px;
              border-radius: 3px;
              margin-right: 12px;
            }
            .name{
              font-size: 20px;
            }
            .brief{
              font-size: 12px;
              margin-top: 6px;
              opacity: 0.6;
            }
          }
          .operate{
            button{
              padding: 0 15px;
              height: 32px;
              line-height: 30px;
              border-radius: 16px;
            }
          }
        }
      }
    }
  }
</style>

