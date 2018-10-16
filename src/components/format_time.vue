<template>
  <block>
    {{ formatTime }}
  </block>
</template>
<script>
  export default {
    props: ['time'],
    computed: {
      formatTime () {
        let _date = this.time
        let time = new Date().getTime()
        let s
        time = parseInt((time - _date) / 1000)
        if (time < 60 * 10) {
          return '刚刚'
        } else if ((time < 60 * 60) && (time >= 60 * 10)) {
          s = Math.floor(time / 60)
          return `${s}分钟前`
        } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
          s = Math.floor(time / 60 / 60)
          return `${s}小时前`
        } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
          s = Math.floor(time / 60 / 60 / 24)
          return `${s}天前`
        } else {
          let date = new Date(parseInt(_date))
          return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
        }
      }
    }
  }
</script>
