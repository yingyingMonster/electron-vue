<template>
  <div v-loading="loading">
    <div class="wrapper">
      <div class="item">
        <span class="item-tip">开班时间</span>
        <span class="item-content">{{ userInfo.startTime }}</span>
        <span class="item-tip top-margin">{{ userInfo.startDate }}</span>
      </div>

      <div class="item">
        <span class="item-tip">交班时间</span>
        <span class="item-content">{{ formatTime.split(" ")[1] }}</span>
        <span class="item-tip top-margin"
          >{{ formatTime.split(" ")[0] }}（今天）</span
        >
      </div>

      <div class="item">
        <span class="item-tip">交班人</span>
        <span class="item-content">{{ userInfo.userName }}</span>
        <span class="item-tip top-margin"></span>
      </div>

      <div class="item">
        <span class="item-tip">已结账订单</span>
        <span class="item-content">{{ userInfo.orderNums }}单</span>
        <span class="item-tip top-margin"
          >若开始交班，未制作订单不会计入本班次</span
        >
      </div>
    </div>
    <el-divider class="border"></el-divider>
    <div class="action">
      <el-button type="primary" class="btn" @click="handover"
        >开始交班</el-button
      >
      <el-button class="btn2" @click="record"
        >查看交班记录
        {{
          userInfo.noSubmitNums > 0
            ? `(${userInfo.noSubmitNums}个班次未交班)`
            : ""
        }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { handoverHome } from "@/api";
import { formatDate } from "@/utils/dateUtil";
// const ipc = require("electron").ipcRenderer;
export default {
  data() {
    return {
      loading: true,
      formatTime: "0 0",
      userInfo: {
        id: 0,
        noSubmitNums: 0,
        orderNums: 0,
        startDate: " ",
        startTime: " ",
        userName: " ",
      },
    };
  },
  methods: {
    handover() {
      this.$router.push({
        name: "handoverDetail",
        params: { id: this.userInfo.id, type: "handover" },
      });
    },
    record() {
      this.$router.push({
        name: "handoverRecord",
        params: { noSubmitNums: this.userInfo.noSubmitNums },
      });

      // let map2 = {
      //   url:
      //     process.env.NODE_ENV === "development"
      //       ? "http://localhost:9080/#/printHandover"
      //       : `file://${__dirname}/index.html#printHandover`,
      //   deviceName: "XP-80C",
      // };

      // ipc.send("printCore-print", map2);
    },
  },
  mounted() {
    var formatData = formatDate(new Date().getTime());
    this.formatTime = formatData;
    handoverHome().then((res) => {
      this.loading = false;
      if (res.data) {
        this.userInfo = res.data;
      }
    });
  },
};
</script>

<style scoped  >
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 70px;
}
</style>