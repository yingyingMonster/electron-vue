<template>
  <div class="content">
    <span class="title center">挂账单</span>
    <span class="center">上水咖啡</span>
    <div class="line"></div>
    <span class="medium-title">流水号：0012</span>
    <span>结账时间：2021-08-02 14:54:33</span>
    <span>单号：2020202921388475</span>
    <div class="line"></div>
    <div class="item">
      <span class="td-left td-w">品项</span>
      <span class="td-right td-w2">数量</span>
      <span class="td-right td-w2">原价</span>
      <span class="td-right td-w2">优惠价</span>
    </div>
    <!-- 收款统计 -->
    <div class="item">
      <span class="td-left td-w">云南挂耳咖啡（10包）</span>
      <span class="td-right td-w2">62份</span>
      <span class="td-right td-w2">702.00</span>
      <span class="td-right td-w2">702.0099</span>
    </div>
    <div class="line"></div>
    <div class="flex-row space-between">
      <span>菜品原价</span>
      <span>280.00</span>
    </div>
    <div class="flex-row space-between">
      <span>菜品原价</span>
      <span>280.00</span>
    </div>
    <div class="line"></div>
    <div class="flex-row space-between">
      <span>菜品手动七折</span>
      <span>-90</span>
    </div>
    <div class="flex-row space-between">
      <span class="big-title">应付金额</span>
      <span class="big-title">156.6</span>
    </div>
    <div class="line"></div>

    <div class="flex-row space-between">
      <span>挂账消费</span>
      <span>156.6</span>
    </div>
    <div class="flex-row space-between">
      <span class="big-title">支付合计</span>
      <span class="big-title">156.6</span>
    </div>
    <div class="line"></div>

    <div class="flex-row space-between">
      <span class="big-title">挂账详情</span>
      <span></span>
    </div>
    <span>挂账金额：152.8</span>
    <span>挂账类型：企业</span>
    <span>挂账人：安超</span>
    <span>挂账企业：日照中心销售</span>
    <div class="big-title">签字：</div>
    <div class="line"></div>
  </div>
</template>

<script>
import "../../../../static/bills.css";
const ipc = require("electron").ipcRenderer;
/**
 * 挂帐单/挂账打折单
 */
export default {
  mounted() {
    this.$nextTick(function () {
      ipc.send("printCore-prepare");
    });
  },
};
</script>

<style scoped>
.td-w {
  flex-grow: 1;
  width: 120px;
}

.td-w2 {
  flex-shrink: 0;
  width: 40px;
}
</style>