<template>
  <div class="big-wrap">
   
    <div class="top-wrap">
      <el-input class="input-style" v-model="nameInput" placeholder="请输入企业名称"></el-input>
      <el-button class="search-btn" @click="searchClick">搜索</el-button>
      <el-button class="again-btn"  @click="againClick">重置</el-button>
    </div>
    
    <el-table
      :header-cell-style="{ background: '#F5F5F5', color: '#4F424C' }"
      :data="tableData"
      border
      :max-height="tabHeight"
      class="tab-wrap">
      
      <el-table-column
        prop="orgName"
        align="center"
        label="挂账企业"
        fit>
      </el-table-column>

      <el-table-column
        prop="limitAmount"
        align="center"
        label="挂账额度(元)"
         fit>
      </el-table-column>

      <el-table-column
        prop="usedAmount"
         align="center"
        label="已挂账额度(元)"
         fit>
      </el-table-column>

      <el-table-column
        align="center"
        prop="remainingAmount"
        label="剩余可挂账额度(元)"
         fit>
      </el-table-column>

      <el-table-column
        class="menue-wrap"
        align="center"
         fit
        label="操作">
        <template slot-scope="scope">
            <el-button @click="moneyClick(scope.row)" type="text" size="small" class="money-btn">挂账还款</el-button>
            <span class="menue-split">｜</span>
            <el-button type="text" size="small" class="more-btn" @click="moreClick(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        :total="totalSize">
      </el-pagination>
    </div>
    <el-dialog
      title="挂账还款"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      v-if="dialogVisible"
      :close-on-click-modal="false"
    >
      <RePayment :rePaymentId="rePaymentId" :type="`creditRepaymentRecord`" @listReq="listReq"></RePayment>
    </el-dialog>
  </div>
</template>
<script>
import { groupAccountListReq } from "@/api/index";
import RePayment from "@/views/openAccount/rePayment"
const ipc = require("electron").ipcRenderer;
export default {
    data() {
    return {
       //顶部62  20 45 20  padding 15*2  = 177px 20px page 60
      tabHeight: 'calc(100vh - 177px - 20px - 60px)',
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      nameInput: '',
      tableData: [],
      // 弹窗
      dialogVisible:false,
      rePaymentId:''
    };
  },
components:{
    RePayment
  },
   mounted() {
    this.listReq()
  },

   methods: {

    /** 搜索 */
     searchClick() {
      this.listReq()
     },

    /** 重置 */
     againClick() {
      this.nameInput = ''
      this.listReq()
     },

      /** 当前页面  */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listReq()
    },
     
     /** 挂账还款 */
    moneyClick(rowData) {
      // var tempUrl = rowData.webUrl
      // ipc.send("accountNewPage", tempUrl);
      // 弹窗
      this.dialogVisible=true;
      this.rePaymentId=rowData.id
    },
   
   /** 查看明细 */
    moreClick(rowData) {
       this.$router.push({
          name: "openAccountEnterpriseDetail",
          query:{ kindType: 2, quaryId: rowData.id}
           });
    },

  /** 接口请求 */
    listReq() {
      console.log('书信')
      var tempSearchStr =  this.nameInput ? this.nameInput: ""
      var pagram = {
        phone: tempSearchStr,
        page:  this.currentPage,
        size:  this.pageSize
      }
       groupAccountListReq(pagram).then((res) => {
        this.tableData = []
        this.tableData = res.data.list
        this.totalSize = res.data.total
      
      })
      .catch((err) => {
        console.log(err);
      });
    },
      // 关闭弹窗
    handleClose(){
      this.dialogVisible=false;
    }
  },
 
};
</script>
<style lang="scss" scoped>

 ::v-deep .el-input__inner {
  height: 45px;
  border-radius: 6px 0px 0px 6px;
}

.big-wrap {
  //导航栏 padding 15 * 2
  height:  calc(100vh - 62px - 30px - 10px);
}

.top-wrap {
  display: flex;
  flex-direction: row;
  margin: 20px;
  align-items: center;
}


.input-style {
  width: 16%;
  background: #F5F5F5;
}

.search-btn {
  background: #009E69;
  color: #fff;
  height: 45px;
  font-size: 16px;
  border: 0px;
  border-radius: 0px 6px 6px 0px;
  margin-right: 20px;
}

.again-btn {
  background: #FAFFFD;
  border-radius: 6px;
  height: 45px;
  border: 1px solid #009E69;
  color: #009E69;
  font-size: 16px;
  border-radius: 6px;
}

.tab-wrap {
  width: calc(100% - 40px );
  margin: 0px 20px;
}

.dis-cover {
  width: 20px;
  height: 20px;
  background: red;
}

.money-btn {
  color: #F06543;
  font-size: 14px;
}

.more-btn {
  color: #009E69;
  font-size: 14px;
}

.menue-wrap {
  margin-left: 50px;
}

.menue-split {
  color: #D8D8D8;
}

.pagination {
  width: calc(100% - 20px);
  margin: 0 10px;
  padding: 0 20px;
  box-sizing: border-box;
  height: 80px;
  background: #fff;
  border-radius: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

</style>