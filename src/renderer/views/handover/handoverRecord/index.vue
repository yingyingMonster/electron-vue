<template>
  <div class="record">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="交班记录" name="record" class="orderList">
        <div class="c-header">
          <span class="c-tip">交班时间</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="condition.dataRange"
            @change="handoverChange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>

          <span class="c-tip" style="margin-left: 20px">交班人</span>
          <el-select
            style="width: 200px"
            v-model="condition.userId"
            clearable
            placeholder="请选择"
            @change="handoverChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <el-table
          border
          :data="handoverData"
          class="table"
          :header-cell-style="{ background: '#F5F5F5', color: '#4F424C' }"
        >
          <el-table-column prop="no" label="班次号" width="180">
          </el-table-column>
          <el-table-column prop="shiftName" label="班次" width="180">
          </el-table-column>
          <el-table-column prop="userName" label="交班人" width="180">
          </el-table-column>
          <el-table-column prop="shiftModal" label="交班模式" width="180">
          </el-table-column>
          <el-table-column prop="startTime" label="开班时间" width="180">
          </el-table-column>

          <el-table-column prop="moneyAmount" label="本班次收款" width="180">
          </el-table-column>
          <el-table-column prop="errorMsg" label="交班异常"> </el-table-column>

          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-popconfirm title="确认打印？" @confirm="print(scope.row.id)">
                <span class="action-left" slot="reference">补打交班单</span>
              </el-popconfirm>

              |
              <span class="action-right" @click="detail(scope.row.id)"
                >查看详情</span
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :current-page="pager.page"
          :page-count="pager.totalPage"
          :page-size="pager.size"
          @current-change="currentChange"
        >
        </el-pagination>
      </el-tab-pane>

      <el-tab-pane
        :label="`未交班记录${
          noSubmitNums && noSubmitNums > 0 ? `（${noSubmitNums}人）` : ''
        }`"
        name="unrecord"
        class="orderList"
      >
        <div class="c-header">
          <span class="c-tip">交班人</span>
          <el-select
            v-model="conditionNo.userId"
            clearable
            placeholder="请选择"
            @change="handoverChangeNo"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <el-table
          class="table"
          border
          :data="handoverDataNo"
          :header-cell-style="{ background: '#F5F5F5', color: '#4F424C' }"
        >
          <el-table-column prop="no" label="班次号" width="180">
          </el-table-column>
          <el-table-column prop="shiftName" label="班次" width="180">
          </el-table-column>
          <el-table-column prop="userName" label="未交班人" width="180">
          </el-table-column>

          <el-table-column prop="startTime" label="开班时间"> </el-table-column>

          <el-table-column prop="moneyAmount" label="本班次收款">
          </el-table-column>
        </el-table>

        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :current-page="pagerNo.page"
          :page-count="pagerNo.totalPage"
          :page-size="pagerNo.size"
          @current-change="currentChangeNo"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { handoverUsers, handoverRecord, handoverRecordNo } from "@/api";
import { printHandover } from "@/utils/PrintCore";
export default {
  data() {
    return {
      noSubmitNums: 0,
      value1: "",
      activeName: "record",
      options: [],
      // 交班记录
      handoverData: [],
      condition: {
        page: 1,
        dataRange: [],
        userId: "",
        handoverTimeStart: "",
        handoverTimeEnd: "",
      },
      pager: { page: 1 },
      // 未交班记录
      handoverDataNo: [],
      conditionNo: {
        page: 1,
        dataRange: [],
        userId: "",
        handoverTimeStart: "",
        handoverTimeEnd: "",
      },
      pagerNo: { page: 1 },
    };
  },
  methods: {
    print(e) {
      printHandover(e);
    },
    handoverChangeNo(e) {
      this.pagerNo.page = 1;
      this.getRecordNo();
    },
    handoverChange(e) {
      this.pager.page = 1;
      this.getRecord();
    },
    currentChange(e) {
      this.pager.page = e;
      this.getRecord();
    },
    currentChangeNo(e) {
      this.pagerNo.page = e;
      this.getRecordNo();
    },
    // 切换标签
    handleClick(tab, event) {
      const index = tab.index;
      if (index == 1 && this.handoverDataNo.length <= 0) {
        this.getRecordNo();
      }
      if (index == 0 && this.handoverData.length <= 0) {
        this.getRecord();
      }
    },
    // 查看详情
    detail(id) {
      this.$router.push({
        name: "handoverDetail",
        params: { id: id, type: "detail" },
      });
    },
    // 未交班记录
    getRecordNo() {
      this.conditionNo.page = this.pager.page;
      handoverRecordNo(this.conditionNo).then((res) => {
        this.handoverDataNo = res.data.list;

        this.pagerNo = {
          page: res.data.page,
          size: res.data.size,
          totalPage: res.data.pages,
        };
      });
    },
    // 交班记录
    getRecord() {
      if (this.condition.dataRange && this.condition.dataRange.length > 0) {
        this.condition.handoverTimeStart = this.condition.dataRange[0];
        this.condition.handoverTimeEnd = this.condition.dataRange[1];
      } else {
        this.condition.handoverTimeStart = "";
        this.condition.handoverTimeEnd = "";
      }
      this.condition.page = this.pager.page;
      handoverRecord(this.condition).then((res) => {
        this.handoverData = res.data.list;

        this.pager = {
          page: res.data.page,
          size: res.data.size,
          totalPage: res.data.pages,
        };
      });
    },
  },
  mounted() {
    this.noSubmitNums = this.$route.params.noSubmitNums;
    // 获取交班人
    handoverUsers().then((res) => {
      this.options = res.data;
    });
    this.getRecord();
  },
};
</script>

<style  lang="scss" scoped>
.table {
  width: calc(100% - 30px);
  margin: 0 auto;
}
.record {
  display: flex;
  flex-direction: column;
}
::v-deep .el-tabs__active-bar {
  border-radius: 4px;
  height: 4px;
  bottom: 8px;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 1px;
}
::v-deep .el-tabs__item {
  height: 50px;
}
::v-deep .is-fixed {
  top: 10px;
  right: 20px;
}
::v-deep .el-tabs__header {
  background: #fff;
  padding: 10px 20px;
  position: relative;
  border-radius: 15px 15px 0 0;
  margin: 0 10px;
}
::v-deep .el-tabs__item.is-active,
::v-deep .el-tabs__item:hover {
  color: #4f424c;
}
.c-tip {
  margin-right: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4f424c;
  line-height: 20px;
}
.c-header {
  margin: 20px;
}

::v-deep .el-select,
::v-deep .el-input,
::v-deep .el-input__inner {
  background-color: #f5f5f5;
  color: #4f424c;
  border: 0px;
  border-radius: 6px;
}
::v-deep .el-range-input {
  background-color: #f5f5f5;
}

/* /deep/ input::-webkit-input-placeholder {
  color: #4f424c;
}
/deep/ input::-moz-input-placeholder {
  color: #4f424c;
}
/deep/ input::-ms-input-placeholder {
  color: #4f424c;
} */

.action-left {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f06543;
  line-height: 20px;
  margin-right: 10px;
}

.action-right {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #009e69;
  line-height: 20px;
  margin-left: 10px;
}
.pagination {
  margin: 10px 10px 10px 8px;
}
</style>