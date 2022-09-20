<template>
  <div class="remarksContent" v-loading="loading">
    <div class="dialogTitle">请输入免单原因</div>
    <div class="reasonBox justify">
      <span
        v-for="(item, index) in fixedRemarks"
        :key="index"
        @click="checkRemark(index, item)"
        :class="remarksIndex == index ? 'active' : ''"
        >{{ item }}</span
      >
    </div>

    <el-input
      type="textarea"
      class="reason"
      v-model="remarks"
      @input="remarksChange"
      placeholder="自定义原因"
    ></el-input>

    <div class="justifyS action">
      <el-button class="cancel" @click="close">取消</el-button>
      <el-button type="darkGreen" @click="freeBtn">免单并结账</el-button>
    </div>
  </div>
</template>
<script>
import { getRemarks, payed } from "@/api";
import { mapGetters } from "vuex";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";
export default {
  props: ["dialogVal"],
  data() {
    return {
      remarks: "",
      remarksIndex: -1,
      fixedRemarks: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["submitValue", "checkPrintBill"]),
  },
  mounted() {
    getRemarks(4)
      .then((res) => {
        this.fixedRemarks = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 选择事件
    checkRemark(index, item) {
      this.remarksIndex = index;
      this.remarks = item;
    },
    // 关闭按钮
    close() {
      // 关闭弹窗
      // this.$parent.closePopover();
      this.$parent.handleClose();
    },
    // 备注input 修改
    remarksChange(e) {
      if (this.fixedRemarks[this.remarksIndex] != e) {
        this.remarksIndex = -1;
      }
    },
    // 确认免单
    freeBtn() {
      this.loading = true;
      console.log(this.submitValue);
      // 支付
      payed(
        Object.assign(this.submitValue, {
          free_remark: this.remarks,
          is_free: true,
          payType: 4,
        })
      )
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            // 支付完成弹窗关闭
            this.$store.commit("emptyOrder");
            this.$parent.handleClose();
            this.$emit("showResult", true);
            // 支付完成打印小票
            printCustomerTicket(res.data.customerId);
            if (res.data.stickerList != null && res.data.stickerList.length > 0) {
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
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.remarksContent {
  height: 100%;
  width: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
}

.dialogTitle {
  width: 100%;
  padding-bottom: 15px;
  color: #9f9f9f;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
}
.fixed-reason {
  color: #4f424c;
  font-size: 14px;
  margin: 20px 0;
}
.title {
  display: inline-block;
  font-size: 15px;
}
.reasonBox {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: 20px 0;
  span {
    display: inline-block;
    cursor: pointer;
    width: 31%;
    margin: 0 1%;
    background: #f5f5f5;
    color: #4f424c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.active {
  background: #009e69 !important;
  color: #fff !important;
}
.action {
  padding: 20px 0;
  .cancel {
    background: #f5f5f5;
    border-color: #e7e7e7;
  }
  button {
    width: 45%;
    height: 45px;
  }
}
</style>