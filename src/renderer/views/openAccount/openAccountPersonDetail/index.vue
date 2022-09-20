<template>
  <div class="">
    <!-- 个人和企业挂帐订单明细复用页面 -->
    <div class="name-wrap" v-if="kindType == 1">{{ userInfo.creditName }}</div>
    <div class="name-wrap" v-if="kindType == 2">
      <span>{{ userInfo.orgName }} </span>
      <span v-if="userInfo.orgNum">({{ userInfo.orgNum }}人) </span>
    </div>
    <div class="phone-wrap info-text" v-if="kindType == 1">
      <span class="">手机号:</span>
      <span class="paddingRight20">{{ userInfo.phone }}</span>
      <span class="">职位:</span>
      <span class="">{{ userInfo.position }}</span>
    </div>

    <div class="num-wrap info-text">
      <span class="">编号：</span>
      <span class="paddingRight20">{{ userInfo.code }}</span>
      <span class="">挂账额度：</span>
      <span class="paddingRight20">{{ userInfo.limitAmount }}</span>
      <span class="">剩余可挂账额度：</span>
      <span class="paddingRight20">{{ userInfo.remainingAmount }}</span>
      <span class="">已挂账金额：</span>
      <span class="paddingRight20">{{ userInfo.usedAmount }}</span>
    </div>

    <div class="top-wrap">
      <el-input
        class="input-style"
        v-model="nameInput"
        placeholder="请输入交易单号"
      ></el-input>
      <el-button class="search-btn" @click="searchClick">搜索</el-button>
      <span class="ticket-type">选择日期</span>
      <el-input
        placeholder="请选择日期"
        suffix-icon="el-icon-caret-bottom"
        disabled
        class="choose-date"
        v-model="dateInputData"
        @click.native="chooseDateClick"
      >
      </el-input>
      <el-button class="again-btn" @click="againClick">重置</el-button>
    </div>

    <el-table
      :header-cell-style="{ background: '#F5F5F5', color: '#4F424C' }"
      :data="tableData"
      :max-height="tabHeight"
      border
      class="tab-wrap"
    >
      <el-table-column prop="code" align="center" label="订单号" fit>
      </el-table-column>

      

      <el-table-column prop="payTime" align="center" label="交易时间" fit>
      </el-table-column>

      <el-table-column
        prop="accountName"
        align="center"
        label="挂帐人"
        fit
        v-if="kindType == 2"
      >
      </el-table-column>

      <el-table-column prop="amount" align="center" label="交易金额(元)" fit>
      </el-table-column>

     

      <el-table-column
        align="center"
        prop="remainingAmount"
        label="待还金额(元)"
        fit
      >
      </el-table-column>

    

      <el-table-column align="center" prop="businessCode" label="业务单号" fit>
      </el-table-column>


      <el-table-column align="center" prop="operatorName" label="操作人" fit>
      </el-table-column>

      <el-table-column class="menue-wrap" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="more-btn"
            @click="detailClick(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalSize"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>

    <el-dialog
      :visible.sync="dialogTableVisible"
      v-if="dialogTableVisible"
      :show-close="false"
    >
      <img
        src="@/assets/dateClose.png"
        alt=""
        class="close-logo"
        @click="popCloseClick"
      />
      <div class="date-tip">日期筛选</div>
      <div class="date-wrap">
        <div
          v-for="(item, index) in dateTabData"
          :key="index"
          :class="
            index == currentDateIndex
              ? 'date-item item-select'
              : 'date-item item-normal'
          "
          @click="dateMenueClick(index)"
        >
          {{ item }}
        </div>
      </div>
      <div class="time-wrap">
        <el-date-picker
          class="pick-class"
          v-model="chooseDateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :disabled="dateDisableCtrl"
          :clearable="clearableCtrl"
          @change="changeDate"
        >
        </el-date-picker>
      </div>
      <div class="btn-wrap" @click="dateSureClick">确定</div>
    </el-dialog>
  </div>
</template>
<script>
import { personAccountDetailReq, groupAccountDetailReq } from "@/api/index";
export default {
  data() {
    return {
      //顶部62  20 45 20  padding 15*2  = 177px 20px page 60
      tabHeight: "calc(((100vh - 280px) - 20px) - 60px)",
      accountId: 0,
      kindType: 1, // 1 个人 2 企业
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      dateInputData: "",
      nameInput: "",
      dialogTableVisible: false,
      chooseDateValue: "",
      dateDisableCtrl: false,
      clearableCtrl: false,
      currentDateIndex: 0,
      startTimeRecord: "",
      endTimeRecord: "",
      dateTabData: ["今天", "昨天", "自定义"],
      userInfo: {},
      tableData: [],
    };
  },

  mounted() {
    this.kindType = this.$route.query.kindType ? this.$route.query.kindType : 1;
    this.accountId = this.$route.query.quaryId ? this.$route.query.quaryId : 0;
    // 当前时间
    this.chooseDateValue = [new Date(), new Date()];
    this.dateDisableCtrl = true;
    this.detailReq();
  },

  methods: {
    /** 搜索 */
    searchClick() {
      this.detailReq();
    },

    /** 重置 */
    againClick() {
      this.nameInput = "";
      this.chooseDateValue = [];
      this.startTimeRecord = "";
      this.endTimeRecord = "";
      this.dateInputData = "";
      this.detailReq();
    },

    /** 查看详情 */
    detailClick(rowData) {
      this.$router.push({
        name: "openAccountOrderDetail",
        query: { kindType: this.kindType, quaryId: rowData.id },
      });
    },

    /** 接口请求 */
    detailReq() {
      var tempSearchStr = this.nameInput ? this.nameInput : "";
      var pagram = {
        accountId: this.accountId, //挂账账户id
        code: tempSearchStr, //交易单号
        startDate: this.startTimeRecord,
        endDate: this.endTimeRecord,
        page: this.currentPage,
        size: this.pageSize,
      };
      console.log(pagram, this.kindType);
      if (this.kindType == 1) {
        this.personDetailReq(pagram);
      } else {
        this.groupDetailReq(pagram);
      }
    },

    /** 个人请求 */
    personDetailReq(pagram) {
      personAccountDetailReq(pagram)
        .then((res) => {
          console.log(res);
          this.tableData = [];
          this.tableData = res.data.pageInfoVO.list;
          this.totalSize = res.data.pageInfoVO.total;
          this.userInfo = res.data.userInfo;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /** 企业请求 */
    groupDetailReq(pagram) {
      groupAccountDetailReq(pagram)
        .then((res) => {
          this.tableData = [];
          this.tableData = res.data.pageInfoVO.list;
          this.totalSize = res.data.pageInfoVO.total;
          this.userInfo = res.data.userInfo;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /** 选择日期弹窗 */
    chooseDateClick() {
      this.dialogTableVisible = true;
    },

    /** 日期选择 */
    dateMenueClick(index) {
      this.currentDateIndex = index;
      // this.value1 = ["2021-05-20","2021-05-28"]
      if (index == 0) {
        //今天
        this.dateDisableCtrl = true;
        const end = new Date();
        const start = new Date();
        this.chooseDateValue = [start, end];
      }

      if (index == 1) {
        //昨天
        this.dateDisableCtrl = true;
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        this.chooseDateValue = [start, end];
      }

      if (index == 2) {
        //自定义
        this.dateDisableCtrl = false;
        this.chooseDateValue = [];
      }

      console.log(this.chooseDateValue);
    },

    /** 关闭弹窗 */
    popCloseClick() {
      this.dialogTableVisible = false;
    },

    /** 日期确定事件 */
    dateSureClick() {
      this.popCloseClick();
      if (this.currentDateIndex == 2) {
        this.dateInputData =
          this.$moment(this.chooseDateValue[0]).format("YYYY/MM/DD") +
          " 00:00" +
          "-" +
          this.$moment(this.chooseDateValue[1]).format("YYYY/MM/DD") +
          " 23:59";
      } else {
        this.dateInputData =
          this.dateTabData[this.currentDateIndex] +
          " " +
          this.startTime() +
          "-" +
          this.endTime();
      }

      this.detailReq();
    },

    ///起始时间
    startTime() {
      var returnStr = "";
      var date1 = new Date();
      if (this.currentDateIndex != 0) {
        date1 = this.chooseDateValue[0];
      }
      console.log(this.chooseDateValue);
      var year = date1.getFullYear();
      returnStr = year + "/";

      var month = date1.getMonth() + 1;
      if (month < 10) {
        returnStr = returnStr + "0" + month + "/";
      } else {
        returnStr = returnStr + month + "/";
      }

      var day = date1.getDate();
      if (day < 10) {
        returnStr = returnStr + "0" + day + " ";
      } else {
        returnStr = returnStr + day + " ";
      }
      this.startTimeRecord = this.$moment(returnStr + "00:00").format(
        "YYYY-MM-DD HH:mm"
      );
      return returnStr + "00:00";
    },

    ///结束时间
    endTime() {
      var returnStr = "";
      var date1 = new Date();

      if (this.currentDateIndex != 0) {
        date1 = this.chooseDateValue[1];
      }
      console.log(this.chooseDateValue[1]);
      var year = date1.getFullYear();
      returnStr = year + "/";
      var month = date1.getMonth() + 1;
      if (month < 10) {
        returnStr = returnStr + "0" + month + "/";
      } else {
        returnStr = returnStr + month + "/";
      }
      var day = date1.getDate();
      if (day < 10) {
        returnStr = returnStr + "0" + day + " ";
      } else {
        returnStr = returnStr + day + " ";
      }

      var hours = date1.getHours();
      if (this.currentDateIndex == 1) {
        //昨天
        hours = 23;
      }
      if (hours < 10) {
        returnStr = returnStr + "0" + hours + ":";
      } else {
        returnStr = returnStr + hours + ":";
      }

      var minutes = date1.getMinutes();
      if (this.currentDateIndex == 1) {
        //昨天
        minutes = 59;
      }
      if (minutes < 10) {
        returnStr = returnStr + "0" + minutes;
      } else {
        returnStr = returnStr + minutes;
      }
      this.endTimeRecord = this.$moment(returnStr).format("YYYY-MM-DD HH:mm");
      return returnStr;
    },
    // 分页
    currentChange(val) {
      this.currentPage = val;
      this.detailReq();
    },
    // 切换每页条数
    handleSizeChange(val){
      this.pageSize=val;
      this.detailReq();
    },
    // 选择时间
    changeDate(val) {
      this.startTimeRecord = val[0] + " 00:00";
      this.endTimeRecord = val[1] + " 23:59";
      console.log(this.startTimeRecord, this.endTimeRecord);
    },
  },
};
</script>
<style lang="scss" scoped>
.top-wrap ::v-deep .el-input__inner {
  height: 45px;
  border-radius: 6px 0px 0px 6px;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 510px;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.name-wrap {
  margin: 25px 20px 10px;
  font-size: 30px;
  color: #4f424c;
}

.phone-wrap {
  margin: 0px 20px 20px;
}

.num-wrap {
  margin: 0px 20px 20px;
}

.info-text {
  font-size: 15px;
  color: #4f424c;
}

.paddingRight20 {
  padding-right: 20px;
}

.top-wrap {
  display: flex;
  flex-direction: row;
  margin: 20px;
  align-items: center;
}

.input-style {
  width: 16%;
  background: #f5f5f5;
  ::v-deep .el-input__inner {
    border-radius: 6px 0 0 6px;
  }
}

.choose-date {
  width: 20%;
  height: 45px;
  line-height: 45px;
  background: #f5f5f5;
  margin-right: 30px;
}

.search-btn {
  background: #009e69;
  color: #fff;
  height: 45px;
  font-size: 16px;
  border: 0px;
  border-radius: 0px 6px 6px 0px;
}

.again-btn {
  background: #fafffd;
  border-radius: 6px;
  height: 45px;
  border: 1px solid #009e69;
  color: #009e69;
  font-size: 16px;
  border-radius: 6px;
}

.ticket-type {
  margin-left: 30px;
  margin-right: 13px;
  color: #4f424c;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}

.tab-wrap {
  width: calc(100% - 40px);
  margin: 0px 20px;
  overflow: scroll;
  border: 1px solid #f5f5f5;
}

.money-btn {
  color: #f06543;
  font-size: 14px;
}

.more-btn {
  color: #009e69;
  font-size: 14px;
}

.menue-wrap {
  margin-left: 50px;
}

/** 弹框 */

.date-tip {
  color: #4f424c;
  font-size: 20px;
  margin-left: 30px;
}

.date-wrap {
  display: flex;
  flex-direction: row;
  justify-items: center;
  margin: 30px 30px 30px 20px;
}

.date-item {
  width: 105px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin-left: 10px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}

.item-normal {
  background: #f5f5f5;
  color: #4f424c;
}

.item-select {
  background: #009e69;
  color: #fff;
}

.time-wrap {
  display: flex;
  flex-direction: row;
  justify-items: center;
}

.btn-wrap {
  width: 440px;
  height: 50px;
  line-height: 50px;
  background: #009e69;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  margin: 25px 30px 30px 30px;
}

.pick-class {
  margin-left: 30px;
  width: 440px;
}

.close-logo {
  position: absolute;
  right: 30px;
  top: 20px;
  width: 18px;
  height: 18px;
}
.pagination {
  margin: 10px;
}
::v-deep .el-table::before {
  height: 0;
}
</style>