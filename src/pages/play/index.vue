<template>
  <div class="play">
    <ul>
      <li v-for="item in items" :key="item.nmae">
        <playitem :intro="item">
        </playitem>
      </li>
    </ul>
  </div>
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
          brief: '一台帮你作决定的神秘机器。'
        },
        {
          icon: 'http://ojrbqzf6q.qnssl.com/FqqczGP9y3Gvn0RO6C1-7KFZZaOc.png',
          name: '小见证',
          brief: '好友见证，生活中的承诺更当真。'
        },
        {
          icon: 'http://ojrbqzf6q.qnssl.com/FhfKQ8JIT1GJg0iHCroh8wwMhUHD.png',
          name: '芥子专注',
          brief: '放下手机，专心做你想做的事情。'
        },
        {
          icon: 'https://report.niucodata.com/FucOJLLwQSop0EItiR5AuBJtBzWY.svg',
          name: '看看火星',
          brief: '获取最新的好奇号在火星的照片。'
        }
      ]
    }
  },
  components: {
    playitem
  }
}
</script>
<style lang="scss" scoped>
  .play{
    padding: 25px;
    ul{
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
      }
    }
  }
</style>

