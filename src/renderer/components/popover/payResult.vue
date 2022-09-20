<template>
  <div class="container">
    <div class="box" v-if="result">
      <div class="top">
        <i class="el-icon-success success"></i>
      </div>
      <div class="bottom">支付成功</div>
    </div>
    <div class="box" v-if="!result">
      <div class="top">
        <i class="el-icon-error danger"></i>
      </div>
      <div class="bottom">支付失败</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["result"],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 300px;
  overflow: hidden;
}
.box {
  width: 100%;
  height: 100%;
}
.top {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    font-size: 80px;
  }
}

.bottom {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scanIpt {
  opacity: 0;
}
.success {
  color: #009e69;
}
.danger {
  color: #f06543;
}
</style>