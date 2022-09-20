<template>
  <div class="container" v-loading="loading">
    <div class="title">￥{{ _.round(submitValue.totalShowPrice - voucherTotal,2)>0? _.round(submitValue.totalShowPrice - voucherTotal,2):0 }}</div>
    <div class="box direction">
      <div>{{ openAccountInfo.name }}</div>
      <span
        ><i class="el-icon-mobile-phone"></i>{{ openAccountInfo.phone }}</span
      >
      <span
        ><i class="el-icon-office-building"></i
        >{{ openAccountInfo.companyName }}</span
      >
      <div class="justify">
        <div class="price">
          <span>可用挂账额度(元)</span>
          <div>￥{{ openAccountInfo.limitAmount }}</div>
        </div>
        <div class="price">
          <span>已用挂账额度(元)</span>
          <div>￥{{ openAccountInfo.usedAmount }}</div>
        </div>
      </div>
    </div>
    <el-button type="darkGreen" class="confirm" @click="confirmBtn"
      >确认挂账</el-button
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { payed } from "@/api";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["openAccountInfo", "submitValue", "checkPrintBill","voucherTotal"]),
  },
  methods: {
    confirmBtn() {
      this.loading = true;
      let payVal = Object.assign(this.submitValue, {
        payType: 3,
        creditUserId: this.openAccountInfo.creditUserId,
        creditType: this.openAccountInfo.creditType,
      });

      payed(payVal)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            // 支付完成弹窗关闭
            this.$store.commit("emptyOrder");
            this.$parent.handleClose();
            this.$emit("showResult", true);
            // 支付完成打印小票
            printCustomerTicket(res.data.customerId);
            if (
              res.data.stickerList != null &&
              res.data.stickerList.length > 0
            ) {
              for (let item of res.data.stickerList) {
                let d = JSON.stringify(item);
                let params = encodeURIComponent(d);
                printStickersTicket(params);
              }
            }

            // 判断是否打印结账单
            if (this.checkPrintBill) {
              printBill(res.data.accountId);
            }
          } else {
            this.$parent.handleClose();
            this.$emit("showResult", false);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  color: #4f424c;
}
.title {
  width: 100%;
  line-height: 2;
  font-size: 16px;
}
.box {
  background: #f5f5f5;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  border-radius: 4px;
}
.confirm {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}
.box {
  div {
    font-size: 14px;
    line-height: 2;
  }
  span {
    font-size: 12px;
    line-height: 2;
  }
}
.price {
  width: 50%;
}
::v-deep .el-loading-mask {
  border-radius: 15%;
}
</style>