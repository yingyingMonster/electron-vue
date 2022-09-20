<template>
  <div class="content justify" v-loading="loading">
    <div class="payment-way">
      <div class="title">更多支付</div>
      <div class="fixed-reason">
        <span class="discount">选择优惠</span>

        <div class="reasonBox justify">
          <el-badge
            v-for="(item, index) in disMethod"
            class="couponItem"
            :key="index"
            :value="index == 2 ? voucherAllCount : 0"
            :hidden="index != 2 || voucherAllCount == 0"
          >
            <span
              @click="discountMethod(index)"
              :class="checkedDiscount == index ? 'active' : ''"
              >{{ item.method }}</span
            >
          </el-badge>
        </div>
      </div>
      <div class="paymentMethod">
        <span>选择支付方式</span>
        <div class="paymentBtn">
          <el-button
            v-for="(item, index) in payment"
            :key="index"
            :type="item.btnColor"
            @click="selectMethod(item.name)"
          >
            <img src="@/assets/active.png" alt="" v-if="isShow == item.name" />
            {{ item.method }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="payment-detail">
      <div class="detailTitle justifyS">
        <span>账单明细</span>
        <i class="el-icon-close" @click="goBack"></i>
      </div>

      <div class="bill">
        <div class="originalPrice justifyS">
          <span>菜品原价</span>
          <span>￥{{ originalPrice }}</span>
        </div>
        <div class="receivable justifyS">
          <span>应收</span>
          <span
            >￥{{
              _.round(submitValue.totalShowPrice - voucherTotal, 2) > 0
                ? _.round(submitValue.totalShowPrice - voucherTotal, 2)
                : 0
            }}</span
          >
        </div>
      </div>

      <div class="checkoutBill direction">
        <el-checkbox v-model="bill" @change="checkPrint"
          >打印结账单</el-checkbox
        >
        <el-button type="darkGreen" @click="payBtn">{{ btnContent }}</el-button>
      </div>
    </div>
    <!-- 免单确认 -->
    <el-dialog
      title="免单确认"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <FreeOrder @showResult="showResult"></FreeOrder>
    </el-dialog>
    <!-- 使用优惠券 -->
    <el-dialog
      title="使用现金券"
      v-if="couponVisible"
      :visible.sync="couponVisible"
      :close-on-click-modal="false"
      width="500px"
      :before-close="handleClose"
    >
      <Coupon @confirmUseCoupon="confirmUseCoupon"></Coupon>
    </el-dialog>
    <!-- 挂账弹窗 -->
    <el-dialog
      title="挂账支付"
      v-if="openAccountVisible"
      :visible.sync="openAccountVisible"
      width="400px"
      :before-close="handleClose"
    >
      <!-- 挂账 -->
      <OpenAccount @confirmOpenAccount="confirmOpenAccount"></OpenAccount>
    </el-dialog>
    <!-- 挂账弹窗 -->
    <el-dialog
      title="确认挂账"
      v-if="confirmVisible"
      :visible.sync="confirmVisible"
      width="400px"
      :before-close="handleClose"
    >
      <!-- 确认挂账 -->
      <ConfirmOpenAccount @showResult="showResult"></ConfirmOpenAccount>
    </el-dialog>

    <!-- 扫码支付 -->
    <el-dialog
      title=""
      v-if="scanCodeVisible"
      :visible.sync="scanCodeVisible"
      width="330px"
      :before-close="handleClose"
    >
      <ScanCode :orderCode="orderCode" @showResult="showResult"></ScanCode>
    </el-dialog>

    <!-- 支付结果弹窗 -->
    <el-dialog
      title=""
      v-if="resultVisible"
      :visible.sync="resultVisible"
      width="330px"
      :before-close="payResultClose"
    >
      <PayResult :result="result"></PayResult>
    </el-dialog>
  </div>
</template>
<script>
import Utils from "@/utils/util.js";
import FreeOrder from "@/components/popover/freeOrder";
import OpenAccount from "@/components/popover/openAccount";
import ConfirmOpenAccount from "@/components/popover/confirmOpenAccount";
import ScanCode from "@/components/popover/scanCode";
import PayResult from "@/components/popover/payResult";
import Coupon from "@/components/popover/coupon";
import {
  printCustomerTicket,
  printStickersTicket,
  printBill,
} from "@/utils/PrintCore";

import { mapGetters } from "vuex";
import { payed, waitOrderSubmit, checkOrder } from "@/api";
export default {
  data() {
    return {
      // 支付方式
      payment: [
        { method: "现金支付", name: "cash", btnColor: "cash" },
        { method: "扫码支付", name: "scanCode", btnColor: "darkGreen" },
        { method: "POS机刷卡", name: "pos", btnColor: "pos" },
        { method: "挂账消费", name: "openAccount", btnColor: "brown" },
      ],
      // 优惠方式
      disMethod: [
        {
          method: "整单打折",
        },
        {
          method: "免单",
        },
        {
          method: "现金券",
        },
      ],
      // 选中支付方式
      isShow: this.$route.query.name,
      // 选中折扣方式
      checkedDiscount: -1,
      bill: true,
      // 弹出窗
      dialogVisible: false,
      // 优惠券弹窗
      couponVisible: false,
      // 支付按钮
      btnContent: "付款完成，确认结账",
      // 挂账免单
      openAccountVisible: false,
      // 同意挂账
      confirmVisible: false,
      // 扫码支付
      scanCodeVisible: false,
      // 支付结果
      resultVisible: false,
      result: "",
      // 订单号
      orderCode: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters([
      "orderedMeal",
      "submitValue",
      "originalPrice",
      "voucherTotal",
      "voucherAllCount",
    ]),
  },
  components: {
    FreeOrder,
    OpenAccount,
    ConfirmOpenAccount,
    ScanCode,
    PayResult,
    Coupon,
  },
 
  mounted() {
    // 判断是否是扫码支付
    if (this.$route.query.name == "scanCode") {
      this.btnContent = "出示付款码扫码支付";
    }
  },
  methods: {
    // 选择支付方式
    selectMethod(data) {
      switch (data) {
        case "cash":
          this.btnContent = "付款完成，确认结账";
          break;
        case "scanCode":
          this.btnContent = "出示付款码扫码支付";
          break;
        case "pos":
          this.btnContent = "付款完成，确认结账";
          break;
        case "openAccount":
          this.btnContent = `还差￥${
            this._.round(
              this.submitValue.totalShowPrice - this.voucherTotal,
              2
            ) > 0
              ? this._.round(
                  this.submitValue.totalShowPrice - this.voucherTotal,
                  2
                )
              : 0
          }`;
          this.openAccountVisible = true;
          break;
      }
      this.isShow = data;
    },
    //  关闭按钮
    goBack() {
      this.$router.push({ path: "/orderedMeal" });
    },

    // 选择优惠方式
    discountMethod(index) {
      this.checkedDiscount = index;
      switch (index) {
        case 0:
          this.discountAll();
          break;
        case 1:
          this.free();
          break;
        case 2:
          this.useCoupon();
          break;
      }
    },
    // 整单折扣
    discountAll() {
      // 调用整单折扣
      Utils.$emit("discountAll");
    },
    // 免单
    free() {
      const discountList = this.orderedMeal.filter((item) => {
        return item.discountValue != 1;
      });
      // 有订单折扣
      if (discountList.length > 0 || this.voucherTotal > 0) {
        this.$alert(
          `<div><p style="font-size: 14px;color: #4f424c;">免单后将导致以现金券、折扣失效，是否继续？</p><span style="font-size: 13px;color: #e4393c;">订单折扣、现金券失效</span></div>`,
          "优惠冲突提示",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "免单结账",
            cancelButtonText: "取消",
            center: true,
            cancelButtonClass: "cancel",
            confirmButtonClass: "confirm",
            showCancelButton: true,
            callback: (action) => {
              if (action == "confirm") {
                this.$store.commit("delVoucher");
                this.$store.commit("setVoucherName", "");
                // 展示弹窗
                this.dialogVisible = true;
              }
            },
          }
        );
      } else {
        // 展示弹窗
        this.dialogVisible = true;
      }
    },
    // 使用优惠券
    useCoupon() {
      this.couponVisible = true;
    },
    confirmUseCoupon() {},
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.openAccountVisible = false;
      this.confirmVisible = false;
      this.scanCodeVisible = false;
      this.couponVisible = false;
    },
    // 关闭支付结果弹窗
    payResultClose() {
      this.resultVisible = false;
      this.$router.push("/orderedMeal");
    },
    // 支付按钮
    async payBtn() {
      switch (this.isShow) {
        case "cash":
          this.loading = true;
          console.log(this.submitValue);
          payed(Object.assign(this.submitValue, { payType: 1 }))
            .then((res) => {
              this.loading = false;
              if (res.code == 200) {
                // 支付完成关闭弹窗
                this.$store.commit("emptyOrder");
                this.handleClose();
                this.resultVisible = true;
                this.result = true;
                // // 支付完成打印小票
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
                if (this.bill) {
                  printBill(res.data.accountId);
                }
              } else {
                this.handleClose();
                this.resultVisible = true;
                this.result = false;
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
          break;
        case "scanCode":
          this.loading = true;
          const order = await this.getOrder();
          this.sanOrder(order);
          break;
        case "pos":
          this.loading = true;
          payed(Object.assign(this.submitValue, { payType: 2 }))
            .then((res) => {
              this.loading = false;
              if (res.code == 200) {
                // 支付完成弹窗关闭
                this.$store.commit("emptyOrder");
                this.handleClose();
                this.resultVisible = true;
                this.result = true;
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
                if (this.bill) {
                  printBill(res.data.accountId);
                }
              } else {
                this.handleClose();
                this.resultVisible = true;
                this.result = false;
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
          break;
        case "openAccount":
          this.btnContent = `还差￥${this.submitValue.totalShowPrice}`;
          break;
      }
    },
    // 提交挂账弹窗
    confirmOpenAccount() {
      this.handleClose();
      this.confirmVisible = true;
    },
    // 展示支付结果
    showResult(data) {
      console.log(data);
      this.resultVisible = true;
      this.result = data;
    },
    // 是否打印结账单
    checkPrint(e) {
      console.log(e);
      this.bill = e;
      this.$store.commit("setPrint", e);
    },
    // 扫码提交订单
    getOrder() {
      return new Promise((resolve) => {
        waitOrderSubmit(this.submitValue)
          .then((res) => {
            if (res.code == 200) {
              this.orderCode=res.data;
              resolve(res.data);
            } else {
              this.loading = false;
              this.$notify({
                title: "警告",
                message: "商品库存不足",
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      });
    },
    // 扫码检查订单
    sanOrder(data) {
      checkOrder(data)
        .then((result) => {
          console.log(result,'检测订单号')
          this.loading = false;
          if (result.data == false) {
            this.scanCodeVisible = true;
          } else {
            this.$notify({
              title: "警告",
              message: "该订单已支付",
              type: "warning",
            });
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
<style lang="scss">
.confirm {
  background: #009e69 !important;
  color: #fff !important;
  width: 160px;
  height: 45px;
  border-radius: 6px;
}
.cancel {
  background: #e7e7e7;
  width: 160px;
  height: 45px;
  border-radius: 6px;
  &:hover {
    background: #e7e7e7;
    border: 1px solid #f5f5f5;
  }
}
</style>
<style lang="scss" scoped>
.content {
  width: calc(100% - 20px);
  height: calc(100vh - 82px);
  border-radius: 15px;
  background: #fff;
  margin: 10px;
  color: #4f424c;
}
.payment-way {
  width: 25%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  border-right: 1px solid #f7f7ff;
}
.payment-detail {
  width: 75%;
}
.title {
  width: 100%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
}
.fixed-reason {
  font-size: 14px;
}
.discount {
  display: inline-block;
  font-size: 15px;
}
.reasonBox {
  margin: 10px 0;
  span {
    cursor: pointer;
    display: inline-block;
    background: #f5f5f5;
    border-radius: 10px;
    font-size: 12px;
    text-align: center;
    width: 80px;
    height: 35px;
    line-height: 35px;
  }
}
.couponItem {
  margin-right: 10px;
}
.paymentMethod {
  width: 100%;
  margin: 20px 0;
  span {
    display: inline-block;
    font-size: 15px;
    margin: 10px 0;
  }
  button {
    margin: 10px 5px;
  }
}
.payment-detail {
  width: 75%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
}
.detailTitle {
  width: 100%;
  height: 60px;
  line-height: 60px;
  i {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    cursor: pointer;
  }
}
.bill {
  width: 100%;
}
.originalPrice {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f7f7ff;
  span {
    font-size: 14px;
  }
}
.receivable {
  width: 100%;
  height: 40px;
  line-height: 40px;
  span {
    font-size: 14px;
  }
}
.paymentBtn {
  button {
    position: relative;
    border: none;
    border-radius: 10px;
    height: 45px;
    overflow: hidden;
    img {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
.checkoutBill {
  width: calc(100% - 40px);
  position: absolute;
  bottom: 10px;
  button {
    margin: 10px 0;
  }
}
.active {
  background: #009e69 !important;
  color: #fff;
}
</style>