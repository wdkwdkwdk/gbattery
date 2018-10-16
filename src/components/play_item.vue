<template>
  <div class="play-item" @click.stop="toMp">
    <section class="intro">
      <img :src="intro.icon" alt="icon">
      <section class="about">
        <p class="name">
          {{ intro.name }}
        </p>
        <p class="brief">
          {{ intro.brief }}
        </p>
      </section>
    </section>
    <section class="operate">
      <button class="primary" size="mini">
         尝试
      </button>
    </section>
  </div>
</template>
<script>
export default {
  props: ['intro'],
  methods: {
    toMp (id) {

    }
  }
}
</script>
<style lang="scss" scoped>
  .play-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
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
</style>
