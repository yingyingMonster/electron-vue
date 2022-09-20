<template>
  <div class="justify orderContainer">
    <div
      class="table-head"
      style="
        width: 98%;
        height: 84vh;
        background: white;
        margin-left: 1%;
        margin-top: 1%;
        border-radius: 15px;
      "
    >
      <div class="query">
        <el-select
          v-model="query.status"
          placeholder="订单状态"
          style="margin-right: 1%"
          @change="getStatus"
          class="orderStatus"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.valueInt"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="query.orderWay"
          placeholder="订单来源"
          style="margin-right: 1%"
          @change="getOrigin"
          class="orderStatus"
          clearable
        >
          <el-option label="线上" value="1"> </el-option>
          <el-option label="店内点餐" value="2"> </el-option>
        </el-select>
        <el-date-picker
          style="margin-right: 1%"
          v-model="query.datePicker"
          class="input-style"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="onDateChange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <div class="searchInput">
          <el-input
            v-model="query.keyword"
            placeholder="请输入订单号/取餐号/姓名/电话"
          ></el-input>

          <!--          <el-input size="small" placeholder="请输入内容" v-model="input2">-->
          <!--            <template slot="append" style="color: #009E69;">搜索</template>-->
          <!--          </el-input>-->
        </div>
        <el-button class="search-btn" @click="searchClick">搜索</el-button>
        <el-button
          size="small"
          @click="reset"
          style="
            background: #fafffd;
            color: #009e69;
            border: 1px solid #009e69;
            border-radius: 6px;
            margin: 0 30px;
            width: 80px;
          "
        >
          重置
        </el-button>
      </div>
      <div class="table-head table">
        <el-table
          v-loading="loading"
          border
          height="600px"
          size="small"
          highlight-current-row
          :data="tableData"
          :header-cell-style="{ background: '#F5F5F5', color: '#4F424C' }"
          fit
        >
          <el-table-column prop="mealCode" align="center" label="取餐号" fit sortable>
            <template slot-scope="scope">
              <div class="tagSty">
                <p>{{ scope.row.mealCode }}</p>
                <el-tag
                  class="online"
                  size="mini"
                  v-if="scope.row.orderWayType == '1'"
                >
                  线
                </el-tag>
                <el-tag
                  class="onshop"
                  size="mini"
                  v-if="scope.row.orderWayType != '1'"
                >
                  店
                </el-tag>
                <el-tag
                  class="onreversed"
                  size="mini"
                  v-if="scope.row.isReversed"
                >
                  反
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="顾客姓名"
            align="center"
            fit
          ></el-table-column>
          <el-table-column prop="phone" align="center" label="顾客电话" fit></el-table-column>
          <el-table-column prop="orderNum" align="center" label="订单号" fit></el-table-column>
          <el-table-column
            prop="originalPrice"
            label="订单原价"
            align="center"
            fit
          ></el-table-column>
          <el-table-column prop="price" align="center" label="支付金额" fit></el-table-column>
          <el-table-column
            prop="discountMethod"
            label="折扣方式"
            align="center"
            fit
          ></el-table-column>
          <el-table-column
            prop="orderWay"
            label="结账方式"
            align="center"
            fit
          ></el-table-column>
          <el-table-column
            prop="discountPrice"
            label="订单优惠"
            align="center"
            fit
          ></el-table-column>
          <el-table-column prop="cashier" align="center" label="收银员" fit></el-table-column>
          <el-table-column prop="ctDate" align="center" label="日期" fit>
            <template slot-scope="scope">
              <span>{{
                $moment(scope.row.ctDate).format("YYYY-MM-DD HH:mm")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="订单状态" fit></el-table-column>
          <el-table-column prop="address" label="操作" align="center" width="220">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="print(scope.row)"
                type="text"
                :disabled="!scope.row.isPrint"
                :class="scope.row.isPrint ? 'succTxt' : ''"
                size="small"
              >
                打印小票
              </el-button>

              <el-button
                @click.native.prevent="refund(scope.row)"
                type="text"
                size="small"
                :disabled="!scope.row.isReversal"
                :class="scope.row.isReversal ? 'dangerTxt' : ''"
              >
                反结账
              </el-button>
              <el-button
                @click.native.prevent="makeUpOrder(scope.row)"
                type="text"
                size="small"
                :disabled="!scope.row.isReversed"
                :class="scope.row.isReversed ? 'priTxt' : ''"
              >
                补打反结账单
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot-bar">
        <div class="order-total">共计{{ total }}单</div>
        <div class="price-total">订单总价：￥{{ totalAmount }}</div>
        <div class="price-total">支付金额：￥{{ payAmount }}</div>
        <div class="price-total">优惠：￥{{ discountAmount }}</div>
        <div class="income-total">共计收入：￥{{ income }}</div>
      </div>
    </div>
    <div
      class="pagination"
      style="
        width: 98%;
        margin-left: 1%;
        margin-top: 1%;
        height: 5vh;
        background: white;
        border-radius: 15px;
      "
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-size="query.size"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        >
      </el-pagination>
    </div>
    <el-dialog
      title="确认反结账"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="dialog-text">
        发起反结账后，您可以对已结账的订单发起退菜，更换支付方式、退款等操作
      </div>
      <div class="refund-reason-btn">反结账原因</div>
      <div class="reason-btn">
        <el-radio-group v-model="radio1">
          <el-radio-button
            v-for="(item, index) in remarksList"
            :key="index"
            :label="index"
          >{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmCheckout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OrderDetail from "../../components/orderDetail";
import {
  getOrderList,
  handoverRecord,
  handoverRecordNo,
  getRemarks,
  antiAccountList
} from "@/api";
import { supPrintBill } from "@/utils/PrintCore";
export default {
  components: {
    OrderDetail,
  },
  data() {
    return {
      query: {
        status: "",
        orderWay: "",
        keyword: "",
        startDate: "",
        endDate: "",
        order: "",
        sort: "",
        page: 1,
        size: 10,
        datePicker: [],
      },
      total: 0,
      loading: false,
      totalAmount: 0,
      payAmount: 0,
      discountAmount: 0,
      income: 0,
      price: 600,
      payPrice: 600,
      Discount: 600,
      radio1: 0  ,
      dialogVisible: false,
      background: true,
      input2: "",
      value1: "",
      currentPage4: 1,
      tableData: [],
      statusList: [],
      status: "",
      orderID: "",
      // 挂账原因列表
      remarksList: [],
    };
  },
  mounted() {
    this.loadData();
    this.getRemark();
  },
  activated() {
    console.log(11111);
    this.loadData();
  },
  methods: {
    searchClick() {
      this.loadData();
    },
    /** 重置 */
    reset() {
      this.query.status = undefined;
      this.query.datePicker = [];
      this.query.startDate = "";
      this.query.orderWay = "";
      this.query.endDate = "";
      this.query.keyword = "";
      this.query.order = "";
      this.query.sort = "";
      this.query.page = 1;
      this.query.size = 10;
      this.loadData();
    },
    onDateChange(date) {
      console.log(date);
      this.datePicker = date;
      if (date) {
        this.query.startDate = date[0];
        this.query.endDate = date[1];
      } else {
        this.query.startDate = null;
        this.query.endDate = null;
      }
    },
    loadData(size) {
      console.log(11111);
      // this.loading = true;
      if (size && !isNaN(size)) {
        this.query.size = size;
      }
      console.log("222", this.query);
      this.loading = true;
      getOrderList(this.query)
        .then((response) => {
          console.log("response", response);
          let respData = response.data.pageInfoVO;
          this.tableData = respData.list;
          this.total = respData.total;
          this.totalAmount = response.data.totalAmount;
          this.payAmount = response.data.payAmount;
          this.discountAmount = response.data.discountAmount;
          this.income = response.data.income;
          this.statusList = response.data.codeMap["SYS0020"];
          console.log(this.statusList);
          // this.loading = false;
          console.log("this.tableData", this.tableData);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
      // getOrderList(this.query).then(response => {
      //   if (this.$reqSucceed(response)) {
      //
      //     let respData = response.data;
      //     this.tableData = respData.list;
      //     this.total = respData.total;
      //   }
      //   this.loading = false;
      // });
    },
    handleSizeChange(val) {
      this.query.page = 1;
      this.loadData(val);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    print(row) {
      //TODO 打印小票
      supPrintBill(row.id);
    },
    refund(row) {
      console.log(row);
      this.orderID = row.id;
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    // 确认反结账
    confirmCheckout() {
      this.dialogVisible = false;
      this.$router.push({
        path: "/antiCheckout",
        query: {
          id: this.orderID,
          reason: this.remarksList[this.radio1],
        },
      });
    },
    // 补打结账单
    makeUpOrder(row) {
      antiAccountList(row.id).then(res=>{
        if(res.code==200){
          res.data.forEach(element => {
            supPrintBill(row.id, 3,element);
          });
        }
      }).catch(()=>{

      })
    },
    // 选择订单状态
    getStatus(e) {
      console.log(e);
      this.loadData();
    },
    // 获取来源
    getOrigin() {
      this.loadData();
    },
    // 获取备注信息
    getRemark() {
      getRemarks("6")
        .then((res) => {
          console.log(res);
          this.remarksList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.menuList {
  width: 75%;
  height: calc(100vh - 62px);
  overflow-y: auto;
}

.orderContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 62px);
  background: url("@/assets/homeBg.png");
  background-size: cover;
}
.query ::v-deep .el-select .el-input__inner {
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  line-height: 45px;
  height: 45px;
}
::v-deep .el-date-editor .el-range__icon {
  color: #4f424c;
}
::v-deep .el-input__inner::placeholder {
  color: #4f424c;
}
::v-deep .el-date-editor .el-range__close-icon {
  color: #4f424c;
}
::v-deep .el-range-input::placeholder {
  color: #4f424c;
  height: 45px;
  line-height: 45px;
}
::v-deep .el-select .el-input .el-select__caret {
  color: #4f424c;
}

.orderContent {
  width: 25%;
  height: calc(100vh - 62px);
}

.table-head {
  display: flex;
  flex-direction: column;
  width: 98%;
  padding-top: 1%;
  overflow-y: auto;
  position: relative;
}
.table {
  padding-left: 1%;
  height: 82%;
  max-height: 82%;
}
.query {
  height: auto;
  display: flex;
  width: 98%;
  flex-direction: row;
  padding-left: 1%;
  ::v-deep .el-icon-arrow-up:before {
    content: "\e78f";
  }
}
.orderStatus {
  width: 10%;
}
.input-style {
  width: 400px;
  height: 45px;
  border-radius: 6px;
  background: #f5f5f5;
  color: #4f424c;
  border: none;
}
::v-deep.el-date-editor .el-range-input {
  background: #f5f5f5;
  height: 45px;
  line-height: 45px;
}
::v-deep.el-input-group__append {
  border-left: 0;
  background: #009e69;
  color: white;
}
::v-deep.el-date-editor .el-range-separator {
  line-height: 45px;
  height: 45px;
}
.foot-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 2%;
  width: 100%;
  height: 80px;
  position: absolute;
  box-shadow: 0px 18px 5px 15px #000000;
  bottom: 0;
}
.pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
::v-deep.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4f424c;
  color: #fff;
}
.order-total {
  font-size: 14px;
  right: 0;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  margin-left: 20px;
  line-height: 80px;
}
.price-total {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  margin-left: 20px;
  line-height: 80px;
}
.income-total {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #f06543;
  margin-left: 20px;
  line-height: 80px;
}
.dialog-text {
  padding: 10px 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9f9f9f;
  line-height: 20px;
}
.refund-reason-btn {
  padding: 10px 20px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 25px;
}
.reason-btn {
  padding: 10px 20px;
}
::v-deep.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #009e69;
  border-color: #009e69;
  -webkit-box-shadow: -1px 0 0 0 #009e69;
  box-shadow: -1px 0 0 0 #009e69;
}
::v-deep.el-button--primary {
  color: #fff;
  background-color: #009e69;
  border-color: #009e69;
}
.search-btn {
  background: #009e69;
  color: #fff;
  height: 45px;
  font-size: 16px;
  border: 0px;
  border-radius: 0px 6px 6px 0px;
}
.succTxt {
  color: #009e69;
}
.dangerTxt {
  color: #f06543;
}
.priTxt {
  color: #1295d2;
}
::v-deep .el-radio-button__inner {
  background-color: #f5f5f5;
}
.dialog-footer {
  button {
    width: 160px;
    height: 50px;
  }
  .cancel {
    background: #f5f5f5;
  }
}
.searchInput {
  width: 15%;
  ::v-deep .el-input__inner {
    border-radius: 6px 0px 0px 6px;
    background: #f5f5f5;
    border: none;
    height: 45px;
    line-height: 45px;
  }
}
.online {
  background-color: #009e69;
  border-color: #009e69;
  color: #fff;
  margin: 0 2px;
}
.onshop {
  background-color: #f06543;
  border-color: #f06543;
  color: #fff;
  margin: 0 2px;
}
.onreversed {
  background-color: #1295d2;
  border-color: #1295d2;
  color: #fff;
  margin: 0 2px;
}
.tagSty {
  width: 100%;
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  p {
    margin: 0;
    margin-right: 2px;
  }
}
</style>