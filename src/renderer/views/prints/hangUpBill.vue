<template>
  <div class="content">
    <span class="title center">挂帐还款凭证</span>
    <span class="center">{{ info.cafeName }}</span>
    <div class="line"></div>
    <span>交易流水：{{ info.tradeNum }}</span>
    <span>还款时间：{{ info.date }}</span>
    <span v-if="info.name">姓名：{{ info.name }}</span>
    <span v-if="info.companyName">企业名称：{{ info.companyName }}</span>
    <span>减免金额：{{ info.reduceAmount }}</span>
    <span>还款金额：{{ info.amount }}</span>
    <span>结账方式：{{ info.type }}</span>
    <span>剩余可挂账额度：{{ info.restAmount }}</span>
    <span>操作人：{{ info.dealUserName }}</span>
    <div class="line"></div>
  </div>
</template>

<script>
import "../../../../static/bills.css";

const ipc = require("electron").ipcRenderer;

export default {
  data() {
    return {
      info: "",
    };
  },
  methods: {
    print() {
      this.$nextTick(function () {
        ipc.send("printCore-prepare");
      });
    },
  },

  mounted() {
    this.info = JSON.parse(this.$route.params.data);
    this.print();
  },
};
</script>

<style scoped>
</style>