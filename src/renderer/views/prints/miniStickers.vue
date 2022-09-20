<template>
  <div class="content stickers">
    <div class="flex-row header">
      <div class="header-title">{{info.no}}</div>
      <span class="type">{{info.type}}</span>
      <span>{{info.order}}</span>
    </div>
    <span class="two-line">{{info.goodsName}}</span>
    <div class="single-line">{{info.characteristic}}</div>
    <div class="bottom-title">{{info.time}}</div>
  </div>
</template>

<script>
import "../../../../static/bills.css";
const ipc = require("electron").ipcRenderer;
/**
 * 贴纸样式
 */
export default {
  data(){
    return{
      info:{}
    }
  },
  methods: {
    print() {
      this.$nextTick(function () {
        ipc.send("printCore-prepare");
      });
    },
  },
  mounted() {
    let params = this.$route.params;
    let d = decodeURIComponent(params.params);
    this.info = JSON.parse(d);

    this.$nextTick(function () {
      ipc.send("printCore-prepare");
    });
  },
};
</script>

<style scoped>
.stickers {
  margin: 4px;
}

.header {
  align-items: baseline;
}
.header-title {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000;
  margin-right: 4px;
}
.bottom-title {
  margin-top: 4px;
  font-size: 10px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 800;
  color: #000;
}
.type {
  margin-right: 4px;
}
span {
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 200;
  color: #000;
  line-height: 16px;
}
.single-line{
  width: 100%;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 200;
  color: #000;
  height: 40px;
  white-space: pre-wrap;
  line-height: 2;
}
</style>