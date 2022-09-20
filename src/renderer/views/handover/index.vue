<template>
  <div class="content">
    <div class="c">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.c {
  background: white;
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.content {
  padding: 15px;
  width: 100%;
  height: calc(100vh - 62px);
  background: url("@/assets/homeBg.png");
  background-size: 100% 100%;
  color: #4f424c;
  display: flex;
  align-items: center;
  justify-items: center;
}
</style>