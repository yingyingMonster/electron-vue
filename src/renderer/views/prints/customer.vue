<template>
  <div class="content">
    <div class="flex-row space-between">
      <span>{{ shopName }}</span>
      <span>{{ shopPhone }}</span>
    </div>
    <div
      class="title"
      style="font-size: 42px; font-weight: 600; margin-top: 20px"
    >
      {{ no }}
    </div>
    <span class="center">自提</span>
    <div class="line top40"></div>
    <div class="flex-row">
      <span class="customer-item-left">份数</span>
      <span>商品名称</span>
    </div>
    <div class="flex-row" v-for="(item, index) in list" :key="index">
      <span class="customer-item-left">{{ item.num }}</span>
      <span style="white-space: pre-wrap">{{ item.name }}</span>
    </div>
    <div class="line top40" v-if="customer"></div>
    <div class="flex-row" v-if="customer">
      <span>客户：{{ customer.customerName }}</span>
      <span style="margin-left: 20px">手机尾号：{{ customer.phoneTail }}</span>
    </div>
    <div class="line top40"></div>
    <img
      src="@/assets/wx_qr.png"
      alt=""
      id="qrcode"
      ref="qrcode"
      class="qr top40"
    />
    <span class="center">{{ qrInfo }}</span>
    <div class="line top40"></div>
    <span class="center top40" style="margin-bottom: 40px">{{
      bottomTip
    }}</span>
  </div>
</template>

<script>
import "../../../../static/bills.css";
const ipc = require("electron").ipcRenderer;
import { customerTicket } from "@/api";
/**
 * 给顾客的小票
 */
export default {
  data() {
    return {
      list: [],
      customer: {},
      no: "-",
      shopName: "-",
      shopPhone: "-",
      qrInfo: "-",
      bottomTip: "-",
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
    console.log("params=====", params);
    customerTicket(params.id)
      .then((res) => {
        console.log(res);
        if (res.data!=null) {
          this.list = res.data.list;
          this.shopPhone = res.data.shopPhone;
          this.shopName = res.data.shopName;
          this.no = res.data.no;
          this.customer = res.data.customer;
          this.bottomTip = res.data.bottomTip;
          this.qrInfo = res.data.qrInfo;
          this.print();
        }
      })
      .catch((e) => {
        console.log(e);
        this.print();
      });
  },
};
</script>

<style scoped>
.customer-item-left {
  width: 50px;
}
.top40 {
  margin-top: 40px;
}
</style>