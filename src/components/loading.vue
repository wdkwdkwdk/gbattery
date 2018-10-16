<template>
  <div class="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>
<script>
export default {
}
</script>

<style lang="scss" scoped>
.loading{
  width: 150px;
  height: 8px;
  margin: 0 auto;
  text-align: center;
}
.loading span{
  display: inline-block;
  width: 8px;
  height: 100%;
  border-radius: 50%;
  background: #4a4a4a;
  animation: load 1.04s ease infinite;
  &:not(:last-child){
    margin-right: 10px;
  }
}
.loading span:last-child{
  margin-right: 0px; 
}
@keyframes load{
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
.loading span:nth-child(1){
  animation-delay:0.13s;
}
.loading span:nth-child(2){
  animation-delay:0.26s;
}
.loading span:nth-child(3){
  animation-delay:0.39s;
}
.loading span:nth-child(4){
  animation-delay:0.52s;
}
.loading span:nth-child(5){
  animation-delay:0.65s;
}
</style>

