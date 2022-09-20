<template>
  <div class="content">
    <span class="title center">{{ pageInfo.title }}</span>
    <span class="center">{{ pageInfo.subTitle }}</span>
    <div class="line"></div>
    <span class="medium-title" v-if="pageInfo.orderRemark">订单备注：</span>
    <div class="remarkInfo" v-if="pageInfo.orderRemark">
      {{ pageInfo.orderRemark }}
    </div>
    <div class="line" v-if="pageInfo.orderRemark"></div>
    <span class="medium-title">流水号：{{ pageInfo.baseInfo.no }}</span>
    <span>结账时间：{{ pageInfo.baseInfo.payedTime }}</span>
    <span>单号：{{ pageInfo.baseInfo.orderNo }}</span>
    <div class="line"></div>
    <div class="item">
      <span class="td-left td-name">品项</span>
      <span class="td-right td-item">数量</span>
      <span class="td-right td-item">原价</span>
      <span class="td-right td-item">优惠价</span>
      <span class="td-right td-item">金额</span>
    </div>
    <!-- 收款统计 -->
    <div class="item" v-for="(item, index) in pageInfo.goodsList" :key="index">
      <span class="td-left td-name" style="white-space: pre-wrap">{{
        item.name
      }}</span>
      <span class="td-right td-item">{{ item.num }}</span>
      <span class="td-right td-item">{{ item.origPrice }}</span>
      <span class="td-right td-item">{{ item.price }}</span>
      <span class="td-right td-item">{{ item.amount }}</span>

      <div class="couponName">{{ item.couponName }}</div>
    </div>
    <div class="line"></div>
    <div class="flex-row space-between">
      <span>菜品原价</span>
      <span>{{ pageInfo.goodsPrice }}</span>
    </div>
    <div class="flex-row space-between">
      <span>订单原价</span>
      <span>{{ pageInfo.orderPrice }}</span>
    </div>
    <div class="line"></div>

    <div
      class="flex-column"
      v-if="pageInfo.discountList && pageInfo.discountList.length > 0"
    >
      <div
        class="flex-row space-between"
        v-for="(item, index) in pageInfo.discountList"
        :key="index"
      >
        <span>{{ item.name }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>

    <div class="flex-row space-between">
      <span class="big-title">应付金额</span>
      <span class="big-title">{{ pageInfo.payableAmount }}</span>
    </div>
    <div class="line"></div>

    <div class="flex-row space-between">
      <span>{{ pageInfo.payType }}</span>
      <span>{{ pageInfo.payedAmount }}</span>
    </div>
    <div class="flex-row space-between">
      <span class="big-title">支付合计</span>
      <span class="big-title">{{ pageInfo.payedAmount }}</span>
    </div>
    <div class="line"></div>
    <div class="flex-column" v-if="pageInfo.credit">
      <div class="flex-row space-between">
        <span class="big-title">挂账详情</span>
        <span></span>
      </div>
      <span>挂账金额：{{ pageInfo.credit.amount }}</span>
      <span>挂账类型：{{ pageInfo.credit.type }}</span>
      <span>挂账人：{{ pageInfo.credit.userName }}</span>
      <span>挂账企业：{{ pageInfo.credit.companyName }}</span>
      <span>备注：{{ pageInfo.credit.remark }}</span>
      <div class="big-title">签字：</div>
      <div class="line"></div>
    </div>
    <!-- bottomInfo -->
    <span>下单人：{{ pageInfo.bottomInfo.orderUser }}</span>
    <span>下单时间：{{ pageInfo.bottomInfo.orderTime }}</span>
    <span>打印人：{{ pageInfo.bottomInfo.printUser }}</span>
    <span>打印时间：{{ pageInfo.bottomInfo.printTime }}</span>

    <div class="line"></div>
    <div
      id="qrcode"
      ref="qrcode"
      class="qr top40"
      style="margin-bottom: 20px"
    ></div>
  </div>
</template>

<script>
import "../../../../static/bills.css";
import QRCode from "qrcodejs2";
const ipc = require("electron").ipcRenderer;
import { accountTicket, antiAccountTicket } from "@/api";

/**
 * 企业收款二维码（pos只是选项）
 *
 * 正常结账单（底需要增加取餐二维码，扫码用）
 */
export default {
  data() {
    return {
      pageInfo: {
        baseInfo: {
          no: "-",
          orderNo: "-",
          payedTime: "-",
        },
        bottomInfo: {
          orderTime: "-",
          orderUser: "-",
          printTime: "-",
          printUser: "-",
        },
        credit: null,
        discountList: [],
        goodsList: [],
        goodsPrice: "-",
        orderPrice: "-",
        payType: "-",
        payableAmount: "-",
        payedAmount: "-",
        qrCode: "",
        subTitle: "-",
        title: "-",
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
    if (params.type == 3) {
      // 判断是否是补打反结账小票
      antiAccountTicket(params.id, params.orderNo).then((res) => {
        this.pageInfo = res.data;
        if (this.pageInfo.qrCode && this.pageInfo.qrCode.length > 0) {
          // 设置要生成二维码的链接
          document.getElementById("qrcode").innerHTML = "";
          new QRCode("qrcode", {
            width: 170,
            height: 170,
            text: this.pageInfo.qrCode, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff",
          });
        }
        this.print();
      });
    } else {
      accountTicket(params.id, params.type)
        .then((res) => {
          console.log(res);
          this.pageInfo = res.data;
          if (this.pageInfo.qrCode && this.pageInfo.qrCode.length > 0) {
            // 设置要生成二维码的链接
            document.getElementById("qrcode").innerHTML = "";
            new QRCode("qrcode", {
              width: 170,
              height: 170,
              text: this.pageInfo.qrCode, // 二维码地址
              colorDark: "#000",
              colorLight: "#fff",
            });
          }
          this.print();
        })
        .catch((e) => {
          this.print();
        });
    }
  },
};
</script>

<style scoped>
</style>