<template>
  <div v-loading="loading">
    <div class="wrapper">
      <div class="item">
        <span class="item-tip">本班次收款(元)</span>
        <span class="item-content">{{ handoverDetail.totalAmount }}</span>
      </div>

      <div class="item">
        <span class="item-tip">现金收款(元)</span>
        <span class="item-content">{{ handoverDetail.cashAmount }}</span>
      </div>

      <div class="item">
        <span class="item-tip">备用金(元)</span>
        <el-input
          v-if="type === 'handover'"
          v-model="handoverDetail.reserveAmount"
          maxlength="11"
        />
        <span class="item-content" v-else>{{
          handoverDetail.reserveAmount
        }}</span>
      </div>

      <div class="item">
        <span class="item-tip">上交现金(元)</span>
        <!-- <span class="item-content" v-if="type === 'handover'">{{
          Number(handoverDetail.reserveAmount) +
          Number(handoverDetail.cashAmount)
        }}</span> -->
        <span class="item-content">{{ handoverDetail.handInCashAmount }}</span>
      </div>
    </div>
    <el-divider class="border"></el-divider>
    <div class="action">
      <div class="action-top">
        <span class="self-tip">本班次收款统计</span>
        <span class="self-tip">共{{ handoverDetail.orderNum }}笔</span>
        <span class="all-price">¥ {{ handoverDetail.totalAmount }}</span>
      </div>
      <!-- 收款详情 -->
      <el-table
        style="margin-top: 20px"
        :max-height="350"
        :summary-method="getSummaries"
        show-summary
        :cell-style="cellStyleAction"
        :data="handoverDetail.tableDataList"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          prop="name"
          label="收款方式"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="收款笔数"
          width="180"
          align="center"
          prop="nums"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.nums }}笔</span>
          </template>
        </el-table-column>
        <el-table-column label="营业收入" align="center" prop="totalAmount">
          <template slot-scope="scope">
            <span>￥{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营业收款" align="center" prop="moneyAmount">
          <template slot-scope="scope">
            <span>￥{{ scope.row.moneyAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现金券金额" align="center" prop="voucherAmount">
          <template slot-scope="scope">
            <span>￥{{ scope.row.voucherAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂账还款" align="center" prop="creditAmount">
          <template slot-scope="scope">
            <span>￥{{ scope.row.creditAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 挂账统计 订单统计 优惠统计 -->
      <div class="bottom">
        <div
          class="menu"
          v-if="
            handoverDetail.bottomData.creditItemList &&
            handoverDetail.bottomData.creditItemList.length > 0
          "
        >
          <div class="menu-header">
            <div class="menu-icon"></div>
            <span class="menu-title">挂账统计</span>
          </div>

          <div class="menu-content">
            <div
              class="menu-content-item"
              v-for="(item, index) in handoverDetail.bottomData.creditItemList"
              :key="index"
            >
              <span class="menu-content-left">{{ item.name }}</span>
              <span class="menu-content-right">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div
          class="menu"
          v-if="
            handoverDetail.bottomData.coffeeOrderItemList &&
            handoverDetail.bottomData.coffeeOrderItemList.length > 0
          "
        >
          <div class="menu-header">
            <div class="menu-icon"></div>
            <span class="menu-title">订单统计</span>
          </div>

          <div class="menu-content">
            <div
              class="menu-content-item"
              v-for="(item, index) in handoverDetail.bottomData
                .coffeeOrderItemList"
              :key="index"
            >
              <span class="menu-content-left">{{ item.name }}</span>
              <span class="menu-content-right">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div
          class="menu"
          v-if="
            handoverDetail.bottomData.discountItemList &&
            handoverDetail.bottomData.discountItemList.length > 0
          "
        >
          <div class="menu-header">
            <div class="menu-icon"></div>
            <span class="menu-title">优惠统计</span>
          </div>

          <div class="menu-content">
            <div
              class="menu-content-item"
              v-for="(item, index) in handoverDetail.bottomData
                .discountItemList"
              :key="index"
            >
              <span class="menu-content-left">{{ item.name }}</span>
              <div class="menu-content-wrapper">
                <span>{{ item.amount }}</span>
                <span class="menu-content-right">￥{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-action">
        <el-button
          type="primary"
          class="btn2"
          v-if="type === 'handover'"
          @click="handover(0)"
          >交班</el-button
        >
        <el-button
          type="primary"
          class="btn"
          v-if="type === 'handover'"
          @click="handover(1)"
          >交班并打印交班单</el-button
        >
        <el-button type="primary" @click="handover(2)" class="btn" v-else
          >补打交班单</el-button
        >
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :show-close="false">
      <img
        src="@/assets/dateClose.png"
        alt=""
        class="close-logo"
        @click="dialogVisible = false"
      />

      <div class="dialog-content">
        <span class="dialog-content-title">确定要交班吗？</span>
        <div class="dialog-action">
          <el-button class="cancel" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            class="confirm"
            style="margin-left: 15px"
            @click="confirm"
            >交班并退出</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from "@/utils/util.js";
import { handoverDetail, handoverSubmit } from "@/api";
import { printHandover } from "@/utils/PrintCore";
export default {
  data() {
    return {
      handoverIndex: 0,
      type: "",
      id: 0,
      dialogVisible: false,
      handoverDetail: {
        tableDataList: [],
        bottomData: {},
      },
      loading:false
    };
  },
  methods: {
    cellStyleAction(row, column, rowIndex, columnIndex) {
      if (row.row.level == 0 && row.column.label == "收款方式") {
        console.log(row);
        return "font-weight: 600";
      }
    },
    handover(index) {
      if (index == 0) {
        this.handoverIndex = index;
        this.dialogVisible = true;
      } else if (index == 1) {
        this.handoverIndex = index;
        this.dialogVisible = true;
      } else if (index == 2) {
        // 2补打交班单
        printHandover(this.id);
      }
    },
    confirm() {
      // 0交班 1交班并打印交班单 2补打交班单
      // console.log("handover:index", index);
      this.loading=true;
      let data = {
        id: this.id,
        reserveAmount: this.handoverDetail.reserveAmount,
      };
      handoverSubmit(data)
        .then((res) => {
          this.loading=false;
          if (res.code === 200) {
            if (this.handoverIndex != 0) {
              printHandover(this.id);
            }

            this.$router.push({ path: "/login" });
            this.$message({
              message: "交班成功",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((e) => {
          this.loading=false;
          this.$message.error(e);
        });
    },
    getSummaries() {
      return [
        "合计",
        this.handoverDetail.sumNums + "笔",
        "￥" + this.handoverDetail.sumMoneyAmount,
        "￥" + this.handoverDetail.sumTotalAmount,
        "￥" + this.handoverDetail.sumVoucherAmount,
        "￥" + this.handoverDetail.sumCreditAmount,
      ];
    },
  },
  mounted() {
    let params = this.$route.params;
    // console.log(params);
    if (params.type == "handover") {
      Utils.$emit("changeMetaTitle", "交班");
    }
    this.type = params.type;
    this.id = params.id;

    handoverDetail(params.id).then((res) => {
      this.handoverDetail = res.data;
    });
  },
};
</script>

<style scoped  >
.dialog-content-title {
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 28px;
}
.dialog-action {
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}
.dialog-content {
  margin: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
.border {
  width: calc(100% - 60px);
  margin: 20px auto;
}
.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.item {
  margin: 80px 100px 0px 100px;
  display: flex;
  flex-direction: column;
}
.item-tip {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  height: 21px;
}

.item-content {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
}
.top-margin {
  margin-top: 10px;
}
.btn {
  width: 550px;
  height: 50px;
  border-radius: 10px;
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 24px;
}
.confirm {
  width: 160px;
  height: 45px;
}
.cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 45px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 24px;
}
.btn2 {
  width: 550px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #00000000;

  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  line-height: 24px;
  margin-left: 40px;
}
.action {
  display: flex;
  flex-direction: column;
  margin: 0px 30px 0px 30px;
  padding-top: 24px;
}
.action-top {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.self-tip {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  margin-right: 30px;
}
.all-price {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
}

::v-deep .el-table,
::v-deep .el-el-table__footer-wrapper,
::v-deep .el-table__footer,
::v-deep.is-leaf {
  background-color: #f5f5f5 !important;
}

::v-deep .el-table,
::v-deep .el-el-table__footer-wrapper,
::v-deep .el-table__footer,
::v-deep .is-leaf,
::v-deep .cell {
  color: #4f424c !important;
}
.bottom {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.menu {
  display: flex;
  flex-direction: column;
  border: 1px solid #e7e7e7;
  width: 445px;
  margin-right: 20px;
}
.menu-header {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 50px;
  margin: 0px 20px 0px 20px;
  border-bottom: 1px solid #e7e7e7;
}
.menu-icon {
  width: 4px;
  height: 14px;
  background: #009e69;
  margin-right: 6px;
}
.menu-title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  line-height: 22px;
}
.menu-content {
  display: flex;
  flex-direction: column;
  padding: 23px 20px 23px 20px;
}
.menu-content-item {
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.menu-content-left {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 22px;
}
.menu-content-right {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  line-height: 28px;
  width: 150px;
  display: flex;
  justify-content: flex-end;
}
.menu-content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.btn {
  width: 335px;
  height: 50px;
  border-radius: 10px;
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 24px;
}
.btn2 {
  width: 335px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #00000000;
  font-size: 17px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
  line-height: 24px;
}
.bottom-action {
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: fixed;
  width: 100%;
  bottom: 30px;
  right: 45px;
}
::v-deep .el-input__inner {
  border: 0px solid #00000000;
  background: #e7e7e7;
  font-size: 22px;
  width: 220px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4f424c;
}

.close-logo {
  position: absolute;
  right: 30px;
  top: 20px;
  width: 18px;
  height: 18px;
}

::v-deep.el-table__expand-icon .el-icon-arrow-right:before {
  content: "\e791";
  font-size: 14px;
}

::v-deep .el-table__expand-icon--expanded .el-icon-arrow-right:before {
  content: "\e790";
  font-size: 14px;
}
</style>