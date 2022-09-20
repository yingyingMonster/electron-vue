<template>
  <div class="rePaymentContent" v-loading="loading">
    <div class="openAccount">
      <span>挂账人：{{ info.name }}</span>
      <span>已挂金额：{{ info.usedAmount }}</span>
      <span
        >剩余挂账金额：{{
          _.round(info.limitAmount - info.totalUsedAmount,2) || ""
        }}</span
      >
    </div>
    <div class="rePaymentWay">
      <div class="itemTitle">还款方式</div>
      <div class="payItem">
        <span
          v-for="(item, index) in [
            { name: '按照总账户还款', type: '1' },
            { name: '按照订单明细还款', type: '2' },
          ]"
          :key="index"
          @click="handlePay(item.type)"
          :class="creditRepaymentRecord.type == item.type ? 'active' : ''"
          >{{ item.name }}</span
        >
      </div>
    </div>

    <el-form
      :inline="true"
      :model="creditRepaymentRecord"
      ref="creditRepaymentRecord"
      class="dialogForm"
    >
      <el-form-item
        class="formItemLeft rePayPrice"
        label="还款金额"
        prop="amount"
        :rules="[
          { required: true, message: '请输入还款金额', trigger: 'blur' },
        ]"
      >
        <el-input
          :disabled="creditRepaymentRecord.type == 2"
          v-model="creditRepaymentRecord.amount"
          placeholder="请输入"
          type="number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
        >
          <span slot="suffix">元</span>
        </el-input>
      </el-form-item>
      <el-form-item class="formItemRight" label="减免金额">
        <el-input
          v-model="creditRepaymentRecord.discountAmount"
          placeholder="请输入"
          type="number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
        >
          <span slot="suffix">元</span>
        </el-input>
      </el-form-item>
      <el-form-item
        class="formItemLeft rePayPrice"
        label="支付方式"
        prop="payType"
        :rules="[
          { required: true, message: '请选择支付方式', trigger: 'change' },
        ]"
      >
        <el-select v-model="creditRepaymentRecord.payType" placeholder="请选择">
          <el-option
            v-for="item in rePayMthod"
            :key="item.valueInt"
            :label="item.name"
            :value="item.valueInt"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="exemption" v-if="creditRepaymentRecord.type == 2">
      <el-input placeholder="请输入订单号" v-model="query.code"></el-input>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
      >
      </el-date-picker>
      <div>
        <el-button type="primary" @click="checkList">查询</el-button>
        <el-button class="reset" @click="reset">重置</el-button>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :data="tableSource"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-if="creditRepaymentRecord.type == 2"
    >
      <el-table-column type="selection" fit> </el-table-column>
      <el-table-column prop="orderNum" label="订单号" fit> </el-table-column>
      <el-table-column prop="amount" label="挂账金额" width="120">
      </el-table-column>
      <el-table-column
        prop="remainingAmount"
        label="待还金额"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="returnAmount"
        label="已还金额"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="交易时间" show-overflow-tooltip>
        <template slot-scope="scope">{{
          $moment(scope.row.ctDate).format("YYYY-MM-DD HH:mm:ss")
        }}</template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button class="cancel" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm('creditRepaymentRecord')"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  rePaymentWay,
  rePaymentInfo,
  rePaymentList,
  submitRecord,
  rePaymentEnterpriseInfo,
  submitEnterpriseRecord,
  rePaymentEnterpriseList,
} from "@/api";
import { printHangUpBill } from "@/utils/PrintCore";
export default {
  props: ["rePaymentId", "type"],
  data() {
    return {
      // 挂账人信息
      info: {},
      // 还款参数
      creditRepaymentRecord: {
        // 还款方式
        type: "1",
        // 支付方式
        payType: "",
        //还款金额
        amount: "",
        //减免金额
        discountAmount: 0,
        accountId: this.rePaymentId,
        cafeId: localStorage.getItem("cafeId"),
      },
      //选择支付方式
      rePayMthod: [],
      //   时间选择
      time: "",
      loading: false,
      query: {
        code: "",
        id: this.rePaymentId,
        source: "2",
        dateBegin: "",
        dateEnd: "",
      },
      // 挂账列表
      tableSource: [],
      // 选中数组
      ids: [],
    };
  },
  mounted() {
    // 还款方式
    rePaymentWay(["SYS0028"])
      .then((res) => {
        console.log(res);
        this.rePayMthod = res.data.data.SYS0028;
      })
      .catch((err) => {
        console.log(err);
      });
    // 加载个人信息
    this.getInfo();
    // 加载列表信息
    this.getTable();
  },
  methods: {
    handleSelectionChange(val) {
      const totalArray = val.map((item) => {
        return item.remainingAmount;
      });
      this.ids = val.map((item) => {
        return item.id;
      });
      if (totalArray.length > 0) {
        this.creditRepaymentRecord.amount = this._.sum(totalArray);
      } else {
        this.creditRepaymentRecord.amount = "";
      }
      console.log(this.ids);
    },
    // 还款方式
    handlePay(rePaymentType) {
      this.creditRepaymentRecord.type = rePaymentType;
      if (rePaymentType == 1) {
        this.creditRepaymentRecord.amount = this.info.usedAmount;
      } else if (rePaymentType == 2) {
        this.creditRepaymentRecord.amount = "";
      }
    },
    // 计算账户总还款额
    getTotal() {
      const total = this.tableSource.map((item) => {
        return item.remainingAmount;
      });
      this.creditRepaymentRecord.amount = this._.sum(total);
      console.log(total);
      console.log(this.creditRepaymentRecord.amount);
    },
    // 获取表格
    getTable() {
      // 判断企业挂账与个人挂账
      if (this.type == "creditPersonalRepaymentRecord") {
        rePaymentList(this.query)
          .then((res) => {
            console.log(res);
            this.tableSource = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.type == "creditRepaymentRecord") {
        rePaymentEnterpriseList(this.query)
          .then((res) => {
            console.log(res);
            this.tableSource = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 表格查询
    checkList() {
      this.getTable();
    },
    // 时间选择
    timeChange(time) {
      console.log(time);
      if (time) {
        this.query.dateBegin = this.$moment(time[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.query.dateEnd = this.$moment(time[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.query.dateBegin = "";
        this.query.dateEnd = "";
        this.getTable();
      }
    },
    // 取消按钮
    cancel() {
      
      this.$parent.handleClose();
    },
    // 确定按钮
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this._.round(this.creditRepaymentRecord.discountAmount, 2) >
            this._.round(this.creditRepaymentRecord.amount, 2)
          ) {
            this.$message({
              type: "error",
              message: "减免金额不能大于还款金额",
            });
            return;
          }
          this.loading = true;
          if (this.type == "creditPersonalRepaymentRecord") {
            submitRecord({
              creditPersonalRepaymentRecord: this.creditRepaymentRecord,
              ids: this.ids,
            })
              .then((res) => {
                this.loading = false;
                if (res.code == 200) {
                  this.$notify({
                    title: "成功",
                    message: "还款成功",
                    type: "success",
                  });
                  this.$emit("listReq");
                  this.$parent.handleClose();
                  
                  printHangUpBill(JSON.stringify(res.data) );
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.msg,
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          } else if (this.type == "creditRepaymentRecord") {
            submitEnterpriseRecord({
              creditRepaymentRecord: this.creditRepaymentRecord,
              ids: this.ids,
            })
              .then((res) => {
                this.loading = false;
                if (res.code == 200) {
                  this.$notify({
                    title: "成功",
                    message: "还款成功",
                    type: "success",
                  });
                  this.$emit("listReq");
                  this.$parent.handleClose();
                  printHangUpBill(JSON.stringify(res.data) );
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.msg,
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 重置
    reset() {
      this.query.code = "";
      this.query.dateBegin = "";
      this.query.dateEnd = "";
      this.time = "";
      this.getTable();
    },
    // 还款人信息
    getInfo() {
      if (this.type == "creditRepaymentRecord") {
        rePaymentEnterpriseInfo(this.rePaymentId)
          .then((res) => {
            console.log(res);
            this.info = res.data;
            this.creditRepaymentRecord.amount = res.data.usedAmount;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.type == "creditPersonalRepaymentRecord") {
        rePaymentInfo(this.rePaymentId)
          .then((res) => {
            console.log(res);
            this.info = res.data;
            this.creditRepaymentRecord.amount = res.data.usedAmount;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rePaymentContent {
  width: 100%;
  height: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  border-radius: 15px;
  overflow: scroll;
  background: #fff;
  display: flex;
  flex-direction: column;
  color: #4f424c;
  font-size: 15px;
}
.openAccount {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  span {
    padding-right: 20px;
    font-weight: 400;
  }
}
.itemTitle {
  width: 80px;
  height: 28px;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 28px;
  margin-bottom: 10px;
}
.rePaymentWay {
  padding: 10px 0;
}

.exemption {
  display: flex;
  justify-content: flex-start;
  margin: 20px 0;
  ::v-deep .el-input {
    width: auto;
  }
  ::v-deep .el-input__inner {
    width: 240px;
    border-radius: 6px;
    margin-right: 20px;
    background: #f5f5f5;
    border: none;
  }
  ::v-deep .el-date-editor .el-range-input {
    background: #f5f5f5;
  }
  ::v-deep .el-date-editor .el-range-separator {
    line-height: 40px;
    width: 12%;
  }
}
.payItem {
  padding: 10px 0;
  span {
    display: inline-block;
    width: 138px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #f5f5f5;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.active {
  background: #009e69 !important;
  color: #fff;
}
.dialogForm {
  width: 100%;
  ::v-deep .el-input__inner {
    border: none;
  }
}
.rePayPrice {
  ::v-deep .el-form-item__error {
    top: 66% !important;
  }
  ::v-deep .el-form-item__label:before {
    content: "" !important;
    margin: 0;
  }
  ::v-deep .el-form-item__label:after {
    content: "*";
    color: #f56c6c;
    margin-left: 4px;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    background: #fff;
  }
}
.formItemLeft {
  width: calc(50% - 40px);
  padding: 5px 0;
  box-sizing: border-box;
  margin: 5px 10px 5px 0;
  border-bottom: 1px solid #e7e7e7;
}

.formItemRight {
  width: calc(50% - 40px);
  padding: 5px 0;
  box-sizing: border-box;
  margin: 5px 30px 5px 30px;
  border-bottom: 1px solid #e7e7e7;
}
.reset {
  color: #009e69;
  border: 1px solid #009e69;
}
.footer {
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  button {
    height: 50px;
    width: 160px;
  }
}
.cancel {
  background: #f5f5f5;
}
</style>