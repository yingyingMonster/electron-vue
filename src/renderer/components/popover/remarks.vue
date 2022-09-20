<template>
  <div class="container">
    <div class="dialogTitle justifyS">
      <span
        >{{ this.dialogVal.type }}<i class="el-icon-minus"></i
        >{{ this.dialogVal.info? this.dialogVal.info.name:'整单备注' }}</span
      >
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="fixed-reason">
      <div class="reasonBox justify">
        <span
          v-for="(item, index) in fixedRemarks"
          :key="index"
          @click="checkRemark(index, item)"
          :class="remarksIndex == index ? 'active' : ''"
          >{{ item }}</span
        >
      </div>
    </div>

    <el-input
      type="textarea"
      class="reason"
      v-model="remarks"
      @input="remarksChange"
      placeholder="请输入自定义备注内容"
    ></el-input>

    <el-button type="darkGreen" class="confirmBtn" @click="confirm"
      >确认</el-button
    >
  </div>
</template>
<script>
import { getRemarks } from "@/api";
export default {
  props: ["dialogVal"],
  data() {
    return {
      remarks: "",
      remarksIndex: -1,
      fixedRemarks: [],
      // 备份数据
      listCopy: [],
      list: [],
    };
  },
  mounted() {
    console.log(this.dialogVal)
    this.listCopy = this._.cloneDeep(this.dialogVal.info);
    this.list = this._.cloneDeep(this.dialogVal.info);
    // 判断是单品备注还是批量备注
    if (this.dialogVal.info) {
      getRemarks(3)
        .then((res) => {
          this.fixedRemarks = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 设置单品备注回显
      this.remarks=this.dialogVal.info.remark
    } else {
      getRemarks(2)
        .then((res) => {
          this.fixedRemarks = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    // 选择事件
    checkRemark(index, item) {
      this.remarksIndex = index;
      this.remarks = item;
    },
    // 确定按钮
    confirm() {
      console.log(this.dialogVal.info)
      // 修改单品备注
      if (this.dialogVal.info) {
        this.listCopy.amount = null;
        this.$store.commit("delOrder", [this.listCopy]);
        this.list.remark = this.remarks;
        this.$store.commit("createOrder", this.list);
      } else {
        // 整单备注
       this.$emit('changRemak', this.remarks);
      }
      // 关闭弹窗
      this.$parent.closePopover();
    },
    // 备注input 修改
    remarksChange(e) {
      if (this.fixedRemarks[this.remarksIndex] != e) {
        this.remarksIndex = -1;
      }
    },
    // 关闭按钮
    close(){
      // 关闭弹窗
      this.$parent.closePopover();
    }
  },
};
</script>
<style lang="scss" scoped>
.remarksContent {
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
}
.dialogTitle {
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  i {
    cursor: pointer;
  }
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
  align-items: center;
  margin: 10px 0;
  span {
    display: inline-block;
    cursor: pointer;
    width: 31%;
    margin: 0 1%;
    background: #f5f5f5;
    color: #4f424c;
    border-radius: 10px;
    font-size: 12px;
    text-align: center;
    height: 35px;
    line-height: 35px;
  }
}
.confirmBtn {
  border-radius: 10px;
  position: absolute;
  left: 0;
  bottom: 10px;
  width: calc(100% - 20px);
  margin: 10px;
}
.active {
  background: #009e69 !important;
  color: #fff !important;
}
</style>