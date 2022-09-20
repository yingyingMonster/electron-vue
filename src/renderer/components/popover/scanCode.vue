<template>
  <div class="container">
    <div class="box">
      <div v-loading="loading" class="loadingContent"></div>
      <el-input
        class="scanIpt"
        v-model="code"
        type="password"
        ref="code"
        @blur="changeFocus"
        @change="scanCode"
        :disabled="canUse"
      ></el-input>
      <div class="bottom">扫码支付中</div>
    </div>
  </div>
</template>
<script>
import { sanCodeSubmit } from "@/api";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
export default {
  props: ["orderCode"],
  data() {
    return {
      loading: true,
      code: "",
      canUse:false
    };
  },
  mounted() {
    this.$refs.code.$el.querySelector("input").focus();
  },
  methods: {
    scanCode(e) {
      this.canUse=true;
      console.log(e, "扫码支付");
      sanCodeSubmit({ authCode: e, orderNo: this.orderCode })
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.code == 200) {
            // 关闭弹窗
            this.$store.commit("emptyOrder");
            this.$parent.handleClose();
            this.$emit("showResult", true);
            // 支付完成打印小票
            printCustomerTicket(res.data.customerId);
            printBill(res.data.accountId);
            if (res.data.stickerList != null && res.data.stickerList.length > 0) {
              for (let item of res.data.stickerList) {
                let d = JSON.stringify(item);
                let params = encodeURIComponent(d);
                printStickersTicket(params);
              }
            }
          } else {
            this.$parent.handleClose();
            this.$emit("showResult", false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$parent.handleClose();
          this.$emit("showResult", false);
          this.loading = false;
        });
    },
    // 焦点回归
    changeFocus() {
      this.$refs.code.$el.querySelector("input").focus();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 300px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: hidden;
}
.box {
  height: 100%;
}
.loadingContent {
  width: 100%;
  height: 50%;
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
  width: 1px;
  height: 1px;
  ime-mode: disabled;
}
</style>