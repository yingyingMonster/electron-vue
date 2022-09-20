<template>
  <div class="content">
    <div class="title">{{ info.title }}</div>
    <div class="title">{{ info.subTitle }}</div>
    <span>门店名称：{{ info.baseInfo.shopName }}</span>
    <span>交班单号：{{ info.baseInfo.shiftNo }}</span>
    <span>开班时间：{{ info.baseInfo.openTime }}</span>
    <span>交班时间：{{ info.baseInfo.endTime }}</span>
    <span>统计范围：{{ info.baseInfo.rangeTime }}</span>
    <span>交班班次：{{ info.baseInfo.shiftName }}</span>
    <span>交班人：{{ info.baseInfo.shiftUser }}</span>
    <span>交班模式：{{ info.baseInfo.shiftModal }}</span>
    <div class="line"></div>
    <span class="center">交班汇总</span>
    <!-- 交班汇总 -->
    <div
      class="item"
      v-for="(item, index) in info.shiftSummary"
      :key="index + 1"
    >
      <span>{{ item.name }}</span>
      <span>{{ item.value }}</span>
    </div>
    <!-- 交班汇总 -->
    <div class="line"></div>
    <span class="center">收款统计</span>
    <div class="item">
      <span class="td-left">收款业务</span>
      <span class="td-right">收款笔数</span>
      <span class="td-right">收款金额</span>
    </div>
    <!-- 收款统计 -->
    <div
      class="item"
      v-for="(item, index) in info.payedTotal"
      :key="(index + 1) * 10"
    >
      <span class="td-left">{{ item.name }}</span>
      <span class="td-right">{{ item.num }}</span>
      <span class="td-right">{{ item.value }}</span>
    </div>
    <!-- 收款统计 -->
    <div class="line"></div>
    <span class="center">收款构成</span>
    <div class="item">
      <span class="td-left td-w">收款方式</span>
      <span class="td-right td-w2">收款笔数</span>
      <span class="td-right td-w2">收款金额</span>
    </div>
    <!-- 收款构成 -->
    <div
      class="item"
      v-for="(item, index) in info.payedCompose"
      :key="(index + 1) * 100"
    >
      <span
        class="td-left td-w"
        :style="'margin-left:' + item.level * 10 + 'px'"
        >{{ item.name }}</span
      >
      <span class="td-right td-w2">{{ item.num }}</span>
      <span class="td-right td-w2">{{ item.value }}</span>
    </div>

    <div class="line"></div>

    <!-- 收款构成 -->
    <span class="center">收款构成-营业收入</span>
    <div class="item">
      <span class="td-left td-w">收款方式</span>
      <span class="td-right td-w2">收款笔数</span>
      <span class="td-right td-w2">收款金额</span>
    </div>

    <!-- 收款构成-营业收入 -->
    <div
      class="item"
      v-for="(item, index) in info.payedComposeYy"
      :key="(index + 1) * 1000"
    >
      <span
        class="td-left td-w"
        :style="'margin-left:' + item.level * 10 + 'px'"
        >{{ item.name }}</span
      >
      <span class="td-right td-w2">{{ item.num }}</span>
      <span class="td-right td-w2">{{ item.value }}</span>
    </div>
    <!-- 收款构成-营业收入 -->
    <div class="line"></div>
    <span class="center">挂账统计</span>

    <!-- 挂账统计 -->
    <div
      class="item"
      v-for="(item, index) in info.creditTotal"
      :key="(index + 1) * 10000"
    >
      <span>{{ item.name }}</span>
      <span>{{ item.value }}</span>
    </div>
    <!-- 挂账统计 -->
    <div class="line"></div>
    <span class="center">优惠统计</span>
    <div class="item">
      <span class="td-left td-w">优惠方式</span>
      <span class="td-right td-w2">单数(张数)</span>
      <span class="td-right td-w2">优惠金额</span>
    </div>
    <!-- 优惠统计 -->
    <div
      class="item"
      v-for="(item, index) in info.discountTotal"
      :key="(index + 1) * 100000"
    >
      <span
        class="td-left td-w"
        :style="'margin-left:' + item.level * 10 + 'px'"
        >{{ item.name }}</span
      >
      <span class="td-right td-w2">{{ item.num }}</span>
      <span class="td-right td-w2">{{ item.value }}</span>
    </div>
    <!-- 优惠统计 -->
    <div class="line"></div>

    <span class="center">订单统计</span>
    <!-- 订单统计 -->
    <div
      class="item"
      v-for="(item, index) in info.orderTotal"
      :key="(index + 1) * 1000000"
    >
      <span>{{ item.name }}</span>
      <span>{{ item.value }}</span>
    </div>
    <!-- 订单统计 -->
    <div class="line"></div>
    <div class="s">
      <span>交班人签字</span>
      <div class="line2"></div>
    </div>
    <div class="line2 top"></div>
    <!-- <div class="line2 top"></div> -->
  </div>
</template>

<script>
import "../../../../static/bills.css";
const ipc = require("electron").ipcRenderer;
import { handoverTicket } from "@/api";
/**
 * 交班单
 */
export default {
  data() {
    return {
      info: {
        title: "-",
        subTitle: "-",
        baseInfo: {
          endTime: "-",
          openTime: "-",
          rangeTime: "-",
          shiftModal: "-",
          shiftName: "-",
          shiftNo: "-",
          shiftUser: "-",
          shopName: "-",
        },
        creditTotal: [],
        discountTotal: [],
        orderTotal: [],
        payedCompose: [],
        payedComposeYy: [],
        payedTotal: [],
        shiftSummary: [],
      },
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
    let params = this.$route.params;
    handoverTicket(params.id)
      .then((res) => {
        if (res.code == 200) {
          this.info = res.data;
        }
        this.print();
      })
      .catch((e) => {
        this.print();
      });
  },
};
</script>

<style>
</style>