<template>
  <div class="play-item">
    <navigator target="miniProgram" open-type="navigate" :app-id="intro.appId" path="pages/index/main" hover-class="none">
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
    </navigator>
  </div>
</template>
<script>
export default {
  props: ['intro']
}
</script>